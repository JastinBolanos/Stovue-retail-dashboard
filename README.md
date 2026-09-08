# 🛒 STOVUE — Enterprise Retail Command Center (v4.0.0-ENT)

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Deployment](https://img.shields.io/badge/deployment-production-blue)
![Architecture](https://img.shields.io/badge/architecture-DDD%20%7C%20Clean-success)
![Security](https://img.shields.io/badge/security-TLS_1.3-orange)

> **Centro de Control y Comando de Operaciones Retail Omnicanal.** 
> Plataforma empresarial de alta densidad (Supply Chain Intelligence) diseñada para orquestar redes logísticas multitienda. Unifica la telemetría transaccional en tiempo real, gestión masiva de inventario, prevención de roturas de stock y un pipeline automatizado impulsado por IA para la recuperación de ingresos.

🌍 **[Ver Plataforma en Vivo (Producción) 🟢]** *https://stovue.vercel.app/*

![Vista Previa de STOVUE Command Center](https://github.com/user-attachments/assets/9248444f-d77d-4842-a380-2e7269f6f67f)

---

## 🎥 Demostración de Operaciones Retail en Vivo

**🎬 Panel de Control y Orquestación Logística**  
Exploración de la terminal STOVUE: monitoreo omnicanal en tiempo real, gestión masiva de catálogo mediante carga de archivos (CSV), rebalanceo de inventario y ejecución del pipeline de recuperación de carritos mediante Inteligencia Artificial.

https://github.com/user-attachments/assets/3b7c3799-8709-4c95-9ea8-cd06ec1c2c5a

---

## 🏗️ Arquitectura de Sistema y Stack Tecnológico

Este repositorio contiene la arquitectura de la aplicación cliente (Web/Edge) y el API Gateway analítico. Basado en **Clean Architecture & Domain-Driven Design (DDD)**, aísla la lógica de negocio en servicios puros de dominio. *(Nota: Por políticas de seguridad comercial, los repositorios de bases de datos transaccionales (ERP/POS) y microservicios de pasarela de pago permanecen privados).*

- **Core Frontend & Gestión de Estado:**
  - `react` (`^19.0.1`) & `react-dom` para orquestación de UI de alta frecuencia.
  - `typescript` (`~5.8.2`) garantizando inmutabilidad en modelos de dominio (`sku.ts`, `cart.ts`, `order.ts`).
  - `vite` (`^6.2.3`) como motor de compilación HMR ultrarrápido.
- **Backend & Proxy API:**
  - `express` (`^4.21.2`) operando como Gateway REST (`/api/ai/*`) para inferencia de datos.
  - `esbuild` (`^0.25.0`) empaquetando el servidor en modo *standalone* (`dist/server.cjs`).
- **Interfaz (Dark Industrial Terminal):**
  - `tailwindcss` (`^4.1.14`) estructurando un diseño de alto contraste (`#050505` con acentos `#00FF41`).
  - `recharts` (`^3.10.1`) para visualización reactiva de embudos y P&L.
  - `motion` (`^12.23.24`) para micro-feedback en operaciones en lote.
- **Motor de Inteligencia Analítica:**
  - Integración con `@google/genai` (`^2.4.0`) implementando el modelo *Gemini 3.7 Flash* con una estrategia de contingencia heurística local (Fallback) para operar sin cuota de API.

---

## 🚀 Módulos Operativos (Desplegados)

### 📊 1. Telemetría y Mando Global (`DashboardOverview`)
* **Monitor Transaccional:** Feed omnicanal en tiempo real (POS físico + E-commerce).
* **Métricas de Rendimiento (KPIs):** Cálculo de Ticket Medio (AOV), volumen bruto de mercancía (GMV), tasas de conversión y valor retenido en carritos.

### 📦 2. Gobernanza Masiva de Catálogo (`SKUManagement`)
* **Motor de Operaciones en Lote (Bulk Actions):** Ajuste porcentual de precios dinámicos (Dynamic Pricing), cálculo de márgenes comerciales y bloqueos masivos.
* **Control de Códigos y Trazabilidad:** Generador de EAN-13 integrado y motor bidireccional de ingesta/exportación vía archivos **CSV**.

### 🚨 3. Cadena de Suministro y Órdenes de Compra (`InventoryAlerts`)
* **Prevención de Roturas (Runway):** Detección de SKUs bajo el umbral de seguridad (Safety Stock) con alertas tempranas.
* **Orquestación de POs:** Emisión automática de Órdenes de Compra a proveedores y rebalanceo de inventario (transferencias) entre nodos logísticos.

### 💰 4. Pipeline de Recuperación de Ingresos (`AbandonedCarts`)
* **Auditoría de Fugas:** Seguimiento del valor económico estancado por abandono de carritos.
* **Campañas Generativas (IA):** Creación autónoma de secuencias de recuperación (Email/SMS) con cupones de expiración corta optimizados para conversión.

### 🧠 5. Copilot Directivo y Nodos Multitienda (`RetailCopilotModal` & `BranchNetwork`)
* **Auditor de Nodos:** Comparativa de rendimiento, control de aforo y ocupación logística por sucursal (Flagship Madrid, Boutique BCN, Hub Central).
* **Asistente Ejecutivo (IA):** Macros analíticas de diagnóstico en un clic (Resumen P&L, liquidación de stock muerto, maximización de márgenes).

---

## 💻 Guía de Despliegue y Auditoría (Entorno Local)

Para ingenieros de datos o desarrolladores autorizados que requieran levantar el entorno de control en modo *Sandbox*:

### 1. Clonar y Preparar el Entorno (Node.js v20+)
```bash
git clone [https://github.com/tu-usuario/stovue-retail-dashboard.git](https://github.com/tu-usuario/stovue-retail-dashboard.git)
cd stovue-retail-dashboard
npm install
```

### 2. Configurar el Motor de Inteligencia (Opcional)
Copia el archivo base de configuración. (Nota: El sistema activará su motor heurístico local automáticamente si no se inyecta la API Key de Gemini, permitiendo operar el 100% de la plataforma).

```Bash
cp .env.example .env
```
### ⚙️ 3. Herramientas de Integración y Despliegue (CI/CD)

| Comando | Descripción de la Operación Pipeline |
| :--- | :--- |
| `npm run dev` | Inicia el entorno dual (Cliente Vite + Servidor Express) en `http://localhost:3000`. |
| `npm run build` | Compila el frontend estático y empaqueta el backend optimizado mediante `esbuild`. |
| `npm start` | Inicia el servidor de producción renderizando los artefactos listos para CDN. |

---

### 📂 4. Arquitectura de Dominio (Tree)

```text
src/
├── core/
│   ├── domain/               # Modelos de dominio inmutables (SKU, Branch, Cart)
│   ├── services/             # Servicios de lógica pura (Telemetry, CSV, Copilot)
│   └── utils/                # Generadores EAN-13 y formateadores de divisas
├── context/
│   └── LanguageContext.tsx   # Motor de internacionalización (i18n ES/EN)
├── hooks/
│   └── useRetailEngine.ts    # Orquestador reactivo global de la tienda
└── components/
    ├── DashboardOverview.tsx # Telemetría de negocio y embudos
    ├── SKUManagement.tsx     # Ingesta masiva CSV y Control de Precios
    ├── InventoryAlerts.tsx   # POs y Rebalanceo Inter-Sucursales
    ├── AbandonedCarts.tsx    # Generación de campañas AI (Email/SMS)
    └── RetailCopilotModal.tsx# Consola del Asistente Ejecutivo Directivo
```
---
  *Propiedad de Arquitectura de Software - Jastin Bolaños © 2026. Proyecto de Demostración Técnica Empresarial.*
