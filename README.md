# RWE Web Hub
## Overview
RWE Web Hub is the frontend application for the Real World Engineering (RWE) organization. It provides public information about RWE teams and projects, a guided application flow for prospective members, member-only features, and admin views for managing organization data.

Key capabilities:
- Public pages describing teams and sponsors.
- A multi-step application form for prospective members (team-specific flows).
- Member-only pages and features protected by authentication/roles.
- Admin interfaces for managing members and organization content.

## Features
- Team and project pages (Drone, Robot Arm, eBike, Web, General, etc.)
- Multi-step application form with configurable team flows
- Role-based protected routes (guest, member, admin)
- Reusable UI components built with React + Tailwind CSS

## Prerequisites
- Node.js (18+ recommended)
- npm or pnpm

## Local development
1. Install dependencies

```powershell
npm install
```

2. Start the dev server

```powershell
npm run dev
```

3. Type-check the project

```powershell
npm run type-check
```

4. Build for production

```powershell
npm run build
```

5. Preview the production build

```powershell
npm run preview
```

## Project structure (important files)
.
└── rwe-web-hub-frontend/
    └── src/
        ├── assets/
        │   └── [static assets]
        ├── components/
        │   └── [reusable UI components]
        ├── pages/
        │   └── [top-level pages]
        └── routes/
            └── [route definitions]

## Contact
This repository is maintained by the RWE team. For questions contact the maintainers or open an issue.