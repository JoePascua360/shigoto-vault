/**
 * @param endpoint - request endpoint. only provide the router endpoint (ex. /loadJobApplicationData)
 * @param method - request method
 * @param body - request body. null if method is GET
 */
export async function fetchRequestComponent(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  body?: {}
) {
  const apiVersion = import.meta.env.VITE_API_VERSION;

  try {
    const response = await fetch(`/api/${apiVersion}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
      },
      method,
      body: method !== "GET" ? JSON.stringify(body) : null,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result?.message);
    }

    return result;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      throw new Error(error.message || `Internal Server Error!`);
    }
  }
}
