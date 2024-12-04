import { getDateTime } from "./getDate.ts";

export default function generateOtp(): { otp: string; expirationAt: string } {
  // Generar un código OTP de 6 dígitos
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  
  const timezone = 'America/Argentina/Buenos_Aires';
  const expirationConfig = { minutes: 5 }; // Add 5 minutes
  const expirationAt = getDateTime(timezone, expirationConfig);

  return {
    otp,
    expirationAt,
  };
}
