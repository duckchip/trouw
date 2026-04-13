# 💒 Hanna & Tristan's Wedding

A beautiful wedding invitation website built with React, Vite, and Tailwind CSS.

**Live site:** [hanna-en-tristan.be](https://hanna-en-tristan.be/)

## ✨ Features

- 🎠 **Infinite Photo Gallery** - Auto-scrolling image carousel with Framer Motion
- 📝 **RSVP Form** - Guest registration with dietary preferences
- 🎵 **Music Requests** - Let guests suggest their favorite songs
- 🗺️ **Venue Map** - Interactive Google Maps integration
- 📱 **Fully Responsive** - Beautiful on all devices

## 🛠️ Tech Stack

- [React](https://react.dev/) + [Vite](https://vite.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)
- [React Hot Toast](https://react-hot-toast.com/)

## 🚀 Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## 📋 Environment variables

```bash
cp .env.example .env.local
```

Fill in `VITE_GOOGLE_SCRIPT_URL`, optional `VITE_GOOGLE_MAPS_API_KEY`, and **`VITE_INVITE_CODES_JSON`** (one-line JSON for RSVP codes). Never commit `.env.local`.

## 🚀 Deploy (GitHub Pages)

1. **Repository → Settings → Secrets and variables → Actions → New repository secret**  
   Prefer **Repository secrets** (available to every workflow). If you only add variables under the **github-pages** *Environment*, the workflow now attaches the build job to that environment so those secrets are included too.  
   Add:
   - `VITE_GOOGLE_SCRIPT_URL` — your Google Apps Script web app URL  
   - `VITE_INVITE_CODES_JSON` — same single-line JSON as in `.env.local`  
   - `VITE_GOOGLE_MAPS_API_KEY` — optional; can be empty if you omit it  

2. **Settings → Pages**  
   Under **Build and deployment**, set **Source** to **GitHub Actions** (not “Deploy from a branch”).

3. **Push to `main`**  
   The workflow in `.github/workflows/deploy-pages.yml` runs `npm ci`, `npm run build` (with secrets), and publishes the `dist/` folder.

4. **Custom domain (e.g. hanna-en-tristan.be)**  
   In Pages settings, set the domain and add the DNS records GitHub shows. Keep **Enforce HTTPS** on when it’s available.

**If the site is served from a subpath** (e.g. `user.github.io/repo-name/`), set `base: '/repo-name/'` in `vite.config.js` and rebuild.

**Not using GitHub Pages?** Run `npm run build` locally with `.env.local` loaded, then upload the `dist/` folder to your host (Netlify, Cloudflare Pages, etc.) and configure the same variables in that host’s dashboard.

**RSVP codes missing on the live site?** Check the latest **Actions** run: the build fails early if `VITE_INVITE_CODES_JSON` is empty or not valid JSON. The value must be **one line**, e.g. `{"CODE1":"ceremonyall","CODE2":"reception"}` — double quotes inside, no line breaks.

## 📄 License

Made with ♥ for our special day.
