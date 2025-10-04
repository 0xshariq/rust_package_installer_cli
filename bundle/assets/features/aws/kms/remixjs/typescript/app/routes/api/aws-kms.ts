import { json } from "@remix-run/node";
import { KMSClient, EncryptCommand, DecryptCommand, ListKeysCommand } from "@aws-sdk/client-kms";

const client = new KMSClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const loader = async () => {
  const data = await client.send(new ListKeysCommand({}));
  return json(data);
};

export const action = async ({ request }: any) => {
  const { type, keyId, plaintext, ciphertext } = await request.json();
  let result;

  switch (type) {
    case "encrypt":
      result = await client.send(new EncryptCommand({ KeyId: keyId, Plaintext: Buffer.from(plaintext) }));
      return json({ ciphertext: result.CiphertextBlob?.toString("base64") });
    case "decrypt":
      result = await client.send(new DecryptCommand({ CiphertextBlob: Buffer.from(ciphertext, "base64") }));
      return json({ plaintext: result.Plaintext?.toString() });
    default:
      return json({ error: "Invalid type" }, { status: 400 });
  }
};
