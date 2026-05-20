import os
from datetime import datetime, timezone, timedelta
from flask import Blueprint, jsonify, request
from flask_jwt_extended import (
    create_access_token,
    get_jwt_identity,
    jwt_required
)
from api.utils import APIException
from api.models import Child, Reward, Task, User, db, SmallGoal, GrandPrize
from itsdangerous import URLSafeTimedSerializer
from flask_mail import Message
from extension import mail
from werkzeug.security import generate_password_hash

url_front = os.getenv('VITE_FRONT_URL')
api = Blueprint("api", __name__)


def get_json_payload():
    return request.get_json(silent=True) or {}


def build_auth_response(user, status_code, message):
    access_token = create_access_token(identity=str(user.id))
    return jsonify({
        "message": message,
        "access_token": access_token,
        "user": user.serialize()
    }), status_code


def get_current_user():
    identity = get_jwt_identity()
    if identity is None:
        raise APIException("Missing user identity in token", status_code=401)
    try:
        user_id = int(identity)
    except (TypeError, ValueError) as error:
        raise APIException("Invalid token identity",
                           status_code=401) from error
    user = db.session.get(User, user_id)
    if user is None:
        raise APIException("Authenticated user was not found", status_code=404)
    return user


@api.route("/signup", methods=["POST"])
@api.route("/sign-up", methods=["POST"])
def sign_up():
    data = get_json_payload()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    name = data.get("name", "").strip()
    parentalPIN = data.get("parentalPIN", "")

    existing_user = User.query.filter_by(email=email).one_or_none()
    if existing_user:
        raise APIException("User already exists", status_code=409)

    new_user = User(email=email, name=name, role="parent",
                    parentalPIN=parentalPIN, avatar=data.get("avatar"), is_active=True)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()
    return build_auth_response(new_user, 201, "User created")


@api.route("/sign-in", methods=["POST"])
@api.route("/signin", methods=["POST"])
def sign_in():
    data = get_json_payload()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    user = User.query.filter_by(email=email).one_or_none()
    if user is None or not user.check_password(password):
        raise APIException("Wrong email or password", status_code=401)
    return build_auth_response(user, 200, "Sign in successful")


@api.route("/me", methods=["GET", "PATCH"])
@jwt_required()
def me():
    user = get_current_user()
    if request.method == "PATCH":
        data = get_json_payload()
        email = data.get("email", "").strip().lower()
        if email and email != user.email:
            existing_user = User.query.filter_by(email=email).one_or_none()
            if existing_user:
                raise APIException("El email ya está en uso", status_code=409)
            user.email = email
        user.name = data.get("name", user.name).strip() or user.name
        if "avatar" in data:
            user.avatar = data.get("avatar")
        if "parentalPIN" in data:
            user.parentalPIN = data.get("parentalPIN") or user.parentalPIN
        db.session.commit()
        return jsonify({"user": user.serialize()}), 200

    return jsonify({"user": user.serialize()}), 200


@api.route("/me/password", methods=["PATCH"])
@jwt_required()
def change_password():
    user = get_current_user()
    data = get_json_payload()
    current_password = data.get("current_password", "")
    new_password = data.get("new_password", "")

    if not user.check_password(current_password):
        raise APIException("Contraseña actual incorrecta", status_code=401)
    if len(new_password) < 6:
        raise APIException("La nueva contraseña debe tener al menos 6 caracteres", status_code=400)

    user.set_password(new_password)
    db.session.commit()
    return jsonify({"message": "Contraseña actualizada"}), 200


@api.route("/parent/<int:parent_id>/child", methods=["POST"])
@jwt_required()
def create_child(parent_id):
    data = get_json_payload()

    new_child = Child(
        name=data.get("name"),
        age=data.get("age"),
        pin=data.get("pin"),
        avatar=data.get("avatar", "default_avatar.png"),
        parent_id=parent_id,
        total_coins=0,
        total_earned_coins=0
    )

    db.session.add(new_child)
    db.session.commit()

    return jsonify(new_child.serialize()), 201


@api.route("/child-dashboard/<int:child_id>", methods=["GET"])
def get_child_dashboard(child_id):
    child = db.session.get(Child, child_id)
    if not child:
        raise APIException("Child not found", status_code=404)

    today = datetime.now(timezone.utc).date()
    streak_reward_given = False

    if child.last_login_date is None:
        child.streak = 1
        child.total_coins += 10
        child.total_earned_coins += 10
        streak_reward_given = True
    else:
        last = child.last_login_date.date()
        if last < today:
            if (today - last).days == 1:
                child.streak += 1
            else:
                child.streak = 1
            child.total_coins += 10
            child.total_earned_coins += 10
            streak_reward_given = True

    child.last_login_date = datetime.now(timezone.utc)

    tasks = Task.query.filter_by(child_id=child_id).all()
    dias_map = {0: "L", 1: "M", 2: "X", 3: "J", 4: "V", 5: "S", 6: "D"}
    hoy_letra = dias_map[datetime.now(timezone.utc).weekday()]

    all_serialized_tasks = []
    for t in tasks:
        if t.last_completed and t.last_completed.date() < today:
            if t.status != "pending_validation":
                t.status = "pending"

        task_data = t.serialize()
        task_data["is_today"] = hoy_letra in (t.days or "")
        all_serialized_tasks.append(task_data)

    s_goals = SmallGoal.query.filter_by(child_id=child_id).all()
    db.session.commit()

    return jsonify({
        "child": child.serialize(),
        "tasks": all_serialized_tasks,
        "rewards": [sg.serialize() for sg in s_goals],
        "streak_reward_given": streak_reward_given,
        "streak_reward_amount": 10
    }), 200


