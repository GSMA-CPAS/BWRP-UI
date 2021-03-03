'use strict';

const jsrsa = require('jsrsasign');

const parseCert = (certificate) => {
  const x509 = new jsrsa.X509();
  x509.readCertPEM(certificate);
  return {
    issuer: x509.getIssuer(),
    subject: x509.getSubject(),
    notBefore: jsrsa.zulutosec(x509.getNotBefore()),
    notAfter: jsrsa.zulutosec(x509.getNotAfter())
  };
};

const verifyCertAgainstRootCert = (certificate, rootCertificate) => {
  const x509 = new jsrsa.X509();
  x509.readCertPEM(certificate);
  const certStruct = jsrsa.ASN1HEX.getTLVbyList(x509.hex, 0, [0]);
  const algorithm = x509.getSignatureAlgorithmField();
  const signatureHex = x509.getSignatureValueHex();
  const Signature = new jsrsa.crypto.Signature({alg: algorithm});
  Signature.init(rootCertificate);
  Signature.updateHex(certStruct);
  return Signature.verify(signatureHex);
};

const createSignature = (privateKeyPem, plainText) => {
  const KEYUTIL = jsrsa.KEYUTIL;
  const key = KEYUTIL.getKey(privateKeyPem);
  const sig = new jsrsa.Signature({alg: 'SHA256withECDSA'});
  sig.init({d: key.prvKeyHex, curve: 'secp256r1'});
  sig.updateString(plainText);
  return sig.sign();
};

const verifySignature = (certificate, plainText, signature) => {
  const x509 = new jsrsa.X509();
  x509.readCertPEM(certificate);
  const key = x509.getPublicKey();
  const sig = new jsrsa.Signature({alg: 'SHA256withECDSA'});
  sig.init({xy: key.pubKeyHex, curve: 'secp256r1'});
  sig.updateString(plainText);
  return sig.verify(signature);
};

module.exports.parseCert = parseCert;
module.exports.verifyCertAgainstRootCert = verifyCertAgainstRootCert;
module.exports.createSignature = createSignature;
module.exports.verifySignature = verifySignature;
