# Jewellery Store – Complete Starter (MERN)

## What you get
- **server/** Express + MongoDB + JWT Auth + Admin-only Product CRUD
- **client/** React (Vite) customer site: Home, Shop, Product, Cart, Login
- **admin/** React (Vite) admin: Login, Products (add/delete)

## How to run (local)
1) Start MongoDB locally (or use MongoDB Atlas)
2) Backend

```bash
cd server
cp .env.example .env
npm install
npm run dev
```
3) Create an admin user (one-time)

Use Postman/curl:

```bash
curl -X POST http://localhost:5000/api/auth/register \
 -H 'Content-Type: application/json' \
 -d '{"name":"Admin","email":"admin@example.com","password":"Pass@123"}'
```

Open MongoDB and set `isAdmin: true` for this user.
4) Client (customer)

```bash
cd ../client
npm install
npm run dev
```
Visit http://localhost:5173

5) Admin dashboard

```bash
cd ../admin
npm install
npm run dev
```
Visit http://localhost:5174

Login with the admin credentials from step 3.


## Notes
- Update CORS origins in `server/.env.example` if ports differ.
- Product images are simple URLs; integrate Cloudinary/S3 later.
- Payments & orders checkout are left as next steps.
