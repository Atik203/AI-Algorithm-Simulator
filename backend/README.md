# Logs Dashboard Backend

A robust Django REST Framework API with JWT authentication, real-time WebSocket support, and MySQL integration for comprehensive log management.

## 🚀 Tech Stack

- **Framework**: Django 5.2+ with Django REST Framework 3.16+
- **Database**: MySQL with PyMySQL driver
- **Authentication**: JWT with djangorestframework-simplejwt
- **Real-time**: Django Channels 4.3+ with Redis for WebSocket support
- **API Features**: Filtering, pagination, CSV export, CORS support
- **Environment**: python-dotenv for configuration management
- **Server**: Daphne ASGI server for production deployment

## 📁 Project Structure

```
backend/
├── logs_project/           # Django project configuration
│   ├── __init__.py
│   ├── settings.py        # Main settings with MySQL configuration
│   ├── urls.py           # Root URL configuration
│   ├── asgi.py           # ASGI configuration for WebSocket
│   └── wsgi.py           # WSGI configuration for HTTP
├── logs_app/             # Main application
│   ├── models.py         # Log and UserFilterPreference models
│   ├── serializers.py    # DRF serializers for API responses
│   ├── views.py          # API viewsets and authentication views
│   ├── urls.py           # App URL patterns
│   ├── filters.py        # django-filter classes
│   ├── consumers.py      # WebSocket consumers for real-time updates
│   ├── routing.py        # WebSocket URL routing
│   ├── admin.py          # Django admin configuration
│   └── migrations/       # Database migration files
├── manage.py             # Django management script
├── requirements.txt      # Python dependencies
├── .env                  # Environment variables (create this)
└── generate_demo_data.py # Demo data script (to be created)
```

## 🛠️ Prerequisites

- **Python**: 3.10 or higher
- **MySQL**: 8.0+ or MariaDB 10.5+
- **Redis**: 6.0+ (for WebSocket support)
- **pip**: Python package manager

## 📦 Installation

### 1. Clone and Setup Virtual Environment

```bash
cd backend

# Create virtual environment (recommended)
python -m venv logs_env

# Activate virtual environment
# Windows:
logs_env\Scripts\activate
# macOS/Linux:
source logs_env/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Environment Configuration

Create `.env` file in the backend directory:

```env
# Database Configuration
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=logsdb
MYSQL_USER=your_mysql_user
MYSQL_PASSWORD=your_mysql_password

# Django Configuration
DJANGO_SECRET_KEY=your-secret-key-here
DJANGO_DEBUG=1
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1

# JWT Configuration (optional, has defaults)
JWT_ACCESS_TOKEN_LIFETIME_MINUTES=60
JWT_REFRESH_TOKEN_LIFETIME_DAYS=7

# Redis Configuration (for WebSocket)
REDIS_URL=redis://localhost:6379/0
```

### 4. Database Setup

#### Create MySQL Database

```sql
-- Connect to MySQL as root
mysql -u root -p

-- Create database and user
CREATE DATABASE logsdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'logs_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON logsdb.* TO 'logs_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### Run Migrations

```bash
# Apply database migrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser
```

## 🚦 Development

### Start Development Server

```bash
# Method 1: Django runserver (basic HTTP, no WebSocket)
python manage.py runserver

# Method 2: ASGI server with WebSocket support (recommended)
daphne -p 8000 logs_project.asgi:application

# Method 3: Alternative port if 8000 is busy
daphne -p 8001 logs_project.asgi:application

# Method 4: Bind to all interfaces (for network access)
daphne -b 0.0.0.0 -p 8000 logs_project.asgi:application
```

**Note**: If you get `[WinError 10048]` port already in use error:

```bash
# Check what's using the port
netstat -ano | findstr :8000

# Kill the process (replace PID with actual process ID)
taskkill /PID <process_id> /F

# Or use a different port
daphne -p 8001 logs_project.asgi:application
```

### Admin Interface

Access Django admin at `http://localhost:8000/admin/`

- Manage users, logs, and filter preferences
- View database content and relationships
- Test data integrity

### API Documentation

Base URL: `http://localhost:8000/api/`

## 🎯 Demo Data Generation

The project includes a comprehensive demo data generator script that creates realistic sample data for testing and development.

### Quick Start with Demo Data

```bash
# Generate default demo data (500 logs, 3 users)
python generate_demo_data.py

# Generate more data
python generate_demo_data.py --logs 1000 --users 5

# Clear existing data and generate fresh demo data
python generate_demo_data.py --clear --logs 750 --users 4
```

### What Gets Generated

#### **Demo Users** (Password: `demo123`)

