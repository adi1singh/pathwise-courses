# Typical prices: how they were worked out

The prices on the site are **typical market ranges, not Poonam's prices**. They show the
low and high full-fee (non-subsidised) prices published by Australian training providers,
checked on **12 October 2026**. Government-funded, concession and international-student
prices are left out. Ranges are rounded to the nearest $50 (nearest $5 for first aid units).
A price far below or above the others (roughly 0.6x or 1.5x the next one) is treated as an
outlier and left out.

**Before launch:** once Poonam agrees fees with her partner RTO(s), set `fees` on each course in
`src/data/courses.js`. The site then shows her fee instead of the range. Re-check these ranges at
least every 6 months (edit `src/data/prices.js`), and change `pricesCheckedOn` when you do.

**Caveats**
- Good Universities Guide (GUG) listing pages show "Tuition fees" with no date and no domestic or
  international label.
- Some prices are sale prices (Open Colleges, ACTAC).
- One U Education is an RPL intermediary, not an RTO. Its prices include its service fee.

Abbreviations used in the source list below:
- **AK** = Alana Kaye 2026 domestic price list: https://alanakaye.edu.au/wp-content/uploads/2025/12/Domestic-Student-Courses-Price-List-2026-2.pdf
- **ARC** = ARC Training fee-for-service list (SA, July–December 2026): https://irp.cdn-website.com/d4862884/files/uploaded/ARC+Training+Fee+for+Service+Price+List.pdf
- **OneU** = One U Education RPL prices ("as at 09 Oct 2026"): https://www.oneuedu.com/en-US/rpl/cost

