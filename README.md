# newBKAbhay

A simple Node.js + Express backend server.

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/)

---

## 📦 Installation

### 1. Clone the repository

```bash
git clone https://github.com/abhaythanak/newBKAbhay.git
cd newBKAbhay
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

> Update the values in `.env` as needed.

---

## ▶️ Running the Server

### Development mode (with auto-reload via nodemon)

```bash
npm run dev
```

### Production mode

```bash
npm start
```

The server will start on **http://localhost:3001**

---

## 🛣️ Available Routes

| Method | Route  | Description      |
|--------|--------|------------------|
| GET    | `/bat` | Returns Hello ADA |

---

## 🗂️ Project Structure

```
newBKAbhay/
├── src/
│   └── app.js          # Express app entry point
├── .env                # Environment variables (not committed)
├── .gitignore          # Git ignored files
├── package.json        # Project metadata & scripts
└── README.md           # Project documentation
```

---

## 🔧 Git Initialization (First Time Setup)

If you're setting this up from scratch:

```bash
# Initialize a git repository
git init

# Stage all files
git add .

# Make the first commit
git commit -m "first commit"

# Rename branch to main
git branch -M main

# Add remote origin
git remote add origin https://github.com/abhaythanak/newBKAbhay.git

# Push to GitHub
git push -u origin main
```

---

## 📜 Scripts

| Command       | Description                        |
|---------------|------------------------------------|
| `npm run dev` | Start server with nodemon (watch)  |
| `npm start`   | Start server normally              |

---

## 📄 License

ISC © at
# newBKAbhay
