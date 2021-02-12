import { Storage } from '@google-cloud/storage';
import admin from 'firebase-admin';
import dotenv from 'dotenv';
import {client} from '../services/db';
import handleResponse from '../helpers/handleResponse';
import { ObjectId } from 'mongodb';
import sendMail from '../helpers/sendMail';
import sendText from '../helpers/sendText';
const config = require("../config").config;

dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert(config),
  storageBucket: process.env.GC_STORAGE_BUCKET_URL
});

const bucket = admin.storage().bucket();

const products = {
  add: (req, res) => {
    const { name, location } = req.body;
    if (!req.file) {
      return handleResponse(res, 400, 'No image file uploaded.');
    }
    const decoded = req.decoded.data;
    const blob = bucket.file(req.file.originalname);
    const blobWriter = blob.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    blobWriter.on('error', (err) => {
      console.log(err)
      handleResponse(res, 400, 'Error uploading image file.')});
    blobWriter.on('finish', () => {
      const imgUrl = `https://firebasestorage.googleapis.com/v0/b/${
        bucket.name
      }/o/${encodeURI(blob.name)}?alt=media`;
      client.connect(async (err, client2) => {
        if (err) {
          return handleResponse(res, 500, 'Error Connecting to Database!');
        } else {
          const products = client2.db("productsManager").collection("products");
          const response = await products.insertOne({
            name, image: imgUrl, location, userName: decoded.name, userEmail:decoded.email
          });
          if (response.result.n === 1) {
            return handleResponse(res, 201, 'product added', {name, image: imgUrl, location, userName: decoded.name, userEmail: decoded.email });
          } else {
            return handleResponse(res, 500, 'Error adding product');
          }
        }
      });
    });
    blobWriter.end(req.file.buffer);
  },

  getByLocation: (req, res) => {
    const location = req.params.location;
    client.connect(async (err, client2) => {
      if (err) {
        return handleResponse(res, 500, 'Error Connecting to Database!');
      } else {
        const products = client2.db("productsManager").collection("products");
        const response = await products.find({
          location
        }).toArray();
        if (response) {
          return handleResponse(res, 200, 'products loaded', response);
        } else {
          return handleResponse(res, 404, 'No product found for the supplied location!');
        }
      }
    });
  },

  addComment: (req, res) => {
    const productId = req.body.productId || req.params.productId;
    const {commentBody} = req.body;
    const decoded = req.decoded.data;
    client.connect(async (err, client2) => {
      if (err) {
        return handleResponse(res, 500, 'Error Connecting to Database!');
      } else {
        const products = client2.db("productsManager").collection("products");
        const response = await products.findOne({
          _id: ObjectId(productId)
        });
        if (response) {
          const newComment = {
            body: commentBody,
            giver: {
              name: decoded.name,
              email: decoded.email,
              phone: decoded.phone
            },
            _id: Date.now().toString()
          }
          const newComments = response.comments ? [...response.comments, newComment]: [newComment];
          const updated = await products.updateOne({
            _id: ObjectId(productId)
          }, {$set: {comments: newComments}});
          if (updated.result.n === 1) {
            response.comments = newComments;
            return handleResponse(res, 201, 'Comment added', response);
          } else {
            return handleResponse(res, 500, 'Error adding comment');
          }
        } else {
          return handleResponse(res, 404, 'No product with the supplied details found!');
        }
      }
    });
  },

  replyComment: (req, res) => {
    const productId = req.body.productId || req.params.productId;
    const commentId = req.body.commentId || req.params.commentId;
    const {replyBody} = req.body;
    const decoded = req.decoded.data;
    client.connect(async (err, client2) => {
      if (err) {
        return handleResponse(res, 500, 'Error Connecting to Database!');
      } else {
        const products = client2.db("productsManager").collection("products");
        const response = await products.findOne({
          _id: ObjectId(productId)
        });
        if (response) {
          const comment = response.comments.find((comment) => comment._id === commentId);
          if (comment) {
            const newReply = {
              body: replyBody,
              giver: {
                name: decoded.name,
                email: decoded.email,
                phone: decoded.phone
              },
              _id: Date.now().toString()
            }
            const newCommentReplys = comment.replies ? [...comment.replies, newReply]: [newReply];
            comment.replies = newCommentReplys;
            const comments = response.comments.map((comm) => {
              if (comm._id === commentId) {
                return comment;
              } else {
                return comm;
              }
            });
            const updated = await products.updateOne({
              _id: ObjectId(productId)
            }, {$set: {comments}});
            if (updated.result.n === 1) {
              response.comments = comments;
              try {
                sendMail({
                  from: 'Product Management App',
                  to: comment.email,
                  subject: 'Comment Replied',
                  text: `Your comment has being replied`,
                  html: `<h3>
                          You comment has being replied by ${decoded.name}.
                          ${replyBody}
                        </h3>`
                });
              } catch (error) {
                console.log('Error sending reply mail notification')
              }
              try {
                const payload = {
                  to: decoded.phone,
                  from: 'Product Management App',
                  message: `Howdy, Your comment has being replied by ${decoded.name}.`
                };
                sendText(payload);
              } catch (error) {
                console.log('Error sending reply sms notification');
              }  
              return handleResponse(res, 201, 'Reply added', response);
            } else {
              return handleResponse(res, 500, 'Error adding Reply');
            }
          } else {
            return handleResponse(res, 404, 'No product comment with the supplied details found!');
          }
        } else {
          return handleResponse(res, 404, 'No product with the supplied details found!');
        }
      }
    });
  },

};

export default products;