"""add user avatar

Revision ID: 8c4f2c1a2dbe
Revises: 72518c3e3719
Create Date: 2026-05-20 00:00:00.000000
"""

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '8c4f2c1a2dbe'
down_revision = '72518c3e3719'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('user', sa.Column('avatar', sa.String(length=255), nullable=True))


def downgrade():
    op.drop_column('user', 'avatar')
