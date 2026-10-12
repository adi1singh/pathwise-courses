# Pathwise Courses

The website for Poonam's course advisory service. It helps visitors find a nationally
recognised course, choose how to get it (recognition of prior learning, online study or a
short course), and make an enquiry or talk to Poonam.

**Before launch, work through [LAUNCH-CHECKLIST.md](LAUNCH-CHECKLIST.md).**

## Pages

| Page | File | Purpose |
| --- | --- | --- |
| Home | `index.html` | Starting points by situation, browse by area, popular courses, how it works, meet Poonam |
| Courses | `courses.html` | Search and filter by area, level and RPL; compare up to 3 courses side by side |
| Course pages (16) | `course/*.html` | Key facts, who it suits, jobs, topics, pathways, placement, entry needs, FAQs |
| Ways to study | `ways-to-study.html` | RPL vs online study vs short courses, a 3-question pathway check, RPL evidence checklist |
| Short courses | `short-courses.html` | 24 CPD short courses with topic and length filters, team training, first aid |
| About Poonam | `about.html` | Story, services, what to expect, who does what |
| FAQ | `faq.html` | Grouped questions with topic links |
| Contact | `contact.html` | Enquiry / call-back form plus direct contact details |
| Eligibility check | `eligibility.html` | Three-step eligibility form |
| Privacy | `privacy.html` | Draft privacy notice |

## Working on the site

You need Node.js 20 or newer.

```bash
npm install        # once – installs the test tools
npm run build      # regenerates docs/ from src/
npm run serve      # preview at http://localhost:4173
npm test           # build + end-to-end checks
```

The site is plain HTML, CSS and a small amount of JavaScript. There is no framework. Pages are
generated from data, so most edits are in `src/data/`:

| To change… | Edit |
| --- | --- |
| Contact details, business name, partner RTOs, form endpoint, draft mode | `src/data/site.js` |
| Courses (text, durations, placement, entry needs, pathways) | `src/data/courses.js` |
| Short courses | `src/data/short-courses.js` |
| FAQs | `src/data/faqs.js` |
| Page wording and layout | `src/pages/*.js` |
| Header, footer and shared pieces | `src/templates/*.js` |
| Styles / behaviour | `src/assets/css/styles.css`, `src/assets/js/main.js` |

Run `npm run build` after any change and commit the updated `docs/` folder along with your edits.

### Draft mode

`draft: true` in `src/data/site.js` shows a preview banner and amber **To confirm** markers next
to every detail Poonam still needs to confirm. It also adds `noindex` so search engines stay
away. To find what's outstanding, search for `confirm` in `src/data/` and `tbc(` in `src/`.

### Missing contact details

Phone, WhatsApp and email are `null` until Poonam supplies them. The site then shows "coming
soon" text instead of a fake number, and leaves the link out.

## Connecting the forms

Both forms send a JSON `POST` to `forms.endpoint`. Until it is set, they validate as normal but
tell the visitor that **nothing was sent**, and offer other contact options and a "Copy my
answers" button. They never show a false success message. A failed or unreachable endpoint
shows an error and the direct contact options.

**Formspree (simplest):**

1. Create a free account at formspree.io and add a form. Use Poonam's email as the recipient.
2. Copy the form endpoint, e.g. `https://formspree.io/f/abcdwxyz`.
3. Set it in `src/data/site.js`:
   ```js
   forms: { endpoint: 'https://formspree.io/f/abcdwxyz' },
   ```
4. Run `npm run build`, deploy, and send a test from both forms.

**Web3Forms** works too. Set `endpoint: 'https://api.web3forms.com/submit'` and add
`extraFields: { access_key: 'YOUR_KEY' }` inside `forms`.

Each submission includes the form name (`contact` or `eligibility`), the page URL and a subject
line. A hidden `_gotcha` field catches simple spam bots.

## Deploying

The built site is in `docs/`, and it works from any folder or sub-path.

- **GitHub Pages:** repository Settings → Pages → Deploy from a branch → `main` / `/docs`.
- **Netlify / Vercel:** build command `npm run build`, publish directory `docs`.

Before launch, set `url` in `src/data/site.js` to the real domain. Canonical links, the sitemap
and the social sharing image use it.

## Quality checks

`npm test` runs these checks in headless Chromium:

- every internal link and `#anchor` resolves
- axe-core accessibility checks (WCAG 2.1 A/AA and best practices) on every page, at desktop
  and mobile widths
- no horizontal scrolling at 320, 390, 768, 1024 and 1440px
- mobile menu (open, Escape, focus return)
- course filters, search and shareable URLs
- compare (limit of three, dialog)
- pathway check and evidence checklist
- both forms: validation messages, focus handling, prefilled course links, the
  "not connected" message, a successful submission and a failed one

Lighthouse (mobile) at the time of handover: Performance 98–99, Accessibility 100,
Best Practices 100. SEO scores 66 only because of draft-mode `noindex`.

## Notes

- Fonts: Fraunces and Inter, self-hosted (SIL Open Font License).
- `scripts/make-images.mjs` regenerates the social sharing image and the Apple touch icon.
- No cookies or tracking. The compare list and evidence checklist use the visitor's own browser
  storage.
