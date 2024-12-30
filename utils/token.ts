import jwkToPem from "jwk-to-pem";
import jwt from "jsonwebtoken";

export const parseToken = (token: string) => {
    const pem = jwkToPem(JSON.parse(process.env.CLERK_PUBLIC_KEY as string) as any);
    const decoded = jwt.verify(token, pem, {
        algorithms: ["RS256"]
    });

    return {
        userId: decoded.sub,
    }
}