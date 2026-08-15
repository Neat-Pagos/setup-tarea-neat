import { db } from '../config/firebase.js';
import { Adoption, AdoptionStatus } from '../models/Adoption.js';
import { PokemonStatus } from '../models/Pokemon.js';

const pokemonStatusByAdoptionStatus: Record<AdoptionStatus, PokemonStatus> = {
  [AdoptionStatus.PENDING]: PokemonStatus.AVAILABLE,
  [AdoptionStatus.UNDER_REVIEW]: PokemonStatus.AVAILABLE,
  [AdoptionStatus.APPROVED]: PokemonStatus.PREPARED,
  [AdoptionStatus.REJECTED]: PokemonStatus.AVAILABLE,
  [AdoptionStatus.DELIVERED]: PokemonStatus.DELIVERED,
  [AdoptionStatus.DELIVERY_FAILED]: PokemonStatus.DELIVERED_ERROR,
  [AdoptionStatus.SECURITY_CONCERN]: PokemonStatus.DELIVERED_ERROR
};

const fixSeed = async (): Promise<void> => {
  const adoptionsSnapshot = await db.collection('adoptions').get();

  if (adoptionsSnapshot.empty) {
    console.log('No adoptions found. Nothing to fix.');
    return;
  }

  let updated = 0;
  let skipped = 0;
  let batch = db.batch();
  let operationsInBatch = 0;

  for (const adoptionDoc of adoptionsSnapshot.docs) {
    const adoption = adoptionDoc.data() as Adoption;
    const pokemonStatus = pokemonStatusByAdoptionStatus[adoption.status];

    if (!adoption.pokemonId || !pokemonStatus) {
      console.warn(`Skipping adoption ${adoptionDoc.id}: invalid pokemon or adoption status.`);
      skipped += 1;
      continue;
    }

    const pokemonRef = db.collection('pokemons').doc(adoption.pokemonId);
    const pokemonSnapshot = await pokemonRef.get();

    if (!pokemonSnapshot.exists) {
      console.warn(`Skipping adoption ${adoptionDoc.id}: Pokemon ${adoption.pokemonId} does not exist.`);
      skipped += 1;
      continue;
    }

    batch.update(pokemonRef, {
      status: pokemonStatus,
      updatedAt: new Date()
    });
    operationsInBatch += 1;
    updated += 1;

    if (operationsInBatch === 500) {
      await batch.commit();
      batch = db.batch();
      operationsInBatch = 0;
    }
  }

  if (operationsInBatch > 0) {
    await batch.commit();
  }

  console.log(`Seed fixed successfully. Updated ${updated} Pokemon; skipped ${skipped}.`);
};

fixSeed()
  .then(() => process.exit(0))
  .catch((error: unknown) => {
    console.error('Error fixing seed data:', error);
    process.exit(1);
  });
