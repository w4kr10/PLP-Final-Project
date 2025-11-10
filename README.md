# MC-Aid - Maternal Care & Marketplace Platform

## 📋 Project Overview

**MC-Aid** is a comprehensive healthcare technology platform designed to revolutionize prenatal and postnatal care by creating an integrated ecosystem that connects pregnant mothers with medical professionals, nutrition-safe grocery services, and AI-powered health management tools.

MC-Aid addresses critical gaps in maternal healthcare accessibility, particularly in underserved regions, by leveraging a digital marketplace approach combined with telemedicine and health monitoring capabilities. The platform empowers expectant mothers with real-time health tracking, professional medical consultation, nutritional guidance, and convenient access to pregnancy-safe grocery products—all in one unified application.

---

## 🎯 Core Problem Statement

Pregnant women face multiple challenges:
- **Limited Access**: Difficulty finding qualified healthcare professionals near them
- **Healthcare Gaps**: Lack of consistent prenatal care monitoring and guidance
- **Nutritional Challenges**: Uncertainty about safe food choices and nutritional requirements
- **Communication Barriers**: Difficulty accessing medical professionals for consultations
- **Holistic Care**: No integrated platform combining medical, nutritional, and wellness services

**MC-Aid** solves these problems by creating a unified maternal health marketplace.

---

## ✨ Key Features

### For Pregnant Mothers
- **📊 Health Dashboard**
  - Real-time pregnancy tracking (week by week progress)
  - Health metrics monitoring (blood pressure, weight, blood sugar, heart rate)
  - Trimester-based milestone tracking
  - Symptom tracker and medication management

- **👨‍⚕️ Medical Appointment Management**
  - Browse and book appointments with verified medical professionals
  - Virtual and in-person consultation options
  - Appointment calendar and reminder system
  - Direct doctor communication through chat

- **🛒 Pregnancy-Safe Marketplace**
  - Browse pregnancy-safe grocery products from verified stores
  - Location-based nearby store discovery
  - Real-time order tracking and delivery management
  - Product nutritional information and pregnancy benefits
  - Organic and allergen-filtered shopping

- **🤖 AI-Powered Meal Planner**
  - Personalized meal recommendations based on pregnancy stage
  - Nutritional requirement guidance
  - Dietary restrictions and allergy management
  - AI assistant for pregnancy questions

- **💬 Real-Time Communication**
  - Direct chat with medical professionals
  - AI chatbot for immediate pregnancy guidance
  - WebSocket-enabled live messaging

### For Medical Professionals
- **🏥 Medical Dashboard**
  - Patient list management
  - Appointment scheduling and management
  - Patient health record access and updates
  - Workload analytics and performance metrics
  - Real-time notifications for appointments

### For Grocery Store Owners
- **🏪 Store Management Dashboard**
  - Product inventory management
  - Order management and fulfillment
  - Real-time order tracking
  - Store analytics and sales insights
  - Location-based visibility to nearby mothers

### For Platform Administrators
- **⚙️ Admin Controls**
  - User management and role assignment
  - Verification of medical professionals
  - Store management and approval workflows
  - Platform analytics and monitoring
  - Content and policy management

---

## 🏗️ Project Architecture

### Technology Stack

**Frontend:**
- React 19 with Vite (fast development server)
- Redux Toolkit (state management)
- TailwindCSS + Radix UI (modern component system)
- React Query (data fetching and caching)
- React Router v7 (client-side routing)
- Leaflet + React Leaflet (geospatial mapping)
- Recharts (data visualization)
- Socket.io-client (real-time communication)

**Backend:**
- Node.js + Express 5 (REST API server)
- MongoDB with Mongoose (database)
- Socket.io (WebSocket for real-time features)
- JWT (authentication & authorization)
- Multer (file upload handling)
- Stripe/Mpesa (payment processing)
- Cloudinary (image storage)
- Twilio (SMS notifications)
- Nodemailer (email notifications)
- HuggingFace Inference API (AI assistant)

**Deployment:**
- Frontend: Netlify / Vercel
- Backend: Render / Railway
- Database: MongoDB Atlas (cloud)
- Storage: Cloudinary (images)

---

