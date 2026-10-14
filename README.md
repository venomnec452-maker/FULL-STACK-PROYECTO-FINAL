# StockMaster Full Stack — Sistema Integral de Gestión de Depósito e Inventario

[![Node.js Version](https://img.shields.io/badge/Node.js-v24.x-green.svg)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/React-18.x-blue.svg)](https://react.dev/)
[![MongoDB Version](https://img.shields.io/badge/MongoDB-7.0-brightgreen.svg)](https://www.mongodb.com/)
[![Laravel Version](https://img.shields.io/badge/Laravel-11.x-red.svg)](https://laravel.com/)
[![Docker Compose](https://img.shields.io/badge/Docker-Compose_v2-2496ED.svg)](https://docs.docker.com/compose/)

Proyecto Final integrador para la carrera de **Analista de Sistemas** en la materia **Full Stack**.

---

## 1. Descripción del Proyecto

**StockMaster Full Stack** es una solución empresarial de software diseñada para el control riguroso de existencias, trazabilidad de movimientos de almacén, órdenes de compra y documentación técnica.

El sistema resuelve la problemática habitual de discrepancias entre las existencias físicas en el depósito y los registros contables/administrativos, garantizando:
* **Atomicidad y consistencia:** Imposibilidad de generar stock negativo por salidas no autorizadas o condiciones de carrera concurrentes.
* **Trazabilidad inmutable:** Registro estricto de auditoría (`AuditLogs`) y de movimientos (`StockMovements`) donde los registros confirmados no pueden ser borrados arbitrariamente, solo ajustados mediante movimientos compensatorios auditados.
* **Separación de responsabilidades:** Arquitectura modular orientada a servicios desacoplados con bases de datos políglotas (MongoDB para inventario transaccional NoSQL y MySQL para órdenes de compra relacionales).

---

## 2. Mapa Tecnológico y Puertos

| Servicio | Tecnología | Puerto Host | Descripción de Responsabilidad |
| :--- | :--- | :--- | :--- |
| **Frontend** | React + Vite + Tailwind CSS | `3000` | Interfaz SPA responsiva, dashboards, gestión de productos y movimientos. |
| **Backend Principal** | Node.js + Express + Mongoose | `5000` | Core API RESTful, reglas de negocio de depósito, seguridad JWT y auditoría. |
| **Base de Datos Core** | MongoDB 7.0 | `27017` | Almacenamiento no relacional de productos, usuarios, categorías y movimientos. |
| **Servicio Compras** | PHP 8.3 + Laravel 11 | `8000` | Módulo complementario de solicitudes, órdenes de compra y recepciones. |
| **Base de Datos Compras**| MySQL 8.0 | `3306` | Almacenamiento relacional con integridad referencial estricta. |
| **CMS Headless** | WordPress 6 (Apache) | `8080` | Gestión editorial desacoplada de manuales de usuario y FAQs. |
| **BD WordPress** | MySQL 8.0 (WP DB) | `3307` | Base de datos aislada para el CMS WordPress. |

---

## 3. Decisiones de Arquitectura de Software (ADR - Architectural Decision Records)

### ADR-001: Persistencia Políglota y Desacoplamiento de Servicios
* **Contexto:** El sistema maneja catálogo dinámico y trazabilidad rápida de inventario, pero requiere también un módulo formal de órdenes de compra con estados estrictos.
* **Decisión:** 
  1. El backend principal utiliza **Node.js + MongoDB**: permite esquemas flexibles para productos con múltiples atributos, alta concurrencia de lectura/escritura y fácil registro de eventos inmutables.
  2. El módulo de compras utiliza **Laravel + MySQL**: aprovecha el ORM Eloquent y las restricciones de integridad relacional (Foreign Keys) para órdenes y remitos.
  3. **Comunicación:** Laravel notifica a Node.js mediante endpoints REST autenticados con tokens M2M (*Machine-to-Machine*) y claves de idempotencia, prohibiendo accesos directos a bases de datos cruzadas.

### ADR-002: Inmutabilidad del Historial de Stock
* **Contexto:** En auditoría contable no se permite "editar" directamente el stock de un producto mediante un simple `PUT /products/:id { stock: 50 }`.
* **Decisión:** El stock solo se modifica a través del motor `InventoryService`, generando obligatoriamente una entrada en `StockMovements` con usuario responsable, motivo, stock anterior y stock posterior.

---

## 4. Requisitos Previos

* **Node.js**: v20 o superior (recomendado v24).
* **Docker Desktop**: versión 24+ con WSL2 habilitado en Windows.
* **Git**: para control de versiones.

---

## 5. Puesta en Marcha Rápida (Entorno de Desarrollo)

### Paso 1: Clonar y configurar variables de entorno
```powershell
# Copiar plantilla de variables
Copy-Item .env.example .env
```

### Paso 2: Ejecución de Bases de Datos con Docker
Para iniciar las bases de datos (MongoDB y MySQL) en segundo plano:
```powershell
docker compose up -d mongodb mysql
```

---

## 6. Estructura del Repositorio

* `frontend/`: Cliente React SPA con Vite.
* `backend-node/`: API RESTful Node.js + Express.
* `backend-laravel/`: Servicio complementario de compras en Laravel.
* `wordpress/`: Archivos y configuración de WordPress Headless.
* `docker/`: Dockerfiles y plantillas de configuración de contenedores.
* `docs/`: Documentación académica, diagramas Mermaid y especificaciones OpenAPI.
* `postman/`: Colección de pruebas de endpoints.
* `scripts/`: Scripts de inicialización y carga de datos de prueba (seeds).
