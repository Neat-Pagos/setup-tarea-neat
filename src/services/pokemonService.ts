import { DocumentReference, Transaction } from 'firebase-admin/firestore';
import { canTransitionPokemon } from '../helpers/pokemonStateMachine.js';
import { Pokemon, PokemonStatus } from '../models/Pokemon.js';
import { InvalidStatusTransitionError, ResourceNotFoundError } from './serviceErrors.js';

export const transitionPokemonStatus = async (
  transaction: Transaction,
  pokemonRef: DocumentReference,
  nextStatus: PokemonStatus,
  updatedAt: Date
): Promise<void> => {
  const snapshot = await transaction.get(pokemonRef);

  if (!snapshot.exists) {
    throw new ResourceNotFoundError('Pokemon', pokemonRef.id);
  }

  const currentStatus = snapshot.data()?.status as Pokemon['status'];

  if (!canTransitionPokemon(currentStatus, nextStatus)) {
    throw new InvalidStatusTransitionError('Pokemon', currentStatus, nextStatus);
  }

  transaction.update(pokemonRef, {
    status: nextStatus,
    updatedAt
  });
};
