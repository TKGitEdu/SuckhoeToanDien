/**
 * API Connection Startup Checker
 * 
 * This utility automatically checks the API connection when the app starts in development mode
 * and provides helpful messages in the console for troubleshooting.
 */

import { diagnoseConnectionIssue } from './api-debug';
import axios from 'axios';

// API endpoints to check
const HEALTH_CHECK_ENDPOINT = '/api/healthcheck';
const BACKEND_URL = 'https://localhost:7147';

/**
 * Check the API connection and log helpful messages
 */
export async function checkApiConnection() {
  // Only run in development mode
  if (import.meta.env.PROD) return;
  
  console.log('%c🔌 Checking API connection...', 'color: blue; font-weight: bold');
    try {
    // Try the proxied endpoint first
    console.log('Testing connection via Vite proxy...');
    try {
      const response = await axios.get(HEALTH_CHECK_ENDPOINT);
      if (response.status === 200) {
        console.log('%c✅ API connection successful via Vite proxy!', 'color: green; font-weight: bold');
        return;
      } else {
        console.warn(`⚠️ API returned status ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.warn(`⚠️ API proxy connection failed: ${error instanceof Error ? error.message : String(error)}`);
    }
    
    // If proxy fails, check direct connection
    console.log('Testing direct connection to backend...');
    const diagnosis = await diagnoseConnectionIssue(BACKEND_URL);
    console.log(`🔍 Diagnosis: ${diagnosis}`);
    
    // Provide helpful tips based on the diagnosis
    if (diagnosis.includes('CORS')) {
      console.log('%cCORS Issue Detected', 'font-weight: bold; color: orange');
      console.log(`
🔧 Solutions:
1. Configure your backend with the following CORS policy:
   builder.Services.AddCors(options => {
     options.AddPolicy("AllowAll", builder => {
       builder.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader()
              .WithExposedHeaders("Authorization");
     });
   });
   app.UseCors("AllowAll");

2. Make sure the Vite proxy is correctly configured in vite.config.ts
      `);
    } else if (diagnosis.includes('SSL')) {
      console.log('%cSSL Certificate Issue Detected', 'font-weight: bold; color: orange');
      console.log(`
🔧 Solutions:
1. Visit ${BACKEND_URL} directly in your browser and accept the certificate
2. Add the certificate to your trusted certificates store
3. For development only, you can configure your backend to also support HTTP

See src/lib/api-troubleshooting.md for detailed instructions.
      `);
    } else {
      console.log('%cGeneral Connection Issue', 'font-weight: bold; color: orange');
      console.log(`
🔧 Possible solutions:
1. Make sure your backend API is running at ${BACKEND_URL}
2. Check for any firewall or network issues
3. Verify the port number is correct

See src/lib/api-troubleshooting.md for more troubleshooting tips.
      `);
    }
  } catch (error) {
    console.error('❌ API connection check failed:', error);
  }
}

// Auto-run when this module is imported
if (import.meta.env.DEV) {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(checkApiConnection, 1000);
    });
  } else {
    setTimeout(checkApiConnection, 1000);
  }
}

export default checkApiConnection;
