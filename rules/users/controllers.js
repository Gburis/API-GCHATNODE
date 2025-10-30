const Validacao = require('./validations');
const Utils = require('./../../utils');
const Users = require("./../../model/users");
const Controller = {
  cadastrarUsuario: async (req, res) => {
    try {

      const { nome, email, password } = await Validacao.cadastrarUsuario(req.body);

      const newUser = new Users({
        nome: nome,
        email: email,
        password: password,
        dt_cadastro: new Date(),
        perfil: "CLI"
      })

      await newUser.save();

      res.json({ success: true, message: 'Usuario cadastrado com sucesso' });

    } catch (error) {
      console.log(error)
      res.status(400).json({ success: false, message: error });
    }
  },

  entrarComGoogle: async (req, res) => {
    try{
      const { idToken } = req.body;
      if (!idToken) return res.status(400).json({ error: 'missing_id_token' });

      const u = await Utils.verifyGoogleIdToken(idToken);

      const user = await Users.findOneAndUpdate(
        { email: u.email },                           
        {                 
          $setOnInsert: {
            nome: u.name,
            perfil: 'CLI',
            dt_cadastro: new Date(),
            googleSub: u.sub,
            foto_perfil: u.picture || null,
            email: u.email
          },
          $set: { ultimo_login: new Date() }     
        },
        { new: true, upsert: true }
      );

      const modelToken = {
        nome: user.nome,
        id: user._id
      }

      const token = Utils.tokenSign(modelToken);

      res.json({ success: true, message: "Usuário logado com sucesso!", token: token });
    }catch(err){
      res.status(400).json({ success: false, msg: err });
    }
  },
  
  authenticate: async (req, res) => {
    try {
      const email = req.body.email;
      const password = req.body.password;

      console.log(req.body)

      const isUser = await Users.findOne({ email: email });

      if (isUser) {
        const isValidPassword = await isUser.comparePassword(password);
        if (isValidPassword) {

          const modelToken = {
            nome: isUser.nome,
            id: isUser._id
          }

          const token = Utils.tokenSign(modelToken);
          res.json({ success: true, message: "Usuário logado com sucesso!", token: token });

        } else {
          res.json({ success: false, message: "Senha incorreta" });
        }

      } else {
        res.json({ success: false, message: "Usuário não encontrado" });
      }

    } catch (error) {
      res.status(500).json({ success: false, message: "Erro Interno..." });
    }
  }
}

module.exports = Controller;