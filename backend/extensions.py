from flask_sqlalchemy import SQLAlchemy

# db vive aquí sola, separada de app.py
# Así cualquier archivo la puede importar sin generar
# un ciclo de dependencias entre app.py y models.py
db = SQLAlchemy()