# AION 2 - Party Manager

Mockup local para gestionar fuerzas, parties y miembros del roster de AION 2.

## Características

- 4 fuerzas por defecto
- 4 parties por fuerza
- 5 miembros máximos por party
- Guardado automático en el navegador con `localStorage`
- Añadir, borrar y vaciar parties
- Diseño responsive para probar en PC o móvil

## Cómo levantarlo localmente

### Opción 1: abrir directamente

Abre `index.html` en el navegador.

### Opción 2: usar un servidor local

Desde la carpeta del proyecto ejecuta:

```bash
python -m http.server 8000
```

Y luego entra a:

```text
http://localhost:8000
```

### Opción 3: con proxy NC para sync de iLvl/CP

1. Levanta la web:

```bash
npx serve . -l 4173
```

2. En otra terminal, levanta el proxy NC:

```bash
node nc-proxy-server.js
```

3. Abre la app en:

```text
http://localhost:4173
```

4. En la vista de lista global, verifica `API NC Proxy` con:

```text
http://localhost:8787
```

5. Elige `Región Preferida` (recomendado: la región real de tu guild).

6. Usa `Sync NC` por miembro o `Sync iLvl/CP (NC)` para sincronizar todo.

### Opción 4: backend + PostgreSQL (Neon) para dejarlo online

Esta opción te deja una base de datos real compartida para internet.

1. Backend local:

```bash
cd backend
cp .env.example .env
```

2. Edita `backend/.env` y define:

```text
PORT=8788
CORS_ORIGIN=http://localhost:4173
DATABASE_URL=TU_URL_DE_NEON
JWT_SECRET=UN_SECRETO_LARGO_Y_UNICO
STAFF_PASSWORD=blacklist2026
```

3. Instala y levanta backend:

```bash
npm install
npm start
```

4. Healthcheck:

```text
http://localhost:8788/health
```

### Endpoints del backend

- `POST /auth/login` body: `{ "role": "viewer" }` o `{ "role": "staff", "password": "..." }`
- `GET /api/state` (Bearer token)
- `PUT /api/state` (Bearer token Staff) body: `{ "state": { ... } }`

### Deploy recomendado (internet)

1. Frontend en Netlify.
2. Backend en Render o Railway apuntando a `backend/`.
3. Variables de entorno en backend:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `CORS_ORIGIN` (tu dominio de Netlify)
   - `STAFF_PASSWORD`
4. En la app desplegada, abre la sección "Lista de miembros" y configura `API NC Proxy` con la URL pública del backend/proxy real, por ejemplo:
   - `https://tu-backend-production.onrender.com`
   - `https://tu-proxy-production.up.railway.app`

No uses `http://localhost:8787` en Netlify: ese puerto solo existe en tu máquina local. La app ya no fuerza esa URL por defecto en producción.

Con eso ya tienes una arquitectura funcional de app real (frontend + backend + BD).

### Endpoints del proxy

- `GET /health`
- `GET /api/nc/search?name=Nombre[&region=la]`
- `GET /api/nc/resolve?name=Nombre`
- `GET /api/nc/profile?region=la&serverId=1401&characterId=Nombre`

## Nota

Si quieres, después puedes pasar fotos o nombres reales y lo ajusto para que se vea más parecido al estilo final que quieres.
