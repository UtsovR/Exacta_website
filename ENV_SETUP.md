# Environment Setup

Create a `.env` file in the project root (same folder as `package.json`) and add:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Notes:

- Do not hardcode Supabase keys in code.
- Vite client code must read these values from `import.meta.env`.
- In Netlify, add the same two keys in `Site settings -> Environment variables` for the deployed build.
