import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import {client} from '../services/db';
import handleResponse from '../helpers/handleResponse';
dotenv.config();


const users = {
  signup: (req, res) => {
    const { name, address, email, password, phone } = req.body;
    console.log(name, address, email, password)
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, (err, hash) => {
        client.connect(async (err, client2) => {
          if (!err) {
            const users = client2.db("productsManager").collection("users");
            const existingUser = await users.findOne({
              email
            });
            if (existingUser) {
              return handleResponse(res, 409, 'user with email exists already!', {});
            } else {
              const response = await users.insertOne({
                name,
                address,
                phone,
                email, password: hash
              });
              if (response.result.n === 1) {
                const token = jwt.sign({
                  exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
                  data: {name,address,phone,email}
                }, process.env.JWT_SECRET);
                return handleResponse(res, 201, 'user created', {name, address, email, phone, token});
              } else {
                return handleResponse(res, 500, 'Error Adding user');
              }
            }
            
          } else {
            return handleResponse(res, 500, 'Error Connecting to Database!');
          }
        });
      });
    });
  },

  login: (req, res) => {
    const { email, password } = req.body;
    client.connect(async (err, client2) => {
      if (err) {
        return handleResponse(res, 500, 'Error Connecting to Database!');
      } else {
        const users = client2.db("productsManager").collection("users");
        const user = await users.findOne({
          email
        });
        if (user) {
          bcrypt.compare(password, user.password, (err, resp) => {
            if (resp) {
              delete user.password
              const token = jwt.sign({
                exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
                data: {name: user.name, address: user.address, phone: user.phone, email}
              }, process.env.JWT_SECRET);
              return handleResponse(res, 200, 'Login successfully', {...user, token});
            } else {
              handleResponse(res, 400, 'Password or Email not correct');
            }
          });
        } else {
          return handleResponse(res, 404, 'No user with the supplied details');
        }
      }
    });
  },

};

export default users;