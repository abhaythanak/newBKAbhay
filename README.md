# newBKAbhay

A **Node.js + Express 5** backend server connected to a **MongoDB** database via Mongoose, with user signup functionality.

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/)
- A [MongoDB Atlas](https://www.mongodb.com/atlas) account (or local MongoDB instance)

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

Create a `.env` file in the root directory and add your MongoDB connection string:

```env
MONGO_URI=your_mongodb_connection_string
```

> ⚠️ Never commit your `.env` file. It is already included in `.gitignore`.

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

The server will start on **http://localhost:5555**

---

## 🗂️ Project Structure

```
newBKAbhay/
├── src/
│   ├── app.js              # Express app entry point — connects DB, defines routes, starts server
│   ├── auth.js             # Auth middleware (token-based authentication)
│   ├── config/
│   │   └── database.js     # Mongoose connection setup
│   └── models/
│       └── user.js         # Mongoose User model/schema
├── .env                    # Environment variables (not committed)
├── .gitignore              # Git ignored files
├── package.json            # Project metadata & scripts
└── README.md               # Project documentation
```

---

## 🔗 API Routes

### `POST /signup`

Creates a new user and saves it to the database.

**Request:** No body required (currently uses hardcoded user data).

**Response:**
- `201 Created` — `"user created Successfully"`
- `400 Bad Request` — `"error saving the user: <error message>"`

```js
// Example usage
fetch('http://localhost:5555/signup', { method: 'POST' });
```

---

## 👤 User Model

`src/models/user.js` defines the Mongoose schema for a user document.

---

## 🔐 Authentication Middleware

`src/auth.js` exports a `userAuth` middleware that validates a token before allowing access to protected routes.

```js
const { userAuth } = require('./auth');

// Usage on a protected route
app.get('/protected', userAuth, (req, res) => {
  res.send('Authenticated!');
});
```

---

## 🗄️ Database Connection

`src/config/database.js` exports an async `connectDB` function using Mongoose. The server only starts **after** a successful DB connection:

```js
connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('Database connection failed:', err));
```

---

## 🔧 Git Initialization (First Time Setup)

```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/abhaythanak/newBKAbhay.git
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

| Package    | Version   | Purpose                     |
|------------|-----------|------------------------------|
| `express`  | `^5.2.1`  | HTTP server framework        |
| `mongoose` | `^9.6.3`  | MongoDB ODM                  |
| `nodemon`  | `^3.1.14` | Auto-reload on file changes  |

---

## 📄 License

ISC © at
