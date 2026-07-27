# newBKAbhay

A **Node.js + Express 5** backend server connected to a **MongoDB** database via Mongoose, featuring user signup with **input validation**, **bcrypt password hashing**, **JWT-based cookie authentication**, and full CRUD functionality for user management and connection requests.

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

Create a `.env` file in the root directory:

```env
PORT=5555
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

> ⚠️ Never commit your `.env` file. It is already included in `.gitignore`.

> 💡 **Note:** The server loads variables from `.env` via [src/config/env.js](file:///Users/ada/Desktop/BackendL/src/config/env.js).

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

> Both `npm start` and `npm run dev` start the server via [src/server.js](file:///Users/ada/Desktop/BackendL/src/server.js).

The server will start on **http://localhost:5555** (or the `PORT` specified in `.env`).

---

## 🗂️ Project Structure

```
newBKAbhay/
├── src/
│   ├── app.js                              # Express app setup (loads /api/v1 routes & central middlewares)
│   ├── server.js                           # Connects database & starts HTTP server
│   ├── config/
│   │   ├── database.js                     # Mongoose connection setup
│   │   └── env.js                          # Centralized environment variable export
│   ├── middlewares/
│   │   ├── auth.middleware.js              # JWT auth middleware (verifies token cookie, attaches req.user)
│   │   ├── error.middleware.js             # Global centralized error handler
│   │   └── notFound.middleware.js          # Catch-all 404 handler for unknown routes
│   ├── utils/
│   │   ├── ApiError.js                     # Custom HTTP operational error class
│   │   ├── asyncHandler.js                 # Express async error handler wrapper
│   │   └── token.js                        # JWT sign & verify helpers
│   └── modules/                            # Feature modules (modular monolith architecture)
│       ├── auth/                           # Signup, login & logout
│       │   ├── auth.controller.js
│       │   ├── auth.routes.js
│       │   ├── auth.schema.js
│       │   └── auth.service.js
│       ├── connectionRequest/              # Connection request model, routes & services
│       │   ├── connectionRequest.controller.js
│       │   ├── connectionRequest.model.js
│       │   ├── connectionRequest.routes.js
│       │   ├── connectionRequest.schema.js
│       │   └── connectionRequest.service.js
│       ├── feed/                           # Feed module
│       │   ├── feed.controller.js
│       │   ├── feed.routes.js
│       │   ├── feed.schema.js
│       │   └── feed.service.js
│       ├── profile/                        # User profile view & edit
│       │   ├── profile.controller.js
│       │   ├── profile.routes.js
│       │   ├── profile.schema.js
│       │   └── profile.service.js
│       └── user/                           # User model & user operations
│           ├── user.controller.js
│           ├── user.model.js
│           ├── user.routes.js
│           ├── user.schema.js
│           └── user.service.js
├── .env                                    # Environment variables (not committed)
├── .env.example                            # Example environment variables template
├── .gitignore                              # Git ignored files
├── ApiList.md                              # API list checklist
├── package.json                            # Project metadata & dependencies
└── README.md                               # Project documentation
```

> **Base Route Prefix:** All API endpoints are registered under `/api/v1` in [src/app.js](file:///Users/ada/Desktop/BackendL/src/app.js).

---

## 🔗 API Routes

All endpoints below are prefixed with `/api/v1`.

### `POST /api/v1/signup` (Defined in [auth.routes.js](file:///Users/ada/Desktop/BackendL/src/modules/auth/auth.routes.js))

Creates a new user account with hashed password and input validation.

**Signup flow:**
1. **Validate input** — `validateSignupData()` from [auth.schema.js](file:///Users/ada/Desktop/BackendL/src/modules/auth/auth.schema.js) checks required fields, email format, and password strength.
2. **Check duplicate email** — `auth.service.js` verifies if the email is already registered.
3. **Hash password** — Password is hashed using `bcrypt` (10 salt rounds).
4. **Save user** — Saves new User document in MongoDB.

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

**Response:**
- `201 Created` — `{ "message": "User created successfully", "user": { ... } }`
- `400 Bad Request` — Validation or duplicate email error

---

### `POST /api/v1/login` (Defined in [auth.routes.js](file:///Users/ada/Desktop/BackendL/src/modules/auth/auth.routes.js))

Authenticates a user and sets an HTTP-only JWT cookie (`token`).

**Login flow:**
1. Look up user by `emailId`.
2. Compare submitted password using `user.validatePassword(password)`.
3. Sign JWT token via `user.getJWT()` and attach `token` cookie (expires in 8 hours).

**Request Body (JSON):**

```json
{
  "emailId": "john@example.com",
  "password": "StrongPass@123"
}
```

**Response:**
- `200 OK` — Sets `token` cookie; returns `{ "message": "Login successful", "user": { "firstName", "lastName", "emailId" } }`
- `401 Unauthorized` — Invalid credentials

---

### `POST /api/v1/logout` (Defined in [auth.routes.js](file:///Users/ada/Desktop/BackendL/src/modules/auth/auth.routes.js))

Clears the `token` session cookie.

**Response:**
- `200 OK` — `"logout Successully!!!."`

---

### `GET /api/v1/profile/view` (Defined in [profile.routes.js](file:///Users/ada/Desktop/BackendL/src/modules/profile/profile.routes.js))

**Protected route** — Returns the authenticated user's profile information.

**Auth:** Requires valid `token` JWT cookie (`userAuth` middleware).

**Response:**
- `200 OK` — Authenticated user object

---

### `PATCH /api/v1/profile/edit` (Defined in [profile.routes.js](file:///Users/ada/Desktop/BackendL/src/modules/profile/profile.routes.js))

**Protected route** — Updates authenticated user's profile. Allowed fields: `firstName`, `lastName`, `emailId`, `photoUrl`, `about`, `age`, `skills`.

**Auth:** Requires valid `token` JWT cookie (`userAuth` middleware).

**Request Body (JSON):**

```json
{
  "firstName": "John",
  "about": "Updated bio text",
  "skills": ["JavaScript", "Node.js", "React"]
}
```

**Response:**
- `200 OK` — `{ "message": "John, your profile updated successfully!!", "data": { ... } }`

---

### `POST /api/v1/request/send/:status/:toUserId` (Defined in [connectionRequest.routes.js](file:///Users/ada/Desktop/BackendL/src/modules/connectionRequest/connectionRequest.routes.js))

**Protected route** — Sends a connection request (`interested` or `ignore`) to target user.

**Auth:** Requires valid `token` JWT cookie (`userAuth` middleware).

**Route Params:**
- `status`: Must be `"ignore"` or `"interested"`
- `toUserId`: Target user's MongoDB ObjectId

**Response:**
- `200 OK` — `{ "message": "John is interested in Alice", "data": { ... } }`

---

### `POST /api/v1/request/review/:status/:requestId` (Defined in [connectionRequest.routes.js](file:///Users/ada/Desktop/BackendL/src/modules/connectionRequest/connectionRequest.routes.js))

**Protected route** — Reviews an incoming connection request (`accepted` or `rejected`).

**Auth:** Requires valid `token` JWT cookie (`userAuth` middleware).

**Route Params:**
- `status`: Must be `"accepted"` or `"rejected"`
- `requestId`: Connection request MongoDB ObjectId

**Response:**
- `200 OK` — `{ "message": "connection request accepted", "data": { ... } }`

---

### `GET /api/v1/user/request/received` (Defined in [user.routes.js](file:///Users/ada/Desktop/BackendL/src/modules/user/user.routes.js))

**Protected route** — Fetches all pending connection requests received by the logged-in user.

**Auth:** Requires valid `token` JWT cookie (`userAuth` middleware).

**Response:**
- `200 OK` — `{ "message": "Data fetched successfully", "data": [ ... ] }`

---

### `GET /api/v1/user/connections` (Defined in [user.routes.js](file:///Users/ada/Desktop/BackendL/src/modules/user/user.routes.js))

**Protected route** — Fetches active accepted connections for the logged-in user.

**Auth:** Requires valid `token` JWT cookie (`userAuth` middleware).

**Response:**
- `200 OK` — `{ "data": [ { "_id", "firstName", "lastName", "age", "gender", "photoUrl", "about", "skills" } ] }`

---

### `GET /api/v1/feed` (Defined in [feed.routes.js](file:///Users/ada/Desktop/BackendL/src/modules/feed/feed.routes.js))

**Protected route** — Fetches user cards for the feed with pagination support.

**Auth:** Requires valid `token` JWT cookie (`userAuth` middleware).

**Query Parameters:**
- `page` (optional, integer, default: `1`): Page number
- `limit` (optional, integer, default: `10`, max: `50`): Number of profiles per page

**Response:**
- `200 OK` — Array of user profile cards

---

### `GET /api/v1/user` (Defined in [user.routes.js](file:///Users/ada/Desktop/BackendL/src/modules/user/user.routes.js))

**Protected route** — Fetches a single user by `emailId` passed in request body.

**Request Body (JSON):**
```json
{
  "emailId": "john@example.com"
}
```

---

### `PATCH /api/v1/user` (Defined in [user.routes.js](file:///Users/ada/Desktop/BackendL/src/modules/user/user.routes.js))

**Protected route** — Updates user data by `userId`.

**Request Body (JSON):**
```json
{
  "userId": "64abc123def456",
  "firstName": "UpdatedName"
}
```

---

### `DELETE /api/v1/user` (Defined in [user.routes.js](file:///Users/ada/Desktop/BackendL/src/modules/user/user.routes.js))

**Protected route** — Deletes a user record by `userId`.

**Request Body (JSON):**
```json
{
  "userId": "64abc123def456"
}
```

---

## 👤 User Model

Defined in [src/modules/user/user.model.js](file:///Users/ada/Desktop/BackendL/src/modules/user/user.model.js).

| Field       | Type       | Required | Constraints / Default                                           |
|-------------|------------|----------|-----------------------------------------------------------------|
| `firstName` | `String`   | ✅ Yes   | `minLength: 3`, `maxLength: 50`                                 |
| `lastName`  | `String`   | ❌ No    | —                                                               |
| `emailId`   | `String`   | ✅ Yes   | `unique`, `lowercase`, `trim`                                   |
| `password`  | `String`   | ✅ Yes   | Stored as bcrypt hash; schema-level `isStrongPassword` check    |
| `age`       | `String`   | ❌ No    | Must be numeric string (min 18)                                 |
| `gender`    | `String`   | ❌ No    | Enum: `"male"`, `"female"`, `"others"`                          |
| `photoUrl`  | `String`   | ❌ No    | Default photo URL                                               |
| `about`     | `String`   | ❌ No    | Default: `"this is the default about the user"`                 |
| `skills`    | `[String]` | ❌ No    | Array of skill strings                                          |

### Instance Methods
- `user.getJWT()`: Generates a signed JWT token for the user.
- `user.validatePassword(inputPassword)`: Compares input password with stored bcrypt hash.

---

## 🤝 Connection Request Model

Defined in [src/modules/connectionRequest/connectionRequest.model.js](file:///Users/ada/Desktop/BackendL/src/modules/connectionRequest/connectionRequest.model.js).

| Field        | Type                            | Required | Constraints / Default                                                 |
|--------------|---------------------------------|----------|-----------------------------------------------------------------------|
| `fromUserId` | `mongoose.Schema.Types.ObjectId`| ✅ Yes   | References sender `User`                                              |
| `toUserId`   | `mongoose.Schema.Types.ObjectId`| ✅ Yes   | References recipient `User`                                           |
| `status`     | `String`                        | ✅ Yes   | Enum: `"ignore"`, `"interested"`, `"accepted"`, `"rejected"`          |

### Indexes & Hooks
- Compound Index: `{ fromUserId: 1, toUserId: 1 }` for fast lookups.
- Pre-Save Hook: Throws error if `fromUserId` equals `toUserId` (prevent self connection requests).

---

## 🛡️ Validation Schemas

Validation logic is structured in feature schema files:
- [auth.schema.js](file:///Users/ada/Desktop/BackendL/src/modules/auth/auth.schema.js): Signup & login data validation
- [profile.schema.js](file:///Users/ada/Desktop/BackendL/src/modules/profile/profile.schema.js): Profile edit allowed fields validation
- [user.schema.js](file:///Users/ada/Desktop/BackendL/src/modules/user/user.schema.js): User update/get/delete validation
- [connectionRequest.schema.js](file:///Users/ada/Desktop/BackendL/src/modules/connectionRequest/connectionRequest.schema.js): Status transitions and ObjectId validation

---

## 🔐 Authentication

Guarded by `userAuth` middleware ([src/middlewares/auth.middleware.js](file:///Users/ada/Desktop/BackendL/src/middlewares/auth.middleware.js)):
1. Reads `token` cookie.
2. Verifies token using `verifyToken(token)` from [src/utils/token.js](file:///Users/ada/Desktop/BackendL/src/utils/token.js).
3. Fetches user by decoded `_id` and attaches to `req.user`.

---

## 🗄️ Database Connection

Mongoose database connection is established in [src/config/database.js](file:///Users/ada/Desktop/BackendL/src/config/database.js) using environment variables configured in [src/config/env.js](file:///Users/ada/Desktop/BackendL/src/config/env.js).

---

## 📜 Scripts

| Command       | Description                            |
|---------------|----------------------------------------|
| `npm run dev` | Start server with nodemon (watch mode) |
| `npm start`   | Start server with nodemon              |

---

## 📦 Dependencies

| Package         | Version     | Purpose                                         |
|-----------------|-------------|-------------------------------------------------|
| `express`       | `^5.2.1`    | HTTP server framework                           |
| `mongoose`      | `^9.6.3`    | MongoDB ODM                                     |
| `bcrypt`        | `^6.0.0`    | Password hashing                                |
| `jsonwebtoken`  | `^9.0.3`    | JWT token signing & verification                |
| `validator`     | `^13.15.35` | String and email validation                     |
| `cookie-parser` | `^1.4.7`    | Parse and read HTTP cookies                     |
| `dotenv`        | `^17.2.3`   | Environment configuration loader                |
| `nodemon`       | `^3.1.14`   | Auto-reload dev dependency                      |

---

## 📄 License

ISC ©
