import handleResponse from '../helpers/handleResponse';

class Validator {
  user(req, res, next) {
    const { name, address, email, password, phone } = req.body;
    if (!name || name.trim().length === 0) {
      handleResponse(res, 400, 'Name must be specified');
    } else if (!email || !email.match(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/g)) {
      handleResponse(res, 400, 'Invalid email or no email supplied');
    } else if (!address || address.trim().length === 0) {
      handleResponse(res, 400, 'Address must be specified');
    } else if (!password || password.trim() === 0) {
      handleResponse(res, 400, 'Invalid password');
    } else if (!phone || phone.trim().length !== 11) {
      handleResponse(res, 400, 'Invalid phone');
    } else {
      next();
    }
  }

  product(req, res, next) {
    const { name, image, location, userName, userEmail, phone } = req.body;
    if (!name || name.trim().length === 0) {
      handleResponse(res, 400, 'Product name must be specified');
    } else if (!location || location.trim().length === 0) {
      handleResponse(res, 400, 'Location must be specified');
    } else if (!image || image.trim() === 0) {
      handleResponse(res, 400, 'Invalid image supplied');
    } else {
      next();
    }
  }

  comment(req, res, next) {
    const commentBody = req.body.commentBody || req.body.replyBody
    if (!commentBody || commentBody.trim().length === 0) {
      handleResponse(res, 400, 'Comment must be supplied');
    } else {
      next();
    }
  }

  productId(req, res, next) {
    const productId = req.body.productId || req.params.productId;
    if (!productId || productId.trim().length === 0) {
      handleResponse(res, 400, 'Invalid productId supplied supplied');
    } else {
      next();
    }
  }

  commentId(req, res, next) {
    const commentId = req.body.commentId || req.params.commentId;
    if (!commentId || commentId.trim().length === 0) {
      handleResponse(res, 400, 'Invalid commentId supplied');
    } else {
      next();
    }
  }
}

export default Validator;
