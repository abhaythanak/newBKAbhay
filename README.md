# newBKAbhay

A **Node.js + Express 5** backend server connected to a **MongoDB** database via Mongoose, featuring user signup with **input validation**, **bcrypt password hashing**, **JWT-based cookie authentication**, and full CRUD functionality for user management.

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
JWT_SECRET=your_jwt_secret
```

> ⚠️ Never commit your `.env` file. It is already included in `.gitignore`.

> ⚠️ **Note:** The current `src/config/database.js` has the MongoDB URI **hardcoded** in the source. Move it to `.env` and use `process.env.MONGO_URI` before going to production.

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
│   ├── app.js                  # Express app entry point — connects DB, loads routers, starts server
│   ├── auth.js                 # Old auth placeholder (hardcoded token — superseded by middlewares/auth.js)
│   ├── config/
│   │   └── database.js         # Mongoose connection setup
│   ├── middlewares/
│   │   └── auth.js             # JWT auth middleware — verifies token cookie, attaches user to req.user
│   ├── models/
│   │   └── user.js             # Mongoose User model/schema + getJWT() & validatePassword() instance methods
│   ├── routers/
│   │   ├── auth.js             # Auth router (signup, login, logout)
│   │   ├── feed.js             # Feed router (feed API)
│   │   ├── profile.js          # Profile router (view profile)
│   │   ├── request.js          # Request router (connection requests)
│   │   └── user.js             # User CRUD router (get, update, delete user)
│   └── utils/
│       └── validation.js       # Input validation helpers (validateSignupData)
├── .env                        # Environment variables (not committed)
├── .gitignore                  # Git ignored files
├── package.json                # Project metadata & scripts
└── README.md                   # Project documentation
```

> Middlewares used: `express.json()` for JSON body parsing and `cookie-parser` for reading/writing HTTP cookies.


---

## 🔗 API Routes

### `POST /signup` (Defined in `src/routers/auth.js`)

Creates a new user from the JSON request body and saves it to the database.

**Signup flow:**
1. **Validate input** — `validateSignupData()` from `src/utils/validation.js` checks that the name is present, the email is a valid format, and the password is strong.
2. **Hash password** — The plaintext password is hashed with `bcrypt` (10 salt rounds) before being stored.
3. **Save user** — A new `User` document is created with the hashed password and saved to MongoDB.

> ⚠️ The duplicate `emailId` check is currently **commented out** in `src/routers/auth.js` — an `existingUser` lookup is performed but the guard block is disabled. The `emailId` field is marked `unique` in the Mongoose schema, so MongoDB will still reject duplicates with a `500` error. Uncomment the guard block to return a clean `400` response instead.


> ⚠️ **Password strength** is validated in two places: by `validator.isStrongPassword()` in `validateSignupData` (before hashing), and also by the schema-level `validate()` in `user.js` (applied on save/update). Weak passwords throw an error immediately.

**Request Body (JSON):**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "emailId": "john@example.com",
  "password": "StrongPass@123",
  "age": "25",
  "gender": "male",
  "photoUrl": "https://example.com/photo.jpg",
  "about": "A short bio",
  "skills": ["JavaScript", "Node.js"]
}
```

> `firstName` (or `lastName`), `emailId`, and `password` are required. The password is **never stored in plaintext** — it is bcrypt-hashed before saving.

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
    password: 'StrongPass@123'
  })
});
```

---

### `POST /login` (Defined in `src/routers/auth.js`)

Authenticates an existing user by verifying their email and password.

**Login flow:**
1. Look up the user by `emailId` — throw `"Invalid Credential"` if not found.
2. Compare the submitted password against the stored **bcrypt hash** using the `user.validatePassword(password)` instance method (defined on the User model).
3. On success, call `user.getJWT()` (instance method on the User model) to sign a **JWT** token with the user's `_id`, set to expire in **7 days**, and set it as a `token` cookie that expires in **8 hours**.

**Request Body (JSON):**

```json
{
  "emailId": "john@example.com",
  "password": "StrongPass@123"
}
```

**Response:**
- `200 OK` — Sets `token` JWT cookie; returns `{ "message": "Login successful", "user": { "firstName", "lastName", "emailId" } }`
- `401 Unauthorized` — `{ "message": "Invalid email or password" }`
- `400 Bad Request` — `{ "message": "Error saving user", "error": "..." }` (e.g. user not found)

> ⚠️ The JWT is currently signed with a **hardcoded secret** (`"Abhay@123"`) inside `user.getJWT()`. Move this secret to an environment variable (`process.env.JWT_SECRET`) before going to production.

