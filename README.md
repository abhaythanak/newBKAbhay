# DevTinder 🚀

[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/your-username/BackendL/issues)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

DevTinder is a full-stack web application designed to connect developers. It features a Tinder-like swipe interface, allowing developers to find matches based on skills, experience, and interests.

## 🌟 Features

- **Tinder-like Swipe Interface**: Smooth, animated card swiping (Like/Nope) using Framer Motion.
- **Match System**: Connect with other developers when there is a mutual "Like".
- **User Profiles**: Detailed profiles showcasing skills, bio, age, and gender.
- **Secure Authentication**: JWT-based authentication using HTTP-only cookies for enhanced security.
- **Responsive Design**: A sleek, dark-mode first UI built with TailwindCSS and Next.js.

## 🏗 Architecture

The project is structured as a monorepo containing both the frontend and backend applications:

- `/backend`: Node.js / Express REST API, powered by MongoDB and Mongoose.
- `/frontend`: Next.js 14+ (App Router) React application, using React Query for data fetching and TailwindCSS for styling.

## 🚀 Getting Started

Follow these instructions to set up the project locally for development and testing.

### Prerequisites

- Node.js (v18+)
- npm or yarn
- MongoDB (Local instance or MongoDB Atlas cluster)

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Copy `.env.example` to `.env` and fill in your details:
   ```bash
   cp .env.example .env
   ```
   *(Ensure you provide a valid `DB_CONNECTION_SECRET` and `JWT_SECRET`)*
4. Run the development server:
   ```bash
   npm run dev
   ```
   The backend will start on `http://localhost:5555`.

### 2. Frontend Setup

1. Navigate to the frontend directory (in a new terminal):
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
   The frontend will start on `http://localhost:3000`.

## 🤝 Contributing

We love open source and welcome contributions from the community! 

Please read our [Contributing Guidelines](CONTRIBUTING.md) to get started with setting up your environment, formatting code, and submitting Pull Requests.

## 📝 API Documentation

For detailed information about the available backend endpoints, please refer to the [API List](backend/ApiList.md).

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
