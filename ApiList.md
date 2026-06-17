# DevTinder API List

A simple checklist and usage guide for the available API endpoints.

---

### 1. Signup
Create a new user account.
* **Method:** `POST`
* **Route:** `/signup`
* **Request Body:**
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "emailId": "john@example.com",
    "password": "Password123!"
  }
  ```

### 2. Login
Authenticate and receive a session cookie (`token`).
* **Method:** `POST`
* **Route:** `/login`
* **Request Body:**
  ```json
  {
    "emailId": "john@example.com",
    "password": "Password123!"
  }
  ```

### 3. Get Profile
Get the logged-in user's profile info.
* **Method:** `GET`
* **Route:** `/profile`
* **Authentication:** Requires `token` Cookie

### 4. Get User Details
Fetch details of a user by email ID.
* **Method:** `GET`
* **Route:** `/user`
* **Request Body:**
  ```json
  {
    "emailId": "john@example.com"
  }
  ```

### 5. Feed
Get all registered users.
* **Method:** `GET`
* **Route:** `/feed`

### 6. Update User
Update information for an existing user.
* **Method:** `PATCH`
* **Route:** `/user`
* **Request Body:**
  ```json
  {
    "userId": "user_mongodb_id",
    "firstName": "UpdatedFirstName",
    "skills": ["JavaScript", "Node.js"]
  }
  ```

### 7. Delete User
Delete a user record by ID.
* **Method:** `DELETE`
* **Route:** `/user`
* **Request Body:**
  ```json
  {
    "userId": "user_mongodb_id"
  }
  ```

### 8. Send Connection Request
Send a connection request to another user.
* **Method:** `POST`
* **Route:** `/sendConnectionRequest`
* **Authentication:** Requires `token` Cookie

