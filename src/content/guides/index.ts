export interface Guide {
  slug: string;
  title_cy: string;
  title_en: string;
  excerpt_cy: string;
  excerpt_en: string;
  content_cy: string;
  content_en: string;
  published: string;
  category: "general" | "county";
  related_county?: string;
}

export const guides: Guide[] = [
  {
    slug: "sut-i-ddod-o-hyd-i-gartref-gofal",
    title_cy: "Sut i ddod o hyd i gartref gofal yng Nghymru",
    title_en: "How to find a care home in Wales",
    excerpt_cy: "Canllaw cam wrth gam i deuluoedd sy'n chwilio am gartref gofal yng Nghymru, gan gynnwys beth i'w ystyried, sut i gymharu cartrefi, a sut i wneud ymholiad.",
    excerpt_en: "A step-by-step guide for families searching for a care home in Wales, including what to consider, how to compare homes, and how to make an enquiry.",
    published: "2026-04-01",
    category: "general",
    content_cy: `## Sut i ddod o hyd i'r cartref gofal gorau yng Nghymru

Mae dod o hyd i gartref gofal i anwylyd yn un o'r penderfyniadau mwyaf emosiynol y bydd llawer o deuluoedd yn ei wynebu. Yng Nghymru, mae dros 1,000 o gartrefi gofal cofrestredig, a gall y broses ymddangos yn llethol. Mae'r canllaw hwn yn eich helpu cam wrth gam.

### 1. Deall pa fath o ofal sydd ei angen

Y cam cyntaf yw deall y math o ofal sydd ei angen ar eich anwylyd:

- **Gofal preswyl** — cymorth gyda bywyd bob dydd, fel ymolchi, gwisgo, a phrydau bwyd
- **Gofal nyrsio** — gofal meddygol 24 awr gan nyrsys cofrestredig
- **Gofal dementia** — gofal arbenigol ar gyfer pobl â dementia neu Alzheimer's
- **Gofal seibiant** — arhosiad dros dro i roi seibiant i ofalwyr
- **Anabledd dysgu** — gofal arbenigol ar gyfer oedolion ag anableddau dysgu

### 2. Ystyried lleoliad

Meddyliwch am:
- Pa mor agos y mae'r cartref at deulu a ffrindiau
- Mynediad at wasanaethau lleol
- A yw'r ardal yn gyfarwydd i'ch anwylyd
- Os yw gofal drwy'r Gymraeg yn bwysig, edrychwch ar lefel y Cynnig Rhagweithiol

### 3. Gwirio graddfeydd CIW

Mae Arolygiaeth Gofal Cymru (CIW) yn arolygu pob cartref gofal yng Nghymru. Maent yn graddio pedwar maes:
- **Llesiant** — a yw preswylwyr yn hapus ac yn iach?
- **Gofal a Chymorth** — ansawdd y gofal a ddarperir
- **Arweinyddiaeth a Rheolaeth** — pa mor dda y caiff y cartref ei redeg
- **Yr Amgylchedd** — cyflwr yr adeilad a'r cyfleusterau

Ar [gofal.wales](/cartrefi-gofal), gallwch weld pob gradd CIW ar un dudalen.

### 4. Ymweld â chartrefi

Ar ôl llunio rhestr fer, trefnwch ymweliadau. Yn ystod eich ymweliad:
- Siaradwch â'r staff a'r preswylwyr
- Edrychwch ar yr amgylchedd — a yw'n lân, yn groesawgar, ac yn gartrefol?
- Gofynnwch am y gweithgareddau a ddarperir
- Gofynnwch am y polisi iaith Gymraeg
- Gofynnwch am gostau a beth sydd wedi'i gynnwys

### 5. Gwneud ymholiad

Gallwch anfon ymholiad yn uniongyrchol trwy [gofal.wales](/cartrefi-gofal). Bydd eich manylion yn cael eu hanfon i'r cartref gofal, a byddant yn cysylltu â chi.

### 6. Deall y costau

Mae costau cartrefi gofal yng Nghymru yn amrywio yn ôl y math o ofal a'r lleoliad. Yn gyffredinol:
- **Gofal preswyl**: £700–£1,000 yr wythnos
- **Gofal nyrsio**: £900–£1,400 yr wythnos
- **Gofal dementia**: £800–£1,200 yr wythnos

Mae'n bosibl y bydd yr awdurdod lleol yn helpu gyda'r costau — gofynnwch am asesiad ariannol.

### 7. Y Cynnig Rhagweithiol

Os yw'r Gymraeg yn bwysig i'ch anwylyd, edrychwch am gartrefi gofal sydd â lefel uchel o Gynnig Rhagweithiol. Mae hyn yn golygu eu bod yn cynnig gofal drwy'r Gymraeg heb i chi orfod gofyn.

Ar [gofal.wales](/cartrefi-gofal), gallwch hidlo cartrefi gofal yn ôl eu lefel Cynnig Rhagweithiol.

---

*Am fwy o wybodaeth, porwch ein [cyfeiriadur cartrefi gofal](/cartrefi-gofal) neu darllenwch ein [canllawiau eraill](/canllawiau).*`,
    content_en: `## How to find the best care home in Wales

Finding a care home for a loved one is one of the most emotional decisions many families will face. In Wales, there are over 1,000 registered care homes, and the process can seem overwhelming. This guide helps you step by step.

### 1. Understand what type of care is needed

The first step is understanding what type of care your loved one needs:

- **Residential care** — help with everyday living, such as washing, dressing, and meals
- **Nursing care** — 24-hour medical care from registered nurses
- **Dementia care** — specialist care for people with dementia or Alzheimer's
- **Respite care** — a temporary stay to give carers a break
- **Learning disability** — specialist care for adults with learning disabilities

### 2. Consider location

Think about:
- How close the home is to family and friends
- Access to local services
- Whether the area is familiar to your loved one
- If care through Welsh is important, look at the Active Offer level

### 3. Check CIW ratings

Care Inspectorate Wales (CIW) inspects every care home in Wales. They rate four areas:
- **Wellbeing** — are residents happy and healthy?
- **Care and Support** — the quality of care provided
- **Leadership and Management** — how well the home is run
- **The Environment** — the condition of the building and facilities

On [gofal.wales](/cartrefi-gofal), you can see every CIW rating on one page.

### 4. Visit homes

After creating a shortlist, arrange visits. During your visit:
- Talk to staff and residents
- Look at the environment — is it clean, welcoming, and homely?
- Ask about activities provided
- Ask about the Welsh language policy
- Ask about costs and what's included

### 5. Make an enquiry

You can send an enquiry directly through [gofal.wales](/cartrefi-gofal). Your details will be sent to the care home, and they will contact you.

### 6. Understand the costs

Care home costs in Wales vary by type of care and location. Generally:
- **Residential care**: £700–£1,000 per week
- **Nursing care**: £900–£1,400 per week
- **Dementia care**: £800–£1,200 per week

The local authority may help with costs — ask for a financial assessment.

### 7. The Active Offer

If Welsh is important to your loved one, look for care homes with a high Active Offer level. This means they offer care through Welsh without you having to ask.

On [gofal.wales](/cartrefi-gofal), you can filter care homes by their Active Offer level.

---

*For more information, browse our [care home directory](/cartrefi-gofal) or read our [other guides](/canllawiau).*`,
  },
  {
    slug: "deall-graddfeydd-ciw",
    title_cy: "Deall graddfeydd arolygu CIW",
    title_en: "Understanding CIW inspection ratings",
    excerpt_cy: "Beth mae graddfeydd Arolygiaeth Gofal Cymru yn ei olygu a sut i'w defnyddio i gymharu cartrefi gofal.",
    excerpt_en: "What Care Inspectorate Wales ratings mean and how to use them to compare care homes.",
    published: "2026-04-01",
    category: "general",
    content_cy: `## Deall graddfeydd arolygu CIW

Mae Arolygiaeth Gofal Cymru (CIW) yn arolygu pob cartref gofal cofrestredig yng Nghymru. Maent yn asesu ansawdd y gofal a ddarperir ac yn cyhoeddi adroddiadau sy'n cynnwys graddfeydd.

### Y pedwar maes graddio

Mae CIW yn graddio pob cartref gofal mewn pedwar maes:

#### 1. Llesiant
Mae hwn yn edrych ar ba mor hapus a bodlon yw'r preswylwyr. Mae'n ystyried:
- A yw preswylwyr yn cael eu trin â pharch ac urddas
- A oes ganddynt ddewis a rheolaeth dros eu bywydau
- A ydynt yn gallu cymryd rhan mewn gweithgareddau ystyrlon

#### 2. Gofal a Chymorth
Mae hwn yn asesu ansawdd y gofal a ddarperir:
- A yw cynlluniau gofal yn unigol ac yn gyfredol
- A yw anghenion iechyd yn cael eu diwallu
- A yw meddyginiaeth yn cael ei rheoli'n ddiogel

#### 3. Arweinyddiaeth a Rheolaeth
Mae hwn yn edrych ar sut mae'r cartref yn cael ei redeg:
- A oes arweinyddiaeth glir
- A yw'r staff wedi'u hyfforddi'n dda
- A oes prosesau cwynion effeithiol

#### 4. Yr Amgylchedd
Mae hwn yn asesu'r adeilad a'r cyfleusterau:
- A yw'r adeilad yn lân ac yn ddiogel
- A yw'r ystafelloedd yn addas ac yn gyfforddus
- A yw'r gerddi a'r mannau allanol yn hygyrch

### Y graddfeydd

Mae CIW yn defnyddio'r graddfeydd canlynol:
- **Rhagorol** — ansawdd eithriadol
- **Da** — ansawdd da gyda rhai meysydd i'w gwella
- **Digonol** — yn bodloni'r gofynion sylfaenol ond mae angen gwelliant
- **Gwael** — nid yw'n bodloni'r gofynion — mae angen gweithredu

### Sut i ddefnyddio graddfeydd CIW

Ar [gofal.wales](/cartrefi-gofal), gallwch weld graddfeydd CIW pob cartref gofal yng Nghymru. Gallwch:
- Hidlo cartrefi yn ôl gradd
- Cymharu graddfeydd rhwng cartrefi
- Darllen yr adroddiad arolygu llawn

Cofiwch — mae graddfeydd yn bwysig, ond nid dyma'r unig ffactor. Mae ymweliad personol bob amser yn bwysig.

---

*Edrychwch ar y [cyfeiriadur cartrefi gofal](/cartrefi-gofal) i gymharu graddfeydd CIW.*`,
    content_en: `## Understanding CIW inspection ratings

Care Inspectorate Wales (CIW) inspects every registered care home in Wales. They assess the quality of care provided and publish reports that include ratings.

### The four rating areas

CIW rates every care home in four areas:

#### 1. Wellbeing
This looks at how happy and satisfied residents are. It considers:
- Whether residents are treated with respect and dignity
- Whether they have choice and control over their lives
- Whether they can participate in meaningful activities

#### 2. Care and Support
This assesses the quality of care provided:
- Whether care plans are individual and up-to-date
- Whether health needs are being met
- Whether medication is managed safely

#### 3. Leadership and Management
This looks at how the home is run:
- Whether there is clear leadership
- Whether staff are well trained
- Whether there are effective complaints processes

#### 4. The Environment
This assesses the building and facilities:
- Whether the building is clean and safe
- Whether rooms are suitable and comfortable
- Whether gardens and outdoor spaces are accessible

### The ratings

CIW uses the following ratings:
- **Excellent** — exceptional quality
- **Good** — good quality with some areas for improvement
- **Adequate** — meets basic requirements but improvement needed
- **Poor** — does not meet requirements — action needed

### How to use CIW ratings

On [gofal.wales](/cartrefi-gofal), you can see CIW ratings for every care home in Wales. You can:
- Filter homes by rating
- Compare ratings between homes
- Read the full inspection report

Remember — ratings are important, but they're not the only factor. A personal visit is always important.

---

*Check the [care home directory](/cartrefi-gofal) to compare CIW ratings.*`,
  },
  {
    slug: "costau-cartrefi-gofal-cymru-2026",
    title_cy: "Costau cartrefi gofal yng Nghymru 2026",
    title_en: "Care home costs in Wales 2026",
    excerpt_cy: "Popeth sydd angen i chi ei wybod am gostau cartrefi gofal yng Nghymru yn 2026, gan gynnwys ffioedd wythnosol a chymorth ariannol.",
    excerpt_en: "Everything you need to know about care home costs in Wales in 2026, including weekly fees and financial support.",
    published: "2026-04-01",
    category: "general",
    content_cy: `## Costau cartrefi gofal yng Nghymru 2026

Mae deall costau cartrefi gofal yn gallu bod yn gymhleth. Mae'r canllaw hwn yn egluro'r costau cyfartalog yng Nghymru a'r cymorth ariannol sydd ar gael.

### Costau cyfartalog

Mae costau cartrefi gofal yng Nghymru yn amrywio yn ôl y math o ofal, y lleoliad, a'r cartref unigol.

#### Costau wythnosol cyfartalog (2026):
- **Gofal preswyl**: £750–£1,050 yr wythnos
- **Gofal nyrsio**: £950–£1,400 yr wythnos
- **Gofal dementia**: £850–£1,250 yr wythnos
- **Gofal seibiant**: £800–£1,100 yr wythnos (am arhosiad dros dro)

Mae'r costau hyn yn cynnwys llety, prydau bwyd, a gofal sylfaenol. Mae rhai cartrefi'n codi tâl ychwanegol am weithgareddau, trin gwallt, a gwasanaethau eraill.

### Beth sydd wedi'i gynnwys yn y ffi?

Yn gyffredinol, mae ffioedd cartrefi gofal yn cynnwys:
- Ystafell (preifat fel arfer)
- Pob pryd bwyd a diodydd
- Golchi dillad a dillad gwely
- Gofal personol (cymorth gydag ymolchi, gwisgo, bwyta)
- Gweithgareddau bob dydd
- Biliau cyfleustodau

### Cymorth ariannol

#### Asesiad ariannol yr awdurdod lleol
Os yw eich cynilion yn llai na'r trothwy (£50,000 ar hyn o bryd yng Nghymru), mae'n bosibl y bydd eich awdurdod lleol yn helpu i dalu am eich gofal. Cysylltwch â'ch awdurdod lleol am asesiad ariannol.

#### Gofal Iechyd Parhaus y GIG
Os oes gennych anghenion iechyd cymhleth, mae'n bosibl y byddwch yn gymwys am Ofal Iechyd Parhaus y GIG, sy'n talu am eich gofal yn llawn.

#### Lwfans Gweini
Os ydych dros 65, gallwch hawlio Lwfans Gweini i helpu gyda chostau gofal. Mae'r symiau presennol yn:
- Cyfradd is: £72.65 yr wythnos
- Cyfradd uwch: £108.55 yr wythnos

### Ar gofal.wales

Ar [gofal.wales](/cartrefi-gofal), gallwch weld y ffioedd wythnosol ar gyfer cartrefi gofal sydd wedi hawlio eu rhestriad. Gallwch hefyd hidlo yn ôl pris i ddod o hyd i gartrefi o fewn eich cyllideb.

---

*Porwch y [cyfeiriadur](/cartrefi-gofal) i gymharu prisiau, neu darllenwch am [gymorth ariannol yr awdurdod lleol](/canllawiau/ariannu-gofal-awdurdod-lleol).*`,
    content_en: `## Care home costs in Wales 2026

Understanding care home costs can be complex. This guide explains the average costs in Wales and the financial support available.

### Average costs

Care home costs in Wales vary by type of care, location, and individual home.

#### Average weekly costs (2026):
- **Residential care**: £750–£1,050 per week
- **Nursing care**: £950–£1,400 per week
- **Dementia care**: £850–£1,250 per week
- **Respite care**: £800–£1,100 per week (for temporary stays)

These costs include accommodation, meals, and basic care. Some homes charge extra for activities, hairdressing, and other services.

### What's included in the fee?

Generally, care home fees include:
- Room (usually private)
- All meals and drinks
- Laundry and linen
- Personal care (help with washing, dressing, eating)
- Daily activities
- Utility bills

### Financial support

#### Local authority financial assessment
If your savings are below the threshold (currently £50,000 in Wales), your local authority may help pay for your care. Contact your local authority for a financial assessment.

#### NHS Continuing Healthcare
If you have complex health needs, you may be eligible for NHS Continuing Healthcare, which pays for your care in full.

#### Attendance Allowance
If you're over 65, you can claim Attendance Allowance to help with care costs. Current rates are:
- Lower rate: £72.65 per week
- Higher rate: £108.55 per week

### On gofal.wales

On [gofal.wales](/cartrefi-gofal), you can see weekly fees for care homes that have claimed their listing. You can also filter by price to find homes within your budget.

---

*Browse the [directory](/cartrefi-gofal) to compare prices, or read about [local authority funding](/canllawiau/ariannu-gofal-awdurdod-lleol).*`,
  },
  {
    slug: "y-cynnig-rhagweithiol",
    title_cy: "Y Cynnig Rhagweithiol — pam mae gofal Cymraeg yn bwysig",
    title_en: "The Active Offer — why Welsh-language care matters",
    excerpt_cy: "Beth yw'r Cynnig Rhagweithiol a pham mae derbyn gofal yn eich iaith eich hun yn hanfodol.",
    excerpt_en: "What is the Active Offer and why receiving care in your own language is essential.",
    published: "2026-04-01",
    category: "general",
    content_cy: `## Y Cynnig Rhagweithiol — pam mae gofal Cymraeg yn bwysig

Mae'r Cynnig Rhagweithiol yn egwyddor ganolog ym maes gofal cymdeithasol yng Nghymru. Mae'n golygu bod gwasanaethau Cymraeg yn cael eu cynnig yn rhagweithiol, heb i'r unigolyn orfod gofyn amdanynt.

### Beth yw'r Cynnig Rhagweithiol?

Y Cynnig Rhagweithiol yw:
- Cynnig gwasanaeth yn Gymraeg yn awtomatig
- Peidio â dibynnu ar yr unigolyn i ofyn am wasanaeth Cymraeg
- Creu amgylchedd lle mae'r Gymraeg yn weladwy ac yn naturiol

### Pam mae'n bwysig mewn gofal?

Pan fo person yn derbyn gofal, yn enwedig os oes ganddynt ddementia neu salwch, mae gallu cyfathrebu yn eu hiaith gyntaf yn:
- Lleihau pryder a dryswch
- Helpu i gynnal urddas a hunaniaeth
- Gwella ansawdd y gofal
- Creu teimlad o gartref

Mae ymchwil yn dangos bod pobl â dementia yn aml yn dychwelyd i'w hiaith gyntaf. Os mai Cymraeg yw honno, mae cael staff sy'n siarad Cymraeg yn hanfodol.

### Lefelau'r Cynnig Rhagweithiol ar gofal.wales

Ar [gofal.wales](/cartrefi-gofal), rydym yn graddio cartrefi gofal yn ôl eu lefel Cynnig Rhagweithiol:

- **Lefel 0** — Dim gwybodaeth am ddarpariaeth Gymraeg
- **Lefel 1** — Rhywfaint o Gymraeg — mae rhai aelodau o staff yn siarad Cymraeg
- **Lefel 2** — Cymraeg da — mae'r cartref yn gallu darparu gofal dyddiol trwy'r Gymraeg
- **Lefel 3** — Rhagorol yn Gymraeg — mae'r Gymraeg yn rhan ganolog o fywyd y cartref

### Sut i ddefnyddio gofal.wales i ddod o hyd i ofal Cymraeg

1. Ewch i'r [cyfeiriadur](/cartrefi-gofal)
2. Defnyddiwch yr hidlydd "Darpariaeth Gymraeg"
3. Dewiswch y lefel a ddymunwch
4. Porwch drwy'r canlyniadau

---

*Porwch y [cyfeiriadur](/cartrefi-gofal) i ddod o hyd i gartrefi gofal sy'n cynnig gofal yn Gymraeg.*`,
    content_en: `## The Active Offer — why Welsh-language care matters

The Active Offer is a central principle in social care in Wales. It means that Welsh-language services are offered proactively, without the individual having to ask for them.

### What is the Active Offer?

The Active Offer means:
- Offering a service in Welsh automatically
- Not relying on the individual to ask for a Welsh-language service
- Creating an environment where Welsh is visible and natural

### Why is it important in care?

When a person is receiving care, especially if they have dementia or illness, being able to communicate in their first language:
- Reduces anxiety and confusion
- Helps maintain dignity and identity
- Improves the quality of care
- Creates a sense of home

Research shows that people with dementia often revert to their first language. If that's Welsh, having Welsh-speaking staff is essential.

### Active Offer levels on gofal.wales

On [gofal.wales](/cartrefi-gofal), we rate care homes by their Active Offer level:

- **Level 0** — No information about Welsh-language provision
- **Level 1** — Some Welsh — some staff members speak Welsh
- **Level 2** — Good Welsh — the home can provide daily care through Welsh
- **Level 3** — Excellent Welsh — Welsh is a central part of the home's life

### How to use gofal.wales to find Welsh-language care

1. Go to the [directory](/cartrefi-gofal)
2. Use the "Welsh language" filter
3. Select your desired level
4. Browse the results

---

*Browse the [directory](/cartrefi-gofal) to find care homes that offer care through Welsh.*`,
  },
  {
    slug: "symud-rhiant-i-gartref-gofal",
    title_cy: "Symud rhiant i gartref gofal",
    title_en: "Moving a parent into a care home",
    excerpt_cy: "Canllaw emosiynol ac ymarferol i deuluoedd sy'n wynebu'r penderfyniad o symud rhiant i gartref gofal.",
    excerpt_en: "An emotional and practical guide for families facing the decision of moving a parent into a care home.",
    published: "2026-04-01",
    category: "general",
    content_cy: `## Symud rhiant i gartref gofal

Mae symud rhiant i gartref gofal yn un o'r penderfyniadau anoddaf y bydd llawer o deuluoedd yn ei wynebu. Mae'n naturiol teimlo euogrwydd, tristwch, a phryder. Ond weithiau, cartref gofal yw'r dewis gorau — i'ch rhiant ac i chi.

### Pryd mae'n amser ystyried cartref gofal?

Efallai ei bod yn amser ystyried cartref gofal os yw eich rhiant:
- Yn cael anawsterau cynyddol â gweithgareddau bob dydd
- Angen goruchwyliaeth 24 awr
- Yn dioddef o ddementia sy'n gwaethygu
- Wedi cael sawl cwympo yn y cartref
- Yn unig neu'n ynysig
- Angen gofal meddygol na allwch ei ddarparu gartref

### Y sgwrs anodd

Siaradwch â'ch rhiant yn gynnar. Peidiwch ag aros nes bod argyfwng:
- Dewiswch amser tawel, preifat
- Gwrandewch ar eu teimladau a'u pryderon
- Byddwch yn onest am eich pryderon chi
- Pwysleisiwch mai eu lles nhw sy'n bwysig

### Y broses

1. **Asesiad anghenion** — gofynnwch i'ch awdurdod lleol am asesiad
2. **Asesiad ariannol** — i weld a ydych yn gymwys am gymorth
3. **Ymchwilio** — defnyddiwch [gofal.wales](/cartrefi-gofal) i chwilio a chymharu
4. **Ymweld** — ewch i weld o leiaf 3 cartref
5. **Penderfynu** — gyda'ch rhiant os yn bosibl
6. **Paratoi** — helpu'ch rhiant i setlo yn eu cartref newydd

### Helpu'ch rhiant i setlo

Mae'r wythnosau cyntaf yn gallu bod yn anodd. Gallwch helpu trwy:
- Ymweld yn rheolaidd
- Dod ag eitemau personol — lluniau, blancedi, eitemau cyfarwydd
- Siarad â'r staff am arferion a hoffterau eich rhiant
- Bod yn amyneddgar — mae setlo'n cymryd amser

### Os yw'r Gymraeg yn bwysig

Os yw eich rhiant yn siarad Cymraeg, mae'n hanfodol dod o hyd i gartref lle gallant gyfathrebu yn eu hiaith. Defnyddiwch yr hidlydd Cynnig Rhagweithiol ar [gofal.wales](/cartrefi-gofal) i ddod o hyd i gartrefi sy'n cynnig gofal Cymraeg.

---

*Dechreuwch eich chwiliad ar [gofal.wales](/cartrefi-gofal) neu darllenwch am [gostau cartrefi gofal](/canllawiau/costau-cartrefi-gofal-cymru-2026).*`,
    content_en: `## Moving a parent into a care home

Moving a parent into a care home is one of the most difficult decisions many families will face. It's natural to feel guilt, sadness, and anxiety. But sometimes, a care home is the best choice — for your parent and for you.

### When is it time to consider a care home?

It may be time to consider a care home if your parent:
- Has increasing difficulties with daily activities
- Needs 24-hour supervision
- Suffers from worsening dementia
- Has had multiple falls at home
- Is lonely or isolated
- Needs medical care you can't provide at home

### The difficult conversation

Talk to your parent early. Don't wait until there's a crisis:
- Choose a quiet, private time
- Listen to their feelings and concerns
- Be honest about your concerns
- Emphasise that their wellbeing is what matters

### The process

1. **Needs assessment** — ask your local authority for an assessment
2. **Financial assessment** — to see if you're eligible for support
3. **Research** — use [gofal.wales](/cartrefi-gofal) to search and compare
4. **Visit** — go to see at least 3 homes
5. **Decide** — with your parent if possible
6. **Prepare** — help your parent settle in their new home

### Helping your parent settle

The first few weeks can be hard. You can help by:
- Visiting regularly
- Bringing personal items — photos, blankets, familiar things
- Talking to staff about your parent's routines and preferences
- Being patient — settling in takes time

### If Welsh is important

If your parent speaks Welsh, it's essential to find a home where they can communicate in their language. Use the Active Offer filter on [gofal.wales](/cartrefi-gofal) to find homes offering Welsh-language care.

---

*Start your search on [gofal.wales](/cartrefi-gofal) or read about [care home costs](/canllawiau/costau-cartrefi-gofal-cymru-2026).*`,
  },
  {
    slug: "gofal-dementia-cymru",
    title_cy: "Gofal dementia yng Nghymru — dod o hyd i gefnogaeth Gymraeg",
    title_en: "Dementia care in Wales — finding Welsh-language support",
    excerpt_cy: "Canllaw i deuluoedd sy'n chwilio am ofal dementia yng Nghymru, gyda ffocws ar ofal drwy'r Gymraeg.",
    excerpt_en: "A guide for families looking for dementia care in Wales, with a focus on care through Welsh.",
    published: "2026-04-01",
    category: "general",
    content_cy: `## Gofal dementia yng Nghymru

Mae dementia yn effeithio ar filoedd o bobl yng Nghymru. Os yw eich anwylyd wedi cael diagnosis o ddementia, mae dod o hyd i'r gofal cywir yn hanfodol — yn enwedig os yw'r Gymraeg yn rhan bwysig o'u bywyd.

### Pam mae gofal Cymraeg yn bwysig i bobl â dementia?

Mae ymchwil yn dangos:
- Mae pobl â dementia yn aml yn colli eu hail iaith ac yn dychwelyd i'w hiaith gyntaf
- Mae cyfathrebu yn yr iaith gyntaf yn lleihau pryder a dryswch
- Mae cof tymor hir yn aml yn gysylltiedig â'r iaith gyntaf
- Mae caneuon, straeon, ac atgofion plentyndod yn aml yn Gymraeg

### Mathau o ofal dementia

- **Gofal dementia preswyl** — cartref gofal arbenigol gyda staff wedi'u hyfforddi
- **Gofal cof** — uned arbennig o fewn cartref gofal mwy
- **Gofal dydd** — gwasanaeth dydd tra bod y gofalwr yn cael seibiant
- **Gofal cartref** — gofal yn eich cartref eich hun

### Dod o hyd i ofal dementia ar gofal.wales

Ar [gofal.wales](/cartrefi-gofal):
1. Chwiliwch am gartrefi gofal yn eich ardal
2. Hidlwch yn ôl "Dementia" o dan Math o Ofal
3. Hidlwch yn ôl lefel y Cynnig Rhagweithiol
4. Edrychwch ar raddfeydd CIW pob cartref

### Cwestiynau i'w gofyn wrth ymweld

- Faint o staff sydd wedi'u hyfforddi mewn gofal dementia?
- A oes gardd ddiogel?
- Pa weithgareddau sy'n cael eu darparu ar gyfer pobl â dementia?
- A oes staff sy'n siarad Cymraeg?
- A yw'r Gymraeg yn rhan o fywyd bob dydd y cartref?

---

*Dechreuwch chwilio am ofal dementia ar [gofal.wales](/cartrefi-gofal).*`,
    content_en: `## Dementia care in Wales

Dementia affects thousands of people in Wales. If your loved one has been diagnosed with dementia, finding the right care is essential — especially if Welsh is an important part of their life.

### Why is Welsh-language care important for people with dementia?

Research shows:
- People with dementia often lose their second language and revert to their first
- Communicating in the first language reduces anxiety and confusion
- Long-term memory is often linked to the first language
- Songs, stories, and childhood memories are often in Welsh

### Types of dementia care

- **Residential dementia care** — specialist care home with trained staff
- **Memory care** — specialist unit within a larger care home
- **Day care** — daytime service while the carer gets a break
- **Home care** — care in your own home

### Finding dementia care on gofal.wales

On [gofal.wales](/cartrefi-gofal):
1. Search for care homes in your area
2. Filter by "Dementia" under Care Type
3. Filter by Active Offer level
4. Check CIW ratings for each home

### Questions to ask when visiting

- How many staff are trained in dementia care?
- Is there a secure garden?
- What activities are provided for people with dementia?
- Are there Welsh-speaking staff?
- Is Welsh part of the home's daily life?

---

*Start searching for dementia care on [gofal.wales](/cartrefi-gofal).*`,
  },
  {
    slug: "ariannu-gofal-awdurdod-lleol",
    title_cy: "Ariannu gofal gan yr awdurdod lleol yng Nghymru",
    title_en: "Local authority funding for care in Wales",
    excerpt_cy: "Popeth sydd angen i chi ei wybod am sut mae awdurdodau lleol yng Nghymru yn helpu i dalu am ofal.",
    excerpt_en: "Everything you need to know about how local authorities in Wales help pay for care.",
    published: "2026-04-01",
    category: "general",
    content_cy: `## Ariannu gofal gan yr awdurdod lleol yng Nghymru

Os ydych chi neu aelod o'ch teulu angen gofal, mae'n bosibl y bydd eich awdurdod lleol yn helpu i dalu amdano. Dyma sut mae'r system yn gweithio yng Nghymru.

### Yr asesiad anghenion

Y cam cyntaf yw gofyn am asesiad anghenion gan eich awdurdod lleol. Maent yn asesu:
- Pa fath o ofal sydd ei angen
- Faint o ofal sydd ei angen
- A allwch gael y gofal yn eich cartref neu a oes angen cartref gofal

Mae gennych hawl i asesiad. Mae am ddim. Cysylltwch â'ch awdurdod lleol i ofyn am un.

### Yr asesiad ariannol

Ar ôl yr asesiad anghenion, cewch asesiad ariannol. Mae hwn yn edrych ar:
- Eich incwm (pensiynau, budd-daliadau)
- Eich cynilion a'ch buddsoddiadau
- Gwerth eich cartref (mewn rhai amgylchiadau)

### Y trothwy cyfalaf yng Nghymru

Yng Nghymru:
- Os yw eich cyfalaf yn **llai na £50,000**, efallai y bydd yr awdurdod lleol yn helpu
- Os yw eich cyfalaf yn **fwy na £50,000**, byddwch yn talu'r costau llawn eich hun
- Mae'r trothwy hwn yn uwch nag yn Lloegr (£23,250)

### Beth os oes gennych gartref?

Os ydych yn symud i gartref gofal yn barhaol:
- Ni fydd gwerth eich cartref yn cael ei gynnwys am y 12 wythnos gyntaf
- Os yw partner neu ddibynnydd yn dal i fyw yno, ni chaiff ei gynnwys o gwbl
- Gallwch gael Cytundeb Taliad Gohiriedig — mae'r awdurdod lleol yn talu nawr a chewch dalu'n ôl yn nes ymlaen

### Sut i drefnu asesiad

Cysylltwch â'ch awdurdod lleol:
- Ffoniwch eu hadran gwasanaethau cymdeithasol
- Ymwelwch â'u gwefan
- Gofynnwch i'ch meddyg teulu am gyfeiriad

---

*Porwch ein [cyfeiriadur cartrefi gofal](/cartrefi-gofal) i ddod o hyd i gartrefi yn eich sir, neu darllenwch am [gostau cartrefi gofal](/canllawiau/costau-cartrefi-gofal-cymru-2026).*`,
    content_en: `## Local authority funding for care in Wales

If you or a family member need care, your local authority may help pay for it. Here's how the system works in Wales.

### The needs assessment

The first step is to request a needs assessment from your local authority. They assess:
- What type of care is needed
- How much care is needed
- Whether care can be provided at home or a care home is needed

You have a right to an assessment. It's free. Contact your local authority to request one.

### The financial assessment

After the needs assessment, you'll have a financial assessment. This looks at:
- Your income (pensions, benefits)
- Your savings and investments
- The value of your home (in some circumstances)

### The capital threshold in Wales

In Wales:
- If your capital is **below £50,000**, the local authority may help
- If your capital is **above £50,000**, you'll pay the full cost yourself
- This threshold is higher than in England (£23,250)

### What if you own a home?

If you're moving into a care home permanently:
- Your home's value won't be included for the first 12 weeks
- If a partner or dependant still lives there, it won't be included at all
- You can get a Deferred Payment Agreement — the local authority pays now and you pay back later

### How to arrange an assessment

Contact your local authority:
- Phone their social services department
- Visit their website
- Ask your GP for a referral

---

*Browse our [care home directory](/cartrefi-gofal) to find homes in your county, or read about [care home costs](/canllawiau/costau-cartrefi-gofal-cymru-2026).*`,
  },
  {
    slug: "beth-iw-edrych-amdano",
    title_cy: "Beth i edrych amdano wrth ymweld â chartref gofal",
    title_en: "What to look for when visiting a care home",
    excerpt_cy: "Rhestr wirio hanfodol ar gyfer ymweld â chartref gofal, o'r amgylchedd i'r staff i'r gweithgareddau.",
    excerpt_en: "An essential checklist for visiting a care home, from the environment to staff to activities.",
    published: "2026-04-01",
    category: "general",
    content_cy: `## Beth i edrych amdano wrth ymweld â chartref gofal

Mae ymweliad personol â chartref gofal yn hanfodol cyn gwneud penderfyniad. Dyma restr wirio i'ch helpu i asesu pob cartref.

### Yr argraff gyntaf

- A yw'r cartref yn lân ac yn daclus?
- A yw'n arogli'n ffres?
- A yw'n teimlo'n groesawgar ac yn gartrefol?
- A yw'r staff yn gwenu ac yn gyfeillgar?
- A yw'r preswylwyr yn edrych yn hapus ac yn gyfforddus?

### Y staff

- A yw'r staff yn ymddangos yn ofalgar ac yn barchus?
- A oes digon o staff ar ddyletswydd?
- A ydynt yn galw preswylwyr wrth eu henwau?
- A oes staff sy'n siarad Cymraeg? (Os yw hyn yn bwysig)
- Gofynnwch am gymhareb staff:preswylwyr

### Yr ystafelloedd

- A yw'r ystafelloedd gwely yn olau ac yn gyfforddus?
- A all preswylwyr ddod â'u celfi a'u pethau personol?
- A oes ystafelloedd ymolchi preifat?
- A yw'r ystafelloedd yn ddigon mawr?

### Y gofal

- Gofynnwch sut mae cynlluniau gofal yn cael eu llunio
- A yw preswylwyr yn gallu dewis pryd i godi a mynd i'r gwely?
- Sut mae meddyginiaeth yn cael ei rheoli?
- Beth sy'n digwydd mewn argyfwng?

### Bwyd a diod

- Gofynnwch am weld bwydlen yr wythnos
- A oes dewis o brydau?
- A yw anghenion diet arbennig yn cael eu diwallu?
- A all preswylwyr gael byrbrydau a diodydd pryd bynnag y mynnant?

### Gweithgareddau

- Pa weithgareddau sy'n cael eu darparu?
- A oes tripiau allan?
- A yw gweithgareddau'n addas ar gyfer gwahanol alluoedd?
- A oes gardd y gall preswylwyr ei defnyddio?

### Ymwelwyr

- Beth yw'r oriau ymweld?
- A all teulu ymweld ar unrhyw adeg?
- A oes man preifat i ymwelwyr?

---

*Dewch o hyd i gartrefi gofal i'w hymweld ar [gofal.wales](/cartrefi-gofal).*`,
    content_en: `## What to look for when visiting a care home

A personal visit to a care home is essential before making a decision. Here's a checklist to help you assess each home.

### First impressions

- Is the home clean and tidy?
- Does it smell fresh?
- Does it feel welcoming and homely?
- Are the staff smiling and friendly?
- Do the residents look happy and comfortable?

### The staff

- Do staff appear caring and respectful?
- Are there enough staff on duty?
- Do they call residents by name?
- Are there Welsh-speaking staff? (If this is important)
- Ask about the staff-to-resident ratio

### The rooms

- Are bedrooms bright and comfortable?
- Can residents bring their own furniture and personal items?
- Are there private bathrooms?
- Are rooms large enough?

### The care

- Ask how care plans are created
- Can residents choose when to get up and go to bed?
- How is medication managed?
- What happens in an emergency?

### Food and drink

- Ask to see the week's menu
- Is there a choice of meals?
- Are special dietary needs met?
- Can residents have snacks and drinks whenever they want?

### Activities

- What activities are provided?
- Are there trips out?
- Are activities suitable for different abilities?
- Is there a garden residents can use?

### Visitors

- What are the visiting hours?
- Can family visit at any time?
- Is there a private space for visitors?

---

*Find care homes to visit on [gofal.wales](/cartrefi-gofal).*`,
  },
  {
    slug: "gofal-iechyd-parhaus-gig-cymru",
    title_cy: "Gofal Iechyd Parhaus y GIG yng Nghymru",
    title_en: "NHS Continuing Healthcare in Wales",
    excerpt_cy: "Canllaw i Ofal Iechyd Parhaus y GIG yng Nghymru — pwy sy'n gymwys a sut i wneud cais.",
    excerpt_en: "A guide to NHS Continuing Healthcare in Wales — who's eligible and how to apply.",
    published: "2026-04-01",
    category: "general",
    content_cy: `## Gofal Iechyd Parhaus y GIG yng Nghymru

Mae Gofal Iechyd Parhaus y GIG (CHC) yn becyn gofal a ariennir yn llawn gan y GIG ar gyfer pobl sydd ag anghenion iechyd cymhleth a pharhaus.

### Beth yw CHC?

Os ydych yn gymwys am CHC, mae'r GIG yn talu am eich holl anghenion gofal, gan gynnwys:
- Gofal mewn cartref gofal (preswyl neu nyrsio)
- Gofal yn eich cartref eich hun
- Gofal mewn hosbis

Mae hyn yn golygu nad ydych yn talu ffioedd cartref gofal — mae'r GIG yn talu popeth.

### Pwy sy'n gymwys?

Mae CHC ar gyfer pobl ag anghenion iechyd cymhleth. Gallai hyn gynnwys:
- Dementia difrifol
- Salwch terfynol
- Cyflyrau niwrolegol cymhleth
- Anghenion gofal nyrsio dwys

### Y broses asesu

1. **Rhestr wirio** — mae gweithiwr iechyd proffesiynol yn cwblhau rhestr wirio i weld a yw'n werth mynd ymhellach
2. **Asesiad llawn** — tîm amlddisgyblaethol yn asesu eich anghenion
3. **Panel** — panel yn gwneud y penderfyniad terfynol

### Os cewch eich gwrthod

Os cewch eich gwrthod, mae gennych yr hawl i apelio. Cewch ofyn am adolygiad o'r penderfyniad.

---

*Porwch ein [cyfeiriadur](/cartrefi-gofal) i ddod o hyd i gartrefi gofal yn eich ardal.*`,
    content_en: `## NHS Continuing Healthcare in Wales

NHS Continuing Healthcare (CHC) is a package of care fully funded by the NHS for people with complex and ongoing health needs.

### What is CHC?

If you qualify for CHC, the NHS pays for all your care needs, including:
- Care in a care home (residential or nursing)
- Care in your own home
- Care in a hospice

This means you don't pay care home fees — the NHS pays for everything.

### Who is eligible?

CHC is for people with complex health needs. This could include:
- Severe dementia
- Terminal illness
- Complex neurological conditions
- Intensive nursing care needs

### The assessment process

1. **Checklist** — a health professional completes a checklist to see if it's worth proceeding
2. **Full assessment** — a multidisciplinary team assesses your needs
3. **Panel** — a panel makes the final decision

### If you're refused

If you're refused, you have the right to appeal. You can request a review of the decision.

---

*Browse our [directory](/cartrefi-gofal) to find care homes in your area.*`,
  },
  {
    slug: "gofal-seibiant-cymru",
    title_cy: "Gofal seibiant yng Nghymru",
    title_en: "Respite care in Wales",
    excerpt_cy: "Canllaw i ofal seibiant yng Nghymru — beth ydyw, pwy all ei ddefnyddio, a sut i ddod o hyd iddo.",
    excerpt_en: "A guide to respite care in Wales — what it is, who can use it, and how to find it.",
    published: "2026-04-01",
    category: "general",
    content_cy: `## Gofal seibiant yng Nghymru

Mae gofal seibiant yn cynnig arhosiad dros dro mewn cartref gofal, gan roi seibiant i'r gofalwr a gofal diogel i'r unigolyn.

### Beth yw gofal seibiant?

Mae gofal seibiant yn:
- Arhosiad dros dro mewn cartref gofal (dyddiau neu wythnosau)
- Gofal proffesiynol tra bod y gofalwr yn cael seibiant
- Cyfle i'r unigolyn brofi amgylchedd newydd

### Pam mae gofal seibiant yn bwysig?

Mae gofalwyr yn wynebu straen a blinder. Mae seibiant yn:
- Helpu gofalwyr i orffwys ac adfer
- Atal llosgi allan
- Gwella iechyd meddwl y gofalwr
- Sicrhau bod yr unigolyn yn derbyn gofal da

### Sut i ddod o hyd i ofal seibiant

Ar [gofal.wales](/cartrefi-gofal):
1. Chwiliwch am gartrefi gofal yn eich ardal
2. Hidlwch yn ôl "Seibiant" o dan Math o Ofal
3. Cysylltwch â'r cartref i drafod argaeledd a phrisiau

### Costau gofal seibiant

- Mae costau'n debyg i ofal preswyl — £800–£1,100 yr wythnos
- Mae'n bosibl y bydd eich awdurdod lleol yn helpu i dalu
- Gofynnwch am asesiad gofalwr i weld pa gefnogaeth sydd ar gael

---

*Dewch o hyd i gartrefi gofal sy'n cynnig gofal seibiant ar [gofal.wales](/cartrefi-gofal).*`,
    content_en: `## Respite care in Wales

Respite care offers a temporary stay in a care home, giving the carer a break and the individual safe, professional care.

### What is respite care?

Respite care is:
- A temporary stay in a care home (days or weeks)
- Professional care while the carer gets a break
- An opportunity for the individual to experience a new environment

### Why is respite care important?

Carers face stress and fatigue. Respite:
- Helps carers rest and recover
- Prevents burnout
- Improves the carer's mental health
- Ensures the individual receives good care

### How to find respite care

On [gofal.wales](/cartrefi-gofal):
1. Search for care homes in your area
2. Filter by "Respite" under Care Type
3. Contact the home to discuss availability and prices

### Respite care costs

- Costs are similar to residential care — £800–£1,100 per week
- Your local authority may help pay
- Ask for a carer's assessment to see what support is available

---

*Find care homes offering respite care on [gofal.wales](/cartrefi-gofal).*`,
  },

  // ── County Guides ──────────────────────────────────────────────

  {
    slug: "cartrefi-gofal-sir-gaerfyrddin",
    title_cy: "Cartrefi gofal yn Sir Gaerfyrddin — Canllaw lleol",
    title_en: "Care homes in Carmarthenshire — Local guide",
    excerpt_cy: "Canllaw cynhwysfawr i gartrefi gofal yn Sir Gaerfyrddin, gan gynnwys gwybodaeth am drefi, y Gymraeg, graddfeydd CIW a sut i ddod o hyd i'r cartref gorau.",
    excerpt_en: "A comprehensive guide to care homes in Carmarthenshire, including information on towns, Welsh language, CIW ratings and how to find the best home.",
    published: "2026-04-01",
    category: "county",
    related_county: "sir-gaerfyrddin",
    content_cy: `## Cartrefi gofal yn Sir Gaerfyrddin — Canllaw cynhwysfawr

Mae Sir Gaerfyrddin yn un o siroedd mwyaf Cymru, ac mae'n gartref i gymunedau bywiog a thirwedd amrywiol sy'n ymestyn o arfordir Bae Caerfyrddin i fynyddoedd y Mynydd Du. Mae'r sir yn enwog am ei threftadaeth ddiwylliannol gyfoethog, ei marchnadoedd traddodiadol, a'i hymrwymiad cryf i'r iaith Gymraeg. Yn ôl Cyfrifiad 2021, mae 43.6% o boblogaeth y sir yn siarad Cymraeg, sy'n golygu bod darpariaeth gofal drwy gyfrwng y Gymraeg yn hynod bwysig i lawer o deuluoedd.

### Pam dewis cartref gofal yn Sir Gaerfyrddin?

Mae Sir Gaerfyrddin yn cynnig amgylchedd tawel a chroesawgar i bobl hŷn. Gyda threfi marchnad hanesyddol fel Caerfyrddin, Llanelli, a Llandeilo, mae digon o ddewis wrth chwilio am gartref gofal. Mae llawer o gartrefi gofal y sir wedi'u lleoli mewn ardaloedd gwledig prydferth, tra bod eraill yn agos at ganol trefi gyda mynediad hawdd at siopau, meddygfeydd, ac ysbytai.

Mae Caerfyrddin ei hun yn un o drefi hynaf Cymru, gyda hanes sy'n ymestyn yn ôl i gyfnod y Rhufeiniaid. Mae'r dref yn ganolfan ranbarthol bwysig gydag Ysbyty Glangwili yn darparu gwasanaethau iechyd cynhwysfawr. Mae Llanelli, y dref fwyaf yn y sir, yn cynnig amrywiaeth eang o gyfleusterau modern gan gynnwys y Ffwrnes, Parc y Scarlets, a Pharc Gwledig y Mileniwm.

### Y Gymraeg mewn cartrefi gofal

Gyda 43.6% o boblogaeth Sir Gaerfyrddin yn siarad Cymraeg, mae gallu cyfathrebu yn Gymraeg yn hanfodol mewn llawer o gartrefi gofal. Mae hyn yn arbennig o wir i breswylwyr â dementia, sy'n aml yn dychwelyd i'w mamiaith wrth i'r cyflwr ddatblygu.

Mae'r Cynnig Rhagweithiol yn bolisi allweddol yng Nghymru sy'n sicrhau bod gwasanaethau cyhoeddus ar gael yn Gymraeg heb i bobl orfod gofyn amdanynt. Wrth chwilio am gartref gofal yn Sir Gaerfyrddin, mae'n bwysig gofyn am lefel y ddarpariaeth Gymraeg. Chwiliwch am gartrefi sydd â staff sy'n siarad Cymraeg yn rhugl a rhai sy'n cynnig gweithgareddau a bywyd cymdeithasol drwy gyfrwng y Gymraeg.

Gallwch chwilio am gartrefi gofal sy'n cynnig gofal drwy'r Gymraeg ar [gofal.wales/cartrefi-gofal/sir-gaerfyrddin](/cartrefi-gofal/sir-gaerfyrddin).

### Trefi a chymunedau allweddol

**Caerfyrddin** — Tref sirol gyda nifer o gartrefi gofal preswyl a nyrsio. Mae'r dref yn cynnig mynediad at Ysbyty Glangwili a gwasanaethau iechyd cynhwysfawr. Mae marchnad dan do Caerfyrddin yn ganolbwynt cymdeithasol poblogaidd.

**Llanelli** — Y dref fwyaf yn y sir, gyda chartrefi gofal o safon uchel a mynediad at Ysbyty'r Tywysog Philip. Mae'r dref yn adnabyddus am Barc y Scarlets a Pharc Gwledig y Mileniwm, sy'n cynnig cyfleoedd i breswylwyr fwynhau'r awyr agored.

**Llandeilo** — Tref farchnad hardd yn Nyffryn Tywi, yn agos at Gastell Dinefwr a Gardd Fotaneg Genedlaethol Cymru. Mae'r ardal yn cynnig amgylchedd tawel a golygfeydd godidog.

**Rhydaman** — Tref ym mhen uchaf Cwm Aman gyda chymuned gref a gwasanaethau lleol da.

**Sanclêr** — Tref farchnad hanesyddol rhwng Caerfyrddin a Hwlffordd, yn cynnig bywyd gwledig tawel.

**Cydweli** — Tref hanesyddol â chastell enwog, ar lan Afon Gwendraeth.

### Graddfeydd CIW yn Sir Gaerfyrddin

Mae Arolygiaeth Gofal Cymru (CIW) yn arolygu pob cartref gofal cofrestredig yn y sir. Mae CIW yn graddio cartrefi ar bedwar maes allweddol:

- **Llesiant** — a yw preswylwyr yn hapus, yn iach, ac yn cael eu parchu?
- **Gofal a Chymorth** — ansawdd y gofal a ddarperir gan y staff
- **Arweinyddiaeth a Rheolaeth** — pa mor dda y mae'r cartref yn cael ei redeg
- **Yr Amgylchedd Gofal** — a yw'r adeilad yn ddiogel, yn lân, ac yn addas?

Wrth gymharu cartrefi gofal yn Sir Gaerfyrddin, edrychwch ar yr adroddiadau CIW diweddaraf ar [gofal.wales](/cartrefi-gofal). Mae ein cyfeiriadur yn dangos graddfeydd CIW ar gyfer pob cartref, gan eich helpu i wneud penderfyniad gwybodus.

### Mathau o ofal sydd ar gael

Mae cartrefi gofal yn Sir Gaerfyrddin yn cynnig amrywiaeth eang o wasanaethau:

- **Gofal preswyl** — cymorth gyda bywyd bob dydd, bwyd, a gweithgareddau
- **Gofal nyrsio** — gofal meddygol 24 awr gan nyrsys cofrestredig
- **Gofal dementia** — unedau arbenigol gyda staff hyfforddedig
- **Gofal seibiant** — arhosiad dros dro i roi gorffwys i ofalwyr teuluol
- **Gofal iechyd meddwl** — cymorth arbenigol ar gyfer cyflyrau iechyd meddwl

### Cyllido gofal yn Sir Gaerfyrddin

Mae Cyngor Sir Gaerfyrddin yn gyfrifol am asesu anghenion gofal a chyfrannu at gostau lle bo'n gymwys. Os oes gennych eiddo neu gynilion o dan y trothwy (presennol: £50,000), gallech fod yn gymwys am gymorth ariannol gan y cyngor.

Mae'n bwysig cael asesiad anghenion gofal gan yr awdurdod lleol cyn dewis cartref. Gall hyn eich helpu i ddeall pa gymorth ariannol sydd ar gael.

### Sut i chwilio am gartref gofal yn Sir Gaerfyrddin

1. Ewch i [gofal.wales/cartrefi-gofal/sir-gaerfyrddin](/cartrefi-gofal/sir-gaerfyrddin) i weld rhestr lawn o gartrefi gofal cofrestredig yn y sir
2. Defnyddiwch y hidlyddion i chwilio yn ôl math o ofal, lleoliad, a graddfeydd CIW
3. Cymharwch gartrefi gan ddefnyddio ein tudalennau manwl sy'n cynnwys gwybodaeth am staff, cyfleusterau, a graddfeydd
4. Cysylltwch â chartrefi yn uniongyrchol drwy ein ffurflen ymholiad ar-lein
5. Trefnwch ymweliad i weld y cartref drosoch eich hun

### Awgrymiadau wrth ymweld â chartref gofal

- Ewch ar adeg prysur (amser cinio) i weld sut mae'r cartref yn gweithredu'n wirioneddol
- Siaradwch â phreswylwyr a'u teuluoedd os yn bosibl
- Gofynnwch am y gymhareb staff-i-breswylwyr
- Gwiriwch a oes gweithgareddau rheolaidd yn cael eu cynnig
- Holwch am y ddarpariaeth Gymraeg a lefel y Cynnig Rhagweithiol
- Edrychwch ar adroddiad CIW diweddaraf y cartref

### Cysylltu ag adnoddau lleol

Mae nifer o sefydliadau lleol a all eich helpu yn y broses o ddod o hyd i gartref gofal yn Sir Gaerfyrddin:

- **Cyngor Sir Gaerfyrddin** — Gwasanaethau Oedolion
- **Bwrdd Iechyd Prifysgol Hywel Dda** — sy'n gwasanaethu'r sir gyfan
- **Age Cymru Sir Gâr** — cyngor a chymorth i bobl hŷn
- **Alzheimer's Society Cymru** — cymorth i bobl â dementia a'u gofalwyr

---

*Chwiliwch am gartrefi gofal yn Sir Gaerfyrddin ar [gofal.wales/cartrefi-gofal/sir-gaerfyrddin](/cartrefi-gofal/sir-gaerfyrddin). Cymharwch raddfeydd CIW, gweld ffotograffau, a gwneud ymholiad heddiw.*`,

    content_en: `## Care homes in Carmarthenshire — A comprehensive guide

Carmarthenshire is one of the largest counties in Wales, home to vibrant communities and a diverse landscape stretching from the Carmarthen Bay coastline to the Black Mountain. The county is renowned for its rich cultural heritage, traditional markets, and strong commitment to the Welsh language. According to the 2021 Census, 43.6% of the county's population speaks Welsh, making Welsh-medium care provision extremely important for many families.

### Why choose a care home in Carmarthenshire?

Carmarthenshire offers a peaceful and welcoming environment for older people. With historic market towns such as Carmarthen, Llanelli, and Llandeilo, there is plenty of choice when searching for a care home. Many of the county's care homes are located in beautiful rural settings, while others are close to town centres with easy access to shops, GP surgeries, and hospitals.

Carmarthen itself is one of the oldest towns in Wales, with a history stretching back to Roman times. The town is an important regional centre with Glangwili Hospital providing comprehensive health services. Llanelli, the largest town in the county, offers a wide range of modern facilities including the Ffwrnes theatre, Parc y Scarlets, and the Millennium Coastal Park.

### Welsh language in care homes

With 43.6% of Carmarthenshire's population speaking Welsh, the ability to communicate in Welsh is essential in many care homes. This is particularly true for residents with dementia, who often revert to their first language as the condition progresses.

The Active Offer (Cynnig Rhagweithiol) is a key policy in Wales that ensures public services are available in Welsh without people having to ask. When searching for a care home in Carmarthenshire, it is important to ask about the level of Welsh language provision. Look for homes with fluent Welsh-speaking staff and those that offer activities and social life through the medium of Welsh.

You can search for care homes offering Welsh-medium care at [gofal.wales/cartrefi-gofal/sir-gaerfyrddin](/cartrefi-gofal/sir-gaerfyrddin).

### Key towns and communities

**Carmarthen** — The county town with several residential and nursing care homes. The town offers access to Glangwili Hospital and comprehensive health services. Carmarthen's indoor market is a popular social hub.

**Llanelli** — The largest town in the county, with high-quality care homes and access to Prince Philip Hospital. The town is known for Parc y Scarlets and the Millennium Coastal Park, offering residents opportunities to enjoy the outdoors.

**Llandeilo** — A beautiful market town in the Tywi Valley, close to Dinefwr Castle and the National Botanic Garden of Wales. The area offers a peaceful environment and stunning views.

**Ammanford** — A town at the top of the Amman Valley with a strong community and good local services.

**St Clears** — A historic market town between Carmarthen and Haverfordwest, offering a quiet rural lifestyle.

**Kidwelly** — A historic town with a famous castle, on the banks of the River Gwendraeth.

### CIW ratings in Carmarthenshire

Care Inspectorate Wales (CIW) inspects every registered care home in the county. CIW rates homes on four key areas:

- **Well-being** — are residents happy, healthy, and respected?
- **Care and Support** — the quality of care provided by staff
- **Leadership and Management** — how well the home is run
- **The Care Environment** — is the building safe, clean, and suitable?

When comparing care homes in Carmarthenshire, look at the latest CIW reports on [gofal.wales](/cartrefi-gofal). Our directory displays CIW ratings for every home, helping you make an informed decision.

### Types of care available

Care homes in Carmarthenshire offer a wide range of services:

- **Residential care** — support with daily living, meals, and activities
- **Nursing care** — 24-hour medical care from registered nurses
- **Dementia care** — specialist units with trained staff
- **Respite care** — temporary stays to give family carers a break
- **Mental health care** — specialist support for mental health conditions

### Funding care in Carmarthenshire

Carmarthenshire County Council is responsible for assessing care needs and contributing to costs where eligible. If you have property or savings below the threshold (currently £50,000), you may be eligible for financial support from the council.

It is important to have a care needs assessment from the local authority before choosing a home. This can help you understand what financial support is available.

### How to search for a care home in Carmarthenshire

1. Visit [gofal.wales/cartrefi-gofal/sir-gaerfyrddin](/cartrefi-gofal/sir-gaerfyrddin) to see a full list of registered care homes in the county
2. Use the filters to search by care type, location, and CIW ratings
3. Compare homes using our detailed pages that include information about staff, facilities, and ratings
4. Contact homes directly through our online enquiry form
5. Arrange a visit to see the home for yourself

### Tips when visiting a care home

- Visit at a busy time (lunchtime) to see how the home truly operates
- Speak to residents and their families if possible
- Ask about the staff-to-resident ratio
- Check that regular activities are offered
- Ask about Welsh language provision and the Active Offer level
- Look at the home's latest CIW inspection report

### Connecting with local resources

Several local organisations can help you in the process of finding a care home in Carmarthenshire:

- **Carmarthenshire County Council** — Adult Services
- **Hywel Dda University Health Board** — serving the entire county
- **Age Cymru Dyfed** — advice and support for older people
- **Alzheimer's Society Cymru** — support for people with dementia and their carers

---

*Search for care homes in Carmarthenshire on [gofal.wales/cartrefi-gofal/sir-gaerfyrddin](/cartrefi-gofal/sir-gaerfyrddin). Compare CIW ratings, view photos, and make an enquiry today.*`,
  },

  {
    slug: "cartrefi-gofal-gwynedd",
    title_cy: "Cartrefi gofal yng Ngwynedd — Canllaw lleol",
    title_en: "Care homes in Gwynedd — Local guide",
    excerpt_cy: "Canllaw cynhwysfawr i gartrefi gofal yng Ngwynedd, y sir â'r ganran uchaf o siaradwyr Cymraeg yng Nghymru, gan gynnwys graddfeydd CIW a gwasanaethau lleol.",
    excerpt_en: "A comprehensive guide to care homes in Gwynedd, the county with the highest percentage of Welsh speakers in Wales, including CIW ratings and local services.",
    published: "2026-04-01",
    category: "county",
    related_county: "gwynedd",
    content_cy: `## Cartrefi gofal yng Ngwynedd — Canllaw cynhwysfawr

Mae Gwynedd yn sir arbennig yng ngogledd-orllewin Cymru, yn ymestyn o arfordir Bae Ceredigion i gopaon Eryri. Dyma galon y Gymraeg — gyda 64.4% o'r boblogaeth yn siarad Cymraeg yn ôl Cyfrifiad 2021, Gwynedd sydd â'r ganran uchaf o siaradwyr Cymraeg o unrhyw sir yng Nghymru. Mae hyn yn golygu bod gofal drwy gyfrwng y Gymraeg nid yn unig yn ddymunol ond yn hanfodol i'r rhan fwyaf o breswylwyr.

### Pam dewis cartref gofal yng Ngwynedd?

Mae Gwynedd yn cynnig amgylchedd unigryw sy'n cyfuno harddwch naturiol Parc Cenedlaethol Eryri gyda chymunedau Cymraeg cryf a gwasanaethau iechyd o safon. Mae trefi fel Bangor, Caernarfon, Pwllheli, a Blaenau Ffestiniog yn darparu amrywiaeth o gartrefi gofal mewn lleoliadau gwahanol — o drefi prifysgol bywiog i bentrefi arfordirol tawel.

Mae Ysbyty Gwynedd ym Mangor yn darparu gwasanaethau iechyd cynhwysfawr i'r sir gyfan, tra bod ysbytai cymunedol llai yn gwasanaethu ardaloedd mwy gwledig. Mae Prifysgol Bangor hefyd yn cynnal ymchwil blaengar ym maes gofal dementia a gerontoleg, sy'n dylanwadu'n gadarnhaol ar ansawdd gofal yn yr ardal.

### Y Gymraeg — calon gofal yng Ngwynedd

Gyda 64.4% yn siarad Cymraeg, y Gymraeg yw iaith naturiol bywyd bob dydd yng Ngwynedd. I lawer o bobl hŷn yn y sir, Cymraeg yw eu hunig iaith gyfforddus, yn enwedig wrth iddynt heneiddio neu ddatblygu cyflyrau fel dementia. Mae ymchwil yn dangos bod pobl â dementia yn aml yn dychwelyd i'w mamiaith, gan wneud gofal Cymraeg yn anghenraid clinigol, nid yn ddewis.

Mae'r Cynnig Rhagweithiol yn arbennig o bwysig yng Ngwynedd. Dylai pob cartref gofal yn y sir fod yn gallu darparu gofal llawn drwy gyfrwng y Gymraeg. Wrth chwilio am gartref gofal, gofynnwch:
- A yw'r staff i gyd yn siarad Cymraeg?
- A yw gweithgareddau a bywyd cymdeithasol yn cael eu cynnal yn Gymraeg?
- A yw dogfennau a chynlluniau gofal ar gael yn Gymraeg?

Chwiliwch am gartrefi gofal Cymraeg yng Ngwynedd ar [gofal.wales/cartrefi-gofal/gwynedd](/cartrefi-gofal/gwynedd).

### Trefi a chymunedau allweddol

**Bangor** — Dinas brifysgol fwyaf gogledd Cymru, gyda chartrefi gofal o safon uchel a mynediad at Ysbyty Gwynedd. Mae'r pier Fictoraidd a'r Stryd Fawr yn cynnig bywyd bywiog.

**Caernarfon** — Tref hanesyddol gyda chastell UNESCO, cymuned Gymraeg gref iawn, a chartrefi gofal rhagorol. Y Maes yw calon gymdeithasol y dref.

**Pwllheli** — Tref farchnad ar Benrhyn Llŷn gydag arfordir hardd. Mae'r ardal yn dawel ac yn ddelfrydol i bobl sy'n hoffi'r awyr agored.

**Blaenau Ffestiniog** — Tref yn y mynyddoedd gyda chymuned agos a threftadaeth lechi cyfoethog.

**Porthmadog** — Tref arfordirol brydferth ger Traeth Mawr, gyda mynediad at Reilffordd Ffestiniog a Rheilffordd Eryri.

**Bethesda** — Pentref ger Bangor gyda chymuned gref a mynediad at Eryri.

**Dolgellau** — Tref farchnad hardd ym mhen deheuol Eryri gyda golygfeydd godidog o Gadair Idris.

### Graddfeydd CIW yng Ngwynedd

Mae Arolygiaeth Gofal Cymru (CIW) yn arolygu pob cartref gofal cofrestredig yng Ngwynedd. Mae'r arolygiadau yn edrych ar:

- **Llesiant** — a yw preswylwyr yn hapus, yn iach, ac yn cael eu parchu?
- **Gofal a Chymorth** — ansawdd y gofal clinigol a phersonol
- **Arweinyddiaeth a Rheolaeth** — effeithiolrwydd y tîm rheoli
- **Yr Amgylchedd Gofal** — diogelwch a chyflwr yr adeilad

Gwelwch raddfeydd CIW diweddaraf pob cartref yng Ngwynedd ar [gofal.wales/cartrefi-gofal/gwynedd](/cartrefi-gofal/gwynedd).

### Mathau o ofal sydd ar gael

- **Gofal preswyl** — cymorth bob dydd mewn amgylchedd cartrefol
- **Gofal nyrsio** — gofal meddygol 24/7 gan nyrsys cofrestredig
- **Gofal dementia** — unedau arbenigol gyda staff wedi'u hyfforddi mewn dulliau person-ganolog
- **Gofal seibiant** — arhosiad byr i roi seibiant i ofalwyr teuluol
- **Gofal iechyd meddwl** — cymorth arbenigol

### Cyllido gofal yng Ngwynedd

Mae Cyngor Gwynedd yn gyfrifol am asesu anghenion gofal a phenderfynu ar gymorth ariannol. Mae asesiad ariannol yn ystyried incwm, cynilion, ac eiddo. Os yw eich asedau o dan y trothwy cenedlaethol, gallai'r cyngor gyfrannu at gostau gofal.

Mae hefyd yn bwysig gofyn am Ofal Iechyd Parhaus y GIG os oes anghenion iechyd cymhleth — gall hyn dalu am gostau gofal nyrsio yn llawn.

### Sut i chwilio am gartref gofal yng Ngwynedd

1. Ewch i [gofal.wales/cartrefi-gofal/gwynedd](/cartrefi-gofal/gwynedd) i weld pob cartref gofal cofrestredig
2. Hidlwch yn ôl math o ofal, lleoliad, a graddfeydd CIW
3. Darllenwch adroddiadau CIW a gwybodaeth fanwl am bob cartref
4. Cysylltwch â chartrefi drwy ein ffurflen ymholiad
5. Trefnwch ymweliad — mae gweld y cartref yn hanfodol

### Awgrymiadau arbennig ar gyfer Gwynedd

Oherwydd natur wledig y sir, mae rhai ystyriaethau ychwanegol:
- **Trafnidiaeth** — mae rhai cartrefi mewn ardaloedd anghysbell; sicrhewch fod teulu a ffrindiau yn gallu ymweld yn rhwydd
- **Tywydd gaeaf** — gall ffyrdd mynyddig fod yn anodd yn y gaeaf; ystyriwch gartrefi mewn trefi mwy hygyrch
- **Y Gymraeg** — disgwyliwch ofal Cymraeg llawn yng Ngwynedd; os nad yw cartref yn gallu darparu hyn, dylech holi pam

---

*Chwiliwch am gartrefi gofal yng Ngwynedd ar [gofal.wales/cartrefi-gofal/gwynedd](/cartrefi-gofal/gwynedd). Cymharwch raddfeydd CIW, darllenwch adroddiadau, a gwnewch ymholiad heddiw.*`,

    content_en: `## Care homes in Gwynedd — A comprehensive guide

Gwynedd is a remarkable county in north-west Wales, stretching from the Cardigan Bay coastline to the peaks of Snowdonia (Eryri). This is the heartland of the Welsh language — with 64.4% of the population speaking Welsh according to the 2021 Census, Gwynedd has the highest percentage of Welsh speakers of any county in Wales. This means that Welsh-medium care is not just desirable but essential for the vast majority of residents.

### Why choose a care home in Gwynedd?

Gwynedd offers a unique environment that combines the natural beauty of Snowdonia National Park with strong Welsh-speaking communities and quality health services. Towns like Bangor, Caernarfon, Pwllheli, and Blaenau Ffestiniog provide a range of care homes in different settings — from vibrant university towns to peaceful coastal villages.

Ysbyty Gwynedd in Bangor provides comprehensive health services for the entire county, while smaller community hospitals serve more rural areas. Bangor University also conducts cutting-edge research in dementia care and gerontology, which positively influences care quality in the area.

### Welsh language — the heart of care in Gwynedd

With 64.4% speaking Welsh, Welsh is the natural language of everyday life in Gwynedd. For many older people in the county, Welsh is their only comfortable language, especially as they age or develop conditions like dementia. Research shows that people with dementia often revert to their first language, making Welsh-medium care a clinical necessity, not a choice.

The Active Offer (Cynnig Rhagweithiol) is particularly important in Gwynedd. Every care home in the county should be able to provide full care through the medium of Welsh. When searching for a care home, ask:
- Do all staff speak Welsh?
- Are activities and social life conducted in Welsh?
- Are documents and care plans available in Welsh?

Search for Welsh-medium care homes in Gwynedd at [gofal.wales/cartrefi-gofal/gwynedd](/cartrefi-gofal/gwynedd).

### Key towns and communities

**Bangor** — North Wales' largest university city, with high-quality care homes and access to Ysbyty Gwynedd. The Victorian pier and High Street offer vibrant life.

**Caernarfon** — A historic town with a UNESCO castle, a very strong Welsh-speaking community, and excellent care homes. The Maes (town square) is the social heart of the town.

**Pwllheli** — A market town on the Llŷn Peninsula with beautiful coastline. The area is quiet and ideal for those who enjoy the outdoors.

**Blaenau Ffestiniog** — A mountain town with a close-knit community and rich slate heritage.

**Porthmadog** — A beautiful coastal town near Traeth Mawr, with access to the Ffestiniog and Welsh Highland railways.

**Bethesda** — A village near Bangor with a strong community and access to Snowdonia.

**Dolgellau** — A beautiful market town at the southern end of Snowdonia with stunning views of Cadair Idris.

### CIW ratings in Gwynedd

Care Inspectorate Wales (CIW) inspects every registered care home in Gwynedd. Inspections look at:

- **Well-being** — are residents happy, healthy, and respected?
- **Care and Support** — the quality of clinical and personal care
- **Leadership and Management** — the effectiveness of the management team
- **The Care Environment** — safety and condition of the building

View the latest CIW ratings for every home in Gwynedd at [gofal.wales/cartrefi-gofal/gwynedd](/cartrefi-gofal/gwynedd).

### Types of care available

- **Residential care** — daily support in a homely environment
- **Nursing care** — 24/7 medical care from registered nurses
- **Dementia care** — specialist units with staff trained in person-centred approaches
- **Respite care** — short stays to give family carers a break
- **Mental health care** — specialist support

### Funding care in Gwynedd

Gwynedd Council is responsible for assessing care needs and determining financial support. A financial assessment considers income, savings, and property. If your assets are below the national threshold, the council could contribute to care costs.

It is also important to ask about NHS Continuing Healthcare if there are complex health needs — this can pay for nursing care costs in full.

### How to search for a care home in Gwynedd

1. Visit [gofal.wales/cartrefi-gofal/gwynedd](/cartrefi-gofal/gwynedd) to see every registered care home
2. Filter by care type, location, and CIW ratings
3. Read CIW reports and detailed information about each home
4. Contact homes through our enquiry form
5. Arrange a visit — seeing the home in person is essential

### Special considerations for Gwynedd

Due to the rural nature of the county, there are some additional considerations:
- **Transport** — some homes are in remote areas; ensure family and friends can visit easily
- **Winter weather** — mountain roads can be challenging in winter; consider homes in more accessible towns
- **Welsh language** — expect full Welsh-medium care in Gwynedd; if a home cannot provide this, you should ask why

---

*Search for care homes in Gwynedd at [gofal.wales/cartrefi-gofal/gwynedd](/cartrefi-gofal/gwynedd). Compare CIW ratings, read reports, and make an enquiry today.*`,
  },

  {
    slug: "cartrefi-gofal-caerdydd",
    title_cy: "Cartrefi gofal yng Nghaerdydd — Canllaw lleol",
    title_en: "Care homes in Cardiff — Local guide",
    excerpt_cy: "Canllaw cynhwysfawr i gartrefi gofal yng Nghaerdydd, prifddinas Cymru, gan gynnwys gwybodaeth am ardaloedd, graddfeydd CIW a gwasanaethau lleol.",
    excerpt_en: "A comprehensive guide to care homes in Cardiff, Wales' capital city, including information on areas, CIW ratings and local services.",
    published: "2026-04-01",
    category: "county",
    related_county: "caerdydd",
    content_cy: `## Cartrefi gofal yng Nghaerdydd — Canllaw cynhwysfawr

Caerdydd yw prifddinas Cymru a'r ddinas fwyaf, gyda phoblogaeth o dros 360,000. Mae'n ddinas fywiog a chosmopolitan sy'n cynnig amrywiaeth eang o gartrefi gofal mewn lleoliadau gwahanol — o ganol y ddinas i faestrefi tawel a phentrefi ar gyrion y ddinas. Er mai 12.2% o boblogaeth Caerdydd sy'n siarad Cymraeg yn ôl Cyfrifiad 2021, mae'r galw am ofal drwy'r Gymraeg yn cynyddu, yn enwedig ymhlith pobl hŷn a symudodd i'r ddinas o ardaloedd mwy Cymraeg.

### Pam dewis cartref gofal yng Nghaerdydd?

Fel prifddinas Cymru, mae Caerdydd yn cynnig y dewis ehangaf o gartrefi gofal o unrhyw ddinas yng Nghymru. Mae'r ddinas yn gartref i Ysbyty Athrofaol Cymru — un o ysbytai mwyaf Cymru — yn ogystal ag Ysbyty'r Waun, Ysbyty Llandochau, ac Ysbyty Dewi Sant. Mae hyn yn golygu bod mynediad at wasanaethau iechyd arbenigol yn rhagorol.

Mae Caerdydd yn ddinas werdd, gyda pharciau hardd fel Parc Bute, Parc Roath, a Pharc y Rhath. Mae Bae Caerdydd yn cynnig amgylchedd modern a deniadol, tra bod ardaloedd fel Llandaf, Rhiwbeina, a Radur yn cynnig bywyd tawel maestrefol.

### Ardaloedd allweddol yng Nghaerdydd

**Llandaf** — Pentref hanesyddol yng nghalon Caerdydd, yn enwog am ei Gadeirlan. Ardal dawel gyda chartrefi gofal o safon uchel.

**Rhiwbeina** — Maestref boblogaidd gyda phentref cymuned cryf a mynediad at Barc Cefn Onn.

**Cyncoedd a Cyncoed** — Ardal breswyl ddymunol gyda chartrefi gofal preifat o safon uchel.

**Whitchurch / Yr Eglwys Newydd** — Maestref fawr gyda siopau, parciau, ac Ysbyty'r Eglwys Newydd (Whitchurch Hospital).

**Penarth** — Er ei fod yn dechnegol ym Mro Morgannwg, mae Penarth yn agos iawn at Gaerdydd ac yn cynnig cartrefi gofal mewn amgylchedd arfordirol.

**Treganna a Phontcanna** — Ardaloedd poblogaidd gyda nifer o gartrefi gofal a mynediad at Barc Bute a'r Afon Taf.

**Bae Caerdydd** — Ardal fodern gyda chyfleusterau rhagorol gan gynnwys y Senedd a Chanolfan Mileniwm Cymru.

### Y Gymraeg yng Nghaerdydd

Er mai 12.2% o boblogaeth Caerdydd sy'n siarad Cymraeg, mae'r nifer yn cynyddu'n gyson, diolch i addysg Gymraeg a mewnfudo o ardaloedd Cymraeg. Mae llawer o bobl hŷn mewn cartrefi gofal yng Nghaerdydd wedi symud o siroedd mwy Cymraeg ac yn gwerthfawrogi gallu siarad Cymraeg gyda staff a phreswylwyr eraill.

Mae Cyngor Caerdydd yn ymrwymo i'r Cynnig Rhagweithiol, ac mae nifer cynyddol o gartrefi gofal yn y ddinas yn cyflogi staff Cymraeg. Wrth chwilio am gartref gofal yng Nghaerdydd, mae'n werth gofyn am lefel y ddarpariaeth Gymraeg.

Chwiliwch am gartrefi gofal yng Nghaerdydd ar [gofal.wales/cartrefi-gofal/caerdydd](/cartrefi-gofal/caerdydd).

### Graddfeydd CIW yng Nghaerdydd

Mae Arolygiaeth Gofal Cymru (CIW) yn arolygu pob cartref gofal cofrestredig yng Nghaerdydd. Gyda nifer fawr o gartrefi gofal yn y ddinas, mae cymharu graddfeydd CIW yn ffordd effeithiol o leihau eich rhestr fer.

Mae CIW yn graddio cartrefi ar bedwar maes:
- **Llesiant** — hapusrwydd a pharch
- **Gofal a Chymorth** — ansawdd y gofal
- **Arweinyddiaeth a Rheolaeth** — effeithiolrwydd rheoli
- **Yr Amgylchedd Gofal** — diogelwch a chyflwr

Gwelwch raddfeydd CIW ar [gofal.wales/cartrefi-gofal](/cartrefi-gofal) a chymharwch gartrefi gofal yng Nghaerdydd.

### Mathau o ofal

Mae Caerdydd yn cynnig yr amrywiaeth ehangaf o fathau o ofal yng Nghymru:
- **Gofal preswyl** — cymorth bob dydd
- **Gofal nyrsio** — gofal meddygol 24/7
- **Gofal dementia** — unedau arbenigol
- **Gofal seibiant** — arhosiad dros dro
- **Gofal iechyd meddwl** — cymorth arbenigol
- **Anabledd dysgu** — gofal arbenigol i oedolion ag anableddau dysgu

### Cyllido gofal yng Nghaerdydd

Mae Cyngor Caerdydd yn darparu asesiadau anghenion gofal ac asesiadau ariannol. Mae costau gofal yng Nghaerdydd yn tueddu i fod ychydig yn uwch na'r cyfartaledd cenedlaethol oherwydd costau byw yn y brifddinas.

Os ydych yn hunangyllido, mae gennych fwy o ddewis o gartrefi gofal. Os yw'r cyngor yn ariannu'ch gofal, byddant yn talu hyd at gyfradd benodol.

### Sut i chwilio

1. Ewch i [gofal.wales/cartrefi-gofal/caerdydd](/cartrefi-gofal/caerdydd) i weld pob cartref gofal yng Nghaerdydd
2. Defnyddiwch hidlyddion i chwilio yn ôl ardal, math o ofal, a graddfeydd CIW
3. Cymharwch gartrefi a darllenwch adroddiadau CIW manwl
4. Cysylltwch â chartrefi drwy ein ffurflen ymholiad
5. Trefnwch ymweliadau — mae gweld y cartref yn bersonol yn hanfodol

### Adnoddau lleol

- **Cyngor Caerdydd** — Gwasanaethau Oedolion
- **Bwrdd Iechyd Prifysgol Caerdydd a'r Fro** — gwasanaethau iechyd cynhwysfawr
- **Age Cymru Caerdydd a'r Fro** — cyngor a chymorth i bobl hŷn
- **Alzheimer's Society Cymru** — swyddfa Caerdydd

---

*Chwiliwch am gartrefi gofal yng Nghaerdydd ar [gofal.wales/cartrefi-gofal/caerdydd](/cartrefi-gofal/caerdydd). Cymharwch raddfeydd CIW, gweld ffotograffau, a gwneud ymholiad heddiw.*`,

    content_en: `## Care homes in Cardiff — A comprehensive guide

Cardiff is the capital of Wales and its largest city, with a population of over 360,000. It is a vibrant and cosmopolitan city that offers a wide range of care homes in different settings — from the city centre to quiet suburbs and villages on the outskirts. While 12.2% of Cardiff's population speaks Welsh according to the 2021 Census, demand for Welsh-medium care is increasing, especially among older people who moved to the city from more Welsh-speaking areas.

### Why choose a care home in Cardiff?

As the capital of Wales, Cardiff offers the widest choice of care homes of any city in Wales. The city is home to the University Hospital of Wales — one of the largest hospitals in Wales — as well as the Heath Hospital, Llandough Hospital, and St David's Hospital. This means access to specialist health services is excellent.

Cardiff is a green city, with beautiful parks such as Bute Park, Roath Park, and the Heath. Cardiff Bay offers a modern and attractive environment, while areas like Llandaff, Rhiwbina, and Radyr offer a quiet suburban lifestyle.

### Key areas in Cardiff

**Llandaff** — A historic village in the heart of Cardiff, famous for its Cathedral. A quiet area with high-quality care homes.

**Rhiwbina** — A popular suburb with a strong community village and access to Cefn Onn Park.

**Cyncoed** — A desirable residential area with high-quality private care homes.

**Whitchurch** — A large suburb with shops, parks, and Whitchurch Hospital.

**Penarth** — Though technically in the Vale of Glamorgan, Penarth is very close to Cardiff and offers care homes in a coastal setting.

**Canton and Pontcanna** — Popular areas with several care homes and access to Bute Park and the River Taff.

**Cardiff Bay** — A modern area with excellent facilities including the Senedd and Wales Millennium Centre.

### Welsh language in Cardiff

While 12.2% of Cardiff's population speaks Welsh, the number is steadily increasing, thanks to Welsh-medium education and in-migration from Welsh-speaking areas. Many older people in Cardiff care homes have moved from more Welsh-speaking counties and value being able to speak Welsh with staff and other residents.

Cardiff Council is committed to the Active Offer, and an increasing number of care homes in the city employ Welsh-speaking staff. When searching for a care home in Cardiff, it is worth asking about the level of Welsh language provision.

Search for care homes in Cardiff at [gofal.wales/cartrefi-gofal/caerdydd](/cartrefi-gofal/caerdydd).

### CIW ratings in Cardiff

Care Inspectorate Wales (CIW) inspects every registered care home in Cardiff. With a large number of care homes in the city, comparing CIW ratings is an effective way to narrow down your shortlist.

CIW rates homes on four areas:
- **Well-being** — happiness and respect
- **Care and Support** — quality of care
- **Leadership and Management** — management effectiveness
- **The Care Environment** — safety and condition

View CIW ratings at [gofal.wales/cartrefi-gofal](/cartrefi-gofal) and compare care homes in Cardiff.

### Types of care

Cardiff offers the widest range of care types in Wales:
- **Residential care** — daily support
- **Nursing care** — 24/7 medical care
- **Dementia care** — specialist units
- **Respite care** — temporary stays
- **Mental health care** — specialist support
- **Learning disability** — specialist care for adults with learning disabilities

### Funding care in Cardiff

Cardiff Council provides care needs assessments and financial assessments. Care costs in Cardiff tend to be slightly higher than the national average due to the cost of living in the capital.

If you are self-funding, you have a wider choice of care homes. If the council is funding your care, they will pay up to a set rate.

### How to search

1. Visit [gofal.wales/cartrefi-gofal/caerdydd](/cartrefi-gofal/caerdydd) to see every care home in Cardiff
2. Use filters to search by area, care type, and CIW ratings
3. Compare homes and read detailed CIW reports
4. Contact homes through our enquiry form
5. Arrange visits — seeing the home in person is essential

### Local resources

- **Cardiff Council** — Adult Services
- **Cardiff and Vale University Health Board** — comprehensive health services
- **Age Cymru Cardiff and the Vale** — advice and support for older people
- **Alzheimer's Society Cymru** — Cardiff office

---

*Search for care homes in Cardiff at [gofal.wales/cartrefi-gofal/caerdydd](/cartrefi-gofal/caerdydd). Compare CIW ratings, view photos, and make an enquiry today.*`,
  },

  {
    slug: "cartrefi-gofal-abertawe",
    title_cy: "Cartrefi gofal yn Abertawe — Canllaw lleol",
    title_en: "Care homes in Swansea — Local guide",
    excerpt_cy: "Canllaw cynhwysfawr i gartrefi gofal yn Abertawe, ail ddinas Cymru, gan gynnwys gwybodaeth am ardaloedd, graddfeydd CIW a'r Gymraeg.",
    excerpt_en: "A comprehensive guide to care homes in Swansea, Wales' second city, including information on areas, CIW ratings and Welsh language provision.",
    published: "2026-04-01",
    category: "county",
    related_county: "abertawe",
    content_cy: `## Cartrefi gofal yn Abertawe — Canllaw cynhwysfawr

Abertawe yw ail ddinas Cymru, wedi'i lleoli ar arfordir de-orllewin Cymru lle mae Afon Tawe yn cwrdd â Bae Abertawe. Gyda phoblogaeth o dros 240,000, mae'r ddinas yn cynnig cyfuniad unigryw o fywyd dinesig, arfordir godidog, a mynediad at Benrhyn Gŵyr — Ardal o Harddwch Naturiol Eithriadol gyntaf y DU. Mae 14.1% o'r boblogaeth yn siarad Cymraeg yn ôl Cyfrifiad 2021.

### Pam dewis cartref gofal yn Abertawe?

Mae Abertawe yn cynnig amrywiaeth eang o gartrefi gofal mewn lleoliadau amrywiol — o ganol y ddinas i faestrefi gwyrdd a phentrefi arfordirol ger Gŵyr. Mae'r ddinas yn gartref i Ysbyty Treforys ac Ysbyty Singleton, sy'n darparu gwasanaethau iechyd cynhwysfawr.

Mae Marina Abertawe a'r Glannau wedi'u hadfywio'n helaeth, gan gynnig amgylchedd modern a deniadol. Mae ardaloedd fel Sgeti, y Mwmbwls, Llangyfelach, a Phontarddulais yn cynnig bywyd tawelach gyda mynediad at y ddinas.

### Ardaloedd allweddol

**Y Mwmbwls** — Pentref arfordirol poblogaidd ym mhen Bae Abertawe, yn enwog am ei siop hufen iâ, ei bier, a'i olygfeydd godidog. Mae nifer o gartrefi gofal o safon yn yr ardal.

**Sgeti** — Maestref ddeniadol gyda Phrifysgol Abertawe yn agos a mynediad at Barc Singleton.

**Uplands** — Ardal fywiog yn agos at Barc Cwmdonkin, man geni Dylan Thomas.

**Pontarddulais** — Tref ar gyrion gogleddol Abertawe gyda chymuned Gymraeg gryfach na chanol y ddinas.

**Clydach** — Pentref yng Nghwm Tawe gyda hanes diwydiannol a chymuned glòs.

**West Cross a Mayals** — Ardaloedd preswyl tawel ger y Mwmbwls gyda golygfeydd o'r môr.

**Penrhyn Gŵyr** — Er bod cartrefi gofal yn brin yma, mae'r ardal o harddwch naturiol yn agos at gartrefi gofal ym Mwmbwls ac Abertawe.

### Y Gymraeg yn Abertawe

Mae 14.1% o boblogaeth Abertawe yn siarad Cymraeg. Er bod y ganran yn is na rhai siroedd gwledig, mae cymunedau Cymraeg cryf yn Abertawe, yn enwedig yn ardaloedd y gogledd fel Pontarddulais, Clydach, a Chwm Tawe. Mae llawer o bobl hŷn mewn cartrefi gofal wedi'u magu yn Gymraeg ac yn gwerthfawrogi gallu siarad yr iaith.

Mae Cyngor Abertawe yn cefnogi'r Cynnig Rhagweithiol, ac mae rhai cartrefi gofal yn y ddinas yn cynnig gofal Cymraeg. Wrth chwilio, gofynnwch am lefel y ddarpariaeth Gymraeg.

Chwiliwch am gartrefi gofal yn Abertawe ar [gofal.wales/cartrefi-gofal/abertawe](/cartrefi-gofal/abertawe).

### Graddfeydd CIW yn Abertawe

Mae Arolygiaeth Gofal Cymru (CIW) yn arolygu pob cartref gofal yn Abertawe. Mae defnyddio graddfeydd CIW i gymharu cartrefi yn hanfodol:

- **Llesiant** — a yw preswylwyr yn hapus ac yn cael eu parchu?
- **Gofal a Chymorth** — ansawdd y gofal
- **Arweinyddiaeth a Rheolaeth** — effeithiolrwydd y tîm rheoli
- **Yr Amgylchedd Gofal** — diogelwch a chyflwr yr adeilad

Cymharwch raddfeydd CIW cartrefi gofal Abertawe ar [gofal.wales/cartrefi-gofal/abertawe](/cartrefi-gofal/abertawe).

### Mathau o ofal

- **Gofal preswyl** — cymorth gyda bywyd bob dydd
- **Gofal nyrsio** — gofal meddygol 24 awr
- **Gofal dementia** — unedau arbenigol
- **Gofal seibiant** — arhosiad dros dro
- **Gofal iechyd meddwl** — cymorth arbenigol
- **Anabledd dysgu** — gofal arbenigol

### Cyllido gofal yn Abertawe

Mae Cyngor Abertawe yn darparu asesiadau anghenion a chymorth ariannol lle bo'n gymwys. Mae'r broses yn debyg i weddill Cymru — mae asesiad ariannol yn ystyried incwm, cynilion, ac eiddo.

### Sut i chwilio

1. Ewch i [gofal.wales/cartrefi-gofal/abertawe](/cartrefi-gofal/abertawe) i weld cartrefi gofal yn Abertawe
2. Hidlwch yn ôl math o ofal, lleoliad, a graddfeydd CIW
3. Cymharwch gartrefi a darllenwch adroddiadau CIW
4. Cysylltwch â chartrefi drwy ein ffurflen ymholiad ar-lein
5. Trefnwch ymweliad i weld y cartref drosoch eich hun

### Awgrymiadau

- Ystyriwch leoliad y cartref mewn perthynas â theulu a ffrindiau
- Gwiriwch fynediad at wasanaethau iechyd (ysbytai, meddygfeydd)
- Gofynnwch am weithgareddau a bywyd cymdeithasol
- Holwch am y ddarpariaeth Gymraeg
- Darllenwch adroddiad CIW diweddaraf y cartref

### Adnoddau lleol

- **Cyngor Abertawe** — Gwasanaethau Oedolion
- **Bwrdd Iechyd Prifysgol Bae Abertawe** — gwasanaethau iechyd
- **Age Cymru Gorllewin Morgannwg** — cyngor i bobl hŷn
- **Alzheimer's Society Cymru** — cymorth dementia

---

*Chwiliwch am gartrefi gofal yn Abertawe ar [gofal.wales/cartrefi-gofal/abertawe](/cartrefi-gofal/abertawe). Cymharwch raddfeydd CIW, gweld ffotograffau, a gwneud ymholiad heddiw.*`,

    content_en: `## Care homes in Swansea — A comprehensive guide

Swansea is Wales' second city, located on the south-west coast of Wales where the River Tawe meets Swansea Bay. With a population of over 240,000, the city offers a unique combination of urban life, stunning coastline, and access to the Gower Peninsula — the UK's first Area of Outstanding Natural Beauty. According to the 2021 Census, 14.1% of the population speaks Welsh.

### Why choose a care home in Swansea?

Swansea offers a wide range of care homes in diverse settings — from the city centre to green suburbs and coastal villages near Gower. The city is home to Morriston Hospital and Singleton Hospital, which provide comprehensive health services.

Swansea Marina and the waterfront have been extensively regenerated, offering a modern and attractive environment. Areas such as Sketty, Mumbles, Llangyfelach, and Pontarddulais offer a quieter lifestyle with access to the city.

### Key areas

**Mumbles** — A popular coastal village at the end of Swansea Bay, famous for its ice cream shop, pier, and stunning views. Several high-quality care homes are in the area.

**Sketty** — An attractive suburb close to Swansea University and Singleton Park.

**Uplands** — A vibrant area near Cwmdonkin Park, the birthplace of Dylan Thomas.

**Pontarddulais** — A town on the northern edge of Swansea with a stronger Welsh-speaking community than the city centre.

**Clydach** — A village in the Swansea Valley with industrial heritage and a close-knit community.

**West Cross and Mayals** — Quiet residential areas near Mumbles with sea views.

**Gower Peninsula** — While care homes are scarce here, this area of natural beauty is close to care homes in Mumbles and Swansea.

### Welsh language in Swansea

14.1% of Swansea's population speaks Welsh. Although the percentage is lower than some rural counties, there are strong Welsh-speaking communities in Swansea, particularly in the northern areas like Pontarddulais, Clydach, and the Swansea Valley. Many older people in care homes were raised through Welsh and value being able to speak the language.

Swansea Council supports the Active Offer, and some care homes in the city offer Welsh-medium care. When searching, ask about the level of Welsh language provision.

Search for care homes in Swansea at [gofal.wales/cartrefi-gofal/abertawe](/cartrefi-gofal/abertawe).

### CIW ratings in Swansea

Care Inspectorate Wales (CIW) inspects every care home in Swansea. Using CIW ratings to compare homes is essential:

- **Well-being** — are residents happy and respected?
- **Care and Support** — quality of care
- **Leadership and Management** — management effectiveness
- **The Care Environment** — safety and building condition

Compare CIW ratings for Swansea care homes at [gofal.wales/cartrefi-gofal/abertawe](/cartrefi-gofal/abertawe).

### Types of care

- **Residential care** — support with daily living
- **Nursing care** — 24-hour medical care
- **Dementia care** — specialist units
- **Respite care** — temporary stays
- **Mental health care** — specialist support
- **Learning disability** — specialist care

### Funding care in Swansea

Swansea Council provides needs assessments and financial support where eligible. The process is similar to the rest of Wales — a financial assessment considers income, savings, and property.

### How to search

1. Visit [gofal.wales/cartrefi-gofal/abertawe](/cartrefi-gofal/abertawe) to see care homes in Swansea
2. Filter by care type, location, and CIW ratings
3. Compare homes and read CIW reports
4. Contact homes through our online enquiry form
5. Arrange a visit to see the home for yourself

### Tips

- Consider the home's location relative to family and friends
- Check access to health services (hospitals, GP surgeries)
- Ask about activities and social life
- Enquire about Welsh language provision
- Read the home's latest CIW inspection report

### Local resources

- **Swansea Council** — Adult Services
- **Swansea Bay University Health Board** — health services
- **Age Cymru West Glamorgan** — advice for older people
- **Alzheimer's Society Cymru** — dementia support

---

*Search for care homes in Swansea at [gofal.wales/cartrefi-gofal/abertawe](/cartrefi-gofal/abertawe). Compare CIW ratings, view photos, and make an enquiry today.*`,
  },

  {
    slug: "cartrefi-gofal-ceredigion",
    title_cy: "Cartrefi gofal yng Ngheredigion — Canllaw lleol",
    title_en: "Care homes in Ceredigion — Local guide",
    excerpt_cy: "Canllaw cynhwysfawr i gartrefi gofal yng Ngheredigion, sir arfordirol gyda 44.3% yn siarad Cymraeg, gan gynnwys graddfeydd CIW a gwybodaeth leol.",
    excerpt_en: "A comprehensive guide to care homes in Ceredigion, a coastal county with 44.3% Welsh speakers, including CIW ratings and local information.",
    published: "2026-04-01",
    category: "county",
    related_county: "ceredigion",
    content_cy: `## Cartrefi gofal yng Ngheredigion — Canllaw cynhwysfawr

Mae Ceredigion yn sir arfordirol hardd yng ngorllewin Cymru, yn ymestyn o Aberystwyth yn y gogledd i Aberteifi yn y de. Mae'r sir yn enwog am ei harfordir dramatig, ei phrifysgolion, a'i chymunedau Cymraeg cryf. Yn ôl Cyfrifiad 2021, mae 44.3% o boblogaeth Ceredigion yn siarad Cymraeg, gan wneud y sir yn un o gadarnleoedd yr iaith.

### Pam dewis cartref gofal yng Ngheredigion?

Mae Ceredigion yn cynnig amgylchedd tawel a naturiol sy'n ddelfrydol i bobl hŷn sy'n gwerthfawrogi bywyd gwledig ac arfordirol. Mae trefi fel Aberystwyth, Aberaeron, Aberteifi, a Llanbedr Pont Steffan yn cynnig cartrefi gofal mewn lleoliadau hardd gyda mynediad at wasanaethau lleol.

Mae Aberystwyth yn dref brifysgol fywiog gyda Phrifysgol Aberystwyth a Llyfrgell Genedlaethol Cymru. Mae'r dref yn ganolfan ddiwylliannol a masnachol i'r sir gyfan. Mae Ysbyty Bronglais yn darparu gwasanaethau iechyd i ogledd Ceredigion, tra bod gwasanaethau de'r sir yn cael eu darparu gan Ysbyty Glangwili yng Nghaerfyrddin.

### Y Gymraeg yng Ngheredigion

Gyda 44.3% yn siarad Cymraeg, mae'r Gymraeg yn rhan ganolog o fywyd bob dydd yng Ngheredigion. Mae hyn yn arbennig o wir yn ardaloedd gwledig y sir, lle mae'r ganran yn uwch fyth. I bobl hŷn, ac yn enwedig i rai â dementia, mae gallu cyfathrebu yn Gymraeg yn hanfodol.

Mae'r Cynnig Rhagweithiol yn bwysig iawn yng Ngheredigion. Dylai cartrefi gofal yn y sir fod yn gallu darparu gofal drwy'r Gymraeg. Wrth chwilio, gofynnwch am nifer y staff sy'n siarad Cymraeg a'r ddarpariaeth o weithgareddau Cymraeg.

Chwiliwch am gartrefi gofal Cymraeg yng Ngheredigion ar [gofal.wales/cartrefi-gofal/ceredigion](/cartrefi-gofal/ceredigion).

### Trefi a chymunedau allweddol

**Aberystwyth** — Tref brifysgol ar arfordir Bae Ceredigion gyda chartrefi gofal o safon, mynediad at Ysbyty Bronglais, a bywyd diwylliannol bywiog. Mae'r promenâd, Constitution Hill, a'r Llyfrgell Genedlaethol yn atyniadau poblogaidd.

**Aberaeron** — Tref harbwr hardd gyda thai lliwgar a chymuned glòs. Mae'r amgylchedd tawel yn ddelfrydol ar gyfer gofal.

**Aberteifi** — Tref hanesyddol ar lan Afon Teifi gyda chastell adnewyddedig, Theatr Mwldan, a marchnad ffermwyr. Mae'n agos at Sir Benfro hefyd.

**Llanbedr Pont Steffan (Lampeter)** — Tref farchnad hynafol gyda'r brifysgol hynaf yng Nghymru (Prifysgol Cymru, y Drindod Dewi Sant). Cymuned Gymraeg gref.

**Tregaron** — Tref fach ym mynyddoedd Ceredigion, yn enwog am Gors Caron a threftadaeth wledig. Cymuned Gymraeg gref iawn.

**Cei Newydd (New Quay)** — Pentref arfordirol enwog am ddolffiniaid, yn debyg i le sy'n ysbrydoli "Under Milk Wood" Dylan Thomas.

### Graddfeydd CIW yng Ngheredigion

Mae Arolygiaeth Gofal Cymru (CIW) yn arolygu pob cartref gofal cofrestredig yng Ngheredigion. Mae'r arolygiadau yn edrych ar:

- **Llesiant** — hapusrwydd a lles preswylwyr
- **Gofal a Chymorth** — ansawdd y gofal a ddarperir
- **Arweinyddiaeth a Rheolaeth** — sut mae'r cartref yn cael ei redeg
- **Yr Amgylchedd Gofal** — cyflwr a diogelwch yr adeilad

Gwelwch raddfeydd CIW ar [gofal.wales/cartrefi-gofal/ceredigion](/cartrefi-gofal/ceredigion).

### Mathau o ofal

- **Gofal preswyl** — cymorth bob dydd mewn amgylchedd cartrefol
- **Gofal nyrsio** — gofal meddygol 24 awr
- **Gofal dementia** — gofal arbenigol
- **Gofal seibiant** — arhosiad byr i ofalwyr gael gorffwys

### Heriau penodol yng Ngheredigion

Mae Ceredigion yn sir wledig iawn, ac mae rhai heriau penodol:
- **Pellter** — mae rhai cartrefi gofal ymhell o ysbytai mawr
- **Trafnidiaeth gyhoeddus** — cyfyngedig mewn ardaloedd gwledig
- **Staffio** — gall fod yn anodd recriwtio staff mewn ardaloedd anghysbell
- **Tywydd** — gall ffyrdd fod yn anodd yn y gaeaf

### Cyllido gofal yng Ngheredigion

Mae Cyngor Sir Ceredigion yn darparu asesiadau anghenion gofal. Mae'r broses ariannu yr un fath â gweddill Cymru, gyda phrawf modd i benderfynu ar gyfraniad y cyngor.

### Sut i chwilio

1. Ewch i [gofal.wales/cartrefi-gofal/ceredigion](/cartrefi-gofal/ceredigion) i weld pob cartref gofal
2. Hidlwch yn ôl math o ofal a lleoliad
3. Darllenwch adroddiadau CIW
4. Cysylltwch â chartrefi drwy ein ffurflen ymholiad
5. Trefnwch ymweliad

### Adnoddau lleol

- **Cyngor Sir Ceredigion** — Gwasanaethau Oedolion
- **Bwrdd Iechyd Prifysgol Hywel Dda** — gwasanaethau iechyd
- **Age Cymru Dyfed** — cyngor i bobl hŷn
- **Alzheimer's Society Cymru** — cymorth dementia

---

*Chwiliwch am gartrefi gofal yng Ngheredigion ar [gofal.wales/cartrefi-gofal/ceredigion](/cartrefi-gofal/ceredigion). Cymharwch raddfeydd CIW a gwnewch ymholiad heddiw.*`,

    content_en: `## Care homes in Ceredigion — A comprehensive guide

Ceredigion is a beautiful coastal county in west Wales, stretching from Aberystwyth in the north to Cardigan in the south. The county is renowned for its dramatic coastline, its universities, and its strong Welsh-speaking communities. According to the 2021 Census, 44.3% of Ceredigion's population speaks Welsh, making the county one of the strongholds of the language.

### Why choose a care home in Ceredigion?

Ceredigion offers a peaceful and natural environment that is ideal for older people who appreciate rural and coastal living. Towns like Aberystwyth, Aberaeron, Cardigan, and Lampeter offer care homes in beautiful settings with access to local services.

Aberystwyth is a vibrant university town home to Aberystwyth University and the National Library of Wales. The town is a cultural and commercial centre for the entire county. Bronglais Hospital provides health services for north Ceredigion, while south of the county is served by Glangwili Hospital in Carmarthen.

### Welsh language in Ceredigion

With 44.3% speaking Welsh, the Welsh language is a central part of everyday life in Ceredigion. This is especially true in the county's rural areas, where the percentage is even higher. For older people, and especially those with dementia, being able to communicate in Welsh is essential.

The Active Offer is very important in Ceredigion. Care homes in the county should be able to provide care through the medium of Welsh. When searching, ask about the number of Welsh-speaking staff and the provision of Welsh-medium activities.

Search for Welsh-medium care homes in Ceredigion at [gofal.wales/cartrefi-gofal/ceredigion](/cartrefi-gofal/ceredigion).

### Key towns and communities

**Aberystwyth** — A university town on the Cardigan Bay coast with quality care homes, access to Bronglais Hospital, and a vibrant cultural life. The promenade, Constitution Hill, and the National Library are popular attractions.

**Aberaeron** — A beautiful harbour town with colourful houses and a close-knit community. The peaceful environment is ideal for care.

**Cardigan (Aberteifi)** — A historic town on the banks of the River Teifi with a renovated castle, Theatr Mwldan, and a farmers' market. It is also close to Pembrokeshire.

**Lampeter (Llanbedr Pont Steffan)** — An ancient market town with the oldest university in Wales (University of Wales Trinity Saint David). A strong Welsh-speaking community.

**Tregaron** — A small town in the Ceredigion mountains, famous for Cors Caron (Tregaron Bog) and its rural heritage. A very strong Welsh-speaking community.

**New Quay (Cei Newydd)** — A coastal village famous for dolphins, believed to be the inspiration for Dylan Thomas' "Under Milk Wood."

### CIW ratings in Ceredigion

Care Inspectorate Wales (CIW) inspects every registered care home in Ceredigion. Inspections examine:

- **Well-being** — happiness and welfare of residents
- **Care and Support** — quality of care provided
- **Leadership and Management** — how the home is run
- **The Care Environment** — condition and safety of the building

View CIW ratings at [gofal.wales/cartrefi-gofal/ceredigion](/cartrefi-gofal/ceredigion).

### Types of care

- **Residential care** — daily support in a homely environment
- **Nursing care** — 24-hour medical care
- **Dementia care** — specialist care
- **Respite care** — short stays to give carers a rest

### Specific challenges in Ceredigion

Ceredigion is a very rural county, and there are some specific challenges:
- **Distance** — some care homes are far from major hospitals
- **Public transport** — limited in rural areas
- **Staffing** — it can be difficult to recruit staff in remote areas
- **Weather** — roads can be challenging in winter

### Funding care in Ceredigion

Ceredigion County Council provides care needs assessments. The funding process is the same as the rest of Wales, with a means test to determine the council's contribution.

### How to search

1. Visit [gofal.wales/cartrefi-gofal/ceredigion](/cartrefi-gofal/ceredigion) to see every care home
2. Filter by care type and location
3. Read CIW reports
4. Contact homes through our enquiry form
5. Arrange a visit

### Local resources

- **Ceredigion County Council** — Adult Services
- **Hywel Dda University Health Board** — health services
- **Age Cymru Dyfed** — advice for older people
- **Alzheimer's Society Cymru** — dementia support

---

*Search for care homes in Ceredigion at [gofal.wales/cartrefi-gofal/ceredigion](/cartrefi-gofal/ceredigion). Compare CIW ratings and make an enquiry today.*`,
  },

  {
    slug: "cartrefi-gofal-ynys-mon",
    title_cy: "Cartrefi gofal yn Ynys Môn — Canllaw lleol",
    title_en: "Care homes in Anglesey — Local guide",
    excerpt_cy: "Canllaw cynhwysfawr i gartrefi gofal yn Ynys Môn, ynys fwyaf Cymru gyda 55.8% yn siarad Cymraeg, gan gynnwys graddfeydd CIW a gwybodaeth leol.",
    excerpt_en: "A comprehensive guide to care homes in Anglesey, Wales' largest island with 55.8% Welsh speakers, including CIW ratings and local information.",
    published: "2026-04-01",
    category: "county",
    related_county: "ynys-mon",
    content_cy: `## Cartrefi gofal yn Ynys Môn — Canllaw cynhwysfawr

Mae Ynys Môn yn ynys fwyaf Cymru ac yn un o'r lleoedd mwyaf arbennig yng Nghymru gyfan. Wedi'i chysylltu â'r tir mawr gan Bont Menai a Phont Britannia, mae'r ynys yn cynnig tirwedd fflat a hardd, arfordir dramatig, a chymunedau Cymraeg cryf. Yn ôl Cyfrifiad 2021, mae 55.8% o boblogaeth Ynys Môn yn siarad Cymraeg, gan wneud yr ynys yn un o gadarnleoedd pennaf yr iaith.

### Pam dewis cartref gofal yn Ynys Môn?

Mae Ynys Môn yn cynnig amgylchedd tawel ac ynysig sy'n ddelfrydol i bobl hŷn sy'n gwerthfawrogi bywyd arfordirol a chymunedol. Mae'r ynys gyfan wedi'i dynodi'n Ardal o Harddwch Naturiol Eithriadol, sy'n golygu golygfeydd godidog o bob cyfeiriad.

Mae trefi fel Llangefni (canolfan weinyddol yr ynys), Caergybi (porthladd fferi i Iwerddon), Biwmares (tref ganoloesol gyda chastell UNESCO), ac Amlwch yn cynnig gwahanol fathau o gymunedau. Mae Ysbyty Penrhos Stanley yng Nghaergybi ac Ysbyty Gwynedd ar y tir mawr ym Mangor yn darparu gwasanaethau iechyd.

### Y Gymraeg yn Ynys Môn

Gyda 55.8% yn siarad Cymraeg, mae'r Gymraeg yn iaith naturiol Ynys Môn. Mae'r mwyafrif o bobl hŷn yn yr ynys yn siarad Cymraeg fel eu mamiaith, ac mae gofal drwy'r Gymraeg yn disgwyliad sylfaenol, nid yn opsiwn.

Mae'r Cynnig Rhagweithiol yn hynod bwysig yn Ynys Môn. Dylai pob cartref gofal ar yr ynys fod yn gallu darparu gofal cyflawn drwy gyfrwng y Gymraeg. Mae hyn yn cynnwys:
- Cynlluniau gofal yn Gymraeg
- Gweithgareddau a digwyddiadau cymdeithasol yn Gymraeg
- Staff sy'n siarad Cymraeg yn rhugl
- Bwydlenni a gwybodaeth yn Gymraeg

Chwiliwch am gartrefi gofal Cymraeg yn Ynys Môn ar [gofal.wales/cartrefi-gofal/ynys-mon](/cartrefi-gofal/ynys-mon).

### Trefi a chymunedau allweddol

**Llangefni** — Canolfan weinyddol Ynys Môn, tref farchnad brysur yng nghanol yr ynys. Mae nifer o gartrefi gofal da yn y dref a'r cyffiniau.

**Caergybi (Holyhead)** — Tref fwyaf yr ynys a phorthladd fferi i Iwerddon. Ardal gyda phoblogaeth gymysg ac amrywiaeth o wasanaethau.

**Biwmares (Beaumaris)** — Tref hanesyddol gyda chastell canoloesol (UNESCO) a golygfeydd o Eryri. Amgylchedd tawel a phrydferth.

**Amlwch** — Tref yng ngogledd yr ynys gyda hanes mwyngloddio copr a harbwr bach.

**Benllech** — Pentref arfordirol poblogaidd gyda thraeth hardd.

**Porthaethwy (Menai Bridge)** — Tref ger Pont Menai gyda mynediad hawdd i Fangor ar y tir mawr.

**Rhosneigr** — Pentref arfordirol gyda thraethau tywodlyd a bywyd awyr agored.

### Graddfeydd CIW yn Ynys Môn

Mae Arolygiaeth Gofal Cymru (CIW) yn arolygu pob cartref gofal cofrestredig yn yr ynys. Mae'r arolygiadau yn mesur:

- **Llesiant** — hapusrwydd, iechyd, a pharch
- **Gofal a Chymorth** — ansawdd y gofal clinigol a phersonol
- **Arweinyddiaeth a Rheolaeth** — effeithiolrwydd y rheolwyr
- **Yr Amgylchedd Gofal** — diogelwch a chyflwr yr adeilad

Gwelwch raddfeydd CIW ar [gofal.wales/cartrefi-gofal/ynys-mon](/cartrefi-gofal/ynys-mon).

### Mathau o ofal

- **Gofal preswyl** — cymorth bob dydd
- **Gofal nyrsio** — gofal meddygol 24/7
- **Gofal dementia** — gofal arbenigol (mae gofal Cymraeg yn hanfodol ar gyfer cleifion dementia yn Ynys Môn)
- **Gofal seibiant** — arhosiad dros dro

### Ystyriaethau arbennig

Mae byw ar ynys yn cynnig manteision ac anfanteision:
- **Tawelwch a harddwch** — amgylchedd delfrydol i les
- **Cymuned** — mae cymunedau Ynys Môn yn agos a chefnogol
- **Mynediad at ysbytai** — Ysbyty Gwynedd ym Mangor yw'r ysbyty agosaf mawr; gall hyn olygu teithio dros y pontydd
- **Tywydd** — gall tywydd stormus effeithio ar deithio dros y pontydd

### Cyllido gofal yn Ynys Môn

Mae Cyngor Sir Ynys Môn yn darparu asesiadau anghenion gofal. Mae'r broses yr un fath â gweddill Cymru.

### Sut i chwilio

1. Ewch i [gofal.wales/cartrefi-gofal/ynys-mon](/cartrefi-gofal/ynys-mon)
2. Hidlwch yn ôl math o ofal a lleoliad
3. Darllenwch adroddiadau CIW
4. Cysylltwch â chartrefi drwy ein ffurflen ymholiad
5. Trefnwch ymweliad

### Adnoddau lleol

- **Cyngor Sir Ynys Môn** — Gwasanaethau Oedolion
- **Bwrdd Iechyd Prifysgol Betsi Cadwaladr** — gwasanaethau iechyd
- **Age Cymru Gwynedd a Môn** — cyngor i bobl hŷn
- **Alzheimer's Society Cymru** — cymorth dementia

---

*Chwiliwch am gartrefi gofal yn Ynys Môn ar [gofal.wales/cartrefi-gofal/ynys-mon](/cartrefi-gofal/ynys-mon). Cymharwch raddfeydd CIW a gwnewch ymholiad heddiw.*`,

    content_en: `## Care homes in Anglesey — A comprehensive guide

Anglesey (Ynys Môn) is the largest island in Wales and one of the most special places in the whole of Wales. Connected to the mainland by the Menai Bridge and Britannia Bridge, the island offers a flat and beautiful landscape, dramatic coastline, and strong Welsh-speaking communities. According to the 2021 Census, 55.8% of Anglesey's population speaks Welsh, making the island one of the primary strongholds of the language.

### Why choose a care home in Anglesey?

Anglesey offers a peaceful and insular environment that is ideal for older people who appreciate coastal and community living. The entire island is designated as an Area of Outstanding Natural Beauty, meaning stunning views in every direction.

Towns like Llangefni (the island's administrative centre), Holyhead (ferry port to Ireland), Beaumaris (medieval town with a UNESCO castle), and Amlwch offer different types of community. Penrhos Stanley Hospital in Holyhead and Ysbyty Gwynedd on the mainland in Bangor provide health services.

### Welsh language in Anglesey

With 55.8% speaking Welsh, Welsh is the natural language of Anglesey. The majority of older people on the island speak Welsh as their first language, and Welsh-medium care is a fundamental expectation, not an option.

The Active Offer is extremely important in Anglesey. Every care home on the island should be able to provide comprehensive care through the medium of Welsh. This includes:
- Care plans in Welsh
- Social activities and events in Welsh
- Fluent Welsh-speaking staff
- Menus and information in Welsh

Search for Welsh-medium care homes in Anglesey at [gofal.wales/cartrefi-gofal/ynys-mon](/cartrefi-gofal/ynys-mon).

### Key towns and communities

**Llangefni** — Anglesey's administrative centre, a busy market town in the middle of the island. Several good care homes in and around the town.

**Holyhead (Caergybi)** — The island's largest town and ferry port to Ireland. An area with a mixed population and a range of services.

**Beaumaris (Biwmares)** — A historic town with a medieval castle (UNESCO) and views of Snowdonia. A quiet and beautiful environment.

**Amlwch** — A town in the north of the island with a copper mining history and small harbour.

**Benllech** — A popular coastal village with a beautiful beach.

**Menai Bridge (Porthaethwy)** — A town near the Menai Bridge with easy access to Bangor on the mainland.

**Rhosneigr** — A coastal village with sandy beaches and an outdoor lifestyle.

### CIW ratings in Anglesey

Care Inspectorate Wales (CIW) inspects every registered care home on the island. Inspections measure:

- **Well-being** — happiness, health, and respect
- **Care and Support** — quality of clinical and personal care
- **Leadership and Management** — effectiveness of managers
- **The Care Environment** — safety and building condition

View CIW ratings at [gofal.wales/cartrefi-gofal/ynys-mon](/cartrefi-gofal/ynys-mon).

### Types of care

- **Residential care** — daily support
- **Nursing care** — 24/7 medical care
- **Dementia care** — specialist care (Welsh-medium care is essential for dementia patients in Anglesey)
- **Respite care** — temporary stays

### Special considerations

Living on an island offers both advantages and disadvantages:
- **Peace and beauty** — an ideal environment for well-being
- **Community** — Anglesey's communities are close and supportive
- **Hospital access** — Ysbyty Gwynedd in Bangor is the nearest major hospital; this can mean travelling across the bridges
- **Weather** — stormy weather can affect travel across the bridges

### Funding care in Anglesey

Isle of Anglesey County Council provides care needs assessments. The process is the same as the rest of Wales.

### How to search

1. Visit [gofal.wales/cartrefi-gofal/ynys-mon](/cartrefi-gofal/ynys-mon)
2. Filter by care type and location
3. Read CIW reports
4. Contact homes through our enquiry form
5. Arrange a visit

### Local resources

- **Isle of Anglesey County Council** — Adult Services
- **Betsi Cadwaladr University Health Board** — health services
- **Age Cymru Gwynedd and Anglesey** — advice for older people
- **Alzheimer's Society Cymru** — dementia support

---

*Search for care homes in Anglesey at [gofal.wales/cartrefi-gofal/ynys-mon](/cartrefi-gofal/ynys-mon). Compare CIW ratings and make an enquiry today.*`,
  },

  {
    slug: "cartrefi-gofal-sir-benfro",
    title_cy: "Cartrefi gofal yn Sir Benfro — Canllaw lleol",
    title_en: "Care homes in Pembrokeshire — Local guide",
    excerpt_cy: "Canllaw cynhwysfawr i gartrefi gofal yn Sir Benfro, sir arfordirol yn ne-orllewin Cymru gyda Pharc Cenedlaethol Arfordir Penfro a 18.8% yn siarad Cymraeg.",
    excerpt_en: "A comprehensive guide to care homes in Pembrokeshire, a coastal county in south-west Wales with the Pembrokeshire Coast National Park and 18.8% Welsh speakers.",
    published: "2026-04-01",
    category: "county",
    related_county: "sir-benfro",
    content_cy: `## Cartrefi gofal yn Sir Benfro — Canllaw cynhwysfawr

Mae Sir Benfro yn sir arfordirol drawiadol yn ne-orllewin Cymru, yn enwog am Barc Cenedlaethol Arfordir Penfro — yr unig barc cenedlaethol arfordirol yn y DU. Mae'r sir yn cynnig traethau gwobrwyedig, pentrefi pysgota tlws, a chefn gwlad hardd. Yn ôl Cyfrifiad 2021, mae 18.8% o boblogaeth Sir Benfro yn siarad Cymraeg, gyda'r ganran yn uwch yn ardaloedd gogleddol y sir (y rhan a elwir yn draddodiadol yn "Y Preseli").

### Pam dewis cartref gofal yn Sir Benfro?

Mae Sir Benfro yn cynnig amgylchedd arfordirol tawel a phrydferth sy'n ddelfrydol i bobl hŷn. Mae'r awyr iach, y tirweddau godidog, a'r cymunedau cyfeillgar yn creu amgylchedd iach a hapus. Mae trefi fel Hwlffordd, Penfro, Dinbych-y-pysgod, Abergwaun, a Thyddewi yn cynnig amrywiaeth o leoliadau.

Mae Ysbyty Llwynhelyg yn Hwlffordd yn darparu gwasanaethau iechyd i'r sir gyfan, tra bod Ysbyty Dewi Sant yn Hwlffordd a chlinigau cymunedol ar draws y sir yn darparu gwasanaethau ychwanegol.

### Trefi a chymunedau allweddol

**Hwlffordd (Haverfordwest)** — Tref sirol Sir Benfro a'r dref fwyaf. Mae'r mwyafrif o wasanaethau iechyd a gofal wedi'u canoli yma. Mae Ysbyty Llwynhelyg yn darparu gwasanaethau brys ac arbenigol.

**Penfro (Pembroke)** — Tref hanesyddol gyda chastell Penfro, man geni Harri VII. Mae'r dref yn cynnig cartrefi gofal mewn amgylchedd hanesyddol.

**Dinbych-y-pysgod (Tenby)** — Tref glan môr enwog gyda waliau canoloesol, traethau hardd, ac Ynys Bŷr. Mae'r dref yn hynod boblogaidd gydag ymwelwyr a phreswylwyr fel ei gilydd.

**Abergwaun (Fishguard)** — Tref borthladd yng ngogledd y sir gyda gwasanaeth fferi i Iwerddon. Ardal fwy Cymraeg ei naws.

**Tyddewi (St Davids)** — Dinas leiaf Prydain, yn enwog am ei Chadeirlan a'i lleoliad ar Lwybr Arfordir Sir Benfro.

**Arberth (Narberth)** — Tref farchnad boblogaidd yn enwog am ei siopau annibynnol a Folly Farm gerllaw.

### Y Gymraeg yn Sir Benfro

Mae 18.8% o boblogaeth Sir Benfro yn siarad Cymraeg. Mae'r Gymraeg yn gryfach yng ngogledd y sir — yn ardaloedd y Preseli, Abergwaun, a Chrymych — nag yn y de. Mae'r llinell ieithyddol hanesyddol, y "Landsker", yn rhannu'r sir yn ddwy ran: y gogledd Cymraeg a'r de Seisnig.

Wrth chwilio am gartref gofal yn Sir Benfro, ystyriwch leoliad y cartref o ran y Gymraeg. Os yw gofal Cymraeg yn bwysig, edrychwch ar gartrefi yn ardaloedd gogleddol y sir.

Chwiliwch am gartrefi gofal yn Sir Benfro ar [gofal.wales/cartrefi-gofal/sir-benfro](/cartrefi-gofal/sir-benfro).

### Graddfeydd CIW yn Sir Benfro

Mae Arolygiaeth Gofal Cymru (CIW) yn arolygu pob cartref gofal yn Sir Benfro. Mae'r arolygiadau yn mesur:

- **Llesiant** — a yw preswylwyr yn hapus ac yn iach?
- **Gofal a Chymorth** — ansawdd y gofal a ddarperir
- **Arweinyddiaeth a Rheolaeth** — effeithiolrwydd y rheolwyr
- **Yr Amgylchedd Gofal** — diogelwch a chyflwr yr adeilad

Cymharwch raddfeydd CIW ar [gofal.wales/cartrefi-gofal/sir-benfro](/cartrefi-gofal/sir-benfro).

### Mathau o ofal

- **Gofal preswyl** — cymorth bob dydd
- **Gofal nyrsio** — gofal meddygol 24/7
- **Gofal dementia** — gofal arbenigol
- **Gofal seibiant** — arhosiad dros dro
- **Gofal iechyd meddwl** — cymorth arbenigol

### Heriau penodol

Mae Sir Benfro yn sir wledig gyda heriau tebyg i Geredigion:
- **Pellter o ysbytai mawr** — Ysbyty Llwynhelyg yw'r unig ysbyty cyffredinol
- **Trafnidiaeth** — cyfyngedig mewn ardaloedd gwledig
- **Tymhorol** — mae'r sir yn brysur iawn yn yr haf oherwydd twristiaeth

### Cyllido gofal

Mae Cyngor Sir Penfro yn darparu asesiadau anghenion gofal. Mae'r broses ariannu yr un fath â gweddill Cymru.

### Sut i chwilio

1. Ewch i [gofal.wales/cartrefi-gofal/sir-benfro](/cartrefi-gofal/sir-benfro)
2. Hidlwch yn ôl math o ofal a lleoliad
3. Darllenwch adroddiadau CIW
4. Cysylltwch â chartrefi drwy ein ffurflen ymholiad
5. Trefnwch ymweliad

### Adnoddau lleol

- **Cyngor Sir Penfro** — Gwasanaethau Oedolion
- **Bwrdd Iechyd Prifysgol Hywel Dda** — gwasanaethau iechyd
- **Age Cymru Dyfed** — cyngor i bobl hŷn
- **PAVS (Pembrokeshire Association of Voluntary Services)** — cymorth gwirfoddol

---

*Chwiliwch am gartrefi gofal yn Sir Benfro ar [gofal.wales/cartrefi-gofal/sir-benfro](/cartrefi-gofal/sir-benfro). Cymharwch raddfeydd CIW a gwnewch ymholiad heddiw.*`,

    content_en: `## Care homes in Pembrokeshire — A comprehensive guide

Pembrokeshire is a stunning coastal county in south-west Wales, famous for the Pembrokeshire Coast National Park — the UK's only coastal national park. The county offers award-winning beaches, picturesque fishing villages, and beautiful countryside. According to the 2021 Census, 18.8% of Pembrokeshire's population speaks Welsh, with the percentage higher in the northern areas of the county (traditionally known as "Y Preseli").

### Why choose a care home in Pembrokeshire?

Pembrokeshire offers a peaceful and beautiful coastal environment ideal for older people. The fresh air, stunning landscapes, and friendly communities create a healthy and happy environment. Towns such as Haverfordwest, Pembroke, Tenby, Fishguard, and St Davids offer a variety of settings.

Withybush Hospital in Haverfordwest provides health services for the entire county, while St David's Hospital in Haverfordwest and community clinics across the county provide additional services.

### Key towns and communities

**Haverfordwest** — Pembrokeshire's county town and largest town. Most health and care services are centred here. Withybush Hospital provides emergency and specialist services.

**Pembroke** — A historic town with Pembroke Castle, birthplace of Henry VII. The town offers care homes in a historic setting.

**Tenby (Dinbych-y-pysgod)** — A famous seaside town with medieval walls, beautiful beaches, and Caldey Island. The town is hugely popular with visitors and residents alike.

**Fishguard (Abergwaun)** — A port town in the north of the county with a ferry service to Ireland. A more Welsh-speaking area.

**St Davids (Tyddewi)** — Britain's smallest city, famous for its Cathedral and location on the Pembrokeshire Coast Path.

**Narberth (Arberth)** — A popular market town famous for its independent shops and nearby Folly Farm.

### Welsh language in Pembrokeshire

18.8% of Pembrokeshire's population speaks Welsh. Welsh is stronger in the north of the county — in the Preseli, Fishguard, and Crymych areas — than in the south. The historic linguistic line, the "Landsker," divides the county into two parts: the Welsh-speaking north and the English-speaking south.

When searching for a care home in Pembrokeshire, consider the home's location in relation to the Welsh language. If Welsh-medium care is important, look at homes in the northern areas of the county.

Search for care homes in Pembrokeshire at [gofal.wales/cartrefi-gofal/sir-benfro](/cartrefi-gofal/sir-benfro).

### CIW ratings in Pembrokeshire

Care Inspectorate Wales (CIW) inspects every care home in Pembrokeshire. Inspections measure:

- **Well-being** — are residents happy and healthy?
- **Care and Support** — quality of care provided
- **Leadership and Management** — effectiveness of managers
- **The Care Environment** — safety and building condition

Compare CIW ratings at [gofal.wales/cartrefi-gofal/sir-benfro](/cartrefi-gofal/sir-benfro).

### Types of care

- **Residential care** — daily support
- **Nursing care** — 24/7 medical care
- **Dementia care** — specialist care
- **Respite care** — temporary stays
- **Mental health care** — specialist support

### Specific challenges

Pembrokeshire is a rural county with challenges similar to Ceredigion:
- **Distance from major hospitals** — Withybush is the only general hospital
- **Transport** — limited in rural areas
- **Seasonal** — the county is very busy in summer due to tourism

### Funding care

Pembrokeshire County Council provides care needs assessments. The funding process is the same as the rest of Wales.

### How to search

1. Visit [gofal.wales/cartrefi-gofal/sir-benfro](/cartrefi-gofal/sir-benfro)
2. Filter by care type and location
3. Read CIW reports
4. Contact homes through our enquiry form
5. Arrange a visit

### Local resources

- **Pembrokeshire County Council** — Adult Services
- **Hywel Dda University Health Board** — health services
- **Age Cymru Dyfed** — advice for older people
- **PAVS (Pembrokeshire Association of Voluntary Services)** — voluntary support

---

*Search for care homes in Pembrokeshire at [gofal.wales/cartrefi-gofal/sir-benfro](/cartrefi-gofal/sir-benfro). Compare CIW ratings and make an enquiry today.*`,
  },

  {
    slug: "cartrefi-gofal-conwy",
    title_cy: "Cartrefi gofal yng Nghonwy — Canllaw lleol",
    title_en: "Care homes in Conwy — Local guide",
    excerpt_cy: "Canllaw cynhwysfawr i gartrefi gofal yng Nghonwy, sir yng ngogledd Cymru gyda 27.4% yn siarad Cymraeg, gan gynnwys graddfeydd CIW a gwybodaeth leol.",
    excerpt_en: "A comprehensive guide to care homes in Conwy, a county in north Wales with 27.4% Welsh speakers, including CIW ratings and local information.",
    published: "2026-04-01",
    category: "county",
    related_county: "conwy",
    content_cy: `## Cartrefi gofal yng Nghonwy — Canllaw cynhwysfawr

Mae Bwrdeistref Sirol Conwy yn sir amrywiol yng ngogledd Cymru sy'n ymestyn o arfordir gogledd Cymru i fynyddoedd Eryri. Mae'r sir yn cynnig popeth o drefi glan môr Fictoraidd i bentrefi mynyddig tawel. Yn ôl Cyfrifiad 2021, mae 27.4% o boblogaeth Conwy yn siarad Cymraeg, gyda'r ganran yn uwch yn ardaloedd mewndirol y sir.

### Pam dewis cartref gofal yng Nghonwy?

Mae Conwy yn cynnig amrywiaeth ryfeddol o leoliadau. Mae trefi arfordirol fel Llandudno, Bae Colwyn, a Chonwy yn boblogaidd gyda phobl sy'n hoffi bywyd glan môr, tra bod ardaloedd mewndirol fel Betws-y-Coed, Llanrwst, a Dyffryn Conwy yn cynnig tawelwch a harddwch mynyddig. Mae hyn yn golygu bod rhywbeth at ddant pawb.

Mae Ysbyty Llandudno ac Ysbyty Glan Clwyd (yn Sir Ddinbych gyfagos) yn darparu gwasanaethau iechyd i'r sir. Mae Ysbyty Gwynedd ym Mangor hefyd yn agos i drigolion gorllewin y sir.

Mae Conwy hefyd yn enwog am ei chestyll a'i hatyniadau hanesyddol. Mae Castell Conwy (UNESCO), Castell Gwrych, a Gerddi Bodnant ymhlith yr atyniadau mwyaf poblogaidd yng Nghymru gyfan.

### Trefi a chymunedau allweddol

**Llandudno** — Tref glan môr Fictoraidd fwyaf Cymru, yn enwog am y Gogarth (Great Orme), y pier, a'r promenâd. Mae nifer sylweddol o gartrefi gofal yn Llandudno, gan gynnwys rhai o safon uchel iawn.

**Bae Colwyn (Colwyn Bay)** — Tref arfordirol gyda chyfleusterau modern a mynediad at Sw Fynydd Cymru (Welsh Mountain Zoo).

**Conwy** — Tref ganoloesol wedi'i hamgylchynu gan waliau, gyda chastell UNESCO. Amgylchedd hanesyddol unigryw.

**Llanrwst** — Tref farchnad brydferth ar lan Afon Conwy, yng nghanol Dyffryn Conwy. Cymuned Gymraeg gref.

**Betws-y-Coed** — Pentref twristaidd yn ymyl Eryri, yn enwog am ei bontydd, rhaeadrau, a choedwigoedd.

**Abergele** — Tref arfordirol gyda mynediad at yr A55 a gwasanaethau da.

**Towyn a Bae Cinmel** — Cymunedau arfordirol ger Bae Colwyn.

### Y Gymraeg yng Nghonwy

Mae 27.4% o boblogaeth Conwy yn siarad Cymraeg. Mae'r Gymraeg yn gryfach yn ardaloedd mewndirol y sir — Dyffryn Conwy, Llanrwst, a Betws-y-Coed — nag ar yr arfordir, lle mae mewnfudo o Loegr wedi dylanwadu ar y demograffeg ieithyddol.

Mae'r Cynnig Rhagweithiol yn bwysig yng Nghonwy, yn enwedig i bobl hŷn o ardaloedd Cymraeg y sir. Wrth chwilio am gartref gofal, gofynnwch am lefel y ddarpariaeth Gymraeg. Os yw gofal Cymraeg yn bwysig i chi, ystyriwch gartrefi yn ardaloedd mewndirol y sir.

Chwiliwch am gartrefi gofal yng Nghonwy ar [gofal.wales/cartrefi-gofal/conwy](/cartrefi-gofal/conwy).

### Graddfeydd CIW yng Nghonwy

Mae Arolygiaeth Gofal Cymru (CIW) yn arolygu pob cartref gofal cofrestredig yng Nghonwy. Mae'r sir yn gartref i nifer sylweddol o gartrefi gofal, yn enwedig yn Llandudno a Bae Colwyn.

Mae CIW yn graddio:
- **Llesiant** — hapusrwydd a lles
- **Gofal a Chymorth** — ansawdd y gofal
- **Arweinyddiaeth a Rheolaeth** — effeithiolrwydd rheoli
- **Yr Amgylchedd Gofal** — diogelwch a chyflwr

Cymharwch raddfeydd CIW ar [gofal.wales/cartrefi-gofal/conwy](/cartrefi-gofal/conwy).

### Mathau o ofal

- **Gofal preswyl** — cymorth bob dydd
- **Gofal nyrsio** — gofal meddygol 24/7
- **Gofal dementia** — unedau arbenigol
- **Gofal seibiant** — arhosiad dros dro
- **Gofal iechyd meddwl** — cymorth arbenigol

### Ystyriaethau arbennig yng Nghonwy

- **Trefi glan môr** — mae Llandudno a Bae Colwyn yn boblogaidd gyda phobl sy'n ymddeol, felly mae dwysedd uchel o gartrefi gofal yno
- **Eryri** — mae ardaloedd mynyddig yn hardd ond yn gallu bod yn anghysbell yn y gaeaf
- **Yr A55** — mae'r ffordd ddeuol yn cysylltu'r arfordir yn dda, gan hwyluso teithio

### Cyllido gofal yng Nghonwy

Mae Cyngor Bwrdeistref Sirol Conwy yn darparu asesiadau anghenion gofal ac asesiadau ariannol.

### Sut i chwilio

1. Ewch i [gofal.wales/cartrefi-gofal/conwy](/cartrefi-gofal/conwy)
2. Hidlwch yn ôl math o ofal, lleoliad, a graddfeydd CIW
3. Darllenwch adroddiadau CIW manwl
4. Cysylltwch â chartrefi drwy ein ffurflen ymholiad
5. Trefnwch ymweliad

### Adnoddau lleol

- **Cyngor Bwrdeistref Sirol Conwy** — Gwasanaethau Oedolion
- **Bwrdd Iechyd Prifysgol Betsi Cadwaladr** — gwasanaethau iechyd
- **Age Cymru Gwynedd a Môn** — cyngor i bobl hŷn
- **CVSC (Conwy Voluntary Services Council)** — cymorth gwirfoddol

---

*Chwiliwch am gartrefi gofal yng Nghonwy ar [gofal.wales/cartrefi-gofal/conwy](/cartrefi-gofal/conwy). Cymharwch raddfeydd CIW, gweld ffotograffau, a gwnewch ymholiad heddiw.*`,

    content_en: `## Care homes in Conwy — A comprehensive guide

Conwy County Borough is a diverse county in north Wales stretching from the north Wales coast to the mountains of Snowdonia (Eryri). The county offers everything from Victorian seaside towns to peaceful mountain villages. According to the 2021 Census, 27.4% of Conwy's population speaks Welsh, with the percentage higher in the county's inland areas.

### Why choose a care home in Conwy?

Conwy offers a remarkable variety of settings. Coastal towns like Llandudno, Colwyn Bay, and Conwy are popular with those who enjoy seaside life, while inland areas like Betws-y-Coed, Llanrwst, and the Conwy Valley offer peace and mountainous beauty. This means there is something for everyone.

Llandudno Hospital and Glan Clwyd Hospital (in neighbouring Denbighshire) provide health services for the county. Ysbyty Gwynedd in Bangor is also close to residents in the west of the county.

Conwy is also famous for its castles and historic attractions. Conwy Castle (UNESCO), Gwrych Castle, and Bodnant Gardens are among the most popular attractions in all of Wales.

### Key towns and communities

**Llandudno** — Wales' largest Victorian seaside town, famous for the Great Orme, the pier, and the promenade. A significant number of care homes in Llandudno, including some of very high quality.

**Colwyn Bay** — A coastal town with modern facilities and access to the Welsh Mountain Zoo.

**Conwy** — A medieval walled town with a UNESCO castle. A unique historic environment.

**Llanrwst** — A beautiful market town on the banks of the River Conwy, in the heart of the Conwy Valley. A strong Welsh-speaking community.

**Betws-y-Coed** — A tourist village on the edge of Snowdonia, famous for its bridges, waterfalls, and forests.

**Abergele** — A coastal town with access to the A55 and good services.

**Towyn and Kinmel Bay** — Coastal communities near Colwyn Bay.

### Welsh language in Conwy

27.4% of Conwy's population speaks Welsh. Welsh is stronger in the county's inland areas — the Conwy Valley, Llanrwst, and Betws-y-Coed — than on the coast, where in-migration from England has influenced the linguistic demographics.

The Active Offer is important in Conwy, especially for older people from the county's Welsh-speaking areas. When searching for a care home, ask about the level of Welsh language provision. If Welsh-medium care is important to you, consider homes in the county's inland areas.

Search for care homes in Conwy at [gofal.wales/cartrefi-gofal/conwy](/cartrefi-gofal/conwy).

### CIW ratings in Conwy

Care Inspectorate Wales (CIW) inspects every registered care home in Conwy. The county is home to a significant number of care homes, especially in Llandudno and Colwyn Bay.

CIW rates:
- **Well-being** — happiness and welfare
- **Care and Support** — quality of care
- **Leadership and Management** — management effectiveness
- **The Care Environment** — safety and condition

Compare CIW ratings at [gofal.wales/cartrefi-gofal/conwy](/cartrefi-gofal/conwy).

### Types of care

- **Residential care** — daily support
- **Nursing care** — 24/7 medical care
- **Dementia care** — specialist units
- **Respite care** — temporary stays
- **Mental health care** — specialist support

### Special considerations for Conwy

- **Seaside towns** — Llandudno and Colwyn Bay are popular retirement destinations, so there is a high density of care homes
- **Snowdonia** — mountainous areas are beautiful but can be remote in winter
- **The A55** — the dual carriageway connects the coast well, facilitating travel

### Funding care in Conwy

Conwy County Borough Council provides care needs assessments and financial assessments.

### How to search

1. Visit [gofal.wales/cartrefi-gofal/conwy](/cartrefi-gofal/conwy)
2. Filter by care type, location, and CIW ratings
3. Read detailed CIW reports
4. Contact homes through our enquiry form
5. Arrange a visit

### Local resources

- **Conwy County Borough Council** — Adult Services
- **Betsi Cadwaladr University Health Board** — health services
- **Age Cymru Gwynedd and Anglesey** — advice for older people
- **CVSC (Conwy Voluntary Services Council)** — voluntary support

---

*Search for care homes in Conwy at [gofal.wales/cartrefi-gofal/conwy](/cartrefi-gofal/conwy). Compare CIW ratings, view photos, and make an enquiry today.*`,
  },

  {
    slug: "cartrefi-gofal-sir-ddinbych",
    title_cy: "Cartrefi gofal yn Sir Ddinbych — Canllaw lleol",
    title_en: "Care homes in Denbighshire — Local guide",
    excerpt_cy: "Canllaw cynhwysfawr i gartrefi gofal yn Sir Ddinbych, sir yng ngogledd-ddwyrain Cymru gyda 26.4% yn siarad Cymraeg, gan gynnwys graddfeydd CIW a gwybodaeth leol.",
    excerpt_en: "A comprehensive guide to care homes in Denbighshire, a county in north-east Wales with 26.4% Welsh speakers, including CIW ratings and local information.",
    published: "2026-04-01",
    category: "county",
    related_county: "sir-ddinbych",
    content_cy: `## Cartrefi gofal yn Sir Ddinbych — Canllaw cynhwysfawr

Mae Sir Ddinbych yn sir amrywiol yng ngogledd-ddwyrain Cymru sy'n ymestyn o arfordir gogledd Cymru yn y Rhyl a Phrestatyn i Fynyddoedd Clwyd a Dyffryn Clwyd yn y mewndir. Mae'r sir yn cynnig cyfuniad unigryw o drefi arfordirol, pentrefi hanesyddol, a chefn gwlad godidog. Yn ôl Cyfrifiad 2021, mae 26.4% o boblogaeth Sir Ddinbych yn siarad Cymraeg.

### Pam dewis cartref gofal yn Sir Ddinbych?

Mae Sir Ddinbych yn cynnig dewis eang o leoliadau — o drefi glan môr y Rhyl a Phrestatyn i drefi hanesyddol Dinbych, Rhuthun, a Llangollen. Mae'r amrywiaeth hon yn golygu y gallwch ddod o hyd i gartref gofal sy'n gweddu'n berffaith i anghenion a dewisiadau eich anwylyd.

Mae Ysbyty Glan Clwyd ym Modelwyddan yn ysbyty cyffredinol mawr sy'n gwasanaethu Sir Ddinbych a'r ardal ehangach. Mae'r ysbyty wedi'i uwchraddio'n helaeth ac yn darparu ystod lawn o wasanaethau arbenigol.

### Trefi a chymunedau allweddol

**Y Rhyl** — Tref glan môr ar arfordir gogledd Cymru gyda nifer o gartrefi gofal. Mae'r dref wedi gweld adfywiad sylweddol yn y blynyddoedd diwethaf, gan gynnwys datblygiad SC2 (canolfan dŵr a hamdden).

**Prestatyn** — Tref arfordirol gyda thraeth hyfryd ac Offa's Dyke Path yn cychwyn yma. Mae nifer o gartrefi gofal o safon yn yr ardal.

**Dinbych (Denbigh)** — Tref hanesyddol gyda chastell canoloesol, yng nghanol Sir Ddinbych. Cymuned Gymraeg gryfach na'r arfordir.

**Rhuthun (Ruthin)** — Tref farchnad brydferth yn Nyffryn Clwyd, yn enwog am ei phensaernïaeth ganoloesol a'i charchar hanesyddol. Cymuned Gymraeg gref.

**Llangollen** — Tref enwog ar lan Afon Dyfrdwy, yn adnabyddus am yr Eisteddfod Gerddorol Ryngwladol, Traphont Ddŵr Pontcysyllte (UNESCO), a'r Rheilffordd Stêm.

**Corwen** — Tref fach yn Nyffryn Dyfrdwy gyda chymuned Gymraeg gref a Rheilffordd Llangollen gerllaw.

### Y Gymraeg yn Sir Ddinbych

Mae 26.4% o boblogaeth Sir Ddinbych yn siarad Cymraeg. Mae'r Gymraeg yn gryfach yn ardaloedd mewndirol y sir — Dyffryn Clwyd, Rhuthun, Dinbych, a Chorwen — nag ar yr arfordir yn y Rhyl a Phrestatyn.

Mae'r Cynnig Rhagweithiol yn bwysig i lawer o deuluoedd yn Sir Ddinbych. Os yw eich anwylyd wedi'i fagu yn Gymraeg, mae'n bwysig dod o hyd i gartref gofal sy'n gallu darparu gofal drwy'r Gymraeg.

Chwiliwch am gartrefi gofal yn Sir Ddinbych ar [gofal.wales/cartrefi-gofal/sir-ddinbych](/cartrefi-gofal/sir-ddinbych).

### Graddfeydd CIW yn Sir Ddinbych

Mae Arolygiaeth Gofal Cymru (CIW) yn arolygu pob cartref gofal cofrestredig yn Sir Ddinbych. Mae graddfeydd CIW yn helpu teuluoedd i gymharu cartrefi:

- **Llesiant** — a yw preswylwyr yn hapus?
- **Gofal a Chymorth** — ansawdd y gofal
- **Arweinyddiaeth a Rheolaeth** — effeithiolrwydd y tîm rheoli
- **Yr Amgylchedd Gofal** — diogelwch a chyflwr yr adeilad

Cymharwch raddfeydd CIW ar [gofal.wales/cartrefi-gofal/sir-ddinbych](/cartrefi-gofal/sir-ddinbych).

### Mathau o ofal

- **Gofal preswyl** — cymorth bob dydd mewn amgylchedd cartrefol
- **Gofal nyrsio** — gofal meddygol 24 awr
- **Gofal dementia** — unedau arbenigol
- **Gofal seibiant** — arhosiad dros dro i roi seibiant i ofalwyr
- **Gofal iechyd meddwl** — cymorth arbenigol

### Ystyriaethau arbennig

- **Arfordir vs mewndir** — mae'r sir yn cynnig dau fath gwahanol o amgylchedd; ystyriwch pa un sy'n fwyaf addas
- **Mynediad at Ysbyty Glan Clwyd** — mae'r ysbyty ym Modelwyddan yn ganolog i'r sir
- **Yr A55** — mae'r ffordd ddeuol yn cysylltu trefi arfordirol yn dda
- **Llangollen** — amgylchedd unigryw gyda thwristiaeth drwy gydol y flwyddyn

### Cyllido gofal yn Sir Ddinbych

Mae Cyngor Sir Ddinbych yn darparu asesiadau anghenion gofal ac asesiadau ariannol. Mae'r broses yr un fath â gweddill Cymru.

### Sut i chwilio

1. Ewch i [gofal.wales/cartrefi-gofal/sir-ddinbych](/cartrefi-gofal/sir-ddinbych)
2. Hidlwch yn ôl math o ofal, lleoliad, a graddfeydd CIW
3. Darllenwch adroddiadau CIW
4. Cysylltwch â chartrefi drwy ein ffurflen ymholiad
5. Trefnwch ymweliad

### Adnoddau lleol

- **Cyngor Sir Ddinbych** — Gwasanaethau Oedolion
- **Bwrdd Iechyd Prifysgol Betsi Cadwaladr** — gwasanaethau iechyd
- **Age Cymru Clwyd** — cyngor i bobl hŷn
- **DVSC (Denbighshire Voluntary Services Council)** — cymorth gwirfoddol

---

*Chwiliwch am gartrefi gofal yn Sir Ddinbych ar [gofal.wales/cartrefi-gofal/sir-ddinbych](/cartrefi-gofal/sir-ddinbych). Cymharwch raddfeydd CIW a gwnewch ymholiad heddiw.*`,

    content_en: `## Care homes in Denbighshire — A comprehensive guide

Denbighshire is a diverse county in north-east Wales stretching from the north Wales coast at Rhyl and Prestatyn to the Clwydian Mountains and the Vale of Clwyd inland. The county offers a unique combination of coastal towns, historic villages, and stunning countryside. According to the 2021 Census, 26.4% of Denbighshire's population speaks Welsh.

### Why choose a care home in Denbighshire?

Denbighshire offers a wide choice of settings — from the seaside towns of Rhyl and Prestatyn to the historic towns of Denbigh, Ruthin, and Llangollen. This variety means you can find a care home perfectly suited to your loved one's needs and preferences.

Glan Clwyd Hospital in Bodelwyddan is a major general hospital serving Denbighshire and the wider area. The hospital has been extensively upgraded and provides a full range of specialist services.

### Key towns and communities

**Rhyl** — A seaside town on the north Wales coast with several care homes. The town has seen significant regeneration in recent years, including the SC2 development (water and leisure centre).

**Prestatyn** — A coastal town with a lovely beach where Offa's Dyke Path begins. Several quality care homes in the area.

**Denbigh (Dinbych)** — A historic town with a medieval castle, in the centre of Denbighshire. A stronger Welsh-speaking community than the coast.

**Ruthin (Rhuthun)** — A beautiful market town in the Vale of Clwyd, famous for its medieval architecture and historic gaol. A strong Welsh-speaking community.

**Llangollen** — A famous town on the banks of the River Dee, known for the International Musical Eisteddfod, Pontcysyllte Aqueduct (UNESCO), and the Steam Railway.

**Corwen** — A small town in the Dee Valley with a strong Welsh-speaking community and the Llangollen Railway nearby.

### Welsh language in Denbighshire

26.4% of Denbighshire's population speaks Welsh. Welsh is stronger in the county's inland areas — the Vale of Clwyd, Ruthin, Denbigh, and Corwen — than on the coast in Rhyl and Prestatyn.

The Active Offer is important for many families in Denbighshire. If your loved one was raised through Welsh, it is important to find a care home that can provide care through the medium of Welsh.

Search for care homes in Denbighshire at [gofal.wales/cartrefi-gofal/sir-ddinbych](/cartrefi-gofal/sir-ddinbych).

### CIW ratings in Denbighshire

Care Inspectorate Wales (CIW) inspects every registered care home in Denbighshire. CIW ratings help families compare homes:

- **Well-being** — are residents happy?
- **Care and Support** — quality of care
- **Leadership and Management** — management team effectiveness
- **The Care Environment** — safety and building condition

Compare CIW ratings at [gofal.wales/cartrefi-gofal/sir-ddinbych](/cartrefi-gofal/sir-ddinbych).

### Types of care

- **Residential care** — daily support in a homely environment
- **Nursing care** — 24-hour medical care
- **Dementia care** — specialist units
- **Respite care** — temporary stays to give carers a break
- **Mental health care** — specialist support

### Special considerations

- **Coast vs inland** — the county offers two distinctly different environments; consider which is most suitable
- **Access to Glan Clwyd Hospital** — the hospital in Bodelwyddan is centrally located in the county
- **The A55** — the dual carriageway connects coastal towns well
- **Llangollen** — a unique environment with year-round tourism

### Funding care in Denbighshire

Denbighshire County Council provides care needs assessments and financial assessments. The process is the same as the rest of Wales.

### How to search

1. Visit [gofal.wales/cartrefi-gofal/sir-ddinbych](/cartrefi-gofal/sir-ddinbych)
2. Filter by care type, location, and CIW ratings
3. Read CIW reports
4. Contact homes through our enquiry form
5. Arrange a visit

### Local resources

- **Denbighshire County Council** — Adult Services
- **Betsi Cadwaladr University Health Board** — health services
- **Age Cymru Clwyd** — advice for older people
- **DVSC (Denbighshire Voluntary Services Council)** — voluntary support

---

*Search for care homes in Denbighshire at [gofal.wales/cartrefi-gofal/sir-ddinbych](/cartrefi-gofal/sir-ddinbych). Compare CIW ratings and make an enquiry today.*`,
  },

  {
    slug: "cartrefi-gofal-wrecsam",
    title_cy: "Cartrefi gofal yn Wrecsam — Canllaw lleol",
    title_en: "Care homes in Wrexham — Local guide",
    excerpt_cy: "Canllaw cynhwysfawr i gartrefi gofal yn Wrecsam, y dref fwyaf yng ngogledd Cymru gyda 14.1% yn siarad Cymraeg, gan gynnwys graddfeydd CIW a gwybodaeth leol.",
    excerpt_en: "A comprehensive guide to care homes in Wrexham, the largest town in north Wales with 14.1% Welsh speakers, including CIW ratings and local information.",
    published: "2026-04-01",
    category: "county",
    related_county: "wrecsam",
    content_cy: `## Cartrefi gofal yn Wrecsam — Canllaw cynhwysfawr

Mae Wrecsam yn fwrdeistref sirol yng ngogledd-ddwyrain Cymru, ac yn gartref i'r dref fwyaf yng ngogledd Cymru. Mae'r ardal yn ymestyn o Wrecsam ei hun i bentrefi gwledig yn Nyffryn Ceiriog a Mynyddoedd y Berwyn. Derbyniodd Wrecsam statws dinas yn 2022 fel rhan o ddathliadau Jiwbilî Platinwm y Frenhines. Yn ôl Cyfrifiad 2021, mae 14.1% o boblogaeth Wrecsam yn siarad Cymraeg.

### Pam dewis cartref gofal yn Wrecsam?

Mae Wrecsam yn cynnig lleoliad strategol rhagorol — mae'n agos at y ffin â Lloegr, gyda mynediad hawdd i'r A483 a'r A55, ac mae'n dref fawr gyda phob math o gyfleusterau. Mae Ysbyty Maelor Wrecsam yn un o'r ysbytai mwyaf yng ngogledd Cymru, yn darparu ystod lawn o wasanaethau brys ac arbenigol.

Mae Wrecsam yn ddinas â hanes diwydiannol cyfoethog, yn enwog am ei chysylltiadau â'r diwydiant glo a haearn. Heddiw, mae'r ddinas yn adnabyddus am Glwb Pêl-droed Wrecsam (un o'r clybiau hynaf yn y byd), Prifysgol Wrecsam Glyndŵr, a Thraphont Ddŵr Pontcysyllte (UNESCO) gerllaw.

### Ardaloedd allweddol

**Canol Wrecsam** — Canol y ddinas gyda siopau, marchnad, Eglwys San Silyn (St Giles' Church), a chyfleusterau modern. Mae nifer o gartrefi gofal o fewn cyrraedd hawdd i ganol y ddinas.

**Coedpoeth** — Pentref i'r gorllewin o Wrecsam gyda chymuned Gymraeg gryfach. Ardal dawelach gyda mynediad at gefn gwlad.

**Rhosllannerchrugog (Rhos)** — Un o bentrefi mwyaf Cymru, gyda threftadaeth ddiwydiannol a chymuned Gymraeg.

**Gresfffordd (Gresford)** — Pentref hardd i'r gogledd o Wrecsam, yn adnabyddus am Eglwys Holl Saint a'r gofeb i drychineb mwyngloddio 1934.

**Cefn Mawr** — Pentref ar lan Afon Dyfrdwy, yn agos at Draphont Ddŵr Pontcysyllte.

**Rhiwabon (Ruabon)** — Pentref hanesyddol yn enwog am ei deils a'i gysylltiadau diwydiannol.

**Dyffryn Ceiriog** — Cwm gwledig hardd i'r de-orllewin o Wrecsam, gyda chymunedau bach Cymraeg.

### Y Gymraeg yn Wrecsam

Mae 14.1% o boblogaeth Wrecsam yn siarad Cymraeg. Er bod y ganran yn is na rhai siroedd gorllewinol, mae cymunedau Cymraeg cryf yn bodoli yn Wrecsam, yn enwedig yn ardaloedd Coedpoeth, Rhosllannerchrugog, a Dyffryn Ceiriog.

Mae'r Cynnig Rhagweithiol yn bwysig i deuluoedd Cymraeg yn Wrecsam. Wrth chwilio am gartref gofal, gofynnwch am y ddarpariaeth Gymraeg, yn enwedig os yw eich anwylyd yn siaradwr Cymraeg.

Chwiliwch am gartrefi gofal yn Wrecsam ar [gofal.wales/cartrefi-gofal/wrecsam](/cartrefi-gofal/wrecsam).

### Graddfeydd CIW yn Wrecsam

Mae Arolygiaeth Gofal Cymru (CIW) yn arolygu pob cartref gofal cofrestredig yn Wrecsam. Mae'r arolygiadau yn mesur:

- **Llesiant** — a yw preswylwyr yn hapus, yn iach, ac yn cael eu parchu?
- **Gofal a Chymorth** — ansawdd y gofal a ddarperir
- **Arweinyddiaeth a Rheolaeth** — effeithiolrwydd y rheolwyr
- **Yr Amgylchedd Gofal** — diogelwch a chyflwr yr adeilad

Cymharwch raddfeydd CIW ar [gofal.wales/cartrefi-gofal/wrecsam](/cartrefi-gofal/wrecsam).

### Mathau o ofal

- **Gofal preswyl** — cymorth bob dydd
- **Gofal nyrsio** — gofal meddygol 24/7
- **Gofal dementia** — unedau arbenigol
- **Gofal seibiant** — arhosiad dros dro
- **Gofal iechyd meddwl** — cymorth arbenigol
- **Anabledd dysgu** — gofal arbenigol

### Ystyriaethau arbennig

- **Lleoliad strategol** — mae Wrecsam yn agos at y ffin â Lloegr, sy'n golygu bod rhai teuluoedd yn ystyried cartrefi gofal ar ddwy ochr y ffin; cofiwch fod y system ofal yng Nghymru yn wahanol i Loegr (CIW nid CQC)
- **Ysbyty Maelor** — un o'r ysbytai mwyaf yng ngogledd Cymru, yn agos at y mwyafrif o gartrefi gofal yn yr ardal
- **Prifysgol Wrecsam Glyndŵr** — yn cynnal ymchwil iechyd sy'n dylanwadu ar ansawdd gofal
- **Clwb Pêl-droed Wrecsam** — mae'r gymuned pêl-droed leol yn creu ymdeimlad o berthyn sy'n bwysig i lawer o breswylwyr

### Cyllido gofal yn Wrecsam

Mae Cyngor Bwrdeistref Sirol Wrecsam yn darparu asesiadau anghenion gofal. Mae'r broses ariannu yr un fath â gweddill Cymru, gyda phrawf modd i benderfynu ar gyfraniad y cyngor.

### Sut i chwilio

1. Ewch i [gofal.wales/cartrefi-gofal/wrecsam](/cartrefi-gofal/wrecsam) i weld pob cartref gofal yn yr ardal
2. Hidlwch yn ôl math o ofal, lleoliad, a graddfeydd CIW
3. Darllenwch adroddiadau CIW manwl
4. Cysylltwch â chartrefi drwy ein ffurflen ymholiad ar-lein
5. Trefnwch ymweliad i weld y cartref drosoch eich hun

### Adnoddau lleol

- **Cyngor Bwrdeistref Sirol Wrecsam** — Gwasanaethau Oedolion
- **Bwrdd Iechyd Prifysgol Betsi Cadwaladr** — gwasanaethau iechyd
- **Age Cymru Clwyd** — cyngor i bobl hŷn
- **AVOW (Association of Voluntary Organisations in Wrexham)** — cymorth gwirfoddol
- **Prifysgol Wrecsam Glyndŵr** — ymchwil ac adnoddau iechyd

---

*Chwiliwch am gartrefi gofal yn Wrecsam ar [gofal.wales/cartrefi-gofal/wrecsam](/cartrefi-gofal/wrecsam). Cymharwch raddfeydd CIW, gweld ffotograffau, a gwnewch ymholiad heddiw.*`,

    content_en: `## Care homes in Wrexham — A comprehensive guide

Wrexham is a county borough in north-east Wales, home to the largest town in north Wales. The area extends from Wrexham itself to rural villages in the Ceiriog Valley and the Berwyn Mountains. Wrexham received city status in 2022 as part of the Queen's Platinum Jubilee celebrations. According to the 2021 Census, 14.1% of Wrexham's population speaks Welsh.

### Why choose a care home in Wrexham?

Wrexham offers an excellent strategic location — it is close to the English border, with easy access to the A483 and A55, and is a large town with all types of facilities. Wrexham Maelor Hospital is one of the largest hospitals in north Wales, providing a full range of emergency and specialist services.

Wrexham is a city with a rich industrial history, famous for its connections to the coal and iron industries. Today, the city is known for Wrexham AFC (one of the oldest football clubs in the world), Wrexham Glyndwr University, and the nearby Pontcysyllte Aqueduct (UNESCO).

### Key areas

**Wrexham town centre** — The city centre with shops, market, St Giles' Church, and modern facilities. Several care homes within easy reach of the centre.

**Coedpoeth** — A village to the west of Wrexham with a stronger Welsh-speaking community. A quieter area with access to countryside.

**Rhosllannerchrugog (Rhos)** — One of the largest villages in Wales, with industrial heritage and a Welsh-speaking community.

**Gresford** — A beautiful village to the north of Wrexham, known for All Saints' Church and the memorial to the 1934 mining disaster.

**Cefn Mawr** — A village on the banks of the River Dee, close to Pontcysyllte Aqueduct.

**Ruabon (Rhiwabon)** — A historic village famous for its tiles and industrial connections.

**Ceiriog Valley** — A beautiful rural valley to the south-west of Wrexham, with small Welsh-speaking communities.

### Welsh language in Wrexham

14.1% of Wrexham's population speaks Welsh. Although the percentage is lower than some western counties, strong Welsh-speaking communities exist in Wrexham, especially in the areas of Coedpoeth, Rhosllannerchrugog, and the Ceiriog Valley.

The Active Offer is important for Welsh-speaking families in Wrexham. When searching for a care home, ask about Welsh language provision, especially if your loved one is a Welsh speaker.

Search for care homes in Wrexham at [gofal.wales/cartrefi-gofal/wrecsam](/cartrefi-gofal/wrecsam).

### CIW ratings in Wrexham

Care Inspectorate Wales (CIW) inspects every registered care home in Wrexham. Inspections measure:

- **Well-being** — are residents happy, healthy, and respected?
- **Care and Support** — quality of care provided
- **Leadership and Management** — effectiveness of managers
- **The Care Environment** — safety and building condition

Compare CIW ratings at [gofal.wales/cartrefi-gofal/wrecsam](/cartrefi-gofal/wrecsam).

### Types of care

- **Residential care** — daily support
- **Nursing care** — 24/7 medical care
- **Dementia care** — specialist units
- **Respite care** — temporary stays
- **Mental health care** — specialist support
- **Learning disability** — specialist care

### Special considerations

- **Strategic location** — Wrexham is close to the English border, meaning some families consider care homes on both sides; remember that the care system in Wales is different from England (CIW not CQC)
- **Maelor Hospital** — one of the largest hospitals in north Wales, close to most care homes in the area
- **Wrexham Glyndwr University** — conducts health research that influences care quality
- **Wrexham AFC** — the local football community creates a sense of belonging that is important to many residents

### Funding care in Wrexham

Wrexham County Borough Council provides care needs assessments. The funding process is the same as the rest of Wales, with a means test to determine the council's contribution.

### How to search

1. Visit [gofal.wales/cartrefi-gofal/wrecsam](/cartrefi-gofal/wrecsam) to see every care home in the area
2. Filter by care type, location, and CIW ratings
3. Read detailed CIW reports
4. Contact homes through our online enquiry form
5. Arrange a visit to see the home for yourself

### Local resources

- **Wrexham County Borough Council** — Adult Services
- **Betsi Cadwaladr University Health Board** — health services
- **Age Cymru Clwyd** — advice for older people
- **AVOW (Association of Voluntary Organisations in Wrexham)** — voluntary support
- **Wrexham Glyndwr University** — health research and resources

---

*Search for care homes in Wrexham at [gofal.wales/cartrefi-gofal/wrecsam](/cartrefi-gofal/wrecsam). Compare CIW ratings, view photos, and make an enquiry today.*`,
  },
];
