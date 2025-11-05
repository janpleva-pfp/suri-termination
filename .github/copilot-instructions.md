# Copilot Instructions - Contract Cancellation App

## Thinking before coding
Always first lay out the plan before writing code. Consider the architecture, patterns, and best practices used in the project. Ensure any new code adheres to existing conventions.
Inform about the plan before continuening with code changes.
Ask clarifying questions if requirements are ambiguous.

## Architecture Overview

This is a **Next.js 14** contract cancellation application with SSR, using React Hook Form for validation and the `@pfp/frontend-platform` component library. The app consists of a multi-step form for insurance contract termination with signature functionality.

### Key Technologies
- **Next.js 14.2.24** with TypeScript and SSR
- **React Hook Form 7.62.0** with controlled components pattern
- **@pfp/frontend-platform 0.0.39** - Internal UI component library (emotion-based styling)
- **React Bootstrap 2.10.9** for base styling
- **next-i18next** for internationalization
- **yarn** for package management

## Critical SSR Compatibility Patterns

### ⚠️ Platform Component SSR Issues
The `@pfp/frontend-platform` package uses emotion styling that breaks during SSR. **Always use dynamic imports with `ssr: false`**:

```tsx
// ✅ Correct pattern for platform components
import { TextField } from '@pfp/frontend-platform';

// ✅ Client-side detection for hydration safety
const [isClient, setIsClient] = useState(false);
useEffect(() => setIsClient(true), []);
return <TextField ... />;

```

### Controlled Components Architecture
All form fields use the **controlled components pattern** in `src/components/ui/hook-form-ui/`:
- `ControlledInputField`, `ControlledSelectField`, `ControlledPFPSelectField` (AsyncSelectField)
- `ControlledRadioGroupField`, `ControlledTextAreaField`, `ControlledSignatureField`
- `ControlledDigitsOnlyInputField`, `ControlledPhoneInputField`
- **All components now use PFP library** with SSR-safe dynamic imports
- Each wraps PFP components with React Hook Form's `Controller`

## Form Validation & State Management

### Form Structure Pattern
```tsx
const { control, handleSubmit, watch, formState: { errors }, setValue } = useForm<FormData>({
  mode: 'onBlur',
  reValidateMode: 'onChange',
  defaultValues: { /* all fields */ }
});

// Watch specific fields for conditional rendering
const watchedField = watch('fieldName');
```

### Validation Constants
- Regex patterns in `constants/form.ts`: `FORM_FIELD_EMAIL_REGEX`, `FORM_FIELD_PHONE_REGEX`, etc.
- Error messages: `FORM_ERR_FIELD_*` constants

### Section-Based Form Architecture
Form is split into logical sections in `src/components/ContractCancellationForm/sections/`:
- `ContractInfoSection` - Insurance company, contract details
- `PolicyHolderSection` - Personal/company information
- `RefundInfoSection` - Payment return details  
- `SignatureSection` - Digital signature with canvas

## API Patterns

### API Structure
- **Frontend APIs**: `src/pages/api/` - client-side API endpoint that handles frontend api calls
- **Actions**: `src/pages/action/` - client action functions
- **Server APIs**: `server/api/` - server-side API implementations

### API Call Pattern
```tsx
// All APIs return consistent structure
const response = await apiRequest({
  action: contractCancellationRequestId ? 'lbEditTermination' : 'lbNewTermination',
  ...(contractCancellationRequestId && { linkId: contractCancellationRequestId }),
  target: 'client',
  data,
  lbData: state.appState.linkBuilderData,
});
if (response.status === 200) {
  // Handle success with response.data
} else {
  // Handle error with response.error
}
```

### Environment Configuration
- `config/config.ts` - API base URLs (currently hardcoded to stage)
- `getRestUrl()` returns backend URL
- Custom axios instances via `server/createAxiosInstance.ts`

## Development Workflow

### Scripts
```bash
yarn dev          # Next.js dev server on port 3003
yarn build        # Production build with type checking
yarn test         # Jest unit tests
yarn test:api     # API integration tests (*.apitest.ts)
yarn lint         # ESLint with Next.js config
yarn start        # Production server
yarn type-check   # TypeScript compilation check
```

### Custom Server
- **Port detection**: Automatically finds available port starting from 3000
- **Development**: Runs on port 3003 via `yarn dev`
- **Production**: Custom Node.js server in `server.ts`

## Testing Strategy

### Test Structure
- `__tests__/` - Unit tests with mock data
- `**/*.apitest.ts` - API integration tests
- `jest.config.ts` - Next.js Jest configuration
- `jest.setup.ts` - Global test setup

### Mock Data Pattern
```typescript
// __tests__/mock-data/form-helper.ts
export const appState = {
  formData: { /* structured form data */ }
};
```

## Styling & UI Components

### Component Hierarchy
```
src/components/
├── ui/hook-form-ui/     # React Hook Form wrappers (Controlled*)
├── layout/              # Layout components (Layout, Header)
└── ContractCancellationForm/ # Main form sections
```

### Styling Approach
- **@pfp/frontend-platform** components for all form fields (TextField, AsyncSelectField, RadioGroupField)
- **React Bootstrap** for layout and base styling
- **SCSS modules** for component-specific styles
- **All PFP components** use SSR-safe dynamic imports with skeleton loading states

## Key Files Reference

- `src/pages/_app.tsx` - App initialization, theme providers, website detection
- `src/components/ContractCancellationForm/ContractCancellationForm.tsx` - Main form logic
- `src/components/ui/hook-form-ui/ControlledFields.tsx` - Form component library
- `constants/form.ts` - Validation patterns and error messages
- `server.ts` - Custom Next.js server with port detection
- `next.config.js` - Next.js configuration with i18n

## Troubleshooting

### Common Issues
1. **Emotion SSR errors**: Use dynamic imports with `ssr: false` for platform components
2. **Hydration mismatches**: Ensure consistent server/client rendering
3. **Port conflicts**: Server auto-detects available ports
4. **Translation keys**: Use `tr(key)` helper, defined in each component

### Debug Patterns
- Console logging in form submission handlers
- Form state inspection with React DevTools
- API response logging in network tab
- SSR/hydration debugging with Next.js debug mode
