# Frontend Documentation

This document outlines the frontend structure, components, pages, and features of the Interest Management Web Application.

## Technology Stack
- **Framework**: React.js with Vite
- **Routing**: React Router DOM
- **Styling**: Vanilla CSS (`index.css`)
- **State Management**: React Context API (`AuthContext`)

## Directory Structure
The frontend source code is located in the `src` directory with the following structure:
- `api/`: Contains Axios configuration and API endpoint calls.
- `components/`: Reusable UI components.
- `context/`: Application state management (Auth).
- `pages/`: Main views/routes of the application.
- `App.jsx`: Root component handling routing and layout.
- `main.jsx`: Entry point for the React application.

## Pages

### 1. Login (`/login`)
- **File**: `src/pages/Login.jsx`
- **Features**: Handles user (admin) authentication. Submits credentials to the backend and stores the auth token in local storage via `AuthContext`.

### 2. Dashboard (`/dashboard`)
- **File**: `src/pages/Dashboard.jsx`
- **Features**: 
  - Displays summary statistics like total customers, total amount given, and expected interest.
  - Fetches data from the `/api/customers/stats` endpoint.

### 3. Customer List (`/customers`)
- **File**: `src/pages/CustomerList.jsx`
- **Features**:
  - Displays a list of all customers.
  - Shows customer name, loan amount, start date, and status.
  - Allows navigation to individual customer detail pages.

### 4. Add Customer (`/add-customer`)
- **File**: `src/pages/AddCustomer.jsx`
- **Features**:
  - Form to add a new customer.
  - Captures name, phone, address, loan amount, interest rate, duration, and start/end dates.
  - Automatically calculates basic interest metrics upon submission.

### 5. Customer Detail (`/customers/:id`)
- **File**: `src/pages/CustomerDetail.jsx`
- **Features**:
  - Comprehensive view of a single customer's details.
  - Displays loan terms, interest calculations, and payment history.
  - Includes functionality to add a new payment.
  - Generates a PDF statement.
  - Allows editing customer details and deleting the customer.

## Components

### 1. Layout
- **File**: `src/components/Layout.jsx`
- **Features**: 
  - Main application wrapper for authenticated routes.
  - Contains the sidebar/navigation menu.
  - Handles the logout functionality.

### 2. Calculator
- **File**: `src/components/Calculator.jsx`
- **Features**:
  - A standalone calculator widget that allows users to quickly calculate interest (simple or compound) without creating a customer record.

## Context & State Management

### AuthContext
- **File**: `src/context/AuthContext.jsx`
- **Features**:
  - Manages the authentication state across the application.
  - Provides `login` and `logout` functions.
  - Protects routes from unauthorized access via the `ProtectedRoute` component in `App.jsx`.
