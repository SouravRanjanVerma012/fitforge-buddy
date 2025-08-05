# FitForge Buddy - Troubleshooting Guide

## White Screen Issues

### Quick Diagnostic Steps

1. **Open Browser Developer Tools** (F12)
   - Check the Console tab for JavaScript errors
   - Check the Network tab for failed requests
   - Look for any CORS errors or 404/500 responses

2. **Use Diagnostic Tool**
   - Press `Ctrl+Shift+D` to open the diagnostic panel
   - Check environment variables and API connection status
   - Review browser information

3. **Check Environment Variables**
   - Ensure `VITE_API_URL` is set in Vercel dashboard
   - Verify the API URL points to your deployed backend

### Common Causes and Solutions

#### 1. Environment Variables Not Set

**Problem**: `VITE_API_URL` is undefined, causing API calls to fail.

**Solution**:
1. Go to your Vercel dashboard
2. Navigate to your project settings
3. Go to Environment Variables section
4. Add `VITE_API_URL` with your API URL (e.g., `https://your-app.vercel.app/api`)

#### 2. API Connection Issues

**Problem**: Frontend can't connect to backend API.

**Solutions**:
1. **Check API URL**: Ensure `VITE_API_URL` points to the correct endpoint
2. **CORS Issues**: Verify CORS configuration in `api/index.js`
3. **API Health Check**: Visit `/api/health` directly to test API

#### 3. JavaScript Errors

**Problem**: Unhandled JavaScript errors causing app to crash.

**Solutions**:
1. Check browser console for error messages
2. Use the Error Boundary component (should show error details)
3. Verify all imports are correct
4. Check for missing dependencies

#### 4. Build Issues

**Problem**: Build succeeds but runtime fails.

**Solutions**:
1. Check Vercel build logs for warnings
2. Verify all files are properly bundled
3. Test locally with `npm run build && npm run preview`

### Environment Variables Checklist

Make sure these are set in your Vercel dashboard:

```env
# Required for API connection
VITE_API_URL=https://your-app.vercel.app/api

# Backend environment variables
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

### API Configuration

#### CORS Settings
The API is configured to allow requests from:
- Production: Your Vercel domain
- Development: Localhost ports 8080-8090

#### Health Check Endpoint
Test your API with: `https://your-app.vercel.app/api/health`

### Debugging Steps

1. **Local Testing**:
   ```bash
   npm run build
   npm run preview
   ```

2. **Check Network Requests**:
   - Open browser dev tools
   - Go to Network tab
   - Refresh page
   - Look for failed requests

3. **Console Logging**:
   - Check for any console.error messages
   - Look for unhandled promise rejections

4. **API Testing**:
   ```bash
   curl https://your-app.vercel.app/api/health
   ```

### Common Error Messages

#### "Cannot resolve module"
- Check import paths
- Verify file exists
- Check for case sensitivity

#### "CORS error"
- Verify CORS configuration
- Check API URL
- Ensure proper headers

#### "Network error"
- Check API URL
- Verify server is running
- Check firewall/network settings

### Vercel-Specific Issues

#### Build Cache Issues
```bash
# Clear build cache
vercel --force
```

#### Environment Variables Not Loading
- Ensure variables start with `VITE_` for frontend
- Check variable names are correct
- Redeploy after adding variables

#### Serverless Function Timeouts
- Check function execution time
- Optimize database queries
- Consider increasing timeout limits

### Getting Help

1. **Check Logs**: Use Vercel dashboard to view deployment and function logs
2. **Diagnostic Tool**: Use `Ctrl+Shift+D` in the app
3. **Console Errors**: Check browser developer tools
4. **Network Tab**: Look for failed API requests

### Emergency Recovery

If the app is completely broken:

1. **Revert to Previous Deployment**:
   - Go to Vercel dashboard
   - Find a working deployment
   - Redeploy that version

2. **Checkout Previous Commit**:
   ```bash
   git log --oneline
   git checkout <previous-commit-hash>
   git push origin main --force
   ```

3. **Rebuild from Scratch**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   vercel --prod
   ```

### Performance Optimization

1. **Bundle Size**: Check for large dependencies
2. **Image Optimization**: Use WebP format
3. **Code Splitting**: Implement lazy loading
4. **Caching**: Configure proper cache headers

### Security Checklist

1. **Environment Variables**: Never commit secrets
2. **CORS**: Restrict to necessary domains
3. **Rate Limiting**: Implement API rate limits
4. **Input Validation**: Validate all user inputs
5. **HTTPS**: Ensure all connections use HTTPS

### Monitoring

1. **Vercel Analytics**: Enable for performance monitoring
2. **Error Tracking**: Implement error reporting
3. **Uptime Monitoring**: Set up health checks
4. **Performance Monitoring**: Track Core Web Vitals 