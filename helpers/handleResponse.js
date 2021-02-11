const handleResponse = (res, statusCode, message, data = {}) => {
  return res.status(statusCode).json({
    message,
    data,
  });
};

export default handleResponse;