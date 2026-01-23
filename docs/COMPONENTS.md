# Component Library

## Overview

Personal OS uses a custom design system built with Tailwind CSS. Components are organized into:

- **UI Components** (`@/components/ui`) - Reusable primitives
- **Layout Components** (`@/components/layout`) - Page structure
- **Feature Components** (`@/components/features/*`) - Domain-specific
- **Shared Components** (`@/components/shared`) - Utility components

---

## Design Tokens

### Colors

| Token      | Value     | Usage                     |
|------------|-----------|---------------------------|
| `primary`  | Blue      | Primary actions, links    |
| `success`  | Green     | Success states, active    |
| `warning`  | Amber     | Warnings, pending         |
| `error`    | Red       | Errors, destructive       |
| `gray`     | Gray      | Neutral, borders, text    |

### Typography

- **Font Family**: Inter (sans-serif)
- **Code Font**: JetBrains Mono (monospace)

---

## UI Components

### Button

Interactive button with variants and sizes.

```tsx
import { Button } from '@/components/ui';

<Button variant="primary" size="md">Click me</Button>
<Button variant="destructive" loading>Deleting...</Button>
```

**Props:**

| Prop      | Type                                              | Default     |
|-----------|---------------------------------------------------|-------------|
| `variant` | `primary` \| `secondary` \| `outline` \| `ghost` \| `destructive` | `primary`   |
| `size`    | `sm` \| `md` \| `lg`                              | `md`        |
| `loading` | `boolean`                                         | `false`     |

### Input

Text input with label and error handling.

```tsx
import { Input } from '@/components/ui';

<Input
  label="Email"
  placeholder="you@example.com"
  error={hasError}
  helperText={hasError ? "Invalid email" : ""}
/>
```

**Props:**

| Prop         | Type      | Description          |
|--------------|-----------|----------------------|
| `label`      | `string`  | Label text           |
| `error`      | `boolean` | Error state          |
| `helperText` | `string`  | Help or error text   |

### Textarea

Multi-line text input.

```tsx
import { Textarea } from '@/components/ui';

<Textarea
  label="Description"
  rows={4}
  placeholder="Enter description..."
/>
```

### Select

Dropdown select input.

```tsx
import { Select } from '@/components/ui';

<Select label="Status">
  <option value="pending">Pending</option>
  <option value="approved">Approved</option>
</Select>
```

### Card

Content container with header, content, and footer.

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Optional description</CardDescription>
  </CardHeader>
  <CardContent>
    Main content goes here
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Badge

Status indicator badges.

```tsx
import { Badge } from '@/components/ui';

<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="error">Failed</Badge>
```

**Variants:** `default`, `success`, `warning`, `error`, `info`

### Alert

Feedback messages with optional dismiss.

```tsx
import { Alert } from '@/components/ui';

<Alert variant="error" title="Error" onDismiss={() => {}}>
  Something went wrong. Please try again.
</Alert>
```

**Variants:** `info`, `success`, `warning`, `error`

### Skeleton

Loading placeholder.

```tsx
import { Skeleton } from '@/components/ui';

<Skeleton className="h-20 w-full" />
```

---

## Layout Components

### Header

Main navigation header. Used in root layout.

```tsx
import { Header } from '@/components/layout';

<Header />
```

### PageHeader

Page title with optional description and actions.

```tsx
import { PageHeader } from '@/components/layout';

<PageHeader
  title="Contexts"
  description="Manage your organizational contexts"
  actions={<Button>New Context</Button>}
/>
```

### NavLink

Navigation link with active state.

```tsx
import { NavLink } from '@/components/layout';

<NavLink href="/contexts" exact>Contexts</NavLink>
```

---

## Feature Components

### Contexts

```tsx
import { ContextCard, ContextForm } from '@/components/features/contexts';

<ContextCard
  context={context}
  onActivate={(id) => {}}
  onDelete={(id) => {}}
/>

<ContextForm
  initialData={context}
  onSubmit={async (data) => {}}
  onCancel={() => {}}
  submitLabel="Create Context"
/>
```

### Inbox

```tsx
import { InboxItem, InboxFilters } from '@/components/features/inbox';

<InboxItem
  item={item}
  onApprove={(id) => {}}
  onOverride={(id, action) => {}}
/>

<InboxFilters
  status={status}
  sortField={sortField}
  sortOrder={sortOrder}
  minConfidence={minConfidence}
  onStatusChange={setStatus}
  onSortFieldChange={setSortField}
  onSortOrderChange={setSortOrder}
  onMinConfidenceChange={setMinConfidence}
/>
```

### Integrations

```tsx
import { GmailConnection } from '@/components/features/integrations';

<GmailConnection />
```

---

## Shared Components

### LoadingState

Loading indicator with spinner or skeleton.

```tsx
import { LoadingState } from '@/components/shared';

<LoadingState message="Loading data..." />
<LoadingState variant="skeleton" skeletonCount={3} />
```

### EmptyState

Empty state with optional action.

```tsx
import { EmptyState } from '@/components/shared';

<EmptyState
  title="No contexts"
  description="Create your first context to get started"
  action={{
    label: "Create Context",
    onClick: () => router.push('/contexts/new')
  }}
/>
```

### ErrorState

Error display with retry option.

```tsx
import { ErrorState } from '@/components/shared';

<ErrorState
  message="Failed to load data"
  retry={() => fetchData()}
/>
```

---

## Utility Function

### cn()

Combines class names with Tailwind conflict resolution.

```tsx
import { cn } from '@/lib/utils';

<div className={cn(
  'base-styles',
  isActive && 'bg-blue-500',
  className
)} />
```
