from decimal import Decimal

import click

from api.models import User, db

"""
In this file, you can add as many commands as you want using the @app.cli.command decorator
Flask commands are usefull to run cronjobs or tasks outside of the API but sill in integration
with youy database, for example: Import the price of bitcoin every night as 12am
"""


def seed_user(name, email, password):
    user = User(name=name, email=email, is_active=True)
    user.set_password(password)
    db.session.add(user)
    db.session.flush()
    return user



def setup_commands(app):

    """
    This is an example command "insert-test-users" that you can run from the command line
    by typing: $ flask insert-test-users 5
    Note: 5 is the number of users to add
    """
    @app.cli.command("insert-test-users")
    @click.argument("count")
    def insert_test_users(count):
        print("Creating test users")
        for x in range(1, int(count) + 1):
            user = User()
            user.email = "test_user" + str(x) + "@test.com"
            user.name = "Test User " + str(x)
            user.set_password("123456")
            user.is_active = True
            db.session.add(user)
            db.session.commit()
            print("User: ", user.email, " created.")

        print("All test users created")

    @app.cli.command("insert-test-data")
    def insert_test_data():
        print("Resetting sample data")

        Order.query.delete()
        Product.query.delete()
        User.query.delete()
        db.session.commit()

        lara = seed_user("Lara Instructor", "lara@example.com", "demo123")
        diego = seed_user("Diego Student", "diego@example.com", "demo123")

        products = {
            product_data["slug"]: seed_product(product_data)
            for product_data in SEEDED_PRODUCTS
        }

        db.session.add_all([
            Order(
                user_id=lara.id,
                product_id=products["jwt-starter-kit"].id,
                quantity=1,
                status="paid",
                unit_price=products["jwt-starter-kit"].price
            ),
            Order(
                user_id=lara.id,
                product_id=products["react-route-map"].id,
                quantity=2,
                status="shipped",
                unit_price=products["react-route-map"].price
            ),
            Order(
                user_id=diego.id,
                product_id=products["api-testing-cards"].id,
                quantity=1,
                status="paid",
                unit_price=products["api-testing-cards"].price
            )
        ])

        db.session.commit()

        print("Seed completed")
        print("Users:")
        print(" - lara@example.com / demo123")
        print(" - diego@example.com / demo123")
        print("Products:", len(products))
