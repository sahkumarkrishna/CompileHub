# Plan: Two Different Navbars Implementation

## Summary
Create two distinct navbars:
1. **SimpleNavbar** - For public pages (/, /coding, /contact)
2. **UserNavbar** - For dashboard page (/dashboard)

## Files to Create/Modify

### 1. Create `SimpleNavbar.jsx`
- Location: `client/src/components/SimpleNavbar.jsx`
- Features:
  - Desktop: Logo + Coding Practice | Coding | Contact | Dashboard + Profile
  - Mobile: Logo + Profile + Hamburger → dropdown menu
  - Auth-aware: Shows Login/Signup or Profile based on login status

### 2. Update `UserNavbar.jsx`
- Location: `client/src/components/UserNavbar.jsx`
- Simplify to:
  - Desktop: Logo + Profile only
  - Mobile: Logo + Profile + Hamburger menu

### 3. Update `MainLayout.jsx`
- Location: `client/src/Layouts/MainLayout.jsx`
- Use `SimpleNavbar` instead of `UserNavbar`
- No sidebar in this layout

### 4. Update `DashboardLayout.jsx`
- Location: `client/src/Layouts/DashboardLayout.jsx`
- Keep using `UserNavbar` (simplified version)
- Keep sidebar for mobile menu

### 5. Update `App.jsx`
- Update imports and route configurations if needed

## Expected Outcome
- `/, /coding, /contact` → SimpleNavbar with all nav links
- `/dashboard` → UserNavbar (profile only) + Sidebar for mobile
