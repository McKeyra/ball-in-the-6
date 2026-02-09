# Coding Conventions

**Analysis Date:** 2026-02-09

## Naming Patterns

**Files:**
- React components: PascalCase (e.g., `PlayerDashboard.jsx`, `MetricCard.jsx`)
- Pages: PascalCase (e.g., `Home.jsx`, `CoachDashboard.jsx`)
- Utility functions: camelCase in .js files (e.g., `createPageUrl`, `toTableName`)
- Hooks: camelCase with `use` prefix (e.g., `useIsMobile`)
- UI components: PascalCase (e.g., `Button`, `Card`)

**Functions:**
- camelCase for all function names
- Helper functions declared before main component export: `function helperName() { ... }`
- Async functions clearly marked with `async` keyword
- Event handlers: `handleEventName` or `onEventName` pattern

**Variables:**
- camelCase for local variables and constants in code
- SCREAMING_SNAKE_CASE for configuration constants (e.g., `MOBILE_BREAKPOINT = 768`, `THEME`)
- useState hooks: `[state, setState]` pattern
- Boolean variables: `is`, `has`, `can` prefixes (e.g., `isMobile`, `hasError`)

**Types:**
- Props objects passed as parameters without type annotations (JSX with no TypeScript)
- Object keys match database column names in snake_case when from Supabase

## Code Style

**Formatting:**
- No Prettier config detected - using ESLint defaults
- Manual formatting observed:
  - 2-space indentation
  - Semicolons at end of statements
  - Single quotes in JavaScript, double quotes in JSX attributes
  - Long import lists broken into multiple lines with each item on own line

**Linting:**
- ESLint with react plugin, react-hooks plugin, unused-imports plugin
- Config: `/Users/mckeyra/22/ball-in-the-6/eslint.config.js`
- Rules enforced:
  - React hooks rules of hooks (`react-hooks/rules-of-hooks: error`)
  - No unused imports (`unused-imports/no-unused-imports: error`)
  - Unused variables warned with `^_` pattern allowed (`unused-imports/no-unused-vars: warn`)
  - React prop-types disabled (`react/prop-types: off`)
  - JSX scope rule disabled (`react/react-in-jsx-scope: off`)

## Import Organization

**Order:**
1. React imports: `import { useState, useEffect } from "react"`
2. External library imports: routing, data fetching, UI libs
3. Component imports: `import { ComponentName } from "@/components/..."`
4. Icon imports: batch import from lucide-react
5. Utility/API imports: `import { functionName } from "@/utils"` or `import { base44 } from "@/api/base44Client"`

**Path Aliases:**
- `@/*` maps to `./src/*` - used universally
- Examples: `@/components`, `@/api`, `@/utils`, `@/lib`

**Examples:**
```javascript
// From Home.jsx
import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  PlayCircle, Tv, Settings, Eye,
  // ... (icon list broken across lines)
} from "lucide-react";
```

## Error Handling

**Patterns:**
- Try-catch blocks for async operations and error-prone code
- Silent catches with empty comments: `catch { /* ignore */ }`
- Error throwing from API client: `if (error) throw error;` pattern used universally
- Fallback returns on error: `.catch(() => null)` for optional data loads
- Console.error for unexpected errors: `console.error('Error description:', error);`

**Examples from codebase:**
```javascript
// From Home.jsx
try {
  return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
} catch {
  return "";
}

// From base44Client.js - Auth fallback
try {
  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role, full_name, organization_id, team_id')
    .eq('email', user.email)
    .single();
  if (roleData) {
    userRole = roleData.role;
  }
} catch {
  // If role lookup fails, default to fan
}

// From Layout.jsx - Async fallback
base44.auth.me().then(setUser).catch(() => null);
```

## Logging

**Framework:** `console` object (no structured logging library)

