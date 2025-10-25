import { kv } from '@vercel/kv';
import { Credentials } from '@/types/pipeline';
import { STORAGE_KEYS } from '@/utils/constants';

// For development/testing without Vercel KV
const localStore = new Map<string, string>();

function isVercelKVAvailable(): boolean {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

export async function saveCredentials(
  userId: string,
  credentials: Credentials
): Promise<void> {
  const key = `${STORAGE_KEYS.CREDENTIALS}:${userId}`;
  const value = JSON.stringify(credentials);

  if (isVercelKVAvailable()) {
    await kv.set(key, value);
  } else {
    // Fallback to local storage for development
    localStore.set(key, value);
  }
}

export async function getCredentials(
  userId: string
): Promise<Credentials | null> {
  const key = `${STORAGE_KEYS.CREDENTIALS}:${userId}`;

  if (isVercelKVAvailable()) {
    const value = await kv.get<string>(key);
    return value ? JSON.parse(value) : null;
  } else {
    const value = localStore.get(key);
    return value ? JSON.parse(value) : null;
  }
}

export async function saveLastSyncTimestamp(
  userId: string,
  timestamp: string
): Promise<void> {
  const key = `${STORAGE_KEYS.LAST_SYNC}:${userId}`;

  if (isVercelKVAvailable()) {
    await kv.set(key, timestamp);
  } else {
    localStore.set(key, timestamp);
  }
}

export async function getLastSyncTimestamp(
  userId: string
): Promise<string | null> {
  const key = `${STORAGE_KEYS.LAST_SYNC}:${userId}`;

  if (isVercelKVAvailable()) {
    return await kv.get<string>(key);
  } else {
    return localStore.get(key) || null;
  }
}

export async function deleteCredentials(userId: string): Promise<void> {
  const key = `${STORAGE_KEYS.CREDENTIALS}:${userId}`;

  if (isVercelKVAvailable()) {
    await kv.del(key);
  } else {
    localStore.delete(key);
  }
}