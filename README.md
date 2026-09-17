<div align="center">
  <img alt="STOVUE Banner" src="https://github.com/user-attachments/assets/6709befb-c328-4154-a007-c287b8f5190e" width="40%" />

  <br>

  <h3>Enterprise Retail Command Center (v4.0.0-ENT)</h3>

  <p>
    <img src="https://img.shields.io/badge/build-passing-brightgreen" alt="Build Status" />
    <img src="https://img.shields.io/badge/deployment-production-blue" alt="Deployment" />
    <img src="https://img.shields.io/badge/architecture-DDD%20%7C%20Clean-success" alt="Architecture" />
    <img src="https://img.shields.io/badge/security-TLS_1.3-orange" alt="Security" />
  </p>
</div>

<br>

> **Omnichannel Retail Operations Dashboard & Interface Showcase.**  
> A client-side operational dashboard engineered for multi-store retail monitoring. Demonstrates transactional visualization, bulk inventory management tools, stock threshold alerts, and automated customer recovery workflows.

<br>

<div align="center">
  <h3>🌍 <b><a href="https://stovue.vercel.app/">View Live Platform (Production) 🟢</a></b></h3>
  <br>
  <img alt="STOVUE Preview" src="https://github.com/user-attachments/assets/9248444f-d77d-4842-a380-2e7269f6f67f" width="80%" />
</div>

## 🎥 Live Retail Operations Demonstration

**🎬 Dashboard Walkthrough & Operations Flow**  
STOVUE interface demonstration: real-time sales feed visualization, batch inventory editing via CSV upload, inter-branch stock monitoring, and the cart recovery workflow interface.

https://github.com/user-attachments/assets/3b7c3799-8709-4c95-9ea8-cd06ec1c2c5a

---

## 🏗️ System Architecture & Tech Stack

This repository focuses on the web client interface and supporting API gateway. Designed with structured domain separation and clean architecture patterns, it decouples presentation components from domain calculation services.

- **Frontend Core & State Management:**
  - `react` (`^19.0.1`) & `react-dom` for responsive dashboard view rendering.
  - `typescript` (`~5.8.2`) providing static typing across data models (`sku.ts`, `cart.ts`, `order.ts`).
  - `vite` (`^6.2.3`) for efficient development serving and bundling.
- **Backend & Gateway Layer:**
  - `express` (`^4.21.2`) operating as a lightweight API gateway (`/api/ai/*`) for analytical requests.
  - `esbuild` (`^0.25.0`) bundling the server into a compact production build (`dist/server.cjs`).
- **Interface & Visual Design:**
  - `tailwindcss` (`^4.1.14`) styled with a high-contrast dark terminal theme (`#050505` with `#00FF41` accent highlights).
  - `recharts` (`^3.10.1`) for responsive funnel and performance data visualizations.
  - `motion` (`^12.23.24`) for smooth feedback during batch updates and table interactions.
- **Analytical Assistance:**
  - Integration with `@google/genai` (`^2.4.0`) to generate contextual suggestions, paired with a local fallback engine to ensure reliable client functionality offline or without active API quotas.

---

## 🚀 Operational Modules (Deployed)

### 📊 1. Overview Telemetry (`DashboardOverview`)
* **Activity Feed:** Live simulated omnichannel transaction stream (POS and online store).
* **Key Performance Indicators:** Real-time tracking of Average Order Value (AOV), Gross Merchandise Volume (GMV), conversion rates, and pending cart values.

### 📦 2. Catalog & Inventory Management (`SKUManagement`)
* **Batch Editing Tools:** Percentage-based price adjustments, margin calculations, and inventory status toggles.
* **Product Identification:** Built-in EAN-13 barcode generation and bidirectional CSV data import/export.

### 🚨 3. Stock Level & Reorder Alerts (`InventoryAlerts`)
* **Threshold Monitoring:** Early alerts for products reaching safety stock minimums.
* **Reorder Coordination:** Interface workflows to prepare supplier purchase orders and balance stock across locations.

### 💰 4. Cart Recovery Workflows (`AbandonedCarts`)
* **Activity Tracking:** Clear visibility into uncompleted checkouts and stalled cart values.
* **Communication Templates:** Structured generator for email and SMS recovery sequences featuring time-sensitive incentive codes.

### 🧠 5. Analytical Assistant & Branch Network (`RetailCopilotModal` & `BranchNetwork`)
* **Branch Overview:** Metrics comparison, occupancy estimates, and logistical capacity across locations (Flagship Madrid, Boutique BCN, Central Hub).
* **Operational Assistant:** Quick diagnostic queries for sales overviews, aging inventory review, and margin summaries.

---

## 💻 Deployment & Audit Guide (Local Environment)

For data engineers or authorized developers setting up the control environment in *Sandbox* mode:

### 1. Clone and Prepare the Environment (Node.js v20+)
```bash
git clone https://github.com/tu-usuario/stovue-retail-dashboard.git
cd stovue-retail-dashboard
npm install
```

### 2. Configure the Intelligence Engine (Optional)
Copy the base configuration file. (Note: The system automatically activates its local heuristic engine if no Gemini API Key is supplied, allowing 100% platform operation).

```bash
cp .env.example .env
```
### ⚙️ 3. Integration & Deployment Tools (CI/CD)

| Command | Pipeline Operation Description |
| :--- | :--- |
| `npm run dev` | Starts the dual development environment (Vite Client + Express Server) at `http://localhost:3000`. |
| `npm run build` | Builds the static frontend bundle and compiles the optimized backend using `esbuild`. |
| `npm start` | Boots the production server serving CDN-ready deployment artifacts. |

---

### 📂 4. Domain Architecture (Tree)

```text
src/
├── core/
│   ├── domain/               # Immutable domain models (SKU, Branch, Cart)
│   ├── services/             # Pure business logic services (Telemetry, CSV, Copilot)
│   └── utils/                # EAN-13 barcode generators and currency formatters
├── context/
│   └── LanguageContext.tsx   # Internationalization engine (i18n ES/EN)
├── hooks/
│   └── useRetailEngine.ts    # Global reactive store orchestrator
└── components/
    ├── DashboardOverview.tsx # Business telemetry and conversion funnels
    ├── SKUManagement.tsx     # Bulk CSV ingestion and price governance
    ├── InventoryAlerts.tsx   # Purchase Orders and inter-branch rebalancing
    ├── AbandonedCarts.tsx    # AI-powered recovery campaign generation (Email/SMS)
    └── RetailCopilotModal.tsx# Executive Copilot management console
```
---
*Software Architecture Property - Jastin Bolaños © 2026. Enterprise Technical Showcase Project.*
