# CRUD Application

This is a full-stack CRUD (Create, Read, Update, Delete) application. The backend is built using Java with Spring Boot, providing a REST API, and the frontend is developed using Angular with TypeScript. The application uses PostgreSQL as the database to store data.

## Technologies

- **Frontend**: Angular, TypeScript, HTML, CSS
- **Backend**: Java, Spring Boot, Spring Data JPA, REST API
- **Database**: PostgreSQL
- **Build Tools**: Gradle, npm

## Installation

### Backend (Spring Boot)

1. Clone the repository and navigate to the backend directory:
   ```bash
   cd backend
2. Configure your PostgreSQL database connection in the src/main/resources/application.properties file:
   ```bash
   spring.application.name=CRUD Demo
   spring.datasource.url=jdbc:postgresql://localhost:5432/your_database_name
   spring.datasource.username=your_db_username
   spring.datasource.password=your_db_password
   spring.jpa.hibernate.ddl-auto=none
   spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
3. Build the project with Gradle and run the application.
4. The backend will be running at http://localhost:8080.
   
### Frontend (Angular)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
2. Ensure you have Node.js and npm installed. Then, install the required dependencies:
   ```bash
   npm install
3. Run the Angular development server:
   ```bash
   ng serve
4. The frontend will be running on http://localhost:4200.

### Usage

The application allows you to perform CRUD and Search operations:
- Create: Add a new record via the form.
- Read: View all records in the table.
- Update: Edit an existing record by selecting it.
- Delete: Remove a record by selecting it.
- Search: View all records matching the condition

The frontend communicates with the backend REST API to handle CRUD operations.

### Features Implemented

- CRUD operations for entities (e.g., users, tasks, etc.)
- Search functionality based on various conditions (e.g., by name, date)
- Responsive and interactive UI built with Angular
- RESTful API with Spring Boot for data operations
- Integration with PostgreSQL database for data persistence
- Validation and error handling for user inputs
