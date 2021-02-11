import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import handleResponse from '../helpers/handleResponse';

dotenv.config();

const ensureToken = (req, res, next) => {
  const token = req.body.token || req.params.token || req.headers.authorization;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        handleResponse(res, 401, 'Invalid token.');
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    handleResponse(res, 401, 'Access Token Not Provided. Please Sign In');
  }
};

export default ensureToken;