# SafeCheck AI - Specification

## Project Overview
- **Project Name**: SafeCheck AI
- **Type**: Web Application (Scam Detection)
- **Core Functionality**: AI-powered loan scam, fraud SMS, and malicious link detection
- **Target Users**: General smartphone users, students, people receiving loan/finance SMS, rural & semi-urban users

## UI/UX Specification

### Layout Structure
- **Header**: Fixed navigation with logo and nav links (Home, URL Checker, Report, History)
- **Hero Section**: Input box for SMS/Link with "Check Now" button
- **Quick Actions**: Cards for SMS Check and URL Check
- **Info Section**: How it works and scam examples

### Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Visual Design

#### Color Palette
- **Background**: `#0a0a0a` (near black)
- **Surface**: `#171717` (dark gray)
- **Border**: `#262626` (medium gray)
- **Text Primary**: `#fafafa` (off-white)
- **Text Secondary**: `#a3a3a3` (gray)
- **Accent**: `#22c55e` (green - safe)
- **Warning**: `#eab308` (yellow - suspicious)
- **Danger**: `#ef4444` (red - scam)
- **Primary Brand**: `#f97316` (orange)

#### Typography
- **Font Family**: "Outfit" (Google Fonts) - geometric sans-serif
- **Headings**: 700 weight
- **Body**: 400 weight, line-height 1.6

#### Status Colors
- Safe: Green (#22c55e)
- Suspicious: Yellow (#eab308)  
- Scam: Red (#ef4444)

### Screens

#### 1. Home Screen
- Logo + Navigation
- Hero: Input box (Paste SMS/Link) + "Check Now" button
- Quick action cards for SMS/URL check
- "How it works" info section

#### 2. Scan Result Screen
- Result card with status badge (Safe/Suspicious/Scam)
- Confidence score (%)
- Explanation section
- Highlighted risky words
- Action buttons: Report Scam, Check Another

#### 3. URL Checker Screen
- Input field for URL
- Scan button
- Result display: SSL status, Domain age, Risk level

#### 4. Report Scam Screen
- Form: SMS/URL input
- Category dropdown (Loan scam, OTP fraud, Phishing)
- Description field
- Submit button

#### 5. History Screen
- List of past scans
- Filter tabs (All/Safe/Scam/Suspicious)
- Search bar

### Components
- Input fields with validation
- Buttons (primary, secondary, danger)
- Status badges
- Cards with hover effects
- Form components
- Tabs for navigation/filters

### Visual Effects
- Cards: Subtle border with hover glow
- Buttons: Scale on hover
- Page load: Fade-in animation
- Smooth transitions: 200ms ease-out
- Status-specific color coding

## Functionality Specification

### Core Features
1. **SMS Scam Detection**: Paste SMS → AI analysis → Result
2. **URL Safety Checker**: Enter URL → Domain analysis → Risk score
3. **Fraud Reporting**: Submit scam reports
4. **History Tracking**: View past scans

### AI Detection Logic
- Rule-based keyword detection (urgent, legal action, pay now, etc.)
- OpenRouter API integration (free model)
- Combined scoring: AI confidence + rule-based flags

### API Endpoints
- `POST /api/detect` - Scam detection endpoint
- `POST /api/url-check` - URL safety check
- `POST /api/report` - Submit fraud report
- `GET /api/history` - Get scan history

### Data Storage
- Secure auto-expiring localStorage (see Security Features below)
- JSON-based scan storage

### Security Features

#### Secure Auto-Expiring Client Storage
- **Storage Structure**: Each item stored with value, expiry (1 hour TTL), signature (SHA-256 hash)
- **Tamper Detection**: Signature verification on every read
- **Expiry Enforcement**: Auto-delete on expiration check
- **Auto Cleanup**: Runs on app load, removes expired/tampered entries
- **Input Sanitization**: Removes dangerous characters before storing
- **Data Minimization**: Only non-sensitive data stored (no passwords/tokens)

#### Functions
- `setSecureData(key, value)` - Store with expiry and signature
- `getSecureData(key)` - Retrieve with validation (returns null if expired/tampered)
- `removeSecureData(key)` - Remove specific item
- `cleanupSecureStorage()` - Remove all expired/tampered entries
- `logout()` - Clear session data

## Acceptance Criteria
- [ ] Home screen loads with input functionality
- [ ] SMS detection returns results with confidence score
- [ ] URL checker provides domain analysis
- [ ] Report form submits and saves data
- [ ] History shows past scans
- [ ] Responsive on mobile devices
- [ ] No console errors