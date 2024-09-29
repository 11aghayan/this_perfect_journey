import { randomInt } from 'crypto';

export function generate_verification_code() {
  return randomInt(100000, 1000000).toString();
}

export function generate_random_password() {
  const variants = ['lcl', 'ucl', 'd', 's'];
  let password: string = '';

  for (let i = 0; i < 30; i++) {
    const variant = variants[randomInt(0, 4)];
    const range = variant === 's' ? [33, 47] : variant === 'd' ? [48, 58] : variant === 'ucl' ? [65, 91] : [97, 123];
    const char_code = randomInt(range[0], range[1]);
    const char = String.fromCharCode(char_code);
    password += char;
  }

  return password;
}