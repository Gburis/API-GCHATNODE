const Controller = require('./controllers')

module.exports = (express) => {
  const api = express.Router();

  api.get('/listar', Controller.listarCampanhas);

  return api;
};