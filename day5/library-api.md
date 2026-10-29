
# Library Books REST API Design

## Overview

This API manages books in a library.

**Base URL:** `https://api.example.com`

**Resource:** `/books`

Each book has an ID, title, author, publication year, and ISBN.

## 1. List All Books

- **Method:** GET
- **Path:** `/books`
- **Description:** Returns a list of all books.
- **Request body:** Not required.
- **Success status:** `200 OK`

Example request:

```http
GET /books
```

## 2. Get One Book

- **Method:** GET
- **Path:** `/books/{id}`
- **Description:** Returns details of a book with the specified ID.
- **Request body:** Not required.
- **Success status:** `200 OK`

Example request:

```http
GET /books/12
```

## 3. Create a Book

- **Method:** POST
- **Path:** `/books`
- **Description:** Creates a new book in the library.
- **Success status:** `201 Created`

Example request body:

```json
{
  "title": "Introduction to Web Development",
  "author": "Jane Wanjiku",
  "publicationYear": 2025,
  "isbn": "9781234567890"
}
```

## 4. Update a Book

- **Method:** PUT
- **Path:** `/books/{id}`
- **Description:** Replaces the details of an existing book.
- **Success status:** `200 OK`

Example request:

```http
PUT /books/12
```

Example request body:

```json
{
  "title": "Advanced Web Development",
  "author": "Jane Wanjiku",
  "publicationYear": 2026,
  "isbn": "9781234567890"
}
```

## 5. Delete a Book

- **Method:** DELETE
- **Path:** `/books/{id}`
- **Description:** Deletes the book with the specified ID.
- **Request body:** Not required.
- **Success status:** `204 No Content`

Example request:

```http
DELETE /books/12
```

## 6. List Books by Author

- **Method:** GET
- **Path:** `/books?author=Jane%20Wanjiku`
- **Description:** Returns books written by the specified author.
- **Request body:** Not required.
- **Success status:** `200 OK`

Example request:

```http
GET /books?author=Jane%20Wanjiku
```

The `author` query parameter filters the books returned by the API.

## Error Responses

### 400 Bad Request

The request contains invalid data or is missing required fields.

Example: A client tries to create a book without a title or author.

### 404 Not Found

The requested resource does not exist.

Example: A client requests `GET /books/9999`, but no book has ID `9999`.

## Summary

| Operation | HTTP method | Path | Success status |
|---|---|---|---|
| List books | GET | `/books` | 200 |
| Get one book | GET | `/books/{id}` | 200 |
| Create a book | POST | `/books` | 201 |
| Update a book | PUT | `/books/{id}` | 200 |
| Delete a book | DELETE | `/books/{id}` | 204 |
| Filter by author | GET | `/books?author=...` | 200 |
