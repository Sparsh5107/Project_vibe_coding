# FoodBridge — Implementation Plan

> **Estimated total time: ~45 minutes**
>
> Each phase includes specific tasks and estimated time. Phases are ordered by dependency — each phase builds on the previous one.

---

## Phase 1 — Django Project Setup (~3 min)

**Goal:** Scaffold the Django project and app, configure settings.

1. Install Django in the virtual environment
2. Run `django-admin startproject foodbridge .` in `d:\proj_vibe`
3. Run `python manage.py startapp core`
4. Add `'core'` to `INSTALLED_APPS` in `settings.py`
5. Configure template settings (use app-level template directories)
6. Configure static files settings (`STATIC_URL`)
7. Set `TIME_ZONE` and `USE_TZ` appropriately
8. Verify project starts with `python manage.py runserver`

**Exit criteria:** `runserver` launches without errors, default Django page loads.

---

## Phase 2 — Database Model (~3 min)

**Goal:** Create the Donation model and apply migrations.

1. Define `Donation` model in `core/models.py` with all fields:
   - `food_name`, `quantity`, `food_type`, `donor_name`, `location`
   - `prepared_at`, `available_until`, `note`, `status`, `created_at`
   - `STATUS_CHOICES` and `FOOD_TYPE_CHOICES`
   - `__str__` method
   - `get_priority()` method for rescue priority calculation
2. Register `Donation` in `core/admin.py`
3. Run `python manage.py makemigrations core`
4. Run `python manage.py migrate`
5. Verify model works via Django shell

**Exit criteria:** Migrations apply cleanly, model is queryable.

---

## Phase 3 — Forms (~2 min)

**Goal:** Create the DonationForm.

1. Create `core/forms.py`
2. Define `DonationForm` as a `ModelForm`
3. Include fields: `food_name`, `quantity`, `food_type`, `donor_name`, `location`, `prepared_at`, `available_until`, `note`
4. Configure widgets:
   - `datetime-local` input for `prepared_at` and `available_until`
   - `Textarea` for `note`
   - Appropriate CSS classes on all widgets for styling
5. Add clean/validation if needed

**Exit criteria:** Form instantiates without errors, renders correctly.

---

## Phase 4 — URL Configuration (~2 min)

**Goal:** Set up all URL routes.

1. Create `core/urls.py` with all URL patterns:
   - `/` → `home`
   - `/donate/` → `donate`
   - `/donate/success/<int:pk>/` → `donate_success`
   - `/find-food/` → `find_food`
   - `/claim/<int:pk>/` → `claim_confirm`
   - `/claim/<int:pk>/process/` → `claim_process`
   - `/claim/<int:pk>/success/` → `claim_success`
   - `/impact/` → `impact`
2. Include `core.urls` in `foodbridge/urls.py`

**Exit criteria:** All URL patterns resolve without errors.

---

## Phase 5 — View Functions (~5 min)

**Goal:** Implement all view logic.

1. `home` view:
   - Query featured available donations (latest 3)
   - Calculate impact stats (or use mock values initially)
   - Render `home.html`

2. `donate` view:
   - GET: render empty `DonationForm`
   - POST: validate form, save donation with `status='AVAILABLE'`, redirect to success

3. `donate_success` view:
   - Fetch donation by PK, render `donate_success.html`

4. `find_food` view:
   - Query all `AVAILABLE` donations
   - Calculate rescue priority for each donation
   - Order by urgency (most urgent first)
   - Render `find_food.html`

5. `claim_confirm` view:
   - Fetch donation by PK (must be AVAILABLE)
   - Render `claim_confirm.html`

6. `claim_process` view:
   - POST only — update donation status to `CLAIMED`
   - Redirect to `claim_success`

7. `claim_success` view:
   - Fetch donation by PK, render `claim_success.html`

8. `impact` view:
   - Aggregate: total claimed donations, total meals, etc.
   - Combine with mock values for partner organizations
   - Render `impact.html`

**Exit criteria:** All views return 200 (even with placeholder templates).

---

## Phase 6 — Base Template & Global CSS (~5 min)

**Goal:** Build the base template and complete design system.

1. Create `core/templates/core/base.html`:
   - HTML5 doctype, meta tags, SEO tags
   - Google Fonts link (Inter)
   - Static CSS reference
   - Responsive viewport meta
   - Navbar (logo + nav links + mobile toggle)
   - Django messages block
   - `{% block content %}` placeholder
   - Footer
   - Static JS reference

2. Create `core/static/core/css/style.css`:
   - CSS custom properties (color palette, spacing, typography)
   - Reset / base styles
   - Typography scale
   - Container and layout utilities
   - Navbar styles (desktop + mobile responsive)
   - Button styles (primary, secondary, outline)
   - Card component styles
   - Badge styles (priority badges)
   - Form input styles
   - Footer styles
   - Animations (fade-in, hover transitions)
   - Responsive breakpoints (tablet: 768px, mobile: 480px)

3. Create `core/static/core/js/main.js`:
   - Mobile nav toggle
   - Scroll-triggered animations
   - Auto-dismiss messages

**Exit criteria:** Base template renders with styled navbar and footer.

---

## Phase 7 — Home Page (~5 min)

**Goal:** Build the landing page.

1. Create `core/templates/core/home.html`:
   - **Hero section:**
     - Headline: "Don't Waste Food. Bridge the Gap."
     - Subtitle text
     - Two CTA buttons: "Donate Food" and "Find Food"
     - CSS-based visual illustration (food → bridge → community)
   - **Impact stats section:**
     - Four stat cards (Meals Rescued, Partner Organizations, Food Saved, Connections)
     - Numbers with labels
   - **How It Works section:**
     - Step 1: List Your Surplus → Step 2: We Connect → Step 3: Food Gets Rescued → Step 4: Track Impact
   - **Featured Donations section:**
     - Display 3 latest available donations as cards
     - "View All Available Food" link

