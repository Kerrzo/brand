Yes. I’d now define the site IA like this:

# Paul Kerr — Site IA

## Home

Purpose: **the editorial front door, not a résumé.**

Core message:
**Architecting the AI Era.**

Homepage should pull highlights from the rest of the site rather than duplicate them.

Suggested flow:

- Hero / positioning
- Current experiments
- Building now
- Selected shipped work
- Latest learnings
- About / experience signal
- CTA: **Bring me a problem worth solving.**

Primary nav order:

**Experiments · Building · Shipped · Learnings · About**

---

## Experiments

**Definition:** active investigations where the outcome is not yet known.

This should stay deliberately small. When an experiment ends, it leaves this section.

### 1. Wi-Fi Human Sensing

**Working question:**
**Can Wi-Fi count people in a room?**

Status: **Starting**

Technology:
RuView · Wi-Fi CSI · ESP32-S3 · signal processing

Initial investigation:

- human presence
- people counting
- entering/leaving
- stationary vs moving
- false positives / negatives
- accuracy against ground truth

Potential future direction:

- anonymous meeting-room occupancy
- actual vs booked utilisation
- after-hours presence
- building operations
- eventually speculative emergency situational awareness

Important: PK experiment first. If it becomes an Amica pilot, the story can evolve naturally.

Possible slug:
`/experiments/wifi-human-sensing/`

### 2. Poszo / Conversational Ordering

**Question:**
**Can AI reliably take a restaurant order?**

Status: **Active / demo**

Technology:
Realtime voice · LLM · menu/order tools · voice synthesis

Areas to test:

- natural conversation
- menu understanding
- modifications
- ambiguity
- corrections
- latency
- order confirmation
- human escalation
- operational reliability

Current page:
`/experiments/realtime-drive-through-ordering/`

I’d gradually shift the title away from **AI-native voice ordering** toward the actual question/problem.

### Hidden for now

**Consistent Game Character Pipeline**

Current:
`/experiments/consistent-character-workflows/`

Do not delete it, but remove it from the public listing until you actively revisit it.

If revived, frame it as:

**Can AI maintain one character across a real game-production pipeline?**

Concept → poses → animation → sprite/skeletal assets → Unity → consistency.

**LTX Video Workflow Evaluation**

Hide it.

This is currently closer to tool evaluation than a distinctive experiment.

---



## Building

**Definition:** serious products you have decided are worth pursuing.

These are no longer experiments. You are actively trying to make them real.

### Kerrzo

Your primary commercial product.

Positioning:
AI-first business operating system / intelligence layer for SMBs.

Key product areas:

- CRM / leads / pipeline
- contacts / companies
- campaigns
- support
- HR / payroll
- projects / operations
- knowledge
- agents
- analytics
- organisation / roles / admin

Longer-term idea:
AI moves from answering questions to proactively doing work across the business.

This deserves the deepest Building page over time.

### Brilliancy

AI chess coaching product.

Core idea:
Not another engine evaluation UI — an AI coach that explains decisions and learns from the player's own games.

Key themes:

- personalised coaching
- game review
- spaced repetition
- opening repertoire
- narrative explanation
- Coach Mia
- voice eventually
- web/cloud first



### Not currently Building

**Poszo** stays in Experiments until the evidence says it deserves to become a product.

---



## Shipped

**Definition:** substantial real-world products and systems you have actually delivered.

This section is your **evidence**.

### Craveable Brands

**Status: flagship case study largely built**

Story:
Evolving the ordering platform behind Red Rooster, Oporto and Chicken Treat.

Core chapters:

- inherited system
- ~170 microservices
- first deployment failure
- working inside Lakemba restaurant
- recommendations
- architecture at scale
- payment reliability / pre-authorisation
- Forter / fraud reduction
- DoorDash automatic order release
- 6-minute delivery improvement
- marketing + ordering site merge
- 3% → 4.5% online conversion
- three-brand platform consolidation
- payment-provider abstraction
- React Native consolidation
- COVID kerbside / drive-through
- platform evolution
- Looking Back

Core reflection:
**The architecture made more sense once I understood the kitchen.**

And:
**The tools changed. The job didn’t.**

### Neurotechnology

**Next to build**

Do 15-minute narration first.

Likely story areas:

- chronic pain therapy
- VR
- Kinect/body tracking
- computer vision
- patient experience
- movement/rehabilitation
- evolution toward iOS/LiDAR
- product/technical constraints
- clinical environment
- what worked
- what didn’t
- what changed over time

Then extract Learnings afterward.

### BoxOfficeVR

**Next after Neurotechnology**

Do the same narration-first process.

Likely story:

- theatre in VR
- VR180
- Unity
- streaming
- immersive capture
- headset experience
- latency/bandwidth/content challenges
- what makes theatre feel like theatre
- emerging-platform product decisions
- technical constraints versus audience experience



