import { NextResponse } from "next/server";

interface ApiResponse<T = unknown> {
  data: T | null;
  error: string | null;
  meta: {
    timestamp: string;
    request_id: string;
  };
}

export function apiSuccess<T>(data: T, status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      data,
      error: null,
      meta: {
        timestamp: new Date().toISOString(),
        request_id: crypto.randomUUID(),
      },
    },
    { status }
  );
}

export function apiError(error: string, status = 400): NextResponse<ApiResponse<null>> {
  return NextResponse.json(
    {
      data: null,
      error,
      meta: {
        timestamp: new Date().toISOString(),
        request_id: crypto.randomUUID(),
      },
    },
    { status }
  );
}
