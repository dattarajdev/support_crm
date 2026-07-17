# API CONTRACT

## Project

SupportFlow - Customer Support Ticketing CRM

---

# Overview

The backend exposes REST APIs that allow the frontend to create, retrieve, update, and manage customer support tickets.

Base URL

```
/api
```

---

# 1. Create Ticket

## Endpoint

```
POST /api/tickets
```

## Description

Creates a new support ticket.

---

## Request Body

```json
{
  "customer_name": "John Doe",
  "customer_email": "john@example.com",
  "subject": "Cannot login",
  "description": "Login button keeps loading"
}
```

---

## Validation Rules

- customer_name is required
- customer_email is required
- subject is required
- description is required

---

## Success Response (201 Created)

```json
{
  "ticket_id": "TKT-001",
  "created_at": "2026-07-17T18:30:00Z"
}
```

---

# 2. Get All Tickets

## Endpoint

```
GET /api/tickets
```

---

## Optional Query Parameters

| Parameter | Description |
|------------|-------------|
| status | Filter by status |
| search | Search by customer name |

Example

```
GET /api/tickets?status=Open

GET /api/tickets?search=John
```

---

## Success Response

```json
[
  {
    "ticket_id": "TKT-001",
    "customer_name": "John Doe",
    "subject": "Cannot login",
    "status": "Open",
    "created_at": "2026-07-17T18:30:00Z"
  }
]
```

---

# 3. Get Ticket Details

## Endpoint

```
GET /api/tickets/{ticket_id}
```

Example

```
GET /api/tickets/TKT-001
```

---

## Success Response

```json
{
  "ticket_id": "TKT-001",
  "customer_name": "John Doe",
  "customer_email": "john@example.com",
  "subject": "Cannot login",
  "description": "Login button keeps loading",
  "status": "Open",
  "notes": [
    {
      "note_text": "Customer contacted via email.",
      "created_at": "2026-07-17T19:00:00Z"
    }
  ]
}
```

---

# 4. Update Ticket

## Endpoint

```
PUT /api/tickets/{ticket_id}
```

Example

```
PUT /api/tickets/TKT-001
```

---

## Request Body

```json
{
  "status": "Closed",
  "notes": "Issue resolved successfully."
}
```

---

## Validation Rules

Allowed status values:

- Open
- In Progress
- Closed

---

## Success Response

```json
{
  "success": true,
  "updated_at": "2026-07-17T20:00:00Z"
}
```

---

# HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Resource Created |
| 400 | Bad Request |
| 404 | Ticket Not Found |
| 500 | Internal Server Error |

---

# Project Scope

This API intentionally supports only:

- Create Ticket
- View Tickets
- View Ticket Details
- Update Ticket Status
- Add Notes

The following are **out of scope**:

- Authentication
- User Management
- File Uploads
- Notifications
- Ticket Priority
- Categories