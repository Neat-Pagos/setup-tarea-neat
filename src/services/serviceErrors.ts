export class ResourceNotFoundError extends Error {
  constructor(resource: string, id: string) {
    super(`${resource} ${id} not found`);
    this.name = 'ResourceNotFoundError';
  }
}

export class InvalidStatusTransitionError extends Error {
  constructor(resource: string, currentStatus: string, nextStatus: string) {
    super(`Invalid ${resource} status transition: ${currentStatus} -> ${nextStatus}`);
    this.name = 'InvalidStatusTransitionError';
  }
}
