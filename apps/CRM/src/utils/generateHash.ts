import crypto from 'node:crypto';

export function generateHash(valor: string): string {
  const fecha = new Date().getTime();
  let dataToHash: string;

  if (valor) {
    dataToHash = valor.toString() + fecha.toString();
  } else {
    dataToHash = fecha.toString() + fecha.toString();
  }

  // Create a SHA256 hash of the data
  const hash = crypto.createHash('sha256').update(dataToHash).digest('hex');
  
  // Return the first 6 characters of the hash
  return hash.slice(0, 6);
}