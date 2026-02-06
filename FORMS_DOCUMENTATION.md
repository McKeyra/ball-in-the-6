# Ball in the 6 - Forms Documentation

All forms use the **FormBuilder** system with three interaction modes:
- **Wizard Mode**: Step-by-step guided experience
- **Form Mode**: Traditional accordion-style form (default)
- **Chat Mode**: Conversational AI-like interface

## Theme: Dark Elegance
- Background: `#0f0f0f`
- Gold Accent: `#c9a962`
- Glass effects with `bg-white/[0.07]` and `border-white/[0.06]`

---

## Registration Forms (6 forms)

| # | Form Name | File | Route | Purpose |
|---|-----------|------|-------|---------|
| 1 | **Player Registration** | `PlayerRegistration.jsx` | `/PlayerRegistration` | Register new players with personal info, emergency contacts, skill assessment, and medical details |
| 2 | **Coach Registration** | `CoachRegistration.jsx` | `/CoachRegistration` | Register coaches with qualifications, certifications (NCCP), experience, and availability |
| 3 | **Referee Registration** | `RefereeRegistration.jsx` | `/RefereeRegistration` | Register referees with certification level, experience, and scheduling preferences |
| 4 | **Volunteer Registration** | `VolunteerRegistration.jsx` | `/VolunteerRegistration` | Register volunteers with skills, availability, and area of interest |
| 5 | **Tryout Registration** | `TryoutRegistration.jsx` | `/TryoutRegistration` | Sign up players for team tryouts with position preference and experience |
| 6 | **Program Signup** | `ProgramSignup.jsx` | `/ProgramSignup` | Register for camps, clinics, and development programs |

---

## Application Forms (4 forms)

| # | Form Name | File | Route | Purpose |
|---|-----------|------|-------|---------|
| 7 | **Sponsor Application** | `SponsorApplication.jsx` | `/SponsorApplication` | Apply to become a team/league sponsor with package selection |
| 8 | **League Application** | `LeagueApplication.jsx` | `/LeagueApplication` | Apply for league membership or new league creation |
| 9 | **Facility Partner** | `FacilityPartner.jsx` | `/FacilityPartner` | Partner facilities (gyms, courts) to host games and practices |
| 10 | **Vendor Application** | `VendorApplication.jsx` | `/VendorApplication` | Apply as equipment/merchandise vendor for the league |

---

## Operational Forms (6 forms)

| # | Form Name | File | Route | Purpose |
|---|-----------|------|-------|---------|
| 11 | **Game Report** | `GameReport.jsx` | `/GameReport` | Post-game report with scores, highlights, and officials feedback |
| 12 | **Incident Report** | `IncidentReport.jsx` | `/IncidentReport` | Report injuries, conduct issues, or safety concerns |
| 13 | **Transfer Request** | `TransferRequest.jsx` | `/TransferRequest` | Request player transfer between teams |
| 14 | **Schedule Request** | `ScheduleRequest.jsx` | `/ScheduleRequest` | Request game/practice reschedule or time changes |
| 15 | **Equipment Request** | `EquipmentRequest.jsx` | `/EquipmentRequest` | Request jerseys, balls, and other equipment |
| 16 | **Facility Booking** | `FacilityBooking.jsx` | `/FacilityBooking` | Book gyms and courts for practices or events |

---

## Feedback Forms (4 forms)

| # | Form Name | File | Route | Purpose |
|---|-----------|------|-------|---------|
| 17 | **Season Survey** | `SeasonSurvey.jsx` | `/SeasonSurvey` | End-of-season satisfaction survey for all participants |
| 18 | **Coach Evaluation** | `CoachEvaluation.jsx` | `/CoachEvaluation` | Rate and provide feedback on coaching staff |
| 19 | **Event Feedback** | `EventFeedback.jsx` | `/EventFeedback` | Feedback on tournaments, camps, and special events |
| 20 | **NPS Survey** | `NPSSurvey.jsx` | `/NPSSurvey` | Net Promoter Score - likelihood to recommend |

---

## Settings Forms (4 forms)

| # | Form Name | File | Route | Purpose |
|---|-----------|------|-------|---------|
| 21 | **Parent Profile Setup** | `ParentProfileSetup.jsx` | `/ParentProfileSetup` | Configure parent/guardian profile and notification preferences |
| 22 | **Team Settings** | `TeamSettingsForm.jsx` | `/TeamSettingsForm` | Configure team roster, colors, and communication settings |
| 23 | **League Settings** | `LeagueSettingsForm.jsx` | `/LeagueSettingsForm` | Configure league rules, divisions, and playoff structure |
| 24 | **Organization Setup** | `OrganizationSetup.jsx` | `/OrganizationSetup` | Initial organization configuration and branding |

---

## Compliance Forms (4 forms)

| # | Form Name | File | Route | Purpose |
|---|-----------|------|-------|---------|
| 25 | **Waiver & Consent** | `WaiverConsent.jsx` | `/WaiverConsent` | Liability waiver and participation consent |
| 26 | **Medical Form** | `MedicalForm.jsx` | `/MedicalForm` | Medical history, allergies, and emergency protocols |
| 27 | **Code of Conduct** | `CodeOfConduct.jsx` | `/CodeOfConduct` | Agreement to behavioral standards for players, parents, coaches |
| 28 | **Background Check** | `BackgroundCheck.jsx` | `/BackgroundCheck` | Authorization for volunteer/coach background screening |

---

## Recognition Forms (2 forms)

| # | Form Name | File | Route | Purpose |
|---|-----------|------|-------|---------|
| 29 | **Award Nomination** | `AwardNomination.jsx` | `/AwardNomination` | Nominate players, coaches, or volunteers for awards |
| 30 | **Hall of Fame** | `HallOfFame.jsx` | `/HallOfFame` | Nominate individuals for Hall of Fame recognition |

---

## Additional Form (in pages root)

| # | Form Name | File | Route | Purpose |
|---|-----------|------|-------|---------|
| 31 | **Team Registration** | `TeamRegistration.jsx` | `/TeamRegistration` | Register a new team with coach info, division, and season selection |

---

## Total: 31 Forms

## Field Types Available

| Type | Description | Example Use |
|------|-------------|-------------|
| `text` | Single-line text input | Name, Email, Phone |
| `textarea` | Multi-line text input | Bio, Notes, Comments |
| `select` | Dropdown selection | Division, Season |
| `pills` | Multi-select pill buttons | Skills, Days, Categories |
| `cards` | Visual card selection | Tier, Package, Type |
| `checkboxes` | Checkbox group | Certifications, Agreements |
| `upload` | File upload with drag-drop | Documents, Photos |

## Form Sections Structure

Each form is configured with sections:
```javascript
const SECTIONS = [
  {
    id: "section_id",
    label: "Section Label",
    icon: "LucideIconName",
    fields: [
      {
        id: "field_id",
        type: "text|textarea|select|pills|cards|checkboxes|upload",
        label: "Field Label",
        placeholder: "Placeholder text",
        required: true|false,
        hint: "Helper text below field",
        options: [...], // for select, pills, cards, checkboxes
      }
    ]
  }
];
```

## Access Points

All forms are accessible from:
1. **Home Page** - Apps tab with 8 organized sections
2. **Direct URL** - `/{FormName}` (e.g., `/PlayerRegistration`)
3. **Dashboard Links** - Contextual links from relevant dashboards

---

*Generated for Ball in the 6 - Toronto Basketball League Management Platform*
