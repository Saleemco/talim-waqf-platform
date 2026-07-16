# Database Schema - Talim Waqf Platform

## Main Tables

### 1. schools
Stores information about Islamic schools.
- id (UUID, PK)
- name (VARCHAR)
- code (VARCHAR, UNIQUE)
- address, city, state, country
- phone, email, website
- type, status
- created_at, updated_at

### 2. classes
Represents classes/lessons offered.
- id (UUID, PK)
- school_id (UUID, FK → schools)
- name, code, description
- level, type
- instructor_id (UUID → auth.users)
- max_students, current_students
- schedule (JSONB)
- status, start_date, end_date

### 3. hufaaz
Hufaaz (students who memorized Quran).
- id (UUID, PK)
- user_id (UUID, FK → auth.users)
- full_name, date_of_birth, gender
- phone, email, address
- school_id (FK → schools)
- class_id (FK → classes)
- hifdh_status, juz_memorized
- progress_percentage
- enrolled_date, status

### 4. events
Events and activities.
- id (UUID, PK)
- school_id (FK → schools)
- title, description, type
- start_date, end_date
- venue, max_attendees
- status, created_by

### 5. itqa_registrations
ITQA registrations.
- id (UUID, PK)
- user_id (FK → auth.users)
- full_name, email, phone
- date_of_birth, gender
- nationality, current_level
- status, notes
- approved_by, approved_at

### 6. enrollments
Student enrollment in classes.
- id (UUID, PK)
- hufaaz_id (FK → hufaaz)
- class_id (FK → classes)
- enrollment_date, status
- progress_percentage

### 7. user_roles
User role assignments.
- id (UUID, PK)
- user_id (FK → auth.users)
- role (admin, school_admin, instructor, student)
- school_id (FK → schools)

## Row Level Security (RLS)

### Hufaaz Table Policies
- Users can view their own record
- Admins can view all
- School admins view their school's records
- Users update own record

### ITQA Policies
- Users manage own registration
- Admins manage all registrations

### Schools Policies
- Anyone can view active schools
- Admins can manage schools

## Indexes
- Foreign key indexes
- Composite indexes for common queries
- Full-text search indexes
