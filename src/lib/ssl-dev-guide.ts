/**
 * Vite development SSL configuration guide
 * 
 * This file provides instructions for setting up a development environment
 * that can properly connect to a local HTTPS backend API.
 */

/**
 * SOLUTION 1: Configure CORS on your backend
 * 
 * Add the following to your .NET backend Startup.cs or Program.cs:
 * 
 * ```csharp
 * builder.Services.AddCors(options =>
 * {
 *     options.AddPolicy("CorsPolicy",
 *         builder => builder
 *             .AllowAnyOrigin()
 *             .AllowAnyMethod()
 *             .AllowAnyHeader()
 *             .WithExposedHeaders("Authorization"));
 * });
 * 
 * // Then in your app configuration:
 * app.UseCors("CorsPolicy");
 * ```
 */

/**
 * SOLUTION 2: Add SSL certificate to your browser's trusted certificates
 * 
 * For Chrome/Edge:
 * 1. Go to https://localhost:7147 in your browser
 * 2. Click on "Not secure" in the address bar
 * 3. Click "Certificate (Invalid)"
 * 4. Go to Details tab
 * 5. Click "Copy to File..." and follow the wizard to export the certificate
 * 6. Go to Chrome Settings > Privacy and security > Security > Manage certificates
 * 7. Go to "Trusted Root Certification Authorities" tab
 * 8. Click "Import" and select the exported certificate
 * 9. Restart your browser
 * 
 * For Firefox:
 * 1. Go to https://localhost:7147 in Firefox
 * 2. Click "Advanced" when the warning appears
 * 3. Click "Accept the Risk and Continue"
 * 4. Click the lock icon in the address bar
 * 5. Click "Connection secure" > "More Information"
 * 6. Click "View Certificate"
 * 7. Go to the "Details" tab
 * 8. Click "Export..." and save the certificate
 * 9. Go to Firefox Settings > Privacy & Security > Certificates > View Certificates
 * 10. Go to "Authorities" tab and click "Import"
 * 11. Select the exported certificate and check "Trust this CA to identify websites"
 * 12. Click "OK" and restart Firefox
 */

/**
 * SOLUTION 3: Configure Vite to proxy API requests
 * 
 * Update your vite.config.ts to include:
 * 
 * ```typescript
 * export default defineConfig({
 *   // ... other config
 *   server: {
 *     proxy: {
 *       '/api': {
 *         target: 'https://localhost:7147',
 *         changeOrigin: true,
 *         secure: false,
 *       }
 *     }
 *   }
 * });
 * ```
 * 
 * Then update your API base URL to use relative paths:
 * const API_BASE_URL = '/api';
 */

/**
 * SOLUTION 4: Disable certificate validation for development
 * 
 * WARNING: This is only for development. NEVER use this in production!
 * 
 * Create a setupProxy.js file in your project and add:
 * 
 * ```javascript
 * process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
 * ```
 * 
 * Then import this file early in your application startup.
 */

/**
 * SOLUTION 5: Use HTTP for development
 * 
 * If possible, configure your backend to also listen on an HTTP port
 * during development, and use that for frontend connections.
 */