**Exit criteria:** Home page loads with all sections, looks professional.

---

## Phase 8 — Donate Page (~4 min)

**Goal:** Build the donation form page and success page.

1. Create `core/templates/core/donate.html`:
   - Page header with title and description
   - Styled donation form
   - Form fields with labels, placeholders, and validation feedback
   - Submit button
   - Form layout (responsive grid/stack)

2. Create `core/templates/core/donate_success.html`:
   - Success message with checkmark
   - Summary of the donated food
   - Navigation buttons: "Donate More" and "View Available Food"

**Exit criteria:** Form submits, creates donation, shows success page.

---

## Phase 9 — Find Food Page (~5 min)

**Goal:** Build the food discovery page with donation cards.

1. Create `core/templates/core/find_food.html`:
   - Page header with title and description
   - Grid of donation cards, each showing:
     - Food name
     - Quantity (meals)
     - Food type badge
     - Donor name
     - Location
     - Time remaining
     - Rescue priority badge (🔥 High / 🟠 Medium / 🟢 Normal)
     - "Claim This Food" button
   - Empty state message if no donations available

**Exit criteria:** Page shows available donations with correct priority badges.

---

## Phase 10 — Claim Flow (~4 min)

**Goal:** Implement the claim confirmation and processing.

1. Create `core/templates/core/claim_confirm.html`:
   - Donation details summary
   - Priority badge
   - Warning/confirmation message
   - "Confirm Claim" button (POST form with CSRF)
   - "Go Back" link

2. Create `core/templates/core/claim_success.html`:
   - Success message with celebration
   - Summary of claimed food
   - Navigation: "View More Food" and "See Impact"

3. Verify the complete flow:
   - Click Claim → See confirmation → Confirm → Success
   - Donation disappears from Find Food page
   - Donation is counted in Impact stats

**Exit criteria:** Full claim flow works end-to-end.

---

## Phase 11 — Impact Page (~4 min)

**Goal:** Build the impact statistics page.

1. Create `core/templates/core/impact.html`:
   - Page header with title and description
   - Impact stat cards (larger, prominent):
     - Meals Rescued
     - Food Saved (kg)
     - Successful Connections
     - Partner Organizations
   - Simple visual representation:
     - CSS-based bar chart or progress indicators showing impact breakdown
   - Social impact narrative section
   - Call-to-action: "Help us rescue more food"

**Exit criteria:** Impact page shows stats (from DB + mock values), looks polished.

---

## Phase 12 — Sample Data (~2 min)

**Goal:** Populate database with demo data.

1. Create `core/management/commands/seed_data.py`
2. Add 5 sample donations with varied:
   - Food types (prepared, baked, packaged)
   - Quantities (25–80 meals)
   - Time windows (some expiring soon for high priority, some later)
   - Locations and donor names
   - 1-2 pre-claimed donations for impact demo
3. Run `python manage.py seed_data`

**Exit criteria:** Database has 5+ donations, including mix of AVAILABLE and CLAIMED.

---

## Phase 13 — Responsive Polish (~3 min)

**Goal:** Ensure everything looks great on all screen sizes.

1. Test and fix layout on:
   - Desktop (1200px+)
   - Tablet (768px–1199px)
   - Mobile (< 768px)
2. Fix any:
   - Overflowing text
   - Broken card layouts
   - Navbar issues on mobile
   - Form layout issues
   - Footer alignment
3. Add subtle animation polish:
   - Card hover effects
   - Button hover transitions
   - Fade-in on scroll for home page sections

**Exit criteria:** All pages look good on desktop, tablet, and mobile.

---

## Phase 14 — Testing & Verification (~3 min)

**Goal:** Verify the complete application works.

### Functional Tests
- [ ] Home page loads with all sections
- [ ] Navbar links work on all pages
- [ ] Donate form submits and creates donation
- [ ] Form validation works (required fields)
- [ ] Success page shows after donation
- [ ] Find Food page shows available donations
- [ ] Priority badges display correctly
- [ ] Claim confirmation page loads
- [ ] Claim process updates donation status
- [ ] Claimed donation disappears from listing
- [ ] Impact page shows correct statistics
- [ ] Sample data is present

### Visual Tests
- [ ] Consistent styling across all pages
- [ ] Responsive on mobile
- [ ] No broken layouts
- [ ] No console errors

### Flow Test
- [ ] Complete flow: Home → Donate → Success → Find Food → Claim → Confirm → Success → Impact

**Exit criteria:** All tests pass, complete flow works, no errors in console or Django logs.

---

## Summary

| Phase | Task | Time |
|---|---|---|
| 1 | Django Project Setup | 3 min |
| 2 | Database Model | 3 min |
| 3 | Forms | 2 min |
| 4 | URL Configuration | 2 min |
| 5 | View Functions | 5 min |
| 6 | Base Template & Global CSS | 5 min |
| 7 | Home Page | 5 min |
| 8 | Donate Page | 4 min |
| 9 | Find Food Page | 5 min |
| 10 | Claim Flow | 4 min |
| 11 | Impact Page | 4 min |
| 12 | Sample Data | 2 min |
| 13 | Responsive Polish | 3 min |
| 14 | Testing & Verification | 3 min |
| | **Total** | **~50 min** |

> The total slightly exceeds 45 minutes to account for buffer. Several phases can be done faster if implementation goes smoothly.
