# Node.js Project

## To check the examples request
```https://documenter.getpostman.com/view/28260577/2s9YsRbobv```

## Environment Configuration

The project uses environment variables for configuration. Create a `.env` file in the root directory with the following variables:

```env
MONGO_URI=
MONGO_URI_ATLAS=
PORT=3000
JWT_SECRET=
ADMIN_PASS="Admin123456"
```
## Project Dependencies

npm install

## Project Structure

The project follows a standard Node.js application structure:

- src/: Contains the source code of the application.
- middlewares/: Middleware functions for the application.
- model/: Database models (e.g., User, Card).
- routes/: Express routes for different functionalities (e.g., - users, cards).
- static/: Static files (e.g., images).
- app.js: Main application file.
- routes/: Express route files organized by functionality (e.g., users, cards).
- static/: Static files to be served by the application.
- .env: Environment variable configuration file.

## NPM Scripts

- start: Start the application in production mode.
dev: Start the application in development mode using Nodemon - for automatic restarts.


## Running the Application
```
npm start
npm run dev
```

## Description of Main Functions

### 1. User Authentication

- **`POST /users`**: Route to create a new user. Validates user data and securely stores the password in the database.

- **`POST /users/login`**: Route to authenticate an existing user. Verifies user credentials and issues a JWT token for subsequent authentication.

### 2. User Management

- **`GET /users/:id`**: Route to get details of a specific user. Only authenticated users have access. The response includes information excluding the password.

- **`GET /users`**: Route to get all users. Only users with administrator permissions have access. The response includes information excluding passwords.

- **`PUT /users/:id`**: Route to update user information. Performs validations and updates user data in the database.

- **`PATCH /users/:id`**: Route to toggle the business status of a user. Only authenticated users have access. If the authenticated user is an administrator, they can change the business status of any user.

- **`DELETE /users/:id`**: Route to delete a user. Only authenticated users can delete their own accounts, while administrators can delete any account.

### 3. Card Management

- **`GET /cards/my-cards`**: Route to get cards belonging to the authenticated user.

- **`GET /cards/:id`**: Route to get details of a specific card.

- **`GET /cards`**: Route to get all available cards.

- **`POST /cards`**: Route to create a new card for an authenticated user with business permissions.

- **`PUT /cards/:id`**: Route to update information of a card. Only the owner of the card can update it.

- **`PATCH /cards/:id`**: Route to add/remove likes to a card.

- **`DELETE /cards/:id`**: Route to delete a card. Only the owner of the card or administrators have permission for deletion.

