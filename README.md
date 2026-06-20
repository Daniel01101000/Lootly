# Lootly

A full-stack gaming deals tracker that aggregates discounted gaming products from 14+ stores into a single, filterable catalog. Built with React, Node.js, Express, and PostgreSQL.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=flat&logo=postgresql&logoColor=white)
![Puppeteer](https://img.shields.io/badge/Puppeteer-40B5A4?style=flat&logo=puppeteer&logoColor=white)

## Features

- Unified catalog aggregating deals from 14+ stores (Mercado Libre, Steam, Amazon, Best Buy, Newegg, Dell, and more)
- Category and store filters with live product counts
- Sorting by best discount, price, or most recent
- Infinite scroll for browsing the full catalog without manual pagination
- Cart and wishlist with user authentication
- Responsive layout with adaptive menus depending on screen width
- Consistent dark theme across the entire interface

## Tech Stack

**Frontend:** React, Vite, plain CSS with design tokens, React Router, Context API for auth/cart/wishlist state

**Backend:** Node.js, Express, PostgreSQL, layered architecture (controllers, services, models)

**Scraping:** Puppeteer for Mercado Libre data extraction, with rate limiting and resilient DOM parsing

**Deployment:** Backend on Render, frontend on GitHub Pages, PostgreSQL on Render

## The Most Interesting Technical Challenge

The project originally integrated Mercado Libre's official API (OAuth2 with Bearer tokens) to pull live deals. Partway through development, Mercado Libre restricted public access to its search endpoint, returning 403 Forbidden even with properly authenticated tokens, a policy change that broke this path for any unofficial integrator.

Instead of dropping the data source, the project pivoted to a Puppeteer-based scraping solution:

- Headless navigation against real search result pages, targeting category-specific queries instead of generic listings
- Rate limiting between requests to avoid overloading the target server
- Resilient DOM parsing with fallbacks when selectors change
- URL normalization to strip tracking parameters, preventing the same listing from being counted as multiple distinct products
- Automatic deduplication and discount filtering, keeping only products with a genuine discount of 10 percent or more
- Keyword-based category inference to keep results scoped to gaming-relevant products

This kind of pivot, an external dependency changing its rules mid-project, is the type of real-world problem that shows up constantly in production systems. Adapting the architecture without rewriting everything from scratch was the core engineering exercise here.

## Running Locally

```bash
git clone https://github.com/Daniel01101000/Lootly.git
cd Lootly

cd backend
npm install
cp .env.example .env
node src/database/run-migrations.js
node src/database/seed.js
npm start
```

In a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

The app will be available at http://localhost:5173.

### Populating Mercado Libre products (optional)

```bash
cd backend
node src/scripts/scrape-mercadolibre.js
```

## A Note on Scraping

This project uses web scraping for educational and portfolio purposes. The scraper includes rate limiting to minimize impact on the target server. It is not intended for commercial use or large-scale deployment. Anyone extending this project for production should use official APIs with explicit authorization, such as affiliate programs, instead of scraping.

Prices shown may not reflect real-time inventory or pricing on the source stores, since data is refreshed periodically rather than on every page load.

## Project Structure

```
Lootly/
  frontend/
    src/
      components/    DealCard, Navbar, Footer, MercadoLibreSection, etc.
      pages/         Home, Deals, Wishlist, Cart
      context/       AuthContext, CartContext, WishlistContext
      services/      API calls to the backend
  backend/
    src/
      controllers/
      services/
      models/
      scrapers/      Puppeteer scraper for Mercado Libre
      scripts/       Executable scripts for seeding and scraping
      database/      Migrations and PostgreSQL connection
```

## Author

Daniel - [GitHub](https://github.com/Daniel01101000)

---

Built as a portfolio exercise to practice full-stack architecture, third-party API integration, and problem-solving when external dependencies change their access rules mid-project.
