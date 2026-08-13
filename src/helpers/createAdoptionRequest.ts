import { db } from '../config/firebase.js';
import { AdoptionStatus, UserData } from '../models/Adoption.js';
import { PokemonStatus } from '../models/Pokemon.js';

export type CreateAdoptionRequestResult =
  | { success: true; adoptionId: string }
  | {
      success: false;
      reason: 'incomplete_user_data' | 'pokemon_not_found' | 'pokemon_unavailable';
    };

const requiredUserFields: (keyof UserData)[] = [
  'name',
  'email',
  'phone',
  'region',
  'idNumber'
];

export const createAdoptionRequest = async (
  pokemonId: string,
  userData: UserData
): Promise<CreateAdoptionRequestResult> => {
  const hasMinimumData = requiredUserFields.every(
    field => typeof userData[field] === 'string' && userData[field].trim() !== ''
  );

  if (!hasMinimumData) {
    return { success: false, reason: 'incomplete_user_data' };
  }

  const pokemonSnapshot = await db.collection('pokemons').doc(pokemonId).get();

  if (!pokemonSnapshot.exists) {
    return { success: false, reason: 'pokemon_not_found' };
  }

  if (pokemonSnapshot.data()?.status !== PokemonStatus.AVAILABLE) {
    return { success: false, reason: 'pokemon_unavailable' };
  }

  const docRef = db.collection('adoptions').doc();
  const now = new Date();

  await docRef.set({
    id: docRef.id,
    pokemonId,
    userData,
    status: AdoptionStatus.UNDER_REVIEW,
    createdAt: now,
    updatedAt: now
  });

  return { success: true, adoptionId: docRef.id };
};
