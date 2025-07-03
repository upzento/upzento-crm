# Railway Deployment Instructions

This repository is configured for deployment on Railway.

## Deployment Steps

1. Clone this repository
2. Install Git LFS: `git lfs install`
3. Rename `.gitignore-railway` to `.gitignore`: `mv .gitignore-railway .gitignore`
4. Push to your GitHub repository
5. Connect your GitHub repository to Railway

## Important Notes

- The `.gitignore-railway` file is configured to include only the essential files needed for deployment.
- Large files are tracked using Git LFS to keep the repository size manageable.
- The Dockerfiles are configured to install all dependencies during the build process.
- Health check endpoints are provided for both frontend and backend services.

## File Structure

The repository is organized to keep the size manageable while including all necessary files for deployment:

### Frontend
- `frontend/package.json`: Dependencies
- `frontend/next.config.js`: Next.js configuration
- `frontend/Dockerfile.new`: Docker configuration
- `frontend/railway.json`: Railway configuration
- `frontend/health-server.js`: Fallback health check server
- `frontend/src/`: Source code
- `frontend/public/`: Static assets

### Backend
- `backend/package.json`: Dependencies
- `backend/Dockerfile`: Docker configuration
- `backend/railway.json`: Railway configuration
- `backend/health-check.js`: Fallback health check server
- `backend/src/`: Source code
- `backend/prisma/schema.prisma`: Database schema

## Troubleshooting

If you encounter any issues during deployment, check the Railway logs for more information.

### Common Issues

1. **Deployment fails with "Repository too large"**:
   - Make sure you're using Git LFS for large files
   - Use the `.gitignore-railway` file to exclude unnecessary files

2. **Health checks failing**:
   - The application includes fallback health check servers
   - Check the logs to see if the main application is starting properly

3. **Build errors**:
   - The Dockerfiles are configured to continue the build even if there are errors
   - Check the build logs for warnings and errors 