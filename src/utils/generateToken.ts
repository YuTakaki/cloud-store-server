import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export default (user_id : string) => {
  try {
    const payload = {
      user_id
    }

    return jwt.sign(payload, process.env.JWT_SECRET!)
    
  } catch (error) {
    console.log(error);
    
  }
}