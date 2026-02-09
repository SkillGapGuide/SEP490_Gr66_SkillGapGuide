# SkillGapGuide - AI-Powered Career Development Platform

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![Java](https://img.shields.io/badge/Java-21-orange.svg)](https://www.oracle.com/java/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)

## 📖 Overview

**SkillGapGuide** is an intelligent career development platform that leverages AI to analyze CV/resumes, identify skill gaps, and provide personalized learning recommendations. The system helps job seekers understand the skills they need to acquire for their target positions and suggests relevant courses from platforms like Coursera and Udemy.

### Key Features

- 🔍 **CV/JD Analysis**: Upload CVs and job descriptions (PDF/DOCX) to extract skills automatically
- 🎯 **Skill Gap Detection**: Compare your current skills with job requirements using AI-powered analysis
- 💼 **Job Matching**: Get personalized job recommendations based on your skill profile
- 📚 **Course Recommendations**: Receive curated learning paths from top e-learning platforms
- 📊 **Progress Tracking**: Monitor your skill development journey (Premium)
- ⭐ **Favorites & Ratings**: Save courses, jobs, and provide feedback on the platform

## 🏗️ Architecture

```
SEP490_Gr66_SkillGapGuide/
├── Client/                    # Frontend - React + Vite
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Page components
│   │   │   ├── user/        # User-facing pages
│   │   │   └── admin/       # Admin dashboard
│   │   ├── layouts/         # Layout components (Header, Footer, Sidebar)
│   │   ├── services/        # API service layer
│   │   ├── stores/          # Zustand state management
│   │   ├── router/          # React Router configuration
│   │   └── utils/           # Utility functions
│   └── package.json
│
├── sgg/                       # Backend - Spring Boot
│   ├── src/main/java/com/skillgapguide/sgg/
│   │   ├── Controller/      # REST API endpoints
│   │   ├── Service/         # Business logic layer
│   │   ├── Repository/      # Data access layer
│   │   ├── Entity/          # JPA entities
│   │   └── DTO/             # Data transfer objects
│   └── pom.xml
│
├── deploy/                    # Deployment scripts & documentation
│   ├── setup-llm.md         # AI model setup guide
│   ├── install_lib.md       # Dependencies installation
│   └── RUN_INSTRUCTIONS.md  # Detailed run instructions
│
├── database.sql              # Database schema
├── rawdatafornghe.sql       # Seed data for job categories
└── README.md
```

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Fast build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **Zustand** - Lightweight state management
- **React Router** - Client-side routing
- **Framer Motion** - Animation library
- **Axios** - HTTP client
- **Recharts** - Data visualization

### Backend
- **Spring Boot 3.x** - Java framework
- **Spring Security** - Authentication & authorization (JWT)
- **Spring Data JPA** - Database access
- **MySQL** - Relational database
- **Selenium** - Web scraping for job postings
- **iText PDF** - PDF processing
- **Apache POI** - DOCX processing

### AI/ML Components
- **Ollama** - Local LLM inference (Mistral 7B)
- **Sentence Transformers** - Text embeddings (Nomic AI models)
- **FastAPI** - Python embedding service
- **PyTorch** - Deep learning framework

## 🚀 Getting Started

### Prerequisites

#### For Frontend
- **Node.js** 18+ or 20+
- **npm** or **yarn**

#### For Backend
- **Java 21** (JDK)
- **Maven 3.6+**
- **MySQL 8.0+**
- **Chrome/Chromium** (for web scraping)

#### For AI Services
- **Python 3.10+**
- **Ollama** (for LLM)
- **CUDA** (optional, for GPU acceleration)

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/HaiTranThanh203/SEP490_Gr66_SkillGapGuide.git
cd SEP490_Gr66_SkillGapGuide
```

#### 2. Database Setup
```bash
# Create database
mysql -u root -p
CREATE DATABASE skill_gap_guide;

# Import schema and seed data
mysql -u root -p skill_gap_guide < database.sql
mysql -u root -p skill_gap_guide < rawdatafornghe.sql
```

#### 3. Backend Setup
```bash
cd sgg

# Configure application.properties
cp src/main/resources/application.properties.example src/main/resources/application.properties
# Edit database credentials and other settings

# Build and run
./mvnw clean install
./mvnw spring-boot:run
```

Backend will run on `http://localhost:8080`

#### 4. Frontend Setup
```bash
cd Client

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend will run on `http://localhost:5173`

#### 5. AI Services Setup (Optional but Recommended)

See detailed instructions in:
- [`deploy/setup-llm.md`](deploy/setup-llm.md) - LLM setup with Ollama
- [`deploy/install_lib.md`](deploy/install_lib.md) - Python embedding service setup

```bash
# Quick start for embedding service
cd sgg/src/main/java/com/skillgapguide/sgg/Controller/
pip3 install fastapi uvicorn sentence-transformers pydantic
python3 EmbeddingBGEM3.py
```

Service will run on `http://localhost:8000`

## 📚 API Documentation

Once the backend is running, access the Swagger UI documentation:
```
http://localhost:8080/swagger-ui/index.html
```

### Key Endpoints

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

#### CV & Job Description
- `POST /api/cv/upload` - Upload CV (PDF/DOCX)
- `POST /api/job/upload` - Upload job descriptions
- `GET /api/cv/skills` - Get extracted CV skills
- `POST /api/job/analyze` - Analyze job requirements

#### Analysis & Recommendations
- `GET /api/analysis/skill-gap` - Get skill gap analysis
- `GET /api/matching/jobs` - Get matching jobs
- `GET /api/courses/suggested` - Get course recommendations

#### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `GET /api/user/subscription` - Get subscription info

#### Admin
- `GET /api/admin/users` - Manage users
- `GET /api/admin/feedback` - View feedback
- `PUT /api/admin/pricing` - Update pricing plans

## 🔐 Environment Variables

### Backend (`sgg/src/main/resources/application.properties`)
```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/skill_gap_guide
spring.datasource.username=your_username
spring.datasource.password=your_password

# JWT
jwt.secret=your_jwt_secret_key
jwt.expiration=86400000

# File Upload
file.upload-dir=./uploads

# AI Services
ollama.api.url=http://localhost:11434
embedding.api.url=http://localhost:8000
```

### Frontend (`Client/.env`)
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

## 👥 User Roles

### Guest (Free Tier)
- Upload CV
- View extracted skills
- Basic skill analysis

### Registered User
- Full CV & JD analysis
- Job matching
- Course recommendations
- Save favorites

### Premium User
- All registered features
- Progress tracking
- Advanced analytics
- Priority support

### Admin
- User management
- Content management (About Us, Pricing)
- Feedback monitoring
- System analytics

### Finance
- Payment management
- Revenue dashboard
- Transaction monitoring

## 🎨 Key Features Breakdown

### 1. CV Upload & Analysis
- **Supported formats**: PDF, DOCX
- **File size limit**: 2MB per file (up to 5 files)
- **AI extraction**: Automatically identifies skills, experience, education
- **Preview**: Real-time PDF preview in browser

Implementation: [`Client/src/pages/user/CVUploadOptions.jsx`](Client/src/pages/user/CVUploadOptions.jsx)

### 2. Job Description Processing
Three input methods:
- Upload JD files (PDF/DOCX)
- Paste job description text
- Import from TopCV links (web scraping)

Implementation: [`sgg/src/main/java/com/skillgapguide/sgg/Service/JobService.java`](sgg/src/main/java/com/skillgapguide/sgg/Service/JobService.java)

### 3. Skill Gap Analysis
- AI-powered comparison between CV skills and job requirements
- Visual gap indicators (pie charts, progress bars)
- Detailed skill breakdown by category
- Personalized improvement suggestions

Implementation: [`Client/src/pages/user/AddCVWriteJobDescription.jsx`](Client/src/pages/user/AddCVWriteJobDescription.jsx)

### 4. Course Recommendations
- Curated from Coursera, Udemy, and other platforms
- Filtered by skill gaps and career goals
- Rating and provider information
- Direct enrollment links

Implementation: [`Client/src/pages/user/SuggestedCourses.jsx`](Client/src/pages/user/SuggestedCourses.jsx)

### 5. Subscription Management
Three tiers:
- **Free**: Basic CV analysis
- **Standard**: Full job matching and courses (2,000,000 VND/year)
- **Premium**: All features + progress tracking (10,000,000 VND/year)

Payment integration: VNPay
Implementation: [`Client/src/pages/user/ServicePayment.jsx`](Client/src/pages/user/ServicePayment.jsx)

## 📊 Admin Dashboard

Accessible at `/admin/dashboard`

Features:
- **Analytics**: User growth, revenue metrics, payment trends
- **User Management**: View, edit, deactivate users
- **Content Management**: Edit About Us, Terms of Service
- **Pricing Control**: Adjust subscription plans
- **Feedback Monitoring**: Review user ratings and comments

Implementation: [`Client/src/pages/admin/AdminDashboard.jsx`](Client/src/pages/admin/AdminDashboard.jsx)

## 🧪 Testing

### Frontend
```bash
cd Client
npm run lint
```

### Backend
```bash
cd sgg
./mvnw test
```

## 📦 Build for Production

### Frontend
```bash
cd Client
npm run build
# Output: dist/ folder
```

### Backend
```bash
cd sgg
./mvnw clean package
# Output: target/sgg-0.0.1-SNAPSHOT.jar
```

## 🚢 Deployment

Detailed deployment instructions are available in:
- [`deploy/RUN_INSTRUCTIONS.md`](deploy/RUN_INSTRUCTIONS.md)
- [`deploy/quickly-setup-sh-file.md`](deploy/quickly-setup-sh-file.md)

### Quick Deployment Checklist
1. Set up MySQL database
2. Configure environment variables
3. Deploy backend JAR file
4. Deploy frontend static files (Nginx/Apache)
5. Set up AI services (Ollama + Python embedding)
6. Configure HTTPS (Let's Encrypt/Cloudflare)
7. Set up reverse proxy for backend API

## 🤝 Contributing

This is an academic project (SEP490) developed by Group 66. 

## 📄 License

This project is developed as part of FPT University's Software Engineering Project (SEP490).

## 👨‍💻 Development Team

**Group 66 - FPT University**

## 📞 Contact & Support

For support or inquiries:
- **Phone**: 559282 - 978 (as configured in [`Client/src/pages/Home.jsx`](Client/src/pages/Home.jsx))
- **Email**: Support available through the platform
- **Feedback**: In-app rating system at [`/servicerating`](Client/src/pages/user/ServiceRating.jsx)

## 📖 Additional Documentation

- [Installation Library Guide](deploy/install_lib.md)
- [LLM Setup Guide](deploy/setup-llm.md)
- [Run Instructions](deploy/RUN_INSTRUCTIONS.md)
- [Database Initialization](deploy/init_db.md)

---

**Built with ❤️ by FPT University Students**

*"Bridging the gap between education and employment"*