### International Towers / Amica

Needs full case study later.

Known material:

- tenant platform
- access passes
- Gallagher / HID
- room bookings
- locker bookings
- events
- perks / loyalty
- access permits
- mobile app
- operational workflows
- estimated ~8,000 hours/year saved
- React Native rebuild
- commercial-building technology
- platform evolution

This could eventually become another major flagship page.

### Engage+

Keep as a Shipped item, but needs the story reconstructed before investing in the page.

---



## Learnings

**Definition:** conclusions that came from real building, experiments and shipped work.

This is where finished experiments often graduate.

### Published / essentially complete

**Can AI replace a drone shot?**

Vesper experiment.

Core discovery:
**A beautiful image isn’t a world.**

Story:

- local AI video
- ComfyUI
- generated architectural imagery
- camera movement exposed lack of spatial consistency
- a coherent world is different from coherent individual frames

Ending:
**Someone still has to direct the camera.**

This is no longer an Experiment once finished.

### Next / drafted concept

**The moment software development changed**

Strategy Connect story.

Core insight:
AI-assisted development changed more than developer productivity — it changed the economics of software and who can participate in building it.

Story:

- Queen’s AI/computer vision memory
- early scepticism around AI coding
- long-lived Strategy Connect platform
- rebuild that would traditionally have taken months happening dramatically faster
- accumulated product knowledge mattered enormously
- Ed later continuing development despite not being a conventional developer

Underlying idea:
Code is becoming cheaper.
Understanding the problem, architecture and judgement become more valuable.

### Local AI Learning

Move **Local inference architecture** out of Experiments and turn it into a Learning.

Possible titles:

**What I learned running AI locally**

or stronger:

**I wanted local AI to replace the cloud. It didn’t.**

Material you already have:

- RTX 5090
- Mac unified memory
- LM Studio
- Qwen
- context limitations
- local models
- remote access/network constraints
- ComfyUI
- cloud versus local trade-offs
- privacy
- cost
- latency
- model size
- quantisation

Strong principle:

**Don’t ask what the biggest model you can run is. Ask what the smallest model that reliably solves the task is.**

### Likely future Learnings from Craveable

Not all need to become articles, but there are several:

**The architecture made more sense once I understood the kitchen**

Understanding the operational system before the technical system.

**Payment success isn’t order success**

Designing distributed systems around partial failure.

**Software can decide when the chips get cooked**

How software architecture reaches all the way into physical operations.

**Shared where possible. Different where necessary.**

Multi-brand architecture and configuration versus forks.

**Why we merged the marketing site and ordering site**

Architecture, SEO, UX and commerce becoming the same customer journey.

### Likely future Learning from RuView

Only after the experiment.

Possibilities:

**Can Wi-Fi see people?**

or, if the result supports it:

**The most interesting sensor may already be in the building.**

Negative result is equally acceptable.

---



## About

Purpose: **explain the person behind the work without turning into a CV page.**

Core narrative:

- started as an engineer
- nearly 30 years building software
- still fundamentally motivated by curiosity
- CTO / architect / product builder
- experience tells you what used to work
- curiosity helps discover what works next
- increasingly focused on AI-era architecture/product development

Existing editorial thought:

**Experience tells me what used to work.
Curiosity helps me discover what works next.**

Sections can include:

- short personal story
- experience
- principles
- How I Think
- what I’m exploring now
- selected career history
- perhaps broader interests lightly

Not a sales-heavy consulting page.

---



## Work With Paul

Not necessarily a top-level nav item — keep it as the nav CTA.

**Work with Paul**

Potential offerings behind it:

- AI product architecture
- product/technical strategy
- architecture reviews
- high-value prototypes
- founder advisory
- difficult technical product problems

No coaching positioning.

CTA language:

**Bring me a problem worth solving.**

---



## The content lifecycle

This is the important part because the IA now has an actual system behind it:

**Experiments**
→ I don’t know if this works yet.

If promising:

**Building**
→ I’ve decided this deserves to become something real.

If delivered:

**Shipped**
→ This exists in the real world.

At any point:

**Learnings**
→ This changed how I think.

That means old Experiments **do not accumulate forever**.

Vesper → Learning.
Local AI → Learning.
Poszo could eventually → Building.
RuView could → Learning, Building, Shipped, or simply conclude that the technology wasn't reliable enough.

That makes the whole site feel like a **living record of your work rather than a portfolio archive**.

And I'd make one other structural decision now: **Craveable, Neurotechnology, BoxOfficeVR and Amica are the backbone of Shipped; Kerrzo + Brilliancy are the backbone of Building; RuView + Poszo are the backbone of Experiments; Vesper + Strategy Connect + Local AI begin the backbone of Learnings.**

That's enough real material already to make the site feel substantial without filling it with placeholders.