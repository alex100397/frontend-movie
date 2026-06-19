# CineVault Frontend

This is the highly performant React frontend for the CineVault application. It is built using the latest React 19 stack with the React Compiler enabled for automatic memoization and extreme performance.

## Tech Stack
- **Framework:** React 19 + TypeScript
- **Bundler:** Vite 8
- **Performance:** Babel Plugin React Compiler (No manual `useMemo` needed)
- **State Management:** Zustand (in-memory, highly optimized)
- **Routing:** React Router v7
- **Styling:** TailwindCSS v4
- **API Requests:** Axios
- **Deployment:** Docker + Nginx

## Security & Architecture
- **XSS Immunity:** Uses a pure HttpOnly cookie-based authentication flow. The JWT token is never exposed to JavaScript or `localStorage`.
- **Zustand Persistence:** User state is persisted to localStorage for seamless UX upon refresh, but sensitive tokens remain entirely in the secure browser vault.
- **Docker + Nginx:** Production builds are compiled into static assets and served by a blazing-fast Nginx container.

## Setup Instructions

### Local Development
1. Ensure Node.js 22+ is installed.
2. Run `npm install` (or `pnpm install`).
3. Run `npm run dev` to start the Vite development server.
4. The dev server proxies `/api` requests automatically to `http://localhost:5000`.

### Docker Production Build
To build and run the frontend using Docker:

```bash
# Build the image (compiles Vite and sets up Nginx)
docker build --build-arg VITE_API_URL=http://localhost:5000 -t movie-frontend-app .

# Run the container on port 5001
docker run -p 5001:80 movie-frontend-app
```
