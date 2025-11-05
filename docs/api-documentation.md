# Termination Request REST API

This document describes the REST API endpoints for managing contract termination requests.

## API Endpoints

### 1. Create Termination Request

**POST** `/api/termination-request`

Creates a new termination request with optional data. All fields are optional - if no body is provided, an empty record with default values will be created.

**Request Body:** (All fields optional)

```json
{
  "contractNumber": "POL-2024-001234",
  "insuranceCompany": "Allianz",
  "contractTerminationReason": "anniversary-of-insurance-contract",
  "differentReason": "Optional custom reason",
  "policyHolderType": "person",
  "firstName": "Jan",
  "lastName": "Novák",
  "birthNumber": "8901015555",
  "ico": "12345678",
  "companyName": "My Company s.r.o.",
  "companyID": "87654321",
  "street": "Václavské náměstí 1",
  "town": "Praha",
  "zip": "11000",
  "phoneNumber": "777123456",
  "email": "jan.novak@example.com",
  "overpaymentSendTo": "bankAccount",
  "bankAccount": "1234567890/0100",
  "signature": "data:image/png;base64,..."
}
```

**Response:**

```json
{
  "success": true,
  "message": "Termination request created successfully",
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "contractNumber": "POL-2024-001234",
    "insuranceCompany": "Allianz",
    "createdAt": "2024-08-04T10:30:00.000Z",
    "updatedAt": "2024-08-04T10:30:00.000Z",
    "status": "pending"
  }
}
```

### 2. Sign Termination Request

**POST** `/api/termination-request-sign`

Adds a signature to an existing termination request and changes its status to "processing".

**Request Body:** (Both fields required)

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "signature": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
}
```

**Response:**

```json
{
  "success": true,
  "message": "Signature added successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "contractNumber": "POL-2024-001234",
    "signature": "data:image/png;base64,...",
    "status": "processing",
    "updatedAt": "2024-08-04T11:30:00.000Z"
  }
}
```

Creates a new empty termination request record and returns a unique ID.

**Request Body:** (No body required)

**Response:**

```json
{
  "success": true,
  "message": "Empty termination request created successfully",
  "id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Request Body:**

```json
{
  "contractNumber": "POL-2024-001234",
  "insuranceCompany": "Allianz",
  "contractTerminationReason": "anniversary-of-insurance-contract",
  "differentReason": "Optional custom reason",
  "policyHolderType": "person", // "person" | "self-employed" | ""
  "firstName": "Jan",
  "lastName": "Novák",
  "birthNumber": "8901015555",
  "ico": "12345678", // For companies
  "companyName": "My Company s.r.o.", // For companies
  "companyID": "87654321", // For companies
  "street": "Václavské náměstí 1",
  "town": "Praha",
  "zip": "11000",
  "phoneNumber": "777123456",
  "email": "jan.novak@example.com",
  "overpaymentSendTo": "bankAccount", // "bankAccount" | "otherAccount" | "address"
  "bankAccount": "1234567890/0100",
  "signature": "data:image/png;base64,..." // Optional base64 signature
}
```

**Response:**

```json
{
  "success": true,
  "message": "Termination request created successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "contractNumber": "POL-2024-001234",
    // ... all other fields
    "createdAt": "2024-08-04T10:30:00.000Z",
    "updatedAt": "2024-08-04T10:30:00.000Z",
    "status": "pending" // "pending" | "processing" | "completed" | "rejected"
  }
}
```

### 2. Get All Termination Requests

**GET** `/api/termination-request?page=1&limit=10`

Retrieves all termination requests with pagination.

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000"
      // ... termination request data
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalItems": 25,
    "itemsPerPage": 10
  }
}
```

### 3. Get Specific Termination Request

**GET** `/api/termination-request/{id}`

Retrieves a specific termination request by ID.

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000"
    // ... all termination request fields
  }
}
```

### 4. Update Termination Request

**POST** `/api/termination-request/{id}`
**PUT** `/api/termination-request/{id}`

Updates an existing termination request. Only provided fields will be updated.

**Request Body:** (Partial update - include only fields to update)

```json
{
  "phoneNumber": "777999888",
  "status": "completed",
  "signature": "data:image/png;base64,..."
}
```

**Response:**

```json
{
  "success": true,
  "message": "Termination request updated successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    // ... updated termination request data
    "updatedAt": "2024-08-04T11:45:00.000Z"
  }
}
```

### 5. Delete Termination Request

**DELETE** `/api/termination-request/{id}`

Deletes a termination request.

**Response:**

```json
{
  "success": true,
  "message": "Termination request deleted successfully"
}
```

## Status Values

- `pending`: Initial state when created without signature
- `processing`: When signature is added or being processed
- `completed`: Successfully processed
- `rejected`: Rejected due to validation or other issues

## Error Responses

All endpoints return error responses in this format:

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

Common HTTP status codes:

- `400`: Bad Request (missing required fields, invalid data)
- `404`: Not Found (termination request doesn't exist)
- `405`: Method Not Allowed
- `500`: Internal Server Error

## JavaScript/TypeScript Client Usage

```typescript
import {
  apiSendTerminationData,
  apiGetTerminationRequests,
  apiGetTerminationRequest,
  apiUpdateTerminationRequest,
  apiDeleteTerminationRequest,
  apiAddSignatureToRequest,
} from './api/apiTerminationRequest';

// Create new request
const result = await apiSendTerminationData(formData);

// Get all requests
const allRequests = await apiGetTerminationRequests(1, 10);

// Get specific request
const request = await apiGetTerminationRequest(id);

// Update request
const updated = await apiUpdateTerminationRequest(id, { status: 'completed' });

// Add signature
const withSignature = await apiAddSignatureToRequest(id, signatureBase64);

// Delete request
const deleted = await apiDeleteTerminationRequest(id);
```

## Notes

- All timestamps are in ISO 8601 format (UTC)
- The API uses in-memory storage for demonstration. In production, replace with a proper database.
- IDs are generated using UUID v4
- Signature data should be in base64 format
- When a signature is added to a request, the status automatically changes to "processing"
