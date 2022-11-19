import jwt from 'jsonwebtoken'
const jwtSecretKey = process.env.JWT_SECRET_KEY;

const generateJWTToken = async (jsonData: any) => {
    return await jwt.sign(jsonData, jwtSecretKey, { expiresIn: '24h' });
}

const verifyJWTToken = async (token: any) => {
    try {
        await jwt.verify(token, jwtSecretKey);
        return true;
    } catch {
        return false;
    }
}

const decodeJWTToken = async (token: any) => {
    return await jwt.decode(token, jwtSecretKey);
}

export default { generateJWTToken, verifyJWTToken, decodeJWTToken }