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
* **Route:** `/profile/view`
* **Authentication:** Requires `token` Cookie

### 4. Edit Profile
Edit the logged-in user's profile info.
* **Method:** `PATCH`
* **Route:** `/profile/edit`
* **Authentication:** Requires `token` Cookie
* **Request Body:**
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "emailId": "john@example.com",
    "photoUrl": "https://example.com/photo.jpg",
    "about": "A short bio",
    "age": 25,
    "skills": ["JavaScript", "Node.js"]
  }
  ```

### 5. Get User Details
Fetch details of a user by email ID.
* **Method:** `GET`
* **Route:** `/user`
* **Request Body:**
  ```json
  {
    "emailId": "john@example.com"
  }
  ```

### 6. Feed
Get all registered users.
* **Method:** `GET`
* **Route:** `/feed`

### 7. Update User
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

### 8. Delete User
Delete a user record by ID.
* **Method:** `DELETE`
* **Route:** `/user`
* **Request Body:**
  ```json
  {
    "userId": "user_mongodb_id"
  }
  ```

### 9. Send Connection Request
Send a connection request to another user.
* **Method:** `POST`
* **Route:** `/sendConnectionRequest`
* **Authentication:** Requires `token` Cookie

### 10. Logout
Clear the session cookie (`token`).
* **Method:** `POST`
* **Route:** `/logout`



