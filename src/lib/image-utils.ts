/**
 * Utility to format and return a fully qualified image URL.
 * Handles local relative paths by prefixing them with the server base URL.
 */
export const getImageUrl = (path?: string | null): string | undefined => {
  if (!path) return undefined;
  
  // If it's already a full URL or a base64 string, return it as is
  if (path.startsWith('http') || path.startsWith('data:')) {
    return path;
  }


  const apiUrl = import.meta.env.VITE_BASE_API_URL || 'http://localhost:3000/api/v1';
  const serverBase = apiUrl.replace('/api/v1', '');

  // Ensure path starts with a slash
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${serverBase}${normalizedPath}`;
};
