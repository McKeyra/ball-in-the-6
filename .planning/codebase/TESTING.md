# Testing Patterns

**Analysis Date:** 2026-02-09

## Test Framework

**Status:** No testing framework configured

**Finding:** The project has no test setup or test files.
- No Jest, Vitest, or other test runner in `package.json`
- No `.test.js`, `.test.jsx`, `.spec.js`, or `.spec.jsx` files found in codebase
- No test configuration files (jest.config.js, vitest.config.js)
- `jsconfig.json` excludes potential test files but none exist

**Development Stack:**
- Vite for build tooling
- React for UI testing would require: `@testing-library/react`, `vitest` or `jest`
- Currently missing entire testing infrastructure

## Test File Organization

**Current State:** Not applicable - no tests present

**Recommended Structure (for future implementation):**
- Co-locate tests with source files: `ComponentName.jsx` alongside `ComponentName.test.jsx`
- Or create `__tests__` directory: `src/components/__tests__/ComponentName.test.jsx`
- Page tests in `src/pages/__tests__/PageName.test.jsx`
- API tests in `src/api/__tests__/base44Client.test.js`

## Test Structure

**Recommended Pattern (based on codebase dependencies):**

If tests were implemented with React Testing Library + Vitest:

```typescript
// Example: Component test structure
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import queryClient from '@/lib/query-client';
import MetricCard from '@/components/dashboard/MetricCard';

describe('MetricCard', () => {
  let router;

  beforeEach(() => {
    router = createMemoryRouter([
      {
        path: '/',
        element: (
          <QueryClientProvider client={queryClient}>
            <MetricCard
              title="Test Metric"
              value="100"
              trend="up"
              trendValue="+5%"
            />
          </QueryClientProvider>
        ),
      },
    ]);
  });

  it('should render metric title and value', () => {
    render(<RouterProvider router={router} />);
    expect(screen.getByText('Test Metric')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('should display trend indicator when trendValue provided', () => {
    render(<RouterProvider router={router} />);
    expect(screen.getByText('+5%')).toBeInTheDocument();
  });
});

// Example: API client test
describe('base44.entities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should list teams with sort', async () => {
    const data = await base44.entities.Team.list('-created_date', 10);
    expect(Array.isArray(data)).toBe(true);
  });

  it('should throw error on failed query', async () => {
    expect(async () => {
      await base44.entities.Team.get('invalid-id');
    }).rejects.toThrow();
  });
});
```

## Mocking

**Framework:** Not applicable - no test infrastructure

**Recommended Approach (if implemented):**

**Mocking Strategy:**
```javascript
// Mock Supabase client
import { vi } from 'vitest';
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { id: '123', name: 'Test Team' },
            error: null,
          }),
        }),
      }),
    })),
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: {
          user: {
            email: 'test@example.com',
            user_metadata: { full_name: 'Test User' },
          },
        },
        error: null,
      }),
    },
  })),
}));

// Mock React Query
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(() => ({
    data: [],
    isLoading: false,
    error: null,
  })),
  useMutation: vi.fn(() => ({
    mutate: vi.fn(),
    isLoading: false,
  })),
}));

// Mock router
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
  useLocation: vi.fn(),
  Link: ({ to, children }) => <a href={to}>{children}</a>,
}));
```

**What to Mock:**
- Supabase client (`@supabase/supabase-js`)
- React Query hooks (return empty/test data)
- Router hooks (useNavigate, useLocation)
- API calls via `base44.entities`
- Date functions if time-dependent

