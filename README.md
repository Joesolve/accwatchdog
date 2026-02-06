# ACC Transparency & Asset Recovery Platform

A public transparency platform for Sierra Leone's Anti-Corruption Commission featuring property auctions, interactive dashboards, and public information resources.

## Features

- **Property Auction Portal** - Browse and express interest in recovered assets
- **Transparency Dashboard** - Interactive charts showing recovery statistics
- **Case Highlights** - Notable corruption cases and outcomes
- **News & Updates** - Latest ACC announcements
- **Educational Resources** - Anti-corruption learning materials
- **Report Corruption** - Secure anonymous reporting system
- **Admin Panel** - Full CMS for content management

## Tech Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Shadcn/ui
- **Backend:** Next.js API Routes, Prisma ORM
- **Database:** PostgreSQL
- **Auth:** NextAuth.js
- **Charts:** Recharts
- **Maps:** Leaflet
- **i18n:** next-intl (English & Krio)

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ACC
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/acc_platform"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
```

4. Set up the database:
```bash
npx prisma db push
npm run db:seed
```

5. Start the development server:
```bash
npm run dev
```

Visit `http://localhost:3000`

### Default Admin Login

After seeding:
- Email: `admin@acc.gov.sl`
- Password: `Admin@123`

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/              # Admin panel
│   ├── api/                # API routes
│   ├── cases/              # Case highlights
│   ├── dashboard/          # Transparency dashboard
│   ├── news/               # News articles
│   ├── properties/         # Property auction portal
│   ├── report-corruption/  # Report submission
│   └── resources/          # Educational resources
├── components/
│   ├── admin/              # Admin-specific components
│   ├── dashboard/          # Dashboard charts
│   ├── layout/             # Header, Footer
│   ├── properties/         # Property components
│   └── ui/                 # Shadcn/ui components
├── lib/
│   ├── auth.ts             # NextAuth configuration
│   ├── prisma.ts           # Prisma client
│   ├── utils.ts            # Utility functions
│   └── validations/        # Zod schemas
├── types/                  # TypeScript types
└── i18n.ts                 # Internationalization config
prisma/
├── schema.prisma           # Database schema
└── seed.ts                 # Seed data
messages/
├── en.json                 # English translations
└── kri.json                # Krio translations
```

## Database Schema

The platform uses 13 main tables:

- `users` - Admin users with roles
- `audit_logs` - Activity tracking
- `properties` - Recovered assets
- `property_images` - Property photos
- `property_documents` - Property files
- `expressions_of_interest` - Auction inquiries
- `recovery_statistics` - Dashboard data
- `case_highlights` - Notable cases
- `news_updates` - News articles
- `educational_resources` - Learning materials
- `corruption_reports` - Anonymous reports
- `report_attachments` - Report evidence
- `site_settings` - Platform configuration
- `email_subscriptions` - Newsletter signups

## API Routes

### Public Endpoints

- `GET /api/properties` - List properties
- `GET /api/properties/[id]` - Property details
- `POST /api/properties/[id]/interest` - Submit interest
- `GET /api/dashboard/stats` - Dashboard statistics
- `POST /api/reports` - Submit corruption report

### Admin Endpoints (Protected)

- `GET/POST /api/admin/properties` - Property CRUD
- `GET/POST /api/admin/statistics` - Statistics CRUD
- `GET/PATCH /api/admin/reports` - Report management

## User Roles

- **ADMIN** - Full access, user management
- **EDITOR** - Create and edit content
- **VIEWER** - Read-only admin access

## Branding

Sierra Leone national colors:
- Primary (Green): `#1EB53A`
- Secondary (Blue): `#0072C6`
- White: `#FFFFFF`

## Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint
npm run db:push      # Push schema to database
npm run db:seed      # Seed database
npm run db:studio    # Prisma Studio
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_URL` | App URL for auth |
| `NEXTAUTH_SECRET` | Auth encryption key |
| `UPLOAD_DIR` | File upload directory |
| `MAX_FILE_SIZE` | Max upload size in bytes |

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository
2. Set environment variables
3. Deploy

### Docker

```bash
docker build -t acc-platform .
docker run -p 3000:3000 acc-platform
```

## Security Features

- Input validation with Zod
- Rate limiting on public forms
- Role-based access control
- Secure file uploads with type validation
- Anonymous reporting with IP logging
- Audit logging for admin actions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## License

Copyright © 2024 Anti-Corruption Commission, Sierra Leone

---

Built with care for the people of Sierra Leone
# accwatchdog
