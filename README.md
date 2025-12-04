# Product Showcase

Full-stack e-commerce product catalog with search, pagination, and enquiry form.

## Features
- Product listing with search & category filter
- 6 products per page pagination
- Product details page
- Enquiry form with validation
- Responsive design

## Tech Stack
- **Frontend**: React, React Router, Axios
- **Backend**: Node.js, Express, SQLite
- **Database**: SQLite with 12 seeded products

## Quick Start

1. Backend
cd backend
npm install
npm run dev

2. Frontend (new terminal)
cd frontend
npm install
npm start


**Backend**: http://localhost:3001  
**Frontend**: http://localhost:3000

## API Endpoints
GET /api/products?page=1&limit=6&search=&category=
GET /api/products/:id
POST /api/enquiries
GET /api/enquiries

## Deployment Ready
- Backend: Render/Heroku
- Frontend: Vercel/Netlify