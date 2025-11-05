import { InsuranceCompanyOption } from './InsuranceCompanyOption';
import { LinkBuilderState } from './TerminationEntity/LinkBuilderState';
export interface AppState {
  state: LinkBuilderState;
  insuranceCompanies: InsuranceCompanyOption[];
  isLoading: boolean;
  error: Error | null;
}
export interface FormState {
  isSubmitting: boolean;
  isDirty: boolean;
  isValid: boolean;
  submitCount: number;
  lastSubmitTime: number | null;
}

export interface FormContextProps {
  formState: FormState;
  setSubmitting: (submitting: boolean) => void;
  setDirty: (dirty: boolean) => void;
  setValid: (valid: boolean) => void;
  incrementSubmitCount: () => void;
  updateLastSubmitTime: () => void;
  resetFormState: () => void;
}
export interface UIState {
  isLoading: boolean;
  error: string | null;
  theme: string;
  isClient: boolean;
}

export interface UIContextProps {
  uiState: UIState;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setTheme: (theme: string) => void;
  setIsClient: (isClient: boolean) => void;
}
