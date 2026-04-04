
SETUP

1. Create free account at https://supabase.com
2. Create project
3. Create table called entries

Columns:
id (bigint primary key generated always as identity)
feeling (text)

If Row Level Security is enabled, add a policy that allows the `anon` role to `INSERT` and `SELECT` on `entries`.

4. Copy URL + public API key
5. Paste into config.js

Deploy folder to Netlify.

Pages:
/index.html = submissions
/display.html = word cloud display
