# Feature Migration Plan: investee-client → investee + investee-server

## Executive Summary

This document outlines the migration of new features and redesigns from the `investee-client` monorepo to the split `investee` (frontend) and `investee-server` (backend) projects.

**Key Differences Identified:**

- **42+ new pages** added (primarily `/proposal` and `/v2` routes)
- **10 new service files** for API communication
- **4 new components** (InvesteeLogo, dscr-indicator, google-map, google-places-autocomplete)
- Complete UI/UX redesign with new layouts
- Enhanced service layer architecture

---

## Phase 1: Frontend Migration

### 1.1 New Components to Copy

#### Core Components (Missing from Current)

- `components/InvesteeLogo.tsx` - Brand logo component
- `components/dscr-indicator.tsx` - DSCR calculation indicator
- `components/google-map.tsx` - Google Maps integration
- `components/google-places-autocomplete.tsx` - Address autocomplete

**Action:** Copy these files from `investee-client/client/src/components/` to `investee/src/components/`

### 1.2 New Pages - Proposal Flow

The `/proposal` route represents a complete new user flow (23 pages):

#### Core Pages

- `pages/proposal/index.tsx` - Entry point
- `pages/proposal/welcome.tsx` - Welcome screen
- `pages/proposal/funnel-landing.tsx` - Funnel landing
- `pages/proposal/auth.tsx` - Authentication
- `pages/proposal/investor-profile.tsx` - Profile selection
- `pages/proposal/onboarding.tsx` - User onboarding

#### Dashboard & Management

- `pages/proposal/dashboard.tsx` - Main dashboard
- `pages/proposal/admin-dashboard.tsx` - Admin view
- `pages/proposal/profile.tsx` - User profile
- `pages/proposal/property-detail.tsx` - Property details
- `pages/proposal/property-map.tsx` - Property map view
- `pages/proposal/property-management.tsx` - Property management
- `pages/proposal/market-trends.tsx` - Market analysis

#### Loan Application Flow

- `pages/proposal/loan/property-details.tsx` - Step 1
- `pages/proposal/loan/loan-terms.tsx` - Step 2
- `pages/proposal/loan/borrower-info.tsx` - Step 3
- `pages/proposal/loan/documents.tsx` - Step 4
- `pages/proposal/loan/review.tsx` - Step 5
- `pages/proposal/loan-review.tsx` - Loan status

#### Additional Features

- `pages/proposal/book-call.tsx` - Call booking
- `pages/proposal/credit-summary.tsx` - Credit summary
- `pages/proposal/ai-assistant.tsx` - AI assistant
- `pages/proposal/ai-logs.tsx` - AI interaction logs
- `pages/proposal/leads.tsx` - Lead management
- `pages/proposal/reports.tsx` - Reporting
- `pages/proposal/verify-identity.tsx` - Identity verification

**Action:** Copy entire `pages/proposal/` directory

### 1.3 New Pages - V2 Flow

The `/v2` route is described as "Functional version using the Stitch template" (13 pages):

#### Core Pages

- `pages/v2/index.tsx` - V2 landing
- `pages/v2/dashboard.tsx` - V2 dashboard
- `pages/v2/property-search.tsx` - Property search
- `pages/v2/applications.tsx` - Applications list
- `pages/v2/application-detail.tsx` - Application details
- `pages/v2/ai-assistant.tsx` - AI assistant

#### Loan Flow

- `pages/v2/loan/step-1.tsx` through `step-4.tsx` - 4-step loan process

#### Property Features

- `pages/v2/properties.tsx` - Properties list
- `pages/v2/property-detail.tsx` - Property details
- `pages/v2/my-properties.tsx` - User properties

#### Additional

- `pages/v2/vendors.tsx` - Vendors list
- `pages/v2/vendor-detail.tsx` - Vendor details
- `pages/v2/dscr-calculator.tsx` - DSCR calculator

**Action:** Copy entire `pages/v2/` directory

### 1.4 Updated Existing Pages

Compare and merge changes to existing pages:

- `pages/landing.tsx`
- `pages/property-search.tsx`
- `pages/property-details.tsx`
- `pages/admin-dashboard.tsx`
- etc.

**Action:** Use diff tool to identify and merge substantive changes

### 1.5 New Service Layer

The old project has 11 service files vs current 1:

#### New Services to Add

```
services/
├── AiServices.ts          # AI/Assistant functionality
├── AlertServices.ts       # Property alerts
├── ApplicationServices.ts # Loan applications
├── AuthServices.ts        # Authentication
├── ConfigServices.ts      # Configuration
├── ListingServices.ts     # Property listings
├── OfferServices.ts       # Offers management
├── PropertyServices.ts    # Property operations
├── WatchlistServices.ts   # Watchlist management
├── attom.ts               # ATTOM data (existing)
└── http.ts                # HTTP client base
```

**Action:**

1. Copy all service files to `investee/src/services/`
2. Update `http.ts` to point to correct backend URL
3. Ensure all services use the http client base

### 1.6 Router Updates

Update `App.tsx` to include new routes:

```typescript
// Add to imports
import ProposalLayout from "@/pages/proposal/ProposalLayout";
import V2Layout from "@/pages/v2/V2Layout";

// Add to routes
<Route path="/proposal/*" component={ProposalLayout} />
<Route path="/v2/*" component={V2Layout} />
```

**Note:** The new App.tsx has distinct route groupings:

- Proposal routes (no main Layout)
- V2 routes (no main Layout)
- Main site routes (with Layout wrapper)

### 1.7 Additional Files

Check for and copy:

- Any new hooks in `hooks/`
- Any new utilities in `lib/`
- Updated CSS/styles in `index.css`
- New assets in `assets/`

