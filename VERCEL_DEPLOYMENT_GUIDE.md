# Vercel Deployment Guide for FitForge Buddy

This guide will help you deploy your FitForge Buddy application to Vercel.

## Prerequisites

- Vercel account (sign up at [vercel.com](https://vercel.com))
- MongoDB Atlas cluster with connection string
- GitHub repository with your code

## Step 1: Environment Variables Setup

Add the following environment variables to your Vercel project:

### Required Variables:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority&appName=your-app-name
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=production
```

### Optional Variables:
```
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

## Step 2: Vercel Deployment

### Option A: Deploy via Vercel CLI
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts to deploy

### Option B: Deploy via GitHub Integration
1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect the configuration
3. Set up environment variables in Vercel dashboard

### Option C: Deploy via Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Import from GitHub
4. Configure build settings

## Step 3: Build Configuration

Vercel will automatically:
- Build the frontend using `npm run build`
- Deploy the backend API as serverless functions
- Serve static files from the `dist` directory

## Step 4: Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Update DNS records as instructed

## Step 5: Environment Variables in Vercel

Add your environment variables in the Vercel dashboard:
1. Go to your project
2. Settings → Environment Variables
3. Add all variables from `.env.vercel`

## Important Notes

1. **MongoDB Connection**: Ensure your MongoDB Atlas cluster allows connections from anywhere (0.0.0.0/0) or add Vercel's IP ranges
2. **CORS**: The server is configured to accept requests from Vercel domains
3. **Build Time**: The build may take a few minutes due to the large dependency tree
4. **Serverless Functions**: API routes are deployed as serverless functions with 30-second timeout

## Troubleshooting

### Common Issues:

1. **MongoDB Connection Failed**
   - Check MongoDB URI format
   - Verify network access in MongoDB Atlas
   - Ensure credentials are correct

2. **Build Failures**
   - Check node version compatibility
   - Verify all dependencies are in package.json

3. **CORS Errors**
   - Verify FRONTEND_URL environment variable is set
   - Check CORS configuration in server.js

### Vercel Support:

- [Vercel Documentation](https://vercel.com/docs)
- [Serverless Functions](https://vercel.com/docs/functions)
- [Environment Variables](https://vercel.com/docs/projects/environment-variables)

## Monitoring

After deployment:
1. Check the deployment logs in Vercel dashboard
2. Test the health endpoint: `GET /api/health`
3. Verify API endpoints are working
4. Test frontend functionality

## Rollback

If deployment fails:
1. Use Vercel's rollback feature
2. Check deployment logs for errors
3. Fix issues and redeploy

## Continuous Deployment

Vercel supports automatic deployments on git push to main branch. Ensure your main branch is always deployable.
