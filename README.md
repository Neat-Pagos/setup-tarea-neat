# Firebase Auth Backend

Monorepo con backend Express y autenticación Firebase.

## Estructura del proyecto

```
├── apps/
│   └── backend/           # Express API server
│       ├── src/
│       │   ├── config/    # Configuración Firebase
│       │   ├── routes/    # Rutas de la API
│       │   └── index.js   # Punto de entrada
│       └── package.json
└── package.json          # Root package.json
```

## Configuración

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto o usa uno existente
3. Ve a "Project Settings" > "Service accounts"
4. Genera una nueva clave privada
5. Guarda el archivo JSON como `apps/backend/firebase-service-account.json`

### 3. Variables de entorno

Copia el archivo de ejemplo y configura las variables:

```bash
cp apps/backend/.env.example apps/backend/.env
```

Edita `apps/backend/.env`:
- `JWT_SECRET`: Una clave secreta para JWT
- `FIREBASE_DATABASE_URL`: URL de tu base de datos Firebase

### 4. Habilitar Firestore

1. En Firebase Console, ve a "Firestore Database"
2. Crea la base de datos en modo de producción
3. Configura las reglas según tus necesidades

## Uso

### Desarrollo

```bash
# Ejecutar solo el backend
npm run dev:backend

# O desde la carpeta del backend
cd apps/backend
npm run dev
```

### Endpoints disponibles

- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Login de usuario
- `GET /api/health` - Health check

### Ejemplo de uso

#### Registro
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "password123", "role": "admin"}'
```

#### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "password123"}'
```

La respuesta del login incluirá:
- `token`: JWT para autenticación
- `user`: Información del usuario (id, username, role)

## Estructura de datos

Los usuarios se almacenan en Firestore con la siguiente estructura:

```json
{
  "username": "string",
  "password": "string (hasheada)",
  "role": "string (admin|conductor|user)",
  "createdAt": "timestamp"
}
```

## Scripts disponibles

- `npm run dev` - Ejecutar backend en desarrollo
- `npm run dev:backend` - Ejecutar solo backend
- `npm run start` - Ejecutar backend en producción
- `npm run build` - Build de todos los workspaces