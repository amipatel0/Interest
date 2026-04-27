# Interest Management Application Documentation

Welcome to the documentation for the Interest Management Application. This project is a full-stack web application designed to track loans, calculate interest, and manage payments for customers.

## Documentation Index

- [Frontend Documentation](./frontend.md): Details the React.js frontend, including the component hierarchy, routing, state management, and pages (Dashboard, Customer List, etc.).
- [Backend Documentation](./backend.md): Details the Node.js/Express backend, including the MongoDB models, API endpoints, interest calculation logic, and PDF generation.

## Project Overview

### Purpose
To provide a centralized platform for managing private loans, calculating simple/compound interest automatically, and keeping a reliable ledger of payments.

### Key Capabilities
- **Dashboard**: High-level metrics on capital deployed and expected returns.
- **Customer Profiles**: Detailed ledgers showing original loan amounts, durations, and dynamic interest tracking.
- **Payment Processing**: Record payments that automatically deduct from the remaining balance and update the account status.
- **Statement Generation**: Export professional PDF statements for any customer.
- **Secure Access**: Protected routes ensuring only authenticated administrators can view and mutate financial data.
