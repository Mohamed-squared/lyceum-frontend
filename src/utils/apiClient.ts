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
