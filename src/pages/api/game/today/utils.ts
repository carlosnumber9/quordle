import type { GamePayload } from "@/types/api";

export function gameResponse(game: GamePayload): Response {
  return Response.json(game, { headers: noStoreHeaders() });
}

export function errorResponse(
  status: number,
  code: string,
  message: string,
): Response {
  return Response.json(
    { error: { code, message } },
    { status, headers: noStoreHeaders() },
  );
}

export function noStoreHeaders(): HeadersInit {
  return { "Cache-Control": "private, no-store" };
}
