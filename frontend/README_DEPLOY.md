# Deploying the frontend (Vercel)

This project is a Vite React app located in frontend/. To deploy to Vercel:

1. Create a new Vercel project and link it to this repository.
2. Set the Root Directory to `frontend`.
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Environment Variables:
   - VITE_API_BASE_URL -> https://your-backend.example.com/api
6. If using cookie-based auth, ensure the backend domain matches and `credentials` are handled in requests.

Alternatively, Netlify or any static host that supports Vite builds will work similarly.
