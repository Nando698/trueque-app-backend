# Trueque App

**Aplicación de trueque** construida con **Next.js** (frontend) y **NestJS** (backend).

---

## 📋 Tabla de Contenidos

1. [Requisitos](#requisitos)
2. [Instalación](#instalación)
3. [Variables de Entorno](#variables-de-entorno)
4. [Ejecutar Backend](#ejecutar-backend)
5. [Ejecutar Frontend](#ejecutar-frontend)
6. [Uso de la Aplicación](#uso-de-la-aplicación)
7. [Endpoints Principales (API)](#endpoints-principales-api)
8. [Scripts Útiles](#scripts-útiles)
9. [Licencia](#licencia)

---

## 🚀 Requisitos

* **Node.js** 
* **npm**
* **PostgreSQL** corriendo localmente

---

## 🛠️ Instalación

1. Clonar el repositorio:

   ```bash
   git clone <URL_DEL_REPO>

      FRONT: https://github.com/Nando698/trueque-app
      BACK: https://github.com/Nando698/trueque-app-backend
   
   ```
2. Instalar dependencias:

   ```bash
   npm install      
   ```

---

## 🔐 Variables de Entorno

1. Copiar el ejemplo:

   ```bash
   cp .env.example .env
   ```
2. Editar `.env`:

   ```dotenv
  DB_HOST=localhost
  DB_PORT= 
  DB_USERNAME=
  DB_PASSWORD=
  DB_NAME=trueque
  PORT=3001
   ```

---

## 🖥️ Ejecutar Backend

```bash

npm run start 

```

* El backend estará en: `http://localhost:3001` por defecto, sino se debe modificar el .env del frontend indicando donde apuntar

---

## 🌐 Ejecutar Frontend

```bash

npm run start      
```

* El frontend estará en: `http://localhost:3000`

---

## 🔎 Uso de la Aplicación

1. Abra el navegador en `http://localhost:3000`.
2. Registre una cuenta o inicie sesión usando email y contraseña.
3. En el panel de usuario, podrá:

   * **Crear una oferta:** complete título, descripción, suba imágenes y seleccione categoría.
   * **Ver ofertas propias:** edite, pause o finalice las ofertas existentes.
   * **Navegar ofertas:** explore y filtre por categoría o estado.
   * **Enviar contraofertas:** en la página de detalle de una oferta, envíe un mensaje proponiendo un intercambio.
   * **Gestionar recibidos:** en tu perfil, acepta o rechaza contraofertas que otros envíen a tus ofertas.
   * **Favoritos:** agrega o quita ofertas de tu lista de favoritos.

---



---

## ⚙️ Scripts Útiles

| Comando                  | Descripción                            |
| ------------------------ | -------------------------------------- |
| `npm run test`   | Ejecuta tests de backend (Jest)                |



---

