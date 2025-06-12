# PdfMind

PdfMind is a full-stack AI-powered PDF analysis tool that enables users to upload PDF documents, analyze their content, and interact with an intelligent chatbot to extract insights or ask questions about the document. The project uses Node.js, Express, React, TypeScript, Tailwind CSS, and shadcn-ui.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **User Authentication:** Secure login and registration system.
- **PDF Upload:** Upload PDF files for analysis.
- **AI Chatbot:** Interact with an AI chatbot to ask questions about the uploaded PDF.
- **Document Analysis:** Extract and summarize content from PDFs.
- **Responsive UI:** Modern, mobile-friendly interface.
- **Persistent Sessions:** User sessions managed securely.

---

## Tech Stack

**Frontend:**
- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn-ui

**Backend:**
- Node.js
- Express
- Mongoose (MongoDB)
- JWT (authentication)
- multer (file uploads)
- OpenAI API (AI chatbot)

---

## Project Structure

```
AIPdfAnalysis/
│
├── backend/
│   ├── .env
│   ├── index.js
│   ├── package.json
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   └── routes/
│
├── frontend/
│   ├── .env
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.ts
│   ├── vite.config.ts
│   ├── public/
│   └── src/
│       ├── pages/
│       └── ...
│
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- MongoDB instance

---

### Backend Setup

1. Navigate to the backend directory:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Configure environment variables:
   - Copy `.env.example` to `.env` and fill in your MongoDB URI, JWT secret, and OpenAI API key.
4. Start the backend server:
   ```sh
   npm start
   ```
   The backend runs on `http://localhost:5000` by default.

---

### Frontend Setup

1. Navigate to the frontend directory:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Configure environment variables:
   - Copy `.env.example` to `.env` and set the backend API URL.
4. Start the frontend development server:
   ```sh
   npm run dev
   ```
   The frontend runs on `http://localhost:5173` by default.

---

## Usage

1. Register or log in to your account.
2. Upload a PDF document.
3. Interact with the AI chatbot to ask questions or request summaries about your document.
4. View extracted information and chat history.

---

## API Endpoints

### Authentication

- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login and receive JWT

### PDF Upload & Analysis

- `POST /api/upload/pdf` — Upload a PDF file
- `GET /api/upload/pdf/:id` — Get PDF info by ID

### Chatbot

- `POST /api/chatbot/ask` — Ask a question about the uploaded PDF

---

## Deployment

You can deploy PdfMind using any cloud provider or platform that supports Node.js and static site hosting (e.g., Vercel, Netlify, Heroku, Render).

**To deploy manually:**
1. Build the frontend:
   ```sh
   cd frontend
   npm run build
   ```
2. Serve the build output and run the backend as described above.

---

## Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements or bug fixes.

---

## License

This project is licensed under the MIT License.

---

## Acknowledgements

- [OpenAI](https://openai.com/) for the AI API
- [shadcn-ui](https://ui.shadcn.com/) for UI components

---