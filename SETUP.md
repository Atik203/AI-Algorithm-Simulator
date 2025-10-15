# 🧠 AI Search Algorithm Simulator - Setup Guide

## 📋 Prerequisites

- **Python 3.12.7** (Installed globally)
- **Yarn 4.9.4** (Installed globally)
- **PowerShell** (for Windows users)

---

## 🚀 Quick Start

### Backend Setup

1. **Navigate to backend directory**:

   ```powershell
   cd backend
   ```

2. **Activate virtual environment**:

   ```powershell
   .\venv\Scripts\Activate.ps1
   ```

3. **Run the development server**:

   ```powershell
   python manage.py runserver
   ```

   The backend API will be available at: `http://localhost:8000`

4. **Create admin user** (optional):

   ```powershell
   python manage.py createsuperuser
   ```

   Access admin panel at: `http://localhost:8000/admin`

---

### Frontend Setup

1. **Navigate to frontend directory**:

   ```powershell
   cd frontend
   ```

2. **Start the development server**:

   ```powershell
   yarn dev
   ```

   The frontend will be available at: `http://localhost:5173`

---

## 📁 Project Structure

```
AI-Algorithm-Simulation/
├── backend/
│   ├── venv/                        # Python virtual environment
│   ├── ai_simulator_project/        # Django project settings
│   ├── algorithms_app/              # Main application
│   │   ├── algorithms.py            # Algorithm implementations
│   │   ├── models.py                # Database models
│   │   ├── serializers.py           # REST API serializers
│   │   ├── views.py                 # API endpoints
│   │   └── urls.py                  # URL routing
│   ├── db.sqlite3                   # SQLite database
│   ├── manage.py                    # Django management
│   └── requirements.txt             # Python dependencies
│
└── frontend/
    ├── src/
    │   ├── api/                     # API client functions
    │   ├── components/              # Reusable React components
    │   │   ├── ui/                  # ShadCN UI components
    │   │   ├── ThemeProvider.tsx    # Dark/Light theme support
    │   │   └── ModeToggle.tsx       # Theme switcher
    │   ├── pages/                   # Page components
    │   │   ├── Home.tsx             # Landing page
    │   │   ├── Login.tsx            # Authentication
    │   │   └── Register.tsx         # User registration
    │   └── main.tsx                 # Application entry point
    ├── package.json                 # Node dependencies
    └── vite.config.ts               # Vite configuration
```

---

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/login/` - User login (JWT)
- `POST /api/auth/refresh/` - Refresh JWT token
- `POST /api/auth/register/` - User registration
- `GET /api/auth/me/` - Get current user

### Algorithms

- `GET /api/algorithms/` - List all available algorithms
- `POST /api/run-algorithm/` - Execute an algorithm
- `GET /api/simulations/` - Get saved simulations (authenticated)

---

## 🧪 Implemented Algorithms

| Algorithm               | Type              | Status         |
| ----------------------- | ----------------- | -------------- |
| **A\***                 | Informed Search   | ✅ Implemented |
| **BFS**                 | Uninformed Search | ✅ Implemented |
| **DFS**                 | Uninformed Search | ✅ Implemented |
| **Dijkstra**            | Informed Search   | ✅ Implemented |
| **Hill Climbing**       | Local Search      | ✅ Implemented |
| **Simulated Annealing** | Local Search      | ✅ Implemented |
| **Genetic Algorithm**   | Evolutionary      | 🚧 Placeholder |

---

## 🎨 Features

- ✅ Clean, modern dark theme by default
- ✅ JWT-based authentication
- ✅ RESTful API architecture
- ✅ Multiple algorithm implementations
- ✅ Step-by-step execution tracking
- ✅ Performance metrics (nodes explored, execution time, path cost)
- ✅ Simulation history (for authenticated users)

---

## 🛠️ Tech Stack

### Backend

- **Django 5.2.7** - Web framework
- **Django REST Framework 3.16.1** - API framework
- **djangorestframework-simplejwt 5.5.1** - JWT authentication
- **django-cors-headers 4.9.0** - CORS support
- **SQLite** - Database

### Frontend

- **React 19.0.0** - UI library
- **TypeScript 5.5.4** - Type safety
- **Vite 5.4.8** - Build tool
- **React Router 7.9.3** - Routing
- **Tailwind CSS 4.1.0** - Styling
- **ShadCN UI** - Component library
- **Axios 1.12.2** - HTTP client
- **Recharts 3.2.1** - Data visualization

---

## 📝 Development Notes

### Backend

- Uses SQLite for simplicity (can be changed to PostgreSQL/MySQL)
- All migrations are up to date
- CORS is enabled for development (localhost:5173)
- Debug mode is ON by default

### Frontend

- Dark theme enabled by default via `ThemeProvider`
- Uses Yarn 4.9.4 as package manager
- Hot Module Replacement (HMR) enabled
- Path aliases configured (@components, @pages, @api)

---

## 🔐 Environment Variables (Optional)

Create a `.env` file in the `backend/` directory:

```env
DJANGO_SECRET_KEY=your-secret-key-here
DJANGO_DEBUG=1
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
```

---

## 🚨 Troubleshooting

### Backend Issues

**Issue**: `ModuleNotFoundError: No module named 'django'`
**Solution**: Make sure virtual environment is activated:

```powershell
.\venv\Scripts\Activate.ps1
```

**Issue**: `django.core.exceptions.ImproperlyConfigured`
**Solution**: Run migrations:

```powershell
python manage.py migrate
```

### Frontend Issues

**Issue**: `Error: Cannot find module`
**Solution**: Reinstall dependencies:

```powershell
yarn install
```

**Issue**: Port 5173 already in use
**Solution**: Kill the process or use a different port:

```powershell
yarn dev --port 3000
```

---

## 📚 Next Steps

1. ✅ Backend and Frontend are cleaned and set up
2. 🎯 Implement grid visualization component
3. 🎯 Add algorithm execution animation
4. 🎯 Create comparison dashboard
5. 🎯 Add more algorithm implementations
6. 🎯 Implement real-time WebSocket updates (optional)

---

## 👨‍💻 Developer

Built with ❤️ for AI Lab Project

For questions or issues, please check the main README.md or contact the development team.
