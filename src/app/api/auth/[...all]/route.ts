import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest } from "next/server";

const handler = toNextJsHandler(auth);

// #region agent log
const debugLog = (data: Record<string, unknown>) =>
  fetch('http://127.0.0.1:7242/ingest/02c8bc81-5fd3-40c6-87e5-2a989463c923',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...data,timestamp:Date.now()})}).catch(()=>{});
// #endregion

// #region agent log
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  await debugLog({
    location: 'route.ts:GET',
    message: 'Auth GET request',
    hypothesisId: 'H1-H5',
    data: {
      pathname: url.pathname,
      search: url.search,
      fullUrl: url.toString(),
    },
  });
  return handler.GET!(req);
}
// #endregion

// #region agent log
export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const body = await req.clone().text();
  await debugLog({
    location: 'route.ts:POST',
    message: 'Auth POST request',
    hypothesisId: 'H1-H5',
    data: {
      pathname: url.pathname,
      search: url.search,
      body: body.substring(0, 500),
    },
  });
  return handler.POST!(req);
}
// #endregion
