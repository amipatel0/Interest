# Backend Documentation

This document outlines the backend architecture, features, database models, and API endpoints of the Interest Management Web Application.

## Technology Stack
- **Environment**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Other Tools**: Node-cron (for reminders), PDFKit (for PDF generation)

## Core Features
1. **Admin Authentication**: Secure login system with hardcoded/database admin credentials.
2. **Customer Management**: CRUD operations for customer records, including loan terms.
3. **Interest Calculation**: Automatic calculation of monthly, yearly, and total interest.
4. **Payment Tracking**: Logging payments and dynamically updating remaining balances and customer status.
5. **PDF Generation**: Generating account statements for customers.

## Database Models

### 1. Admin Model (`models/Admin.js`)
- **Schema**: `username`, `password`
- **Purpose**: Stores admin credentials for authentication.

### 2. Customer Model (`models/Customer.js`)
- **Schema**: `name`, `photo`, `phone`, `address`, `amount`, `interest_rate`, `start_date`, `end_date`, `duration`, `payment_method`, `status`
- **Purpose**: Core entity representing a borrower.

### 3. Interest Calculation Model (`models/InterestCalculation.js`)
- **Schema**: `customer_id` (ref: Customer), `monthly_interest`, `yearly_interest`, `total_amount`
- **Purpose**: Stores pre-calculated interest metrics for quick retrieval.

### 4. Payment Model (`models/Payment.js`)
- **Schema**: `customer_id` (ref: Customer), `paid_amount`, `remaining_amount`, `payment_date`
- **Purpose**: Tracks individual payments made by customers.

## API Controllers & Routes

### Auth Controller (`controllers/authController.js`)
- **`POST /api/auth/login`**: Authenticates the admin and returns a JWT token. Recently modified to use static credentials.

### Customer Controller (`controllers/customerController.js`)
- **`POST /api/customers`**: Adds a new customer and calculates initial interest metrics.
- **`GET /api/customers`**: Retrieves all customers.
- **`GET /api/customers/stats`**: Retrieves aggregate statistics for the dashboard (total customers, total amount given, total expected interest).
- **`GET /api/customers/:id`**: Retrieves full details of a specific customer, including interest calculations and payment history.
- **`PUT /api/customers/:id`**: Updates customer details and recalculates interest if financial metrics change.
- **`DELETE /api/customers/:id`**: Deletes a customer and cascades deletion to associated calculations and payments.
- **`PUT /api/customers/:id/status`**: Manually updates a customer's status.
- **`GET /api/customers/:id/pdf`**: Generates and downloads a PDF statement using PDFKit.

### Payment Controller (`controllers/paymentController.js`)
- **`POST /api/customers/:customerId/payments`**: Records a new payment, calculates the remaining amount, and automatically updates the customer's status (e.g., to 'paid' if the balance reaches 0).
- **`GET /api/customers/:customerId/payments`**: Retrieves the payment history for a specific customer.

## Background Services
- **Cron Jobs**: Configured in `server.js` using `node-cron` to run daily checks (e.g., reminder system) at 09:00.
