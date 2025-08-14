# Skill Gap Guide - Run Instructions

This document provides detailed instructions for running both the Frontend (Client) and Backend (sgg) components of the Skill Gap Guide project.

## Project Structure

```
SEP490_Gr66_SkillGapGuide/
├── Client/          # Frontend - React + Vite application
├── sgg/             # Backend - Spring Boot application  
└── docs/            # Documentation
```

## Prerequisites

### For Frontend (Client/)
- **Node.js**: Version 16+ (recommended: 18+ or 20+)
- **npm** or **yarn** package manager

### For Backend (sgg/)
- **Java**: Version 21 (as specified in pom.xml)
- **Maven**: Version 3.6+ 
- **MySQL**: Database server
- **Chrome/Chromium**: For web scraping functionality (Selenium)

## Frontend Setup & Run Instructions

### 1. Navigate to Client Directory
```bash
cd Client/
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Available Scripts
- **Development Server**: `npm run dev`
- **Production Build**: `npm run build`  
- **Lint Code**: `npm run lint`
- **Preview Build**: `npm run preview`

### 4. Run Development Server
```bash
npm run dev
```

The frontend will start on `http://localhost:5173` (Vite default port).

### 5. Key Frontend Technologies
- **Framework**: React 19.1.0
- **Build Tool**: Vite 6.3.5
- **Styling**: TailwindCSS 4.1.8
- **Routing**: React Router DOM 7.6.1
- **State Management**: Zustand 5.0.6
- **HTTP Client**: Axios 1.9.0
- **UI Components**: Lucide React, React Icons
- **Authentication**: Firebase 11.9.0
- **Database**: Supabase 2.50.0

## Backend Setup & Run Instructions

### 1. Navigate to Backend Directory
```bash
cd sgg/
```

### 2. Environment Configuration
The application uses environment variables for configuration. Create a `.env` file or set environment variables for:

- **Database Configuration**:
  - `spring.datasource.url` - MySQL database URL
  - `spring.datasource.username` - Database username
  - `spring.datasource.password` - Database password
  - `spring.datasource.driver-class-name` - MySQL driver

- **Application URLs**:
  - `application.base-url` - Backend base URL
  - `application.frontend-url` - Frontend URL for CORS

- **JWT Configuration**:
  - `jwt.secret` - JWT signing secret
  - `jwt.expirationMs` - Token expiration time

- **Email Configuration**:
  - `spring.mail.host` - SMTP server
  - `spring.mail.port` - SMTP port
  - `spring.mail.username` - Email username
  - `spring.mail.password` - Email password

- **OAuth2 (Coursera)**:
  - `client.id` - Coursera OAuth client ID
  - `client.secret` - Coursera OAuth client secret

### 3. Database Setup
```bash
sudo apt update
sudo apt upgrade -y
sudo apt install mysql-server -y
sudo systemctl status mysql
sudo systemctl start mysql
sudo systemctl enable mysql
```

Ensure MySQL is running and create a database for the application. The application uses Hibernate with `ddl-auto` setting, so tables will be created automatically based on your configuration.

### 4. Install Chrome/Chromium
For web scraping functionality, ensure Chrome or Chromium is installed:
```bash
# Ubuntu/Debian
wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
sudo sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list'
sudo apt update
sudo apt install google-chrome-stable
```

check if chrome is installed
```bash
google-chrome --version
```


### 5. Maven Build & Run Options

#### Option 1: Using Maven Wrapper (Recommended)
```bash
# On Linux/macOS
chmod +x mvnw
sudo apt install openjdk-21-jdk -y

./mvnw clean install (optional)
./mvnw clean install -DskipTests (update mvnw, pom.xml)

fix error: Access denied for user 'root'@'localhost'
This suggests your MySQL has auth_socket plugin enabled for root user. Check the
  authentication method:

  SELECT user, host, plugin FROM mysql.user WHERE user = 'root';

  If it shows auth_socket, you need to change it to mysql_native_password:

  ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '123456';
  FLUSH PRIVILEGES;

  Then test with:
  mysql -u root -h localhost -p

./mvnw spring-boot:run

# On Windows
mvnw.cmd clean install
mvnw.cmd spring-boot:run
```

#### Option 2: Using System Maven
```bash
mvn clean install
mvn spring-boot:run
```

#### Option 3: Run Compiled JAR
```bash
./mvnw clean package
java -jar target/sgg-0.0.1-SNAPSHOT.jar
```

### 6. Backend Access Points
- **Application**: `http://localhost:8080`
- **Swagger UI**: `http://localhost:8080/swagger-ui/index.html`
- **Actuator Health**: `http://localhost:8080/actuator/health`

### 7. Key Backend Technologies
- **Framework**: Spring Boot 3.2.5
- **Java Version**: 21
- **Database**: MySQL with JPA/Hibernate
- **Security**: Spring Security + JWT
- **Documentation**: Swagger/OpenAPI 3
- **Web Scraping**: Selenium WebDriver
- **Email**: Spring Mail
- **File Processing**: iText PDF, Tika
- **Build Tool**: Maven

## Development Workflow

### 1. Full Stack Development
1. Start the backend server first:
   ```bash
   cd sgg/
   ./mvnw spring-boot:run
   ```

2. In a new terminal, start the frontend:
   ```bash
   cd Client/
   npm run dev
   ```

### 2. Production Build
1. Build frontend for production:
   ```bash
   cd Client/
   npm run build
   ```

2. Build backend JAR:
   ```bash
   cd sgg/
   ./mvnw clean package
   ```


## Testing

### Frontend Testing
```bash
cd Client/
npm run lint
```

### Backend Testing
```bash
cd sgg/
./mvnw test
```

## Additional Notes

- The application uses **Spring profiles**. Default is `dev` profile as specified in `application.properties`
- **File uploads** are configured with size limits via `spring.servlet.multipart` properties
- The backend includes **web scraping capabilities** using Selenium WebDriver
- **Email functionality** is configured for user notifications and authentication
- **OAuth2 integration** with Coursera for external authentication