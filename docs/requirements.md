# FoodBridge — Requirements Document

## Project Overview

**FoodBridge** is a social-impact web platform that reduces food waste by connecting organizations and businesses with surplus food to organizations that can put it to good use.

The core flow is:

```
Donate → Discover → Claim → Impact
```

This is a **45-minute polished prototype** — not a production application. It is designed to clearly demonstrate the concept through a working Django website suitable for:

- College project presentations
- Hackathon demos
- Social impact showcases
- Project demonstrations

---

## Problem Statement

Every day, restaurants, event halls, cafes, and catering businesses discard large quantities of edible food. At the same time, NGOs, shelters, and community organizations struggle to find affordable food sources. The gap between surplus and need exists not because of scarcity, but because of **lack of connection**.

There is no simple, fast way for a restaurant with 50 leftover meals to find an organization that could use them — before the food spoils.

---

## Proposed Solution

FoodBridge provides a lightweight web platform where:

1. **Donors** (restaurants, cafes, event organizers) can list surplus food with details like quantity, type, location, and time window.
2. **Organizations** (NGOs, shelters, community kitchens) can browse available food donations, see urgency/priority, and claim them.
3. **Impact** is tracked and displayed — meals rescued, food saved, connections made.

The platform acts as a bridge:

```
Restaurant / Donor
        │
        ▼
   Surplus Food
        │
        ▼
    FoodBridge
        │
        ▼
  Organization
        │
        ▼
   Social Impact
```

---

## Target Users

### Food Donors
- Restaurants with leftover prepared food
- Cafes with unsold items at end of day
- Event halls with surplus catered food
- Campus cafeterias with excess meals

### Food Recipients
- NGOs serving communities in need
- Shelters and community kitchens
- Charitable organizations running food programs

> **Note:** For this prototype, no authentication or role distinction is implemented. Any visitor can donate or claim food.

---

## Functional Requirements

### FR-1: Home Page (`/`)
- Display a hero section with project tagline and call-to-action buttons
- Show social impact statistics (meals rescued, food saved, organizations, connections)
- Explain "How FoodBridge Works" in a visual step-by-step flow
- Display featured available food donations
- Provide clear navigation to Donate and Find Food pages

### FR-2: Donate Food Page (`/donate/`)
- Present a food donation form with the following fields:
  - Food name (required)
  - Quantity — number of meals (required)
  - Food type — select from categories like Prepared Meals, Baked Goods, Fresh Produce, Packaged Food, Beverages, Other (required)
  - Donor name (required)
  - Location (required)
  - Prepared time — datetime (required)
  - Available until — datetime (required)
  - Note (optional)
- Validate the form on submission
- Create a new Donation record with status `AVAILABLE`
- Show a success message after creation
- Redirect appropriately after submission

### FR-3: Find Food Page (`/find-food/`)
- Display all donations with status `AVAILABLE`
- Show each donation as a card with:
  - Food name
  - Quantity (meals)
  - Donor name
  - Location
  - Time remaining / availability window
  - Rescue Priority badge (High / Medium / Normal)
  - Claim button
- Order donations by urgency (most urgent first)

### FR-4: Rescue Priority System
- Calculate priority based on time remaining until `available_until`:
  - **🔥 HIGH PRIORITY** — Less than 1 hour remaining
  - **🟠 MEDIUM PRIORITY** — 1 to 3 hours remaining
  - **🟢 NORMAL** — More than 3 hours remaining
- Implemented using simple Python datetime comparison (no AI/ML)

### FR-5: Claim Food Flow
- Clicking "Claim" on a donation opens a confirmation view
- Confirmation page shows full donation details and a "Confirm Claim" button
- Confirming the claim updates the donation status from `AVAILABLE` to `CLAIMED`
- Claimed donations no longer appear in the Find Food listing
- A success message is displayed after claiming
- Uses Django POST handling (CSRF-protected)

### FR-6: Impact Page (`/impact/`)
- Display aggregated impact statistics:
  - Total meals rescued (sum of quantity from claimed donations)
  - Total food saved (calculated estimate in kg)
  - Number of claimed donations (successful connections)
  - Partner organizations count
- Show a simple visual representation of impact data
- Combine real database aggregation with mock values where appropriate

### FR-7: Navigation
- Consistent navigation bar across all pages
- Links to: Home, Donate Food, Find Food, Impact
- Active page indicator
- Responsive (collapses on mobile)

### FR-8: Sample Data
- Pre-populate the database with sample donations for demonstration:
  - Vegetable Biryani — 50 meals — ABC Restaurant
  - Fresh Pizza — 30 meals — City Cafe
  - Packed Meals — 80 meals — Grand Event Hall
  - Chapati & Sabzi — 40 meals — Food Corner
  - Sandwiches — 25 meals — Campus Cafe

---

## Non-Functional Requirements

| Requirement | Description |
|---|---|
| **Responsive** | Works on desktop, tablet, and mobile screens |
| **Simple** | Minimal dependencies, easy to understand and run |
| **Maintainable** | Clean code structure, well-organized Django patterns |
| **Fast** | SQLite database, no heavy external calls, quick page loads |
| **Beginner-friendly** | Standard Django patterns, no complex abstractions |
| **Presentation-ready** | Polished UI that looks professional in a demo setting |
| **Self-contained** | No external API calls, images, or services required |

---

## Out of Scope

The following are explicitly **NOT** part of this prototype:

- ❌ User authentication / registration / login
- ❌ Payment processing
- ❌ Google Maps or any map integration
- ❌ Real-time tracking or WebSocket updates
- ❌ AI/ML-based recommendations
- ❌ Push notifications or email alerts
- ❌ External API integrations
- ❌ Production deployment (Heroku, AWS, etc.)
- ❌ Django REST Framework or API endpoints
- ❌ PostgreSQL or other production databases
- ❌ Redis, Celery, or background task processing
- ❌ Multi-tenancy or organization accounts
- ❌ Image uploads for food items
- ❌ Search or filtering functionality
- ❌ Admin dashboard customization
