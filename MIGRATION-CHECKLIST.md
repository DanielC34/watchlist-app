# TypeScript Migration Checklist

## Setup Phase
- [x] Create tsconfig.json files
- [x] Create type definitions
- [x] Update package.json files
- [x] Create migration documentation
- [ ] Install dependencies (`install-typescript.bat`)
- [ ] Verify setup (`npm run type-check`)

## Frontend Migration

### Core Types & Utilities
- [x] `src/types/index.ts` - Type definitions
- [x] `src/store/useAuthStore.jsx` → `.ts`
- [ ] `src/store/useWatchlistStore.jsx` → `.ts`
- [ ] `src/api/watchlistApi.jsx` → `.ts`
- [ ] `src/utilities/api.js` → `.ts`

### Components
- [ ] `src/components/Header.jsx` → `.tsx`
- [ ] `src/components/Navbar.jsx` → `.tsx`
- [ ] `src/components/AddToWatchlistButton.jsx` → `.tsx`
- [ ] `src/components/LogoutModal.jsx` → `.tsx`
- [ ] `src/components/ProtectedRoute.jsx` → `.tsx`

### Pages - Authentication
- [ ] `src/pages/auth/Login.jsx` → `.tsx`
- [ ] `src/pages/auth/Signup.jsx` → `.tsx`
- [ ] `src/pages/profile/Profile.jsx` → `.tsx`

### Pages - Content
- [ ] `src/pages/Home.jsx` → `.tsx`
- [ ] `src/pages/movies/Movies.jsx` → `.tsx`
- [ ] `src/pages/shows/Shows.jsx` → `.tsx`
- [ ] `src/pages/details/Details.jsx` → `.tsx`
- [ ] `src/pages/history/History.jsx` → `.tsx`

### Pages - Watchlist
- [ ] `src/pages/watchlist/CreateWatchlist.jsx` → `.tsx`
- [ ] `src/pages/watchlist/DeleteWatchlist.jsx` → `.tsx`
- [ ] `src/pages/watchlist/AddItemToWatchlistModal.jsx` → `.tsx`
- [ ] `src/pages/watchlist/WatchlistDetails.jsx` → `.tsx`

### Root Files
- [ ] `src/App.jsx` → `.tsx`
- [ ] `src/main.jsx` → `.tsx`

## Backend Migration

### Types & Models
- [x] `types/index.ts` - Type definitions
- [ ] `models/User.js` → `.ts`
- [ ] `models/Watchlist.js` → `.ts`

### Controllers
- [ ] `controllers/authController.js` → `.ts`
- [ ] `controllers/userController.js` → `.ts`
- [ ] `controllers/watchlistController.js` → `.ts`

### Middleware
- [ ] `middleware/authMiddleware.js` → `.ts`

### Routes
- [ ] `routes/auth.js` → `.ts`
- [ ] `routes/user.js` → `.ts`
- [ ] `routes/watchlist.js` → `.ts`
- [ ] `routes/csrf.js` → `.ts`

### Services & Config
- [ ] `services/userService.js` → `.ts`
- [ ] `config/db.js` → `.ts`

### Root Files
- [ ] `server.js` → `.ts`

## Testing & Validation

### After Each File Migration
- [ ] Run `npm run type-check` to verify no type errors
- [ ] Test the functionality in the browser/server
- [ ] Commit changes with descriptive message

### Final Validation
- [ ] All frontend files migrated
- [ ] All backend files migrated
- [ ] `npm run type-check` passes in frontend
- [ ] `npm run type-check` passes in backend
- [ ] `npm run build` succeeds in frontend
- [ ] `npm run build` succeeds in backend
- [ ] Application runs without errors
- [ ] All features work as expected

## Migration Strategy

1. **Phase 1: Foundation** (Completed ✓)
   - Setup TypeScript configuration
   - Create type definitions
   - Migrate one example file

2. **Phase 2: Core Logic** (Next)
   - Migrate stores and API utilities
   - These are used throughout the app

3. **Phase 3: Components**
   - Start with simple components
   - Move to complex components

4. **Phase 4: Pages**
   - Migrate page components
   - Test each page after migration

5. **Phase 5: Backend**
   - Migrate models first
   - Then controllers and middleware
   - Finally routes and server

6. **Phase 6: Cleanup**
   - Remove old .js/.jsx files
   - Update imports
   - Final testing

## Notes
- Keep the old .jsx/.js files until the .ts/.tsx version is tested
- Update imports in other files after migration
- Use `useAuthStore.ts` as a reference for patterns
- Test frequently to catch issues early
