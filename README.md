# newBKAbhay

A simple **Node.js + Express 5** backend server.

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

> Both `npm start` and `npm run dev` use **nodemon** to auto-reload on file changes.

The server will start on **http://localhost:3001**

---

## 🛣️ Available Routes

| Method | Route   | Description                                        |
|--------|---------|----------------------------------------------------|
| GET    | `/user` | Returns a JSON object with user info (name, age, gender) |
| ALL    | `/test` | Middleware chain — logs `hello`, `next1`, `next2` then sends `"hello"` |

### Example Response — `GET /user`

```json
{
  "name": "abhay",
  "age": 21,
  "gender": "male"
}
```

### `/test` Middleware Chain

The `/test` route uses `app.use()` so it matches **all HTTP methods** (GET, POST, PUT, DELETE, etc.) and runs three middleware functions in sequence:

1. Logs `"hello"` → calls `next()`
2. Logs `"next1"` → calls `next()`
3. Logs `"next2"` → sends response `"hello"` → calls `next()`

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

| Command       | Description                              |
|---------------|------------------------------------------|
| `npm run dev` | Start server with nodemon (watch mode)   |
| `npm start`   | Start server with nodemon                |

---

## 📦 Dependencies

| Package   | Version  | Purpose             |
|-----------|----------|---------------------|
| `express` | `^5.2.1` | HTTP server framework |
| `nodemon` | latest   | Auto-reload on file change |

---

## 📄 License

ISC © at
