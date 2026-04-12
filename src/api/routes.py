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

# --- FUNCIONES AUXILIARES ---

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
        raise APIException("Invalid token identity", status_code=401) from error
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
        raise APIException("Name must contain at least 2 characters", status_code=400)
    if "@" not in email:
        raise APIException("Please provide a valid email address", status_code=400)
    if len(password) < 6:
        raise APIException("Password must contain at least 6 characters", status_code=400)
    if role not in ["parent", "child"]:
        raise APIException("Role must be 'parent' or 'child'", status_code=400)
    if role == "parent":
        if not parentalPIN or not parentalPIN.isdigit() or len(parentalPIN) != 4:
            raise APIException("Parental PIN must be 4 digits for parents", status_code=400)
    return name, email, password, role, parentalPIN

def validate_login(payload):
    email = payload.get("email", "").strip().lower()
    password = payload.get("password", "")
    if "@" not in email:
        raise APIException("Please provide a valid email address", status_code=400)
    if len(password) < 6:
        raise APIException("Password must contain at least 6 characters", status_code=400)
    return email, password

# --- RUTAS DE AUTENTICACIÓN ---

@api.route("/sign-up", methods=["POST"])
@api.route("/signup", methods=["POST"])
def sign_up():
    data = get_json_payload()
    name, email, password, role, parentalPIN = validate_signup(data, require_name=True)
    existing_user = User.query.filter_by(email=email).one_or_none()
    if existing_user is not None:
        raise APIException("A user with this email already exists", status_code=409)
    new_user = User(email=email, name=name, role=role, parentalPIN=parentalPIN if role == "parent" else None, is_active=True)
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

@api.route("/me", methods=["GET"])
@jwt_required()
def me():
    user = get_current_user()
    return jsonify({"user": user.serialize()}), 200

# --- DASHBOARD DEL NIÑO (EL MOTOR PRINCIPAL) ---

@api.route("/child-dashboard/<int:child_id>", methods=["GET"])
def get_child_dashboard(child_id):
    child = db.session.get(Child, child_id)
    if child is None:
        raise APIException("Child not found", status_code=404)

    today = datetime.utcnow().date()

    # 1. Gestión de Racha (Streak)
    if child.last_login_date is None:
        child.streak = 1
    else:
        last = child.last_login_date.date()
        if last < today:
            if (today - last).days == 1:
                child.streak += 1
            else:
                child.streak = 1
    
    child.last_login_date = datetime.utcnow()

    # 2. Tareas: Reset diario y Filtrado por día actual
    tasks = Task.query.filter_by(child_id=child_id).all()
    dias_map = {0: "L", 1: "M", 2: "X", 3: "J", 4: "V", 5: "S", 6: "D"}
    hoy_letra = dias_map[datetime.utcnow().weekday()]

    tasks_hoy = []
    for task in tasks:
        # 🔄 RESET TOTAL: Si hoy es un nuevo día, la tarea vuelve a estar disponible (pending)
        # Solo respetamos el estado si es 'pending_validation' para que el padre no pierda 
        # el aviso de una tarea que el niño terminó anoche.
        if task.last_completed and task.last_completed.date() < today:
            if task.status != "pending_validation":
                task.status = "pending"
        
        # Filtro: Solo si la tarea está programada para el día de hoy (ej: "L" en "L,M,X")
        if hoy_letra in task.days:
            tasks_hoy.append(task.serialize())

    # 3. Cupones (Premios): Unificamos SmallGoal y Reward
    s_goals = SmallGoal.query.filter_by(child_id=child_id).all()
    rewards = Reward.query.filter_by(child_id=child_id).all()
    all_rewards = [sg.serialize() for sg in s_goals] + [r.serialize() for r in rewards]

    db.session.commit()

    return jsonify({
        "child": child.serialize(),
        "tasks": tasks_hoy,
        "rewards": all_rewards
    }), 200

# --- GESTIÓN DE TAREAS (FLUJO NIÑO -> PADRE) ---

