# Create Pokemon Endpoint Plan

## Goal

Add a Postman-friendly backend endpoint to create Pokemon in Firestore, validating the request body with Zod before writing data.

## Proposed Endpoint

- Method: `POST`
- Path: `/api/pokemon`
- Body:
  - `name`: string
  - `type`: string
  - `diet`: string
  - `region`: string
  - `status`: optional Pokemon status, default `available`
  - `imageUrl`: optional URL string

## Implementation Steps

1. Install `zod` in the backend dependencies.
2. Add a Zod schema close to the route in `src/routes/pokemonV2.ts`.
3. Add `POST /api/pokemon` that:
   - Parses `req.body` with Zod.
   - Returns `400` with validation details when invalid.
   - Creates a Firestore document in `pokemons`.
   - Stores the generated document id in the Pokemon data.
   - Returns `201` with the created Pokemon.
4. Run TypeScript build and lints/diagnostics for touched files.

## Open Questions

1. Should the client send `id`, or should Firestore generate it?
   * Firestore should generate it
2. Should `status` always default to `available`, or should Postman be allowed to set it?
   * default available
3. Should `hp`, `attack`, and `defense` be required now, or optional for backwards compatibility with existing data?
   * Not required or optional 
