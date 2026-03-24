# عطاء - Ataa Backend API

Backend API for Ataa Volunteer Management Platform built with Node.js, Express, and PostgreSQL.

## 🚀 Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT
- **Language**: TypeScript

## 📁 Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.ts          # Seed data
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Express middleware
│   ├── routes/          # API routes
│   ├── types/           # TypeScript types
│   ├── utils/           # Utility functions
│   └── index.ts         # Entry point
├── .env.example         # Environment variables template
├── package.json
├── tsconfig.json
└── README.md
```

## 🛠️ Setup & Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database
npx prisma db seed
```

### 4. Run Development Server

```bash
npm run dev
```

Server will start at `http://localhost:5000`

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register/volunteer` - Register as volunteer
- `POST /api/auth/register/organization` - Register as organization
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/change-password` - Change password

### Volunteer
- `GET /api/volunteer/dashboard` - Volunteer dashboard
- `GET /api/volunteer/profile` - Get profile
- `PATCH /api/volunteer/profile` - Update profile
- `GET /api/volunteer/portfolio` - Digital portfolio
- `GET /api/volunteer/opportunities` - List opportunities
- `GET /api/volunteer/opportunities/:id` - Get opportunity details
- `POST /api/volunteer/opportunities/:id/apply` - Apply for opportunity
- `GET /api/volunteer/applications` - My applications
- `PATCH /api/volunteer/applications/:id/withdraw` - Withdraw application
- `POST /api/volunteer/opportunities/:id/check-in` - Check-in
- `POST /api/volunteer/opportunities/:id/check-out` - Check-out

### Organization
- `GET /api/organization/dashboard` - Organization dashboard
- `GET /api/organization/profile` - Get profile
- `PATCH /api/organization/profile` - Update profile
- `POST /api/organization/opportunities` - Create opportunity
- `GET /api/organization/opportunities` - List opportunities
- `GET /api/organization/opportunities/:id` - Get opportunity
- `PATCH /api/organization/opportunities/:id` - Update opportunity
- `PATCH /api/organization/opportunities/:id/status` - Change status
- `GET /api/organization/opportunities/:id/applications` - Get applications
- `PATCH /api/organization/opportunities/:id/applications/:applicationId` - Respond to application
- `GET /api/organization/opportunities/:id/hours` - Get hours logs
- `PATCH /api/organization/opportunities/:id/hours/:logId/approve` - Approve hours
- `POST /api/organization/opportunities/:id/certificates/:volunteerId` - Issue certificate

### Admin
- `GET /api/admin/dashboard` - Admin dashboard
- `GET /api/admin/users` - List users
- `GET /api/admin/users/:id` - Get user details
- `PATCH /api/admin/users/:id/status` - Update user status
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/organizations/pending` - Pending organizations
- `PATCH /api/admin/organizations/:id/verify` - Verify organization
- `GET /api/admin/badges` - List badges
- `POST /api/admin/badges` - Create badge
- `PATCH /api/admin/badges/:id` - Update badge
- `DELETE /api/admin/badges/:id` - Delete badge
- `GET /api/admin/opportunities` - All opportunities
- `GET /api/admin/statistics` - System statistics

## 🚀 Deployment on Render

### 1. Create PostgreSQL Database
- Go to Render Dashboard
- Create New PostgreSQL
- Copy the Internal Database URL

### 2. Create Web Service
- Connect your GitHub repository
- Set environment variables:
  - `DATABASE_URL`
  - `JWT_SECRET`
  - `NODE_ENV=production`
  - `FRONTEND_URL`

### 3. Build & Start Commands
- Build Command: `npm install && npm run build && npx prisma migrate deploy`
- Start Command: `npm start`

## 📜 License

MIT License
