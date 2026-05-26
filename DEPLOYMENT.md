# Deployment Guide

This document covers deployment steps for WriteSpace, including Vercel configuration, SPA rewrite rules, build commands, and troubleshooting tips.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Build Commands](#build-commands)
- [Vercel Deployment](#vercel-deployment)
  - [Automatic Deployment via GitHub](#automatic-deployment-via-github)
  - [Manual Deployment via Vercel CLI](#manual-deployment-via-vercel-cli)
- [vercel.json Configuration](#verceljson-configuration)
- [SPA Rewrite Rules Explained](#spa-rewrite-rules-explained)
- [Environment Variables](#environment-variables)
- [Other Hosting Providers](#other-hosting-providers)
  - [Netlify](#netlify)
  - [GitHub Pages](#github-pages)
  - [Static File Server (Nginx, Apache, etc.)](#static-file-server-nginx-apache-etc)
- [Troubleshooting](#troubleshooting)
  - [404 on Direct URL Access](#404-on-direct-url-access)
  - [Blank Page After Deployment](#blank-page-after-deployment)
  - [Assets Not Loading](#assets-not-loading)
  - [localStorage Not Persisting](#localstorage-not-persisting)

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm, yarn, or pnpm
- A [Vercel](https://vercel.com) account (for Vercel deployment)
- Git repository hosted on GitHub, GitLab, or Bitbucket (for automatic deployments)

---

## Build Commands

| Command             | Description                                  |
| ------------------- | -------------------------------------------- |
| `npm install`       | Install all dependencies                     |
| `npm run dev`       | Start the local development server (port 5173) |
| `npm run build`     | Create a production build in the `dist/` directory |
| `npm run preview`   | Preview the production build locally         |
| `npm test`          | Run all unit tests with Vitest               |

The production build outputs static files to the `dist/` folder. This folder is what gets deployed to any static hosting provider.

---

## Vercel Deployment

### Automatic Deployment via GitHub

1. **Push your code** to a GitHub repository.

2. **Import the project** in the [Vercel Dashboard](https://vercel.com/new):
   - Click **"Add New… → Project"**
   - Select your GitHub repository
   - Vercel will auto-detect the Vite framework

3. **Verify build settings** (Vercel typically auto-detects these):
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

4. **Click Deploy**. Vercel will build and deploy the application.

5. **Subsequent pushes** to the `main` branch will trigger automatic redeployments. Pull requests will generate preview deployments.

### Manual Deployment via Vercel CLI

1. **Install the Vercel CLI globally:**

   ```bash
   npm install -g vercel
   ```

2. **Log in to your Vercel account:**

   ```bash
   vercel login
   ```

3. **Build the project locally:**

   ```bash
   npm run build
   ```

4. **Deploy from the project root:**

   ```bash
   vercel --prod
   ```

   The CLI will prompt you to confirm the project settings on the first run. Accept the defaults or adjust as needed.

---

## vercel.json Configuration

The project includes a `vercel.json` file at the repository root:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### What This Does

- **`rewrites`** — Defines URL rewrite rules that Vercel applies at the edge (CDN level) before serving a response.
- **`"source": "/(.*)"` ** — A regex pattern that matches every incoming request path.
- **`"destination": "/index.html"`** — Rewrites all matched requests to serve `index.html`, the single entry point of the React application.

### Why This Is Needed

WriteSpace is a **Single Page Application (SPA)**. All routing is handled client-side by React Router. When a user navigates to `/blogs` or `/admin/users`, the browser sends a request for that path to the server. Without rewrite rules, the server would look for a file at that path, fail to find one, and return a **404 error**.

The rewrite rule ensures that every request — regardless of the URL path — serves `index.html`. Once the HTML loads, React Router reads the URL and renders the correct page component.

---

## SPA Rewrite Rules Explained

### The Problem

In a traditional multi-page application, each URL corresponds to a physical file on the server:

```
/about.html  →  serves about.html
/contact.html  →  serves contact.html
```

In an SPA, there is only one HTML file (`index.html`). All "pages" are rendered dynamically by JavaScript:

```
/blogs       →  no blogs.html exists  →  404 without rewrites
/blog/p_123  →  no blog/p_123.html exists  →  404 without rewrites
/admin       →  no admin.html exists  →  404 without rewrites
```

### The Solution

Rewrite rules tell the hosting provider to serve `index.html` for all paths that do not match a static file (JS, CSS, images, etc.):

```
/blogs       →  rewritten to /index.html  →  React Router renders Home
/blog/p_123  →  rewritten to /index.html  →  React Router renders ReadBlog
/admin       →  rewritten to /index.html  →  React Router renders AdminDashboard
```

Static assets in the `dist/assets/` directory are served directly because they exist as physical files. The rewrite only applies when no matching file is found.

### Route Map Reference

The following routes are defined in `src/App.jsx` and handled entirely by React Router:

| Path           | Component      | Access Level       |
| -------------- | -------------- | ------------------ |
| `/`            | LandingPage    | Public             |
| `/login`       | LoginPage      | Public             |
| `/register`    | RegisterPage   | Public             |
| `/blogs`       | Home           | Authenticated      |
| `/blog/:id`    | ReadBlog       | Authenticated      |
| `/write`       | WriteBlog      | Authenticated      |
| `/write/:id`   | WriteBlog      | Authenticated      |
| `/admin`       | AdminDashboard | Admin only         |
| `/admin/users` | UserManagement | Admin only         |

All of these routes require the SPA rewrite rule to function when accessed directly via the browser address bar or when the page is refreshed.

---

## Environment Variables

WriteSpace does not currently require any environment variables. All data is stored in the browser's `localStorage`.

If you add environment variables in the future, follow these conventions:

- Prefix all client-side variables with `VITE_` (e.g., `VITE_API_URL`)
- Access them in code via `import.meta.env.VITE_API_URL`
- Add them in the Vercel Dashboard under **Settings → Environment Variables**
- Never commit `.env` files to version control (already excluded in `.gitignore`)

---

## Other Hosting Providers

### Netlify

Create a `netlify.toml` file in the project root (or configure via the Netlify Dashboard):

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Alternatively, create a `_redirects` file inside the `public/` directory:

```
/*    /index.html   200
```

### GitHub Pages

GitHub Pages does not natively support SPA rewrites. Use one of these workarounds:

1. **404.html trick** — Copy `index.html` to `404.html` in the `dist/` folder after building:

   ```bash
   npm run build
   cp dist/index.html dist/404.html
   ```

2. **HashRouter** — Replace `BrowserRouter` with `HashRouter` in `src/App.jsx`. This changes URLs from `/blogs` to `/#/blogs`, which does not require server-side rewrites. Note: this would require a code change.

### Static File Server (Nginx, Apache, etc.)

**Nginx** — Add a `try_files` directive to your server block:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Apache** — Create a `.htaccess` file in the `dist/` directory:

```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

---

## Troubleshooting

### 404 on Direct URL Access

**Symptom:** Navigating to a route like `/blogs` or `/admin` directly in the browser (or refreshing the page) returns a 404 error.

**Cause:** The hosting provider is looking for a physical file at that path instead of serving `index.html`.

**Fix:**
- **Vercel:** Ensure `vercel.json` exists at the project root with the rewrite rule shown above. Redeploy after adding or modifying the file.
- **Other providers:** Add the appropriate SPA fallback/rewrite rule for your hosting provider (see [Other Hosting Providers](#other-hosting-providers) above).

**Verification:** After deploying, open your browser's developer tools (Network tab), navigate directly to a route like `/blogs`, and confirm that the response serves `index.html` with a 200 status code.

### Blank Page After Deployment

**Symptom:** The deployed site shows a blank white page with no content.

**Cause:** This is typically caused by incorrect asset paths or a failed build.

**Fix:**
1. Open the browser's developer console (F12 → Console tab) and check for errors.
2. Check the Network tab for failed resource requests (JS, CSS files returning 404).
3. Ensure the build completed successfully by running `npm run build` locally and checking the `dist/` folder.
4. Verify that the **Output Directory** in your hosting provider is set to `dist` (not `build` or the project root).
5. If using a subdirectory deployment (e.g., `https://example.com/myapp/`), set the `base` option in `vite.config.js`:

   ```js
   export default defineConfig({
     base: '/myapp/',
     plugins: [react()],
   });
   ```

### Assets Not Loading

**Symptom:** The page loads but styles are missing, JavaScript fails to execute, or images do not appear.

**Cause:** Asset paths are incorrect relative to the deployment URL.

**Fix:**
1. Check the `base` option in `vite.config.js`. For root-level deployments, it should be `'/'` (the default). For subdirectory deployments, set it to the subdirectory path.
2. Ensure your hosting provider serves files from the `dist/assets/` directory correctly.
3. Run `npm run preview` locally to test the production build before deploying.

### localStorage Not Persisting

**Symptom:** Data (posts, users, sessions) disappears after closing the browser or navigating away.

**Cause:** This is a browser-level issue, not a deployment issue.

**Possible causes:**
- The browser is in **Private/Incognito mode**, which clears localStorage when the window is closed.
- The browser's storage has been cleared manually or by a cleanup extension.
- The browser has **localStorage disabled** in its privacy settings.
- The site is being accessed from a different domain or subdomain than where the data was originally saved (localStorage is origin-specific).

**Fix:**
- Use a regular (non-incognito) browser window.
- Ensure the deployment URL is consistent (e.g., always use `https://yourapp.vercel.app`, not sometimes with `www.` and sometimes without).
- Check `Application → Local Storage` in the browser's developer tools to verify data is being written.

### Build Failures on Vercel

**Symptom:** The deployment fails during the build step on Vercel.

**Fix:**
1. Check the **build logs** in the Vercel Dashboard for the specific error message.
2. Ensure the project builds successfully locally with `npm run build`.
3. Verify that the **Node.js version** on Vercel matches your local version (v18+). You can set this in Vercel under **Settings → General → Node.js Version**.
4. Ensure all dependencies are listed in `package.json`. Vercel runs a fresh `npm install` on each build.
5. Run `npm test` locally to catch any test failures that might block CI/CD pipelines.

---

## Deployment Checklist

Before deploying to production, verify the following:

- [ ] `npm run build` completes without errors
- [ ] `npm run preview` serves the app correctly at `http://localhost:4173`
- [ ] `npm test` passes all test suites
- [ ] `vercel.json` is present at the project root with SPA rewrite rules
- [ ] All routes are accessible via direct URL navigation (not just in-app links)
- [ ] The default admin credentials work (`admin` / `adminpass`)
- [ ] New user registration works and persists across page refreshes
- [ ] Blog post creation, editing, and deletion work correctly
- [ ] Admin dashboard and user management pages are accessible to admin users
- [ ] Non-admin users are redirected when attempting to access admin routes
- [ ] The application is responsive on mobile, tablet, and desktop viewports