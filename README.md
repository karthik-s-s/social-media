
# Simple Social Media Platform
This project is a simple social media platform that allows users to upload and view posts. It implements features such as user authentication using JWT, viewing unseen posts first, post pagination, and displaying a "You are all caught up" message when there are no new posts left. 

## Features

- **User Login**: Users can log in using their username, and a JWT token is generated to authenticate future requests.
- **JWT Authentication**: The platform uses JWT tokens to secure the API routes. Only authenticated users can upload and view posts.
- **View Unseen Posts First**: The platform prioritizes unseen posts, ensuring that the user sees them before any already viewed posts.
- **Pagination**: The feed supports pagination with a limit of 4 posts per page. Users can load more posts as needed.
- **"You Are All Caught Up" Message**: When all unseen posts are viewed, a message informs users that they are caught up.
- **Post Upload**: Users can upload photos, which will be visible in the news feed.

## API Documentation

### User Authentication

#### Login (POST `/api/login`)

- **Request Body**:
  ```json
  {
    "username": "your_username"
  }
  ```

- **Response**:
  ```json
  {
    "token": "jwt_token"
  }
  ```
  The token is valid for 1 hour and is required to access other endpoints.

### Posts

#### Create Post (POST `/api/posts`)

- **Headers**:
  - `Authorization: Bearer <jwt_token>`

- **Form Data**:
  - `photo`: The image file to upload.

- **Response**:
  ```json
  {
    "message": "Post uploaded successfully",
    "post": {
      "id": 1,
      "username": "your_username",
      "photoPath": "path_to_uploaded_photo"
    }
  }
  ```

#### Get Feed (GET `/api/posts`)

- **Headers**:
  - `Authorization: Bearer <jwt_token>`

- **Query Parameters**:
  - `page`: The page number (default is 1).
  - `limit`: The number of posts per page (default is 4).

- **Response**:
  ```json
  {
    "posts": [
      {
        "id": 1,
        "username": "your_username",
        "photoPath": "path_to_photo"
      }
    ],
    "hasMore": true,
    "seen": false
  }
  ```

#### Mark Posts as Viewed (POST `/api/posts/viewed`)

- **Headers**:
  - `Authorization: Bearer <jwt_token>`

- **Request Body**:
  ```json
  {
    "postId": [1, 2, 3]
  }
  ```

- **Response**:
  ```json
  {
    "message": "Posts marked as viewed"
  }
  ```

## Project Setup

### Prerequisites

- Node.js
- MySQL

### Steps

1. **Clone the repository**:
    ```bash
    git clone https://github.com/karthik-s-s/social-media.git
    ```
2. **Navigate to the project directory:**:
    ```bash
    cd social-media
    ```
3. Run `npm install` to install dependencies.

4. **Set up environment variables**:
   - Create a `.env` file in the root directory with the following content:
     ```env
     DB_NAME=social_media
     DB_USER=root
     DB_PASSWORD=password
     DB_HOST=localhost
     JWT_SECRET=your_jwt_secret
     ```
5. **Create a MySQL database named social_media**:
   ```bash
   CREATE DATABASE social_media;
   ```
6. Start the server using `npm start`.

**The server will start on http://localhost:3000 by default.**

### Database Structure

- **User**: Stores the users who log in.
- **Post**: Stores the posts uploaded by users.
- **ViewedPost**: Tracks which posts have been viewed by which users.