## 📁 Project Structure

```
MC-Aid
│
├── frontend/                       # React frontend application
│   ├── src/
│   │   ├── api/
│   │   │   └── axiosConfig.js     # API configuration
│   │   │
│   │   ├── components/             # Reusable React components
│   │   │   ├── admin/              # Admin-specific components
│   │   │   ├── appointments/       # Appointment management components
│   │   │   ├── auth/               # Authentication components
│   │   │   ├── chat/               # Chat/messaging components
│   │   │   ├── grocery/            # Grocery management components
│   │   │   ├── layout/             # Layout components
│   │   │   ├── maps/               # Geospatial components
│   │   │   ├── marketplace/        # Marketplace components
│   │   │   ├── medical/            # Medical dashboard components
│   │   │   ├── modals/             # Modal dialogs
│   │   │   ├── notifications/      # Notification components
│   │   │   ├── pregnancy/          # Pregnancy tracking components
│   │   │   ├── stores/             # Store listing components
│   │   │   └── ui/                 # Reusable UI components (buttons, cards, etc.)
│   │   │
│   │   ├── hooks/                  # Custom React hooks
│   │   │   └── use-toast.js        # Toast notification hook
│   │   │
│   │   ├── pages/                  # Page components (full screens)
│   │   │   ├── AdminDashboard/
│   │   │   ├── Auth/              # Login & Register pages
│   │   │   ├── GroceryDashboard/  # Store owner dashboard
│   │   │   ├── MedicalDashboard/  # Doctor dashboard
│   │   │   ├── MotherDashboard/   # Mother's main dashboard
│   │   │   └── Landing.jsx        # Landing page
│   │   │
│   │   ├── redux/                  # Redux state management
│   │   │   ├── slices/             # Redux slices (reducers)
│   │   │   │   ├── adminSlice.js
│   │   │   │   ├── chatSlice.js
│   │   │   │   ├── grocerySlice.js
│   │   │   │   ├── medicalSlice.js
│   │   │   │   ├── notificationSlice.js
│   │   │   │   ├── pregnancySlice.js
│   │   │   │   └── userSlice.js
│   │   │   └── store.js            # Redux store configuration
│   │   │
│   │   ├── lib/
│   │   │   └── utils.js            # Utility functions
│   │   │
│   │   ├── App.jsx                 # Main App component with routing
│   │   ├── main.jsx                # React entry point
│   │   ├── index.css               # Global styles
│   │   └── App.css                 # App-level styles
│   │
│   ├── package.json                # Frontend dependencies
│   ├── vite.config.js              # Vite configuration
│   ├── tailwind.config.js          # TailwindCSS configuration
│   ├── eslint.config.js            # ESLint configuration
│   └── index.html                  # HTML entry point
│
├── server/                         # Node/Express backend
│   ├── src/
│   │   ├── config/                 # Configuration files
│   │   │   ├── db.js              # MongoDB connection
│   │   │   ├── cloudinary.js      # Cloudinary setup
│   │   │   └── stripe.js          # Stripe setup
│   │   │
│   │   ├── controllers/            # Request handlers (business logic)
│   │   │   ├── adminController.js
│   │   │   ├── aiController.js     # AI assistant logic
│   │   │   ├── authController.js   # Authentication logic
│   │   │   ├── chatController.js   # Chat message handling
│   │   │   ├── groceryController.js
│   │   │   ├── medicalController.js
│   │   │   └── motherController.js
│   │   │
│   │   ├── middleware/             # Express middleware
│   │   │   ├── authMiddleware.js   # JWT verification
│   │   │   └── roleMiddleware.js   # Role-based access control
│   │   │
│   │   ├── models/                 # MongoDB schemas
│   │   │   ├── User.js            # User model (polymorphic)
│   │   │   ├── PregnancyRecord.js # Pregnancy tracking
│   │   │   ├── Appointment.js     # Appointment bookings
│   │   │   ├── ChatMessage.js     # Message storage
│   │   │   ├── GroceryItem.js     # Product catalog
│   │   │   ├── Order.js           # Order tracking
│   │   │   └── Notification.js    # Notification logs
│   │   │
│   │   ├── routes/                 # API routes
│   │   │   ├── authRoutes.js
│   │   │   ├── motherRoutes.js
│   │   │   ├── medicalRoutes.js
│   │   │   ├── groceryRoutes.js
│   │   │   ├── adminRoutes.js
│   │   │   ├── chatRoutes.js
│   │   │   └── aiRoutes.js
│   │   │
│   │   ├── utils/                  # Utility functions
│   │   │   ├── aiAssistant.js     # AI integration logic
│   │   │   ├── emailService.js    # Email notifications
│   │   │   ├── notificationService.js
│   │   │   ├── mpesa.js           # M-Pesa integration
│   │   │   └── verifyDocuments.js # Document verification
│   │   │
│   │   └── server.js               # Express app initialization
│   │
│   ├── package.json                # Backend dependencies
│   └── .env                        # Environment variables
│
├── .env                            # Frontend environment variables
└── README.md                       # This file
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- MongoDB instance (local or MongoDB Atlas)
- Cloudinary account (for image storage)
- Stripe/Mpesa account (for payments)
- HuggingFace API key (for AI features)
- Twilio account (for SMS notifications)

### Installation

#### 1. Clone and Setup Backend
```bash
cd server
npm install
```

Create `.env` file in `server/`:
```
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_KEY=your_cloudinary_key
CLOUDINARY_SECRET=your_cloudinary_secret
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable
HUGGINGFACE_API_KEY=your_huggingface_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE=your_twilio_phone
SENDGRID_API_KEY=your_sendgrid_key
```

#### 2. Setup Frontend
```bash
npm install
```

Create `.env` file in root:
```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### Running Locally

