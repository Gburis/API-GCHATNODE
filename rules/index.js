module.exports = (express) => {
  const api = express.Router();

  const user = require('./users/routes');
  api.use('/usuarios', user(express));

  const campanhas = require('./campanhas/routes')
  api.use('/campanhas', campanhas(express));

  return api;
};