- **admin** (admin@logsdashboard.com) - Superuser with admin access
- **developer** (dev@logsdashboard.com) - Regular developer account
- **analyst** (analyst@logsdashboard.com) - Data analyst account
- **operator** (ops@logsdashboard.com) - Operations team account
- **tester** (test@logsdashboard.com) - QA testing account

#### **Realistic Log Entries**

- **Severity Distribution**: 40% INFO, 25% WARNING, 20% DEBUG, 12% ERROR, 3% CRITICAL
- **20 Different Sources**: auth_service, database_service, api_gateway, etc.
- **Contextual Messages**: Severity-appropriate messages with realistic details
- **Time Distribution**: More recent logs (weighted toward last 7 days)
- **Additional Context**: 30% of logs include extra details (User ID, duration, memory, etc.)

#### **Sample Log Messages by Severity**

```
DEBUG: "Database query executed successfully - Duration: 145ms"
INFO: "User login successful - User ID: 423"
WARNING: "High memory usage detected - Memory: 485MB"
ERROR: "Database connection failed - Session: 78451"
CRITICAL: "System out of memory - Critical security vulnerability"
```

### Using Demo Data for Development

#### **Login with Demo Accounts**

```bash
# All demo accounts use the same password
Username: admin
Password: demo123

# Or use any other demo account
Username: developer
Password: demo123
```

#### **Performance Testing**

```bash
# Generate large datasets for performance testing
python generate_demo_data.py --logs 10000 --users 5

# Test pagination with thousands of entries
python generate_demo_data.py --logs 50000 --users 3
```

### Regenerating Demo Data

#### **Full Reset**

```bash
# Clear all data and start fresh
python generate_demo_data.py --clear --logs 1000 --users 5
```

#### **Adding More Data**

```bash
# Add additional logs to existing dataset
python generate_demo_data.py --logs 500
# Note: This adds to existing data, doesn't replace it
```

#### **Custom Scenarios**

```bash
# Large dataset for stress testing
python generate_demo_data.py --clear --logs 25000 --users 5

# Minimal dataset for quick testing
python generate_demo_data.py --clear --logs 50 --users 2
```

```bash
# Production safety check
if os.environ.get('DJANGO_DEBUG') == '0':
    print("Demo data generation disabled in production")
    sys.exit(1)
```

## 🔌 API Endpoints

### Authentication Endpoints

```
POST /api/auth/register/     # User registration
POST /api/auth/login/        # User login (returns JWT tokens)
POST /api/auth/refresh/      # Refresh access token
GET  /api/auth/user/         # Get current user profile
```

### Log Management Endpoints

```
GET    /api/logs/           # List logs with filtering and pagination
POST   /api/logs/           # Create new log entry
GET    /api/logs/{id}/      # Retrieve specific log
PUT    /api/logs/{id}/      # Update specific log
DELETE /api/logs/{id}/      # Delete specific log
GET    /api/logs/export/    # Export logs as CSV
```

### Filter Parameters

```
GET /api/logs/?search=error&severity=ERROR&source=webapp&date_from=2024-01-01T00:00:00Z&date_to=2024-12-31T23:59:59Z
```

### User Filter Preferences

```
GET    /api/user-filter-preferences/     # List user's saved filters
POST   /api/user-filter-preferences/     # Save new filter preference
PUT    /api/user-filter-preferences/{id}/ # Update filter preference
DELETE /api/user-filter-preferences/{id}/ # Delete filter preference
```

### API Usage Example

```python
# Login request
POST /api/auth/login/
{
    "email": "user@example.com",
    "password": "your_password"
}

# Response
{
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "user": {
        "id": 1,
        "email": "user@example.com",
        "first_name": "John",
        "last_name": "Doe"
    }
}

# Authenticated requests
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

## 🌐 WebSocket Support

### Real-time Log Streaming

```python
# WebSocket URL
ws://localhost:8000/ws/logs/

# Message format
{
    "type": "log_created",
    "log": {
        "id": 123,
        "timestamp": "2024-01-01T12:00:00Z",
        "message": "New log entry",
        "severity": "INFO",
        "source": "webapp"
    }
}
```

## 🧪 Testing & Development

### Demo Data Generation

````bash
# Generate sample data for testing
python generate_demo_data.py




## 📄 API Response Examples

### Log List Response

```json
{
  "count": 150,
  "next": "http://localhost:8000/api/logs/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "timestamp": "2024-01-01T12:00:00Z",
      "message": "User login successful",
      "severity": "INFO",
      "source": "auth_service",
      "created_at": "2024-01-01T12:00:00Z",
      "updated_at": "2024-01-01T12:00:00Z"
    }
  ]
}
````

### Error Response

```json
{
  "error": "Authentication required",
  "code": "authentication_required",
  "details": "Valid JWT token must be provided"
}
```
