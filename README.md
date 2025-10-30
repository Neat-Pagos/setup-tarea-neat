# Pokemon Adoption System Backend

Backend API desarrollado con Express, TypeScript y Firebase para un sistema de adopción de Pokémon.

## 🚀 Características

- API REST con Express y TypeScript
- Integración con Firebase/Firestore
- Listeners en tiempo real para cambios de estado de Pokémon
- Sistema de adopción de Pokémon
- Seed de datos para Pokémon iniciales
- CORS habilitado para desarrollo frontend

## 📋 Requisitos Previos

- Node.js v18 o superior
- Yarn o npm
- Cuenta de Firebase con Firestore habilitado
- Archivo de credenciales de Firebase (`firebase-service-account.json`)

## 🛠️ Configuración

### 1. Instalar dependencias

```bash
yarn install
# o
npm install
```

### 2. Configurar Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto o usa uno existente
3. Ve a "Project Settings" > "Service accounts"
4. Genera una nueva clave privada
5. Guarda el archivo JSON como `firebase-service-account.json` en la raíz del proyecto

**⚠️ IMPORTANTE**: Este archivo está en `.gitignore` y NO debe subirse al repositorio por seguridad.

### 3. Variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
PORT=3001
```

### 4. Configurar Firestore

1. En Firebase Console, ve a "Firestore Database"
2. Crea la base de datos en modo de producción
3. Configura las reglas según tus necesidades

## 🚦 Uso

### Desarrollo

```bash
yarn dev
# o
npm run dev
```

El servidor se ejecutará en `http://localhost:3001`

### Compilar y producción

```bash
# Compilar TypeScript
yarn build

# Ejecutar en producción
yarn start
```

### Seed de datos

Para poblar la base de datos con Pokémon iniciales:

```bash
yarn seed
# o
npm run seed
```

## 📡 Endpoints API

### Pokémon

- `GET /api/pokemon` - Obtener todos los Pokémon
- `GET /api/pokemon/adoptable-pokemons` - Obtener Pokémon disponibles para adopción

### Adopciones

**Crear adopciones:**
- `POST /api/adoptions` - Crear una nueva adopción (versión básica)
- `POST /api/adoptions/v2` - Crear una nueva solicitud de adopción (versión mejorada con validación)

**Consultar adopciones:**
- `GET /api/adoptions/adoptable-pokemons` - Listar todos los Pokémon adoptables
- `GET /api/adoptions/review` - Obtener adopciones pendientes de revisión (para staff)

**Gestión de adopciones:**
- `PUT /api/adoptions/manage/:id/approve` - Aprobar una adopción
- `PUT /api/adoptions/manage/:id/reject` - Rechazar una adopción

**Gestión de entregas:**
- `PUT /api/adoptions/delivery/:id/delivered` - Marcar como entregado
- `PUT /api/adoptions/delivery/:id/comment` - Agregar comentario de entrega fallida
- `PUT /api/adoptions/delivery/:id/security-concern` - Marcar preocupación de seguridad

## 🎯 Estructura del Proyecto

```
├── src/
│   ├── config/
│   │   └── firebase.ts          # Configuración de Firebase
│   ├── helpers/
│   │   └── getPokemons.ts       # Helper para obtener Pokémon desde Firestore
│   ├── listeners/
│   │   └── pokemonListener.ts   # Listener en tiempo real para cambios de estado
│   ├── models/
│   │   ├── Pokemon.ts           # Modelo y tipos de Pokémon
│   │   └── Adoption.ts          # Modelo y tipos de Adopción
│   ├── routes/
│   │   ├── pokemonV1.ts         # Rutas de Pokémon (versión 1)
│   │   ├── pokemonV2.ts         # Rutas de Pokémon (versión 2, actual)
│   │   └── adoptions.ts         # Rutas de adopciones
│   ├── seeds/
│   │   └── pokemon-seed.ts      # Seed de datos de Pokémon
│   └── index.ts                 # Punto de entrada de la aplicación
├── firebase-service-account.json # Credenciales (no incluir en git)
├── .env                         # Variables de entorno (no incluir en git)
├── package.json
├── tsconfig.json
└── README.md
```

