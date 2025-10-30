export enum AdoptionStatus {
  PENDING = 'pending',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  DELIVERED = 'delivered',
  DELIVERY_FAILED = 'delivery_failed',
  SECURITY_CONCERN = 'security_concern'
}

export enum PokemonStatus {
  AVAILABLE = 'available',
  PREPARED = 'prepared',
  DELIVERED = 'delivered',
  DELIVERED_ERROR = 'delivered_error'
}

export interface UserData {
  name: string;
  email: string;
  phone: string;
  region: string;
  idNumber: string;
}

export interface PokemonData {
  id: string;
  name: string;
  imageUrl?: string;
  status: PokemonStatus;
  type: string;
  diet: string;
  region: string;
}

export interface Adoption {
  id: string;
  pokemonId: string;
  userData: UserData;
  status: AdoptionStatus;
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  approvalDate?: string;
  deliveryComment?: string;
  securityConcern?: boolean;
  securityComment?: string;
  updatedAt: string;
  pokemonData?: PokemonData;
}

export interface AdoptionStats {
  total: number;
  pending: number;
  under_review: number;
  approved: number;
}