@api.route("/tasks/<int:task_id>", methods=["DELETE", "PATCH"])
def handle_single_task(task_id):
    task = db.session.get(Task, task_id)
    if not task:
        return jsonify({"msg": "Not found"}), 404

    if request.method == "DELETE":
        db.session.delete(task)
        db.session.commit()
        return jsonify({"msg": "Deleted"}), 200

    if request.method == "PATCH":
        data = get_json_payload()
        task.name = data.get("name", task.name)
        task.coins = data.get("coins", task.coins)
        if "days" in data:
            days_data = data.get("days")
            task.days = ",".join(days_data) if isinstance(
                days_data, list) else days_data
        db.session.commit()
        return jsonify(task.serialize()), 200


@api.route("/child/<int:child_id>", methods=["GET", "PATCH", "DELETE"])
@jwt_required()
def handle_child_profile(child_id):
    child = db.session.get(Child, child_id)
    if not child:
        raise APIException("Child not found", status_code=404)

    current_user = get_current_user()
    if child.parent_id != current_user.id:
        raise APIException("No autorizado para modificar este niño", status_code=401)

    if request.method == "GET":
        return jsonify({"child": child.serialize()}), 200

    if request.method == "DELETE":
        db.session.delete(child)
        db.session.commit()
        return jsonify({"message": "Niño eliminado"}), 200

    data = get_json_payload()
    if "avatar" in data:
        child.avatar = data.get("avatar")
    if "age" in data:
        try:
            child.age = int(data.get("age", child.age))
        except (TypeError, ValueError):
            pass
    db.session.commit()
    return jsonify({"child": child.serialize()}), 200


@api.route("/child/<int:child_id>/tasks", methods=["POST"])
@jwt_required()
def create_tasks(child_id):
    data = get_json_payload()
    for item in data:
        days_data = item.get("days", [])
        days_string = ",".join(days_data) if isinstance(
            days_data, list) else days_data
        new_task = Task(name=item.get("name"), coins=int(
            item.get("coins", 0)), days=days_string, child_id=child_id)
        db.session.add(new_task)
    db.session.commit()
    return jsonify({"msg": "Tasks created"}), 201


@api.route("/tasks/<int:task_id>/validate", methods=["PATCH"])
def validate_task(task_id):
    task = db.session.get(Task, task_id)
    if not task:
        raise APIException("Task not found", status_code=404)
    data = get_json_payload()
    child = db.session.get(Child, task.child_id)

    if data.get("child_done"):
        task.status = "pending_validation"
    elif data.get("approved"):
        child.total_coins += task.coins
        child.total_earned_coins += task.coins
        task.status = "completed"
        task.last_completed = datetime.now(timezone.utc)
    else:
        task.status = "rejected"

    db.session.commit()
    return jsonify({
        "total_coins": child.total_coins,
        "total_earned_coins": child.total_earned_coins,
        "task_status": task.status
    }), 200


@api.route("/tasks/<int:task_id>/rollback", methods=["PATCH"])
def rollback_task(task_id):
    task = db.session.get(Task, task_id)
    if not task:
        raise APIException("Task not found", status_code=404)
    child = db.session.get(Child, task.child_id)

    if task.status == "completed":
        child.total_coins = max(0, child.total_coins - task.coins)
        child.total_earned_coins = max(
            0, child.total_earned_coins - task.coins)

    task.status = "pending"
    task.last_completed = None
    db.session.commit()
    return jsonify({"msg": "Rollback successful", "total_coins": child.total_coins}), 200


@api.route("/child/<int:child_id>/small-goals", methods=["POST"])
@jwt_required()
def create_small_goals(child_id):
    data = get_json_payload()
    for goal_data in data:
        new_goal = SmallGoal(name=goal_data.get(
            "name"), coins=goal_data.get("coins"), child_id=child_id)
        db.session.add(new_goal)
    db.session.commit()
    return jsonify({"msg": "Goals created"}), 201


@api.route("/small-goals/<int:goal_id>", methods=["DELETE", "PATCH"])
def handle_single_coupon(goal_id):
    goal = db.session.get(SmallGoal, goal_id)
    if not goal:
        return jsonify({"msg": "Cupón no encontrado"}), 404

    if request.method == "DELETE":
        db.session.delete(goal)
        db.session.commit()
        return jsonify({"msg": "Cupón eliminado"}), 200

    if request.method == "PATCH":
        data = get_json_payload()
        goal.name = data.get("name", goal.name)
        goal.coins = data.get("coins", goal.coins)
        db.session.commit()
        return jsonify(goal.serialize()), 200


