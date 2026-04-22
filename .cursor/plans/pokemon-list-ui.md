# Interfaz para ver todos los Pokémon

## Contexto

- El API ya lista todos los Pokémon en `src/routes/pokemonV2.ts` (`GET /` → `getPokemons()` sin filtro).
- El modelo de dominio está en `src/models/Pokemon.ts`: `id`, `name`, `imageUrl?`, `status`, `type`, `diet`, `region`.
- El frontend es CRA + React Router; la URL base del API es `REACT_APP_API_URL` o `http://localhost:3001/api` (`frontend/package.json` define `"proxy": "http://localhost:3001"` para desarrollo).

## Implementación realizada

1. **Tipos**: `frontend/src/types/pokemon.ts` con `PokemonStatus` y `Pokemon`; `frontend/src/types/adoption.ts` usa `pokemonData?: Pokemon` sin duplicar el modelo.

2. **Servicio**: `frontend/src/services/pokemonService.ts` — `getAll()` vía `GET ${API_URL}/pokemon`, errores como `Error`.

3. **UI**: `frontend/src/components/PokemonList.tsx` — carga, error, reintento, cuadrícula de tarjetas, badges de estado, fallback de imagen.

4. **Rutas**: `frontend/src/App.tsx` — ruta `/pokemons`; enlaces en cabeceras entre `/` y `/pokemons`.

5. **Estilos**: `frontend/src/index.css` — `.app-nav`, `.pokemon-grid`, `.pokemon-card`, meta filas, `.status-available`, `.status-prepared`, `.status-delivered`, `.status-delivered_error`.

## Notas

- Alcance: Pokémon del API/Firestore del proyecto, no la PokéAPI pública completa.
- Backend: sin cambios para listar todos.
