import moment from 'moment-timezone';

interface ExpirationConfig {
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
}

/**
 * Get the current date and time based on the specified timezone and expiration configuration.
 *
 * @param timezone - The timezone to use (e.g., 'America/New_York').
 * @param expirationConfig - The expiration configuration (e.g., { days: 1, hours: 2 }).
 * @returns The formatted date and time string in ISO 8601 format with milliseconds and timezone.
 */

function getDateTime(timezone: string, expirationConfig?: ExpirationConfig): string {
  // Get the current date and time in the specified timezone
  let currentTime = moment.tz(timezone);

  // If expirationConfig is defined, add the duration to the current time
  if (expirationConfig) {
    currentTime = currentTime.add(expirationConfig);
  }

  // Return the formatted date and time string
  return currentTime.format("YYYY-MM-DD HH:mm:ss.SSSZ");
}


function checkExpirationTime(timezone: string, expiration?: string): boolean {
  // Get the current date and time in the specified timezone
  let currentTime = moment.tz(timezone);
  currentTime.format("YYYY-MM-DD HH:mm:ss.SSSZ");

  if (currentTime.isAfter(expiration)) {
    console.log('The expiration time has passed.');
    return false;
  }

  // Return the formatted date and time string
  return true
}

export { getDateTime, checkExpirationTime}