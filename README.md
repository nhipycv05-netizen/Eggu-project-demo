# EGGU - Korean Egg Sandwich

EGGU is a premium F&B brand website specializing in Korean-style egg sandwiches, toast, brunch, and drinks. Built using a modern tech stack (Next.js, Tailwind CSS, Supabase, and next-intl), it features a high-performance ordering interface for customers (COD-only) and a robust admin dashboard for menu, branch, and order management.

## Tech Stack
- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion
- **Database & Services:** Supabase (Postgres, Auth, Storage)
- **State Management:** Zustand (shopping cart state with localStorage persistence)
- **Localization:** `next-intl` (Bilingual Vietnamese and English support)
- **Form Handling:** React Hook Form + Zod

## Getting Started

### Prerequisites
Make sure you have Node.js (v18+) and npm installed.

### Installation
1. Clone the repository and navigate to the project directory.
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Set up the local environment file. Copy `.env.example` to `.env.local` and fill in your Supabase credentials:
   ```bash
   cp .env.example .env.local
   ```

### Running Locally
Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to view the application.

## Directory Structure
- `src/app/` — Application pages separated by localized `[locale]/` routes and non-localized `admin/` routes.
- `src/components/` — Shared global UI, layout, and presentational elements.
- `src/features/` — Domain-specific logic, actions, and features (products, cart, orders, etc.).
- `src/i18n/` — Translation routing configurations and JSON message bundles.
- `src/lib/` — Shared libraries, database utilities, Zod validations, and constants.
- `src/stores/` — Zustand store configurations.
- `src/types/` — Global TypeScript interface declarations.
