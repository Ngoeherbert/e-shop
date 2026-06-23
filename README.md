# 🛍️ DN Design Store

A full-featured e-commerce platform built with modern web technologies for an exceptional shopping experience.

<div align="center">

[![TypeScript](https://img.shields.io/badge/TypeScript-76.4%25-3178c6?style=flat-square)](https://www.typescriptlang.org/)
[![Next.js 15](https://img.shields.io/badge/Next.js-15-000?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38b2ac?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

</div>

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Usage](#usage)
- [Development](#development)
- [Building](#building)
- [Database](#database)
- [Authentication](#authentication)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### Core E-Commerce
- 🛒 **Shopping Cart Management** - Add, remove, and manage products
- 💳 **Payment Processing** - Secure checkout experience
- 📦 **Product Management** - Browse, search, and filter products
- 👤 **User Authentication** - Secure login and registration
- 📊 **Admin Dashboard** - Manage products, orders, and inventory

### User Experience
- 🎨 **Modern UI** - Beautiful, responsive design with Tailwind CSS
- ⚡ **Fast Performance** - Next.js 15 with optimized rendering
- 🎬 **Smooth Animations** - Framer Motion for engaging interactions
- 🔐 **Secure** - Better Auth for authentication management
- 📱 **Responsive Design** - Works seamlessly on all devices

### Developer Experience
- 📘 **Type-Safe** - Full TypeScript support
- 🗄️ **Database ORM** - Drizzle ORM for database management
- 🔧 **Monorepo** - Organized workspace structure
- ✅ **Type Checking** - Comprehensive type safety

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 15](https://nextjs.org/) - React framework with server-side rendering
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- **Animation**: [Framer Motion](https://www.framer.com/motion/) - React animation library

### Backend
- **Runtime**: Node.js - JavaScript runtime
- **Server**: Express.js - Web application framework
- **Language**: TypeScript - Type-safe JavaScript

### Database
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/) - Lightweight TypeScript ORM
- **Type Safety**: Zod - TypeScript-first schema validation

### Authentication
- **Auth System**: [Better Auth](https://betterauth.dev/) - Modern authentication solution

### Package Management
- **Manager**: [pnpm](https://pnpm.io/) - Fast, disk space efficient package manager
- **Monorepo**: Workspace structure with shared utilities

## 📁 Project Structure

```
dn_design_store/
├── artifacts/              # Built application artifacts
│   ├── api-server/        # Express backend API
│   ├── web/               # Next.js web application
│   └── ...
├── scripts/               # Utility scripts
├── libs/                  # Shared libraries and utilities
├── package.json          # Root workspace configuration
├── tsconfig.json         # TypeScript configuration
└── README.md            # This file
```

### Workspace Packages

#### **@workspace/api-server**
Express.js based REST API server with:
- Cookie and CORS support
- Structured logging with Pino
- Database integration via Drizzle ORM
- Type validation with Zod

#### **@workspace/web**
Next.js 15 web application featuring:
- Server and client components
- Tailwind CSS styling
- Framer Motion animations
- Shopping cart functionality
- User authentication

#### **@workspace/db**
Database layer:
- Drizzle ORM setup and migrations
- Database schema definitions
- Type-safe database queries

#### **@workspace/api-zod**
API validation:
- Zod schema definitions
- Request/response validation
- Type inference for API contracts

## 🚀 Getting Started

### Prerequisites

- **Node.js**: Version 18+ (Check with `node --version`)
- **pnpm**: Package manager (Install via `npm install -g pnpm`)
- **Git**: Version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ngoeherbert/dn_design_store.git
   cd dn_design_store
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```
   > **Note**: This project uses pnpm exclusively. Using npm or yarn will fail due to the preinstall hook.

3. **Set up environment variables**
   ```bash
   # Create .env.local files in the required packages
   # Copy the example environment files and update with your values
   ```

4. **Run type checking**
   ```bash
   pnpm run typecheck
   ```

## 💻 Usage

### Development Mode

Start the development server:

```bash
# From the root directory
pnpm run dev
```

This will start:
- Next.js development server (usually on `http://localhost:3000`)
- Express API server
- File watchers for hot reloading

### Build the Project

Build all packages:

```bash
pnpm run build
```

This will:
1. Run TypeScript type checking
2. Build all packages in the workspace
3. Generate optimized production bundles

### Type Checking

Check TypeScript types without building:

```bash
pnpm run typecheck
```

For library-only type checking:

```bash
pnpm -w run typecheck:libs
```

## 🔨 Development

### Common Commands

#### Development
```bash
pnpm install        # Install all dependencies
pnpm run dev        # Start development servers
pnpm run typecheck  # Check types
```

#### Building
```bash
pnpm run build      # Build all packages
```

#### Package-specific commands

Navigate to specific packages:

```bash
# API Server
cd artifacts/api-server
pnpm run dev        # Start API server
pnpm run build      # Build API server
pnpm run start      # Run built server

# Web Application
cd artifacts/web
pnpm run dev        # Start Next.js dev server
pnpm run build      # Build Next.js app
pnpm run start      # Run production Next.js server
```

### Code Style

The project uses **Prettier** for code formatting:

```bash
pnpm run format     # Format code (if script exists)
```

## 🗄️ Database

### Drizzle ORM Setup

The project uses Drizzle ORM for type-safe database interactions:

1. **Define Schema**: Update schema files in `artifacts/db/src/schema`
2. **Generate Migrations**: Use Drizzle Kit to generate migrations
3. **Run Migrations**: Apply migrations to your database

### Database Configuration

Environment variables needed:
- `DATABASE_URL` - Connection string to your database

## 🔐 Authentication

### Better Auth Implementation

The project uses Better Auth for secure user authentication:

- User registration and login
- Session management
- Secure password hashing
- Cookie-based session storage

Configure Better Auth:
1. Set up environment variables
2. Configure auth providers (if applicable)
3. Customize user session handling

## 📊 Project Statistics

| Metric | Value |
|--------|-------|
| **Primary Language** | TypeScript (76.4%) |
| **Styling** | CSS (15.9%) |
| **Scripts** | JavaScript (7.1%) |
| **License** | MIT |
| **Status** | Active Development |

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes** with clear commit messages
4. **Push** to your branch (`git push origin feature/amazing-feature`)
5. **Open a Pull Request** with a detailed description

### Development Guidelines

- Use TypeScript for all code
- Follow the existing code style (enforced by Prettier)
- Write meaningful commit messages
- Add tests for new features
- Keep components modular and reusable

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 📞 Support & Resources

- **Next.js Documentation**: https://nextjs.org/docs
- **Tailwind CSS Docs**: https://tailwindcss.com/docs
- **Drizzle ORM Docs**: https://orm.drizzle.team/
- **Better Auth Docs**: https://betterauth.dev/
- **Framer Motion Docs**: https://www.framer.com/motion/

## 🎯 Roadmap

- [ ] Enhanced product filtering and search
- [ ] User reviews and ratings
- [ ] Wishlist functionality
- [ ] Order tracking system
- [ ] Admin analytics dashboard
- [ ] Mobile app version

---

<div align="center">

**Made with ❤️ by Ngoeherbert**

[GitHub](https://github.com/Ngoeherbert) • [Live Demo](#) • [Issues](https://github.com/Ngoeherbert/dn_design_store/issues)

</div>

## ☁️ Deployment: Frontend on Vercel, Backend on Render

Deploy this project as two separate services:

1. **Frontend**: Next.js app in `artifacts/shopstore`, deployed on Vercel.
2. **Backend**: Express API in `artifacts/api-server`, deployed on Render with the root-level `render.yaml` Blueprint.

### Backend on Render

This repository includes a Render Blueprint for the Express backend:

- `render.yaml` defines a Render web service named `autoshop-api`.
- The service builds the monorepo from the repository root, type-checks shared libraries and the backend, then bundles `@workspace/api-server`.
- The service starts the compiled backend with `pnpm --filter @workspace/api-server run start`.
- Render provides the `PORT` environment variable at runtime, and the backend reads `process.env.PORT` in `artifacts/api-server/src/index.ts`.

To deploy the backend:

1. Push this repository to GitHub, GitLab, or Bitbucket.
2. In Render, choose **New > Blueprint**.
3. Select this repository and use the root-level `render.yaml` file.
4. Create the Blueprint. Render will provision and deploy the backend web service.
5. Copy the Render service URL from the service dashboard. It usually looks like:

```text
https://autoshop-api.onrender.com
```

Verify the backend with:

```text
https://autoshop-api.onrender.com/
https://autoshop-api.onrender.com/api/healthz
```

### Frontend on Vercel

The frontend has a Vercel config at `artifacts/shopstore/vercel.json`.

Create a dedicated Vercel project for the frontend with these settings:

- **Framework Preset**: Next.js
- **Root Directory**: `artifacts/shopstore`
- **Install Command**: `pnpm install --frozen-lockfile`
- **Build Command**: `pnpm --filter @workspace/shopstore run build`
- **Output Directory**: `.next`

### Connect the Frontend to the Render Backend

In the Vercel frontend project, add these environment variables in **Settings > Environment Variables**:

```text
NEXT_PUBLIC_API_BASE_URL=https://autoshop-api.onrender.com
DATABASE_URL=<your-production-database-url>
BETTER_AUTH_SECRET=<a-long-random-secret>
BETTER_AUTH_URL=https://<your-frontend-project>.vercel.app
```

Replace `NEXT_PUBLIC_API_BASE_URL` with your actual Render backend URL if Render gives your service a different domain. The frontend build also needs `DATABASE_URL` because some Next.js pages load store data during build, and Better Auth should have `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL` set for production auth callbacks.

Use that value whenever the frontend needs to call the standalone Express backend:

```ts
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const response = await fetch(`${apiBaseUrl}/api/healthz`);
```

If you use the generated `@workspace/api-client-react` client in the frontend, initialize its base URL once on the client side:

```ts
import { setBaseUrl } from "@workspace/api-client-react";

setBaseUrl(process.env.NEXT_PUBLIC_API_BASE_URL ?? null);
```

Keep the existing Next.js `/api/*` routes for frontend-owned API routes such as auth, wishlist, admin, and AI routes. Use `NEXT_PUBLIC_API_BASE_URL` only for endpoints served by the standalone Express backend on Render.

### Local Deployment Check

Before deploying, run:

```bash
pnpm -w run typecheck:libs
pnpm --filter @workspace/api-server run typecheck
pnpm --filter @workspace/api-server run build
pnpm --filter @workspace/shopstore run build
```
