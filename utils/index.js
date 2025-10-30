const crypto = require('crypto-js');
const jwt = require('jsonwebtoken');
const config = require('./../config');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(config.google_id_client);

const Utils = {
  encrypt:(string) =>{
    return crypto.AES.encrypt(string, config.secretKey).toString();
  },
  decrypt:(encryptedString) =>{
    const  bytes  = crypto.AES.decrypt(encryptedString, config.secretKey);
    return bytes.toString(crypto.enc.Utf8);
  },
  tokenSign: (dados) =>{
    try {
      return jwt.sign(dados, config.secretKey, { expiresIn: '1h' });
    } catch (error) {
      throw error
    }
  },
  tokenVerify:(req, res, next)=>{
    try {
      const token = req.headers['token'];
    
      if (!token) {
        console.log('Token de autenticação não fornecido');
        return res.status(401).json({ message: 'Token de autenticação não fornecido' });
      }
    
      jwt.verify(token, config.secretKey, (err, decoded) => {
        if (err) {
          console.log('Falha ao autenticar o token');
          return res.status(403).json({ message: 'Falha ao autenticar o token' });
        }
    
        req.user = decoded;
        next();
      });
    } catch (error) {
      console.error('Erro ao verificar o token:', error);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  },
  verifyGoogleIdToken: async (idToken) => {
    const ticket = await client.verifyIdToken({ idToken, audience: config.google_id_client });
    return ticket.getPayload(); 
  }
};

module.exports = Utils;