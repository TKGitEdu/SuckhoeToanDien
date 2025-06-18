import { useState } from 'react';
import { Button } from '../components/ui/button';
import { axiosApi } from './axios-api';

/**
 * A simple component to test API connectivity 
 * Add this to any page for quick debugging during development
 */
export const ApiTester = () => {
  const [testStatus, setTestStatus] = useState<{
    loading: boolean;
    result: string | null;
    success: boolean | null;
  }>({
    loading: false,
    result: null,
    success: null,
  });

  const runTest = async () => {
    setTestStatus({ loading: true, result: null, success: null });
    
    try {      // Test login endpoint with test credentials
      const testLogin = async () => {
        try {
          const result = await axiosApi.auth.login('testuser', 'password123');
          return { success: true, data: result };
        } catch (error) {
          return { 
            success: false, 
            error: error instanceof Error ? error.message : String(error) 
          };
        }
      };
      
      // Basic connectivity test
      const connectionTest = await axiosApi.test();
      const loginTest = await testLogin();
      
      const resultText = `
API Connection Test:
${JSON.stringify(connectionTest, null, 2)}

Login API Test:
${JSON.stringify(loginTest, null, 2)}
      `;
      
      setTestStatus({
        loading: false,
        result: resultText,
        success: connectionTest.success
      });
    } catch (error) {
      setTestStatus({
        loading: false,
        result: `Test failed: ${error instanceof Error ? error.message : String(error)}`,
        success: false
      });
    }
  };

  // Only show in development
  if (import.meta.env.PROD) return null;
  
  return (
    <div className="mt-4 p-4 border rounded-lg bg-gray-50">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">API Connection Tester</h3>
        <Button 
          onClick={runTest} 
          disabled={testStatus.loading}
          size="sm"
        >
          {testStatus.loading ? 'Testing...' : 'Test API Connection'}
        </Button>
      </div>
      
      {testStatus.result && (
        <div className={`mt-3 p-3 rounded ${
          testStatus.success ? 'bg-green-50 border border-green-200' : 
          'bg-red-50 border border-red-200'
        }`}>
          <pre className="text-xs whitespace-pre-wrap overflow-auto max-h-60">
            {testStatus.result}
          </pre>
        </div>
      )}
    </div>
  );
};
