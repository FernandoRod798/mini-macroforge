from flask import request, jsonify
from extensions import db  # antes decía "from app import db"
from models import Client, Exercise, Meal


def register_routes(app):

    # ─────────────────────────────────────────
    # CLIENTES
    # ─────────────────────────────────────────

    @app.route("/clients", methods=["GET"])
    def get_clients():
        """
        Devuelve la lista completa de clientes.
        Los ordena del más reciente al más antiguo.
        El frontend usa esto para pintar la tabla principal.
        """
        clients = Client.query.order_by(Client.created_at.desc()).all()
        return jsonify([c.to_dict() for c in clients])


    @app.route("/clients", methods=["POST"])
    def create_client():
        """
        Crea un cliente nuevo con todos sus datos físicos.
        El frontend manda un JSON en el body con los campos requeridos.
        Si falta algún campo obligatorio, regresa un error 400.
        """
        data = request.get_json()

        # Validación mínima — en producción usarías una librería
        # como marshmallow o pydantic para validar más robusto,
        # pero para este proyecto esto es suficiente y legible
        required_fields = [
            "name", "email", "age", "weight", "height",
            "sex", "activity_level", "training_hours",
            "meals_per_day", "preferred_foods", "goal"
        ]
        missing = [f for f in required_fields if f not in data]
        if missing:
            return jsonify({"error": f"Faltan campos: {', '.join(missing)}"}), 400

        client = Client(
            name            = data["name"],
            email           = data["email"],
            age             = data["age"],
            weight          = data["weight"],       # kg
            height          = data["height"],       # cm
            sex             = data["sex"],           # "male" o "female"
            activity_level  = data["activity_level"],
            training_hours  = data["training_hours"],
            meals_per_day   = data["meals_per_day"],
            preferred_foods = data["preferred_foods"],
            goal            = data["goal"],          # lose_fat / maintain / gain_muscle
        )

        db.session.add(client)
        db.session.commit()

        # 201 Created — convención REST para cuando algo se crea exitosamente
        # Es distinto al 200 OK que usas cuando solo consultas
        return jsonify(client.to_dict()), 201


    @app.route("/clients/<int:client_id>", methods=["GET"])
    def get_client(client_id):
        """
        Devuelve el detalle completo de un cliente:
        sus datos, su BMR/TDEE calculados, su rutina y su dieta.
        get_or_404 regresa automáticamente un error 404
        si el cliente no existe — no tienes que manejarlo tú.
        """
        client = Client.query.get_or_404(client_id)

        # Usamos ** para "esparcir" el diccionario base del cliente
        # y agregar encima los ejercicios y comidas.
        # Resultado: un solo objeto JSON con todo junto.
        return jsonify({
            **client.to_dict(),
            "exercises": [e.to_dict() for e in client.exercises],
            "meals":     [m.to_dict() for m in client.meals],
        })


    @app.route("/clients/<int:client_id>", methods=["DELETE"])
    def delete_client(client_id):
        """
        Borra un cliente y — gracias al cascade="all, delete"
        en el modelo — borra también todos sus ejercicios y comidas.
        Sin el cascade tendrías que borrarlos manualmente primero.
        """
        client = Client.query.get_or_404(client_id)
        db.session.delete(client)
        db.session.commit()

        # 204 No Content — convención REST para DELETE exitoso.
        # No regresa body porque ya no hay nada que devolver.
        return "", 204


    # ─────────────────────────────────────────
    # EJERCICIOS
    # ─────────────────────────────────────────

    @app.route("/clients/<int:client_id>/exercises", methods=["POST"])
    def add_exercise(client_id):
        """
        Agrega un ejercicio a la rutina de un cliente específico.
        Primero verifica que el cliente exista antes de agregar.
        """
        Client.query.get_or_404(client_id)
        data = request.get_json()

        exercise = Exercise(
            name      = data["name"],
            sets      = data["sets"],
            reps      = data["reps"],
            client_id = client_id,
        )
        db.session.add(exercise)
        db.session.commit()
        return jsonify(exercise.to_dict()), 201


    @app.route("/exercises/<int:exercise_id>", methods=["DELETE"])
    def delete_exercise(exercise_id):
        """
        Borra un ejercicio específico de la rutina.
        Útil cuando el coach quiere ajustar el plan sin borrar al cliente.
        """
        exercise = Exercise.query.get_or_404(exercise_id)
        db.session.delete(exercise)
        db.session.commit()
        return "", 204


    # ─────────────────────────────────────────
    # COMIDAS
    # ─────────────────────────────────────────

    @app.route("/clients/<int:client_id>/meals", methods=["POST"])
    def add_meal(client_id):
        """
        Agrega una comida al plan de alimentación de un cliente.
        El coach puede agregar tantas comidas como indique meals_per_day.
        """
        Client.query.get_or_404(client_id)
        data = request.get_json()

        meal = Meal(
            name      = data["name"],
            calories  = data["calories"],
            protein   = data["protein"],
            carbs     = data["carbs"],
            fat       = data["fat"],
            client_id = client_id,
        )
        db.session.add(meal)
        db.session.commit()
        return jsonify(meal.to_dict()), 201


    @app.route("/meals/<int:meal_id>", methods=["DELETE"])
    def delete_meal(meal_id):
        """
        Borra una comida específica del plan.
        Misma lógica que delete_exercise — ajuste fino sin borrar al cliente.
        """
        meal = Meal.query.get_or_404(meal_id)
        db.session.delete(meal)
        db.session.commit()
        return "", 204