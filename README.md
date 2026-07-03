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

> 💡 **Note:** The server loads variables from `.env` via `src/config/env.js`. If you do not specify them, it falls back to default values (including a development database cluster).

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
│   ├── app.js                  # Express app setup (loads routes, registers central middlewares)
│   ├── server.js               # Starts the database connection and the HTTP server
│   ├── config/
│   │   ├── database.js         # Mongoose connection setup using env config
│   │   └── env.js              # Centralized environment variable validation
│   ├── middlewares/
│   │   ├── auth.middleware.js  # JWT auth middleware (verifies token, attaches req.user)
│   │   ├── error.middleware.js # Global centralized error handler
│   │   └── notFound.middleware.js # Catch-all 404 handler for unknown routes
│   ├── utils/
│   │   ├── ApiError.js         # Standard HTTP operational errors class
│   │   ├── asyncHandler.js     # Express async error handling wrapper
│   │   └── token.js            # JWT sign & verify helpers
│   └── modules/                # Feature modules (modular monolith architecture)
│       ├── auth/               # Signup, login, logout routes/controllers/services/schemas
│       ├── connectionRequests/ # Connection requests models/routes/controllers/services/schemas
│       ├── feed/               # Feed routes/controllers/services/schemas
│       ├── profiles/           # Profile view & edit routes/controllers/services/schemas
│       └── users/              # User connection list, updates & search routes/controllers/services/schemas
├── .env                        # Environment variables (not committed)
├── .gitignore                  # Git ignored files
├── package.json                # Project metadata & scripts
└── README.md                   # Project documentation
```

> Middlewares used: `express.json()` for JSON body parsing and `cookie-parser` for reading/writing HTTP cookies.


---

## 🔗 API Routes

### `POST /signup` (Defined in `src/modules/auth/auth.routes.js`)

Creates a new user from the JSON request body and saves it to the database.

**Signup flow:**
1. **Validate input** — `validateSignupData()` from `src/modules/auth/auth.schema.js` checks that the name is present, the email is a valid format, and the password is strong.
2. **Check duplicate email** — `auth.service.js` does a lookup for existing emails and returns a clean `400` response if a duplicate is found.
3. **Hash password** — The plaintext password is hashed with `bcrypt` (10 salt rounds) before being stored.
4. **Save user** — A new `User` document is created with the hashed password and saved to MongoDB.


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

### `POST /login` (Defined in `src/modules/auth/auth.routes.js`)

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

> 💡 **Note:** The JWT secret is loaded from environment configuration (`src/config/env.js`) and signed via the centralized token helper.

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

### `POST /logout` (Defined in `src/modules/auth/auth.routes.js`)

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

### `GET /user` (Defined in `src/modules/users/user.routes.js`)

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

### `GET /feed` (Defined in `src/modules/feed/feed.routes.js`)

Fetches **all users** from the database. No request body required.

**Response:**
- `200 OK` — Array of all user objects
- `404 Not Found` — Error message string

```js
// Example usage
fetch('http://localhost:5555/feed');
```

---

### `DELETE /user` (Defined in `src/modules/users/user.routes.js`)

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

### `GET /profile/view` (Defined in `src/modules/profiles/profile.routes.js`)

A **protected route** — returns the authenticated user's full profile from the database.

**Auth:** Guarded by the `userAuth` middleware (`src/middlewares/auth.middleware.js`). Requires a valid `token` JWT cookie (set during `/login`).

**Profile flow:**
1. `userAuth` middleware reads the `token` cookie and verifies the JWT.
2. Middleware looks up the user by `_id` from the decoded token and attaches it to `req.user`.
3. The route handler reads `req.user` and sends the user document back.

**Response:**
- `200 OK` — The authenticated user's document
- `400 Bad Request` — `{ "message": "Error saving user", "error": "..." }`

```js
// Example usage (cookie sent automatically by browser after login)
fetch('http://localhost:5555/profile/view', {
  credentials: 'include'
});
```

---

### `PATCH /profile/edit` (Defined in `src/modules/profiles/profile.routes.js`)

A **protected route** — updates the authenticated user's profile data. Only allowed fields are accepted for editing: `firstName`, `lastName`, `emailId`, `photoUrl`, `about`, `age`, and `skills`.

**Auth:** Guarded by the `userAuth` middleware (`src/middlewares/auth.middleware.js`). Requires a valid `token` JWT cookie.

**Edit flow:**
1. **Validate input** — `validateEditProfileData(req.body)` from `src/modules/profiles/profile.schema.js` checks that only allowed fields are present in the request body.
2. **Update user** — Updates the fields on the logged-in user document and saves it back to MongoDB, running Mongoose validators.

**Request Body (JSON):**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "about": "New bio details",
  "skills": ["JavaScript", "Node.js", "React"]
}
```

