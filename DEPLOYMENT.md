# FitForge Buddy - Vercel Deployment Guide

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **MongoDB Database**: Set up a MongoDB database (MongoDB Atlas recommended)
3. **Environment Variables**: Prepare your environment variables

## Environment Variables Setup

Create a `.env` file in the root directory with the following variables:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fitforge-buddy

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# Cloudinary Configuration (if using image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Server Configuration
NODE_ENV=production

# CORS Origins (your Vercel domain)
CORS_ORIGINS=https://your-app-name.vercel.app
```

## Deployment Steps

### Quick Deployment (Recommended)

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy using the provided script**:
   ```bash
   # Make the script executable (Linux/Mac)
   chmod +x deploy.sh
   
   # Run the deployment script
   ./deploy.sh
   ```

   Or deploy manually:
   ```bash
   # Navigate to your project directory
   cd fitforge-buddy-main
   
   # Build the project
   npm run build
   
   # Deploy to Vercel
   vercel --prod
   ```

### Option 1: Deploy Frontend Only (Alternative)

1. **Deploy Backend Separately**:
   - Deploy your Express.js backend to Railway, Render, or Heroku
   - Update the API base URL in your frontend code

2. **Deploy Frontend to Vercel**:
   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Navigate to your project directory
   cd fitforge-buddy-main

   # Deploy to Vercel
   vercel
   ```

### Option 2: Full-Stack Deployment on Vercel

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Set Environment Variables**:
   - Go to your Vercel dashboard
   - Navigate to your project settings
   - Add all environment variables from the `.env` file

5. **Redeploy**:
   ```bash
   vercel --prod
   ```

## Configuration Files

### vercel.json
This file is already configured for your project and handles:
- Static file serving from the `dist` directory
- API route handling
- SPA routing (fallback to index.html)

### API Routes
The `/api` directory contains serverless functions that handle your backend logic.

## Post-Deployment

1. **Update CORS Origins**: Update the CORS configuration in `/api/index.js` with your actual Vercel domain
2. **Test API Endpoints**: Verify all API endpoints are working
3. **Monitor Logs**: Use Vercel dashboard to monitor function logs
4. **Set up Custom Domain** (Optional): Configure a custom domain in Vercel settings

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check that all dependencies are in `package.json`
   - Ensure TypeScript compilation passes
   - Verify environment variables are set

2. **API Errors**:
   - Check MongoDB connection string
   - Verify JWT secret is set
   - Monitor Vercel function logs

3. **CORS Issues**:
   - Update CORS origins in `/api/index.js`
   - Ensure frontend and backend domains match

### Performance Optimization

1. **Database Connection**: Use connection pooling for MongoDB
2. **Caching**: Implement Redis for session storage
3. **CDN**: Vercel automatically provides CDN for static assets

## Support

For issues specific to Vercel deployment, check:
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)
- [Vercel Support](https://vercel.com/support) 