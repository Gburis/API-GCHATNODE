const Controller = require('./controllers');

module.exports = (express) => {
  const api = express.Router();

  api.post('/authenticate', Controller.authenticate);

  api.post('/cadastrar', Controller.cadastrarUsuario);

  api.post('/entrar-com-google', Controller.entrarComGoogle);

  return api;
};