**Backend:**
```bash
cd server
npm run dev        # Development with hot reload
npm start          # Production
```

**Frontend:**
```bash
npm run dev         # Start development server (Vite)
npm run build       # Build for production
npm run preview     # Preview production build
```

Access the app at `http://localhost:5173`

---

## 🌍 UN Sustainable Development Goals (SDGs) Alignment

MC-Aid directly supports and contributes to multiple UN SDGs:

### 🎯 SDG 3: Good Health and Well-being
**Target 3.1: Reduce global maternal mortality**
- Provides 24/7 access to healthcare professionals
- Enables continuous health monitoring during pregnancy
- Facilitates early detection of complications
- Improves healthcare accessibility in underserved regions

**Target 3.7: Ensure universal access to sexual and reproductive health**
- Comprehensive pregnancy care platform
- Professional medical guidance throughout pregnancy
- Appointment accessibility and telemedicine options

### 🎯 SDG 2: Zero Hunger
**Target 2.2: End all forms of hunger and malnutrition**
- Pregnancy-safe nutritional marketplace
- AI-powered personalized meal planning
- Access to nutritious, verified food sources
- Educational content on pregnancy nutrition

### 🎯 SDG 5: Gender Equality
**Target 5.1: End discrimination against women**
- Empowers women with health autonomy
- Provides information and resources for informed decisions
- Creates safe space for maternal health discussions
- Supports women's reproductive rights

### 🎯 SDG 10: Reduced Inequalities
**Target 10.2: Promote social, economic and political inclusion**
- Bridges healthcare access gap in rural/underserved areas
- Location-based service discovery
- Affordable telemedicine alternatives to costly clinic visits
- Democratizes access to pregnancy care information

### 🎯 SDG 9: Industry, Innovation and Infrastructure
**Target 9.2: Promote sustainable industrialization**
- Digital health infrastructure development
- Tech innovation in maternal healthcare
- Creates jobs for medical professionals and store owners
- Supports small business marketplace model

### 🎯 SDG 4: Quality Education
**Target 4.3: Ensure equal access to quality education**
- Pregnancy education through AI assistant
- Health information accessibility
- Professional resources for healthcare providers
- Nutritional education for mothers

---

## 📊 API Endpoints Overview

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Mother Routes
- `GET /api/mother/dashboard` - Mother dashboard data
- `GET /api/mother/pregnancy-record` - Get pregnancy records
- `GET /api/mother/appointments` - Get appointments
- `GET /api/mother/grocery-items` - Browse products
- `GET /api/mother/stores/nearby` - Find nearby stores
- `POST /api/mother/orders` - Create order
- `GET /api/mother/orders` - Get orders

