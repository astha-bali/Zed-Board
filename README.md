# ZedBoard

ZedBoard is a modern, full-stack, Jira-style project management tool built from the ground up to help engineering teams track software development life cycles (SDLC). It features a beautiful, dynamic Kanban board, deep team analytics, role-based access control, and seamless issue tracking.

![Tech Stack](https://img.shields.io/badge/Stack-MERN-blue?style=flat-square&logo=react)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## Features

- **Kanban Boards with Drag & Drop**: Intuitively manage issues through your development pipeline (Todo, In Progress, Code Review, Testing, Done) using fluid drag-and-drop interactions.
- **Deep Analytics & Leaderboards**: Track team velocity, individual story point completion rates, and sprint burndowns directly from the dashboard. Admins get an overall view of the entire organization's performance.
- **Advanced Role-Based Access Control (RBAC)**: Strict server-enforced permissions. Differentiate between Global Admins, Project Managers, Standard Members, and QA testers. 
- **Global Issue Search**: Press `/` or use the top navigation bar to instantly search across all projects with debounced autocomplete results.
- **Story Point Targeting**: Admins can set specific point targets for members over sprints, weeks, or quarters, and the system automatically calculates completion percentages.
- **Project-Specific Sandboxing**: Users only see issues, sprints, and analytics for the projects they are explicitly added to. 
- **Modern, Premium UI**: Built with a sleek dark mode, vibrant accent colors, and custom glassmorphism effects.

## 🛠️ Technology Stack

**Frontend (Client)**
- React 19 + Vite
- React Router DOM (v7)
- `@hello-pangea/dnd` for smooth Drag & Drop
- `recharts` for dynamic data visualizations
- `lucide-react` for premium iconography
- Vanilla CSS with a global variable design system

**Backend (Server)**
- Node.js & Express.js
- MongoDB with Mongoose ORM
- JWT (JSON Web Tokens) for secure, stateless authentication
- `bcryptjs` for password hashing
- Modular RESTful API architecture

## 🚀 Getting Started Locally

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) and [MongoDB](https://www.mongodb.com/try/download/community) (or a MongoDB Atlas URI) installed on your machine.

### 1. Clone the repository
```bash
git clone https://github.com/your-username/zedboard.git
cd zedboard
```

### 2. Setup the Backend
Open a terminal and navigate to the server folder:
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory and add the following:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/zedboard
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```
*Note: If using MongoDB Atlas, replace the `MONGODB_URI`.*

Start the backend server:
```bash
npm run dev
```

### 3. Setup the Frontend
Open a **new** terminal tab and navigate to the client folder:
```bash
cd client
npm install
```

Start the Vite development server:
```bash
npm run dev
```

Your app should now be running! Open your browser and navigate to `http://localhost:5173`. 
*(Note: The very first user to register is historically handled as an admin depending on configuration, or you can adjust roles directly in your MongoDB database to bootstrap your first Global Admin).*

## ☁️ Deployment

ZedBoard is designed to be easily deployed as a Monorepo on modern cloud platforms like **Railway** or **Render**.

1. **Deploying the Backend**: Point your host to the `/server` root directory. Ensure you set your `MONGODB_URI` and `JWT_SECRET` environment variables. 
2. **Deploying the Frontend**: Point your host to the `/client` root directory. Ensure you set `VITE_API_URL` to your live backend domain (e.g., `https://api.yourdomain.com/api`). The `package.json` contains a specific `serve` start script for static hosting compatibility.

## 🤝 Contributing
Contributions are always welcome! Whether it's a bug report, a new feature suggestion, or a pull request, feel free to open an issue and jump in.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License
Distributed under the MIT License. See `LICENSE` for more information.