## 📊 Modelo de Datos

### Pokemon

```typescript
interface Pokemon {
  id: string;
  name: string;
  imageUrl?: string;
  status: PokemonStatus;
  type: string;
  diet: string;
  region: string;
}

enum PokemonStatus {
  AVAILABLE = 'available',
  PREPARED = 'prepared',
  DELIVERED = 'delivered',
  DELIVERED_ERROR = 'delivered_error'
}
```

### Estados de Pokémon

- `available` - Disponible para adopción
- `prepared` - Preparado para entrega
- `delivered` - Entregado exitosamente
- `delivered_error` - Error en la entrega

### Adoption

```typescript
interface Adoption {
  id: string;
  pokemonId: string;
  userData: UserData;
  status: AdoptionStatus;
  createdAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  rejectionReason?: string;
  approvalDate?: Date;
  deliveryComment?: string;
  securityConcern?: boolean;
  securityComment?: string;
  updatedAt: Date;
}

interface UserData {
  name: string;
  email: string;
  phone: string;
  region: string;
  idNumber: string;
}

enum AdoptionStatus {
  PENDING = 'pending',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  DELIVERED = 'delivered',
  DELIVERY_FAILED = 'delivery_failed',
  SECURITY_CONCERN = 'security_concern'
}
```

### Estados de Adopción

- `pending` - Pendiente
- `under_review` - En revisión
- `approved` - Aprobada
- `rejected` - Rechazada
- `delivered` - Entregada
- `delivery_failed` - Entrega fallida
- `security_concern` - Preocupación de seguridad

## 🔄 Sistema de Listener

El proyecto incluye un listener de Firebase que detecta cambios en tiempo real en la colección de adopciones:

- El listener monitorea todos los cambios en la colección `adoptions`
- Cuando una adopción es actualizada al estado `approved`, automáticamente actualiza el estado del Pokémon asociado a `prepared`
- Este listener se activa automáticamente al iniciar el servidor
- Utiliza `onSnapshot` de Firestore para mantener una conexión en tiempo real
- La actualización del estado del Pokémon se realiza de forma automática sin intervención manual

## 🛠️ Scripts Disponibles

- `yarn dev` - Ejecutar servidor en modo desarrollo con hot-reload
- `yarn build` - Compilar TypeScript a JavaScript
- `yarn start` - Ejecutar servidor en modo producción
- `yarn seed` - Ejecutar script de seed de datos

## 🔒 Seguridad

- El archivo `firebase-service-account.json` NO debe subirse al repositorio (incluido en `.gitignore`)
- El archivo `.env` NO debe subirse al repositorio (incluido en `.gitignore`)
- Las variables sensibles deben ir en `.env`
- El endpoint `/api/adoptions/v2` valida que los datos mínimos requeridos estén presentes antes de crear una adopción
- Las adopciones con información incompleta se crean automáticamente en estado `rejected` sin notificar al usuario

## 📦 Tecnologías

- **Express** - Framework web para Node.js
- **TypeScript** - Tipado estático para JavaScript
- **Firebase Admin SDK** - SDK para servicios de Firebase (Firestore)
- **CORS** - Soporte para Cross-Origin Resource Sharing
- **dotenv** - Gestión de variables de entorno
- **Nodemon** - Hot-reload automático en desarrollo
- **tsx** - Ejecución directa de archivos TypeScript sin compilación previa

## 🎨 Características Adicionales

- **Versiones de API**: Soporte para múltiples versiones de endpoints (V1 y V2)
- **Helper Functions**: Funciones auxiliares para reutilización de código (`getPokemons`)
- **Validación de Datos**: Validación de información mínima requerida en adopciones
- **Gestión de Estados**: Sistema completo de estados para adopciones con workflow de revisión
- **Endpoints de Staff**: Endpoints dedicados para la gestión y revisión de adopciones por parte del staff

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto es privado y pertenece a Neat Pagos.
