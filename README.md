# Classroom

A modern, AI-powered virtual learning platform for students and educators.  
Live: [https://classroom-3ymf.vercel.app/](https://classroom-3ymf.vercel.app/)  
GitHub: [Azmaininqiad/Classroom](https://github.com/Azmaininqiad/Classroom)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Usage](#usage)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**Classroom** is a next-generation virtual classroom platform designed to enhance online education through AI, collaboration, and modern web technologies. It enables students and teachers to interact, manage courses, generate quizzes, and more—all in a secure, user-friendly environment.

---

## Features

- **AI-Powered Learning**: Personalized learning paths and AI-driven evaluation.
- **Collaborative Environment**: Real-time collaboration between students and teachers.
- **Goal-Oriented Progress**: Set and track learning goals with analytics and progress reports.
- **Lightning Fast**: Optimized for performance and smooth user experience.
- **Global Community**: Connect with users worldwide.
- **Secure & Private**: Enterprise-grade security and privacy.
- **Course Creation**: Teachers can create and manage courses.
- **MCQ Generation**: AI-assisted quiz and MCQ generation.
- **Live Teacher Chatbot**: AI-powered chatbot for instant help.
- **Event Management**: Organize and join educational events.
- **Assignment & File Sharing**: Streamlined workflow for assignments and resources.
- **User Profiles**: Customizable profiles for students and teachers.

---

## Project Structure

```
/app
  /chatbot         # AI chatbot and live teacher features
  /classroom       # Classroom pages and management
  /coursepage      # Course creation and management
  /dashboard       # User dashboard
  /events          # Event management
  /mcqgeneration   # MCQ/quiz generation
  /profile         # User profiles
  /realtimetest    # Real-time exam features
/components        # Reusable UI and dialog components
/hooks             # Custom React hooks
/lib               # Utility and backend integration (auth, AI, storage, etc.)
/supabase          # Database migrations and schema
/public            # Static assets
```

---

## Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Azmaininqiad/Classroom.git
   cd Classroom
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env.local` and fill in your Supabase and other API keys.

4. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open in your browser:**
   ```
   http://localhost:3000
   ```

---

## Usage

- **Sign Up / Sign In**: Create an account or log in to access the dashboard.
- **Dashboard**: View your courses, events, and progress.
- **Create Courses**: Teachers can create and manage courses.
- **Join Classrooms**: Students can join classrooms using invite codes.
- **Generate MCQs**: Use the AI-powered tool to generate quizzes.
- **Live Chatbot**: Get instant help from the AI teacher.
- **Events**: Browse and join educational events.
- **Assignments**: Submit and review assignments.
- **Profile**: Customize your user profile.

---

## Deployment

The project is deployed on [Vercel](https://vercel.com/):

- Push to the `main` branch to trigger automatic deployment.
- Ensure environment variables are set in the Vercel dashboard.

---

## Contributing

Contributions are welcome! Please open issues and pull requests on [GitHub](https://github.com/Azmaininqiad/Classroom).

---

## License

This project is licensed under the MIT License.

