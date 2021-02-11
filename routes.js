import { Router } from 'express';
import userController from './controllers/users';
import productsController from './controllers/products';
import Validator from './middlewares/validator';
import ensureToken from './middlewares/ensureToken';

const validator = new Validator();

const Route = Router();

Route.post('/user/signup', validator.user, userController.signup);

Route.post('/user/signin', userController.login);

Route.post('/product', ensureToken, validator.product, productsController.add);

Route.get('/products/:location', ensureToken, productsController.getByLocation);

Route.put('/product/:productId/comment', ensureToken, validator.productId, validator.comment, productsController.addComment);

Route.put('/product/:productId/:commentId/reply', ensureToken, 
  validator.productId, validator.commentId, validator.comment, productsController.replyComment);

export default Route;