"""Add role and parentalPIN columns

Revision ID: 28f259cca435
Revises: 8e23e2e37387
Create Date: 2026-04-07 21:44:41.352640
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '28f259cca435'
down_revision = '8e23e2e37387'
branch_labels = None
depends_on = None


def upgrade():
    # Solo agregamos las columnas al User
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.add_column(sa.Column('role', sa.String(length=20), nullable=False, server_default='parent'))
        batch_op.add_column(sa.Column('parentalPIN', sa.String(length=4), nullable=True))
        

def downgrade():
    # Eliminamos las columnas agregadas
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.drop_column('parentalPIN')
        batch_op.drop_column('role')