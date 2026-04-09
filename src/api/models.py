from datetime import datetime
from decimal import Decimal

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from werkzeug.security import check_password_hash, generate_password_hash


db = SQLAlchemy()


class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    role: Mapped[str] = mapped_column(
        String(20), nullable=False, default="parent")  # nuevo
    parentalPIN: Mapped[str] = mapped_column(String(4), nullable=True)  # nuevo
    is_active: Mapped[bool] = mapped_column(
        Boolean(), nullable=False, default=True)

    def set_password(self, password: str) -> None:
        self.password = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password, password)

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "name": self.name,
            "role": self.role,               # agregamos role al serializar
            "parentalPIN": self.parentalPIN,  # opcional
            "is_active": self.is_active
        }

# ==========================================
# 🆕 MODELOS FINQUEST (SERIALIZADOS)
# ==========================================


class Child(db.Model):
    __tablename__ = "child"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    age: Mapped[int] = mapped_column(db.Integer, nullable=False)
    pin: Mapped[str] = mapped_column(String(4), nullable=False)
    avatar: Mapped[str] = mapped_column(String(255), nullable=True)
    total_coins: Mapped[int] = mapped_column(Integer, default=0)
    streak: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    last_login_date: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    parent_id: Mapped[int] = mapped_column(
        ForeignKey("user.id"), nullable=False)

    tasks: Mapped[list["Task"]] = relationship(
        back_populates="child", cascade="all, delete-orphan")
    small_goals: Mapped[list["SmallGoal"]] = relationship(
        back_populates="child", cascade="all, delete-orphan")
    grand_prize: Mapped["GrandPrize"] = relationship(
        back_populates="child", cascade="all, delete-orphan")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "age": self.age,
            "avatar": self.avatar,
            "total_coins": self.total_coins,
            "parent_id": self.parent_id,
            "streak": self.streak,
        }


class Task(db.Model):
    __tablename__ = "task"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    coins: Mapped[int] = mapped_column(Integer, nullable=False)
    days: Mapped[str] = mapped_column(
        String(100), nullable=False)  # Guardado como "L,M,X"
    child_id: Mapped[int] = mapped_column(
        ForeignKey("child.id"), nullable=False)
    child: Mapped["Child"] = relationship(back_populates="tasks")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "coins": self.coins,
            "days": self.days.split(",") if self.days else [],
            "child_id": self.child_id
        }


class SmallGoal(db.Model):
    __tablename__ = "small_goal"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    coins: Mapped[int] = mapped_column(Integer, nullable=False)
    child_id: Mapped[int] = mapped_column(
        ForeignKey("child.id"), nullable=False)
    child: Mapped["Child"] = relationship(back_populates="small_goals")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "coins": self.coins,
            "child_id": self.child_id
        }


class GrandPrize(db.Model):
    __tablename__ = "grand_prize"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    coins: Mapped[int] = mapped_column(Integer, nullable=False)
    image_url: Mapped[str] = mapped_column(String(255), nullable=True)
    child_id: Mapped[int] = mapped_column(
        ForeignKey("child.id"), nullable=False)
    child: Mapped["Child"] = relationship(back_populates="grand_prize")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "coins": self.coins,
            "image_url": self.image_url,
            "child_id": self.child_id
        }


class Reward(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    cost: Mapped[int] = mapped_column(Integer, nullable=False)
    child_id: Mapped[int] = mapped_column(
        ForeignKey("child.id"), nullable=False)

    def serialize(self):
        return {
            "cost": self.cost,
            "child_id": self.child_id

        }
