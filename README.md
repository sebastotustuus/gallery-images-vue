# Gallery Images Vue

A high-performance image gallery built with Vue 3, TypeScript, and a custom masonry layout implementation. This project features an optimized virtualization system that only renders visible elements, completely eliminates layout jumps during image loading, and provides a smooth, responsive user experience.

![Gallery Screenshot](./docs/gallery-screenshot.png)

## Features

- **Zero Jump Masonry Layout**: Custom positioning system that eliminates layout shifts during loading
- **Virtualized Grid**: Only renders elements visible in the viewport for improved performance
- **Asymmetric Recycling**: Optimized element recycling during scrolling
- **Responsive Design**: Automatically adapts to different screen sizes
- **Type Safety**: Fully typed with TypeScript
- **Comprehensive Tests**: Complete unit test coverage

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
  - [Using Node.js](#using-nodejs)
  - [Using Bun](#using-bun)
- [Running Tests](#running-tests)
- [Building for Production](#building-for-production)
- [Project Structure](#project-structure)
- [Architecture Documentation](#architecture-documentation)

## Prerequisites

Make sure you have one of the following installed:

- **Node.js**: v18.0.0 or higher
- **Bun**: v1.0.0 or higher

## Installation

### Using Node.js

```bash
# Clone the repository
git clone https://github.com/your-username/gallery-images-vue.git
cd gallery-images-vue

# Install dependencies
npm install
```

### Using Bun

```bash
# Clone the repository
git clone https://github.com/your-username/gallery-images-vue.git
cd gallery-images-vue

# Install dependencies
bun install
```

## Running the Application

### Using Node.js

Start the development server:

```bash
npm run dev
```

The application will be available at http://localhost:5173

### Using Bun

Start the development server:

```bash
bun run dev
```

The application will be available at http://localhost:5173

## Running Tests

### Using Node.js

```bash
# Run tests in watch mode
npm run test

# Run tests once
npm run test:run

# Run tests with coverage
npm run test:coverage
```

### Using Bun

```bash
# Run tests in watch mode
bun run test

# Run tests once
bun run test:run

# Run tests with coverage
bun run test:coverage
```

## Building for Production

### Using Node.js

```bash
npm run build
```

### Using Bun

```bash
bun run build
```

The built files will be in the `dist` directory, ready to be deployed.

## Project Structure

The project follows Domain-Driven Design principles with a clear separation of concerns:

```
src/
├── assets/               # Static assets
├── components/           # Shared components
├── features/             # Feature modules
│   └── gallery/          # Gallery feature
│       ├── application/  # Application services and use cases
│       ├── components/   # UI components for the gallery
│       ├── composables/  # Vue composables (useMasonryLayout, useVirtualScroll, etc.)
│       ├── domain/       # Domain entities and interfaces
│       └── infrastructure/ # External services implementation
├── layouts/              # Layout components
└── __tests__/           # Test files mirroring the source structure
```

## Architecture Documentation

For a detailed explanation of the project's architecture, design decisions, and implementation strategies, see the [ARCHITECTURE.md](./ARCHITECTURE.md) file.
