# Authentication System – Registration, Login, JWT & Google OAuth

## Overview

This project is a full-stack authentication system built using React and Node.js. It demonstrates how to implement secure user registration, login, authentication, and protected routes in a web application.

The project starts with traditional email and password authentication, where passwords are securely hashed using `bcryptjs`. It then introduces JSON Web Tokens (JWT) to authenticate users and protect private API endpoints.

The frontend is built with React and communicates with the backend through Axios. React Context API is used to manage authentication state across the application.

The project also integrates Google OAuth 2.0 using Passport.js, allowing users to register or sign in using their Google accounts.

## Tech Stack

### Frontend
- **React** – Building the user interface and reusable components.
- **Vite** – Frontend development server and build tool.
- **React Router DOM** – Managing application routes and protected pages.
- **Axios** – Making HTTP requests to the backend API.
- **CSS** – Styling the application and authentication forms.
- **Context API** – Managing global authentication state.

### Backend
- **Node.js** – JavaScript runtime environment.
- **Express.js** – Building REST API endpoints.
- **bcryptjs** – Hashing passwords and comparing submitted passwords.
- **jsonwebtoken (JWT)** – Generating and verifying authentication tokens.
- **Passport.js** – Managing authentication strategies.
- **passport-google-oauth20** – Implementing Google OAuth 2.0 authentication.
- **express-session** – Managing sessions required for OAuth state validation.
- **cors** – Allowing communication between the frontend and backend.
- **dotenv** – Managing environment variables securely.

## Features

### 1. User Registration
- Allows users to create an account using their name, email, and password.
- Validates required fields.
- Checks email format.
- Requires passwords to contain at least 8 characters, one uppercase letter, and one number.
- Checks for existing accounts using case-insensitive email comparison.
- Hashes passwords using `bcryptjs` before storing them.
- Returns a JWT after successful registration.

### 2. User Login
- Allows existing users to log in using their email and password.
- Finds users using case-insensitive email comparison.
- Uses `bcryptjs.compare()` to verify submitted passwords against stored password hashes.
- Returns a JWT after successful authentication.
- Provides a consistent error message for invalid credentials.

### 3. Password Security
- Passwords are never stored as plain text.
- Uses `bcryptjs` with a salt factor of 10.
- Password hashes are used for password verification during login.

### 4. JWT Authentication
- Generates JSON Web Tokens after successful registration and login.
- Includes the user's ID and email in the token payload.
- Tokens expire after 24 hours.
- Uses a secret stored in the backend environment variables.
- Verifies tokens before granting access to protected endpoints.

### 5. Authentication Middleware
- Checks for a Bearer token in the Authorization header.
- Rejects requests without a token.
- Detects expired and invalid tokens.
- Attaches verified user information to `req.user`.
- Allows authenticated requests to proceed using `next()`.

### 6. Protected Routes
- Protects backend endpoints using JWT authentication middleware.
- Provides a protected `/api/auth/me` endpoint to retrieve the authenticated user's information.
- Implements a frontend `ProtectedRoute` component to prevent unauthenticated users from accessing the dashboard.
- Redirects unauthenticated users to the login page.

### 7. React Authentication Context
- Manages authentication state globally using React Context API.
- Stores the authentication token and user information in local storage.
- Provides login and logout functions.
- Updates the application when authentication state changes.

### 8. Dashboard
- Displays authenticated user information, including name and email.
- Retrieves the current user's details from the backend.
- Provides a logout button.
- Restricts dashboard access to authenticated users.

### 9. Google OAuth Authentication
- Allows users to sign in or register using their Google accounts.
- Uses Passport.js and the Google OAuth 2.0 strategy.
- Requests Google profile and email permissions.
- Handles Google's authentication callback.
- Creates or identifies a user account using Google profile information.
- Generates a JWT after successful Google authentication.
- Redirects the user to the frontend callback route.
- Allows Google-authenticated users to access the protected dashboard.