> ℹ️ **Token lifetime:** JWT is valid for **7 days** (`expiresIn: "7d"`). The `token` cookie itself expires after **8 hours** (`Date.now() + 8 * 3600000`) — the cookie will be cleared from the browser before the JWT itself expires.

```js
// Example usage
fetch('http://localhost:5555/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    emailId: 'john@example.com',
    password: 'StrongPass@123'
  })
});
```

---

### `POST /logout` (Defined in `src/routers/auth.js`)

Logs out the user by clearing their session cookie.

**Logout flow:**
1. Clear the `token` cookie by setting it to `null` and setting the expiry date to the current timestamp.

**Response:**
- `200 OK` — `"logout Successully!!!."`

```js
// Example usage
fetch('http://localhost:5555/logout', {
  method: 'POST',
  credentials: 'include'
});
```

---

### `GET /user` (Defined in `src/routers/user.js`)

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

### `GET /feed` (Defined in `src/routers/feed.js`)

Fetches **all users** from the database. No request body required.

**Response:**
- `200 OK` — Array of all user objects
- `404 Not Found` — Error message string

```js
// Example usage
fetch('http://localhost:5555/feed');
```

---

### `DELETE /user` (Defined in `src/routers/user.js`)

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

### `GET /profile` (Defined in `src/routers/profile.js`)

A **protected route** — returns the authenticated user's full profile from the database.

**Auth:** Guarded by the `userAuth` middleware (`src/middlewares/auth.js`). Requires a valid `token` JWT cookie (set during `/login`).

**Profile flow:**
1. `userAuth` middleware reads the `token` cookie and verifies the JWT.
2. Middleware looks up the user by `_id` from the decoded token and attaches it to `req.user`.
3. The route handler reads `req.user` and sends the user document back.

**Response:**
- `200 OK` — The authenticated user's document
- `400 Bad Request` — `"Error: token is not valid!!...."` (missing/invalid cookie) or `"Error: User not found"`

```js
// Example usage (cookie sent automatically by browser after login)
fetch('http://localhost:5555/profile', {
  credentials: 'include'
});
```

> ⚠️ The JWT secret is currently **hardcoded** as `"Abhay@123"` in `middlewares/auth.js`. Move it to `process.env.JWT_SECRET` before deploying to production.

---

### `POST /sendConnectionRequest` (Defined in `src/routers/request.js`)

A **protected route** — sends a connection request.

**Auth:** Guarded by the `userAuth` middleware (`src/middlewares/auth.js`). Requires a valid `token` JWT cookie.

**Response:**
- `200 OK` — Returns a string: `<firstName>sent the connection request`
- `400 Bad Request` — Error message (missing/invalid token)

```js
// Example usage (cookie sent automatically by browser after login)
fetch('http://localhost:5555/sendConnectionRequest', {
  method: 'POST',
  credentials: 'include'
});
```

---

### `PATCH /user` (Defined in `src/routers/user.js`)

Updates an existing user's data by `userId`. Pass any fields to update along with the `userId`. Validators are run on update (`runValidators: true`).

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

`src/models/user.js` defines the Mongoose schema for a user document. The schema includes `timestamps: true`, so each document automatically gets `createdAt` and `updatedAt` fields.

| Field       | Type       | Required | Constraints / Default                                                                            |
|-------------|------------|----------|--------------------------------------------------------------------------------------------------|
| `firstName` | `String`   | ✅ Yes   | `minLength: 3`, `maxLength: 50`                                                                  |
| `lastName`  | `String`   | ❌ No    | —                                                                                                |
| `emailId`   | `String`   | ✅ Yes   | `unique`, `lowercase`, `trim`                                                                    |
| `password`  | `String`   | ✅ Yes   | Stored as a **bcrypt hash** (10 rounds); schema-level validator enforces `isStrongPassword`      |
| `age`       | `String`   | ❌ No    | `min: 18` *(note: stored as String, min applies to numeric comparison)*                          |
| `gender`    | `String`   | ❌ No    | Must be `"male"`, `"female"`, or `"others"`                                                      |
| `photoUrl`  | `String`   | ❌ No    | Default: brain image URL                                                                         |
| `about`     | `String`   | ❌ No    | Default: `"this is the default about the user"`                                                  |
| `skills`    | `[String]` | ❌ No    | Array of skill strings                                                                           |
| `createdAt` | `Date`     | auto     | Auto-generated by Mongoose timestamps                                                            |
| `updatedAt` | `Date`     | auto     | Auto-generated by Mongoose timestamps                                                            |

