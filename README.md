# Samuel — website

Plain static site (no build step), hosted at **[samuapps.dev](https://samuapps.dev/)**.
Everything public lives in `public/`. Cloudflare Workers serves only that folder (`wrangler.jsonc`).

- `public/index.html` — homepage (intro + links to the apps)
- `public/mutemi-app/` — **MuteMi** marketing page + privacy policy
- `public/blocked-by-square/` — **BlockedBySquare** marketing page + privacy policy

Local preview: `python3 -m http.server -d public 8123`

## License

Content licensed [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/), except app logos (owned by their respective apps).
