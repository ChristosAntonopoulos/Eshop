const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export type QueryParams = Record<
  string,
  string | number | boolean | undefined
>;

type RequestOptions = {
  params?: QueryParams;
};

function buildUrl(path: string, params?: RequestOptions["params"]) {
  const url = new URL(`${API_BASE_URL}${path}`, window.location.origin);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return url.toString();
}

export const apiClient = {
  async get<T>(path: string, options?: RequestOptions): Promise<T> {
    const response = await fetch(buildUrl(path, options?.params));

    if (!response.ok) {
      throw new Error(`GET ${path} failed with status ${response.status}`);
    }

    return response.json() as Promise<T>;
  },

  async post<T>(path: string, body: unknown): Promise<T> {
    const response = await fetch(buildUrl(path), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`POST ${path} failed with status ${response.status}`);
    }

    return response.json() as Promise<T>;
  },
};
