# Contributing to DevTinder

First off, thank you for considering contributing to DevTinder! It's people like you that make open source such a great community.

## Code of Conduct
By participating in this project, you agree to abide by our Code of Conduct. Please be respectful and welcoming to all contributors.

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/en/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (v9 or higher recommended)
- A MongoDB database (local or MongoDB Atlas)

### Local Setup

1. **Fork the repository** on GitHub and clone it locally.
2. **Setup the Backend**:
   - Navigate to the backend directory: `cd backend`
   - Install dependencies: `npm install`
   - Create a `.env` file based on `.env.example` and add your `MONGO_URI` and `JWT_SECRET`.
   - Start the development server: `npm run dev`
3. **Setup the Frontend**:
   - Open a new terminal window.
   - Navigate to the frontend directory: `cd frontend`
   - Install dependencies: `npm install`
   - Create a `.env.local` file based on `.env.example`.
   - Start the frontend server: `npm run dev`

## Branching Strategy
- **`main`**: The primary branch with stable code.
- Create feature branches from `main` using the format: `feature/your-feature-name` or `fix/issue-description`.

## Code Style
- **Backend**: We use Prettier for formatting. Run `npm run format` before committing.
- **Frontend**: We use ESLint and Prettier. Run `npm run lint` to ensure there are no warnings.

## Pull Request Process
1. Ensure your code is fully tested and formatted.
2. Update the README.md with details of changes to the interface, if applicable.
3. Submit a PR describing your changes, the problem they solve, and any related issue numbers.

We review PRs regularly and will provide feedback as soon as possible. Thank you for contributing!
