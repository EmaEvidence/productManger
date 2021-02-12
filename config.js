import dotenv from 'dotenv';
dotenv.config();

module.exports = {
  config: {
    "type": process.env.GC_PROJECT_TYPE,
    "project_id": process.env.GC_PROJECT_ID,
    "private_key_id": process.env.GC_PRIVATE_KEY_ID,
    "private_key": process.env.GC_PRIVATE_KEY.replace(/\\n/g, '\n'),
    "client_email": process.env.GC_CLIENT_EMAIL,
    "client_id": process.env.GC_CLIENT_ID,
    "auth_uri": process.env.GC_AUTH_URI,
    "token_uri": process.env.GC_TOKEN_URI,
    "auth_provider_x509_cert_url": process.env.GC_AUTH_PROVIDER,
    "client_x509_cert_url": process.env.GC_CLIENT_CERT_URL
  }
}