# 💰 Personal Finance Management Web App

A full-stack **MERN Personal Finance Management Application** that helps users track expenses and income, visualize spending patterns, manage budgets, receive alerts, get AI-based budget recommendations, and add expenses using **voice commands**.

This project is designed with **clean architecture, scalability, and real-world use cases** in mind.


## 🚀 Features

### 🔐 Authentication
- Secure user registration & login
- JWT-based authentication
- Protected routes

### 💸 Expense & Income Tracking
- Add, view, and delete expenses
- Add and manage income sources
- Category-wise transaction tracking
- Date-based filtering

### 📊 Dashboard Analytics
- Monthly income vs expense summary
- Category-wise expense breakdown
- Savings calculation
- Interactive charts and summary cards

### 🎯 Budget Management & Alerts
- Set category-wise monthly budgets
- Automatic budget comparison
- Alerts when spending exceeds budget

### 🤖 AI Budget Suggestions
- Smart budget recommendations based on:
  - Past spending behavior
  - 50-30-20 budgeting rule
- Personalized insights for better financial planning

### 🎙️ Voice-Based Expense Entry
- Add expenses using voice commands
- Converts speech → text → structured expense
- Example: *“Spent 200 rupees on food”*


## 🧠 Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- React Router
- Context API
- Chart libraries

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication



## 🔄 Application Workflow


User Action
->
Frontend (React)
->
API Request
->
Backend (Express)
->
Business Logic (Services)
->
MongoDB
->
Response
->
UI Update




## 🤖 AI Budget Recommendation Flow


User Transactions
->
Analytics Service
->
AI Budget Logic
->
Recommended Budget
->
Insights Display



## ⚙️ Environment Variables

Create a `.env` file inside the `backend` folder:


PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret



## ▶️ Getting Started

### 1️⃣ Clone the Repository

git clone https://github.com/kajalrajput18/personal-finance-app.git

cd personal-finance-app


### 2️⃣ Backend Setup

cd backend
npm install
npm run dev


### 3️⃣ Frontend Setup

cd frontend/personal-finance-app
npm install
npm run dev



## 🧪 Validation Checklist

- User authentication works correctly
- Expenses & income persist in database
- Dashboard updates dynamically
- Budget alerts trigger correctly
- AI recommendations adapt to user data
- Voice expense entry functions smoothly



## 📈 Future Enhancements
- PDF monthly reports
- Recurring expenses
- Expense receipt OCR
- Email notifications
- Mobile app version


## 💡 Why This Project?
This project demonstrates:
- Real-world MERN stack architecture
- Clean separation of concerns
- Practical use of AI logic (rule-based)
- Modern UI/UX patterns
- Voice integration using browser APIs


## 👨‍💻 Author
**Kajal**

If you found this project helpful, feel free to ⭐ the repository
