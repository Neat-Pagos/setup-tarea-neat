export enum AdoptionStatus {
  PENDING = 'pending',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  DELIVERED = 'delivered',
  DELIVERY_FAILED = 'delivery_failed',
  SECURITY_CONCERN = 'security_concern'
}

export interface UserData {
  name: string;
  email: string;
  phone: string;
  region: string;
  idNumber: string;
}

export interface Adoption {
  id: string;
  pokemonId: string;
  userData: UserData;
  status: AdoptionStatus;
  createdAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  rejectionReason?: string;
  approvalDate?: Date;
  deliveryComment?: string;
  securityConcern?: boolean;
  securityComment?: string;
  updatedAt: Date;
}