@api.route("/rewards/<int:reward_id>/redeem", methods=["POST"])
def redeem_small_goal(reward_id):
    goal = db.session.get(SmallGoal, reward_id)
    if not goal:
        return jsonify({"msg": "Cupón no encontrado"}), 404
    child = db.session.get(Child, goal.child_id)
    if child.total_coins < goal.coins:
        return jsonify({"msg": "Monedas insuficientes"}), 400
    if goal.status != "available":
        return jsonify({"msg": "Cupón ya solicitado o aprobado"}), 400
    goal.status = "pending"
    db.session.commit()
    return jsonify({"msg": "Cupón solicitado", "status": "pending"}), 200


@api.route("/rewards/<int:reward_id>/approve", methods=["PATCH"])
def approve_small_goal(reward_id):
    goal = db.session.get(SmallGoal, reward_id)
    if not goal:
        return jsonify({"msg": "Cupón no encontrado"}), 404
    child = db.session.get(Child, goal.child_id)
    if child.total_coins < goal.coins:
        return jsonify({"msg": "Monedas insuficientes"}), 400
    child.total_coins -= goal.coins
    goal.status = "approved"
    db.session.commit()
    return jsonify({"msg": "Cupón aprobado", "new_coins": child.total_coins}), 200


@api.route("/rewards/<int:reward_id>/rollback", methods=["PATCH"])
def rollback_small_goal(reward_id):
    goal = db.session.get(SmallGoal, reward_id)
    if not goal:
        return jsonify({"msg": "Cupón no encontrado"}), 404
    goal.status = "available"
    db.session.commit()
    return jsonify({"msg": "Cupón restaurado"}), 200


@api.route("/child/<int:child_id>/grand-prize", methods=["POST"])
@jwt_required()
def create_grand_prize(child_id):
    data = get_json_payload()
    GrandPrize.query.filter_by(child_id=child_id).delete()
    new_prize = GrandPrize(
        name=data.get("name"),
        coins=int(data.get("coins", 0)),
        image_url=data.get("image_url", ""),
        child_id=child_id
    )
    db.session.add(new_prize)
    db.session.commit()
    return jsonify({"msg": "Grand Prize created"}), 201


@api.route("/grand-prize/<int:prize_id>", methods=["DELETE", "PATCH"])
def handle_single_grand_prize(prize_id):
    prize = db.session.get(GrandPrize, prize_id)
    if not prize:
        return jsonify({"msg": "Premio no encontrado"}), 404

    if request.method == "DELETE":
        db.session.delete(prize)
        db.session.commit()
        return jsonify({"msg": "Gran Premio eliminado"}), 200

    if request.method == "PATCH":
        data = get_json_payload()
        prize.name = data.get("name", prize.name)
        prize.coins = data.get("coins", prize.coins)
        prize.image_url = data.get("image_url", prize.image_url)
        db.session.commit()
        return jsonify(prize.serialize()), 200


@api.route("/grand-prize/<int:prize_id>/redeem", methods=["POST"])
def redeem_grand_prize(prize_id):
    prize = db.session.get(GrandPrize, prize_id)
    if not prize:
        return jsonify({"msg": "Premio no encontrado"}), 404

    child = db.session.get(Child, prize.child_id)
    if child.total_coins < prize.coins:
        return jsonify({"msg": "Monedas insuficientes"}), 400

    child.total_coins -= prize.coins
    prize.redeemed = True
    db.session.commit()

    return jsonify({
        "msg": "¡Gran Premio canjeado!",
        "new_coins": child.total_coins,
        "prize_status": "redeemed"
    }), 200


@api.route("/child/<int:child_id>/add-coins", methods=["POST"])
@jwt_required()
def add_minigame_coins(child_id):
    child = db.session.get(Child, child_id)
    if not child:
        raise APIException("Child not found", status_code=404)
    data = get_json_payload()
    points = int(data.get("coins", 0))
    if points > 0:
        child.total_coins += points
        child.total_earned_coins += points
        child.last_minigame_played_at = datetime.now(timezone.utc)
        db.session.commit()
    return jsonify({"total_coins": child.total_coins, "total_earned_coins": child.total_earned_coins}), 200


@api.route("/parent/<int:parent_id>/children", methods=["GET"])
@jwt_required()
def get_children(parent_id):
    current_user = get_current_user()
    if current_user.id != parent_id:
        raise APIException("No autorizado", status_code=401)
    children = Child.query.filter_by(parent_id=parent_id).all()
    return jsonify([child.serialize() for child in children]), 200


@api.route("/reset_password", methods=["POST"])
def reset_password():
    data = get_json_payload()
    serializer = URLSafeTimedSerializer(os.getenv('GENERATE_TOKEN'))
    email = serializer.loads(
        data["token"], salt="password-reset", max_age=3600)
    user = User.query.filter_by(email=email).first()
    user.password = generate_password_hash(data["password"])
    db.session.commit()
    return jsonify({"msg": "Contraseña actualizada"}), 200