import os
import sys

# Añadimos la carpeta src al camino de búsqueda de Python
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), 'src')))

from app import app
from api.models import db

def force_sync():
    with app.app_context():
        print("Cargando configuración de base de datos...")
        # Esto imprimirá la URL para que verifiques que es la correcta (sin mostrar la contraseña completa)
        db_uri = app.config['SQLALCHEMY_DATABASE_URI']
        print(f"Conectando a: {db_uri.split('@')[-1]}") 
        
        print("Creando tablas...")
        db.create_all()
        print("✅ ¡Tablas creadas exitosamente!")

if __name__ == "__main__":
    try:
        force_sync()
    except Exception as e:
        print(f"❌ Error al sincronizar: {e}")