const ALPHABET = 'abcdefghijklmnopqrstuvwxyz0123456789';

// 10-char base36 id, sufficient for client-side note uniqueness
export function shortId(): string {
  let out = '';
  for (let i = 0; i < 10; i++) {
    out += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return out;
}
