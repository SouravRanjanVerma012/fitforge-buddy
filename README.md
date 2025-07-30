# FitBuddy

Your AI-powered fitness companion for smart workout tracking, analytics, and community engagement.

---

## 🚀 Setup & Development

1. **Clone the repo:**
   ```sh
   git clone https://github.com/your-org/fitbuddy.git
   cd fitbuddy
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Start the dev server:**
```sh
npm run dev
```
4. **Run backend (if separate):**
   - See backend/README.md for instructions.

---

## 🏗️ Build & Deployment

- **Build for production:**
  ```sh
  npm run build
  ```
- **Preview production build:**
  ```sh
  npm run preview
  ```
- **Deploy:**
  - Use Vercel, Netlify, or your own server.
  - See `.github/workflows/ci.yml` for CI/CD pipeline.

---

## ⚙️ Environment Variables

- `VITE_API_URL` — Base URL for backend API
- `VITE_SENTRY_DSN` — Sentry DSN for error monitoring
- (Add more as needed)

---

## 🔗 API Endpoints

- `/api/login` — User authentication
- `/api/workouts` — Workout CRUD
- `/api/leaderboard` — Leaderboard data
- `/api/challenges` — Challenges data
- `/api/friends` — Friends and requests
- `/api/recommendation` — AI/ML recommendations
- `/api/admin/stats` — Admin stats
- `/api/feedback` — User feedback
- (See `API.md` for full docs)

---

## 🧪 Testing

- **Unit/Integration:**
  ```sh
  npm run test
  ```
- **E2E (Cypress):**
  ```sh
  npx cypress open
  ```
- **Accessibility Audit:**
  ```sh
  node scripts/a11y-audit.js
  ```
- **Performance Audit (Lighthouse):**
  ```sh
  bash scripts/lighthouse-audit.sh
  ```

---

## 🛠️ CI/CD

- Automated via GitHub Actions (`.github/workflows/ci.yml`)
- Runs lint, test, e2e, build, and deploy steps

---

## 💬 Feedback & Help

- Use the in-app Feedback button (bottom right)
- Or email: support@fitbuddy.com
- See the [Help & FAQ](/help) page

---

## 🤝 Contributing

- Fork the repo and create a feature branch
- Open a pull request with a clear description
- Run all tests before submitting
- See `CONTRIBUTING.md` for more

---

## 📖 API Documentation (Placeholder)

See `API.md` for detailed API docs (to be completed).

---

**FitBuddy** © 2025. All rights reserved.
