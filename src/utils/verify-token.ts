import * as jwt from "jsonwebtoken"
import { JwksClient, SigningKey } from "jwks-rsa";

// TODO: type this response
export default function verifyToken(token: string): Promise<any> {
  if (!token) {
    return Promise.resolve()
  }

  const client = new JwksClient({
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
  });

  function getJwksClientKey(header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) {
    if (!header.kid) {
      return callback("missing kid in header")
    }

    client.getSigningKey(header.kid, function (error, key: SigningKey) {
      const signingKey = key.getPublicKey();
      callback(null, signingKey);
    });
  }

  const user = new Promise((resolve, reject) => {
    jwt.verify(
      token,
      getJwksClientKey,
      {
        audience: process.env.AUTH0_AUDIENCE,
        issuer: `https://${process.env.AUTH0_DOMAIN}/`,
        algorithms: ["RS256"]
      },
      (error, decoded: any) => {
        if (error) {
          return reject(error);
        }

        resolve(decoded.email);
      }
    );
  });

  return user
}