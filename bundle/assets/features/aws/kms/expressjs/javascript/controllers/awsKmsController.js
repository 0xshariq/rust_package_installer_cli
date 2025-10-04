import { encryptData, decryptData, listKeys } from "../utils/awsKms.js";

export async function getKeys(req, res) {
  try {
    const data = await listKeys();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function encrypt(req, res) {
  try {
    const { keyId, plaintext } = req.body;
    const data = await encryptData(keyId, plaintext);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function decrypt(req, res) {
  try {
    const { ciphertext } = req.body;
    const data = await decryptData(ciphertext);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