### Medical Routes
- `GET /api/medical/dashboard` - Doctor dashboard
- `GET /api/medical/patients` - Get patient list
- `POST /api/medical/appointments` - Create appointment
- `GET /api/medical/appointments` - Get appointments

### Grocery Routes
- `GET /api/grocery/dashboard` - Store dashboard
- `GET /api/grocery/inventory` - Get store inventory
- `POST /api/grocery/inventory` - Add product
- `GET /api/grocery/orders` - Get store orders
- `PUT /api/grocery/orders/:id` - Update order status

### AI Routes
- `POST /api/ai/chat` - Send message to AI
- `GET /api/ai/suggestions` - Get AI suggestions

### Chat Routes
- `POST /api/chat/messages` - Send message
- `GET /api/chat/messages` - Get messages
- `POST /api/chat/rooms` - Create chat room

---

## 🔐 Authentication & Security

- **JWT-based authentication** with secure token storage
- **Role-based access control** (RBAC) with 4 user roles: mother, medical, grocery, admin
- **Password hashing** with bcryptjs
- **CORS protection** for cross-origin requests
- **Rate limiting** to prevent abuse (100 requests per 15 minutes)
- **Helmet.js** for security headers
- **Document verification** for medical professionals

---

## 🗄️ Database Models

### User (Polymorphic)
Multi-role user model supporting: mother, medical professional, grocery store, admin

### PregnancyRecord
Comprehensive pregnancy tracking with health metrics, symptoms, medications, appointments

### Appointment
Appointment scheduling with status tracking, reminders, and virtual/physical options

### GroceryItem
Product catalog with nutritional information, pregnancy safety ratings, allergen info

### Order
Order management with status tracking, delivery estimation, and real-time updates

### ChatMessage
Message storage for real-time communication between users and AI

---

## 📱 Real-Time Features (WebSocket)

- Live appointment notifications
- Real-time order status updates
- Chat messaging with instant delivery
- User presence tracking
- Notification broadcasting

---

## 🎨 UI/UX Components

Built with Radix UI and TailwindCSS for:
- Responsive design (mobile-first)
- Accessible components (WCAG compliant)
- Modern design system
- Dark/light mode ready
- Smooth animations and transitions

---

## 🧪 Testing

Currently uses simple endpoint testing. To run tests:
```bash
npm test
```

---

## 📈 Performance Optimizations

- **Vite** for faster development builds
- **React Query** for efficient data caching
- **Code splitting** for smaller bundle sizes
- **Image optimization** via Cloudinary
- **Compression** middleware for API responses
- **WebSocket** for real-time instead of polling

---

## 🚢 Deployment
https://mcaid.netlify.app/

<img width="1864" height="944" alt="image" src="https://github.com/user-attachments/assets/4dc674f2-49a2-46bf-9f05-bd2ca15660b9" />

Grocery Dashboard
<img width="1417" height="765" alt="image" src="https://github.com/user-attachments/assets/ca825eb2-d07c-40b4-8bf7-f176fc9a24d3" />

Medical Personnel Dashboard
<img width="1554" height="815" alt="image" src="https://github.com/user-attachments/assets/5fd5112d-cf6e-4edf-ac52-65aa62a5dbe7" />


### Database
Used MongoDB Atlas (cloud-hosted) for zero-maintenance database

---

## 📞 Support & Contact

For questions, issues, or collaboration:
- GitHub Issues: [Project Repository]
- Email: mtalin001@gmail.com

---

## 🙏 Acknowledgments

- UN Sustainable Development Goals for guidance
- Open-source community (React, Express, MongoDB, etc.)
- Healthcare professionals who provided domain expertise
- Maternal health advocates for inspiration

---

## 🔮 Future Roadmap

- [ ] Wearable device integration (health tracking)
- [ ] Video consultation capabilities
- [ ] Offline-first mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] ML-based risk prediction models
- [ ] Multi-language support (internationalization)
- [ ] Community forum for mother support groups
- [ ] Integration with national health systems

---

**MC-Aid: Empowering Mothers, Supporting Life** ❤️
