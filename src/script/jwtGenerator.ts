import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config()

const payload = {
  email: "teste@gmail.com",
  name: "John Doe"
};

const secretKey = process.env.JWT_SECRET; 

if(!secretKey){
    console.log("secret key not found")
}
else{
const options = {
    expiresIn: '1h'
  };
  
  const token = jwt.sign(payload, secretKey, options);
  
  const decoded = jwt.verify(token, secretKey) as { email: string };
  
  console.log("JWT Gerado:", token, decoded.email);
}

