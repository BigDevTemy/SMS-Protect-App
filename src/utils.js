import axios from "axios";
const crypto = require("../crypto");
const forge = require("node-forge");

export const postSMS = async (load) => {
  const sms = load[0];
  const payload = sms.body;

  const ENC_KEY = "bf3c199c2470cb477d907b1e0917c17b"; // set random encryption key
  const IV = "5183666c72eec9e4"; // set random initialisation vector
  // ENC_KEY and IV can be generated as crypto.randomBytes(32).toString('hex');

  // console.log("try hex rand", forge.random.getBytesSync(32).toString("hex"));

  var encrypt = (val) => {
    let cipher = crypto.createCipheriv("aes-256-cbc", ENC_KEY, IV);
    let encrypted = cipher.update(val, "utf8", "base64");
    encrypted += cipher.final("base64");
    return encrypted;
  };

  var decrypt = (encrypted) => {
    let decipher = crypto.createDecipheriv("aes-256-cbc", ENC_KEY, IV);
    let decrypted = decipher.update(encrypted, "base64", "utf8");
    return decrypted + decipher.final("utf8");
  };

  const encrypted_key = encrypt(payload);
  console.log(decrypt(encrypted_key));

  const pub2 = forge.pki.publicKeyFromPem(`-----BEGIN PUBLIC KEY-----
    MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAsf/kBdGVPGsDY8/PEo8w
    K/CIlp/vqPUqdao+1RDMlLUOeLJklMP+tWhh1MkrkEVZUwaU1TaPiv5g9xp4NJ4V
    va6fteN7LbDP53+G/yh2NDZltRXrqJXz/dTORPoZLqQ+uUtHkNwwdTVA7UKpnTuH
    4DzByqBpGLE6v9AEGg3dA9D9H6eUxPtzlLX2E0E6pDn6nGlRfG4+pU41O9V/XNLQ
    5oCiny1KxVq8blxAUR/KGjuuMSPL9hos3Oy1DATgY7KMAW/Zw8xE99CQptFe3RA+
    XS4R2Yr8AepUW1bi+wSOCTzzFUFaGVh7PEktqSAJTHTmeCi5+knIBm/v+Dh0wxqd
    Gzqn9/uVKsJxSoeMDxvk53he67p0dlrlwP1GztPhW8dkTF5ZVeC4nuj3zBeeaull
    1DIv+Bmo+dFBctnjTmd/JUgHiUfDT3jDU7nVW2vb5FV25Z4kvCgSuCok5rnQlwTX
    ZtGzBiWEXiDpnUdMswZ8PQ8kP7DbMDmHjIfcnQAPfz8DKxdcJ2lgHEWOFfVgR1s7
    kopNfJwGFRQQeRuEFRrhkPsOkZjHzq0gLWB4KTYyRALZaCJo6TeebZOoerAfPo1+
    hKrxLd7OZkzOQsc7fWRM2IRLsv0tV+OR9U+pmFQ3BMuiI5Q2Sel/fSXvbn5O660/
    ZONyC6f1hbrez6WPZjZwxksCAwEAAQ==
    -----END PUBLIC KEY-----
    `);

  const reqData = {
    key: forge.util.encode64(pub2.encrypt(ENC_KEY, "RSA-OAEP")),
    iv: forge.util.encode64(pub2.encrypt(IV, "RSA-OAEP")),
    message: encrypted_key,
  };

  const responsed = await axios
    .post(
      `https://sms-protect-backend-jhelccjf2q-ew.a.run.app/classify`,
      reqData
    )
    .catch((err) => {
      console.log("resd2 err", err);
      return { error: true };
    });

  console.log({ responsed });
  if (responsed.error) return responsed;

  console.log(responsed.data);
  if (Boolean(+responsed.data.classification)) {
    console.log("this is a spam message", responsed.data);
    // return true;
    return { ...sms, spam: true };
  }
  // console.log(responsed);
  return sms;
};
