import { useState } from 'react';

/**
 * A debug component to test API connectivity
 * Include this in development environments to quickly test API connections
 */
export const ApiDebugger = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [result, setResult] = useState<string>('');
  
  const testConnection = async () => {
    setStatus('loading');
    setResult('');
    
    try {
      // Perform a simple GET request to the API
      const response = await fetch('/api/healthcheck');
      
      const text = await response.text();
      const headers = Object.fromEntries([...response.headers]);
      
      setResult(
        `Status: ${response.status} ${response.statusText}\n` +
        `Headers: ${JSON.stringify(headers, null, 2)}\n` +
        `Body: ${text}`
      );
      
      setStatus(response.ok ? 'success' : 'error');
    } catch (error) {
      console.error('API debug error:', error);
      setResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
      setStatus('error');
    }
  };
  
  // Only render in development mode
  if (import.meta.env.PROD) return null;
  
  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      backgroundColor: '#f0f0f0',
      border: '1px solid #ccc',
      borderRadius: '4px',
      padding: '10px',
      maxWidth: '400px',
      zIndex: 9999,
      fontSize: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <strong>API Debugger</strong>
        <button 
          onClick={testConnection}
          disabled={status === 'loading'}
          style={{
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '4px 8px',
            cursor: status === 'loading' ? 'not-allowed' : 'pointer',
            opacity: status === 'loading' ? 0.7 : 1,
          }}
        >
          {status === 'loading' ? 'Testing...' : 'Test Connection'}
        </button>
      </div>
      
      {status !== 'idle' && (
        <div style={{
          backgroundColor: status === 'success' ? '#d4edda' : status === 'error' ? '#f8d7da' : '#fff',
          padding: '8px',
          borderRadius: '4px',
          marginTop: '10px',
          maxHeight: '200px',
          overflow: 'auto',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}>
          {result || (status === 'loading' ? 'Testing connection...' : '')}
        </div>
      )}
      
      <div style={{ marginTop: '10px', fontSize: '10px', color: '#666' }}>
        API Base URL: {import.meta.env.VITE_API_URL || '/api'}
      </div>
    </div>
  );
};

/**
 * Function to check if a request is failing because of CORS or SSL issues
 */
export const diagnoseConnectionIssue = async (url: string): Promise<string> => {
  try {
    // First try a regular fetch to see if it works
    await fetch(url, { method: 'HEAD' });
    return 'Connection successful';
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    // Check for specific error patterns
    if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {      // Could be CORS or SSL
      try {
        // Try a no-cors request which bypasses CORS but can't read the response
        await fetch(url, { mode: 'no-cors' });
        
        // If we get here, it's likely a CORS issue rather than SSL
        return 'Likely a CORS issue. The server is reachable but is not configured to allow cross-origin requests.';
      } catch {
        // If even no-cors fails, it's likely an SSL issue
        return 'Likely an SSL certificate issue. The server is using a self-signed or invalid certificate.';
      }
    }
    
    if (errorMessage.includes('certificate') || errorMessage.includes('SSL')) {
      return 'SSL certificate issue. The server is using a self-signed or invalid certificate.';
    }
    
    return `Unknown connection issue: ${errorMessage}`;
  }
};

/**
 * Function to create a healthcheck API endpoint in express
 * 
 * Usage: 
 * ```
 * // In your express backend
 * import { createHealthCheckEndpoint } from './api-debug';
 * 
 * const app = express();
 * createHealthCheckEndpoint(app);
 * ```
 */
export const createHealthCheckEndpoint = (app: any) => {
  app.get('/api/healthcheck', (_req: any, res: any) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
    });
  });
};
