# 🧠 AI Algorithm Simulator

### Interactive Visualization Platform for Search & Optimization Algorithms

[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Django](https://img.shields.io/badge/Django-5.x-092E20?logo=django)](https://www.djangoproject.com/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?logo=python)](https://www.python.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 🚀 Project Overview

**AI Algorithm Simulator** is a free, open-source interactive web platform that provides real-time visualization and execution of **7 powerful AI search and optimization algorithms**. The platform enables users to understand how different algorithms explore problem spaces, make decisions, and find solutions through step-by-step visual demonstrations.

### ✨ Implemented Algorithms

#### **Classic Search Algorithms** (4)

1. **A\* Search** - Informed search using heuristics for optimal pathfinding

   - Time: O(b^d) | Space: O(b^d) | Optimal: Yes (with admissible heuristic)
   - Use Cases: GPS navigation, game AI, robotics

2. **Breadth-First Search (BFS)** - Level-order traversal exploring all neighbors first

   - Time: O(V + E) | Space: O(V) | Optimal: Yes (unweighted graphs)
   - Use Cases: Shortest path in unweighted graphs, web crawling

3. **Depth-First Search (DFS)** - Explores as far as possible before backtracking

   - Time: O(V + E) | Space: O(h) | Optimal: No
   - Use Cases: Maze solving, topological sorting, cycle detection

4. **Dijkstra's Algorithm** - Shortest path algorithm for weighted graphs
   - Time: O((V + E) log V) | Space: O(V) | Optimal: Yes (non-negative weights)
   - Use Cases: Network routing, transportation systems

#### **Heuristic & Optimization Algorithms** (3)

5. **Hill Climbing** - Greedy local search climbing to peak

   - Time: O(∞) | Space: O(1) | Optimal: No (local optima)
   - Use Cases: Optimization problems, AI game playing

6. **Simulated Annealing** - Probabilistic technique accepting occasional worse moves

   - Time: O(∞) | Space: O(1) | Optimal: Probabilistically complete
   - Use Cases: VLSI design, scheduling, neural networks

7. **Genetic Algorithm** - Evolutionary optimization inspired by natural selection
   - Time: O(g × n × f) | Space: O(n) | Optimal: Probabilistically complete
   - Use Cases: Machine learning, scheduling, design optimization

### 🔮 Coming Soon (7 More Algorithms)

- Bidirectional BFS
- Depth-Limited DFS
- Iterative Deepening DFS
- Uniform Cost Search
- Stochastic Hill Climbing
- Random Restart Hill Climbing
- First-Choice Hill Climbing

---

## 🎯 Key Features

✅ **Real-time Visualization** - Watch algorithms explore the search space step-by-step  
✅ **Interactive Grid** - Draw obstacles, set start/goal points, create custom mazes  
✅ **Performance Metrics** - Track nodes explored, path cost, execution time  
✅ **Multiple Heuristics** - Manhattan, Euclidean, Chebyshev, Octile distances  
✅ **Speed Control** - Adjust playback speed from 0.1x to 10x  
✅ **User Authentication** - Save and track your simulation history  
✅ **Responsive Design** - Works seamlessly on desktop, tablet, and mobile  
✅ **Dark Mode** - Eye-friendly theme switching

---

## 🏗️ System Architecture

### **Frontend Stack**

- **React 18** with TypeScript for type safety
- **Vite** for lightning-fast development
- **Redux Toolkit** for state management
- **Tailwind CSS** + **shadcn/ui** for modern UI
- **Framer Motion** for smooth animations
- **Axios** for API communication

### **Backend Stack**

- **Django 5.1** with Python 3.11+
- **Django REST Framework** for RESTful APIs
- **JWT Authentication** for secure access
- **SQLite/PostgreSQL** for data persistence
- **CORS** enabled for cross-origin requests
- Core logic of A\*, BFS, DFS, Hill Climbing, etc.
- Returns simulation steps and results to frontend

**Data Flow**

1. User selects algorithm and parameters in frontend
2. React sends data via API request to Django
3. Django runs algorithm → generates state updates
4. React animates states and displays the final solution

---

## 🧩 Example Simulation Modes

| Simulation                       | Algorithms              | Concept Demonstrated          |
| -------------------------------- | ----------------------- | ----------------------------- |
| Maze Pathfinding                 | BFS, DFS, A\*, Dijkstra | Informed vs Uninformed Search |
| N-Queens Problem                 | Hill Climbing, Genetic  | Local Search Optimization     |
| 8-Puzzle Solver                  | A\*, BFS                | State-space Search            |
| Traveling Salesman Problem (TSP) | Simulated Annealing     | Optimization & Heuristic Cost |

Each mode visualizes how the algorithm explores the search space differently.

---

## 🧱 Tech Stack

| Layer                 | Technology                     | Description                           |
| --------------------- | ------------------------------ | ------------------------------------- |
| **Frontend**          | React.js (TypeScript)          | Interactive UI for visualization      |
| **Styling**           | Tailwind CSS + ShadCN UI       | Clean, modern UI design               |
| **Backend**           | Django + Django REST Framework | Handles computation & algorithm logic |
| **Language**          | Python 3.x                     | For AI algorithm implementation       |
| **State Management**  | Redux Toolkit                  | Stores simulation & grid data         |
| **Charts (optional)** | Recharts / Chart.js            | Algorithm performance graphs          |

---

## ⚙️ Features

- 🌐 Choose from multiple search algorithms
- 🧮 Adjust grid size, obstacles, start/goal nodes
- 🎞️ Step-by-step simulation with adjustable speed
- 📊 Compare algorithm performance (nodes expanded, time, path cost)
- 💾 Option to save or replay simulations
- 🎨 Interactive and educational visualization

---

## 🧠 Algorithms Implemented

| Algorithm                        | Category     | Description                                             |
| -------------------------------- | ------------ | ------------------------------------------------------- |
| **BFS (Breadth-First Search)**   | Uninformed   | Explores all neighbors level-wise until goal            |
| **DFS (Depth-First Search)**     | Uninformed   | Explores deeper nodes first                             |
| **A\***                          | Informed     | Uses `f(n) = g(n) + h(n)` heuristic for optimal path    |
| **Hill Climbing**                | Local Search | Moves to neighboring state with better heuristic        |
| **Simulated Annealing**          | Local Search | Accepts worse moves with decreasing probability         |
| **Genetic Algorithm (optional)** | Evolutionary | Optimizes using population-based mutation and crossover |

---

## 🧰 API Endpoints (Backend)

| Endpoint              | Method | Description                        |
| --------------------- | ------ | ---------------------------------- |
| `/api/run-algorithm/` | `POST` | Execute chosen algorithm           |
| `/api/algorithms/`    | `GET`  | Fetch list of available algorithms |
| `/api/simulations/`   | `GET`  | View saved simulation results      |

**Example Request:**

```json
POST /api/run-algorithm/
{
  "algorithm": "astar",
  "grid": [[0,0,1],[0,1,0],[0,0,0]],
  "start": [0,0],
  "goal": [2,2],
  "heuristic": "manhattan"
}
```
