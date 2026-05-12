export async function fetchJson<T>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(input, init);
  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");

  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    const message =
      (payload as { error?: string } | null)?.error
      ?? `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  if (!isJson) {
    throw new Error("Expected JSON response but received non-JSON content.");
  }

  return payload as T;
}
