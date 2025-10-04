import { KMSClient, EncryptCommand, DecryptCommand, ListKeysCommand } from "@aws-sdk/client-kms";

const client = new KMSClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function encryptData(keyId, plaintext) {
  const command = new EncryptCommand({ KeyId: keyId, Plaintext: Buffer.from(plaintext) });
  const response = await client.send(command);
  return { ciphertext: response.CiphertextBlob?.toString("base64") };
}

export async function decryptData(ciphertext) {
  const command = new DecryptCommand({ CiphertextBlob: Buffer.from(ciphertext, "base64") });
  const response = await client.send(command);
  return { plaintext: response.Plaintext?.toString() };
}

export async function listKeys() {
  const command = new ListKeysCommand({});
  return await client.send(command);
}
