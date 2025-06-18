/**
 * Authentication utilities for managing user session
 */
import { printLocalStorage } from './local-storage-debug';

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

// Get user role
export const getUserRole = () => {
  return localStorage.getItem('userRole') || 'guest';
};

// Get user ID
export const getUserId = () => {
  return localStorage.getItem('userId');
};

// Get user full name
export const getUserFullName = () => {
  return localStorage.getItem('fullName');
};

// Get all user data from localStorage
export const getUserData = () => {
  return {
    userId: localStorage.getItem('userId'),
    username: localStorage.getItem('username'),
    fullName: localStorage.getItem('fullName'),
    email: localStorage.getItem('email'),
    role: localStorage.getItem('userRole'),
  };
};

// Clear all authentication data
export const clearAuthData = () => {
  // Clear everything in localStorage
  localStorage.clear();
  
  // Dispatch storage event to notify listeners
  window.dispatchEvent(new Event('storage'));
  
  console.log('All auth data cleared');
  printLocalStorage(); // Debug print to verify empty storage
};

// Check if storage has changed
export const setupAuthListener = (callback: () => void) => {
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === 'token' || event.key === null) {
      callback();
    }
  };
  
  window.addEventListener('storage', handleStorageChange);
  return () => {
    window.removeEventListener('storage', handleStorageChange);
  };
};

/**
 * Helper function to log the current authentication state - useful for debugging
 */
export const logAuthState = () => {
  console.group('Authentication State');
  console.log('Is authenticated:', isAuthenticated());
  console.log('User role:', getUserRole());
  console.log('User ID:', getUserId());
  console.log('Full name:', getUserFullName());
  console.log('All user data:', getUserData());
  printLocalStorage(); // Also print entire localStorage
  console.groupEnd();
};

export default {
  isAuthenticated,
  getUserRole,
  getUserId,
  getUserFullName,
  getUserData,
  setupAuthListener,
  logAuthState,
  clearAuthData
};
