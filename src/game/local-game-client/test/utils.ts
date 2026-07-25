import type { StorageLike } from "../../persistence";

export function response(
  body: unknown,
  ok = true,
  status = 200,
): Pick<Response, "ok" | "status" | "json"> {
  return {
    ok,
    status,
    json: async () => body,
  };
}

export function createMemoryStorage(): StorageLike {
  const values = new Map<string, string>();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
}
