# Quiz App

A modern React-based quiz application that allows users to create, edit, and take quizzes with various question types and customizable layouts.

## Features

- 📝 Create and edit quizzes with a drag-and-drop interface
- 💫 Multiple question types support:
  - Single choice
  - Multiple choice
  - Text answers
- 🎨 Customizable UI elements:
  - Headers
  - Buttons
  - Footers
- 💾 Local storage persistence
- 📱 Responsive design
- 🎯 Real-time preview

## Tech Stack

- React
- TypeScript
- Vite
- React Router DOM
- TailwindCSS
- clsx (for conditional styling)

## Screenshots

### Quiz Editor

![Quiz Editor](./screenshots/main.png)

### Quiz Taking Interface

![Quiz View](./screenshots/view.png)

### Quiz Create

![Quiz create](./screenshots/create.png)

### Quiz Edit

![Quiz edit](./screenshots/edit.png)

## Getting Started

1. Clone the repository

```bash
git clone <repository-url>
```

2. Install dependencies

```bash
cd quiz_app
npm install
```

3. Run the development server

```bash
npm run dev
```

## Key Components

### QuizEditor

- Drag-and-drop interface for quiz creation
- Real-time preview
- Properties panel for block customization
- Building blocks sidebar

### QuizView

- Interactive quiz-taking interface
- Support for different question types
- Progress tracking
- Responsive design

### Quiz Storage

- Local storage-based persistence
- CRUD operations for quizzes
