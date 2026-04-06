/**
 * Care home outreach email sequence (3 emails)
 * Used to invite care homes to claim their listing on gofal.wales
 */

export const outreachEmails = [
  {
    id: 1,
    subject_cy: "Mae {home_name} ar gofal.wales — hawliwch eich rhestriad am ddim",
    subject_en: "{home_name} is on gofal.wales — claim your free listing",
    delay_days: 0,
    body_cy: `Annwyl {manager_name},

Rydym yn ysgrifennu atoch i'ch hysbysu bod {home_name} eisoes yn ymddangos ar gofal.wales — cyfeiriadur cartrefi gofal Cymraeg cyntaf Cymru.

Mae teuluoedd yn defnyddio gofal.wales i chwilio am gartrefi gofal yn {county}. Mae eich rhestriad yn dangos gwybodaeth o Arolygiaeth Gofal Cymru (CIW), ond gallwch wneud llawer mwy drwy hawlio eich rhestriad am ddim:

✅ Ychwanegu disgrifiad a lluniau
✅ Dangos eich prisiau a gwasanaethau
✅ Dangos eich lefel Cynnig Rhagweithiol
✅ Derbyn ymholiadau yn uniongyrchol gan deuluoedd

Mae'n cymryd llai na 2 funud: {claim_url}

Cofion gorau,
Tîm gofal.wales

---

Dear {manager_name},

We're writing to let you know that {home_name} already appears on gofal.wales — Wales' first Welsh-language care home directory.

Families use gofal.wales to search for care homes in {county}. Your listing shows Care Inspectorate Wales (CIW) information, but you can do much more by claiming your free listing:

✅ Add a description and photos
✅ Show your prices and services
✅ Display your Active Offer level
✅ Receive enquiries directly from families

It takes less than 2 minutes: {claim_url}

Best regards,
The gofal.wales team`,
  },
  {
    id: 2,
    subject_cy: "Teuluoedd yn chwilio am gartrefi gofal yn {county} — ydych chi'n weladwy?",
    subject_en: "Families searching for care homes in {county} — are you visible?",
    delay_days: 7,
    body_cy: `Annwyl {manager_name},

Yr wythnos ddiwethaf, gwnaethom gysylltu â chi am eich rhestriad ar gofal.wales.

Bob mis, mae cannoedd o deuluoedd yn chwilio am gartrefi gofal yn {county}. Mae cartrefi gofal sydd wedi hawlio eu rhestriad yn derbyn hyd at 5x mwy o ymholiadau na rhestriadau sylfaenol.

Dyma beth allwch chi wneud ar ôl hawlio:
🏠 Ychwanegu hyd at 10 llun o'ch cartref
📝 Ysgrifennu disgrifiad dwyieithog
💰 Dangos eich ffioedd wythnosol
🏴 Dangos eich lefel Cynnig Rhagweithiol

Hawliwch nawr: {claim_url}

Cofion,
Nathan — Sylfaenydd, gofal.wales

---

Dear {manager_name},

Last week, we reached out about your listing on gofal.wales.

Every month, hundreds of families search for care homes in {county}. Care homes that have claimed their listing receive up to 5x more enquiries than basic listings.

Here's what you can do after claiming:
🏠 Add up to 10 photos of your home
📝 Write a bilingual description
💰 Display your weekly fees
🏴 Show your Active Offer level

Claim now: {claim_url}

Best,
Nathan — Founder, gofal.wales`,
  },
  {
    id: 3,
    subject_cy: "Diweddariad olaf — eich rhestriad ar gofal.wales",
    subject_en: "Final update — your listing on gofal.wales",
    delay_days: 14,
    body_cy: `Annwyl {manager_name},

Dyma ein neges olaf am eich rhestriad ar gofal.wales. Rydym am sicrhau bod {home_name} yn cael y gwelededd gorau posibl i deuluoedd sy'n chwilio am ofal.

Os hoffech hawlio eich rhestriad am ddim, mae'r ddolen isod yn dal yn weithredol:
{claim_url}

Os nad oes gennych ddiddordeb, does dim angen gwneud unrhyw beth. Bydd eich rhestriad sylfaenol (gwybodaeth CIW) yn parhau ar y wefan.

Pob lwc,
Nathan

---

Dear {manager_name},

This is our final message about your listing on gofal.wales. We want to make sure {home_name} gets the best possible visibility for families searching for care.

If you'd like to claim your free listing, the link below is still active:
{claim_url}

If you're not interested, there's nothing you need to do. Your basic listing (CIW information) will remain on the website.

All the best,
Nathan`,
  },
];
