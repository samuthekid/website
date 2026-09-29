// Shared web components for samuapps.dev pages.
// ponytail: light-DOM custom elements — styled by shared.css, no shadow root to re-declare styles in.
const APPLE = '<span class="store-btn__apple" aria-hidden="true"></span>';

customElements.define('store-button', class extends HTMLElement {
  connectedCallback() {
    this.innerHTML =
      `<a class="store-btn" href="${this.getAttribute('href')}">${APPLE}` +
      `<span class="store-btn__text"><small>${this.getAttribute('note')}</small>` +
      `<strong>${this.getAttribute('cta')}</strong></span></a>`;
  }
});

customElements.define('site-footer', class extends HTMLElement {
  connectedCallback() {
    // Links come from link-href/link-text, or from <a> children for several links.
    const href = this.getAttribute('link-href'), text = this.getAttribute('link-text');
    const links = href ? [`<a href="${href}">${text}</a>`] : [...this.querySelectorAll('a')].map(a => a.outerHTML);
    const mid = links.map(l => `${l}<span class="dot">·</span>`).join('');
    this.innerHTML =
      `<footer><a href="../">samuapps.dev</a><span class="dot">·</span>` +
      `${mid}<span>© 2026 Samuel</span></footer>`;
  }
});
