# CompileHub

A full-stack code compilation and execution platform with user authentication.

## Features

- User authentication (signup/login)
- Code editor with Monaco Editor
- Multi-language code compilation and execution
- Code history and management
- PDF export functionality

## Tech Stack

**Frontend:**
- React 19
- Vite
- TailwindCSS
- Monaco Editor
- React Router
- Axios

**Backend:**
- Node.js
- Express
- MongoDB (Mongoose)
- JWT Authentication
- bcryptjs

## Installation

### Prerequisites
- Node.js >= 18.0.0
- MongoDB

### Setup

1. Clone the repository
```bash
git clone <repository-url>
cd CompileHub
```

2. Install dependencies
```bash
npm install
cd client && npm install
cd ../backend && npm install
```

3. Configure environment variables

Create `.env` files in root, backend, and client directories with required variables.

4. Run the application

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm run build
npm start
```

## Project Structure

```
CompileHub/
├── backend/          # Express server
│   ├── config/       # Database configuration
│   ├── controllers/  # Route controllers
│   ├── models/       # MongoDB models
│   ├── routes/       # API routes
│   └── utils/        # Utility functions
├── client/           # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   └── public/
└── README.md
```

## License

ISC