**Patterns:**
- `console.error()` for errors with context: `console.error('Error creating program:', error);`
- `console.log()` for debugging: `console.log("Sponsor clicked:", sponsor);`
- No logging in production code - only in error conditions or debug cases
- Errors logged at point of catch with descriptive prefix

## Comments

**When to Comment:**
- Section dividers for major code sections: `/* ───────────────────── helpers ───────────────────── */`
- Inline comments for non-obvious logic
- Comments for ignored catches or special cases: `/* ignore */`
- Component section markers: `/* ── timeline queries (lazy) ──`, `/* ── computed ──`

**JSDoc/TSDoc:**
- Not used - no type annotations in codebase
- displayName set on forwardRef components: `Button.displayName = "Button"`

## Function Design

**Size:**
- Functions generally 20-100 lines
- Larger functions broken into helper functions prefixed with underscore when private
- Render functions broken into separate named functions: `renderAppsTab()`, `renderTimelineTab()`

**Parameters:**
- Object destructuring in parameters for component props: `export default function MetricCard({ title, value, icon: Icon, trend, trendValue, color = "blue" })`
- Default parameters used: `color = "blue"`
- No parameter validation - defensive null coalescing used in rendering

**Return Values:**
- Early returns for guard clauses
- Consistent return of data or empty arrays: `return data || [];`
- Null/undefined for optional data: `.catch(() => null)`

## Module Design

**Exports:**
- Default export for page components: `export default function CoachDashboard() { ... }`
- Named exports for UI components: `export { Button, buttonVariants }`
- Mixed approach for utilities

**Barrel Files:**
- Not detected - imports are direct from component files
- `craft` components imported together: `import { B6Header, B6BottomNav, B6MobileMenu } from "./components/craft";`

## Component Patterns

**Functional Components:**
- All components are function components with hooks
- useState, useEffect, useMemo, useQuery heavily used
- useIsMobile hook for responsive behavior

**Props Pattern:**
```javascript
// Destructured in parameters with defaults
export default function MetricCard({
  title,
  value,
  icon: Icon,  // Icon renamed to Icon for component usage
  trend,
  trendValue,
  color = "blue"
})
```

**State Management:**
- Local React state for UI state (active tabs, search, filters)
- React Query for server state: `useQuery`, `useMutation`, `useQueryClient`
- Context for shared state: `TimeoutProvider`, `GameClockProvider`
- Custom auth context: `AuthContext` in `/Users/mckeyra/22/ball-in-the-6/src/lib/AuthContext.jsx`

**Data Fetching:**
- React Query with `base44.entities.EntityName.method()` API pattern
- Lazy queries with `enabled` flag
- Data mutations with `useMutation`

## Styling

**Tailwind CSS:**
- Utility classes applied directly to elements
- Custom color palette: `#c9a962` (gold/brown accent)
- Background: `#0f0f0f` (nearly black)
- Transparent overlays: `bg-white/[0.06]`, `text-white/40`
- Border styling: `border border-white/[0.06]`

**Class Composition:**
- Using `cn()` utility from `/Users/mckeyra/22/ball-in-the-6/src/lib/utils.js`
- CVA (class-variance-authority) for component variants: `cva()` in button component
- Dynamic classes in template literals: Avoided - inline styles or separate classNames

**Motion:**
- Framer Motion for animations
- Standard patterns: `initial={{ opacity: 0, y: 20 }}`, `animate={{ opacity: 1, y: 0 }}`
- AnimatePresence for exit animations
- No CSS animations

## Constants Organization

**Theme Constants:**
```javascript
const THEME = {
  background: '#0f0f0f',
  card: 'bg-white/[0.07]',
  border: 'border-white/[0.06]',
  accent: '#c9a962',
  text: {
    primary: 'text-white',
    secondary: 'text-white/60',
  },
};
```

**Data Constants:**
- Organized by section at top of file
- TABS array, FORM_CATEGORIES array, sections array in Home.jsx
- Form field definitions as objects with id, label, placeholder, options

---

*Convention analysis: 2026-02-09*
