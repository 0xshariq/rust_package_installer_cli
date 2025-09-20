import { KMSClient, EncryptCommand, DecryptCommand, ListKeysCommand } from "@aws-sdk/client-kms";

const client = new KMSClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const encryptData = async (keyId: string, plaintext: string) => {
  const command = new EncryptCommand({ KeyId: keyId, Plaintext: Buffer.from(plaintext) });
  const response = await client.send(command);
  return { ciphertext: response.CiphertextBlob?.toString("base64") };
};

export const decryptData = async (ciphertext: string) => {
  const command = new DecryptCommand({ CiphertextBlob: Buffer.from(ciphertext, "base64") });
  const response = await client.send(command);
  return { plaintext: response.Plaintext?.toString() };
};

export const listKeys = async () => {
  const command = new ListKeysCommand({});
  return await client.send(command);
};
