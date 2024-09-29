import { randomInt } from 'crypto';

export function generate_verification_code() {
  return randomInt(100000, 999999).toString();
}