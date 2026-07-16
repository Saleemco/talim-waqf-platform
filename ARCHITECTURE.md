# Architecture - Talim Waqf Platform

## Overview
React App → Supabase Cloud (Auth, PostgreSQL, Storage, Edge Functions)

## Frontend
- Features: src/features/[feature]/ with components/, hooks/, types/
- Routing: React Router v6
- State: TanStack Query (server) + React Context (client)

## Backend (Supabase)
- Database: PostgreSQL with RLS policies
- Auth: Email/password with JWT
- Storage: Buckets for avatars, documents, images

## Security
- Row Level Security (RLS)
- JWT Authentication
- Environment variables for secrets
- Input validation

## Data Flow
Component → Custom Hook → Supabase Client → API
         ← Data/Cache   ← Response   ← Response
