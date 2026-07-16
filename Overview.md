# Project Overview - Talim Waqf Platform

## Project Name
Talim Waqf Platform

## Description
A comprehensive educational management platform designed to support Islamic education institutions. The platform manages schools, classes, Hufaaz (Quran memorization students), events, ITQA registrations, resources, Arabic studies, and Waqf (endowment) management.

## Core Objectives
1. Centralized Management - Single platform for all educational activities
2. User-Friendly Interface - Intuitive design for all users
3. Data Security - Protect sensitive data
4. Scalability - Support multiple schools and growing users
5. Islamic Context - Tailored for Islamic educational institutions

## Target Users
- System Administrators - Full system access
- School Administrators - Manage their specific school
- Instructors/Teachers - Manage classes and student progress
- Students/Hufaaz - Track their learning
- Parents - Monitor children's progress (future)

## Key Features

### Authentication & Authorization
- User registration and login (email/password)
- Role-based access control (Admin, School Admin, Instructor, Student)
- Protected routes and API endpoints

### School Management
- Create, read, update, delete schools
- School profiles with contact information
- School status tracking

### Class Management
- Create classes linked to schools
- Assign instructors to classes
- Track class capacity and enrollment
- Class scheduling and status

### Hufaaz Management
- Student profiles with personal information
- Track memorization progress (juz memorized)
- Hifdh status tracking (partial/full/reviewing)
- Link students to schools and classes
- **Security:** Students only view own records; admins view all

### ITQA Registration
- Registration form for International Quranic Arabic program
- Admin approval workflow
- Track registration status (pending/approved/rejected)

### Event Management
- Create and manage events
- Event registration and attendance tracking
- Event status (upcoming/ongoing/completed)

### Resource Management
- Upload and manage educational resources
- Categorize resources by type
- Search and filter functionality

### Arabic Studies
- Manage Arabic language learning materials
- Track student progress

### Waqf/Endowment Management
- Track waqf contributions and endowments
- Manage waqf projects and funds

### Dashboard & Analytics
- Key performance indicators
- Charts and visualizations
- Recent activity feed
- Export reports (future)

## Technology Stack

### Frontend
- Framework: React 18
- Language: TypeScript
- Styling: Tailwind CSS
- Build Tool: Vite
- Routing: React Router v6
- State Management: TanStack Query + React Context

### Backend (Supabase)
- Platform: Supabase
- Database: PostgreSQL with RLS
- Authentication: Supabase Auth
- Storage: Supabase Storage
- Serverless: Edge Functions (future)

### Development Tools
- Code Quality: ESLint, TypeScript
- Version Control: Git
- Deployment: Vercel/Netlify

## Project Structure