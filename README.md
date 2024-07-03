```
# ExpressCRUD

ExpressCRUD is a lightweight Node.js project using Express.js and SQLite for seamless CRUD (Create, Read, Update, Delete) operations.

## Features

- Perform CRUD operations using SQLite database.
- Execute custom SQL queries via POST requests.
- Basic error handling and validation.

## Setup

1. **Clone the repository:**

   ```
   git clone https://github.com/shivrajansingh/ExpressCRUD.git
   cd ExpressCRUD
   ```

2. **Install dependencies:**

   ```
   npm install
   ```

3. **Start the server:**

   ```
   node app.js
   ```

   The server will start running at `http://localhost:3001`.

## Usage

### Perform CRUD Operations

- **Create:** Use appropriate routes and methods to create new records.
- **Read:** Retrieve records using GET requests.
- **Update:** Update existing records using appropriate routes and methods.
- **Delete:** Delete records using DELETE requests.

### Execute SQL Queries

To execute custom SQL queries, send a POST request to `/execute-sql` with a JSON body containing `{ "sql": "YOUR_SQL_STATEMENT_HERE" }`.

Example using cURL:

```
curl -X POST -H "Content-Type: application/json" -d '{ "sql": "SELECT * FROM users;" }' http://localhost:3000/execute-sql
```

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
```

### Explanation

- **Project Description**: Briefly describes what ExpressCRUD does.
- **Features**: Lists key features of the project.
- **Setup**: Provides steps to clone the repository, install dependencies, and start the server.
- **Usage**:
  - Explains how to perform CRUD operations.
  - Provides an example and instructions for executing custom SQL queries.
- **Contributing**: Encourages contributions from others.
- **License**: Mentions the project's license.

Replace `https://github.com/shivrajansingh/ExpressCRUD.git` with your actual repository URL. Customize the sections further based on additional features, detailed setup instructions, or specific guidelines for contributing to your project.