**What NOT to Mock:**
- Utility functions like `cn()`, `createPageUrl()`
- Component children and composition
- Event handlers (test them directly)
- Framer Motion animations (let them run)
- Lucide React icons (they're simple components)

## Fixtures and Factories

**Status:** Not implemented

**Test Data Pattern (recommended):**

```javascript
// src/__tests__/fixtures/teams.js
export const mockTeamData = {
  id: 'team-123',
  name: 'Test Team',
  sport: 'basketball',
  created_date: '2024-01-01T00:00:00Z',
  updated_date: '2024-01-01T00:00:00Z',
};

export const mockGameData = {
  id: 'game-123',
  home_team_id: 'team-123',
  away_team_id: 'team-456',
  home_team_name: 'Test Team',
  away_team_name: 'Opponent Team',
  home_score: 85,
  away_score: 78,
  status: 'completed',
  game_date: '2024-01-15T19:00:00Z',
};

export const mockPlayerData = {
  id: 'player-123',
  full_name: 'Test Player',
  team_id: 'team-123',
  number: 23,
  position: 'Guard',
  email: 'player@example.com',
};

// Factory pattern
export function createMockTeam(overrides = {}) {
  return {
    ...mockTeamData,
    ...overrides,
  };
}

export function createMockGame(overrides = {}) {
  return {
    ...mockGameData,
    ...overrides,
  };
}
```

**Location:** `src/__tests__/fixtures/` (recommended)

## Coverage

**Status:** No coverage tracking configured

**Recommendation for Implementation:**
- Add to Vitest config: `coverage: { provider: 'v8', reporter: ['text', 'json', 'html'] }`
- Target coverage: 70-80% for components, 90%+ for utilities and API client
- Exclude from coverage: UI components from radix-ui (external), generated files, config files

**View Coverage (once implemented):**
```bash
npm run test:coverage
# or
vitest run --coverage
```

## Test Types

### Unit Tests

**Scope:** Individual functions, utilities, API methods

**Approach:**
- Test utility functions: `createPageUrl()`, `toTableName()`, `cn()`
- Test API client methods: `base44.entities.Team.list()`, `.filter()`, `.create()`
- Test error handling in CRUD operations

**Example:**
```javascript
describe('createPageUrl', () => {
  it('should convert page names to kebab-case URLs', () => {
    expect(createPageUrl('PlayerDashboard')).toBe('/player-dashboard');
    expect(createPageUrl('CoachDashboard')).toBe('/coach-dashboard');
  });
});

describe('base44.entities.Team', () => {
  it('should list teams with limit', async () => {
    const teams = await base44.entities.Team.list('-created_date', 10);
    expect(teams).toHaveLength(10);
  });
});
```

### Integration Tests

**Scope:** Multiple components working together, data flow through pages

**Approach:**
- Test page components with mock data
- Test form submissions
- Test data flow from API client to component state to rendering
- Test navigation between pages

**Example:**
```javascript
describe('CoachDashboard', () => {
  it('should render teams from API and allow selection', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <CoachDashboard />
        </BrowserRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Team')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Test Team'));
    expect(screen.getByText(/lineup/i)).toBeVisible();
  });
});
```

### E2E Tests

**Status:** Not implemented

**Recommendation:** Use Playwright or Cypress if needed
- Configure separate test directory
- Test critical user flows: auth, team creation, game scoring
- Run against deployed environment or Docker container
- Not urgent for current codebase - integration tests sufficient

## Common Patterns

### Async Testing

**Pattern to implement:**

```javascript
// Using waitFor for async state updates
it('should load and display team data', async () => {
  render(<CoachDashboard />);

  // Initially loading
  expect(screen.queryByText('Test Team')).not.toBeInTheDocument();

  // Wait for data to load
  await waitFor(() => {
    expect(screen.getByText('Test Team')).toBeInTheDocument();
  });
});

// Using act() for state updates
it('should update state when form submitted', async () => {
  render(<CreateTeamForm />);

  const input = screen.getByLabelText(/team name/i);
  await userEvent.type(input, 'New Team');

  const submitButton = screen.getByRole('button', { name: /create/i });
  await userEvent.click(submitButton);

  await waitFor(() => {
    expect(screen.getByText(/team created/i)).toBeInTheDocument();
  });
});
```

### Error Testing

**Pattern to implement:**

```javascript
it('should handle API errors gracefully', async () => {
  // Mock error response
  vi.mocked(base44.entities.Team.list).mockRejectedValueOnce(
    new Error('Network error')
  );

  render(<CoachDashboard />);

  await waitFor(() => {
    expect(screen.getByText(/failed to load teams/i)).toBeInTheDocument();
  });
});

it('should show validation errors on form submit', async () => {
  render(<CreateTeamForm />);

  const submitButton = screen.getByRole('button', { name: /create/i });
  await userEvent.click(submitButton);

  await waitFor(() => {
    expect(screen.getByText(/team name is required/i)).toBeInTheDocument();
  });
});
```

## Setup Needed

**To Implement Testing:**

1. Install test dependencies:
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

2. Create vitest.config.js:
```javascript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/__tests__/',
        'src/components/ui/',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

3. Create src/__tests__/setup.js:
```javascript
import '@testing-library/jest-dom';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});

// Mock window.matchMedia for responsive tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
```

4. Update package.json scripts:
```json
{
  "scripts": {
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest run --coverage"
  }
}
```

---

*Testing analysis: 2026-02-09*
