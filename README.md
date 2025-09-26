# GraphQL To-Do List API

A simple GraphQL API for managing a to-do list.  Includes authentication and uses MongoDB as a database.

## Features

*   User authentication (registration, login)
*   JWT based authentication
*   CRUD operations for to-do items

## Requirements

*   Node.js (v16 or higher)
*   npm or yarn
*   MongoDB

## Installation

1.  Clone the repository:
    `git clone <repository_url>`
2.  Install dependencies:
    `npm install` or `yarn install`
3.  Configure the environment variables:
    Create a `.env` file based on the `.env.example` file.
4.  Start the server:
    `npm start` or `yarn start`

## API Endpoints

The GraphQL endpoint is located at `/graphql`.

You can use a GraphQL client like GraphiQL or Apollo Client to interact with the API.

## Authentication

Authentication is done using JWTs.  You need to register a user first and then log in to get a JWT.  The JWT needs to be included in the `Authorization` header of subsequent requests.
