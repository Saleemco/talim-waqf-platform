# API Specification

## Base URL
https://[project-ref].supabase.co/rest/v1/

## Authentication
Headers: apikey, Authorization: Bearer {token}

## Common Endpoints
- GET /schools - List schools
- POST /schools - Create school
- GET /hufaaz?user_id=eq.{uid} - Get user's record
- POST /itqa_registrations - Register for ITQA
- GET /events - List events
- POST /enrollments - Enroll student

## Error Codes
- PGRST116: Not found
- 23505: Duplicate entry
- 23503: Foreign key violation
- 42501: Permission denied (RLS)
