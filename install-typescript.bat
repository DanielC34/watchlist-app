@echo off
echo Installing TypeScript dependencies...
echo.

echo [1/2] Installing frontend dependencies...
cd frontend
call npm install
echo.

echo [2/2] Installing backend dependencies...
cd ..\backend
call npm install
echo.

echo ========================================
echo TypeScript setup complete!
echo ========================================
echo.
echo Next steps:
echo 1. Review TYPESCRIPT-MIGRATION.md for migration guide
echo 2. Run 'npm run type-check' to verify TypeScript setup
echo 3. Start migrating files from .js/.jsx to .ts/.tsx
echo.
pause
