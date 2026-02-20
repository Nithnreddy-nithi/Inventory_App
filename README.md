# 📦 Inventory Management System

A full-stack **Inventory Management** web application built with a **FastAPI** backend and a **React (Vite)** frontend, backed by **Microsoft SQL Server**.

---

## 🗂️ Project Structure

```
inventory-app/
├── inventory_management/       # Backend (FastAPI)
│   ├── app/
│   │   ├── main.py             # App entry point & router registration
│   │   ├── core/               # Config & settings
│   │   ├── database/           # DB engine & session setup
│   │   ├── models/             # SQLAlchemy ORM models
│   │   ├── schemas/            # Pydantic request/response schemas
│   │   ├── repositories/       # Data access layer
│   │   ├── services/           # Business logic layer
│   │   ├── routers/            # API route handlers
│   │   ├── dependencies/       # Auth & shared dependencies
│   │   ├── events/             # Audit event listeners
│   │   ├── middleware/         # Custom middleware
│   │   └── utils/              # Helper utilities
│   ├── alembic/                # Database migrations
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env
│
├── inventory-frontend/         # Frontend (React + Vite)
│   ├── src/
│   │   ├── pages/              # Page-level components
│   │   ├── components/         # Shared UI components
│   │   ├── services/           # Axios API service layers
│   │   ├── api/                # API config & interceptors
│   │   ├── context/            # React context (auth, etc.)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
└── docker-compose.yml
```

---

## ✨ Features

### 🔐 Authentication & Users
- JWT-based login and registration
- Role-based access control (Admin / User)
- User profile management
- Admin user management panel

### 📦 Inventory Management
- Add, edit, delete **Products** with stock tracking
- Manage **Categories** and **Suppliers**
- Real-time stock quantity updates on purchases & sales

### 🛒 Sales & Purchases
- Create **Sales Orders** with line items
- Create **Purchase Orders** with line items
- View order/purchase details and history

### 📊 Reports & Dashboard
- Dashboard with key inventory KPIs and charts (powered by **Recharts**)
- Sales and inventory reports
- Audit log trail for data changes

---

## 🛠️ Tech Stack

| Layer       | Technology                                   |
|-------------|----------------------------------------------|
| Backend     | Python 3, FastAPI, SQLAlchemy (ORM)          |
| Database    | Microsoft SQL Server (via `pyodbc`)          |
| Migrations  | Alembic                                      |
| Auth        | JWT (`python-jose`), `passlib` / `bcrypt`    |
| Frontend    | React 18, Vite, Tailwind CSS                 |
| HTTP Client | Axios                                         |
| Charts      | Recharts                                     |
| Routing     | React Router DOM v7                          |
| Container   | Docker, Docker Compose                       |

---

## ⚙️ Backend Setup (Local)

### Prerequisites
- Python 3.10+
- Microsoft SQL Server (with ODBC Driver 18)
- `pyodbc` compatible environment

### Steps

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd inventory-app/inventory_management
   ```

2. **Create and activate a virtual environment**
   ```bash
   python -m venv venv
   # Windows
   venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**

   Create a `.env` file in `inventory_management/`:
   ```env
   DB_USER=sa
   DB_PASSWORD=your_password
   MSSQL_SERVER=localhost
   MSSQL_DATABASE=inventory_db
   MSSQL_PORT=1433
   SECRET_KEY=your_jwt_secret_key
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ```

5. **Run database migrations**
   ```bash
   alembic upgrade head
   ```

6. **Start the backend server**
   ```bash
   uvicorn app.main:app --reload
   ```
   API will be available at: `http://localhost:8000`
   Interactive docs: `http://localhost:8000/docs`

---

## 💻 Frontend Setup (Local)

### Prerequisites
- Node.js 18+
- npm

### Steps

1. **Navigate to the frontend directory**
   ```bash
   cd inventory-app/inventory-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   App will be available at: `http://localhost:5173`

---

## 🐳 Docker Setup

Run both services together using Docker Compose:

```bash
docker-compose up --build
```

| Service   | URL                        |
|-----------|----------------------------|
| Backend   | http://localhost:8000      |
| Frontend  | http://localhost:3000      |
| API Docs  | http://localhost:8000/docs |

> **Note:** Ensure your SQL Server is accessible from within Docker. The compose file routes database traffic through `host.docker.internal`.

---

## 📡 API Endpoints Overview

| Module      | Base Path          | Description                         |
|-------------|---------------------|-------------------------------------|
| Auth        | `/auth`             | Login, Register, Token refresh      |
| Products    | `/products`         | CRUD for products                   |
| Categories  | `/categories`       | CRUD for product categories         |
| Suppliers   | `/suppliers`        | CRUD for suppliers                  |
| Sales       | `/sales`            | Create and view sales orders        |
| Sale Items  | `/sale-items`       | Line items for sales orders         |
| Purchases   | `/purchases`        | Create and view purchase orders     |
| Reports     | `/reports`          | Inventory and sales reports         |
| Dashboard   | `/dashboard`        | KPI metrics and chart data          |
| Audit       | `/audit`            | Audit log viewer                    |
| Admin       | `/admin`            | Admin-only user management          |

Full interactive documentation is available at `/docs` (Swagger UI) or `/redoc`.

---

## 📄 Database Migrations

Alembic is used for schema migrations.

```bash
# Create a new migration
alembic revision --autogenerate -m "description"

# Apply all pending migrations
alembic upgrade head

# Rollback one step
alembic downgrade -1
```

---

## 📁 Frontend Pages

| Page              | Description                          |
|-------------------|--------------------------------------|
| Login / Register  | User authentication                  |
| Dashboard         | Overview with KPIs and charts        |
| Inventory         | Browse and manage products           |
| Orders            | View and create sales orders         |
| Purchases         | View and create purchase orders      |
| Reporting         | Sales and inventory reports          |
| User Management   | Admin panel for managing users       |
| Profile           | View/edit current user profile       |
| About Us          | App information page                 |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "Add my feature"`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).
