# Mini MacroForge — Coach Panel

Panel web para coaches de fitness. Permite registrar clientes, calcular sus requerimientos calóricos y asignarles rutinas de ejercicio y planes de alimentación personalizados.

## Demo

> Deploy en progreso — link disponible próximamente

## Features

- Registro de clientes con datos físicos completos
- Cálculo automático de BMR, TDEE y calorías objetivo (Fórmula Mifflin-St Jeor)
- Asignación de rutinas de ejercicio por cliente
- Asignación de planes de alimentación por cliente
- Navegación entre pantallas sin recarga (SPA)

## Tech Stack

**Frontend**
- React 18 + TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- React Router DOM

**Backend**
- Python + Flask
- SQLAlchemy
- SQLite
- Flask-CORS

## Arquitectura

frontend/
├── src/
│   ├── components/   # Componentes reutilizables
│   ├── pages/        # Pantallas completas por ruta
│   ├── context/      # Estado global (useContext)
│   ├── services/     # Comunicación con el API
│   ├── types/        # Interfaces TypeScript
│   └── lib/          # Funciones utilitarias
backend/
├── app.py            # Application Factory
├── models.py         # Modelos SQLAlchemy + lógica de negocio
├── routes.py         # Endpoints REST
└── extensions.py     # Instancia de SQLAlchemy

## Instalación local

**Backend**
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install flask flask-sqlalchemy flask-cors
py app.py
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /clients | Lista todos los clientes |
| POST | /clients | Crea un cliente nuevo |
| GET | /clients/:id | Detalle de un cliente |
| DELETE | /clients/:id | Elimina un cliente |
| POST | /clients/:id/exercises | Agrega un ejercicio |
| POST | /clients/:id/meals | Agrega una comida |
| DELETE | /exercises/:id | Elimina un ejercicio |
| DELETE | /meals/:id | Elimina una comida |

## Próximos pasos

- [ ] Deploy backend en Railway
- [ ] Deploy frontend en Vercel
- [ ] Autenticación del coach
- [ ] Edición de clientes, ejercicios y comidas
- [ ] Exportar plan del cliente en PDF