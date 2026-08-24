# Logistics Routing System

A full-stack logistics and delivery management platform with a **React Native mobile application** and a **Node.js/Express backend**.

The system is designed to support delivery operations from assignment and acceptance through route tracking and completion.

## 🚀 Overview

The project consists of two main applications:

* **Mobile** — React Native application built with Expo and TypeScript.
* **Backend** — Node.js and Express REST API backed by MongoDB.

```text
logistics-routing-system/
│
├── mobile/       # React Native + Expo + TypeScript
│
└── backend/      # Node.js + Express + MongoDB
```

## 🛠️ Technology Stack

### Mobile

* React Native
* Expo
* TypeScript
* Expo Router
* Redux Toolkit
* NativeWind
* React Native Maps
* REST API integration

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* REST APIs
* Middleware-based architecture

### Development Tools

* Git
* GitHub
* npm
* Postman
* VS Code

## 📱 Mobile Application

The mobile application provides delivery workflows for users and drivers.

### Driver Workflow

The driver delivery workflow includes:

```text
Driver Dashboard
       ↓
Assigned Delivery
       ↓
Delivery Details
       ↓
Accept Delivery
       ↓
Start Delivery
       ↓
Track Delivery
       ↓
Complete Delivery
```

### Delivery Management

Drivers can:

* View assigned deliveries
* View pickup and delivery locations
* Accept deliveries
* Start deliveries
* Update delivery location
* View route information
* Complete deliveries
* Track delivery status

## 🗺️ Maps & Routing

The application integrates map and location functionality for delivery operations.

Delivery data can include:

* Pickup location
* Delivery location
* Current driver location
* Route geometry
* Distance
* Estimated travel time

Route information is displayed on the mobile map to help drivers understand the delivery path.

## 🔌 Backend API

The backend provides REST APIs for authentication, users, deliveries, and delivery operations.

### Driver Delivery Endpoints

```text
GET    /api/deliveries/driver
PUT    /api/deliveries/:id/accept
PUT    /api/deliveries/:id/start
PUT    /api/deliveries/:id/location
PUT    /api/deliveries/:id/complete
```

The mobile application communicates with these endpoints to retrieve and update delivery information.

## 🧠 State Management

The mobile application uses **Redux Toolkit** to manage application state and asynchronous API operations.

Delivery state includes operations such as:

* Fetching driver deliveries
* Accepting deliveries
* Starting deliveries
* Updating delivery locations
* Completing deliveries
* Handling loading and error states

## 🔐 Authentication

The system uses authenticated API requests and role-based workflows.

The application supports different user roles and provides role-specific functionality for delivery operations.

## 📂 Project Structure

### Mobile

```text
mobile/
├── app/
├── components/
├── hooks/
├── services/
├── store/
├── types/
├── assets/
├── app.json
├── babel.config.js
├── metro.config.cjs
├── package.json
└── tsconfig.json
```

### Backend

```text
backend/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── seed/
├── services/
├── utils/
├── server.js
└── package.json
```

The project uses a modular structure to separate application logic, API services, database models, middleware, routes, and reusable mobile components.

## ⚙️ Getting Started

### Clone the repository

```bash
git clone https://github.com/dubagari/logistics-routing-system.git
```

```bash
cd logistics-routing-system
```

## 📱 Run the Mobile Application

```bash
cd mobile
npm install
npx expo start
```

You can then run the application using an Android emulator, iOS simulator, or a compatible Expo development environment.

## 🖥️ Run the Backend

Open another terminal:

```bash
cd backend
npm install
```

Start the backend:

```bash
npm run dev
```

If the project uses a different backend start command in the current configuration, use the script defined in `backend/package.json`.

## 🔑 Environment Variables

The mobile and backend applications use environment configuration for values such as API URLs, database configuration, authentication secrets, and other private settings.

Example:

```env
EXPO_PUBLIC_API_URL=your_api_url
```

Never commit private API keys, database credentials, JWT secrets, or other sensitive information to GitHub.

## 🚧 Project Status

**Active Development**

The logistics platform is currently being developed with additional delivery, routing, tracking, and mobile functionality being added.

## 🎯 What This Project Demonstrates

This project demonstrates practical experience with:

* React Native mobile development
* Expo
* TypeScript
* Redux Toolkit
* REST API integration
* Node.js and Express
* MongoDB and Mongoose
* Authentication
* Maps and geolocation
* Delivery management workflows
* Route and location data
* Modular application architecture
* Full-stack application development

## 👨‍💻 Author

**Abubakar Dubagari Abdullahi**

Full-Stack & Mobile Product Engineer

* GitHub: https://github.com/dubagari
* LinkedIn: https://www.linkedin.com/in/abubakar-dubagari-018023189/

## 📄 License

This project is currently intended as a portfolio and development project.
