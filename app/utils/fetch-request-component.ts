/**
 * @param module - part of request endpoint. Select which module. Only valid ones can be selected. (ex. /job-applications)
 * @param endpoint - part of request endpoint. only provide the router endpoint (ex. /loadJobApplicationData)
 * @param method - request method
 * @param body - request body. null if method is GET. **Always** pass an object, will be invalid JSON if not.
 * @example
 * const response = await fetchRequestComponent("/job-applications", "/addManually", "POST", { data });
 * // console.log(response.message)
 * // Job Application Added Successfully!
 */
export async function fetchRequestComponent(
  module: "/job-applications",
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  body?: {}
) {
  const apiVersion = import.meta.env.VITE_API_VERSION;

  // FormData is only used for file uploads. Do not use it unless it's for that purpose
  const isFormData = body instanceof FormData;

  try {
    const response = await fetch(`/api/${apiVersion}${module}${endpoint}`, {
      headers: isFormData
        ? {}
        : {
            "Content-Type": "application/json",
          },
      method,
      body:
        method !== "GET" ? (isFormData ? body : JSON.stringify(body)) : null,
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
