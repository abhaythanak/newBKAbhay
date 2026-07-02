# DevTinder API List

A simple checklist and usage guide for the available API endpoints.
All Time Think About Corner Cases(Edge Cases)
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
Send a connection request (interested or ignore) to another user.
* **Method:** `POST`
* **Route:** `/request/send/:status/:toUserId`
* **Route Params:**
  * `status`: `ignore` or `interested`
  * `toUserId`: MongoDB ID of the target user
* **Authentication:** Requires `token` Cookie
* **Response Message:** `<fromUserFirstName>is<status>in<toUserFirstName>` (e.g. `JohnisinterestedinAlice`)
* **Note:** Users cannot send connection requests to themselves (throws validation error).

### 10. Logout
Clear the session cookie (`token`).
* **Method:** `POST`
* **Route:** `/logout`

### 11. Review Connection Request
Review (accept or reject) an incoming connection request.
* **Method:** `POST`
* **Route:** `/request/review/:status/:requestId`
* **Route Params:**
  * `status`: `accepted` or `rejected`
  * `requestId`: MongoDB ID of the connection request to review
* **Authentication:** Requires `token` Cookie
* **Response Message:** `connection request <status>` (e.g. `connection request accepted`)

### 12. Get Received Connection Requests
Fetch connection requests received by the logged-in user that are still pending/interested.
* **Method:** `GET`
* **Route:** `/user/request/received`
* **Authentication:** Requires `token` Cookie
* **Response:**
  ```json
  {
    "message": "Data fetch successfully",
    "data": [
      {
        "_id": "64abc123def456",
        "fromUserId": {
          "_id": "64abc123def789",
          "firstName": "John",
          "lastName": "Doe",
          "age": 25,
          "gender": "male",
          "photoUrl": "https://example.com/photo.jpg",
          "about": "A short bio",
          "skills": ["JavaScript", "Node.js"]
        },
        "toUserId": "64abc123def111",
        "status": "interested",
        "createdAt": "2026-07-01T10:00:00.000Z",
        "updatedAt": "2026-07-01T10:00:00.000Z"
      }
    ]
  }
  ```

### 13. Get User Connections
Fetch the active connections of the logged-in user.
* **Method:** `GET`
* **Route:** `/user/connections`
* **Authentication:** Requires `token` Cookie
* **Response:**
  ```json
  {
    "data": [
      {
        "_id": "64abc123def789",
        "firstName": "John",
        "lastName": "Doe",
        "age": 25,
        "gender": "male",
        "photoUrl": "https://example.com/photo.jpg",
        "about": "A short bio",
        "skills": ["JavaScript", "Node.js"]
      }
    ]
  }
  ```




