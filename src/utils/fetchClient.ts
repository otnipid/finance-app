export interface RequestOptions extends RequestInit {
    body?: any;
    headers?: Record<string, string>;
  }
  
  export async function fetchClient<T>(
    url: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };
  
    const response = await fetch(url, {
      ...options,
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
  
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Fetch error: ${response.status} ${response.statusText} - ${errorText}`);
    }
  
    return response.json();
  }
  