---

## Phase 2: Backend Migration

### 2.1 Database Schema Changes

**Current Backend:** TypeORM with entities
**Old Backend:** Drizzle ORM with schema

The user has already created TypeORM entities in `investee-server/src/entities/`:

- User.entity.ts
- Session.entity.ts
- Property.entity.ts
- LoanApplication.entity.ts
- PropertyListing.entity.ts
- PropertyWatchlist.entity.ts
- PropertyOffer.entity.ts
- PropertyAlert.entity.ts

**Action:** Verify these entities match the schema from `shared/schema.ts` and add any missing fields

### 2.2 New Backend Endpoints

Based on new services, the backend needs endpoints for:

#### AI Services

- `POST /api/ai/chat` - Chat with AI assistant
- `GET /api/ai/logs` - Get AI interaction logs
- `POST /api/ai/analyze-property` - AI property analysis

#### Alerts

- `GET /api/alerts` - Get user alerts
- `POST /api/alerts` - Create alert
- `PUT /api/alerts/:id` - Update alert
- `DELETE /api/alerts/:id` - Delete alert

#### Applications

- `GET /api/applications` - List applications
- `GET /api/applications/:id` - Get application details
- `POST /api/applications` - Create application
- `PUT /api/applications/:id` - Update application
- `POST /api/applications/:id/documents` - Upload documents

#### Auth

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

#### Listings

- `GET /api/listings` - Get listings
- `POST /api/listings` - Create listing
- `PUT /api/listings/:id` - Update listing
- `DELETE /api/listings/:id` - Delete listing

#### Offers

- `GET /api/offers` - Get offers
- `POST /api/offers` - Create offer
- `PUT /api/offers/:id` - Update offer status

#### Properties

- `GET /api/properties` - Search properties
- `GET /api/properties/:id` - Get property details
- `POST /api/properties` - Create property
- `PUT /api/properties/:id` - Update property

#### Watchlist

- `GET /api/watchlist` - Get watchlist
- `POST /api/watchlist` - Add to watchlist
- `DELETE /api/watchlist/:id` - Remove from watchlist

#### Leads (Admin)

- `GET /api/leads` - Get leads
- `PUT /api/leads/:id` - Update lead status

#### Reports (Admin)

- `GET /api/reports/overview` - Dashboard overview
- `GET /api/reports/applications` - Application reports

**Action:** Review `investee-client/server/routes.ts` and create corresponding TypeORM-based endpoints in `investee-server/src/routes.ts`

### 2.3 External Service Integrations

Check `investee-client/server/` for:

- ATTOM API integration
- Google Maps API
- OpenAI API (for AI assistant)
- Any payment processors
- Email services

**Action:** Port integration code to new backend structure

### 2.4 Middleware & Auth

Review and migrate:

- Session management
- Passport strategies
- Auth middleware
- File upload handlers (multer)
- Error handlers

---

## Phase 3: Configuration & Environment

### 3.1 Environment Variables

Update `.env.example` files:

**Backend:**

```env
DATABASE_URL=
SESSION_SECRET=
PORT=3000
ATTOM_API_KEY=
GOOGLE_MAPS_API_KEY=
OPENAI_API_KEY=
```

**Frontend:**

```env
VITE_API_URL=http://localhost:3000
VITE_GOOGLE_MAPS_API_KEY=
```

### 3.2 Package Dependencies

**Frontend additions needed:**

- `@react-google-maps/api` (if not already present)
- Any new chart/visualization libraries
- Any new form libraries

**Backend additions needed:**

- `openai` - For AI assistant
- `bcryptjs` - For password hashing
- Any other integrations

---

## Phase 4: Testing & Verification

### 4.1 Frontend Testing

- [ ] All new routes render correctly
- [ ] All forms submit properly
- [ ] API calls use correct endpoints
- [ ] Authentication flow works
- [ ] Property search functionality
- [ ] Loan application flow
- [ ] AI assistant integration
- [ ] File uploads work

### 4.2 Backend Testing

- [ ] All endpoints return correct data
- [ ] Authentication middleware works
- [ ] Database operations succeed
- [ ] External API integrations work
- [ ] File upload handling
- [ ] Error handling

### 4.3 Integration Testing

- [ ] Full loan application flow
- [ ] Property search to details to offer
- [ ] User registration to dashboard
- [ ] Watchlist functionality
- [ ] Alert creation and triggering

---

## Implementation Order

1. **Start with Services** - Copy service layer to understand API contract
2. **Backend Endpoints** - Implement matching endpoints
3. **Frontend Components** - Copy new components
4. **Frontend Pages** - Copy new pages
5. **Router Integration** - Update App.tsx with new routes
6. **Testing** - Test each feature incrementally
7. **Environment Setup** - Configure all environment variables
8. **End-to-End Testing** - Full user flows

---

## Notes for Agent

- Compare file sizes and modification dates to identify most changed files
- Use `git diff` or similar to see actual code changes
- Pay special attention to `App.tsx` routing changes
- The `/proposal` and `/v2` flows are completely new user experiences
- Service layer represents major architectural improvement
- Backend needs to support all new service endpoints
- Maintain TypeORM structure in new backend (don't revert to Drizzle)

---

## Quick Reference

**Source:** `c:\Users\franc\punch-work\investee\investee-client\`  
**Destination (Frontend):** `c:\Users\franc\punch-work\investee\`  
**Destination (Backend):** `c:\Users\franc\punch-work\investee\investee-server\`

**Key Metrics:**

- 42+ new pages
- 4 new components
- 10 new service files
- 50+ new backend endpoints (estimated)
