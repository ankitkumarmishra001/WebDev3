# Inventory and Data Management System

Backend for Web Dev III, Assignment 3. Built with Node.js, Express, MongoDB and Mongoose.

## Setup

1. Install Node.js 18.11 or newer and start MongoDB locally.
2. Run `npm install`.
3. Check the values in `.env`.
4. Run `npm run seed` to load sample products.
5. Run `npm start`.

## Endpoints

| Method | URL | Purpose |
| --- | --- | --- |
| POST | /api/products | Create product |
| GET | /api/products | List with filter, sort, pagination |
| GET | /api/products/low-stock | Products at or below reorder level |
| GET | /api/products/summary | Category-wise summary |
| GET | /api/products/:id | Single product |
| PUT | /api/products/:id | Update product details |
| PATCH | /api/products/:id/stock | Restock or sale, body `{ "change": 10 }` |
| DELETE | /api/products/:id | Delete product |

Query options for the list: `category`, `supplier`, `search`, `minPrice`, `maxPrice`, `inStock`, `sort`, `page`, `limit`.
