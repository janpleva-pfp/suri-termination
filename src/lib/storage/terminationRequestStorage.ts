// Storage service for termination requests
// In production, this would be replaced with database operations
export interface TerminationRequest {
  id: string;
  contractNumber: string;
  insuranceCompany: string;
  contractTerminationReason: string;
  differentReason?: string;
  policyHolderType: 'person' | 'self-employed' | '';
  firstName?: string;
  lastName?: string;
  birthNumber?: string;
  ico?: string;
  companyName?: string;
  companyID?: string;
  street: string;
  town: string;
  zip: string;
  phoneNumber: string;
  email: string;
  overpaymentSendTo: 'bankAccount' | 'otherAccount' | 'address';
  bankAccount?: string;
  signature?: string;
  createdAt: string;
  updatedAt: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
}
// In-memory storage (replace with database in production)
const storage: Record<string, TerminationRequest> = {};
export class TerminationRequestStorage {
  static create(request: TerminationRequest): TerminationRequest {
    storage[request.id] = request;
    return request;
  }
  static findById(id: string): TerminationRequest | null {
    return storage[id] || null;
  }
  static findAll(): TerminationRequest[] {
    return Object.values(storage);
  }
  static update(id: string, updates: Partial<TerminationRequest>): TerminationRequest | null {
    const existing = storage[id];
    if (!existing) {
      return null;
    }
    const updated = {
      ...existing,
      ...updates,
      id, // Ensure ID cannot be changed
      updatedAt: new Date().toISOString(),
    };
    storage[id] = updated;
    return updated;
  }
  static delete(id: string): boolean {
    if (!storage[id]) {
      return false;
    }
    delete storage[id];
    return true;
  }
  static count(): number {
    return Object.keys(storage).length;
  }
  static clear(): void {
    Object.keys(storage).forEach((key) => delete storage[key]);
  }
}