**Response:**
- `200 OK` — `{ "message": "<Name>, your profile updated successfully!!", "data": { ...updatedUserDoc } }`
- `400 Bad Request` — `{ "message": "Error saving user", "error": "..." }` (validation failure or invalid fields)

```js
// Example usage
fetch('http://localhost:5555/profile/edit', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    firstName: 'John',
    about: 'New bio details'
  })
});
```


---

### `POST /request/send/:status/:toUserId` (Defined in `src/modules/connectionRequests/connectionRequest.routes.js`)

A **protected route** — sends a connection request (either `"interested"` or `"ignore"`) to another user.

**Auth:** Guarded by the `userAuth` middleware (`src/middlewares/auth.middleware.js`). Requires a valid `token` JWT cookie.

**Route Parameters:**
- `status` (String): Must be either `"ignore"` or `"interested"`.
- `toUserId` (String): The MongoDB ObjectId of the target user.

**Response:**
- `200 OK` — `{ "message": "<fromUserFirstName>is<status>in<toUserFirstName>", "data": { "fromUserId", "toUserId", "status", "_id", "createdAt", "updatedAt" } }`
- `400 Bad Request` — `{ "message": "Error sending request", "error": "..." }` (e.g., user not found, invalid status, request already exists, or trying to send request to self)

```js
// Example usage (cookie sent automatically by browser after login)
fetch('http://localhost:5555/request/send/interested/64abc123def456', {
  method: 'POST',
  credentials: 'include'
});
```

---

### `POST /request/review/:status/:requestId` (Defined in `src/modules/connectionRequests/connectionRequest.routes.js`)

A **protected route** — reviews (accepts or rejects) an incoming connection request.

**Auth:** Guarded by the `userAuth` middleware (`src/middlewares/auth.middleware.js`). Requires a valid `token` JWT cookie.

**Route Parameters:**
- `status` (String): Must be either `"accepted"` or `"rejected"`.
- `requestId` (String): The MongoDB ObjectId of the connection request to review.

