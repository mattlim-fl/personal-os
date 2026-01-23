# API Reference

## Base URL

All endpoints are relative to `/api/`.

## Authentication

Currently uses a hardcoded demo user ID. Authentication will be implemented in a future phase.

---

## Contexts API

Manage organizational contexts for filtering and categorization.

### List Contexts

```http
GET /api/contexts
```

**Query Parameters:**

| Parameter | Type    | Description                     |
|-----------|---------|---------------------------------|
| `active`  | boolean | Filter by active status         |
| `slug`    | string  | Filter by slug (exact match)    |

**Response:**

```json
{
  "data": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "slug": "project-x",
      "role": "Technical Lead",
      "objective": "Lead development of feature X",
      "constraints": "Budget limited to Q1",
      "active": true,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Create Context

```http
POST /api/contexts
```

**Request Body:**

```json
{
  "slug": "project-x",
  "role": "Technical Lead",
  "objective": "Lead development of feature X",
  "constraints": "Budget limited to Q1",
  "active": false
}
```

**Notes:**

- If `active: true`, all other contexts are automatically deactivated
- `slug` must be unique and contain only lowercase letters, numbers, and hyphens

### Get Context

```http
GET /api/contexts/[id]
```

### Update Context

```http
PATCH /api/contexts/[id]
```

**Request Body:** Any subset of context fields.

### Delete Context

```http
DELETE /api/contexts/[id]
```

### Activate Context

```http
POST /api/contexts/[id]/activate
```

Activates the specified context and deactivates all others.

---

## Inbox API

Manage inbox items from Gmail or other sources.

### List Inbox Items

```http
GET /api/inbox
```

**Query Parameters:**

| Parameter        | Type   | Description                          |
|------------------|--------|--------------------------------------|
| `status`         | string | Filter by status: `pending`, `approved`, `overridden` |
| `context_id`     | string | Filter by context ID                 |
| `min_confidence` | number | Filter by minimum confidence (0-1)   |
| `sender`         | string | Filter by sender email               |
| `source`         | string | Filter by source (e.g., `gmail`)     |
| `sort_field`     | string | Sort by: `received_at`, `confidence`, `created_at` |
| `sort_order`     | string | Sort order: `asc` or `desc`          |

**Response:**

```json
{
  "data": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "source": "gmail",
      "external_id": "gmail-thread-id",
      "subject": "Meeting tomorrow",
      "sender": "sender@example.com",
      "body_preview": "Let's discuss the project...",
      "received_at": "2024-01-01T10:00:00Z",
      "actionable": true,
      "confidence": 0.85,
      "suggested_action": "draft",
      "status": "pending",
      "context": {
        "id": "uuid",
        "slug": "project-x"
      }
    }
  ]
}
```

### Get Inbox Item

```http
GET /api/inbox/[id]
```

### Approve Item

```http
POST /api/inbox/[id]/approve
```

**Request Body:**

```json
{
  "execute": true
}
```

Approves the AI-suggested action. Sets status to `approved`.

### Override Item

```http
POST /api/inbox/[id]/override
```

**Request Body:**

```json
{
  "action": "archive",
  "context_id": "uuid",
  "execute": true
}
```

**Actions:** `archive`, `defer`, `draft`, `escalate`

Overrides with a different action. Sets status to `overridden`.

### Evaluate Inbox Items

```http
POST /api/inbox/evaluate
```

Runs the rules engine on pending inbox items to generate suggested actions.

---

## Rules API

Manage automation rules for inbox classification.

### List Rules

```http
GET /api/rules
```

**Query Parameters:**

| Parameter | Type   | Description               |
|-----------|--------|---------------------------|
| `scope`   | string | Filter by scope           |

### Create Rule

```http
POST /api/rules
```

**Request Body:**

```json
{
  "name": "Archive newsletters",
  "description": "Auto-archive newsletter emails",
  "scope": "inbox",
  "trigger": { "type": "email_received" },
  "condition": { "sender_contains": "newsletter" },
  "action": { "type": "archive" },
  "enabled": true
}
```

### Update Rule

```http
PATCH /api/rules/[id]
```

### Delete Rule

```http
DELETE /api/rules/[id]
```

---

## Gmail API

Manage Gmail integration and OAuth.

### Get Gmail Status

```http
GET /api/gmail/status
```

**Response:**

```json
{
  "data": {
    "connected": true,
    "email": "user@gmail.com",
    "last_synced_at": "2024-01-01T12:00:00Z"
  }
}
```

### Initiate OAuth

```http
GET /api/gmail/auth
```

Returns the OAuth authorization URL to redirect the user.

**Response:**

```json
{
  "data": {
    "url": "https://accounts.google.com/o/oauth2/auth?..."
  }
}
```

### OAuth Callback

```http
GET /api/gmail/callback?code=...
```

Handles the OAuth callback, exchanges code for tokens.

### Disconnect Gmail

```http
DELETE /api/gmail/status
```

Removes Gmail connection and deletes stored tokens.

---

## Health Check

```http
GET /api/health
```

**Response:**

```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "error": "Error message here"
}
```

**Common Status Codes:**

| Code | Description           |
|------|-----------------------|
| 200  | Success               |
| 201  | Created               |
| 400  | Bad Request           |
| 404  | Not Found             |
| 500  | Internal Server Error |
