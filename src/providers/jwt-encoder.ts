import jwt from 'jsonwebtoken'
const jwtSecretKey = process.env.JWT_SECRET_KEY;

const generateJWTToken = (jsonData: any) => {
    return jwt.sign(jsonData, jwtSecretKey, { expiresIn: 120 });
}

const verifyJWTToken = (token: any) => {
    return jwt.verify(token, jwtSecretKey);
}

const decodeJWTToken = (token: any) => {
    return jwt.decode(token, jwtSecretKey);
}

export default { generateJWTToken, verifyJWTToken, decodeJWTToken }