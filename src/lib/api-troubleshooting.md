# Backend API Connection Troubleshooting Guide

This guide provides solutions for common issues when connecting the frontend to the backend API during development.

## Current Setup

- Frontend: Vite React app running on `http://localhost:5173` (or similar port)
- Backend: .NET API running on `https://localhost:7147`
- Connection method: Vite proxy (configured in `vite.config.ts`)

## How to Use the API Debug Tools

1. The API Debugger component appears in the bottom right corner of the app in development mode
2. Click "Test Connection" to check if the API is reachable
3. For more detailed testing, add the `ApiTester` component to any page:

```tsx
import { ApiTester } from '../lib/api-tester';

// Then in your component:
<ApiTester />
```

## Common Issues and Solutions

### 1. CORS Errors

**Symptoms:**
- Console errors containing "CORS policy" or "Access-Control-Allow-Origin"
- API calls fail with status 0 or network errors
- Works in Postman but not in the browser

**Solutions:**

#### A. Update backend CORS configuration

Add to your backend's `Program.cs` or `Startup.cs`:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader()
               .WithExposedHeaders("Authorization");
    });
});

// In the Configure method:
app.UseCors("AllowAll");
```

#### B. Use Vite's proxy (already configured)

The current setup uses Vite's proxy to avoid CORS issues. This should work for most scenarios.

### 2. SSL Certificate Issues

**Symptoms:**
- Console errors containing "SSL" or "certificate"
- API calls fail with network errors

**Solutions:**

#### A. Accept the backend's certificate

1. Navigate directly to `https://localhost:7147` in your browser
2. Click "Advanced" and then "Accept the Risk and Continue" (Firefox) or "Proceed" (Chrome)
3. Return to your app and try again

#### B. Add the certificate to your trusted certificates

**For Windows:**
1. Go to `https://localhost:7147` in Edge/Chrome
2. Click the padlock icon > Certificate > Details > Copy to File
3. Export as DER format
4. Open certmgr.msc (Certificate Manager)
5. Navigate to Trusted Root Certification Authorities > Certificates
6. Right-click > Import the exported certificate
7. Restart your browser

### 3. Authentication Issues

**Symptoms:**
- Login appears to succeed but you don't get redirected
- Authenticated requests fail with 401 errors
- Token is not being stored or sent correctly

**Solutions:**

#### A. Check token storage

Open DevTools > Application > Local Storage and verify the token is stored correctly.

#### B. Check token format

Ensure the token is in the correct format (Bearer token) and is being sent in the Authorization header.

#### C. Check token expiration

JWT tokens have an expiration time. Verify that your token is not expired.

### 4. API Endpoint Mismatches

**Symptoms:**
- 404 errors on API calls
- Method not allowed errors (405)

**Solutions:**

#### A. Double-check API URLs

Ensure your API endpoint paths match what the backend expects.

#### B. Check HTTP methods

Verify you're using the correct HTTP method (GET, POST, PUT, DELETE) for each endpoint.

### 5. Network Connectivity

**Symptoms:**
- All API calls fail
- "Failed to fetch" errors

**Solutions:**

#### A. Verify backend is running

Make sure your backend service is actually running and accessible.

#### B. Check ports

Ensure the port specified in the API base URL matches the port your backend is running on.

## Contact Support

If you continue to experience issues after trying these solutions, please contact the development team with:

1. Screenshots of any error messages
2. Description of steps to reproduce the issue
3. Details of your environment (OS, browser, etc.)

You can also open an issue on the project's GitHub repository.
