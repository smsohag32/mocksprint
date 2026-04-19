# MockSprint - Real-Time Interview Practice

## 🔐 Authentication Service

A robust, enterprise-grade authentication system built with **Redux Toolkit**, **RTK Query**, and **Cookie-based persistence**. This service handles secure login, session persistence, and automatic token re-authentication.

### 🚀 Key Features

- **Double-Token Strategy**: Uses `access_token` and `refresh_token` for optimal security.
- **Persistent State**: Authentication state is persisted via cookies, ensuring users stay logged in across page refreshes.
- **Automatic Re-auth**: Global interceptor in `baseApi` automatically handles `401 Unauthorized` errors by attempting a token refresh and retrying failed requests.
- **Centralized Slices**: All Redux state is organized in `src/store/slices/`.
- **Domain-Driven Hooks**: Auth hooks are grouped in `src/hooks/auth/`.

### 📂 Enterprise Architecture

| Path | Description |
| :--- | :--- |
| `src/api/base.api.ts` | The foundational RTK Query provider (`baseApi`). |
| `src/api/endpoints/` | Domain-specific API definitions (auth, user, etc.). |
| `src/store/slices/` | Centralized Redux slices (auth, theme). |
| `src/services/auth/` | Manual API actions (thunks) and logic. |
| `src/hooks/auth/` | High-level authentication hooks (`useAuth`, etc.). |
| `src/helpers/cookie.ts` | Utilities for managing browser cookies. |

### 🛠️ Usage Example

#### Accessing Auth State
```typescript
import { useAuth } from '@/hooks/auth/useAuth';

const Profile = () => {
  const { user, isAuthenticated, logout } = useAuth();
  // ...
};
```

### ⚙️ Configuration
The service relies on the following environment variables:
- `VITE_BASE_API_URL`: The base URL for all API calls.

---
