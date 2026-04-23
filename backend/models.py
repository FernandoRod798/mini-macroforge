from extensions import db  # antes decía "from app import db"
from datetime import datetime

# Niveles de actividad para calcular el TDEE (gasto calórico total)
# Se multiplican por el BMR para obtener las calorías diarias reales
ACTIVITY_MULTIPLIERS = {
    "sedentary":   1.2,   # Sedentario — sin ejercicio
    "light":       1.375, # Ligero — 1 a 3 días de ejercicio por semana
    "moderate":    1.55,  # Moderado — 3 a 5 días de ejercicio por semana
    "active":      1.725, # Activo — 6 a 7 días de ejercicio por semana
    "very_active": 1.9,   # Muy activo — trabajo físico + ejercicio intenso
}


class Client(db.Model):
    # --- Identificación ---
    id    = db.Column(db.Integer, primary_key=True)
    name  = db.Column(db.String(100), nullable=False)   # Nombre completo
    email = db.Column(db.String(120), nullable=False)   # Correo electrónico

    # --- Datos físicos para calcular el BMR ---
    age    = db.Column(db.Integer, nullable=False)        # Edad en años
    weight = db.Column(db.Float,   nullable=False)        # Peso en kilogramos
    height = db.Column(db.Float,   nullable=False)        # Estatura en centímetros
    sex    = db.Column(db.String(10), nullable=False)     # "male" o "female"

    # --- Estilo de vida ---
    # Valores válidos: sedentary / light / moderate / active / very_active
    activity_level  = db.Column(db.String(20),  nullable=False)
    # Horas disponibles para entrenar por semana
    training_hours  = db.Column(db.Float,       nullable=False)
    # Número de comidas al día que prefiere el cliente
    meals_per_day   = db.Column(db.Integer,     nullable=False)
    # Alimentos preferidos — texto libre separado por comas
    # Ej: "pollo, arroz, huevos, avena, plátano"
    preferred_foods = db.Column(db.Text,        nullable=False)

    # --- Objetivo del cliente ---
    # Valores válidos: lose_fat / maintain / gain_muscle
    goal = db.Column(db.String(20), nullable=False)

    # Fecha en que se registró el cliente — se llena automáticamente
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # --- Relaciones con otras tablas ---
    # lazy=True significa que los ejercicios y comidas solo se cargan
    # cuando los pides explícitamente — más eficiente en consultas grandes
    # cascade="all, delete" — si borras el cliente, se borran sus datos
    exercises = db.relationship("Exercise", backref="client", lazy=True, cascade="all, delete")
    meals     = db.relationship("Meal",     backref="client", lazy=True, cascade="all, delete")

    def calculate_bmr(self):
        """
        Fórmula Mifflin-St Jeor — la más precisa para población general.
        Calcula el gasto calórico en reposo absoluto (solo existir).

        Hombres: (10 × peso) + (6.25 × estatura) - (5 × edad) + 5
        Mujeres: (10 × peso) + (6.25 × estatura) - (5 × edad) - 161
        """
        base = (10 * self.weight) + (6.25 * self.height) - (5 * self.age)
        return round(base + 5 if self.sex == "male" else base - 161)

    def calculate_tdee(self):
        """
        TDEE — Total Daily Energy Expenditure (Gasto Calórico Total Diario).
        Es el BMR ajustado por el nivel de actividad física del cliente.
        Estas son las calorías reales que quema el cliente en un día normal.
        """
        multiplier = ACTIVITY_MULTIPLIERS.get(self.activity_level, 1.2)
        return round(self.calculate_bmr() * multiplier)

    def calculate_target_calories(self):
        """
        Ajusta el TDEE según el objetivo del cliente:
        - Perder grasa: déficit del 20% (come menos de lo que gasta)
        - Mantener:     igual al TDEE
        - Ganar músculo: superávit del 15% (come más de lo que gasta)
        """
        tdee = self.calculate_tdee()
        if self.goal == "lose_fat":
            return round(tdee * 0.80)
        elif self.goal == "gain_muscle":
            return round(tdee * 1.15)
        return tdee  # maintain

    def to_dict(self):
        # Incluimos los cálculos en la respuesta para que el frontend
        # los pueda mostrar directamente sin recalcularlos en React
        return {
            "id":               self.id,
            "name":             self.name,
            "email":            self.email,
            "age":              self.age,
            "weight":           self.weight,
            "height":           self.height,
            "sex":              self.sex,
            "activity_level":   self.activity_level,
            "training_hours":   self.training_hours,
            "meals_per_day":    self.meals_per_day,
            "preferred_foods":  self.preferred_foods,
            "goal":             self.goal,
            "bmr":              self.calculate_bmr(),
            "tdee":             self.calculate_tdee(),
            "target_calories":  self.calculate_target_calories(),
            "created_at":       self.created_at.isoformat(),
        }


class Exercise(db.Model):
    # Ejercicio asignado a un cliente específico
    id        = db.Column(db.Integer, primary_key=True)
    name      = db.Column(db.String(100), nullable=False)  # Nombre del ejercicio
    sets      = db.Column(db.Integer,     nullable=False)  # Número de series
    reps      = db.Column(db.Integer,     nullable=False)  # Repeticiones por serie
    # Llave foránea — conecta este ejercicio con su cliente
    client_id = db.Column(db.Integer, db.ForeignKey("client.id"), nullable=False)

    def to_dict(self):
        return {
            "id":        self.id,
            "name":      self.name,
            "sets":      self.sets,
            "reps":      self.reps,
            "client_id": self.client_id,
        }


class Meal(db.Model):
    # Comida asignada a un cliente específico
    id       = db.Column(db.Integer, primary_key=True)
    name     = db.Column(db.String(100), nullable=False)  # Nombre de la comida
    calories = db.Column(db.Integer,     nullable=False)  # Calorías totales
    protein  = db.Column(db.Integer,     nullable=False)  # Gramos de proteína
    carbs    = db.Column(db.Integer,     nullable=False)  # Gramos de carbohidratos
    fat      = db.Column(db.Integer,     nullable=False)  # Gramos de grasa
    # Llave foránea — conecta esta comida con su cliente
    client_id = db.Column(db.Integer, db.ForeignKey("client.id"), nullable=False)

    def to_dict(self):
        return {
            "id":        self.id,
            "name":      self.name,
            "calories":  self.calories,
            "protein":   self.protein,
            "carbs":     self.carbs,
            "fat":       self.fat,
            "client_id": self.client_id,
        }