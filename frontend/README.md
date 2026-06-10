# E-commerce Frontend

This is a minimal React + TypeScript + Vite frontend skeleton integrated with your Spring Boot backend.

Quick start

1. cd frontend
2. npm install
3. Copy `.env.example` to `.env` and adjust VITE_API_BASE_URL if needed.
4. npm run dev

Notes

- Auth: login uses POST /api/auth/login and stores token in localStorage (Authorization: Bearer <token> is attached automatically).
- Product endpoints assume /api/products paths.
- Tailwind CSS is included; run the dev server to see styles.

Next steps I can take for you

- Add full Cart, Orders, Admin pages wired to their backend controllers
- Add role-based UI and protected routes
- Add unit and E2E tests
- Configure CI/CD (Vercel/Netlify)
