import { db } from '../config/firebase.js';
import { canTransitionAdoption } from '../helpers/adoptionStateMachine.js';
import { Adoption, AdoptionStatus } from '../models/Adoption.js';
import { PokemonStatus } from '../models/Pokemon.js';
import { transitionPokemonStatus } from './pokemonService.js';
import { InvalidStatusTransitionError, ResourceNotFoundError } from './serviceErrors.js';

const transitionAdoption = async (
  adoptionId: string,
  nextStatus: AdoptionStatus,
  extraData: Record<string, unknown>
): Promise<void> => {
  await db.runTransaction(async transaction => {
    const adoptionRef = db.collection('adoptions').doc(adoptionId);
    const adoptionSnapshot = await transaction.get(adoptionRef);

    if (!adoptionSnapshot.exists) {
      throw new ResourceNotFoundError('Adoption', adoptionId);
    }

    const adoption = adoptionSnapshot.data() as Adoption;

    if (!canTransitionAdoption(adoption.status, nextStatus)) {
      throw new InvalidStatusTransitionError('Adoption', adoption.status, nextStatus);
    }

    const now = new Date();

    if (nextStatus === AdoptionStatus.APPROVED) {
      const pokemonRef = db.collection('pokemons').doc(adoption.pokemonId);
      await transitionPokemonStatus(transaction, pokemonRef, PokemonStatus.PREPARED, now);
    }

    transaction.update(adoptionRef, {
      status: nextStatus,
      reviewedAt: now,
      updatedAt: now,
      ...extraData
    });
  });
};

export const approveAdoption = async (
  adoptionId: string,
  approvalDate?: Date
): Promise<void> => transitionAdoption(adoptionId, AdoptionStatus.APPROVED, {
  approvalDate: approvalDate ?? new Date()
});

export const rejectAdoption = async (
  adoptionId: string,
  rejectionReason?: string
): Promise<void> => transitionAdoption(adoptionId, AdoptionStatus.REJECTED, {
  rejectionReason
});