| Course | Study range | RPL range | Sources |
| --- | --- | --- | --- |
| CHC33021 | $3,000–$12,450 | $1,400–$2,500 | [GUG](https://www.gooduniversitiesguide.com.au/course-provider/intercare-training/courses/certificate-iii-in-individual-support-chc33021); AK; ARC; [CDU](https://www.cdu.edu.au/course-docs/2026/CHC33021CIF2026v1CAS_FFT.pdf); OneU |
| CHC43121 | $3,000–$9,300 | – | [GUG 1](https://www.gooduniversitiesguide.com.au/course-provider/frontier-education/courses/certificate-iv-in-disability-support-chc43121), [GUG 2](https://www.gooduniversitiesguide.com.au/course-provider/job-skills-training-academy/courses/certificate-iv-in-disability-support-chc43121); ARC; [Federation TAFE](https://www.federation.edu.au/courses/dlcn-certificate-iv-in-disability-support/) |
| CHC43015 | $4,200–$10,650 | $2,000–$2,550 | [GUG](https://www.gooduniversitiesguide.com.au/course-provider/partners-in-training-australia/courses/certificate-iv-in-ageing-support-chc43015); AK; ARC; OneU |
| CHC52025 | $6,500–$22,850 | $3,500–$4,000 | [GUG](https://www.gooduniversitiesguide.com.au/course-provider/tafe-nsw/courses/diploma-of-community-services-chc52021); [Melbourne Polytechnic](https://media.melbournepolytechnic.edu.au/media/rt1cim1g/diploma-of-community-services-chc52025-fees-2026.pdf); AK (CHC52021); OneU |
| CHC62015 | $5,000–$6,000 | – | [GUG](https://gooduniversitiesguide.com.au/course-provider/north-metropolitan-tafe/courses/advanced-diploma-of-community-sector-management-chc62015); AK |
| CHC51015 | $4,200–$13,300 | – | [GUG](https://www.gooduniversitiesguide.com.au/course-provider/tafe-nsw/courses/diploma-of-counselling-chc51015); [Open Colleges](https://www.opencolleges.edu.au/products/diploma-of-counselling); [TAFE Qld](https://tafeqld.edu.au/course/17/17683/diploma-of-counselling) |
| CHC30125 | $3,000–$3,400 | $2,000–$2,700 | Mostly CHC30121 prices: [Open Colleges](https://opencolleges.edu.au/products/certificate-iii-early-childhood-education-and-care); AK; GUG (Wyndham CEC); OneU |
| CHC40225 | $3,250–$5,900 | – | [Skills Strategies](https://www.skillstrategies.edu.au/course/chc40225-certificate-iv-in-school-based-education-support-virtual-rpl/); [TAFE Qld](https://tafeqld.edu.au/courses/17805/certificate-iv-in-education-support) |
| CHC50125 | $3,300–$7,500 | $2,100–$2,700 | [GUG](https://www.gooduniversitiesguide.com.au/course-provider/wyndham-community-and-education-centre-inc/courses/diploma-of-early-childhood-education-and-care-chc50125); [Open Colleges](https://www.opencolleges.edu.au/products/diploma-of-early-childhood-education-and-care); AK; OneU |
| CHC50225 | $3,500–$7,900 | – | Mostly CHC50221 prices: [GUG](https://www.gooduniversitiesguide.com.au/course-provider/child-care-services-training/courses/diploma-of-school-age-education-and-care-chc50221) |
| TAE40122 | $2,800–$7,850 | $1,800–$3,950 | [GUG](https://www.gooduniversitiesguide.com.au/course-provider/mrwed-training-and-assessment/courses/certificate-iv-in-training-and-assessment-tae40122); AK; [ITT Academy (2024)](https://ittacademy.net.au/wp-content/uploads/2024/06/TAE40122-Commercial.pdf); OneU |
| BSB41419 | $2,500–$4,800 | $1,100–$2,750 | [Asset College](https://asset.edu.au/course/certificate-iv-in-work-health-and-safety/); [Alana Kaye](https://alanakaye.edu.au/courses/certificate-iv-in-work-health-and-safety-domestic/); [TAFE Qld](https://tafeqld.edu.au/courses/17736/certificate-iv-in-work-health-and-safety); [Swinburne](https://www.swinburne.edu.au/course/tafe/certificate-iv-in-work-health-and-safety-fast-track-bsb41419); OneU |
| BSB50420 | $3,500–$9,000 | $1,750–$2,750 | [GUG](https://www.gooduniversitiesguide.com.au/course-provider/south-west-tafe/courses/diploma-of-leadership-and-management-bsb50420); [Asset College](https://www.asset.edu.au/course/diploma-of-leadership-and-management/); AK; [CDU](https://www.cdu.edu.au/study/course/bsb50420-diploma-leadership-management-bsb50420?year=2026); OneU |
| CPC50220 | $6,500–$38,400 | $2,550–$5,500 | [GUG](https://www.gooduniversitiesguide.com.au/course-provider/victoria-university-vu/courses/diploma-of-building-and-construction-building); [Federation TAFE](https://www.federation.edu.au/courses/dlca-diploma-of-building-and-construction-building/); [The Gordon](https://www.thegordon.edu.au/courses/all/cpc50220-diploma-of-building-and-construction-(building)); [Melbourne Polytechnic](https://media.melbournepolytechnic.edu.au/media/t2lhwhta/diploma-of-building-and-construction-building-cpc50220-2026-fees.pdf); [Builders Academy](https://buildersacademy.edu.au/building-construction-courses/rpl); OneU |
| HLTAID009 | $45–$100 | – | [CBD College](https://www.cbdcollege.edu.au/provide-cardiopulmonary-resuscitation/hobart); [St John WA](https://www.stjohnwa.com.au/first-aid-training/first-aid-courses/details/6126-2/provide-cpr); [St John NSW](https://stjohnnsw.com.au/courses/provide-cpr/); [emergency.com.au](https://emergency.com.au/our-courses/first-aid-courses/hltaid009-cpr-low-contact/) |
| HLTAID011 | $95–$190 | – | [CBD College](https://www.cbdcollege.edu.au/provide-first-aid/newcastle); [Eclipse Education](https://www.eclipse.edu.au/First-Aid-Bendigo.amp.asp); [QAS](https://qld.gov.au/emergency/emergencies-services/first-aid/course-information/public-courses/provide-first-aid-hltaid011) |

## "Why these courses matter" facts

Victorian Skills Authority employment projections, published on vic.gov.au:
- [Aged carer](https://www.vic.gov.au/aged-carer)
- [Out of school hours care worker](https://www.vic.gov.au/out-of-school-hours-care-worker)
- [Education aide](https://www.vic.gov.au/education-aide)
- [Working with children and young people](https://www.vic.gov.au/skills-working-children-young-people)

National Jobs and Skills Australia figures could not be checked (the site was unavailable), so
none are used. If Poonam works mainly outside Victoria, swap in national or state figures.
