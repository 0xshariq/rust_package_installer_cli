import { Injectable } from "@nestjs/common";
import { KMSClient, EncryptCommand, DecryptCommand, ListKeysCommand } from "@aws-sdk/client-kms";

@Injectable()
export class AwsKmsService {
  private client = new KMSClient({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  listKeys() {
    return this.client.send(new ListKeysCommand({}));
  }

  encrypt(keyId: string, plaintext: string) {
    return this.client.send(new EncryptCommand({ KeyId: keyId, Plaintext: Buffer.from(plaintext) }));
  }

  decrypt(ciphertext: string) {
    return this.client.send(new DecryptCommand({ CiphertextBlob: Buffer.from(ciphertext, "base64") }));
  }
}
