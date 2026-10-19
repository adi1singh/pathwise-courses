# Pathwise Courses – launch checklist

Everything below needs Poonam's input or confirmation before the site goes public.
While `draft: true` is set in `src/data/site.js`, each of these shows on the site as an
amber **To confirm** marker, and the site asks search engines not to index it.

Apart from the jobgen.ai technical partnership on the About us page (approved by Poonam), nothing
on the site claims accreditations, partnerships, awards, review scores, student
numbers, guarantees or funding. Prices shown are clearly labelled **typical market ranges**
from other providers (see `PRICING.md`), not Poonam's prices. Add claims only once they're
verified, and only if they belong to Poonam's business.

## 1. Business model and compliance (must do)

- [ ] **Confirm how Poonam works.** The site describes Pathwise Courses as an advisory service,
      not a Registered Training Organisation (RTO). It says partner RTOs enrol, train, assess
      and issue qualifications. Check this matches her arrangements.
- [ ] **Name each partner RTO and its RTO code.** Add them to `partnerRtos` in
      `src/data/site.js`, then set `rto: '<id>'` on each course in `src/data/courses.js`.
      Anyone marketing nationally recognised training for an RTO is expected to name that RTO
      and its code (ASQA).
- [ ] **Have the partner RTO(s) approve the marketing.** RTOs are responsible for marketing done
      on their behalf, and usually need a written agreement with third parties who recruit for
      them.
- [ ] **Do not use the Nationally Recognised Training (NRT) logo.** Only RTOs may use it.

## 2. Courses (must do)

- [ ] **Confirm the course list.** Remove any course Poonam can't help with, and add any that
      are missing.
- [ ] **Check every course code is current** on [training.gov.au](https://training.gov.au) and
      on the partner RTO's scope. Check these ones especially, because their status was unclear
      during the build:
      - **CHC62015** Advanced Diploma of Community Sector Management
      - **CHC51015** Diploma of Counselling
      - **BSB41419** Certificate IV in Work Health and Safety
      - **CHC43015** Certificate IV in Ageing Support
      - The new 2025 releases **CHC30125, CHC40225, CHC50125, CHC50225, CHC52025**
- [ ] **Prices:** the site shows typical full-fee ranges published by other providers
      (checked October 2026, sources in `PRICING.md`). Once Poonam's fees are agreed with her
      partner RTO(s), add them to `fees` on each course; that replaces the range. If ranges stay,
      re-check them every 6 months.
- [ ] **Confirm the details on each course page.** These are typical figures only and must match
      what the delivering RTO says:
      - online study duration
      - RPL timeframe
      - work placement hours (e.g. 120 h for CHC33021, 160 h for CHC30125, 100 h for CHC40225)
      - entry requirements (checks, age, prerequisites)
- [ ] **Short courses.** Confirm which of the 24 short courses Poonam offers, who delivers them,
      their price and duration, and what certificate learners receive. Every card currently says
      "Price on enquiry".

## 3. Content from Poonam

- [ ] **Contact details:** phone, WhatsApp number, email address, contact hours, and where
      she's based / which states she helps. Add these to `contact` in `src/data/site.js`.
- [x] **Poonam's photo:** new studio headshot supplied (October 2026), used as supplied; only the home
      page cut-out has its background removed. Files in `src/assets/img/poonam/`.
- [ ] **Instagram reels** (end of the home page): paste each public reel's link, a short title and its course
      area into `instagram.reels` in `src/data/site.js`, and the account name into `instagram.handle` for a
      "Follow" button. Use Pathwise's own reels or ones you have permission to feature. With no links the
      preview shows placeholder cards and the live site hides the section.
- [ ] **Photo of Poonam and Khush** for the technical partner section on About us: save it as
      `src/assets/img/partner/poonam-khush-480.webp` and `-800.webp` (4:3) and set `partner.photo` in
      `src/data/site.js`. Until then the preview shows a placeholder and the live site shows text only.
- [ ] **Approved introduction and background:** check the homepage greeting and quote ("I'll
      listen to your experience and goals…") and write her own story for the About page. The
      About text is placeholder copy. Cover her relevant background, how long she's been
      helping students, and the languages she speaks. Only include credentials she can show.
- [ ] **Response time:** if Poonam can commit to one (e.g. "within one business day"), set
      `responseTime`. It's shown in "What happens next" only once set.
- [ ] **Promises in the copy:**
      - the first conversation is free and without obligation
      - "no payment details needed" for a first chat
      - first chats take about 15 minutes, by phone, WhatsApp or video
      - "One person, start to finish": she's the contact from first chat to certificate
      - "Honest about fit": she'll say if a course isn't right
      - check-ins during study, help organising RPL evidence, team training for employers
- [ ] **FAQ answers marked "To confirm":** costs, instalments, government funding, RPL timing,
      weekly study hours, and where study can happen.
- [ ] **Business name:** check "Pathwise Courses" is available on the ASIC business names register
      and at IP Australia (trade marks), and that a suitable domain is free. Add the legal name
      and ABN to `business` in `src/data/site.js`.
- [ ] **Testimonials:** the preview shows four stories using names of Poonam's students, but the
      **wording is placeholder text** written for the layout. They disappear automatically when
      `draft` is `false`. To keep them at launch, replace each quote with what the student actually said
      and move it to `testimonials`. Add only genuine, approved stories to `testimonials`, with the person's permission
      (fake or edited reviews breach Australian Consumer Law). With none, the section is hidden.
- [ ] **"Why these courses matter":** the figures are Victorian Government workforce projections.
      If Poonam mainly helps students in other states, swap in national or state figures.
- [ ] **Imagery:** course photos and the home page video are from Unsplash and Pexels (see `CREDITS.md`).
      Confirm Poonam is happy with them, or supply her own photos (with consent from anyone shown).
- [ ] **Course finder rules:** check `src/data/finder.js`. Each interest suggests a set of
      courses; adjust if Poonam would steer people differently.

## 4. Policies

- [ ] Review the draft **privacy notice** (`privacy.html`) so it matches how Poonam stores and
      shares enquiries, including the form service and any CRM. This draft is not legal advice.
- [ ] If Poonam will take payments or fees herself, add **terms and a refund policy**.

## 5. Configuration

- [ ] **Connect the forms:** choose where enquiries should go (Formspree is simplest; see
      "Connecting the forms" in the README) and set `forms.endpoint` in `src/data/site.js`.
      Rebuild, then send a real test from both the Contact page and "Ask about a course". Until
      then both forms are shown switched off with a short note to visitors.
- [x] **GitHub repository:** `adi1singh/pathwise-courses`, deployed on Vercel from `main`.
- [ ] **Hosting and domain.** Deploy `docs/` (GitHub Pages, Netlify or Vercel), point the domain
      at it, and set `url` in `src/data/site.js` to the final address.
- [ ] **Go live.** Set `draft: false`, run `npm run build`, run `npm test`, then commit and
      deploy. This removes the preview banner and markers and allows search engines to index
      the site.
- [ ] Optional: add analytics. If you do, update the privacy notice (it currently says the site
      uses no tracking).
