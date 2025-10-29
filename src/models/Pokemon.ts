export enum PokemonStatus {
  AVAILABLE = 'available',
  PREPARATION = 'preparation',
  PREPARED = 'prepared',
  DELIVERED = 'delivered',
  DELIVERED_ERROR = 'delivered_error'
}

export interface Pokemon {
  id: string;
  name: string;
  imageUrl?: string;
  status: PokemonStatus;
}

export enum PokemonNames {
  PIKACHU = 'Pikachu',
  CHARIZARD = 'Charizard',
  BLASTOISE = 'Blastoise',
  VENUSAUR = 'Venusaur',
  MEWTWO = 'Mewtwo',
}