import { Config, type Stack } from 'sst/constructs';

export function Secrets(stack: Stack) {
  const DB_CONNECTION = new Config.Secret(stack, 'DB_CONNECTION');
  const GOOGLE_CLIENT_ID = new Config.Secret(stack, 'GOOGLE_CLIENT_ID');

  return {
    DB_CONNECTION,
    GOOGLE_CLIENT_ID,
  };
}
