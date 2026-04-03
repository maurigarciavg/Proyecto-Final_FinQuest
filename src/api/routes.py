"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Blueprint, jsonify, request
from flask_jwt_extended import (
    create_access_token,
    get_jwt_identity,
    jwt_required
)

from api.models import Order, Product, User, db, Child, Task, SmallGoal, GrandPrize
from api.utils import APIException


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


def validate_credentials(payload, require_name=False):
    name = payload.get("name", "").strip()
    email = payload.get("email", "").strip().lower()
    password = payload.get("password", "")

    if require_name and len(name) < 2:
        raise APIException(
            "Name must contain at least 2 characters", status_code=400)

    if "@" not in email:
        raise APIException(
            "Please provide a valid email address", status_code=400)

    if len(password) < 6:
        raise APIException(
            "Password must contain at least 6 characters", status_code=400)

    return name, email, password


@api.route("/hello", methods=["GET"])
def handle_hello():
    return jsonify({
        "message": "JWT example API is running.",
        "available_endpoints": [
            "POST /api/sign-up",
            "POST /api/sign-in",
            "GET /api/me",
            "GET /api/profile",
            "GET /api/products",
            "GET /api/orders",
            "POST /api/orders"
        ]
    }), 200


@api.route("/sign-up", methods=["POST"])
@api.route("/signup", methods=["POST"])
def sign_up():
    data = get_json_payload()
    name, email, password = validate_credentials(data, require_name=True)

    existing_user = User.query.filter_by(email=email).one_or_none()
    if existing_user is not None:
        raise APIException(
            "A user with this email already exists", status_code=409)

    new_user = User(
        email=email,
        name=name,
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
    _, email, password = validate_credentials(data)

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


@api.route("/products", methods=["GET"])
def get_products():
    products = Product.query.filter_by(
        is_active=True).order_by(Product.id.asc()).all()
    return jsonify({"products": [product.serialize() for product in products]}), 200


@api.route("/orders", methods=["GET"])
@jwt_required()
def get_orders():
    user = get_current_user()
    orders = Order.query.filter_by(user_id=user.id).order_by(
        Order.created_at.desc()).all()
    return jsonify({
        "orders": [order.serialize() for order in orders],
        "user": user.serialize()
    }), 200


@api.route("/orders", methods=["POST"])
@jwt_required()
def create_order():
    user = get_current_user()
    data = get_json_payload()

    product_id = data.get("product_id")

    if not product_id:
        raise APIException("product_id is required", status_code=400)

    try:
        quantity = int(data.get("quantity", 1))
        parsed_product_id = int(product_id)
    except (TypeError, ValueError) as error:
        raise APIException(
            "product_id and quantity must be valid integers", status_code=400) from error

    if quantity < 1:
        raise APIException("Quantity must be at least 1", status_code=400)

    product = db.session.get(Product, parsed_product_id)
    if product is None or not product.is_active:
        raise APIException("Product not found", status_code=404)

    order = Order(
        user_id=user.id,
        product_id=product.id,
        quantity=quantity,
        status="paid",
        unit_price=product.price
    )

    db.session.add(order)
    db.session.commit()
    db.session.refresh(order)

    return jsonify({
        "message": "Order created successfully",
        "order": order.serialize()
    }), 201

# ==========================================
# ENDPOINTS PARA GESTIÓN DE PERFILES INFANTILES
# ==========================================

# NOTA: Se ha comentado @jwt_required temporalmente para pruebas sin Login completo.


@api.route("/child", methods=["POST"])
# @jwt_required()
def create_child():
    """Crea un nuevo perfil de hijo vinculado a un usuario (ID 1 por defecto para pruebas)"""
    data = request.get_json()

    # Mientras no haya token, forzamos el ID del primer usuario creado
    current_user_id = 1

    name = data.get("name")
    age = data.get("age")
    pin = data.get("pin")

    if not name or not age or not pin:
        return jsonify({"message": "Faltan datos obligatorios"}), 400

    new_child = Child(
        name=name,
        age=age,
        pin=pin,
        avatar=data.get("avatar", "default_avatar.png"),
        parent_id=current_user_id
    )

    db.session.add(new_child)
    db.session.commit()

    return jsonify({
        "message": "¡Perfil de hijo creado!",
        "child": new_child.serialize()
    }), 201


@api.route("/child/<int:child_id>/tasks", methods=["POST"])
# @jwt_required()
def create_tasks(child_id):
    """Recibe una lista de tareas y las asigna a un hijo específico"""
    data = request.get_json()

    if not isinstance(data, list):
        return jsonify({"message": "Se esperaba una lista de tareas"}), 400

    for task_data in data:
        new_task = Task(
            name=task_data.get("name"),
            coins=task_data.get("coins"),
            days=task_data.get("days"),
            child_id=child_id
        )
        db.session.add(new_task)

    db.session.commit()
    return jsonify({"message": f"¡{len(data)} tareas creadas para el hijo {child_id}!"}), 201


@api.route("/child/<int:child_id>/small-goals", methods=["POST"])
# @jwt_required()
def create_small_goals(child_id):
    """Asigna una lista de premios intermedios a un hijo"""
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
# @jwt_required()
def create_grand_prize(child_id):
    """Configura el premio final para un hijo"""
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
