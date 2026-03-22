# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Job Tracer** is a personal job search tracking system built by Arnie Ray Jr. It combines a static web app (pure HTML/CSS/JS, no build tools) with a document-based filing system for resumes, cover letters, and application notes. The AI companion "Archer" (powered by Claude) is a planned feature referenced in the UI and mission docs.

## Saving Changes

```bash
./save.sh "description of changes"
```

This script stages all files, commits, and pushes to GitHub. It's the only workflow tool in the project.

## Architecture

### Web App (`/app/` and `/docs/app/`)

Static HTML pages with no framework or build step:

- `app/dashboard/index.html` — Main tracker UI with dark theme, sidebar nav, and application table
- `app/application-view/index.html` — Detail view for individual applications
- `app/onboarding/` — Multi-page onboarding flow (Meet Archer, profile setup, philosophy)

The `/docs/` directory mirrors `/app/` for **GitHub Pages deployment**. When making UI changes, update both `/app/` and `/docs/app/`. The custom domain is configured via `/docs/CNAME`.

### Document System

Applications are tracked via folder-per-company under `/applications/`:
- `notes.md` — status, dates, contacts, interview notes
- `links.md` — which resume/cover letter version was submitted

Resumes live in `/resumes/` and cover letters in `/cover_letters/`, each with their own `changelog.md` tracking version history.

### Visual Design Language

- Dark background with amber (`#f5a623`) accents and green (`#3ddc84`) highlights
- Grid background with noise texture overlay
- Fonts: Bebas Neue (headings), DM Sans (body), DM Mono (metadata/code)
- Sidebar navigation (240px fixed width) on dashboard

## Adding a New Job Application

1. Create `/applications/<CompanyName>/notes.md` with status, dates, contacts
2. Add a row to the application history table in `README.md`
3. Update the dashboard table in `app/dashboard/index.html` (and mirror in `docs/app/dashboard/index.html`)
