# 🧠 AI Algorithm Simulator

### Interactive Visualization Platform for Search & Optimization Algorithms

[![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Django](https://img.shields.io/badge/Django-5.x-092E20?logo=django)](https://www.djangoproject.com/)
[![Python](https://img.shields.io/badge/Python-3.12+-3776AB?logo=python)](https://www.python.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](#-license)

**Free & Open Source** | [GitHub Repository](https://github.com/Atik203/AI-Algorithm-Simulator)

---

## 📖 Table of Contents

- [Project Overview](#-project-overview)
- [Implemented Algorithms](#-implemented-algorithms)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Setup Guide](#-setup-guide)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Usage Guide](#-usage-guide)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🚀 Project Overview

**AI Algorithm Simulator** is a free, open-source interactive web platform that provides real-time visualization and execution of **7 powerful AI search and optimization algorithms**. The platform enables users to understand how different algorithms explore problem spaces, make decisions, and find solutions through step-by-step visual demonstrations.

### 🎯 Purpose

- **Educational Tool** - Learn AI algorithms through interactive visualization
- **Algorithm Comparison** - Compare performance metrics side-by-side
- **Research Platform** - Experiment with different parameters and heuristics
- **Game Development** - Visualize pathfinding for game AI
- **Problem Solving** - Understand optimization techniques for real-world problems

### 🌟 What Makes It Special

- ✨ **Canvas-Based Rendering** - Smooth 60 FPS visualization with optimized performance
- 🎨 **Modern UI/UX** - Built with Tailwind CSS and shadcn/ui components
- 🔐 **Secure Authentication** - JWT-based user authentication and session management
- 📱 **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile devices
- 🌓 **Dark Mode** - Eye-friendly theme with smooth transitions
- 💾 **Simulation History** - Save and replay your algorithm executions

---

## ✨ Implemented Algorithms

### **Classic Search Algorithms** (4)

#### 1. **A\* Search**

- **Type**: Informed Search
- **Complexity**: Time O(b^d) | Space O(b^d)
- **Optimal**: Yes (with admissible heuristic)
- **Description**: Intelligent pathfinding using `f(n) = g(n) + h(n)` where g(n) is cost from start and h(n) is estimated cost to goal
- **Use Cases**: GPS navigation, game AI, robotics pathfinding, route planning

#### 2. **Breadth-First Search (BFS)**

- **Type**: Uninformed Search
- **Complexity**: Time O(V + E) | Space O(V)
- **Optimal**: Yes (unweighted graphs)
- **Description**: Level-order traversal exploring all neighbors before moving deeper
- **Use Cases**: Shortest path in unweighted graphs, web crawling, social network analysis

#### 3. **Depth-First Search (DFS)**

- **Type**: Uninformed Search
- **Complexity**: Time O(V + E) | Space O(h)
- **Optimal**: No
- **Description**: Explores as far as possible along each branch before backtracking
- **Use Cases**: Maze solving, topological sorting, cycle detection, puzzle solving

#### 4. **Dijkstra's Algorithm**

- **Type**: Informed Search
- **Complexity**: Time O((V + E) log V) | Space O(V)
- **Optimal**: Yes (non-negative weights)
- **Description**: Finds shortest path in weighted graphs using priority queue
- **Use Cases**: Network routing, transportation systems, logistics optimization

### **Heuristic & Optimization Algorithms** (3)

#### 5. **Hill Climbing**

- **Type**: Local Search
- **Complexity**: Time O(∞) | Space O(1)
- **Optimal**: No (can get stuck in local optima)
- **Description**: Greedy local search that always moves to the best neighboring state
- **Use Cases**: Function optimization, AI game playing, machine learning parameter tuning

#### 6. **Simulated Annealing**

- **Type**: Probabilistic Optimization
- **Complexity**: Time O(∞) | Space O(1)
- **Optimal**: Probabilistically complete
- **Description**: Probabilistic technique that accepts worse moves with decreasing probability over time
- **Use Cases**: VLSI design, job scheduling, neural network training, traveling salesman problem

#### 7. **Genetic Algorithm**

- **Type**: Evolutionary Optimization
- **Complexity**: Time O(g × n × f) | Space O(n)
- **Optimal**: Probabilistically complete
- **Description**: Evolution-inspired optimization using selection, crossover, and mutation
- **Use Cases**: Machine learning, scheduling, design optimization, feature selection

### 🔮 Coming Soon (7 More Algorithms)

- **Bidirectional BFS** - Search from both start and goal simultaneously
- **Depth-Limited DFS** - DFS with depth limit to avoid infinite paths
- **Iterative Deepening DFS** - Combines benefits of BFS and DFS
- **Uniform Cost Search (UCS)** - Expands node with lowest path cost
- **Stochastic Hill Climbing** - Random selection among uphill moves
- **Random Restart Hill Climbing** - Multiple hill climbing attempts
- **First-Choice Hill Climbing** - Selects first better neighbor found

---

## 🎯 Key Features

### Visualization & Interaction

✅ **Real-time Step-by-Step Visualization** - Watch algorithms explore the search space frame-by-frame  
✅ **Interactive Grid System** - Draw obstacles, set start/goal points, create custom mazes  
✅ **Speed Control** - Adjust playback speed from 0.1x to 10x  
✅ **Grid Customization** - Adjustable grid sizes (5x5 to 50x50)  
✅ **Multiple Drawing Tools** - Add walls, weighted nodes, start/goal points with click or drag

### Algorithm Configuration

✅ **Multiple Heuristics** - Manhattan, Euclidean, Chebyshev, Octile distances  
✅ **Parameter Tuning** - Adjust algorithm-specific parameters (temperature, population size, etc.)  
✅ **Preset Mazes** - Random maze generation and predefined patterns  
✅ **Algorithm Comparison** - Run multiple algorithms on the same grid

### Performance & Analytics

✅ **Performance Metrics** - Track nodes explored, path cost, execution time, memory usage  
✅ **Statistics Dashboard** - Visualize algorithm efficiency with charts and graphs  
✅ **Execution History** - Review past simulations with complete state replay  
✅ **Export Results** - Save simulation data for analysis

### User Experience

✅ **User Authentication** - Secure JWT-based login and registration  
✅ **Simulation History** - Save and track your algorithm executions  
✅ **Responsive Design** - Works seamlessly on all devices  
✅ **Dark Mode** - Eye-friendly theme with smooth transitions  
✅ **Keyboard Shortcuts** - Efficient control with keyboard commands  
✅ **Accessibility** - WCAG compliant with screen reader support

---

## 🛠️ Tech Stack

### Frontend Technologies

| Technology        | Version | Purpose                                        |
| ----------------- | ------- | ---------------------------------------------- |
| **React**         | 19.0.0  | UI library for building interactive interfaces |
| **TypeScript**    | 5.5.4   | Type safety and better developer experience    |
| **Vite**          | 5.4.8   | Lightning-fast build tool and dev server       |
| **Redux Toolkit** | 2.5.0   | State management for global app state          |
| **React Router**  | 7.9.3   | Client-side routing and navigation             |
| **Tailwind CSS**  | 4.1.0   | Utility-first CSS framework                    |
| **shadcn/ui**     | Latest  | High-quality React component library           |
| **Framer Motion** | 11.15.0 | Smooth animations and transitions              |
| **Axios**         | 1.12.2  | HTTP client for API communication              |
| **Recharts**      | 3.2.1   | Data visualization and charting                |

### Backend Technologies

| Technology                        | Version | Purpose                                      |
| --------------------------------- | ------- | -------------------------------------------- |
| **Django**                        | 5.2.7   | High-level Python web framework              |
| **Django REST Framework**         | 3.16.1  | RESTful API development                      |
| **djangorestframework-simplejwt** | 5.5.1   | JWT authentication                           |
| **django-cors-headers**           | 4.9.0   | CORS support for API access                  |
| **SQLite**                        | 3.x     | Lightweight database (dev/small deployments) |
| **Python**                        | 3.12.7  | Core programming language                    |

### Development Tools

- **Yarn** 4.9.4 - Package manager
- **ESLint** - Code linting
- **PowerShell** - Script execution (Windows)
- **Git** - Version control

---

## 📦 Setup Guide

### Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.12.7+** - [Download Python](https://www.python.org/downloads/)
- **Node.js 18+** - [Download Node.js](https://nodejs.org/)
- **Yarn 4.9.4+** - Install via `npm install -g yarn`
- **Git** - [Download Git](https://git-scm.com/)

### 🚀 Quick Start

#### 1. Clone the Repository

```bash
git clone https://github.com/Atik203/AI-Algorithm-Simulator.git
cd AI-Algorithm-Simulator
```

#### 2. Backend Setup

```powershell
# Navigate to backend directory
cd backend

# Activate virtual environment (Windows PowerShell)
.\venv\Scripts\Activate.ps1

# For Linux/Mac
# source venv/bin/activate

# Install dependencies (if needed)
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser (optional, for admin access)
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

The backend API will be available at: **http://localhost:8000**

Admin panel: **http://localhost:8000/admin**

#### 3. Frontend Setup

Open a new terminal window:

```powershell
# Navigate to frontend directory
cd frontend

# Install dependencies (if needed)
yarn install

# Start development server
yarn dev
```

The frontend will be available at: **http://localhost:5173**

### 🎉 Access the Application

1. Open your browser and navigate to **http://localhost:5173**
2. Register a new account or login
3. Start visualizing algorithms!

### 🔧 Environment Variables (Optional)

Create a `.env` file in the `backend/` directory for custom configuration:

```env
# Django Settings
DJANGO_SECRET_KEY=your-secret-key-here
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1

# Database (optional, defaults to SQLite)
DATABASE_URL=sqlite:///db.sqlite3

# CORS Settings
CORS_ALLOWED_ORIGINS=http://localhost:5173

# JWT Settings
JWT_ACCESS_TOKEN_LIFETIME=60  # minutes
JWT_REFRESH_TOKEN_LIFETIME=1440  # minutes (24 hours)
```

---

## 📁 Project Structure

```
AI-Algorithm-Simulation/
│
├── backend/                          # Django Backend
│   ├── venv/                         # Python virtual environment
│   ├── ai_simulator_project/         # Django project settings
│   │   ├── settings.py               # Main configuration
│   │   ├── urls.py                   # Root URL configuration
│   │   ├── wsgi.py                   # WSGI config for deployment
│   │   └── asgi.py                   # ASGI config for async
│   │
│   ├── algorithms_app/               # Main application
│   │   ├── algorithms.py             # Algorithm implementations (A*, BFS, DFS, etc.)
│   │   ├── models.py                 # Database models (User, Simulation)
│   │   ├── serializers.py            # REST API serializers
│   │   ├── views.py                  # API endpoints and business logic
│   │   ├── urls.py                   # App-specific URL routing
│   │   ├── validators.py             # Input validation
│   │   └── migrations/               # Database migrations
│   │
│   ├── db.sqlite3                    # SQLite database
│   ├── manage.py                     # Django management CLI
│   └── requirements.txt              # Python dependencies
│
├── frontend/                         # React Frontend
│   ├── public/                       # Static assets
│   │
│   ├── src/
│   │   ├── api/                      # API client functions
│   │   │   ├── api.ts                # Axios configuration
│   │   │   └── auth.ts               # Authentication API calls
│   │   │
│   │   ├── components/               # React components
│   │   │   ├── ui/                   # shadcn/ui components
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── select.tsx
│   │   │   │   ├── slider.tsx
│   │   │   │   └── table.tsx
│   │   │   │
│   │   │   ├── common/               # Shared components
│   │   │   │   ├── AlgorithmInfoCard.tsx
│   │   │   │   ├── ConfigurationPanel.tsx
│   │   │   │   ├── ControlPanel.tsx
│   │   │   │   └── StatisticsPanel.tsx
│   │   │   │
│   │   │   ├── visualizer/           # Visualization components
│   │   │   │   ├── AlgorithmVisualizer.tsx  # Canvas-based grid renderer
│   │   │   │   ├── AlgorithmStatistics.tsx  # Performance metrics
│   │   │   │   └── VisualizerControls.tsx   # Playback controls
│   │   │   │
│   │   │   ├── Navbar.tsx            # Navigation header
│   │   │   ├── Footer.tsx            # Site footer
│   │   │   ├── Layout.tsx            # Page layout wrapper
│   │   │   ├── ThemeProvider.tsx     # Dark/Light mode context
│   │   │   └── ModeToggle.tsx        # Theme switcher button
│   │   │
│   │   ├── pages/                    # Page components
│   │   │   ├── Home.tsx              # Landing page with algorithm cards
│   │   │   ├── Simulator.tsx         # Main visualization interface
│   │   │   ├── Dashboard.tsx         # User dashboard with stats
│   │   │   ├── History.tsx           # Simulation history with pagination
│   │   │   ├── Profile.tsx           # User profile page
│   │   │   ├── Login.tsx             # Authentication page
│   │   │   └── Register.tsx          # User registration
│   │   │
│   │   ├── store/                    # Redux state management
│   │   │   ├── index.ts              # Store configuration
│   │   │   ├── hooks.ts              # Typed hooks
│   │   │   └── slices/
│   │   │       └── userSlice.ts      # User state slice
│   │   │
│   │   ├── types/                    # TypeScript type definitions
│   │   │   └── visualizer.ts         # Visualizer interfaces
│   │   │
│   │   ├── lib/                      # Utility functions
│   │   │   ├── utils.ts              # General utilities
│   │   │   ├── animations.ts         # Animation helpers
│   │   │   └── visualizer-utils.ts   # Grid calculations
│   │   │
│   │   ├── main.tsx                  # Application entry point
│   │   └── app.css                   # Global styles
│   │
│   ├── package.json                  # Node dependencies
│   ├── vite.config.ts                # Vite configuration
│   ├── tailwind.config.ts            # Tailwind CSS config
│   ├── tsconfig.json                 # TypeScript config
│   └── components.json               # shadcn/ui config
│
├── .gitignore                        # Git ignore rules
└── README.md                         # This file
```

---

## 🔌 API Documentation

### Authentication Endpoints

#### Register User

```http
POST /api/auth/register/
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "full_name": "John Doe"
}
```

**Response:**

```json
{
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "full_name": "John Doe"
  },
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

#### Login

```http
POST /api/auth/login/
Content-Type: application/json

{
  "username": "johndoe",
  "password": "SecurePass123!"
}
```

#### Refresh Token

```http
POST /api/auth/refresh/
Content-Type: application/json

{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

#### Get Current User

```http
GET /api/auth/me/
Authorization: Bearer <access_token>
```

### Algorithm Endpoints

#### List Available Algorithms

```http
GET /api/algorithms/
```

**Response:**

```json
[
  {
    "id": "astar",
    "name": "A* Search",
    "category": "Classic Search",
    "description": "Informed search using heuristics",
    "time_complexity": "O(b^d)",
    "space_complexity": "O(b^d)"
  },
  ...
]
```

#### Execute Algorithm

```http
POST /api/run-algorithm/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "algorithm": "astar",
  "grid_size": 20,
  "start": [0, 0],
  "goal": [19, 19],
  "obstacles": [[5, 5], [5, 6], [5, 7]],
  "heuristic": "manhattan",
  "speed": 1.0
}
```

**Response:**

```json
{
  "simulation_id": 123,
  "steps": [
    {
      "step": 1,
      "current": [0, 0],
      "visited": [[0, 0]],
      "frontier": [[1, 0], [0, 1]],
      "cost": 0
    },
    ...
  ],
  "path": [[0, 0], [1, 0], ..., [19, 19]],
  "stats": {
    "nodes_explored": 156,
    "path_length": 38,
    "execution_time_ms": 45,
    "memory_used_kb": 128
  }
}
```

#### Get Simulation History

```http
GET /api/simulations/
Authorization: Bearer <access_token>
```

#### Get Specific Simulation

```http
GET /api/simulations/<id>/
Authorization: Bearer <access_token>
```

---

## 📚 Usage Guide

### Creating Your First Simulation

1. **Navigate to Simulator**

   - Click "Try Simulator" from home page or "Simulator" in navbar

2. **Select Algorithm**

   - Choose from dropdown (A\*, BFS, DFS, Dijkstra, Hill Climbing, Simulated Annealing, Genetic)

3. **Configure Grid**

   - Adjust grid size (5x5 to 50x50)
   - Set start point (click on grid)
   - Set goal point (click on grid)
   - Draw obstacles (click and drag)

4. **Set Parameters**

   - Choose heuristic (for informed search algorithms)
   - Adjust algorithm-specific parameters
   - Set visualization speed

5. **Run Simulation**

   - Click "Run" to start
   - Use playback controls (Play, Pause, Step Forward/Back)
   - View real-time statistics

6. **Analyze Results**
   - Review path found
   - Check performance metrics
   - Compare with other algorithms

### Keyboard Shortcuts

- `Space` - Play/Pause simulation
- `→` - Step forward
- `←` - Step backward
- `R` - Reset simulation
- `+` - Increase speed
- `-` - Decrease speed
- `G` - Toggle grid visibility
- `M` - Generate random maze

### Tips for Best Results

- **Start Simple** - Begin with small grids (10x10) to understand algorithm behavior
- **Use Appropriate Algorithms** - A\* for shortest path, Hill Climbing for optimization
- **Experiment with Heuristics** - Try different heuristics to see their impact
- **Compare Algorithms** - Run multiple algorithms on the same grid for comparison
- **Save Interesting Cases** - Use authentication to save and share interesting simulations

---

## 🚨 Troubleshooting

### Backend Issues

**Problem**: `ModuleNotFoundError: No module named 'django'`

```powershell
# Solution: Activate virtual environment
.\venv\Scripts\Activate.ps1

# Verify activation (should show (venv) prefix)
# Then install requirements
pip install -r requirements.txt
```

**Problem**: `django.core.exceptions.ImproperlyConfigured`

```powershell
# Solution: Run migrations
python manage.py migrate

# If migrations exist but not applied
python manage.py showmigrations  # Check migration status
python manage.py migrate --run-syncdb  # Force sync
```

**Problem**: Port 8000 already in use

```powershell
# Solution: Use different port
python manage.py runserver 8001

# Or find and kill process using port 8000 (Windows)
netstat -ano | findstr :8000
taskkill /PID <process_id> /F
```

### Frontend Issues

**Problem**: `Error: Cannot find module`

```powershell
# Solution: Clean install dependencies
rm -rf node_modules
rm yarn.lock
yarn install
```

**Problem**: Port 5173 already in use

```powershell
# Solution: Use different port
yarn dev --port 3000
```

**Problem**: CORS errors in browser console

```powershell
# Solution: Check Django CORS settings in backend/ai_simulator_project/settings.py
# Ensure CORS_ALLOWED_ORIGINS includes http://localhost:5173
```

**Problem**: Blank screen after login

```powershell
# Solution: Check browser console for errors
# Clear browser cache and local storage
# Verify backend API is running
```

### Common Issues

**Problem**: Simulation running very slowly

- **Solution**: Reduce grid size or decrease speed multiplier
- Check browser console for performance warnings
- Ensure hardware acceleration is enabled in browser

**Problem**: Grid not centered properly

- **Solution**: Refresh page or resize browser window
- Check responsive design breakpoints
- Clear browser cache

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Ways to Contribute

1. **Report Bugs** - Found a bug? Open an issue with detailed steps to reproduce
2. **Suggest Features** - Have an idea? Create a feature request issue
3. **Improve Documentation** - Help make our docs clearer and more comprehensive
4. **Submit Code** - Fix bugs, add features, or improve performance
5. **Create Tutorials** - Write guides or create video tutorials
6. **Spread the Word** - Share the project with others who might benefit

### Development Workflow

1. **Fork the Repository**

   ```bash
   # Click "Fork" on GitHub
   git clone https://github.com/YOUR_USERNAME/AI-Algorithm-Simulator.git
   cd AI-Algorithm-Simulator
   ```

2. **Create a Feature Branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Your Changes**

   - Write clean, documented code
   - Follow existing code style
   - Add tests if applicable
   - Update documentation

4. **Test Your Changes**

   ```bash
   # Backend tests
   cd backend
   python manage.py test

   # Frontend tests
   cd frontend
   yarn test
   ```

5. **Commit and Push**

   ```bash
   git add .
   git commit -m "feat: add your feature description"
   git push origin feature/your-feature-name
   ```

6. **Create Pull Request**
   - Go to GitHub and create a PR
   - Describe your changes clearly
   - Link any related issues
   - Wait for review

### Code Style Guidelines

**Python (Backend)**

- Follow PEP 8 style guide
- Use meaningful variable names
- Add docstrings to functions and classes
- Keep functions small and focused

**TypeScript/React (Frontend)**

- Use functional components with hooks
- Follow React best practices
- Use TypeScript types consistently
- Keep components small and reusable

### Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect differing viewpoints and experiences
- Accept responsibility and apologize for mistakes

---

## 📄 License

This project is licensed under the **MIT License** - see below for details:

```
MIT License

Copyright (c) 2025 Atik203

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### What This Means

✅ **Commercial Use** - Use for commercial purposes  
✅ **Modification** - Modify the source code  
✅ **Distribution** - Distribute the software  
✅ **Private Use** - Use privately  
❌ **Liability** - No warranty or liability  
❌ **Warranty** - Provided "as is"

---

## 🙏 Acknowledgments

- **React Team** - For the amazing React library
- **Django Software Foundation** - For Django framework
- **shadcn** - For the beautiful UI components
- **Tailwind CSS** - For the utility-first CSS framework
- **Contributors** - Everyone who has contributed to this project

### Inspiration

This project was inspired by:

- [Pathfinding Visualizer](https://github.com/clementmihailescu/Pathfinding-Visualizer) by Clement Mihailescu
- [Algorithm Visualizer](https://github.com/algorithm-visualizer/algorithm-visualizer)
- Various AI/ML courses and textbooks

---

## 📞 Contact

**Developer**: Atik203

- **GitHub**: [@Atik203](https://github.com/Atik203)
- **Repository**: [AI-Algorithm-Simulator](https://github.com/Atik203/AI-Algorithm-Simulator)
- **Issues**: [GitHub Issues](https://github.com/Atik203/AI-Algorithm-Simulator/issues)

### Support

- 🐛 **Bug Reports**: [Create an issue](https://github.com/Atik203/AI-Algorithm-Simulator/issues/new)
- 💡 **Feature Requests**: [Create a feature request](https://github.com/Atik203/AI-Algorithm-Simulator/issues/new)
- 📧 **Email**: For private inquiries, contact via GitHub profile

---

## 🗺️ Roadmap

### Phase 1: Core Features ✅ (Completed)

- [x] 7 algorithm implementations
- [x] Interactive grid visualization
- [x] User authentication
- [x] Simulation history
- [x] Dark mode theme
- [x] Responsive design

### Phase 2: Enhancement 🚧 (In Progress)

- [ ] 7 additional algorithms
- [ ] Advanced statistics and charts
- [ ] Export simulation data (JSON, CSV)
- [ ] Share simulations via URL
- [ ] Algorithm parameter presets

### Phase 3: Advanced Features 📋 (Planned)

- [ ] WebSocket for real-time updates
- [ ] Collaborative simulation editing
- [ ] Custom algorithm scripting
- [ ] 3D visualization mode
- [ ] Mobile app (React Native)
- [ ] Educational tutorials and guides
- [ ] Algorithm complexity analyzer
- [ ] Multi-language support

### Phase 4: Community 🌟 (Future)

- [ ] User-submitted algorithms
- [ ] Community challenges
- [ ] Leaderboards
- [ ] Discussion forums
- [ ] Video tutorials
- [ ] API for third-party integrations

---

## 📊 Project Stats

- **Total Algorithms**: 7 (14 planned)
- **Code Lines**: ~15,000+ (Frontend + Backend)
- **Components**: 50+ React components
- **API Endpoints**: 10+
- **Supported Grid Sizes**: 5x5 to 50x50
- **Heuristic Functions**: 4 (Manhattan, Euclidean, Chebyshev, Octile)

---

## 🎓 Educational Resources

### Learning Materials

- **Algorithm Visualization** - [VisuAlgo](https://visualgo.net/)
- **AI Textbook** - "Artificial Intelligence: A Modern Approach" by Russell & Norvig
- **Pathfinding Algorithms** - [Red Blob Games](https://www.redblobgames.com/pathfinding/a-star/introduction.html)
- **Data Structures** - [GeeksforGeeks](https://www.geeksforgeeks.org/)

### Video Tutorials

- [A\* Pathfinding Visualization](https://www.youtube.com/watch?v=ySN5Wnu88nE)
- [Genetic Algorithms Explained](https://www.youtube.com/watch?v=9zfeTw-uFCw)
- [Dijkstra's Algorithm](https://www.youtube.com/watch?v=pVfj6mxhdMw)

---

## 💡 FAQ

**Q: Is this project free to use?**  
A: Yes! It's 100% free and open-source under MIT License.

**Q: Can I use this for my school/university project?**  
A: Absolutely! Just make sure to credit the original project.

**Q: How can I add a new algorithm?**  
A: Check the Contributing section and look at existing algorithm implementations in `backend/algorithms_app/algorithms.py`.

**Q: Does this work offline?**  
A: Not currently, but offline support is planned for future releases.

**Q: Can I deploy this to production?**  
A: Yes! Just change DEBUG=False in Django settings and use a production-grade database like PostgreSQL.

**Q: Why is my simulation slow?**  
A: Large grid sizes (40x40+) may be slow. Try reducing grid size or increasing visualization speed.

---

## 🔗 Useful Links

- **GitHub Repository**: https://github.com/Atik203/AI-Algorithm-Simulator
- **Live Demo**: (Coming Soon)
- **Documentation**: This README
- **Issue Tracker**: https://github.com/Atik203/AI-Algorithm-Simulator/issues
- **Discussions**: https://github.com/Atik203/AI-Algorithm-Simulator/discussions

---

<div align="center">

### ⭐ Star this repository if you find it helpful!

**Made with ❤️ for AI Lab Project**

[![GitHub stars](https://img.shields.io/github/stars/Atik203/AI-Algorithm-Simulator?style=social)](https://github.com/Atik203/AI-Algorithm-Simulator/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/Atik203/AI-Algorithm-Simulator?style=social)](https://github.com/Atik203/AI-Algorithm-Simulator/network/members)

**Happy Coding! 🚀**

</div>