**Response:**
- `200 OK` — `{ "message": "connection request <status>", "data": { ...connectionRequestDoc } }` (e.g. `connection request accepted`)
- `400 Bad Request` — `{ "message": "Error sending request", "error": "..." }` (e.g. invalid status)
- `404 Not Found` — `{ "message": "connection request not found" }` (e.g. if request does not exist or isn't addressed to the logged-in user with status `"interested"`)

```js
// Example usage (accepting a request)
fetch('http://localhost:5555/request/review/accepted/64abc123def456', {
  method: 'POST',
  credentials: 'include'
});
```

---

### `GET /user/request/received` (Defined in `src/modules/users/user.routes.js`)

A **protected route** — fetches all pending/interested connection requests received by the logged-in user. It automatically populates the sender's (`fromUserId`) details.

**Auth:** Guarded by the `userAuth` middleware (`src/middlewares/auth.middleware.js`). Requires a valid `token` JWT cookie.

**Response:**
- `200 OK` — `{ "message": "Data fetch successfully", "data": [ ...connectionRequestsWithSenderDetails ] }`
- `400 Bad Request` — `"failed to update: <error>"`

```js
// Example usage
fetch('http://localhost:5555/user/request/received', {
  method: 'GET',
  credentials: 'include'
});
```

---

### `GET /user/connections` (Defined in `src/modules/users/user.routes.js`)

A **protected route** — fetches the active connections (where status is `"accepted"`) of the logged-in user. Only safe fields (`firstName`, `lastName`, `age`, `gender`, `photoUrl`, `about`, `skills`) are returned for the connected users.

**Auth:** Guarded by the `userAuth` middleware (`src/middlewares/auth.middleware.js`). Requires a valid `token` JWT cookie.

**Response:**
- `200 OK` — `{ "data": [ { "_id", "firstName", "lastName", "age", "gender", "photoUrl", "about", "skills" } ] }`
- `400 Bad Request` — `"failed to update: <error>"`

```js
// Example usage
fetch('http://localhost:5555/user/connections', {
  method: 'GET',
  credentials: 'include'
});
```


---

### `PATCH /user` (Defined in `src/modules/users/user.routes.js`)

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

`src/modules/users/user.model.js` defines the Mongoose schema for a user document. The schema includes `timestamps: true`, so each document automatically gets `createdAt` and `updatedAt` fields.

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

## 🤝 Connection Request Model

`src/modules/connectionRequests/connectionRequest.model.js` defines the Mongoose schema for a connection request document. The schema includes `timestamps: true` and a pre-save validation hook.

| Field        | Type                            | Required | Constraints / Default                                                 |
|--------------|---------------------------------|----------|-----------------------------------------------------------------------|
| `fromUserId` | `mongoose.Schema.Types.ObjectId`| ✅ Yes   | References the `User` who initiated the request                       |
| `toUserId`   | `mongoose.Schema.Types.ObjectId`| ✅ Yes   | References the `User` who receives the request                        |
| `status`     | `String`                        | ✅ Yes   | Must be one of: `"ignore"`, `"interested"`, `"accepted"`, `"rejected"` |
| `createdAt`  | `Date`                          | auto     | Auto-generated by Mongoose timestamps                                 |
| `updatedAt`  | `Date`                          | auto     | Auto-generated by Mongoose timestamps                                 |

### Indexes

#### Compound Index `{ fromUserId: 1, toUserId: 1 }`
A compound index is defined on both `fromUserId` and `toUserId` to speed up database queries (e.g. checking if a connection request already exists between two users).

### Schema Hooks

#### Pre-Save Hook (`save`)
A pre-save hook validates that users cannot send a connection request to themselves. If `fromUserId` equals `toUserId`, it throws an error: `"cannot send request to self"`.

## 🛡️ Validation Schemas

Validation logic is modularized and lives within each feature's `*.schema.js` file:

- **[auth.schema.js](file:///Users/ada/Desktop/BackendL/src/modules/auth/auth.schema.js)**: Validates signup/login data (e.g. email formats, name limits, strong passwords).
- **[profile.schema.js](file:///Users/ada/Desktop/BackendL/src/modules/profiles/profile.schema.js)**: Validates edit fields (`firstName`, `photoUrl`, `skills`, etc.) ensuring only allowed attributes are accepted.
- **[user.schema.js](file:///Users/ada/Desktop/BackendL/src/modules/users/user.schema.js)**: Validates admin updates, search query email formats, and object ID requirements.
- **[connectionRequest.schema.js](file:///Users/ada/Desktop/BackendL/src/modules/connectionRequests/connectionRequest.schema.js)**: Enforces validation on status transitions (`ignore`/`interested` for send, `accepted`/`rejected` for review) and correct MongoDB ObjectId formats.

Validation check methods throw plain standard errors that are caught by controller `asyncHandler` wrappers and formatted cleanly by the global error middleware.

---

## 🔐 Authentication

### `userAuth` Middleware (`src/middlewares/auth.middleware.js`)

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
router.get('/profile/view', userAuth, async (req, res) => {
  const user = req.user; // user is already fetched and validated
  res.send(user);
});
```

**Currently protected routes:**
- `GET /profile/view` (Defined in `src/modules/profiles/profile.routes.js`) — uses `userAuth`
- `PATCH /profile/edit` (Defined in `src/modules/profiles/profile.routes.js`) — uses `userAuth`
- `POST /request/send/:status/:toUserId` (Defined in `src/modules/connectionRequests/connectionRequest.routes.js`) — uses `userAuth`


> 💡 **Note:** The JWT secret is loaded from environment configuration (`src/config/env.js`).

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
