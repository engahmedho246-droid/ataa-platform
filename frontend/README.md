# عطاء - Ataa Volunteer Management Platform Frontend

Frontend for Ataa Volunteer Management Platform built with React, TypeScript, and Tailwind CSS.

## 🚀 Tech Stack

- **Framework**: React 19 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3.4
- **UI Components**: shadcn/ui + Radix UI
- **State Management**: React Context
- **HTTP Client**: Axios
- **Notifications**: Sonner

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/         # Layout components
│   │   ├── MainLayout.tsx
│   │   ├── AuthLayout.tsx
│   │   └── DashboardLayout.tsx
│   └── ui/             # shadcn/ui components
├── contexts/
│   └── AuthContext.tsx # Authentication context
├── pages/
│   ├── LandingPage.tsx
│   ├── auth/
│   │   ├── LoginPage.tsx
│   │   ├── RegisterVolunteerPage.tsx
│   │   └── RegisterOrganizationPage.tsx
│   ├── volunteer/
│   │   ├── Dashboard.tsx
│   │   ├── Profile.tsx
│   │   ├── Portfolio.tsx
│   │   ├── OpportunitiesList.tsx
│   │   ├── OpportunityDetails.tsx
│   │   └── MyApplications.tsx
│   ├── organization/
│   │   ├── Dashboard.tsx
│   │   ├── Profile.tsx
│   │   ├── ManageOpportunities.tsx
│   │   ├── CreateOpportunity.tsx
│   │   └── OpportunityApplications.tsx
│   └── admin/
│       ├── Dashboard.tsx
│       ├── UsersManagement.tsx
│       ├── OrganizationsVerification.tsx
│       ├── BadgesManagement.tsx
│       └── SystemStatistics.tsx
├── services/
│   └── api.ts          # API services
├── types/
│   └── index.ts        # TypeScript types
└── App.tsx             # Main app component
```

## 🛠️ Setup & Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔌 API Configuration

Create `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

## 📝 Features

### Public Pages
- Landing Page with platform overview
- Login/Register pages

### Volunteer Dashboard
- Dashboard with stats and upcoming opportunities
- Browse and filter opportunities
- Apply for opportunities
- Track applications
- Digital portfolio with badges and certificates
- Profile management

### Organization Dashboard
- Dashboard with stats
- Create and manage opportunities
- Review applications
- Track volunteer hours
- Issue certificates
- Profile management

### Admin Dashboard
- System overview with statistics
- User management
- Organization verification
- Badge management
- System statistics

## 🎨 Design System

### Colors
- Primary: Emerald (#10B981)
- Secondary: Teal (#14B8A6)
- Accent: Amber (#F59E0B)

### Typography
- Font: Tajawal (Arabic)
- Direction: RTL

## 📜 License

MIT License
