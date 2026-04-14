# College Announcement System - Specification

## 1. Project Overview

**Project Name:** ClassAnnounce
**Project Type:** Full-stack Web Application (Backend + Frontend)
**Core Functionality:** A college class announcement platform where students can create accounts using passwordless authentication (email-based magic link) and view announcements pushed by admin users.
**Target Users:**
- **Students** (primary): View announcements, manage their profile
- **Admin** (secondary): Create, edit, delete announcements

---

## 2. Architecture

### Tech Stack
- **Backend:** Java 17 + Spring Boot 3.x + Gradle
- **Frontend:** React 18 + Vite + TypeScript
- **Database:** H2 (in-memory) for MVP, easily swappable to PostgreSQL later
- **Authentication:** JWT-based passwordless (magic link via email token)

### Project Structure
```
talksweb/
├── backend/                 # Spring Boot application
│   ├── src/main/java/
│   │   └── com/classannounce/
│   │       ├── config/      # Security, CORS, etc.
│   │       ├── controller/ # REST endpoints
│   │       ├── dto/         # Data Transfer Objects
│   │       ├── entity/     # JPA entities
│   │       ├── repository/ # JPA repositories
│   │       ├── service/    # Business logic
│   │       └── security/   # JWT, authentication filters
│   └── build.gradle
├── frontend/                # React + Vite application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API calls
│   │   ├── hooks/          # Custom React hooks
│   │   ├── context/        # React context (auth)
│   │   └── styles/         # CSS/Styling
│   └── package.json
└── SPEC.md
```

---

## 3. Database Schema

### User Entity
| Field | Type | Constraints |
|-------|------|-------------|
| id | Long | PK, AUTO_INCREMENT |
| email | String | UNIQUE, NOT NULL |
| name | String | NOT NULL |
| role | Enum | USER, ADMIN (default: USER) |
| createdAt | LocalDateTime | NOT NULL |
| lastLoginAt | LocalDateTime | NULL |

### Announcement Entity
| Field | Type | Constraints |
|-------|------|-------------|
| id | Long | PK, AUTO_INCREMENT |
| title | String | NOT NULL |
| content | String | NOT NULL (TEXT) |
| priority | Enum | LOW, MEDIUM, HIGH (default: MEDIUM) |
| createdBy | Long | FK to User (admin) |
| createdAt | LocalDateTime | NOT NULL |
| updatedAt | LocalDateTime | NOT NULL |

### MagicToken Entity (for passwordless auth)
| Field | Type | Constraints |
|-------|------|-------------|
| id | Long | PK, AUTO_INCREMENT |
| token | String | UNIQUE, NOT NULL |
| userId | Long | FK to User |
| expiresAt | LocalDateTime | NOT NULL |
| usedAt | LocalDateTime | NULL |

---

## 4. API Endpoints

### Authentication
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | /api/auth/request-magic-link | Request magic link for email | Public |
| POST | /api/auth/verify-token | Verify token and get JWT | Public |
| GET | /api/auth/me | Get current user info | Authenticated |

### Announcements
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/announcements | List all announcements (paginated) | Authenticated |
| GET | /api/announcements/{id} | Get single announcement | Authenticated |
| POST | /api/announcements | Create announcement | Admin only |
| PUT | /api/announcements/{id} | Update announcement | Admin only |
| DELETE | /api/announcements/{id} | Delete announcement | Admin only |

### Users (Admin only)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/users | List all users | Admin only |
| POST | /api/users | Create user manually | Admin only |

---

## 5. Authentication Flow (Passwordless)

1. **User enters email** on login page
2. **System checks** if email exists in database
   - If not exists: Show "Email not registered" message
3. **System generates** unique magic token, stores in DB with 15-min expiry
4. **For MVP:** Display the magic link directly in UI (simulating email)
   - Later: Send actual email with magic link
5. **User clicks link** → POST to /api/auth/verify-token
6. **System verifies** token, generates JWT
7. **Frontend stores** JWT in localStorage, redirects to dashboard
8. **JWT contains:** userId, email, role, expiration

---

## 6. Frontend Pages & Features

### Pages

1. **Login Page** (`/login`)
   - Email input field
   - "Send Magic Link" button
   - Display area for magic link (MVP simulation)
   - Instructions text

2. **Magic Link Verification Page** (`/verify?token=xxx`)
   - Auto-submit token for verification
   - Loading spinner
   - Success/failure message
   - Redirect to dashboard on success

3. **Dashboard Page** (`/dashboard`)
   - Welcome message with user name
   - List of announcements (sorted by date, priority)
   - Each announcement shows: title, content preview, priority badge, date
   - Click to expand full content

4. **Announcement Detail Modal**
   - Full content display
   - Created by admin name
   - Creation date

5. **Admin Panel** (`/admin`) - Only for admin users
   - "Create Announcement" button
   - Form: Title, Content (textarea), Priority dropdown
   - List of existing announcements with Edit/Delete options

6. **Logout** - Clears JWT and redirects to login

### Components
- `Header` - App title, user info, logout button
- `AnnouncementCard` - Individual announcement display
- `AnnouncementForm` - Create/edit form
- `PriorityBadge` - Visual priority indicator
- `LoadingSpinner` - Loading state
- `Alert` - Success/error messages

---

## 7. UI/UX Design

### Color Scheme
- **Primary:** `#2563EB` (Blue 600) - Main actions, header
- **Secondary:** `#64748B` (Slate 500) - Secondary text
- **Accent:** `#10B981` (Emerald 500) - Success states
- **Background:** `#F8FAFC` (Slate 50) - Page background
- **Card Background:** `#FFFFFF` - Content cards
- **Text Primary:** `#1E293B` (Slate 800)
- **Text Secondary:** `#64748B` (Slate 500)

### Priority Colors
- **HIGH:** `#EF4444` (Red 500) - Urgent
- **MEDIUM:** `#F59E0B` (Amber 500) - Important
- **LOW:** `#22C55E` (Green 500) - Regular

### Typography
- **Font Family:** System fonts (`-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`)
- **Headings:** 24px (h1), 20px (h2), 16px (h3)
- **Body:** 14px
- **Small:** 12px

### Layout
- **Max Width:** 800px centered
- **Card Padding:** 24px
- **Gap between cards:** 16px
- **Border Radius:** 8px

---

## 8. Security Requirements

- JWT stored in localStorage (with warning in comments)
- JWT expiration: 24 hours
- Magic token expiration: 15 minutes
- Magic token can only be used once
- Role-based access control on all endpoints
- CORS configured for frontend dev server (port 5173)

---

## 9. Initial Data

### Admin User (seeded)
- Email: `admin@college.edu`
- Name: `Admin User`

### Sample Announcements (seeded)
1. "Welcome to ClassAnnounce!" - HIGH priority
2. "Assignment Deadline Extended" - HIGH priority
3. "Library Hours During Exams" - MEDIUM priority

---

## 10. Acceptance Criteria

1. ✅ User can request magic link with valid email
2. ✅ User receives magic link (displayed in UI for MVP)
3. ✅ Clicking magic link logs user in and shows dashboard
4. ✅ Dashboard displays all announcements sorted by date
5. ✅ Admin can create, edit, delete announcements
6. ✅ Non-admin users cannot access admin endpoints
7. ✅ Logout clears session and redirects to login
8. ✅ App works with ~100 initial users
9. ✅ Code is clean, follows Java/Spring best practices
10. ✅ Frontend is responsive and user-friendly