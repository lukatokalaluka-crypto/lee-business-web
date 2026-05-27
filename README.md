# HHMediabusiness - Admin Dashboard & React Frontend

A professional web business platform with a hidden admin dashboard for managing products with full CRUD operations.

## 🚀 Features

### Admin Dashboard
- **Hidden Login**: Access at `/admin` (no visible link on public store)
- **Product Management**: Create, Read, Update, Delete (CRUD) operations
- **Real-time Sync**: Products update instantly across frontend
- **Secure Authentication**: Session-based admin verification
- **Professional UI**: Clean, responsive admin interface

### Customer Store
- **Product Catalog**: Browse all products with search functionality
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Search & Filter**: Find products by name, category, or description
- **Fallback Mode**: Works without backend (uses static data.json)

## 📋 Admin Credentials

```
Email: business@gmail.com
Password: 123456
```

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Styling**: Inline React styles (no external CSS required)

## 📦 Installation

### Backend Setup

```bash
cd backend
npm install
# Add DATABASE_URL to .env if using PostgreSQL
npm run seed  # Seed initial products
npm run dev   # Start development server
```

Backend runs on `http://localhost:3001`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev   # Start Vite dev server
```

Frontend runs on `http://localhost:3000`

## 🔐 Admin Access

1. Visit `http://localhost:3000/admin`
2. Log in with credentials above
3. Access full product management dashboard

## 📱 API Endpoints

### Public Endpoints
- `GET /api/products` - Fetch all products
- `POST /api/login` - Admin login
- `GET /api/logout` - Admin logout

### Admin Endpoints (Requires Authentication)
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

## 🗂️ Product Data Structure

```javascript
{
  id: 1,
  name: "Product Name",
  price: "1,500",
  image: "https://example.com/image.jpg",
  category: "Electronics|Software|Hardware|Accessories|Services",
  description: "Product description (optional)"
}
```

## 📝 Environment Variables

### Backend (.env)
```
PORT=3001
DATABASE_URL=postgresql://user:password@localhost:5432/hhmedia
CLIENT_ORIGIN=http://localhost:3000
# Optional: allow additional origins in production
# CLIENT_ORIGINS=http://localhost:3000,https://your-frontend-domain.com
SESSION_SECRET=your-secret-key
NODE_ENV=development

# Cloudinary image uploads
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend (.env)
```
VITE_API_BASE=http://localhost:3001
VITE_BASE=/
```

### Production deployment notes
- If your backend is hosted on Render and frontend on Vercel, set `VITE_API_BASE` to your Render backend URL.
- Use `CLIENT_ORIGIN` on the backend for one allowed frontend origin, or `CLIENT_ORIGINS` for multiple origins.
- Example for Render backend and Vercel frontend:
```
NODE_ENV=production
DATABASE_URL=your-postgres-connection-string
CLIENT_ORIGINS=https://your-frontend.vercel.app,http://localhost:3000
SESSION_SECRET=your-secure-session-secret
```

## 🎨 UI Components

### Admin Dashboard Sections
1. **Add New Product** - Form to create products
2. **Products List** - Grid view of all products with Edit/Delete buttons
3. **Edit Product** - Form that appears when editing a product

### Customer Store
1. **Header** - Store title and Admin button
2. **Search Bar** - Filter products by name/category/description
3. **Product Grid** - Responsive product display
4. **Footer** - Social links and copyright

## 🔒 Security Features

- Admin panel hidden by default
- Session-based authentication
- Server-side login verification
- CORS enabled for frontend-backend communication
- HTTPS ready for production

## 🚀 Production Deployment

### Environment Variables for Production
```
NODE_ENV=production
DATABASE_URL=your-postgres-connection-string
ADMIN_EMAIL=your-admin-email
ADMIN_PASSWORD=your-secure-password
SESSION_SECRET=your-secure-session-secret
```

### Build Frontend
```bash
cd frontend
npm run build
# Deploy dist/ folder to static host
```

### Run Backend
```bash
cd backend
npm install --production
npm start
```

## 📊 Seed Data

The system comes pre-seeded with 10 sample products:
- HP Pavilion Laptop
- Windows 11 Pro
- USB-C Hub Adapter
- System Optimization Service
- External Hard Drive 2TB
- Mechanical Keyboard RGB
- Data Recovery Service
- Wireless Mouse Pro
- Thunderbolt Cable
- McAfee Total Protection

Run `npm run seed` in backend to reset and re-seed database.

## 🐛 Troubleshooting

### Backend won't connect to database?
- Check DATABASE_URL is set correctly
- Ensure PostgreSQL is running
- Run `npm run seed` to initialize tables

### Admin login fails?
- Verify credentials (default: business@gmail.com / 123456)
- Check backend is running on port 3001
- Check browser console for errors

### Products not appearing?
- Frontend will use fallback data.json if backend is down
- Check `/api/products` endpoint is returning data
- Verify database has been seeded

## 📄 License

© 2024 HHMediabusiness. All rights reserved.
