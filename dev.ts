import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import handler from "./api/index.ts";

serve((req: Request) => {
  const url = new URL(req.url);
  if (url.pathname === "/api") {
    return handler(req);
  } else {
    return new Response("Not Found", { status: 404 });
  }
});
