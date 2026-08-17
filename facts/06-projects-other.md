# Other Notable Projects

## 1. Vyaguta — Internal LMS
- **Period:** January 2023 – April 2023
- **Description:** Leapfrog's internal Learning Management System portal with cost optimization focus.
- **Technologies:** AWS, AWS Lambda, Amazon RDS, Cost Optimization

## 2. Poker Game Mobile Application
- **Period:** June 2021 – February 2022
- **Description:** Multiplayer poker game mobile application deployed on Google Cloud Platform.
- **Technologies:** GCP, Google App Engine, Mobile Development

## 3. Project Deployment System (HamroStack)
- **Period:** October 2017 – December 2018
- **Description:** Container service integration with reverse proxy, service discovery, and more for easy project deployment. Reduced deployment time by 20% and new service onboarding by 90%. This was an in-house deployment platform built at Hamro Patro to migrate from GCP App Engine to multi-region self-managed infrastructure.
- **Technologies:** Docker, Go, Service Discovery, Reverse Proxy

## 4. Blockchain Reward System
- **Period:** August 2018 – December 2018
- **Description:** Ethereum-based reward management system for generating and distributing different types of rewards to users with Android app integration.
- **Technologies:** Solidity, Ethereum, Android, ERC20, ERC721

## 5. CityCoin (ERC) Cryptocurrency
- **Period:** July 2018 – August 2018
- **Description:** Proof of Concept for Ethereum-based ERC721 and ERC20 cryptocurrency implementation.
- **Technologies:** Ethereum, Solidity, ERC20, ERC721

## 6. KPI Analytics Dashboard
- **Period:** March 2020 – April 2020
- **Description:** Combination of different tools and time-series data to show Key Performance Monitoring system.
- **Technologies:** Time-series Database, Analytics, Monitoring

## 7. iJobber — AI-Powered Cover Letters & CVs (Personal Project)
- **Description:** A Chrome extension that generates personalized, professional cover letters and CVs tailored to specific job postings using advanced AI technology. Analyzes job requirements and creates customized application documents in seconds.
- **URL:** https://amitj.me/ijobber
- **Chrome Web Store:** https://chromewebstore.google.com/detail/ijobber-ai-powered-cover/nknjgaedlggceepiffebkbdokghoajea
- **Contact Email:** wannamit@gmail.com
- **Features:**
  - Dual document generation (cover letters and CVs)
  - Supports 6 AI providers: Puter.com (free), Azure OpenAI, OpenAI, Anthropic Claude, Google Gemini, AWS Bedrock
  - Multi-platform support: LinkedIn Jobs, Indeed, Seek (Australia & New Zealand)
  - Multiple output formats: PDF, HTML, Markdown
  - Privacy-first: all data stored locally in browser, no backend servers
  - One-time setup with CV upload or LinkedIn profile connection
  - Generates documents in 10-30 seconds
- **Privacy Approach:** No data collection, no tracking, no analytics. Everything stays on the user's device. Data only leaves when explicitly generating a document, going directly to the chosen AI provider.

## 8. Opinio (Competition Project)
- **Period:** December 2014
- **Context:** Ncell App Camp 2014 (Corporate Solutions Winner)
- **Description:** An app to help corporate decision making by analyzing data from social media. Won the nation-level app development competition.

## 9. Sentiment Analysis API (Competition Project)
- **Period:** November 2014
- **Context:** Global Startup Weekend Kathmandu (Winner, issued by Techstars)
- **Description:** Built a sentiment analysis API which helps businesses in analyzing the sentiments of their customers.

## 10. ArchMentor — Solution Architect Training Platform (Internal Tool)
- **Description:** A Next-Gen Solution Architect Training platform created by Amit to train architects within his organization. Features an AI Lab powered by Gemini API for interactive learning.
- **URL:** https://amitj.me/archmentor
- **Philosophy:** "Lead with the Product, Choose the Tech." — Training architects who understand that technical excellence is secondary to business problem-solving.
- **Curriculum Modules:**
  1. Discovery & Questioning — Learning how to extract business intent from vague requirements
  2. Value-Based Architecture — Mapping technical decisions directly to ROI and business KPIs
  3. System Design Patterns — Choosing the right pattern based on scale and budget constraints
  4. Product Thinking — Thinking about software as a living product, not a one-time project
  5. (Additional modules in the 6-month transformation path)
