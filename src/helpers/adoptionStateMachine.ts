import { AdoptionStatus } from '../models/Adoption.js';

export const availableTransitions: Record<AdoptionStatus, AdoptionStatus[]> = {
    [AdoptionStatus.PENDING]: [AdoptionStatus.UNDER_REVIEW, AdoptionStatus.REJECTED],
    [AdoptionStatus.UNDER_REVIEW]: [AdoptionStatus.APPROVED, AdoptionStatus.REJECTED],
    [AdoptionStatus.APPROVED]: [AdoptionStatus.DELIVERED, AdoptionStatus.DELIVERY_FAILED, AdoptionStatus.SECURITY_CONCERN],
    [AdoptionStatus.REJECTED]: [],
    [AdoptionStatus.DELIVERED]: [],
    [AdoptionStatus.DELIVERY_FAILED]: [],
    [AdoptionStatus.SECURITY_CONCERN]: []
};

export const canTransitionAdoption = (
  currentStatus: AdoptionStatus,
  nextStatus: AdoptionStatus
): boolean => availableTransitions[currentStatus]?.includes(nextStatus) ?? false;
