# Architecture — Vitaboom

## Frontend (vitaboom-web)

### Stack
| Layer | Choice |
|-------|--------|
| Framework | Vite + React 18 (SPA) |
| UI | Material-UI (MUI) with `sx` props (primary), Tailwind being phased out |
| State | React Query (TanStack) |
| Routing | React Router |
| Styling | Emotion (CSS-in-JS via MUI) |
| Language | TypeScript |

### Directory Structure
```
src/
├── components/
│   ├── brand/           # Clinic branding
│   ├── clients/         # Patient/client management
│   ├── clinicians/      # Clinician management
│   ├── clinics/         # Clinic management
│   ├── commissions/     # Commission tracking
│   ├── common/          # Shared components
│   ├── dashboard/       # Dashboard views
│   ├── layout/          # App layout
│   ├── modals/          # Modal dialogs
│   ├── products/        # Product catalog
│   ├── protocol/        # Single protocol view
│   ├── protocols/       # Protocol list/management
│   ├── settings/        # Settings
│   └── ui/              # Base UI components
├── context/             # React contexts (auth, brand, cart)
├── hooks/               # Custom hooks (product/)
├── pages/               # Route pages (auth, onboarding, settings)
├── services/            # API client layer
├── types/               # TypeScript types
├── constants/
├── data/
├── lib/
├── styles/
└── utils/
```

### Styling Rule
**Always use MUI `sx` prop. Never use `className` / Tailwind for new code.**

---

## Backend (vitaboom-backend)

### Stack
| Layer | Choice |
|-------|--------|
| Runtime | Node.js 22 LTS + Express |
| ORM | Sequelize (PostgreSQL) |
| Validation | Joi (via validator middleware) |
| Auth | JWT (token-guard middleware) |
| Accounting | QuickBooks integration |
| Email | Klaviyo |
| Vendor | Shopify (webhooks, product sync) |
| Monitoring | Talkwise (Sentinel) |
| CI/CD | GitHub Actions → Heroku |
| Testing | Vitest (integration tests with real DB) |

### Directory Structure
```
src/
├── config/              # Environment config
├── middlewares/          # Auth (JWT), error handler, validation
├── migrations/          # Sequelize migrations
├── models/              # 19 Sequelize models
├── routes/              # Thin controllers (extract data → call service → return response)
│   ├── proxy/           # Proxy routes
│   ├── vendor/          # Vendor-specific routes
│   └── webhooks/        # Webhook handlers
├── services/
│   ├── internal/        # Business logic (21 services)
│   └── external/        # External API clients (Shopify, QuickBooks, Klaviyo, Talkwise)
├── scripts/             # One-off scripts
├── types/               # TypeScript types
├── validation/          # Joi schemas
└── utils/               # Helpers (httpUtil, CustomError, validator)
```

### 19 Models
User, Patient, PatientIdentity, Clinic, ClinicBranding, Product, ProductVisibility, Protocol, PatientProtocol, Order, Subscription, Commission, Vendor, SuppcoProduct, QuickbooksConnection, UserFavorite, AuditLog, WebhookEvent

### Key Patterns

**Thin routes, fat services:**
- Routes only: extract request data → call service handler → return response
- All business logic in services
- Handler functions end with `Handler` suffix

**Error handling:**
- Always use `CustomError` (never plain `Error`)
- `successfulResponse()` and `handleApiError()` helpers
- Error types: NOT_FOUND, INVALID_DATA_PROVIDED, UNAUTHORIZED, FORBIDDEN

**Model imports:**
- ALWAYS import from `models/index.js` (not individual model files — breaks production)
- Type-only imports allowed from individual model files

**External services:**
- Shopify: product sync, webhooks, orders
- QuickBooks: accounting integration
- Klaviyo: email marketing
- Talkwise/Sentinel: monitoring

### Key Services
| Service | Purpose |
|---------|---------|
| patient.service | Patient CRUD + identity management |
| clinic.service | Clinic management + branding |
| product.service | Product catalog + visibility rules |
| protocol.service | Supplement protocol management |
| order.service | Order creation + validation |
| subscription.service | Recurring order management |
| commission.service | Clinic commission calculations |
| suppco.service | Supplier product management |
| vendorProduct.service | Vendor product sync |
| quickbooks.service | QuickBooks accounting |
| klaviyo.service | Email marketing |
| shopify.service | Shopify integration |

---

## Deployment
- **Backend:** Heroku (with PostgreSQL)
- **Frontend:** TBD
- **CI:** GitHub Actions (lint → build → test with real DB)
- **Environments:** development, QA, production, test
