# Speaking & Thought Leadership

## Presentations

### "Dawn of the Agents" — AWS User Group Meetup
- **Venue:** AWS User Group Meetup
- **Role:** Speaker / Solutions Architect at Leapfrog Technology
- **Presentation URL:** https://amitj.com.np/aug.ppt
- **Speaker Notes URL:** https://amitj.com.np/aug.ppt/narration.html
- **Slides:** 16 slides
- **Topic:** GenAI Matures → The Age of Agents

#### Presentation Structure & Key Points:

**Slide 1 — Title:** "Dawn of the Agents: GenAI Matures → The Age of Agents"

**Opening Story:** Started with an uncomfortable truth about how email writing evolved:
- 2015: You researched, wrote drafts, owned every word
- 2023: You pasted links into ChatGPT, tweaked output, still pressed Send
- 2025: You tell an AI "Handle this" — it researches, drafts, adapts tone, sends, and updates the CRM
- "At that point… you're not writing emails anymore. You're supervising outcomes."

**Slide 2 — From Manual → Autonomous:**
- 2015: Manual (Human does everything)
- 2023: Assisted (AI as copilot)
- 2025+: Autonomous (AI acts independently)

**Slide 3 — Core Thesis:**
- "Foundation Models = Infrastructure"
- "Agents are the Interface"
- Models are becoming commoditized utility services. The new application layer is agents.

**Slide 4 — Foundation Models:**
- Nova 2 models (Lite, Sonic, Omni) — incremental gains, not magic
- Bedrock = model marketplace / "model switchboard"
- AWS wins if they own the infrastructure layer regardless of which model you choose

**Slide 5 — Custom Models (Nova Forge):**
- Custom models are possible but rarely necessary
- Challenges: validation is hard, drift is real, cost explodes silently
- "For most teams, custom models are a vendor-lock-in shaped hammer looking for a nail"
- Best approach: use best available foundation model, customize via prompts/RAG/fine-tuning

**Slide 6 — Competitive Reality:**
- "AWS ≠ Only GenAI Cloud" — and that's OK
- AWS strategy: Choice beats supremacy
- Design for model plurality — don't hard-code dependencies on a single model

**Slide 7 — Agents ≠ Chatbots:**
- Agents = long-lived AI workers with Memory, Tools, Policies, Autonomy
- Chatbots respond to prompts; Agents hold intent over time
- First time AI can truly "do things" rather than just "suggest things"

**Slide 8 — AWS Agent Stack:**
- Layers: Agents → AgentCore/Orchestration → Foundation Models → AWS Infrastructure
- AgentCore: prompt orchestration, tool calling, policy enforcement, memory management
- "It feels more like a controlled workflow engine than true autonomous intelligence — and that's not bad"

**Slide 9 — Job-Shaped Agents:**
- DevOps Agent, Security Agent, Kiro (IDE)
- Pattern: AWS building agents that map to specific job functions
- Future: FinOps Agent, Compliance Agent, Data Ops Agent

**Slide 10 — Vibe Coding:**
- Natural language → Code, Humans supervise
- AI writes more code than humans in many organizations
- Risk: "Productivity is up. Visibility is down."

**Slide 11 — Specs > Code:**
- Specifications drive code generation; code becomes implementation detail
- "Python is the new assembly" (half joke, half prophecy)
- Tests, contracts, and assertions matter more than syntax

**Slide 12 — Vibe DevOps:**
- "I want X" → Terraform/Pulumi → Running Infrastructure
- "Infrastructure mistakes scale faster than code mistakes"

**Slide 13 — Governance Moves Upstream:**
- Security starts at prompt time, not post-deployment
- IAM Autopilot: policies generated from intent
- "If you can't explain why an agent did something, you can't run it in production"

**Slide 14 — What This Means:**
- Use best models (don't build them)
- Adopt agents carefully (treat them like junior engineers)
- Over-invest in validation (it's your safety net)

**Slide 15 — Closing:**
- "You don't write the email. You approve the outcome."

**Slide 16 — Thank You:**
- "The most valuable engineers won't be the fastest typers — they'll be the best delegators."

**Closing Story:**
- "In the agentic world, failure doesn't look like a bug. It looks like a decision."
- "And decisions require ownership."
- "In 2025, the most valuable engineers won't be the ones who type the fastest… They'll be the ones who know what not to delegate."

### "GenAI for Healthcare Providers and Digital Health Companies" — CIO.com Webcast (with AWS & Leapfrog Technology)
- **Venue:** CIO.com / CIO Marketing Services (online webcast)
- **Co-hosted by:** Amazon Web Services (AWS) and Leapfrog Technology
- **Role:** Speaker / Solution Architect, DevOps at Leapfrog Technology
- **Webcast URL:** https://us.resources.cio.com/resources/genai-for-healthcare-providers-and-digital-health-companies-6/
- **Co-Speakers:**
  - Manu Chatterjee — VP/Head of AI, Leapfrog Technologies
  - Jim Malone — Senior Contributing Editor, CIO Marketing Services
- **Topic:** Accelerating adoption of GenAI in healthcare — moving past proof of concept to production

#### Key Topics Covered:
- What's driving GenAI adoption in Healthcare
- Overcoming common challenges providers, payers, clinicians, and others face when planning and implementing GenAI initiatives (security, data readiness, integration costs, limited in-house expertise)
- Promising use cases for GenAI in healthcare
- The advantages of working with a partner to accelerate the GenAI healthcare journey
- Moving past POC: navigating security and compliance at scale
- Real use cases where providers and payers are seeing actual efficiency gains today
- The partner advantage: why you don't need to build everything in-house

#### Context:
- GenAI budgets in healthcare are growing faster than general IT budgets
- Many organizations struggle moving past proof of concept due to security concerns, data readiness, integration costs, and limited in-house expertise
- The webcast addressed how to break through these barriers and start deploying GenAI in production healthcare environments

## Training & Mentorship

### ArchMentor — Solution Architect Training Platform
- Created a comprehensive training platform for developing next-generation solution architects
- Philosophy: "Lead with the Product, Choose the Tech"
- Goal: Transition top engineers from "How to build" to "Why we build"
- 6-month transformation path with modules covering:
  - Discovery & Questioning
  - Value-Based Architecture
  - System Design Patterns
  - Product Thinking
  - Sales Engineering Acumen
  - Trade-off Management
- Includes AI Lab with Gemini-powered tools for practice
- Recommends key books and frameworks for architect development

## Key Quotes & Beliefs
- "Foundation Models = Infrastructure, Agents are the Interface"
- "The most valuable engineers won't be the fastest typers — they'll be the best delegators"
- "Python is the new assembly"
- "Productivity is up. Visibility is down."
- "If you can't explain why an agent did something, you can't run it in production"
- "In the agentic world, failure doesn't look like a bug. It looks like a decision."
- "For most teams, custom models are a vendor-lock-in shaped hammer looking for a nail"
- "Infrastructure should be boring, predictable, and reliable"
- "Sometimes the old ways are the best ways" (about building with vanilla JS)
- "Lead with the Product, Choose the Tech"
