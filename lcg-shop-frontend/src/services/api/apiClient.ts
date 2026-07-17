import { loadAuthSession } from "@/features/auth/utils/authStorage";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

function authHeaders(): Record<string, string> {
  const session = loadAuthSession();
  if (!session?.token) return {};
  return { Authorization: `Bearer ${session.token}` };
}

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
    const response = await fetch(buildUrl(path, options?.params), {
      headers: authHeaders(),
    });

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
        ...authHeaders(),
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`POST ${path} failed with status ${response.status}`);
    }

    return response.json() as Promise<T>;
  },

  async put<T>(path: string, body: unknown): Promise<T> {
    const response = await fetch(buildUrl(path), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`PUT ${path} failed with status ${response.status}`);
    }

    return response.json() as Promise<T>;
  },

  async patch<T>(path: string, body: unknown): Promise<T> {
    const response = await fetch(buildUrl(path), {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`PATCH ${path} failed with status ${response.status}`);
    }

    return response.json() as Promise<T>;
  },
};
