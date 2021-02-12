import { Router } from 'express';
import multer from 'multer';
import userController from './controllers/users';
import productsController from './controllers/products';
import Validator from './middlewares/validator';
import ensureToken from './middlewares/ensureToken';

const uploader = multer({
  storage: multer.memoryStorage(),
  limits: {
      fileSize: 5 * 1024 * 1024,
  },
});

const validator = new Validator();

const Route = Router();

Route.post('/user/signup', validator.user, userController.signup);

Route.post('/user/signin', userController.login);

Route.post('/product', ensureToken, uploader.single('image'), validator.product, productsController.add);

Route.get('/products/:location', ensureToken, productsController.getByLocation);

Route.put('/product/:productId/comment', ensureToken, validator.productId, validator.comment, productsController.addComment);

Route.put('/product/:productId/:commentId/reply', ensureToken, 
  validator.productId, validator.commentId, validator.comment, productsController.replyComment);

export default Route;