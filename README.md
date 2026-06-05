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

Creates a new user from the JSON request body and saves it to the database.

> ⚠️ The duplicate `emailId` guard is currently **commented out** in `app.js`. The `emailId` field is marked `unique` in the schema, so MongoDB will still reject duplicates with a `500` error.

The server uses `express.json()` middleware to parse incoming JSON payloads.

**Request Body (JSON):**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "emailId": "john@example.com",
  "password": "yourpassword",
  "age": "25",
  "gender": "male",
  "photoUrl": "https://example.com/photo.jpg",
  "about": "A short bio",
  "skills": ["JavaScript", "Node.js"]
}
```

> Only `firstName`, `emailId`, and `password` are required. All other fields are optional.

**Response:**
- `201 Created` — `{ "message": "User created successfully", "user": { ... } }`
- `500 Internal Server Error` — `{ "message": "Error saving user", "error": "..." }`

```js
// Example usage
fetch('http://localhost:5555/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    firstName: 'John',
    lastName: 'Doe',
    emailId: 'john@example.com',
    password: 'yourpassword'
  })
});
```

---

### `GET /user`

Fetches a single user by `emailId` from the request body.

**Request Body (JSON):**

```json
{
  "emailId": "john@example.com"
}
```

**Response:**
- `200 OK` — The matched user object
- `404 Not Found` — `"user not found"` (if no match) or error message

```js
// Example usage
fetch('http://localhost:5555/user', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ emailId: 'john@example.com' })
});
```

---

### `GET /feed`

Fetches **all users** from the database. No request body required.

**Response:**
- `200 OK` — Array of all user objects
- `404 Not Found` — `"error saving the user: <error message>"`

```js
// Example usage
fetch('http://localhost:5555/feed');
```

---

### `DELETE /user`

Deletes a user from the database by `userId` from the request body.

**Request Body (JSON):**

```json
{
  "userId": "64abc123def456"
}
```

**Response:**
- `201` — `"UserDeleted Successfully"`
- `400 Bad Request` — `"Deletion Failed: <error>"`

```js
// Example usage
fetch('http://localhost:5555/user', {
  method: 'DELETE',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ userId: '64abc123def456' })
});
```

---

### `PATCH /user`

Updates an existing user's data by `userId`. Pass any fields to update along with the `userId`. Validators are run on update.

**Request Body (JSON):**

```json
{
  "userId": "64abc123def456",
  "firstName": "UpdatedName",
  "skills": ["React", "MongoDB"]
}
```

**Response:**
- `201` — `"user updated successfully"`
- `400 Bad Request` — `"failed to update: <error>"`

```js
// Example usage
fetch('http://localhost:5555/user', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ userId: '64abc123def456', firstName: 'UpdatedName' })
});
```

---

## 👤 User Model

`src/models/user.js` defines the Mongoose schema for a user document.

| Field       | Type       | Required | Constraints / Default                                    |
|-------------|------------|----------|----------------------------------------------------------|
| `firstName` | `String`   | ✅ Yes   | `minLength: 3`, `maxLength: 50`                          |
| `lastName`  | `String`   | ❌ No    | —                                                        |
| `emailId`   | `String`   | ✅ Yes   | `unique`, `lowercase`, `trim`                            |
| `password`  | `String`   | ✅ Yes   | —                                                        |
| `age`       | `String`   | ❌ No    | `min: 18`                                                |
| `gender`    | `String`   | ❌ No    | Must be `"male"`, `"female"`, or `"others"`              |
| `photoUrl`  | `String`   | ❌ No    | Default: brain image URL                                 |
| `about`     | `String`   | ❌ No    | Default: `"this is the default about the user"`          |
| `skills`    | `[String]` | ❌ No    | Array of skill strings                                   |

---

## 🔐 Authentication Middleware

`src/auth.js` exports a `userAuth` middleware that validates a token before allowing access to protected routes.

> ⚠️ Currently uses a **hardcoded token** (`'xyz'`). This is a placeholder — replace with JWT or session-based auth before going to production.

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
