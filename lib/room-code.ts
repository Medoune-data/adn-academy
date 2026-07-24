// Alphabet volontairement réduit : pas de 0/O, 1/I/L, pour éviter toute
// confusion à l'oral ou à la lecture quand un code est partagé entre amis.
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

export function generateRoomCode(length = 6): string {
  return Array.from({ length }, () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)]).join("");
}
