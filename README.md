# 🌐 Job Board Platform

A **React-based job board platform** that fetches and displays job listings from an external API.
Built with **Framer Motion** for animations, **Tailwind CSS** for styling, and **Context API** for state management.

---

## 🚀 Features
- **Job Listings** – Fetch jobs from a free jobs API with filters and pagination.
- **Pagination** – Navigate multiple pages of results.
- **Search & Filters** – Filter by category, location, and experience level.
- **Responsive Design** – Mobile-friendly UI built with Tailwind CSS.
- **Animations** – Smooth UI interactions powered by Framer Motion.

---

## 🛠 Tech Stack
- **Frontend**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **State Management**: React Context API
- **API**: [Adzuna Jobs API](https://developer.adzuna.com/) / RapidAPI Job APIs
- **Environment Variables**: `.env` for API keys

---

## 📂 Project Structure

```bash
src/

job-board-platform/
├── public/ # Static assets
├── src/ # Source code
│ ├── api/ # API call functions
│ │ └── fetchJobs.ts # Fetch job listings from API
│ ├── components/ # Reusable UI components
│ │ ├── JobCard.tsx # Job listing card UI
│ │ ├── Pagination.tsx # Pagination controls
│ │ ├── SearchBar.tsx # Search input component
│ │ └── Filters.tsx # Filter options UI
│ ├── context/ # Global state management
│ │ └── JobContext.tsx # Context for jobs, filters, pagination
│ ├── pages/ # Page components
│ │ ├── Home.tsx # Homepage
│ │ ├── JobList.tsx # Jobs listing page
│ │ └── JobDetails.tsx # Individual job details page
│ ├── services/ # API integration helpers
│ │ └── jobService.ts # Service to handle job data fetching
│ ├── types/ # TypeScript types
│ │ └── index.ts # Job type definitions
│ ├── App.tsx # Main App component
│ ├── main.tsx # React entry point
│ └── index.css # Global styles (Tailwind CSS)
├── .env # Environment variables (API keys)
├── package.json # Dependencies and scripts
├── tailwind.config.js # Tailwind CSS configuration
├── vite.config.ts # Vite configuration
└── README.md # Project documentation

```

---

## 🔧 Setup Instructions

Follow the steps below to run the project locally:

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/job-board-platform.git
cd job-board-platform
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory and add:

```bash
VITE_API_URL=https://your-api-endpoint.com/jobs
```

Replace with your actual API endpoint.

### 4. Run the Development Server

```bash
npm run dev
```

The app should now be running at `http://localhost:5173` (if using Vite).

---

## 🔄 Features

### ✅ API Integration

* Fetches job listings dynamically from a backend API
* Implements loading and error states to improve user experience

### 🎯 Advanced Filtering System

* Users can filter jobs by:

  * **Category** (e.g., Design, Marketing, Engineering)
  * **Location** (e.g., Remote, Nairobi, London)
  * **Experience Level** (Entry-Level, Mid-Level, Senior)

### 📱 Responsive & Accessible Design

* Fully responsive layout for desktop, tablet, and mobile
* Uses semantic HTML, ARIA labels, and keyboard-accessible components


## 🧠 State Management

The application uses **React Context API** to manage global state:

* Job data
* Filter criteria
* Loading and error states
* Form submission feedback

This ensures scalability and avoids prop drilling.

---

## 📸 Screenshots

| 🏠 Job Listings Page          | 📄 Job Details Page                 | 📝 Application Form             |
| ----------------------------- | ----------------------------------- | ------------------------------- |
| ![home](screenshots/home.png) | ![details](screenshots/details.png) | ![apply](screenshots/apply.png) |

Make sure you add your own screenshots in the `/screenshots` folder.

---

## ⚙️ Deployment Instructions

This project is deployed using [Vercel](https://vercel.com/):

### Steps:

1. Push your project to GitHub
2. Go to [Vercel](https://vercel.com/) and import your repository
3. Set your environment variable `VITE_API_URL`
4. Click Deploy 🎉

---

## ⏾️ Git Commit Workflow

* `feat:` Add new features (e.g., `feat: add job filtering`)
* `fix:` Bug fixes (e.g., `fix: fix mobile layout issue`)
* `style:` UI styling or design updates (e.g., `style: improve job card design`)
* `docs:` Documentation changes (e.g., `docs: update README`)
* `chore:` Build tasks, deployments, or configs (e.g., `chore: deploy to Vercel`)

---

## ✅ Future Enhancements

* Add pagination or infinite scroll
* Save/bookmark favorite jobs
* Admin dashboard for posting/editing jobs
* Authentication for users and employers
* Dark mode toggle
* Progressive Web App (PWA) support

---

## 👤 Author

**Priscilla Wangila**


---

## 📄 License

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.
