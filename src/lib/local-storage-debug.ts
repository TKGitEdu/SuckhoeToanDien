/**
 * Utility for debugging localStorage state
 */

// Print the entire localStorage contents
export const printLocalStorage = () => {
  console.group('LocalStorage Contents:');
  
  if (localStorage.length === 0) {
    console.log('LocalStorage is empty');
  } else {
    // Get all items
    const items: Record<string, string> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        items[key] = localStorage.getItem(key) || '';
      }
    }
    
    console.table(items);
  }
  
  console.groupEnd();
};

// Check if user is still authenticated according to localStorage
export const checkAuthState = () => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  const userId = localStorage.getItem('userId');
  
  console.group('Authentication State Check:');
  console.log('Has token:', !!token);
  console.log('User role:', userRole || 'None');
  console.log('User ID:', userId || 'None');
  console.log('Is authenticated:', !!token);
  console.groupEnd();
  
  return !!token;
};

// Add to window for easy access in browser console
declare global {
  interface Window {
    debugLocalStorage: {
      print: () => void;
      check: () => boolean;
      clear: () => void;
    };
  }
}

// Add debugging helpers to window object for console access
if (typeof window !== 'undefined') {
  window.debugLocalStorage = {
    print: printLocalStorage,
    check: checkAuthState,
    clear: () => {
      localStorage.clear();
      console.log('LocalStorage cleared manually');
      printLocalStorage();
    }
  };
}

export default {
  printLocalStorage,
  checkAuthState
};
