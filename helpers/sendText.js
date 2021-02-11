import dotenv from 'dotenv';
import jusibe from 'jusibe';

dotenv.config();

const sendText = (payload) => {
  const Jusibe = new jusibe(process.env.PUBLIC_KEY, process.env.ACCESS_TOKEN);
  Jusibe.sendSMS(payload);
};

export default sendText;