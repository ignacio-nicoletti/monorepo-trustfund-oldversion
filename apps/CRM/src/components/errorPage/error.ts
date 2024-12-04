export function throwCustomError(message: string, status: number) {
  const error = new Error(message);
  (error as any).status = status;

  throw error;
}
