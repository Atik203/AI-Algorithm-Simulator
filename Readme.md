# 🧠 AI Search Algorithm Simulator

### Interactive Visualization of Informed and Local Search Algorithms using React.js + Django

---

## 🚀 Project Overview

**AI Search Algorithm Simulator** is an interactive web-based platform that visualizes and compares different **AI search algorithms** such as:

- A\* Search
- BFS (Breadth-First Search)
- DFS (Depth-First Search)
- Hill Climbing
- Simulated Annealing
- Genetic Algorithm (optional)

The project demonstrates how these algorithms explore a problem space, find optimal or near-optimal solutions, and can be applied in **pathfinding**, **puzzle solving**, and **optimization** contexts.

This project aligns with key topics from the **AI Lab curriculum**, including:  
✅ Basics of Data Science with Python  
✅ Informed Search Strategies  
✅ Local Search & Variants  
✅ Concept of Training and Validation  
✅ A\* Search Algorithm

---

## 🎯 Project Objectives

1. Implement multiple **AI search algorithms** in Python.
2. Build a backend API with **Django REST Framework** to process simulation data.
3. Create a **React.js + TypeScript frontend** for visualization and user interaction.
4. Enable **real-time simulation** of algorithms (step-by-step visualization).
5. Compare algorithm performance based on time, steps, and optimality.

---

## 🏗️ System Architecture

**Frontend (React.js + TypeScript)**

- Dynamic grid/map for user input
- Controls for algorithm selection, speed, and simulation start
- Visual representation of nodes explored & final path
- Statistics panel showing performance metrics

**Backend (Django + DRF)**

- API endpoints for executing algorithms
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
