# Pathwise Courses – launch checklist

Everything below needs Poonam's input or confirmation before the site goes public.
While `draft: true` is set in `src/data/site.js`, each of these shows on the site as an
amber **To confirm** marker, and the site asks search engines not to index it.

Nothing on the site claims accreditations, partnerships, awards, review scores, student
numbers, guarantees, prices or funding. Add any of these only once they're verified, and
only if they belong to Poonam's business.

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

- [ ] Phone number, WhatsApp number, email address, contact hours, and where she's based / which
      states she helps. Add these to `contact` in `src/data/site.js`.
- [ ] A friendly photo of Poonam (home page and About page).
- [ ] Her own story for the About page. The current text is placeholder copy: her background,
      how long she's been helping students, and the languages she speaks.
- [ ] Confirm the promises in the copy:
      - the free, no-obligation chat and eligibility check
      - "no payment details needed" for a first chat
      - first chats take about 15 minutes, by phone, WhatsApp or video
      - one familiar contact from first chat to certificate
      - check-ins during study
      - help organising RPL evidence
      - team training for employers
- [ ] **FAQ answers marked "To confirm".** These cover costs, instalments, government funding,
      RPL timing, weekly study hours and where study can happen.
- [ ] **Business name.** Check "Pathwise Courses" is available on the ASIC business names register
      and at IP Australia (trade marks), and that a suitable domain is free. Add the legal name
      and ABN to `business` in `src/data/site.js`.
- [ ] **Testimonials (optional).** Add only genuine reviews, with the person's permission. None
      are included.

## 4. Policies

- [ ] Review the draft **privacy notice** (`privacy.html`) so it matches how Poonam stores and
      shares enquiries, including the form service and any CRM. This draft is not legal advice.
- [ ] If Poonam will take payments or fees herself, add **terms and a refund policy**.

## 5. Configuration

- [ ] **Connect the forms.** Set `forms.endpoint` in `src/data/site.js` (see "Connecting the
      forms" in the README), rebuild, and send a test from both the Contact page and the
      Eligibility check. Until then the forms say plainly that nothing was sent.
- [ ] **Create the GitHub repository and push this repo to it.** The build session couldn't
      create repos. The full history is also on the `claude/determined-lovelace-osq66a` branch of
      `adi1singh/jobgen-olivia-redesign` as a backup.
- [ ] **Hosting and domain.** Deploy `docs/` (GitHub Pages, Netlify or Vercel), point the domain
      at it, and set `url` in `src/data/site.js` to the final address.
- [ ] **Go live.** Set `draft: false`, run `npm run build`, run `npm test`, then commit and
      deploy. This removes the preview banner and markers and allows search engines to index
      the site.
- [ ] Optional: add analytics. If you do, update the privacy notice (it currently says the site
      uses no tracking).
