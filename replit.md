# Notion Database Viewer

## Overview

This is a full-stack React application that integrates with the Notion API to display database content in a clean, searchable table interface. The application allows users to view Notion databases and their records through a web interface, with features like search, filtering, and property-based sorting. It's built with modern web technologies including React, TypeScript, Express.js, and Tailwind CSS for styling.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side application is built with React 18 and TypeScript, using a component-based architecture. The application uses Vite as the build tool and development server, providing fast hot-module replacement during development. The UI is constructed using shadcn/ui components, which are built on top of Radix UI primitives and styled with Tailwind CSS. The application follows a single-page application (SPA) pattern with client-side routing handled by Wouter.

State management is handled through React Query (TanStack Query) for server state, which provides caching, background updates, and optimistic updates. Local component state is managed using React hooks. The application implements a clean separation of concerns with dedicated directories for components, pages, hooks, and utilities.

### Backend Architecture
The server is built with Express.js and follows a RESTful API design pattern. The application uses a modular approach with separate files for routes, Notion integration logic, and storage abstractions. The server implements middleware for request logging, JSON parsing, and error handling.

The backend architecture includes:
- Route handlers for Notion database operations
- Notion API client integration for fetching database schemas and records
- In-memory storage implementation with interfaces for potential database integration
- Development-specific middleware for Vite integration during development

### Data Storage Solutions
Currently, the application uses in-memory storage for any user-related data through a simple Map-based implementation. The storage layer is abstracted through interfaces, making it easy to swap in a database solution like PostgreSQL with Drizzle ORM when needed. The Drizzle configuration is already set up for PostgreSQL integration, indicating planned database functionality.

### Authentication and Authorization
The application includes basic user storage interfaces but does not currently implement active authentication. The storage layer includes user creation and retrieval methods, suggesting that authentication features are planned for future implementation. Sessions are configured to use PostgreSQL storage through connect-pg-simple when a database is connected.

### External Service Integrations
The primary external integration is with the Notion API, which requires:
- Notion Integration Secret for API authentication
- Notion Page URL containing the databases to display
- Access to specific Notion databases and their child pages

The Notion integration handles:
- Extracting database IDs from Notion URLs
- Fetching database schemas and properties
- Retrieving database records with pagination support
- Processing different Notion property types (text, numbers, dates, selections, etc.)

## External Dependencies

### Core Framework Dependencies
- **React 18**: Frontend framework with hooks and modern React patterns
- **Express.js**: Backend web server framework
- **TypeScript**: Type safety across the entire application
- **Vite**: Build tool and development server with HMR

### UI and Styling
- **Tailwind CSS**: Utility-first CSS framework for styling
- **shadcn/ui**: Component library built on Radix UI primitives
- **Radix UI**: Headless UI components for accessibility and behavior
- **Lucide React**: Icon library for consistent iconography

### Data Fetching and State Management
- **TanStack React Query**: Server state management with caching and synchronization
- **Wouter**: Lightweight client-side routing

### Database and ORM (Configured but not active)
- **Drizzle ORM**: Type-safe database ORM for PostgreSQL
- **Neon Database**: Serverless PostgreSQL database service
- **connect-pg-simple**: PostgreSQL session store for Express

### Notion Integration
- **@notionhq/client**: Official Notion API client library

### Development Tools
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay
- **@replit/vite-plugin-cartographer**: Replit-specific development tooling

### Form Handling and Validation
- **React Hook Form**: Form state management and validation
- **Zod**: Runtime type validation and schema definition
- **@hookform/resolvers**: Integration between React Hook Form and validation libraries

### Utility Libraries
- **clsx**: Conditional className utility
- **class-variance-authority**: Component variant management
- **date-fns**: Date manipulation and formatting
- **nanoid**: Unique ID generation