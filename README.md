# Vite + React + Firebase + Material UI Template 🚀

[![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-4+-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-10+-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Material UI](https://img.shields.io/badge/Material%20UI-5+-007FFF?style=for-the-badge&logo=mui&logoColor=white)](https://mui.com/)

A clean and ready-to-use template for bootstrapping React projects with Vite, Firebase (Auth, Firestore, etc.), and Material UI, designed for rapid development.

## ✨ Features

*   **⚡️ Fast Development:** Powered by [Vite](https://vitejs.dev/) for near-instant HMR and optimized builds.
*   **⚛️ Modern React:** Uses React 18+ features.
*   **🔥 Firebase Ready:** Includes Firebase SDK setup. Just add your configuration!
    *   Example initialization for Auth and Firestore included.
    *   Uses environment variables (`.env`) for secure configuration.
*   **🎨 Material UI Integrated:** [Material UI v5+](https://mui.com/) set up with:
    *   Basic Theme Provider.
    *   CSS Baseline for consistency.
*   **Routing (Optional):** [React Router DOM v6+](https://reactrouter.com/) basic setup included (if you added it).
*   **Environment Variables:** Clear separation of configuration using `.env` files (via Vite).
*   **Clean Structure:** Organized folder structure for components, pages, hooks, services, etc.

##  Prerequisites

*   [Node.js](https://nodejs.org/) (LTS version recommended, e.g., v18 or later)
*   [npm](https://www.npmjs.com/), [yarn](https://yarnpkg.com/), or [pnpm](https://pnpm.io/)
*   A [Firebase](https://firebase.google.com/) account

## 🚀 Getting Started

You can use this repository as a GitHub Template to create your own project based on this setup.

1.  **Create a New Repository:**
    *   Click the green "**Use this template**" button on the GitHub repository page.
    *   Select "**Create a new repository**".
    *   Choose an owner, repository name, and visibility (public/private).
    *   Click "**Create repository from template**".

2.  **Clone Your New Repository:**
    ```bash
    git clone https://github.com/scottwelz/vite-react-firebase-mui.git
    cd vite-react-firebase-mui
    ```

3.  **Install Dependencies:**
    ```bash
    npm install
    ```

4.  **Set Up Firebase:**
    *   Go to the [Firebase Console](https://console.firebase.google.com/).
    *   Create a new Firebase project (or use an existing one).
    *   In your project settings, go to **Project settings** > **General**.
    *   Under "Your apps", click the Web icon (`</>`) to add a web app (or select an existing one).
    *   Register the app and find your Firebase SDK configuration snippet (it looks like `firebaseConfig = { ... }`).
    *   **Copy the configuration values.**
    *   In your local project folder, **rename** the `.env.example` file to `.env`:
        ```bash
        cp .env.example .env
        ```
    *   Open the newly created `.env` file.
    *   Paste your Firebase configuration values into the corresponding `VITE_FIREBASE_...` variables:
        ```plaintext
        # .env - Fill this with your *actual* Firebase project keys!
        VITE_FIREBASE_API_KEY=AIzaSy...
        VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
        VITE_FIREBASE_PROJECT_ID=your-project-id
        VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
        VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
        VITE_FIREBASE_APP_ID=1:1234567890:web:abcdef...
        # VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX # Optional: For Google Analytics
        ```
    *   **Important:** The `.env` file is listed in `.gitignore` and should **never** be committed to version control, especially in public repositories.

5.  **Run the Development Server:**
    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```
    Your app should now be running on `http://localhost:5173` (or another port if 5173 is busy).

## 🛠 Available Scripts

*   `dev`: Starts the development server with HMR.
*   `build`: Compiles the app for production into the `dist` folder.
*   `lint`: Lints the codebase (if ESLint is configured).
*   `preview`: Serves the production build locally for previewing.

## 🔒 Environment Variables

Firebase configuration is handled via environment variables loaded by Vite.

*   Create a `.env` file in the root directory (copy from `.env.example`).
*   Add your Firebase project credentials to this file.
*   Only variables prefixed with `VITE_` are exposed to your client-side code.
*   `.env` is ignored by Git (`.gitignore`). **Do not commit your credentials.**

## 📁 Folder Structure (Example)
content_copy
download
Use code with caution.
Markdown
.
├── public/ # Static assets (served directly)
├── src/
│ ├── components/ # Reusable UI components
│ │ ├── ProfileDropdown/ # Components specific to ProfileDropdown
│ │ │ ├── Profile.tsx
│ │ │ └── TabPanel.tsx
│ │ ├── Avatar.tsx
│ │ ├── Layout.tsx # Main application layout structure
│ │ ├── MainCard.tsx # Generic card component
│ │ ├── NotificationDropdown.tsx
│ │ ├── ProtectedRoute.tsx # Wrapper for authenticated routes
│ │ ├── ThemeToggle.tsx # Component to switch themes
│ │ └── Transitions.tsx # Animation/transition components
│ ├── contexts/ # React Context API providers/consumers
│ │ └── AuthContext.tsx # Context for authentication state
│ ├── hooks/ # Custom React Hooks
│ │ └── useAnalytics.ts # Hook for interacting with analytics
│ ├── pages/ # Route-level components (views)
│ │ ├── Dashboard.tsx
│ │ ├── ForgotPassword.tsx
│ │ ├── Login.tsx
│ │ ├── Register.tsx
│ │ └── Settings.tsx
│ ├── services/ # Business logic, API calls, external interactions
│ │ └── notificationService.ts # Logic for handling notifications
│ ├── theme/ # Theme configuration for Material UI
│ │ └── ThemeProvider.tsx # MUI Theme provider setup
│ ├── utils/ # Utility functions
│ │ └── dateUtils.ts # Date formatting/manipulation helpers
│ ├── App.css # Global or App-specific styles
│ ├── App.tsx # Main application component (routing, layout)
│ ├── firebaseConfig.ts # Firebase configuration and initialization
│ ├── index.css # Base global styles (like Tailwind base/MUI reset)
│ └── main.tsx # Application entry point (renders App)
├── .env.example # Example environment variables
├── .eslintrc.cjs # ESLint configuration (if used)
├── .gitignore # Git ignore rules
├── index.html # Main HTML file template
├── package.json # Project dependencies and scripts
├── README.md # This file
└── vite.config.js # Vite configuration

## 📄 License

This template is licensed under the [MIT License](LICENSE). Feel free to use and modify it for your projects. (Consider adding a `LICENSE` file with the MIT license text).


Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
