# Project Context

## Layout Structure
- Root layout (`app/layout.tsx`) is a client component that conditionally renders the header
- Header is only shown on routes other than the sign-in page ('/')
- Metadata is separated into `app/metadata.ts` to comply with Next.js server/client component restrictions

## Components
- Header (`components/header.tsx`): Simple header component showing the app title
- Sidebar (`components/sidebar.tsx`): Navigation sidebar component
- Dashboard (`components/dashboard.tsx`): Main dashboard component with progress tracking
  - Uses Next.js router for navigation
  - Handles progress card creation via route navigation to '/new'
  - Displays user's fitness journey with stats and progress cards
- AuthProvider: Manages authentication state
- Toaster: Handles toast notifications

## Styling
- Uses Inter font
- Dark theme with gradient background
- Glass effect styling for components
- Responsive layout with sidebar width calculations

## Navigation
- Sign-in page: '/'
- New progress card: '/new'
- Dashboard: Shows user's fitness journey and progress cards 