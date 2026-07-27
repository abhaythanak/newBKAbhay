# DevTinder API List

A simple checklist and usage guide for the available API endpoints in **DevTinder**.  
All API endpoints are mounted with the `/api/v1` base route prefix.

---

### Base URL
`http://localhost:5555/api/v1`

---

### 1. Signup
Create a new user account.
* **Method:** `POST`
* **Route:** `/api/v1/signup`
* **Authentication:** None
* **Request Body:**
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "emailId": "john@example.com",
    "password": "Password123!"
  }
  ```
* **Response:**
  `201 Created`
  ```json
  {
    "message": "User created successfully",
    "user": {
      "firstName": "John",
      "lastName": "Doe",
      "emailId": "john@example.com"
    }
  }
  ```

---

### 2. Login
Authenticate and receive a session cookie (`token`).
* **Method:** `POST`
* **Route:** `/api/v1/login`
* **Authentication:** None
* **Request Body:**
  ```json
  {
    "emailId": "john@example.com",
    "password": "Password123!"
  }
  ```
* **Response:**
  `200 OK` (Sets `token` HTTP-only cookie)
  ```json
  {
    "message": "Login successful",
    "user": {
      "firstName": "John",
      "lastName": "Doe",
      "emailId": "john@example.com"
    }
  }
  ```

---

### 3. Logout
Clear the session cookie (`token`).
* **Method:** `POST`
* **Route:** `/api/v1/logout`
* **Authentication:** None (clears `token` cookie)
* **Response:**
  `200 OK` — `"logout Successully!!!."`

---

### 4. Get Profile
Get the logged-in user's profile info.
* **Method:** `GET`
* **Route:** `/api/v1/profile/view`
* **Authentication:** Requires `token` Cookie (`userAuth`)
* **Response:**
  `200 OK` — Returns full logged-in user object

---

### 5. Edit Profile
Edit the logged-in user's profile info. Allowed fields: `firstName`, `lastName`, `emailId`, `photoUrl`, `about`, `age`, `skills`.
* **Method:** `PATCH`
* **Route:** `/api/v1/profile/edit`
* **Authentication:** Requires `token` Cookie (`userAuth`)
* **Request Body:**
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "photoUrl": "https://example.com/photo.jpg",
    "about": "A short bio",
    "age": 25,
    "skills": ["JavaScript", "Node.js"]
  }
  ```
* **Response:**
  `200 OK`
  ```json
  {
    "message": "John, your profile updated successfully!!",
    "data": { ...updatedUser }
  }
  ```

---

### 6. Send Connection Request
Send a connection request (`interested` or `ignore`) to another user.
* **Method:** `POST`
* **Route:** `/api/v1/request/send/:status/:toUserId`
* **Route Params:**
  * `status`: `ignore` or `interested`
  * `toUserId`: MongoDB ObjectId of target user
* **Authentication:** Requires `token` Cookie (`userAuth`)
* **Response:**
  `200 OK`
  ```json
  {
    "message": "John is interested in Alice",
    "data": { ...connectionRequest }
  }
  ```

---

### 7. Review Connection Request
Review (`accepted` or `rejected`) an incoming connection request.
* **Method:** `POST`
* **Route:** `/api/v1/request/review/:status/:requestId`
* **Route Params:**
  * `status`: `accepted` or `rejected`
  * `requestId`: MongoDB ObjectId of connection request
* **Authentication:** Requires `token` Cookie (`userAuth`)
* **Response:**
  `200 OK`
  ```json
  {
    "message": "connection request accepted",
    "data": { ...connectionRequest }
  }
  ```

---

### 8. Get Received Connection Requests
Fetch connection requests received by the logged-in user that are pending (`interested`).
* **Method:** `GET`
* **Route:** `/api/v1/user/request/received`
* **Authentication:** Requires `token` Cookie (`userAuth`)
* **Response:**
  `200 OK`
  ```json
  {
    "message": "Data fetched successfully",
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
        "status": "interested"
      }
    ]
  }
  ```

---

### 9. Get User Connections
Fetch active connections (`accepted`) of the logged-in user.
* **Method:** `GET`
* **Route:** `/api/v1/user/connections`
* **Authentication:** Requires `token` Cookie (`userAuth`)
* **Response:**
  `200 OK`
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

---

### 10. Feed
Get potential user matches for the logged-in user feed with support for pagination.
* **Method:** `GET`
* **Route:** `/api/v1/feed`
* **Authentication:** Requires `token` Cookie (`userAuth`)
* **Query Parameters:**
  * `page` *(optional, number, default: `1`)*: Page number for pagination
  * `limit` *(optional, number, default: `10`, max: `50`)*: Number of user cards per page
* **Response:**
  `200 OK` — Array of user profile cards

---

### 11. Get User Details
Fetch user profile details by email ID.
* **Method:** `GET`
* **Route:** `/api/v1/user`
* **Authentication:** Requires `token` Cookie (`userAuth`)
* **Request Body:**
  ```json
  {
    "emailId": "john@example.com"
  }
  ```
* **Response:**
  `200 OK` — Matched user object

---

### 12. Update User
Update details of an existing user record by `userId`.
* **Method:** `PATCH`
* **Route:** `/api/v1/user`
* **Authentication:** Requires `token` Cookie (`userAuth`)
* **Request Body:**
  ```json
  {
    "userId": "user_mongodb_id",
    "firstName": "UpdatedFirstName",
    "skills": ["JavaScript", "Node.js"]
  }
  ```
* **Response:**
  `201 Created` — `"user updated successfully"`

---

### 13. Delete User
Delete a user record by ID.
* **Method:** `DELETE`
* **Route:** `/api/v1/user`
* **Authentication:** Requires `token` Cookie (`userAuth`)
* **Request Body:**
  ```json
  {
    "userId": "user_mongodb_id"
  }
  ```
* **Response:**
  `201 Created` — `"UserDeleted Successfully"`
