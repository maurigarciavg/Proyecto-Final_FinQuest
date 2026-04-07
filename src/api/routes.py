"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Blueprint, jsonify, request
from flask_jwt_extended import (
    create_access_token,
    get_jwt_identity,
    jwt_required
)

from api.models import Order, Product, User, db
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
        raise APIException("Invalid token identity", status_code=401) from error

    user = db.session.get(User, user_id)
    if user is None:
        raise APIException("Authenticated user was not found", status_code=404)

    return user


def validate_credentials(payload, require_name=False):
    name = payload.get("name", "").strip()
    email = payload.get("email", "").strip().lower()
    password = payload.get("password", "")

    if require_name and len(name) < 2:
        raise APIException("Name must contain at least 2 characters", status_code=400)

    if "@" not in email:
        raise APIException("Please provide a valid email address", status_code=400)

    if len(password) < 6:
        raise APIException("Password must contain at least 6 characters", status_code=400)

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
        raise APIException("A user with this email already exists", status_code=409)

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
    products = Product.query.filter_by(is_active=True).order_by(Product.id.asc()).all()
    return jsonify({"products": [product.serialize() for product in products]}), 200


@api.route("/orders", methods=["GET"])
@jwt_required()
def get_orders():
    user = get_current_user()
    orders = Order.query.filter_by(user_id=user.id).order_by(Order.created_at.desc()).all()
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
        raise APIException("product_id and quantity must be valid integers", status_code=400) from error

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