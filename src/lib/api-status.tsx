import { useEffect, useState } from 'react';
import { axiosApi, axiosInstance } from './axios-api';

interface ApiStatusProps {
  onStatusChange?: (isConnected: boolean) => void;
}

export const ApiStatus = ({ onStatusChange }: ApiStatusProps) => {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Try to make a simple request to the API
        const result = await axiosApi.test();
        
        if (result.success) {
          setStatus('connected');
          onStatusChange?.(true);
        } else {
          setStatus('error');
          setErrorDetails(result.error || 'Unknown error');
          onStatusChange?.(false);
        }
      } catch (error) {
        console.error('API connection check failed:', error);
        setStatus('error');
        setErrorDetails(
          error instanceof Error ? error.message : 'Failed to connect to API'
        );
        onStatusChange?.(false);
      }
    };

    checkConnection();
  }, [onStatusChange]);

  // Only show in development mode
  if (import.meta.env.PROD) return null;

  if (status === 'checking') {
    return (
      <div className="fixed bottom-4 right-4 bg-gray-100 p-3 rounded-lg shadow-md z-50">
        <div className="flex items-center space-x-2">
          <div className="animate-pulse h-3 w-3 bg-yellow-500 rounded-full"></div>
          <span className="text-sm font-medium">Checking API connection...</span>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="fixed bottom-4 right-4 bg-red-50 border border-red-200 p-3 rounded-lg shadow-md z-50 max-w-md">
        <div className="flex items-start space-x-2">
          <div className="h-3 w-3 bg-red-500 rounded-full mt-1"></div>
          <div>
            <span className="text-sm font-medium block">API Connection Error</span>
            <span className="text-xs text-red-700 block">{errorDetails}</span>
            <button 
              onClick={() => window.location.reload()}
              className="text-xs mt-2 bg-red-100 hover:bg-red-200 text-red-800 py-1 px-2 rounded"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-green-50 p-3 rounded-lg shadow-md z-50 opacity-70 hover:opacity-100 transition-opacity duration-200">
      <div className="flex items-center space-x-2">
        <div className="h-3 w-3 bg-green-500 rounded-full"></div>
        <span className="text-sm font-medium">API Connected</span>
      </div>
    </div>
  );
};

/**
 * Higher-order component that adds API status checking functionality
 * and shows an error message if the API is not reachable
 */
export function withApiCheck<P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> {
  return (props: P) => {
    const [isApiConnected, setIsApiConnected] = useState<boolean | null>(null);

    return (
      <>
        <Component {...props} isApiConnected={isApiConnected} />
        <ApiStatus onStatusChange={setIsApiConnected} />
      </>
    );
  };
}

/**
 * Utility function to check if the API is reachable
 */
export const checkApiConnection = async (): Promise<boolean> => {
  try {
    const response = await axiosInstance.get('/healthcheck', { timeout: 5000 });
    return response.status === 200;
  } catch (error) {
    console.error('API connection check failed:', error);
    return false;
  }
};
