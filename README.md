# Backend Project in Node.js and SQL

This is a backend project using Node.js and SQL using PostgreSQL as database. It provides APIs for:

| Purpose             | Parameters                | Type |
| ------------------- | ------------------------- | ---- |
| fetching products   | { name, price, category } | GET  |
| fetching categories | { category }              | GET  |
| user registration   | { name, email, password } | POST |
| user login          | { email, password }       | POST |

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js
- PostgreSQL

### Installing

1. Clone the repository and navigate into the project directory:

```
git clone https://github.com/kunalvrm555/asgn-covv.git
cd asgn-covv
```

2. Install the dependenies

```
npm i
```

3. Create a .env file and set the following environment variables:

```env
DB_USER=
DB_NAME=
DB_HOST=
DB_PASS=
JWT_SECRET=
ADMIN_PASS=
ADMIN_NAME=
ADMIN_EMAIL=
```

4. Initialize the database and seed sample data by using the following command:

```
node scripts/initDB.js
```

5. Start the server by running

```
npm run start
```

## Endpoints

### Products

Returns a list of all products.

 **URL: `/products`**

 **Method:** GET

**Auth required:** Yes

**Query Parameters:**

- **category (optional):** filters products by category.
- **page (optional):** page number to retrieve.
- **limit (optional):** number of products per page.

### Categories

Returns a list of all categories in which the products are available.

 **URL: `/categories`**

 **Method:** GET

**Auth required:** Yes

**Query Parameters:** None

### Login

Authenticates an existing user by verifying their email and password. A JSON web token (JWT) is returned upon successful authentication.

 **URL: `/auth/login`**

 **Method:** POST

 **Headers:**

| Name         | Type   | Description        |
| ------------ | ------ | ------------------ |
| Content-Type | string | 'application.json' |

**Body:**

| Name     | Type   | Description              |
| -------- | ------ | ------------------------ |
| email    | string | The user's email address |
| password | string | The user's password      |

### Register

Creates a new user with the given email, password and name.

**URL: `/auth/register`**

 **Method:** POST

 **Headers:**

| Name         | Type   | Description        |
| ------------ | ------ | ------------------ |
| Content-Type | string | 'application.json' |

**Body:**

| Name     | Type   | Description              |
| -------- | ------ | ------------------------ |
| email    | string | The user's email address |
| password | string | The user's password      |
| name     | string | The user's name          |

## Security

These API requires authentication for all endpoints except `/auth/login` and `/auth/register`. Authentication is handled via JSON Web Tokens (JWT). The JWT is returned upon successful login and must be included in the `Authorization` header for all subsequent requests.

## Usage

### Register new user

To create  a new user, send a **POST** request to the endpoint `/auth/register` with the required parameters in the body of the request.For example :

```http
POST /auth/register
Host: localhost:3000
Content-Type: application/json
  
    {  
        "email":"kunalvrm555@gmail.com",
        "password":"password123",
        "name":"kunal"
    }

```

### Login existing user

To login an existing user, send a **POST** request to the endpoint `/auth/login` with the required parameters in the body of the request.For example :

```http
POST /auth/login
Host: localhost:3000
Content-Type: application/json
  
    {
        "email":"kunalvrm555@gmail.com",
        "password":"password123"
    }
```

### Fetch  products

#### Fetch all products

To fetch all products, send a **GET** request to the endpoint `/products` with the token in the `Authorization` header. For example :

```http
GET /products
Host: localhost:3000
Authorization: Bearer your_token_here
```

#### Fetch products of specific category

To fetch products of a specific category, send a **GET** request to the endpoint `products` with the token in the `Authorization` header and the required category in the query params. For example :

```http
GET /products?category=Smartphones 
Host: localhost:3000
Authorization: Bearer your_token_here
```

#### Fetch products with pagination

To fetch products with pagination, send a **GET** request to the endpoint `products` with the token in the `Authorization` header and the required page number and limit in the query params. For example :

```http
GET /products?page=1&limit=10
Host: localhost:3000
Authorization: Bearer your_token_here
```

#### Fetch products of specific category with pagination

To fetch products of a specific category with pagination, send a **GET** request to the endpoint `products` with the token in the `Authorization` header and the required category, page number and limit in the query params. For example :

```http
GET /products?category=Smartphones&page=1&limit=10
Host: localhost:3000
Authorization: Bearer your_token_here
```

### Fetch categories

To fetch all categories, send a **GET** request to the endpoint `/categories` with the token in the `Authorization` header. For example :

```http
GET /categories
Host: localhost:3000
Authorization: Bearer your_token_here
```
