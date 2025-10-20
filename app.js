// app.js — Cloudflare Worker version of your Express + PouchDB app

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // --- 1️⃣ Handle CORS preflight ---
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': request.headers.get('Origin') || '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Allow-Credentials': 'true',
        },
      });
    }

    // --- 2️⃣ CORS headers for all responses ---
    const corsHeaders = {
      'Access-Control-Allow-Origin': request.headers.get('Origin') || '*',
      'Access-Control-Allow-Credentials': 'true',
    };

    // --- 3️⃣ Simple KV "database" routes ---
    if (url.pathname.startsWith('/api/data')) {
      const key = url.searchParams.get('key');

      if (request.method === 'GET') {
        const value = await env.MY_DB.get(key);
        return new Response(value ?? 'null', { headers: corsHeaders });
      }

      if (request.method === 'POST') {
        const body = await request.json();
        await env.MY_DB.put(key, JSON.stringify(body));
        return new Response('Saved', { headers: corsHeaders });
      }

      if (request.method === 'DELETE') {
        await env.MY_DB.delete(key);
        return new Response('Deleted', { headers: corsHeaders });
      }

      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }

    // --- 4️⃣ Static file serving from /public ---
    try {
      return await env.ASSETS.fetch(request);
    } catch (err) {
      return new Response('Not found', { status: 404, headers: corsHeaders });
    }
  },
};
