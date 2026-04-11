"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from datetime import datetime
from flask import Blueprint, jsonify, request
from flask_jwt_extended import (
    create_access_token,
    get_jwt_identity,
    jwt_required
)
from api.utils import APIException
 
from api.models import Child, Reward, Task, User, db, SmallGoal, GrandPrize
 
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
 
 
def validate_signup(payload, require_name=False):
    name = payload.get("name", "").strip()
    email = payload.get("email", "").strip().lower()
    password = payload.get("password", "")
    parentalPIN = payload.get("parentalPIN", "").strip()
    role = payload.get("role", "parent").strip()
 
    if require_name and len(name) < 2:
        raise APIException(
            "Name must contain at least 2 characters", status_code=400)
 
    if "@" not in email:
        raise APIException(
            "Please provide a valid email address", status_code=400)
 
    if len(password) < 6:
        raise APIException(
            "Password must contain at least 6 characters", status_code=400)
 
    if role not in ["parent", "child"]:
        raise APIException("Role must be 'parent' or 'child'", status_code=400)
 
    if role == "parent":
        if not parentalPIN or not parentalPIN.isdigit() or len(parentalPIN) != 4:
            raise APIException(
                "Parental PIN must be 4 digits for parents", status_code=400)
 
    return name, email, password, role, parentalPIN
 
 
def validate_login(payload):
    email = payload.get("email", "").strip().lower()
    password = payload.get("password", "")
 
    if "@" not in email:
        raise APIException(
            "Please provide a valid email address", status_code=400)
 
    if len(password) < 6:
        raise APIException(
            "Password must contain at least 6 characters", status_code=400)
 
    return email, password
 
 
@api.route("/hello", methods=["GET"])
def handle_hello():
    return jsonify({
        "message": "JWT example API is running.",
        "available_endpoints": [
            "POST /api/sign-up",
            "POST /api/sign-in",
            "GET /api/me",
            "GET /api/profile",
            "PATCH /api/tasks/<id>/complete",
            "PATCH /api/tasks/<id>/validate",
        ]
    }), 200
 
 
@api.route("/sign-up", methods=["POST"])
@api.route("/signup", methods=["POST"])
def sign_up():
    data = get_json_payload()
    name, email, password, role, parentalPIN = validate_signup(
        data, require_name=True)
 
    existing_user = User.query.filter_by(email=email).one_or_none()
    if existing_user is not None:
        raise APIException(
            "A user with this email already exists", status_code=409)
 
    new_user = User(
        email=email,
        name=name,
        role=role,
        parentalPIN=parentalPIN if role == "parent" else None,
        is_active=True
    )
    new_user.set_password(password)
 
    db.session.add(new_user)
    db.session.commit()
 
    return build_auth_response(new_user, 201, "User created successfully")
 
 
@api.route("/sign-in", methods=["POST"])
@api.route("/signin", methods=["POST"])
@api.route("/token", methods=["POST"])
def sign_in():
    data = get_json_payload()
    email, password = validate_login(data)
 
    user = User.query.filter_by(email=email).one_or_none()
    if user is None or not user.check_password(password):
        raise APIException("Wrong email or password", status_code=401)
 
    return build_auth_response(user, 200, "Sign in successful")
 
 
@api.route("/profile", methods=["GET"])
@api.route("/me", methods=["GET"])
@jwt_required()
def me():
    user = get_current_user()
    return jsonify({"user": user.serialize()}), 200
 
 
@api.route("/child-dashboard/<int:child_id>", methods=["GET"])
def get_child_dashboard(child_id):
    child = db.session.get(Child, child_id)
    if child is None:
        raise APIException("Child not found", status_code=404)
 
    today = datetime.utcnow().date()
 
    if child.last_login_date is None:
        child.streak = 1
    else:
        last = child.last_login_date.date()
        if last == today:
            pass
        elif (today - last).days == 1:
            child.streak += 1
        else:
            child.streak = 1
 
    child.last_login_date = datetime.utcnow()
    db.session.commit()
 
    tasks = Task.query.filter_by(child_id=child_id).all()
    rewards = Reward.query.filter_by(child_id=child_id).all()
 
    return jsonify({
        "child": child.serialize(),
        "tasks": [task.serialize() for task in tasks],
        "rewards": [reward.serialize() for reward in rewards]
    }), 200
 
 
# ==========================================
# ✅ ÉPICA: Marcar tarea como completada
# El niño pulsa el botón → status pasa a "pending_validation"
# NO se suman monedas todavía
# ==========================================
@api.route("/tasks/<int:task_id>/complete", methods=["PATCH"])
def complete_task(task_id):
    task = db.session.get(Task, task_id)
    if task is None:
        raise APIException("Task not found", status_code=404)
 
    if task.status != "pending":
        raise APIException(
            f"Task cannot be completed from status '{task.status}'",
            status_code=400
        )
 
    task.status = "pending_validation"
    db.session.commit()
 
    return jsonify({
        "message": "Task marked as complete, waiting for parent validation",
        "task": task.serialize()
    }), 200
 
 
