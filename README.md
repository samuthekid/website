# Samuel — website

Personal site. A minimal landing page at the root, with each app living in its own subpage.

This is a plain static site (no build step) served via **GitHub Pages**.

- `index.html` — personal homepage (intro + links to app subpages)
- `mutemi-app/` — **MuteMi** marketing page and privacy policy
  - `index.html` — homepage (logo, App Store links, screenshots)
  - `privacy.html` — privacy policy (required for the App Store listing)
  - `style.css` — shared styling
  - `viewer.js` — gallery lightbox
  - `images/` — screenshots
  - `logo.png` — app icon for the web

## Hosting

Published with GitHub Pages from the `main` branch, root folder.

- Site: <https://samuthekid.github.io/website/>
- MuteMi: <https://samuthekid.github.io/website/mutemi-app/>
- MuteMi privacy policy: <https://samuthekid.github.io/website/mutemi-app/privacy.html>

To preview locally: `python3 -m http.server 8000` then open
<http://localhost:8000/>.

> The two App Store buttons in `mutemi-app/index.html` use placeholder links
> (`#FREE_APP_URL`, `#PAID_APP_URL`) — replace them once the apps are live.
