# MuteMi — website

Marketing landing page and privacy policy for **MuteMi**, a macOS menu-bar app
that mutes every microphone on your Mac with a single keyboard shortcut.

This is a plain static site (no build step) served via **GitHub Pages**.

- `index.html` — homepage (logo, App Store links, screenshots)
- `privacy.html` — privacy policy (required for the App Store listing)
- `style.css` — shared styling
- `images/` — screenshots
- `logo.png` — app icon for the web

## Hosting

Published with GitHub Pages from the `main` branch, root folder.

- Site: <https://samuthekid.github.io/mutemi-app/>
- Privacy policy: <https://samuthekid.github.io/mutemi-app/privacy.html>

To preview locally: `python3 -m http.server 8000` then open
<http://localhost:8000/>.

> The two App Store buttons in `index.html` use placeholder links
> (`#FREE_APP_URL`, `#PAID_APP_URL`) — replace them once the apps are live.
