# FoodBridge — How It Works (Simple Explanation)

> This document explains the complete working of the FoodBridge project in simple language.
> Read this before any demo, presentation, or viva.

---

## What Does FoodBridge Do?

In one sentence:

> **A restaurant has leftover food → they list it on FoodBridge → an NGO finds it and claims it → food is saved, people are fed.**

That's it. The whole project connects **food donors** with **food receivers**.

---

## The 4 Pages of the Website

The entire website has just **4 main pages**. Here's what each one does:

### Page 1: Home (`/`)
**What it is:** The landing page — the first thing anyone sees.

**What it shows:**
- A big headline: *"Don't Waste Food. Bridge the Gap."*
- Two buttons: "Donate Food" and "Find Food"
- Impact numbers (how many meals rescued, connections made)
- "How It Works" section explaining the 4 steps
- A preview of recently available food donations
- A final "Ready to Make a Difference?" call-to-action

**Where the data comes from:**
- `total_rescued` → counts meals from all CLAIMED donations in the database
- `total_claims` → counts how many donations have been claimed
- `featured_donations` → latest 3 AVAILABLE donations from database
- `12` Partner Organizations → hardcoded mock value (for prototype)

---

### Page 2: Donate Food (`/donate/`)
**What it is:** A form where donors list their surplus food.

**What the form asks:**
| Field | What it means | Example |
|---|---|---|
| Food Name | What food is being donated | "Vegetable Biryani" |
| Quantity | How many meals | 50 |
| Food Type | Category dropdown | Prepared Meals, Baked Goods, etc. |
| Donor Name | Who's donating | "ABC Restaurant" |
| Location | Where to pick up | "12 MG Road, Bangalore" |
| Prepared Time | When food was made | datetime picker |
| Available Until | Deadline to pick up | datetime picker |
| Note | Any extra info (optional) | "Freshly prepared, serves 50" |

**What happens when you submit:**
1. Django validates the form (checks all required fields are filled)
2. Creates a new `Donation` record in the database with `status = AVAILABLE`
3. Redirects to a success page showing "Thank You for Your Donation!"
4. The donation now appears on the Find Food page

---

### Page 3: Find Food (`/find-food/`)
**What it is:** A listing of all available food that hasn't been claimed yet.

**What it shows:**
- Cards for each available donation
- Each card shows: food name, quantity, donor, location, time remaining
- A colored **Rescue Priority badge** on each card (explained below)
- A "Claim This Food" button on each card

**If no food is available:** Shows a friendly message + a "Donate Food" button.

**What happens behind the scenes:**
1. Django queries the database: `SELECT * FROM Donation WHERE status = 'AVAILABLE'`
2. For each donation, it calculates the priority (how urgent it is)
3. For each donation, it calculates time remaining (e.g., "2h 30m remaining")
4. Passes all this to the template to display as cards

---

### Page 4: Impact (`/impact/`)
**What it is:** A dashboard showing the collective impact of all donations.

**What it shows:**
- **Meals Rescued** → sum of `quantity` from all CLAIMED donations
- **Kg Food Saved** → meals rescued × 0.3 (rough estimate: 300g per meal)
- **Successful Connections** → count of CLAIMED donations
- **Partner Organizations** → hardcoded as 12 (mock value for prototype)
- **Impact Breakdown** → bar chart showing food types (mock percentages)
- **"Why FoodBridge Matters"** → narrative text section

**Where the numbers come from:**
```
total_rescued     = SUM(quantity) WHERE status = 'CLAIMED'     ← Real from database
food_saved_kg     = total_rescued × 0.3                        ← Calculated
total_connections = COUNT(*) WHERE status = 'CLAIMED'          ← Real from database
organizations     = 12                                         ← Mock/hardcoded
bar chart %       = 45%, 25%, 20%, 10%                         ← Mock/hardcoded
```

---

## The Claim Flow (Step by Step)

This is the most important flow to understand:

```
User is on Find Food page
        │
        ▼
Clicks "Claim This Food" on a card
        │
        ▼
Goes to Claim Confirmation page (/claim/3/)
   - Shows all donation details
   - Shows priority badge
   - Shows a warning: "By confirming, you commit to pickup"
   - Has "Confirm Claim" button + "Go Back" link
        │
        ▼
Clicks "Confirm Claim"
   - Browser sends POST request to /claim/3/process/
   - Django finds the donation (id=3)
   - Changes status: AVAILABLE → CLAIMED
   - Saves to database
        │
        ▼
Redirected to Claim Success page (/claim/3/success/)
   - Shows "🎉 Claim Successful!"
   - Shows food details
   - Buttons: "View More Food" and "See Impact"
```

