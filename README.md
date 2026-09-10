# 🛒 STOVUE — Enterprise Retail Command Center (v4.0.0-ENT)

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Deployment](https://img.shields.io/badge/deployment-production-blue)
![Architecture](https://img.shields.io/badge/architecture-DDD%20%7C%20Clean-success)
![Security](https://img.shields.io/badge/security-TLS_1.3-orange)

> **Omnichannel Retail Operations Command & Control Center.** 
> High-density enterprise platform (Supply Chain Intelligence) engineered to orchestrate multi-store logistics networks. Unifies real-time transactional telemetry, bulk inventory governance, stockout prevention, and an automated AI-driven pipeline for revenue recovery.

🌍 **[View Live Platform (Production) 🟢]** *https://stovue.vercel.app/*

![STOVUE Command Center Preview](https://github.com/user-attachments/assets/9248444f-d77d-4842-a380-2e7269f6f67f)

---

## 🎥 Live Retail Operations Demonstration

**🎬 Control Panel and Logistics Orchestration**  
STOVUE terminal walkthrough: real-time omnichannel monitoring, bulk catalog management via CSV file upload, inventory rebalancing, and execution of the AI-powered cart recovery pipeline.

https://github.com/user-attachments/assets/3b7c3799-8709-4c95-9ea8-cd06ec1c2c5a

---

## 🏗️ System Architecture & Tech Stack

This repository contains the client application architecture (Web/Edge) and the analytical API Gateway. Built on **Clean Architecture & Domain-Driven Design (DDD)**, it isolates business logic into pure domain services. *(Note: Due to commercial security policies, transactional database repositories (ERP/POS) and payment gateway microservices remain private).*

- **Frontend Core & State Management:**
  - `react` (`^19.0.1`) & `react-dom` for high-frequency UI orchestration.
  - `typescript` (`~5.8.2`) ensuring immutability across domain models (`sku.ts`, `cart.ts`, `order.ts`).
  - `vite` (`^6.2.3`) as the ultra-fast HMR build engine.
- **Backend & API Proxy:**
  - `express` (`^4.21.2`) operating as a REST Gateway (`/api/ai/*`) for data inference.
  - `esbuild` (`^0.25.0`) bundling the server into a *standalone* executable (`dist/server.cjs`).
- **Interface (Dark Industrial Terminal):**
  - `tailwindcss` (`^4.1.14`) styling a high-contrast layout (`#050505` with `#00FF41` accents).
  - `recharts` (`^3.10.1`) for reactive funnel and P&L data visualization.
  - `motion` (`^12.23.24`) for fluid micro-feedback during bulk operations.
- **Analytical Intelligence Engine:**
  - Integration with `@google/genai` (`^2.4.0`) leveraging *Gemini* with a local heuristic fallback strategy to ensure full functionality even without API quota.

---

## 🚀 Operational Modules (Deployed)

### 📊 1. Telemetry and Global Command (`DashboardOverview`)
* **Transactional Monitor:** Real-time omnichannel feed (Physical POS + E-commerce).
* **Performance Metrics (KPIs):** Average Order Value (AOV), Gross Merchandise Volume (GMV), conversion rates, and retained cart value.

### 📦 2. Bulk Catalog Governance (`SKUManagement`)
* **Bulk Operations Engine:** Dynamic pricing percentage adjustments, profit margin calculations, and bulk status locks.
* **Code Control & Traceability:** Integrated EAN-13 generator and bidirectional CSV import/export engine.

### 🚨 3. Supply Chain & Purchase Orders (`InventoryAlerts`)
* **Stockout Prevention (Runway):** Early-warning detection for SKUs below safety stock thresholds.
* **PO Orchestration:** Automated supplier Purchase Order issuance and inter-branch inventory rebalancing.

### 💰 4. Revenue Recovery Pipeline (`AbandonedCarts`)
* **Leakage Audit:** Real-time tracking of stalled capital from abandoned checkouts.
* **Generative Campaigns (AI):** Autonomous recovery sequence creation (Email/SMS) featuring conversion-optimized short-expiry discount codes.

### 🧠 5. Executive Copilot & Multi-Branch Nodes (`RetailCopilotModal` & `BranchNetwork`)
* **Node Auditor:** Performance benchmarking, occupancy, and logistics capacity tracking by location (Flagship Madrid, Boutique BCN, Central Hub).
* **Executive Assistant (AI):** One-click diagnostic analytical macros (P&L summary, dead stock clearance, margin optimization).

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
