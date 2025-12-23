# Investee Client

React frontend for the Investee platform.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start development server:

   ```bash
   npm run dev
   ```

   The client will run on port 5000 and proxy API requests to `http://localhost:3000`.

## Configuration

- API requests to `/api/*` are automatically proxied to the backend server
- Make sure the backend server is running at `http://localhost:3000`

## Scripts

- `npm run dev` - Start development server (port 5000)
- `npm run build` - Build for production
- `npm run check` - Type-check TypeScript

## Types

All TypeScript type definitions are in [`client/src/types.ts`](./client/src/types.ts). These types match the backend API contract.
