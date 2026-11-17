# LiliSare – Operating System

A complete Next.js implementation of the **LiliSare operating system and dashboard**, converting the prototype into a modern, production-grade Next.js (App Router) + TypeScript application.

## Key Features

- **Global Navigation & Shell**:
  - Official LiliSare logo and branding ("because we care") and primary forest green theme (`#3E6B2B`)
  - Nav sections: WORK, PEOPLE, SCHEDULE, BUSINESS, SYSTEM
  - Notification badges (e.g. Note Audit: 26, CA Emails: 7)
  - Global Search with live autocomplete dropdown for Pages, Clients, and Caregivers
  - User profile menu (`Admin Demo` avatar) with interactive actions
  - Live Automation Activity Feed slide-over drawer with real-time events and "● live" indicator
  - Global Toast Notifications for user actions and feedback
  - Prototype review notice and **Training Mode** (de-identifies client & caregiver names to "Test Client X" and "Test Caregiver X" across the whole app)
  - Interactive "▶ Run demo" sequence adding live automated events step-by-step

- **Pages & Modules Implemented**:
  1. **Today**: High-level agency KPI cards, Automation Impact banner, Needs human attention queue (with quick links to modules), Caregivers onboarded per week chart, and Run Demo trigger.
  2. **Intake Pipeline**: Multi-stage Kanban board (New Inquiry, Contacted, Assessment, Family Decision, Converted, Lost) with advance-on-click, plus "Add inquiry" modal with simulated voice dictation and "Convert to client" automation flow.
  3. **Onboarding**: Household roster with client & caregiver progress bars, household detail with dynamic packet generator checklist (`Gen`), Client/Caregiver checklist tabs, 10-step automated reminders timeline, Client and Caregiver dual pipelines, and Activation Gate with blocker resolution.
  4. **Clients**: Filterable client directory, deep-dive Client Profile with 9 interactive tabs (Overview, Caregivers, Service plan, Authorizations, Documents, Care notes, Visits, Activity Timeline with automated vs human badges, and Audit Log).
  5. **Caregivers**: Filterable roster (All, Family, Non-family, Expiring/expired) and classification chips (Employee, 1099, Both), credential expiration alerts, and Academy LS3000 progress bars.
  6. **Scheduling & EVV**: Weekly 7-day calendar view with assigned vs unfilled shifts, unfilled cover suggestions, and EVV exceptions management (Self-correct requests, Missed clock-out, GPS mismatch with approve/deny/request actions).
  7. **Compliance**: Expiring credential tracking table and RN visit progress trackers by program (CNA, HMA, Personal Care, IHSS).
  8. **Note Audit**: AI-assisted note audit review queue with flagged non-compliant words, editable AI suggestions, caregiver submission flow, and empty queue state.
  9. **CA Emails**: Case manager email template library, editable templates with token variables, and pending state approvals tracker.
  10. **Screening Center**: Caregiver background checks table (CBI, OIG, sex offender, driving, TB), automated check requests, and flagged review queue with Clear and Escalate actions.
  11. **Billing**: Claims tracking by NPI, Medicaid denial letter requirements, denials queue with appeal action, and ADP Run vs Workforce Now payroll summaries.
  12. **Client Profitability**: Margin % bar chart and detailed breakdown table by program (CFC, IHSS, HCBS, IRSS, PDN, HMA).
  13. **Automation Rules**: Service requirement matrix with slide-out editor drawer, automation rule cards with toggle switches, bilingual (EN/ES) template editor with variable insertion tags, and change history audit trail.
  14. **Connected Systems**: Integration cards for ADP, LearnWorlds, CBI, Colorado EVV, Medicaid / insurers, AWS storage with planned release dates.
  15. **Data Migration**: Legacy migration dashboard (AccessCare, CareTime, Frisco) with animated mock import progress bars.
  16. **Users & Roles**: Role selector (10 roles), granular permissions matrix (View, Edit, Approve, Export) for 8 modules, and data access scope configuration.
  17. **Reports & Settings**: Exportable report cards and agency configuration preferences.
  18. **Release Roadmap**: Rollout phases (Release 1, Release 2, Release 3) with status pills and direct "Preview" navigation links.

## Getting Started

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the dashboard.

## Building for Production

```bash
npm run build
npm run start
```
