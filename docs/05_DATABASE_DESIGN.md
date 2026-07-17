# Database Design

## Core Entities
- Users
- Customers
- Tickets
- Ticket comments
- Attachments
- Teams
- Roles
- Audit logs

## Suggested Relationships
- A customer can have many tickets.
- A ticket belongs to one customer and one assignee.
- A ticket can have many comments and attachments.
- Users belong to one or more teams and have one or more roles.

## Notes
The schema should support auditability, permission control, and history tracking.

## Initial Schema Direction
Use a relational model with clear foreign keys and timestamps for all core entities.
