const getApiBaseUrl = (): string => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseUrl) {
    console.error("CRITICAL: NEXT_PUBLIC_API_BASE_URL is not set in environment variables.");
    // Fallback for local development if the .env.local is forgotten or for testing.
    return 'http://localhost:8080';
  }
  return baseUrl;
};

// A wrapper around fetch to automatically prepend the API base URL
export const apiClient = async (
  endpoint: string,
  options?: RequestInit
): Promise<Response> => {
  const baseUrl = getApiBaseUrl();
  // Ensure the endpoint starts with a slash
  const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}${formattedEndpoint}`; // e.g., https://.../api/v1/onboarding

  // You can add default headers here if needed, like Authorization headers from Supabase
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...options?.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers: defaultHeaders,
  });

  return response;
};

// Example of how you would use this elsewhere in the app:
/*
  import { apiClient } from '@/utils/apiClient';

  const submitOnboardingData = async (data: any, authToken: string) => {
    try {
      const response = await apiClient('/api/v1/onboarding', {
        method: 'POST',
        headers: {
          // Pass the JWT token from Supabase Auth
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Onboarding successful:', result);
      } else {
        console.error('Onboarding failed:', await response.text());
      }
    } catch (error) {
      console.error('Failed to connect to API', error);
    }
  }
*/

/**
 * Fetches data from a protected API endpoint using GET request.
 *
 * @param path - The API path to request (e.g., "/users").
 * @param token - The JWT token for authentication.
 * @returns A promise that resolves to the JSON response from the API.
 * @throws An error if the API request fails.
 */
export const getAuthenticated = async (path: string, token: string): Promise<any> => {
  const baseUrl = getApiBaseUrl();
  // Ensure the path starts with a slash
  const formattedPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${baseUrl}${formattedPath}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  return await response.json();
};
