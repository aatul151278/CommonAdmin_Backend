
import * as bcrypt from 'bcrypt';

const EncryptString = async (plaintext: string): Promise<string> => {
    return new Promise(async (resolve) => {
        return resolve(await bcrypt.hash(plaintext, parseInt(process.env.Bcrypt_saltRrounds)));
    });
};

const DecryptString = async (plaintext: string, hashtext: string): Promise<string> => {
    return new Promise(async (resolve) => {
        return resolve(await bcrypt.compare(plaintext, hashtext));
    });
};

export default { EncryptString, DecryptString };