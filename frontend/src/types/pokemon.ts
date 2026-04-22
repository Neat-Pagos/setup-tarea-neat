export enum PokemonStatus {
  AVAILABLE = 'available',
  PREPARED = 'prepared',
  DELIVERED = 'delivered',
  DELIVERED_ERROR = 'delivered_error',
}

export interface Pokemon {
  id: string;
  name: string;
  imageUrl?: string;
  status: PokemonStatus;
  type: string;
  diet: string;
  region: string;
}