@api.route("/tasks/<int:task_id>/complete", methods=["PATCH"])
def complete_task(task_id):
    task = db.session.get(Task, task_id)
    if not task:
        raise APIException("Task not found", status_code=404)

    # El niño la marca, pero pasa a "pendiente de validación"
    task.status = "pending_validation"
    task.last_completed = datetime.utcnow()
    db.session.commit()

    return jsonify({"message": "Tarea enviada a papá para aprobación", "task": task.serialize()}), 200

@api.route("/tasks/<int:task_id>/validate", methods=["PATCH"])
def validate_task(task_id):
    task = db.session.get(Task, task_id)
    if not task:
        raise APIException("Task not found", status_code=404)

    data = get_json_payload()
    approved = data.get("approved") # True o False desde el ParentAdmin

    child = db.session.get(Child, task.child_id)

    if approved:
        child.total_coins += task.coins
        task.status = "completed"
        # Actualizamos last_completed al momento de la aprobación para asegurar el reset mañana
        task.last_completed = datetime.utcnow()
        message = "Tarea aprobada, monedas sumadas"
    else:
        task.status = "pending"
        message = "Tarea rechazada, vuelve a la lista"

    db.session.commit()

    return jsonify({
        "message": message,
        "task": task.serialize(),
        "total_coins": child.total_coins
    }), 200

# --- CANJE DE PREMIOS ---

@api.route("/rewards/<int:reward_id>/redeem", methods=["POST"])
def redeem_reward(reward_id):
    # Buscamos en ambas tablas por si acaso
    reward = db.session.get(SmallGoal, reward_id) or db.session.get(Reward, reward_id)
    
    if not reward:
        raise APIException("Reward not found", status_code=404)

    child = db.session.get(Child, reward.child_id)
    cost = reward.coins if hasattr(reward, 'coins') else reward.cost

    if child.total_coins < cost:
        raise APIException("No tienes suficientes monedas", status_code=400)

    child.total_coins -= cost
    db.session.commit()

    return jsonify({
        "message": "¡Premio canjeado!",
        "coins_remaining": child.total_coins
    }), 200

# --- ENDPOINTS DEL WIZARD (CREACIÓN) ---

@api.route("/child/<int:current_user_id>", methods=["POST"])
def create_child(current_user_id):
    data = get_json_payload()
    new_child = Child(
        name=data.get("name"),
        age=data.get("age"),
        pin=data.get("pin"),
        avatar=data.get("avatar", "default_avatar.png"),
        parent_id=current_user_id
    )
    db.session.add(new_child)
    db.session.commit()
    return jsonify({"message": "Perfil creado", "child": new_child.serialize()}), 201

@api.route("/child/<int:child_id>/tasks", methods=["POST"])
def create_tasks(child_id):
    data = get_json_payload()
    for item in data:
        new_task = Task(
            name=item.get("name"),
            coins=int(item.get("coins", 0)),
            days=",".join(item.get("days", [])),
            status="pending",
            child_id=child_id
        )
        db.session.add(new_task)
    db.session.commit()
    return jsonify({"message": "Tareas asignadas"}), 201

@api.route("/child/<int:child_id>/small-goals", methods=["POST"])
def create_small_goals(child_id):
    data = get_json_payload()
    for goal_data in data:
        new_goal = SmallGoal(name=goal_data.get("name"), coins=goal_data.get("coins"), child_id=child_id)
        db.session.add(new_goal)
    db.session.commit()
    return jsonify({"message": "Cupones guardados"}), 201

@api.route("/child/<int:child_id>/grand-prize", methods=["POST"])
def create_grand_prize(child_id):
    data = get_json_payload()
    new_prize = GrandPrize(name=data.get("name"), coins=data.get("coins"), image_url=data.get("image_url", ""), child_id=child_id)
    db.session.add(new_prize)
    db.session.commit()
    return jsonify({"message": "¡Gran Premio configurado!"}), 201

# --- CONSULTAS DE PADRE ---

@api.route("/parent/<int:parent_id>/children", methods=["GET"])
def get_children(parent_id):
    children = Child.query.filter_by(parent_id=parent_id).all()
    return jsonify([child.serialize() for child in children]), 200

@api.route("/child/<int:child_id>/tasks", methods=["GET"])
def get_child_tasks(child_id):
    tasks = Task.query.filter_by(child_id=child_id).all()
    return jsonify([task.serialize() for task in tasks]), 200