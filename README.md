# Trueque App

**Aplicación de trueque** construida con **Next.js** (frontend) y **NestJS** (backend).



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

MAS INFORMACION EN LA DOCUMENTACION: https://nando698.github.io/trueque-app-backend/index.html




## Glosario - Términos Funcionales

| Término                | Definición |
|------------------------|-----------|
| **Usuario**            | Persona registrada en la plataforma que puede publicar ofertas y realizar contraofertas. |
| **Admin**              | Persona registrada con los mismos permisos que un usuario, mas una serie de permision orientados a la moderacion |
| **Oferta**             | Publicación creada por un usuario para ofrecer un producto o servicio en el sistema de trueque. |
| **Estado de Oferta**   | Estado actual de una oferta: puede ser `ACTIVA`, `PAUSADA` o `FINALIZADA`. |
| **Ofrecimiento**       | Contraoferta que un usuario envía sobre una oferta existente. Contiene un mensaje y puede ser aceptada o rechazada. |
| **Estado de Ofrecimiento** | Estado actual de un ofrecimiento: puede ser `PENDIENTE`, `ACEPTADO` o `RECHAZADO`. |
| **Favorito**           | Oferta marcada por un usuario para poder acceder rápidamente a ella desde su perfil. |
| **Categoría**          | Clasificación asignada a una oferta (ej: Tecnología, Hogar, Servicios). |


## Glosario - Términos Técnicos

| Término                | Definición |
|------------------------|-----------|
| **Token**          | Token usado para autenticar usuarios en las distintas operaciones del sistema. |
| **Backend**            | Aplicacion que se encarga de gestionar, manipular y servir los recursos que necesita el Frontend |
| **Frontend**           | Interfaz de usuario que permite interactuar con la plataforma.  |
| **DTO** | Objeto usado para transferir datos entre capas de la aplicación |
| **AuthGuard**          | Mecanismo de protección en el backend que valida si un usuario tiene autorización para acceder a ciertos recursos |
| **RecoveryCode**       | Código temporal generado para recuperar la contraseña de un usuario registrado. |


