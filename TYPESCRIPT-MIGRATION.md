# TypeScript Migration Guide

## Overview
This guide outlines the steps to migrate the FilmVault application from JavaScript to TypeScript.

## Setup Complete ✓

### Frontend
- ✓ `tsconfig.json` - TypeScript configuration
- ✓ `tsconfig.node.json` - Node/Vite configuration
- ✓ `src/types/index.ts` - Type definitions

### Backend
- ✓ `tsconfig.json` - TypeScript configuration
- ✓ `types/index.ts` - Type definitions

## Installation Steps

### Frontend Dependencies
```bash
cd frontend
npm install --save-dev typescript @types/node
```

### Backend Dependencies
```bash
cd backend
npm install --save-dev typescript @types/node @types/express @types/bcryptjs @types/jsonwebtoken @types/cors @types/cookie-parser ts-node
```

## Migration Strategy

### Phase 1: Rename Files (Gradual Approach)
Start by renaming `.js` and `.jsx` files to `.ts` and `.tsx`:

**Frontend Priority Files:**
1. `src/types/index.ts` (already created)
2. `src/store/useAuthStore.jsx` → `useAuthStore.ts`
3. `src/store/useWatchlistStore.jsx` → `useWatchlistStore.ts`
4. `src/api/watchlistApi.jsx` → `watchlistApi.ts`
5. `src/utilities/api.js` → `api.ts`
6. Components: `.jsx` → `.tsx`

**Backend Priority Files:**
1. `types/index.ts` (already created)
2. `models/User.js` → `User.ts`
3. `models/Watchlist.js` → `Watchlist.ts`
4. `controllers/*.js` → `*.ts`
5. `middleware/authMiddleware.js` → `authMiddleware.ts`
6. `routes/*.js` → `*.ts`
7. `server.js` → `server.ts`

### Phase 2: Add Type Annotations
After renaming, add type annotations to:
- Function parameters
- Function return types
- State variables
- Props interfaces

### Phase 3: Update Build Scripts

**Frontend `package.json`:**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "type-check": "tsc --noEmit"
  }
}
```

**Backend `package.json`:**
```json
{
  "scripts": {
    "start": "node dist/server.js",
    "dev": "ts-node server.ts",
    "build": "tsc",
    "type-check": "tsc --noEmit"
  }
}
```

## Example Migrations

### Store Migration Example
```typescript
// Before: useAuthStore.jsx
const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  // ...
}));

// After: useAuthStore.ts
import { create } from 'zustand';
import { AuthState, User } from '../types';

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  // ...
}));
```

### Component Migration Example
```typescript
// Before: AddToWatchlistButton.jsx
const AddToWatchlistButton = ({ item }) => {
  // ...
};

// After: AddToWatchlistButton.tsx
import { Movie } from '../types';

interface Props {
  item: Movie;
}

const AddToWatchlistButton: React.FC<Props> = ({ item }) => {
  // ...
};
```

### Backend Controller Example
```typescript
// Before: authController.js
const register = async (req, res) => {
  const { username, email, password } = req.body;
  // ...
};

// After: authController.ts
import { Response } from 'express';
import { AuthRequest } from '../types';

export const register = async (req: AuthRequest, res: Response): Promise<void> => {
  const { username, email, password } = req.body;
  // ...
};
```

## Benefits
- Type safety and early error detection
- Better IDE autocomplete and IntelliSense
- Improved code documentation
- Easier refactoring
- Reduced runtime errors

## Notes
- TypeScript allows gradual migration - `.js` and `.ts` files can coexist
- Start with type definitions and core files
- Use `any` type sparingly during migration
- Run `npm run type-check` frequently to catch errors
