from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from werkzeug.security import check_password_hash, generate_password_hash

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = "user"
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    role: Mapped[str] = mapped_column(String(20), nullable=False, default="parent")
    parentalPIN: Mapped[str] = mapped_column(String(4), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False, default=True)

    # Relación con Child
    children: Mapped[list["Child"]] = relationship(back_populates="parent", cascade="all, delete-orphan")

    def set_password(self, password: str) -> None:
        self.password = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password, password)

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "name": self.name,
            "role": self.role,
            "parentalPIN": self.parentalPIN,
            "is_active": self.is_active,
            "children": [child.serialize() for child in self.children] if self.children else []
        }

class Child(db.Model):
    __tablename__ = "child"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    age: Mapped[int] = mapped_column(Integer, nullable=False)
    pin: Mapped[str] = mapped_column(String(4), nullable=False)
    avatar: Mapped[str] = mapped_column(String(255), nullable=True)
    total_coins: Mapped[int] = mapped_column(Integer, default=0)
    streak: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    last_login_date: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    parent_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)

    parent: Mapped["User"] = relationship(back_populates="children")
    
    # Cascade asegura que si borras un niño, se borren sus tareas y premios
    tasks: Mapped[list["Task"]] = relationship(back_populates="child", cascade="all, delete-orphan")
    small_goals: Mapped[list["SmallGoal"]] = relationship(back_populates="child", cascade="all, delete-orphan")
    grand_prize: Mapped["GrandPrize"] = relationship(back_populates="child", cascade="all, delete-orphan", uselist=False)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "age": self.age,
            "pin": self.pin,
            "avatar": self.avatar,
            "total_coins": self.total_coins,
            "streak": self.streak,
            "parent_id": self.parent_id,
            # Añadimos SmallGoals y GrandPrize al serialize para que el padre lo vea en el panel
            "small_goals": [goal.serialize() for goal in self.small_goals] if self.small_goals else [],
            "grand_prize": self.grand_prize.serialize() if self.grand_prize else None
        }

class Task(db.Model):
    __tablename__ = "task"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    coins: Mapped[int] = mapped_column(Integer, nullable=False)
    days: Mapped[str] = mapped_column(String(100), nullable=False) 
    status: Mapped[str] = mapped_column(String(50), default="pending") 
    last_completed: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    child_id: Mapped[int] = mapped_column(ForeignKey("child.id"), nullable=False)
    
    child: Mapped["Child"] = relationship(back_populates="tasks")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "coins": self.coins,
            "days": self.days.split(",") if self.days else [],
            "status": self.status,
            "last_completed": self.last_completed.isoformat() if self.last_completed else None,
            "child_id": self.child_id
        }

class SmallGoal(db.Model):
    __tablename__ = "small_goal"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    coins: Mapped[int] = mapped_column(Integer, nullable=False)
    child_id: Mapped[int] = mapped_column(ForeignKey("child.id"), nullable=False)
    
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
    child_id: Mapped[int] = mapped_column(ForeignKey("child.id"), nullable=False)
    
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
    """
    Nota: Tienes SmallGoal y Reward. 
    Si Reward son los cupones canjeables, esta tabla es correcta.
    """
    __tablename__ = "reward"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    cost: Mapped[int] = mapped_column(Integer, nullable=False)
    child_id: Mapped[int] = mapped_column(ForeignKey("child.id"), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "cost": self.cost,
            "child_id": self.child_id
        }