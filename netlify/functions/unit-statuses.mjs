import { getStore } from "@netlify/blobs";

const store = getStore("symphony-showroom");
const statusKey = "unit-statuses";

const headers = {
  "Content-Type": "application/json",
  "Cache-Control": "no-store"
};

export default async (request) => {
  if (request.method === "GET") {
    const data = await store.get(statusKey, { type: "json" });
    return Response.json(data || {}, { headers });
  }

  if (request.method === "POST") {
    const data = await request.json();
    await store.setJSON(statusKey, data || {});
    return Response.json({ ok: true }, { headers });
  }

  return Response.json({ error: "Method not allowed" }, { status: 405, headers });
};