**After claiming:**
- The donation **disappears** from Find Food (because it's no longer AVAILABLE)
- The Impact page numbers **increase** (because there's one more CLAIMED donation)

---

## The Rescue Priority System

This is the "smart" feature of the project. It's actually very simple:

```
How much time is left before food expires?

┌─────────────────┬────────────────────────┬───────────┐
│ Time Remaining  │ Priority               │ Color     │
├─────────────────┼────────────────────────┼───────────┤
│ Already expired │ ⚫ Expired             │ Gray      │
│ ≤ 1 hour        │ 🔥 High Priority       │ Red       │
│ 1 to 3 hours    │ 🟠 Medium Priority     │ Orange    │
│ > 3 hours       │ 🟢 Normal              │ Green     │
└─────────────────┴────────────────────────┴───────────┘
```

**How it works in the code** ([models.py](file:///d:/proj_vibe/core/models.py#L35-L46)):
```python
def get_priority(self):
    remaining = self.available_until - now     # How much time left?
    
    if remaining <= 0:        return "Expired"
    if remaining <= 1 hour:   return "High Priority"    # 🔥
    if remaining <= 3 hours:  return "Medium Priority"   # 🟠
    else:                     return "Normal"            # 🟢
```

It's just **subtraction** — current time minus expiry time. No AI, no ML, just math. But it looks smart and creates visual urgency on the page.

---

## The Database (One Table)

The entire project uses just **ONE database table**: `Donation`

```
┌───────────────────────────────────────────────────────────────┐
│                     DONATION TABLE                            │
├──────────────────┬──────────────────┬─────────────────────────┤
│ Column           │ Type             │ What it stores          │
├──────────────────┼──────────────────┼─────────────────────────┤
│ id               │ Auto Integer     │ Unique ID (1, 2, 3...) │
│ food_name        │ Text (200 chars) │ "Vegetable Biryani"     │
│ quantity         │ Positive Integer │ 50                      │
│ food_type        │ Text (50 chars)  │ "prepared" / "baked"    │
│ donor_name       │ Text (200 chars) │ "ABC Restaurant"        │
│ location         │ Text (300 chars) │ "12 MG Road, Bangalore" │
│ prepared_at      │ DateTime         │ When food was cooked    │
│ available_until  │ DateTime         │ Deadline for pickup     │
│ note             │ Text (any size)  │ Optional extra info     │
│ status           │ Text (20 chars)  │ "AVAILABLE" or "CLAIMED"│
│ created_at       │ DateTime (auto)  │ When record was created │
└──────────────────┴──────────────────┴─────────────────────────┘
```

**Status lifecycle:**
```
Donation created → status = "AVAILABLE"    (visible on Find Food page)
Donation claimed → status = "CLAIMED"      (hidden from Find Food, counted in Impact)
```

That's the entire database. One table, two statuses.

---

## How the Files Connect (The Full Picture)

Here's how a request flows through the project when someone visits a page:

```
User types URL in browser
        │
        ▼
foodbridge/urls.py
   - Looks at the URL
   - Says: "All URLs go to core/urls.py"
        │
        ▼
core/urls.py
   - Matches the URL to a view function
   - Example: "/donate/" → views.donate
        │
        ▼
core/views.py
   - The view function runs
   - Reads from / writes to the database using models.py
   - Uses forms.py if there's a form involved
   - Picks a template to render
        │
        ▼
core/templates/core/_____.html
   - The template receives data from the view
   - Uses base.html for the common layout (navbar, footer)
   - Fills in the page-specific content
   - Links to CSS and JS files
        │
        ▼
static/core/css/style.css + static/core/js/main.js
   - CSS makes it look pretty
   - JS adds mobile nav toggle, scroll animations, auto-dismiss alerts
        │
        ▼
Browser shows the final page to the user
```

---

## File-by-File Explanation

### Backend Files

| File | What it does |
|---|---|
| [`manage.py`](file:///d:/proj_vibe/manage.py) | Django's command-line tool. Used to run server, make migrations, etc. |
| [`foodbridge/settings.py`](file:///d:/proj_vibe/foodbridge/settings.py) | Project configuration — database (SQLite), installed apps, timezone (Asia/Kolkata), static files location |
| [`foodbridge/urls.py`](file:///d:/proj_vibe/foodbridge/urls.py) | Root URL router — sends all URLs to `core/urls.py`, also has `/admin/` for Django admin |
| [`core/urls.py`](file:///d:/proj_vibe/core/urls.py) | Maps 8 URLs to 8 view functions |
| [`core/models.py`](file:///d:/proj_vibe/core/models.py) | Defines the `Donation` model (the database table), plus `get_priority()` and `time_remaining()` methods |
| [`core/views.py`](file:///d:/proj_vibe/core/views.py) | All 8 view functions — the "brain" that handles every page request |
| [`core/forms.py`](file:///d:/proj_vibe/core/forms.py) | `DonationForm` — the form for donating food, with styled widgets |
| [`core/admin.py`](file:///d:/proj_vibe/core/admin.py) | Registers `Donation` model in Django admin panel for easy management |
| [`seed_data.py`](file:///d:/proj_vibe/core/management/commands/seed_data.py) | Management command to populate database with 7 sample donations (5 available + 2 claimed) |

### Frontend Files

| File | What it does |
|---|---|
| [`base.html`](file:///d:/proj_vibe/core/templates/core/base.html) | The "skeleton" — navbar, footer, CSS/JS links. All other pages extend this. |
| [`home.html`](file:///d:/proj_vibe/core/templates/core/home.html) | Landing page — hero, stats, how-it-works, featured donations, CTA |
| [`donate.html`](file:///d:/proj_vibe/core/templates/core/donate.html) | Food donation form page |
| [`donate_success.html`](file:///d:/proj_vibe/core/templates/core/donate_success.html) | "Thank you!" page after donating |
| [`find_food.html`](file:///d:/proj_vibe/core/templates/core/find_food.html) | Grid of available food cards with priority badges |
| [`claim_confirm.html`](file:///d:/proj_vibe/core/templates/core/claim_confirm.html) | Confirmation page before claiming — shows details + warning |
| [`claim_success.html`](file:///d:/proj_vibe/core/templates/core/claim_success.html) | "🎉 Claim Successful!" page |
| [`impact.html`](file:///d:/proj_vibe/core/templates/core/impact.html) | Impact dashboard — stats, bar chart, narrative |
| [`style.css`](file:///d:/proj_vibe/static/core/css/style.css) | All styling — colors, layout, cards, buttons, badges, responsiveness |
| [`main.js`](file:///d:/proj_vibe/static/core/js/main.js) | Mobile nav, scroll animations, auto-dismiss alerts, smooth scroll |

---

## The 8 URLs (Complete Map)

| URL | View Function | What Happens |
|---|---|---|
| `/` | `home` | Shows landing page |
| `/donate/` | `donate` | GET: shows form. POST: saves donation |
| `/donate/success/3/` | `donate_success` | Shows "Thank you!" for donation #3 |
| `/find-food/` | `find_food` | Lists all available donations |
| `/claim/3/` | `claim_confirm` | Shows details of donation #3, asks to confirm |
| `/claim/3/process/` | `claim_process` | POST: changes donation #3 status to CLAIMED |
| `/claim/3/success/` | `claim_success` | Shows "🎉 Claimed!" for donation #3 |
| `/impact/` | `impact` | Shows impact statistics |

---

## The 8 View Functions (What Each Does)

### 1. `home(request)` — [Line 9](file:///d:/proj_vibe/core/views.py#L9-L19)
```
Gets 3 latest available donations for "Featured" section
Counts total rescued meals (SUM of claimed quantities)
Counts total claimed donations
Sends all this to home.html
```

### 2. `donate(request)` — [Line 22](file:///d:/proj_vibe/core/views.py#L22-L34)
```
If GET request → show empty donation form
If POST request → validate form → save donation → redirect to success page
```

### 3. `donate_success(request, pk)` — [Line 37](file:///d:/proj_vibe/core/views.py#L37-L40)
```
Finds donation by its ID (pk)
Shows the "Thank You" page with donation details
```

### 4. `find_food(request)` — [Line 43](file:///d:/proj_vibe/core/views.py#L43-L50)
```
Gets all donations WHERE status = 'AVAILABLE'
For each one, calculates priority (High/Medium/Normal)
For each one, calculates time remaining ("2h 30m")
Sends the list to find_food.html to display as cards
```

### 5. `claim_confirm(request, pk)` — [Line 53](file:///d:/proj_vibe/core/views.py#L53-L59)
```
Finds donation by ID (must be AVAILABLE, else 404 error)
Calculates its priority and time remaining
Shows confirmation page with all details
```

### 6. `claim_process(request, pk)` — [Line 62](file:///d:/proj_vibe/core/views.py#L62-L70)
```
Only accepts POST requests (for security — CSRF protected)
Finds the donation (must be AVAILABLE)
Changes status to 'CLAIMED'
Saves to database
Redirects to success page
```

### 7. `claim_success(request, pk)` — [Line 73](file:///d:/proj_vibe/core/views.py#L73-L76)
```
Finds the donation by ID
Shows the "🎉 Claim Successful!" page
```

### 8. `impact(request)` — [Line 79](file:///d:/proj_vibe/core/views.py#L79-L89)
```
Calculates total_rescued = SUM of all claimed quantities
Calculates total_connections = COUNT of claimed donations
Calculates food_saved_kg = total_rescued × 0.3
Sends to impact.html
```

---

## Sample Data (What's Pre-loaded)

The [`seed_data.py`](file:///d:/proj_vibe/core/management/commands/seed_data.py) command creates 7 sample donations:

| # | Food | Qty | Donor | Status | Priority |
|---|---|---|---|---|---|
| 1 | Vegetable Biryani | 50 | ABC Restaurant | AVAILABLE | 🔥 High (30 min left) |
| 2 | Fresh Pizza | 30 | City Cafe | AVAILABLE | 🟠 Medium (2 hrs left) |
| 3 | Packed Meals | 80 | Grand Event Hall | AVAILABLE | 🟢 Normal (5 hrs left) |
| 4 | Chapati & Sabzi | 40 | Food Corner | AVAILABLE | 🔥 High (1 hr left) |
| 5 | Sandwiches | 25 | Campus Cafe | AVAILABLE | 🟢 Normal (8 hrs left) |
| 6 | Cake & Pastries | 15 | Sweet Dreams Bakery | CLAIMED | ⚫ Expired |
| 7 | Rice & Curry Packets | 60 | Green Catering | CLAIMED | ⚫ Expired |

The 2 CLAIMED donations make the Impact page show real numbers from the start (75 meals rescued).

---

## How to Run the Project

```bash
# Step 1: Activate virtual environment
d:\proj_vibe\venv\Scripts\activate

# Step 2: Run database migrations
python manage.py migrate

# Step 3: Load sample data
python manage.py seed_data

# Step 4: Start the server
python manage.py runserver

# Step 5: Open in browser
# http://127.0.0.1:8000/
```

---

## Demo Flow (For Presentations)

Follow this exact path to demonstrate everything:

```
1. Open http://127.0.0.1:8000/
   → Show the home page (hero, stats, how-it-works, featured food)

2. Click "Donate Food"
   → Fill the form (e.g., "Dal Makhani", 35 meals, ABC Cafe)
   → Submit
   → See the success page

3. Click "View Available Food"
   → See your new donation appear with a priority badge
   → Point out the different priority colors

4. Click "Claim This Food" on any card
   → See the confirmation page with all details
   → Click "Confirm Claim"
   → See the success page

5. Go to Find Food again
   → The claimed donation has disappeared!

6. Click "Impact" in the navbar
   → Numbers have increased!
   → Show the bar chart and narrative section

Done! Full flow demonstrated in ~3 minutes.
```

---

## Key Things to Remember for Viva/Presentation

1. **Architecture:** Django MVT — Model handles data, View handles logic, Template handles display
2. **Database:** Single table (`Donation`) with just 2 statuses (`AVAILABLE` / `CLAIMED`)
3. **Smart feature:** Rescue Priority — just time subtraction, but creates visual urgency
4. **No login needed:** Anyone can donate or claim (it's a prototype)
5. **Impact is real:** Meals rescued and connections come from actual database queries, not fake numbers
6. **CSS-only design:** No external images or icons (except Google Fonts). Everything built with HTML/CSS
7. **CSRF protection:** The claim form uses `{% csrf_token %}` — Django's built-in security against cross-site request forgery
8. **Template inheritance:** All pages use `base.html` as the skeleton — this is the DRY principle (Don't Repeat Yourself)
