const jwt = require("jsonwebtoken");

const sign = process.env.JWT_SECRET;

if (!sign) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

export const generate = (data: object) => {
  return jwt.sign(data, sign, { expiresIn: '30d' });
};

export const verify = (token: string) => {
  return jwt.verify(token, sign);
};