- **AI Lab Features:**
  - Value Translator: Converts tech jargon into business value for C-Level stakeholders
  - Scenario Challenge: Generates discovery scenarios to practice finding the "Why"
  - Uses Google Gemini API (gemini-3-flash-preview model)

## 11. "Dawn of the Agents" Presentation (AWS User Group Meetup)
- **Description:** A 16-slide presentation given at an AWS User Group Meetup about GenAI maturing into the age of agents.
- **URL:** https://amitj.me/aug.ppt
- **Speaker Notes URL:** https://amitj.me/aug.ppt/narration.html
- **Key Themes:**
  - Transition from manual → assisted → autonomous AI
  - Foundation Models as Infrastructure, Agents as the Interface
  - AWS Agent Stack (AgentCore, orchestration, foundation models)
  - Vibe Coding and Vibe DevOps
  - Governance moving upstream (security at prompt time)
  - "The most valuable engineers won't be the fastest typers — they'll be the best delegators"

## 12. Retro DevOps Portfolio Website (Personal Project)
- **Description:** Interactive terminal-based portfolio website built with pure vanilla JavaScript (no frameworks). Features a retro CRT monitor aesthetic with command-line interface navigation.
- **URL:** https://amitj.me
- **Technologies:** HTML5, CSS3, Vanilla JavaScript, PWA, Service Worker, JSON-LD Structured Data
- **Features:** PWA support, offline functionality, OneAI assistant, CRT effects, command history, Melbourne time clock, Easter eggs

## 13. TimezoneTracker (Personal Project)
- **Period:** 2025 – Present
- **Description:** "Compare Time Across Cities Instantly" — a timezone management app that lets you track, compare, and coordinate times across multiple locations. Designed, built, and deployed by Amit solo, end-to-end, on every platform.
- **Platforms:** iOS (Apple App Store), Android (Google Play), Web app, and Chrome extension
- **URL:** https://timezonetracker.app (details at https://timezonetracker.app/about)
- **Significance:** Demonstrates hands-on, full product ownership outside client work: one person taking a product from idea to published apps across four platforms.

## 14. oneread — Self-Hosted Text-to-Speech (Personal Project, Open Source)
- **Period:** 2026 – Present
- **Description:** A free, comprehensive, fully open-source text-to-speech library you host yourself. Paste text or upload a document and get back a wav with subtitles timed to the audio. Speech comes from Supertonic 3 running as ONNX inside the app, so there are no API keys, nothing leaves the machine, and there is no per-character billing.
- **URL:** https://oneread.amitj.me
- **Source:** https://github.com/oneamitj/oneread
- **Technologies:** Python 3.12, FastAPI, SQLite (with FTS5 full-text search), ONNX Runtime, Supertonic 3 TTS, React, TypeScript, Vite, Docker Compose, Nginx, Certbot, argon2
- **Features:**
  - Entries with title, text, tags and voice settings; plain or markdown input, markdown flattened into speakable lines (headings, list items, link labels, tables read as rows, symbols spoken as words)
  - Full-text search over title, text and tags via SQLite FTS5
  - File upload and text extraction: Word, slides, spreadsheets, CSV, PDF (text layer), markdown, plain text, OpenDocument, RTF, saved web pages; no OCR, so image-only PDFs are refused with a reason
  - Readings per entry: a 1/3/5-minute sample, a chosen sentence range, or the whole document, each with its own player, subtitles and download
  - Sample-accurate SRT/VTT subtitles, with cue boundaries taken from the sample count of the audio actually written rather than a duration predictor, plus a follow-along highlight in the player
  - Reading-length and wall-clock estimates calibrated from renditions the machine has already completed
  - Stoppable full readings that keep what was already read and resume rather than restart
  - Per-user accounts, argon2 passwords, signed HttpOnly session cookies, CSRF header check, rate limiting, CSP blocking remote scripts
  - Opt-in, revocable analytics
- **Engineering notes:**
  - Audio is streamed to disk a sentence at a time, so a two-hour entry costs no more memory than a two-minute one; measured 3,120 characters into 231 s of audio in 53 s on an M-series laptop with under 100 MB of process growth
  - Production stack ships as Docker Compose with nginx terminating TLS and certbot renewing certificates; the app runs on an `internal: true` network with no outbound access, read-only root filesystems and dropped capabilities
  - Dependencies pinned with hashes under `pip --require-hashes`; 169 tests run in about a second against a fake synthesis engine
- **Significance:** A complete, self-hostable product given away free and open source: full-stack build plus production hardening and deployment tooling, all owned solo.
