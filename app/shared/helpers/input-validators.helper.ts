export const MIN_PASS_LENGTH = 8;
export const VALIDATION_PASSWORD_REGEXP = `^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{${MIN_PASS_LENGTH},}$`;
