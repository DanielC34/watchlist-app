# FilmVault Deployment Guide

## Render Deployment Instructions

### Prerequisites
1. Create accounts on:
   - [Render](https://render.com)
   - [MongoDB Atlas](https://www.mongodb.com/atlas)

### Backend Deployment

1. **Create MongoDB Atlas Database**
   - Create a new cluster
   - Create a database user
   - Get connection string
   - Whitelist Render's IP addresses (0.0.0.0/0 for simplicity)

2. **Deploy Backend on Render**
   - Connect your GitHub repository
   - Create a new Web Service
   - Use these settings:
     - **Build Command**: `cd backend && npm install`
     - **Start Command**: `cd backend && npm start`
     - **Environment Variables**:
       - `NODE_ENV`: `production`
       - `MONGO_URI`: Your MongoDB Atlas connection string
       - `JWT_SECRET`: Generate a secure random string
       - `SESSION_SECRET`: Generate a secure random string
       - `MOVIEDB_API_KEY`: Your TMDB API key
       - `FRONTEND_URL`: Will be your frontend URL (add after frontend deployment)

### Frontend Deployment

1. **Deploy Frontend on Render**
   - Create a new Static Site
   - Use these settings:
     - **Build Command**: `cd frontend && npm install && npm run build`
     - **Publish Directory**: `frontend/dist`
     - **Environment Variables**:
       - `VITE_MOVIEDB_API_KEY`: Your TMDB API key
       - `VITE_ROOT_URL`: Your backend service URL
       - `VITE_API_URL`: Your backend service URL + `/api`
       - `VITE_API_TIMEOUT`: `10000`
       - `VITE_TMDB_BASE_URL`: `https://api.themoviedb.org/3`
       - `VITE_ITEMS_PER_PAGE`: `30`
       - `VITE_TMDB_IMAGE_BASE_URL`: `https://image.tmdb.org/t/p/w500`

2. **Update Backend CORS**
   - Add your frontend URL to the `FRONTEND_URL` environment variable in backend
   - Redeploy backend service

### Security Notes
- All CSRF protection is implemented
- CORS is properly configured
- Environment variables are used for sensitive data
- Session cookies are secure in production

### Troubleshooting
- Check Render logs for deployment issues
- Ensure all environment variables are set
- Verify MongoDB connection string is correct
- Make sure CORS origins include your frontend URL