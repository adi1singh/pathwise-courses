# Pathwise Courses

The website for Poonam's course advisory service. It helps visitors find a nationally
recognised course, choose how to get it (recognition of prior learning, online study or a
short course), and make an enquiry or talk to Poonam.

**Before launch, work through [LAUNCH-CHECKLIST.md](LAUNCH-CHECKLIST.md).**

## Pages

| Page | File | Purpose |
| --- | --- | --- |
| Home | `index.html` | Video hero with course search suggestions and Poonam, scrolling job band, **Pathway Map** (pick an area and your experience to see the route, jobs, time, typical prices and where RPL could count), course finder entry, course areas (bento), About Poonam, student stories (samples in preview only), why these courses matter, how it works, FAQs, enquiry invitation |
| Find my course | `course-finder.html` | Four questions, one at a time, then suggested courses and pathways with reasons; answers can be edited |
| Courses | `courses.html` | Ranked search (everyday words and job titles), area chips, a folding filter panel on mobile, removable filter chips, compare up to 3 |
| Course pages (16) | `course/*.html` | At a glance (suits, study options, placement, entry, provider, fees), section links, full detail, FAQs |
| Ways to study | `ways-to-study.html` | RPL vs online study vs short courses, RPL evidence checklist, link to the course finder |
| Short courses | `short-courses.html` | 24 CPD short courses with topic and length filters, team training, first aid |
| About Poonam | `about.html` | Story, services, what to expect, who does what |
| FAQ | `faq.html` | Grouped questions with topic links |
| Contact | `contact.html` | Enquiry / call-back form, contact details, what happens next |
| Ask about a course | `eligibility.html` | Three-step form; shows the course, pathway and finder answers the visitor arrived with |
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
| Contact details, Poonam's photo, response time, testimonials, business name, partner RTOs, form endpoint, draft mode | `src/data/site.js` |
| Courses (text, durations, placement, entry needs, pathways, fees, search keywords, area photos) | `src/data/courses.js` |
| Course finder questions and which courses each interest suggests | `src/data/finder.js` |
| Pathway Map routes (which courses sit at each step) | `src/data/pathway-map.js` |
| Short courses | `src/data/short-courses.js` |
| FAQs | `src/data/faqs.js` |
| Page wording and layout | `src/pages/*.js` |
| Header, footer and shared pieces | `src/templates/*.js` |
| Styles / behaviour | `src/assets/css/parts/*.css` (joined into one `styles.css` at build time, in file-name order), `src/assets/js/main.js`, `src/assets/js/finder.js` |

Run `npm run build` after any change and commit the updated `docs/` folder along with your edits.

### Draft mode

`draft: true` in `src/data/site.js` shows a preview banner and amber **To confirm** markers next
to every detail Poonam still needs to confirm. It also adds `noindex` so search engines stay
away. To find what's outstanding, search for `confirm` in `src/data/` and `tbc(` in `src/`.

### Missing details never become fake ones

- **Phone, WhatsApp, email:** `null` until supplied. The site shows "coming soon" and leaves the
  link out.
- **Poonam's photo** (`advisorPhoto`): set to null and the site falls back to a designed placeholder.
- **Prices:** typical market ranges from `src/data/prices.js` (sources in `PRICING.md`) until
  Poonam's own `fees` are set on each course.
- **Testimonials:** sample reviews show only in preview (`draft: true`) and are labelled as samples.
- **Training provider** (`partnerRtos` + `rto` on each course): until set, pages say the provider
  is confirmed before enrolment.
- **Response time** and **testimonials:** hidden until supplied.

### How the course finder suggests courses

`src/data/finder.js` maps each interest to a set of courses. The browser then uses only course
data from `courses.js`: it skips levels the visitor already holds, prefers the next level up,
favours leadership roles for "step up" goals, and suggests RPL when the visitor reports 3+ years'
experience. Each suggestion lists the reasons that applied. There are no match scores, and
results say that eligibility is confirmed by the training provider. Results appear before any
contact details are asked for. The chosen course, pathway and answers carry into the enquiry form.

### Search

Course search ranks results. A title or keyword match counts for more than a word in the
description, and everyday words map to course terms ("childcare", "nursing home", "teacher
aide", "OH&S", "cert 3"). Add words people use to `keywords` on each course.

## Connecting the forms

Both forms send a JSON `POST` to `forms.endpoint`. **Until it is set, both forms are shown
switched off** with a short note that online enquiries aren't open yet, so nobody fills one in for
nothing. Once connected, fields are validated with clear messages, success is shown only after
the service accepts the submission (a 2xx response that isn't `{ success: false }`), and a
failure keeps everything the visitor typed.

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
- **Vercel:** `vercel.json` already sets the build command (`npm run build`) and output directory (`docs`).
- **Netlify:** build command `npm run build`, publish directory `docs`.

Before launch, set `url` in `src/data/site.js` to the real domain. Canonical links, the sitemap
and the social sharing image use it.

## Quality checks

`npm test` runs these checks in headless Chromium:

- every internal link and `#anchor` resolves
- axe-core accessibility checks (WCAG 2.1 A/AA and best practices) on every page, at desktop
  and mobile widths
- no horizontal scrolling at 320, 390, 768, 1024 and 1440px
- mobile menu (open, Escape, focus return)
- no developer instructions on visitor-facing pages
- search ranking (including "childcare" returning both early childhood qualifications first),
  removable filter chips, the folding mobile filter panel and results on the first mobile screen
- compare: limit of three, course names in the tray, table on desktop and stacked view on mobile
- course finder: one question at a time, Back, results with reasons, editing an answer without
  restarting, keyboard-only use, skipped questions, and carrying the choice into the enquiry form
- course pages: at-a-glance details, section links, mobile enquiry bar
- forms: switched off without a form service; on a test build with one connected, validation,
  focus handling, success only when accepted, and a failure that keeps the visitor's answers

Lighthouse (mobile), measured before and after the redesign on the same local server with
compression: Performance 100, Accessibility 100, Best Practices 100 on every page measured.
SEO shows 66 only because draft mode adds `noindex`; it scores 100 with `draft: false`.

## Notes

- Colours: paper, ink, coral and saffron, with one colour per course area (care, education,
  training, leadership, building, first aid) set in `01-base.css` and applied by `acc-<area>`
  classes in `99-areas.css`. The same area always uses the same colour on every page.
- Fonts: Geist (text and headings), Geist Mono (labels) and Instrument Serif italic (accent words), self-hosted.
- The home page video plays only on screens 900px and wider, never with reduced motion or data saver, and has a pause button. Photo credits: [CREDITS.md](CREDITS.md).
- `scripts/make-images.mjs` regenerates the social sharing image and the Apple touch icon.
- No cookies or tracking. The compare list and evidence checklist use the visitor's own browser
  storage.
