# 📝 Pizarra

**Pizarra** is a simple and intuitive notes application where users can create, manage and organize their own personal notes.

Each user can log in to their account and access their own workspace, keeping their notes private and available whenever they need them.

## ✨ Features

- **User Authentication:** Register and log in to access your personal workspace.
- **Personal Notes:** Each user has their own collection of notes.
- **Create Notes:** Add new notes with custom titles and content.
- **Edit Notes:** Update the content of existing notes.
- **Delete Notes:** Remove notes you no longer need.
- **Drag & Drop:** Move notes freely around your workspace.
- **Color Customization:** Choose different colors to organize and personalize your notes.
- **Cloud Storage:** Notes are stored using Firebase Firestore.

## 🛠️ Technologies

- HTML5
- CSS3
- JavaScript
- Firebase Authentication
- Firebase Firestore

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
```

### 2. Enter the project directory

```bash
cd pizarra
```

### 3. Configure Firebase

Create a Firebase project and configure the following services:

- Firebase Authentication
- Cloud Firestore

Add your Firebase configuration to the project.

### 4. Run the application

Open the project using a local development server, such as the VS Code Live Server extension.

## 📂 Project Structure

```text
pizarra/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── firebase.js
│   ├── auth.js
│   ├── notes.js
│   └── movingLogic.js
└── README.md
```

*The structure above is an example and may vary depending on the project implementation.*

## 🔒 Privacy

Pizarra uses Firebase Authentication to identify users and Firestore to store their notes.

Each user should only be able to access and manage their own notes.

## 🎯 Project Goal

The goal of Pizarra is to provide a lightweight and easy-to-use digital workspace that feels like a traditional physical board, allowing users to organize their thoughts freely through customizable notes.

---

**Pizarra — Your ideas, your space.**