# ==========================================
# ✅ ÉPICA: El padre aprueba o rechaza la tarea
# Body: { "approved": true } o { "approved": false }
# Si aprueba → suma monedas + status "completed"
# Si rechaza → vuelve a "pending"
# ==========================================
@api.route("/tasks/<int:task_id>/validate", methods=["PATCH"])
def validate_task(task_id):
    task = db.session.get(Task, task_id)
    if task is None:
        raise APIException("Task not found", status_code=404)
 
    if task.status != "pending_validation":
        raise APIException(
            f"Task is not waiting for validation (current status: '{task.status}')",
            status_code=400
        )
 
    data = get_json_payload()
    approved = data.get("approved")
 
    if approved is None:
        raise APIException("Missing 'approved' field (true/false)", status_code=400)
 
    child = db.session.get(Child, task.child_id)
 
    if approved:
        child.total_coins += task.coins
        task.status = "completed"
        message = "Task approved, coins added"
    else:
        task.status = "pending"
        message = "Task rejected, returned to pending"
 
    db.session.commit()
 
    return jsonify({
        "message": message,
        "task": task.serialize(),
        "total_coins": child.total_coins
    }), 200
 
 
@api.route("/rewards/<int:reward_id>/redeem", methods=["POST"])
def redeem_reward(reward_id):
    reward = db.session.get(Reward, reward_id)
    if reward is None:
        raise APIException("Reward not found", status_code=404)
 
    child = db.session.get(Child, reward.child_id)
    if child.total_coins < reward.cost:
        raise APIException("Not enough coins", status_code=400)
 
    child.total_coins -= reward.cost
    db.session.commit()
 
    return jsonify({
        "message": "Reward redeemed successfully",
        "coins_remaining": child.total_coins,
        "reward": reward.serialize()
    }), 200
 
 
# ENDPOINTS PARA GESTIÓN DE PERFILES INFANTILES
 
@api.route("/child/<int:current_user_id>", methods=["POST"])
def create_child(current_user_id):
    data = request.get_json()
    name = data.get("name")
    age = data.get("age")
    pin = data.get("pin")
 
    if not all([name, age, pin]):
        return jsonify({"message": "Nombre, edad y PIN son obligatorios"}), 400
 
    new_child = Child(
        name=name,
        age=age,
        pin=pin,
        avatar=data.get("avatar", "default_avatar.png"),
        parent_id=current_user_id
    )
 
    db.session.add(new_child)
    db.session.commit()
    return jsonify({"message": "Perfil creado", "child": new_child.serialize()}), 201
 
 
@api.route("/child/<int:child_id>/tasks", methods=["POST"])
def create_tasks(child_id):
    data = request.get_json()
    if not isinstance(data, list):
        return jsonify({"message": "Formato de lista requerido"}), 400
 
    for item in data:
        new_task = Task(
            name=item.get("name"),
            coins=max(0, int(item.get("coins", 0))),
            days=item.get("days", ""),
            status="pending",  # siempre empieza en pending
            child_id=child_id
        )
        db.session.add(new_task)
 
    db.session.commit()
    return jsonify({"message": f"{len(data)} tareas asignadas correctamente"}), 201
 
 
@api.route("/child/<int:child_id>/small-goals", methods=["POST"])
def create_small_goals(child_id):
    data = request.get_json()
 
    if not isinstance(data, list):
        return jsonify({"message": "Se esperaba una lista de premios"}), 400
 
    for goal_data in data:
        new_goal = SmallGoal(
            name=goal_data.get("name"),
            coins=goal_data.get("coins"),
            child_id=child_id
        )
        db.session.add(new_goal)
 
    db.session.commit()
    return jsonify({"message": "Premios pequeños guardados"}), 201
 
 
@api.route("/child/<int:child_id>/grand-prize", methods=["POST"])
def create_grand_prize(child_id):
    data = request.get_json()
 
    new_prize = GrandPrize(
        name=data.get("name"),
        coins=data.get("coins"),
        image_url=data.get("image_url", ""),
        child_id=child_id
    )
 
    db.session.add(new_prize)
    db.session.commit()
    return jsonify({"message": "¡Gran Premio configurado!"}), 201
 
 
@api.route("/child/<int:child_id>/tasks", methods=["GET"])
def get_child_tasks(child_id):
    tasks = Task.query.filter_by(child_id=child_id).all()
    results = [task.serialize() for task in tasks]
    return jsonify(results), 200
 
 
@api.route("/parent/<int:parent_id>/children", methods=["GET"])
def get_children(parent_id):
    children = Child.query.filter_by(parent_id=parent_id).all()
    results = [child.serialize() for child in children]
    return jsonify(results), 200
