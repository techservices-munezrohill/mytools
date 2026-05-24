// Sprint 3 will activate this module for encrypting user contact info
// (email / phone) per PRD §5.5.3. Included now so the interface is locked
// and the env var is documented from Sprint 1.
//
// Usage (once wired):
//   const key = await getContactKey();
//   const ciphertext = await encryptContact(key, 'user@example.com');
//   const plaintext  = await decryptContact(key, ciphertext);
//
// Security notes:
// - Key material MUST come from CONTACT_ENCRYPTION_KEY (32-byte base64), stored
//   in the hosting provider's secrets manager (Supabase Vault, Vercel env).
// - Never log plaintext, never log the key. Never check the key into git.
// - Rotate annually. The rotation migration will use a version byte prefix on
//   ciphertext so old and new keys can coexist during a rollout.

const GCM_IV_BYTES = 12;
const KEY_BYTES = 32;

function getSubtle(): SubtleCrypto {
  if (typeof globalThis === 'undefined' || !globalThis.crypto?.subtle) {
    throw new Error('Web Crypto is not available in this runtime.');
  }
  return globalThis.crypto.subtle;
}

function base64ToBytes(base64: string): Uint8Array {
  const bin = atob(base64);
  const buffer = new ArrayBuffer(bin.length);
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bin.length; i += 1) {
    bytes[i] = bin.charCodeAt(i);
  }
  return bytes;
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export async function getContactKey(): Promise<CryptoKey> {
  const raw = process.env.CONTACT_ENCRYPTION_KEY;
  if (!raw) {
    throw new Error('CONTACT_ENCRYPTION_KEY is not configured.');
  }

  const keyBytes = base64ToBytes(raw);
  if (keyBytes.length !== KEY_BYTES) {
    throw new Error(
      `CONTACT_ENCRYPTION_KEY must decode to ${KEY_BYTES} bytes (got ${keyBytes.length}).`,
    );
  }

  return getSubtle().importKey(
    'raw',
    keyBytes as unknown as ArrayBuffer,
    'AES-GCM',
    false,
    ['encrypt', 'decrypt'],
  );
}

export async function encryptContact(key: CryptoKey, plaintext: string): Promise<string> {
  const iv = new Uint8Array(new ArrayBuffer(GCM_IV_BYTES));
  globalThis.crypto.getRandomValues(iv);
  const data = new TextEncoder().encode(plaintext);
  const ciphertext = new Uint8Array(
    await getSubtle().encrypt(
      { name: 'AES-GCM', iv: iv as unknown as ArrayBuffer },
      key,
      data as unknown as ArrayBuffer,
    ),
  );

  const out = new Uint8Array(iv.length + ciphertext.length);
  out.set(iv, 0);
  out.set(ciphertext, iv.length);
  return bytesToBase64(out);
}

export async function decryptContact(key: CryptoKey, envelope: string): Promise<string> {
  const bytes = base64ToBytes(envelope);
  const iv = bytes.slice(0, GCM_IV_BYTES);
  const ciphertext = bytes.slice(GCM_IV_BYTES);
  const plain = await getSubtle().decrypt(
    { name: 'AES-GCM', iv: iv as unknown as ArrayBuffer },
    key,
    ciphertext as unknown as ArrayBuffer,
  );
  return new TextDecoder().decode(plain);
}
