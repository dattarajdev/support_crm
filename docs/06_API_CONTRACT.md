# API Contract

## Overview
The API should expose endpoints for managing tickets, customer data, users, and reports.

## Suggested Endpoints
- GET /api/tickets
- GET /api/tickets/:id
- POST /api/tickets
- PATCH /api/tickets/:id
- POST /api/tickets/:id/comments
- GET /api/customers
- POST /api/customers
- GET /api/users/me

## Response Conventions
- Standard JSON response format
- Consistent error objects with status and message
- Pagination for list endpoints

## Authentication
All protected endpoints should require authentication and appropriate authorization.