### Instance Methods

The User model exposes two instance methods defined directly on the schema:

#### `user.getJWT()`

Signs and returns a JWT for the user.

```js
userModel.methods.getJWT = async function () {
  const token = await jwt.sign({ _id: this._id }, "Abhay@123", { expiresIn: "7d" });
  return token;
};
```

> ⚠️ The secret is currently hardcoded. Move to `process.env.JWT_SECRET` before production.

#### `user.validatePassword(inputPassword)`

Compares a plaintext password against the stored bcrypt hash. Returns `true` if valid, `false` otherwise.

```js
userModel.methods.validatePassword = async function (passwordInputByUser) {
  return bcrypt.compare(passwordInputByUser, this.password);
};
```

---

## 🛡️ Validation Utility

`src/utils/validation.js` exports helper functions for validating request data.

### `validateSignupData(req)`

Validates the signup request body and **throws an Error** if any check fails (caught by the route's `try/catch`):

| Check    | Condition                                              | Error thrown                        |
|----------|--------------------------------------------------------|-------------------------------------|
| Name     | `firstName` or `lastName` must be present              | `"Name is not valid!"`              |
| Email    | Must be a valid email format (`validator.isEmail`)     | `"Email is not valid"`              |
| Password | Must pass `validator.isStrongPassword`                 | `"Please enter the strong Password"`|

```js
const { validateSignupData } = require('./utils/validation');

// Used at the top of the /signup handler
validateSignupData(req); // throws on invalid input
```

---

## 🔐 Authentication

### `userAuth` Middleware (`src/middlewares/auth.js`)

All protected routes use the `userAuth` middleware, which handles JWT verification and user lookup:

**Middleware flow:**
1. Read the `token` cookie from the request — throw `"token is not valid!!...."` if missing.
2. Verify the JWT with `jwt.verify(token, "Abhay@123")` — throw if invalid or expired.
3. Check the decoded payload is truthy — throw `"jwt is expired"` if falsy.
4. Extract `_id` from the decoded payload and fetch the user from MongoDB — throw `"User not found"` if no match.
5. Attach the user document to `req.user` and call `next()` to proceed to the route handler.

```js
const { userAuth } = require('./middlewares/auth');

// Protect any route by adding userAuth as middleware
app.get('/profile', userAuth, async (req, res) => {
  const user = req.user; // user is already fetched and validated
  res.send(user);
});
```

**Currently protected routes:**
- `GET /profile` (Defined in `src/routers/profile.js`) — uses `userAuth`
- `POST /sendConnectionRequest` (Defined in `src/routers/request.js`) — uses `userAuth`


> ⚠️ The JWT secret is currently **hardcoded** as `"Abhay@123"` in `middlewares/auth.js`. Move it to an environment variable (`process.env.JWT_SECRET`) before going to production.

### JWT Signing (`user.getJWT()`)

JWT signing has been moved out of `app.js` and into the **User model instance method** `getJWT()`. The `/login` route now calls it as:

```js
const token = await user.getJWT();
res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000) });
```

### Password Verification (`user.validatePassword()`)

Password comparison has been moved out of `app.js` and into the **User model instance method** `validatePassword()`. The `/login` route now calls it as:

```js
const isPasswordValid = await user.validatePassword(password);
```

### Legacy placeholder (`src/auth.js`)

`src/auth.js` still exists but uses a **hardcoded token** (`'xyz'`) and is **not wired to any route**. It has been superseded by `src/middlewares/auth.js`.

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

> ⚠️ The MongoDB URI is currently **hardcoded** in `database.js`. Move it to an environment variable (`process.env.MONGO_URI`) before deploying.

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

| Package         | Version     | Purpose                                          |
|-----------------|-------------|--------------------------------------------------|
| `express`       | `^5.2.1`    | HTTP server framework                            |
| `mongoose`      | `^9.6.3`    | MongoDB ODM                                      |
| `bcrypt`        | `^6.0.0`    | Password hashing (10 salt rounds)                |
| `jsonwebtoken`  | `^9.0.3`    | JWT signing and verification for auth            |
| `validator`     | `^13.15.35` | String validation (email, password strength...)  |
| `cookie-parser` | `^1.4.7`    | Parse and set HTTP cookies                       |
| `nodemon`       | `^3.1.14`   | Auto-reload on file changes (devDependency)      |

---

## 📄 License

ISC © at