## Project Structure

The project is organized into separate frontend and backend directories.

### Backend

```text
week-7-day-3-backend/
│
├── config/
│   └── passport.js
│
├── middleware/
│   └── auth.js
│
├── .env
├── .gitignore
├── package.json
└── server.js
```

### Frontend

```text
week-7-day-3-frontend/
│
├── src/
│   ├── components/
│   │   ├── LoginForm.jsx
│   │   ├── RegisterForm.jsx
│   │   ├── GoogleAuthButton.jsx
│   │   └── ProtectedRoute.jsx
│   │
│   ├── context/
│   │   └── AuthContext.jsx
│   │
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── Dashboard.jsx
│   │   └── GoogleCallback.jsx
│   │
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│
├── .env
├── package.json
└── index.html
```

*Note: The structure above represents the main files involved. Your actual project may contain additional files or slightly different component locations.*

## Setup and Run Instructions

### Prerequisites

Ensure the following are installed:

- Node.js and npm.
- Visual Studio Code or another code editor.
- A Google account for testing Google OAuth.
- A modern web browser.

### 1. Clone the Repository

```bash
git clone https://github.com/ro550/week-7-day-3-assignment
```

Navigate into the project directory:

```bash
cd week-7-day-3-assignment
```

### 2. Set Up the Backend

Open a terminal and navigate to the backend directory:

```bash
cd week-7-day-3-backend
```

Install the dependencies:

```bash
npm install
```

Create a `.env` file in the backend directory:

```env
PORT=4000

JWT_SECRET=your_jwt_secret

SESSION_SECRET=your_session_secret

CLIENT_URL=http://localhost:5173

GOOGLE_CLIENT_ID=your_google_client_id

GOOGLE_CLIENT_SECRET=your_google_client_secret

GOOGLE_CALLBACK_URL=http://localhost:4000/api/auth/google/callback
```

Replace the placeholder values with your actual secrets and Google OAuth credentials.

**Important:** Generate strong random values for `JWT_SECRET` and `SESSION_SECRET`. Never commit your `.env` file to GitHub.

Start the backend server:

```bash
npm start
```

The backend should run at:

```text
http://localhost:4000
```

### 3. Set Up the Frontend

Open another terminal and navigate to the frontend directory:

```bash
cd week-7-day-3-frontend
```

Install the dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

The frontend should be accessible at:

```text
http://localhost:5173
```

### 4. Configure Google OAuth

To enable Google authentication:

1. Open the [Google Cloud Console](https://console.cloud.google.com/).
2. Select the project created for this application.
3. Configure the Google Auth Platform.
4. Set the audience and add your Google account as a test user if the application is in testing mode.
5. Create an OAuth 2.0 Client ID.
6. Select **Web application** as the application type.

Configure the following URLs:

**Authorized JavaScript origins:**

```text
http://localhost:5173
```

**Authorized redirect URIs:**

```text
http://localhost:4000/api/auth/google/callback
```

Copy the generated Client ID and Client Secret into the backend `.env` file.

Restart the backend after making changes to environment variables.

## How to Test

Testing can be performed through the frontend application and directly against the backend API using Postman or another API testing tool.

### 1. Test User Registration

Open:

```text
http://localhost:5173
```

Navigate to the registration form and enter valid details.

Example:

```json
{
  "name": "Wanjiku",
  "email": "wanjiku@mail.com",
  "password": "Password123"
}
```

Expected result:
- Registration should be successful.
- The backend should hash the password.
- A JWT should be generated.
- The user should be redirected to the dashboard.

To test the API directly:

**Method:** `POST`

**Endpoint:**

```text
http://localhost:4000/api/auth/register
```

**Body:** Select JSON and provide the registration details above.

Expected status: `201 Created`.

### 2. Test User Login

Log out and return to the login form.

Use the registered email and password.

Expected result:
- The backend should find the account.
- The submitted password should be compared with the stored hash.
- A JWT should be returned.
- The user should be redirected to the dashboard.

To test the API directly:

**Method:** `POST`

**Endpoint:**

```text
http://localhost:4000/api/auth/login
```

**Body:**

```json
{
  "email": "wanjiku@mail.com",
  "password": "Password123"
}
```

Expected status: `200 OK`.

Also test an incorrect password. The API should return:

```json
{
  "message": "Invalid email or password."
}
```

Expected status: `401 Unauthorized`.

### 3. Test JWT Authentication

After registering or logging in, copy the returned JWT.

Use a JWT verification tool such as [JWT.io](https://jwt.io/) to inspect the token's payload.

Check that it contains the expected user information and an expiration time.

Remember that decoding a JWT does not verify its signature. The backend performs the actual verification using the JWT secret.

### 4. Test Protected Routes

Test the authenticated user endpoint:

**Method:** `GET`

**Endpoint:**

```text
http://localhost:4000/api/auth/me
```

Under the Authorization tab in Postman:

1. Select Bearer Token.
2. Paste the JWT.
3. Send the request.

Expected result: `200 OK`, with the authenticated user's information.

Test the following scenarios:

| Test | Expected result |
|---|---|
| Valid JWT | 200 OK |
| No JWT | 401 Unauthorized |
| Invalid JWT | 401 Unauthorized |
| Expired JWT | 401 Unauthorized |

### 5. Test Frontend Protected Routes

Open the frontend application.

Test the following:

- Try accessing `/dashboard` without logging in. You should be redirected to the login page.
- Register or log in successfully.
- Confirm that the dashboard displays the user's information.
- Refresh the dashboard and check whether authentication is maintained.
- Click Logout and confirm that the user is redirected to the login page.
- Try accessing `/dashboard` again after logging out.

### 6. Test Google OAuth

Open the frontend application:

```text
http://localhost:5173
```

1. Click the **Sign in with Google** button.
2. Select your Google account.
3. Grant the requested permissions if prompted.
4. Allow Google to redirect to the backend callback.
5. Confirm that the backend generates a JWT.
6. Confirm that the frontend callback processes the token and updates the authentication context.
7. Confirm that the user is redirected to the dashboard.

Also test Google authentication with an account that has not previously registered using email and password.

### 7. Test Error Handling

Try the following scenarios:

- Register without providing all required fields.
- Register using an invalid email address.
- Register with a password shorter than 8 characters.
- Register with a password that does not contain an uppercase letter.
- Register with a password that does not contain a number.
- Register using an email address that already exists.
- Log in with an incorrect password.
- Access protected routes without a JWT.
- Attempt to use an expired JWT.
- Attempt Google authentication with an account that is not an authorized test user while the OAuth application is in testing mode.

The application should return appropriate error messages and HTTP status codes.

## Important Notes

- User accounts are currently stored in an in-memory JavaScript array. This means registered accounts are lost whenever the backend server restarts. A database such as MySQL or PostgreSQL would be needed for persistent storage.
- Passwords are stored as bcrypt hashes, not plain-text passwords.
- JWT and session secrets must remain private and should never be committed to version control.
- The Express session MemoryStore is suitable for development and testing, but a persistent session store should be configured for production.
- Google OAuth credentials must be configured correctly in both the backend `.env` file and Google Cloud Console.
- The frontend and backend must both be running for the complete application to work.

## Technologies and Concepts Practised

Through these exercises, the project demonstrates practical implementation of:

- REST API development with Express.js.
- Password hashing and verification with bcryptjs.
- Secure user registration and login.
- JWT creation and verification.
- Authentication middleware.
- Protected API endpoints.
- React Context API for global state management.
- React Router for frontend route protection.
- API communication using Axios.
- OAuth 2.0 authentication using Google.
- Passport.js authentication strategies.
- Environment variable management.
- Backend and frontend integration.

