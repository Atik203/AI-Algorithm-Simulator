# Logs Dashboard Frontend

A modern, responsive logs management dashboard built with Vite, React 19, TypeScript, and Tailwind CSS v4.

## 🚀 Tech Stack

- **Build Tool**: Vite 5 with automatic JSX runtime
- **Framework**: React 19 with TypeScript 5.5.4
- **Styling**: Tailwind CSS v4 + CSS custom properties for theming
- **UI Components**: shadcn/ui primitives with custom components
- **Routing**: React Router 7.9.3 with browser router
- **State Management**: React hooks + Axios for API calls
- **Authentication**: JWT with automatic token refresh
- **Charts**: Recharts for data visualization
- **Notifications**: Sonner with dark theme support
- **Package Manager**: Yarn 4 (node-modules linker)

## 📁 Project Structure

```
frontend/
├── src/
│   ├── api/                 # API services and authentication
│   │   ├── api.ts          # Main API client and endpoints
│   │   └── auth.ts         # JWT authentication service
│   ├── components/         # Reusable components
│   │   ├── ui/            # shadcn/ui primitives
│   │   ├── DashboardLayout.tsx  # Main layout with sidebar
│   │   ├── FilterPanel.tsx      # Log filtering interface
│   │   ├── LogTable.tsx         # Data table component
│   │   ├── TrendChart.tsx       # Analytics charts
│   │   └── ...
│   ├── pages/             # Route components
│   │   ├── Dashboard.tsx  # Analytics dashboard
│   │   ├── LogList.tsx    # Logs list with filtering
│   │   ├── LogDetail.tsx  # Individual log view/edit
│   │   ├── CreateLog.tsx  # Create new log entry
│   │   ├── Login.tsx      # Authentication pages
│   │   └── Register.tsx
│   ├── lib/               # Utility functions
│   │   └── utils.ts       # cn() class merger and helpers
│   ├── app.css           # Tailwind imports + design tokens
│   └── main.tsx          # App entry point with router
├── components.json       # shadcn/ui configuration
├── tailwind.config.ts    # Tailwind CSS v4 configuration
├── vite.config.ts        # Vite configuration with aliases
└── package.json          # Dependencies and scripts
```

## 🛠️ Prerequisites

- **Node.js**: 18.0.0 or higher
- **Yarn**: 4.9.4 (configured via packageManager field)
- **Backend**: Django API server running on port 8000

## 📦 Installation

1. **Clone and navigate to frontend directory**

   ```bash
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   yarn install
   ```

3. **Environment setup** (optional)
   Create `.env` file for custom configuration:
   ```env
   VITE_API_BASE_URL=http://localhost:8000
   ```

## 🚦 Development

### Start Development Server

```bash
yarn dev
```

- Launches on `http://localhost:5173`
- Hot module replacement enabled
- Automatic browser refresh on changes

### Build for Production

```bash
yarn build
```

- TypeScript compilation check
- Optimized production bundle in `dist/`
- Asset optimization and minification

### Preview Production Build

```bash
yarn preview
```

- Serves production build locally
- Test production optimizations

### Code Quality

```bash
# Type checking
yarn typecheck

# Linting
yarn lint
```

## 🎨 Styling & Theming

### Tailwind CSS v4

- Single import: `@import "tailwindcss";` in `app.css`
- Custom properties for theming in `:root` and `.dark`
- Responsive design with mobile-first approach

### Adding New Components

```bash
# Add shadcn/ui components
npx shadcn@latest add button
npx shadcn@latest add card
```

## 🔐 Authentication

### JWT Flow

- Automatic token refresh via Axios interceptors
- Protected routes with `<ProtectedRoute>`
- User session persistence in localStorage
- Logout with token cleanup

## 📊 Features

### Dashboard Analytics

- Real-time log statistics
- Severity distribution charts
- Source-based filtering
- Time-based trend analysis

### Log Management

- **List View**: Paginated table with filtering
- **Detail View**: Individual log inspection and editing
- **Create**: New log entry form
- **Export**: CSV download functionality

### Real-time Updates

- WebSocket connection for live log streaming
- Automatic UI updates for new entries
- Connection status indicators

### Advanced Filtering

- Text search across message and source
- Severity level selection
- Date/time range filtering
- Source-based filtering
- User filter preferences (saved to backend)

## 🌐 API Integration

### Base Configuration

```typescript
// src/api/api.ts
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
```

### Available Endpoints

- `GET /api/logs/` - List logs with filtering
- `POST /api/logs/` - Create new log
- `GET /api/logs/{id}/` - Get log details
- `PUT /api/logs/{id}/` - Update log
- `DELETE /api/logs/{id}/` - Delete log
- `GET /api/logs/export/` - CSV export
- `POST /api/auth/login/` - User authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/refresh/` - Token refresh

## 🎯 Path Aliases

Configured in `tsconfig.json` and `vite.config.ts`:

```typescript
import { Button } from "@components/ui/button";
import { authService } from "@api/auth";
import { cn } from "@lib/utils";
```

## 📱 Responsive Design

### Breakpoints

- **Mobile**: < 768px (1-column layout)
- **Tablet**: 768px - 1024px (2-column layout)
- **Desktop**: > 1024px (full sidebar + content)

### Mobile Features

- Collapsible sidebar with overlay
- Touch-friendly interface
- Optimized form layouts
- Responsive data tables

## 🔧 Customization

### Adding New Pages

1. Create component in `src/pages/`
2. Add route in `src/main.tsx`
3. Update navigation in `DashboardLayout.tsx`

### Extending API

1. Add endpoint in `src/api/api.ts`
2. Create TypeScript interfaces
3. Implement error handling

### Custom UI Components

1. Follow shadcn/ui patterns
2. Use `class-variance-authority` for variants
3. Export from `src/components/ui/`

## 🚨 Troubleshooting

### Common Issues

**Build Errors**

```bash
# Clear cache and reinstall
rm -rf node_modules yarn.lock
yarn install
```

**Import Resolution**

- Ensure path aliases are configured in both `tsconfig.json` and `vite.config.ts`
- Use `@components/` prefix for components

**API Connection**

- Verify backend is running on port 8000
- Check CORS configuration in Django
- Confirm JWT tokens are being sent

### Development Tips

- Use React DevTools for component debugging
- Check Network tab for API call inspection
- Enable verbose logging in development

## 🔄 WebSocket Integration

Real-time log streaming via Django Channels:

```typescript
// Automatic connection management
const wsUrl = `ws://localhost:8000/ws/logs/`;
// Handles reconnection and error states
```

## 📈 Performance

### Optimizations Applied

- Code splitting with React.lazy()
- Automatic bundle optimization via Vite
- CSS purging for production builds
- Asset compression and caching
- Tree shaking for unused code elimination
