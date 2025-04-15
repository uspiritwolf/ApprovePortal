# ApprovePortal Project

## Project Structure

The project consists of two main components:

### 1. Backend (`ApprovePortal.Server`)
- **Framework**: .NET 9
- **Description**: This is the server-side application that handles API requests, authentication, and database interactions.
- **Key Features**:
  - Uses `Microsoft.AspNetCore.Authentication.JwtBearer` for authentication.
  - Entity Framework Core with SQLite for database management.
  - Includes migrations for database schema updates.
  - Configured to serve the frontend application using `Microsoft.AspNetCore.SpaProxy`.

### 2. Frontend (`approveportal.client`)
- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **Description**: This is the client-side application that provides the user interface.
- **Key Features**:
  - Tailwind CSS for styling.
  - Proxy configuration to route API requests to the backend.
  - HTTPS setup using development certificates.