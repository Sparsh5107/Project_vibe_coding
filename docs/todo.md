# FoodBridge — TODO

> Track implementation progress. Mark `[x]` only when a task is fully implemented and verified.

---

## Phase 1 — Project Setup
- [ ] Install Django in virtual environment
- [ ] Create Django project (`foodbridge`)
- [ ] Create `core` app
- [ ] Add `core` to `INSTALLED_APPS`
- [ ] Configure template settings
- [ ] Configure static files settings
- [ ] Set timezone configuration
- [ ] Verify `runserver` works

## Phase 2 — Database Model
- [ ] Define `Donation` model with all fields
- [ ] Define `STATUS_CHOICES` and `FOOD_TYPE_CHOICES`
- [ ] Add `__str__` method
- [ ] Add `get_priority()` method
- [ ] Register model in `admin.py`
- [ ] Run `makemigrations`
- [ ] Run `migrate`

## Phase 3 — Forms
- [ ] Create `DonationForm` (ModelForm)
- [ ] Configure form fields and widgets
- [ ] Set `datetime-local` widgets for datetime fields
- [ ] Add CSS classes to widgets

## Phase 4 — URL Configuration
- [ ] Create `core/urls.py` with all URL patterns
- [ ] Include `core.urls` in `foodbridge/urls.py`
- [ ] Verify all URLs resolve

## Phase 5 — View Functions
- [ ] `home` view — landing page with stats and featured donations
- [ ] `donate` view — GET: show form, POST: save donation
- [ ] `donate_success` view — confirmation page
- [ ] `find_food` view — list available donations with priority
- [ ] `claim_confirm` view — show donation details for confirmation
- [ ] `claim_process` view — POST: update status to CLAIMED
- [ ] `claim_success` view — claim success page
- [ ] `impact` view — aggregate stats and render

## Phase 6 — Base Template & Global CSS
- [ ] Create `base.html` with HTML5 structure
- [ ] Add meta tags and Google Fonts
- [ ] Build navbar (logo + links + mobile toggle)
- [ ] Add Django messages block
- [ ] Build footer
- [ ] Create `style.css` with CSS variables (color palette)
- [ ] Add reset and base styles
- [ ] Add typography styles
- [ ] Add layout utilities (container, grid, flex)
- [ ] Style navbar (desktop + mobile)
- [ ] Style buttons (primary, secondary, outline)
- [ ] Style cards
- [ ] Style badges (priority: high, medium, normal)
- [ ] Style form inputs
- [ ] Style footer
- [ ] Add animations (fade-in, hover effects)
- [ ] Add responsive breakpoints
- [ ] Create `main.js` (nav toggle, scroll animations, auto-dismiss messages)

## Phase 7 — Home Page
- [ ] Hero section (headline, subtitle, CTA buttons)
- [ ] CSS-based hero visual / illustration
- [ ] Impact statistics section (4 stat cards)
- [ ] "How It Works" section (4 steps)
- [ ] Featured donations section (3 latest available)
- [ ] Final call-to-action section

## Phase 8 — Donate Page
- [ ] Donate page header and description
- [ ] Styled donation form layout
- [ ] Form field labels and placeholders
- [ ] Form validation feedback display
- [ ] Submit button
- [ ] Success page (checkmark, summary, navigation links)

## Phase 9 — Find Food Page
- [ ] Page header and description
- [ ] Donation cards grid
- [ ] Card content (name, quantity, type, donor, location, time)
- [ ] Rescue priority badges on cards
- [ ] "Claim This Food" button on each card
- [ ] Empty state message (no donations available)

## Phase 10 — Claim Flow
- [ ] Claim confirmation page (donation details, confirm button)
- [ ] CSRF-protected POST form for claiming
- [ ] Claim processing (update status to CLAIMED)
- [ ] Claim success page (celebration, summary, navigation)
- [ ] Verify claimed donation removed from listing

## Phase 11 — Impact Page
- [ ] Page header and description
- [ ] Impact stat cards (meals rescued, food saved, connections, organizations)
- [ ] Simple visual representation (CSS bars/progress)
- [ ] Social impact narrative section
- [ ] Call-to-action

## Phase 12 — Sample Data
- [ ] Create `seed_data` management command
- [ ] Add 5+ sample donations with varied data
- [ ] Include mix of time windows (for priority demo)
- [ ] Include 1-2 pre-claimed donations (for impact demo)
- [ ] Run seed command and verify data

## Phase 13 — Responsive Polish
- [ ] Test desktop layout (1200px+)
- [ ] Test tablet layout (768px–1199px)
- [ ] Test mobile layout (< 768px)
- [ ] Fix any overflow or layout issues
- [ ] Verify navbar mobile toggle works
- [ ] Verify form layout on mobile
- [ ] Add card hover effects
- [ ] Add button transitions

## Phase 14 — Testing & Verification
- [ ] Home page loads with all sections
- [ ] All navbar links work
- [ ] Donate form creates donation correctly
- [ ] Form validation rejects invalid input
- [ ] Donate success page displays correctly
- [ ] Find Food shows only AVAILABLE donations
- [ ] Priority badges are correct
- [ ] Claim flow works end-to-end
- [ ] Claimed donation disappears from listing
- [ ] Impact page shows correct statistics
- [ ] No Django errors in console
- [ ] No browser console errors
- [ ] Complete flow test: Home → Donate → Find Food → Claim → Impact
