import bcrypt from 'bcrypt'

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS)

const encrypt = async (textPplain: string): Promise<string> => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hash = await bcrypt.hash(textPplain, salt);
  return hash;
}

const compare = async (textPlain: string, hashPassword: string): Promise<boolean> => { 
  const result = await bcrypt.compare(textPlain, hashPassword);
  return result;
}

export {encrypt, compare}