
# Bharat Property Nexus API Server

This directory contains a mock Express.js API server that simulates the behavior of various government property databases in India.

## API Endpoints

The server provides the following API endpoints:

1. `POST /api/search/doris` - Delhi Online Registration Information System
2. `POST /api/search/dlr` - Department of Land Records
3. `POST /api/search/cersai` - Central Registry of Securitisation Asset Reconstruction and Security Interest
4. `POST /api/search/mca` - Ministry of Corporate Affairs Portal (MCA21)

## How to Run the Server

1. Make sure you have Node.js installed on your system
2. Navigate to this directory in your terminal
3. Install dependencies:
   ```
   npm install
   ```
4. Start the server:
   ```
   npm start
   ```
   
   For development with auto-restart on file changes:
   ```
   npm run dev
   ```

5. The server will run on port 5000 by default (http://localhost:5000)

## Request Format

Each API endpoint accepts POST requests with the following JSON structure:

```json
{
  "ownerName": "Ramesh Kumar",
  "propertyId": "DL123456",
  "registrationNumber": "REG-DEL-2022-001",
  "address": {
    "line": "Street 7, Rohini",
    "district": "North Delhi",
    "state": "Delhi",
    "pincode": "110085"
  },
  "urban": true
}
```

## Response Format

The API endpoints return responses in the following format:

```json
{
  "source": "DORIS",
  "status": "found",
  "data": {
    "ownerName": "Ramesh Kumar",
    "propertyId": "DL123456",
    "registrationNumber": "REG-DEL-2022-001",
    "ownership": "Leasehold",
    "encumbrance": "No Legal Charges",
    "area": "1200 sq.ft",
    "propertyLocation": "Street 7, Rohini, Delhi"
  }
}
```

Possible status values:
- `found`: Property records were found
- `notFound`: No records found for the given search parameters
- `unavailable`: The service is temporarily unavailable

## Error Handling

For demonstration purposes, the mock APIs have:
- 10% chance of service unavailability
- 20% chance of not finding records for the given property
