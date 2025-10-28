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
GOOGLE_APPLICATION_CREDENTIALS=./firebase-service-account.json
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

- `POST /api/adoptions` - Crear una nueva adopción

## 🎯 Estructura del Proyecto

```
├── src/
│   ├── config/
│   │   └── firebase.ts          # Configuración de Firebase
│   ├── helpers/
│   │   └── getPokemons.ts       # Helper para obtener Pokémon
│   ├── listeners/
│   │   └── pokemonListener.ts   # Listener en tiempo real
│   ├── models/
│   │   └── Pokemon.ts           # Modelos y tipos
│   ├── routes/
│   │   ├── pokemon.ts           # Rutas de Pokémon
│   │   └── adoptions.ts         # Rutas de adopciones
│   ├── seeds/
│   │   └── pokemon-seed.ts      # Seed de datos
│   └── index.ts                 # Punto de entrada
├── firebase-service-account.json # Credenciales (no incluir en git)
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
}
```

### Estados de Pokémon

- `available` - Disponible para adopción
- `preparation` - En preparación
- `prepared` - Preparado
- `delivered` - Entregado
- `delivered_error` - Error en la entrega

## 🔄 Sistema de Listener

El proyecto incluye un listener de Firebase que detecta cambios en tiempo real:

- Cuando un Pokémon entra en estado `preparation`, se inicia un temporizador de 20 segundos
- Después del tiempo, el estado cambia automáticamente a `prepared`
- Este listener se activa automáticamente al iniciar el servidor

## 🛠️ Scripts Disponibles

- `yarn dev` - Ejecutar servidor en modo desarrollo con hot-reload
- `yarn build` - Compilar TypeScript a JavaScript
- `yarn start` - Ejecutar servidor en modo producción
- `yarn seed` - Ejecutar script de seed de datos

## 🔒 Seguridad

- El archivo `firebase-service-account.json` NO debe subirse al repositorio
- Está incluido en `.gitignore`
- Las variables sensibles deben ir en `.env`

## 📦 Tecnologías

- **Express** - Framework web
- **TypeScript** - Tipado estático
- **Firebase Admin** - SDK para Firebase
- **CORS** - Soporte para Cross-Origin
- **dotenv** - Variables de entorno
- **Nodemon** - Hot-reload en desarrollo
- **tsx** - Ejecución directa de TypeScript

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto es privado y pertenece a Neat Pagos.
