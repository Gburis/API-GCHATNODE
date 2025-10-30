const Users = require("./../../model/users");

const Validacao = {
  cadastrarUsuario : async (dados) => {
    try {
  
      if(!dados) throw `Input de dados não informado`;
  
      const required = ['nome', 'email', 'password'];
      const isNotExist = required.filter(input => !dados[input]);
      if(isNotExist.length > 0) throw `Campos obrigatórios (${isNotExist.join(',')}) não preenchidos`;

      //Validar se já existe usuário com o mesmo e-mail
      const exists = !!(await Users.find({email: dados.email}).limit(1).cursor().next());

      if(exists) throw 'E-mail já em uso tente recuperar a senha';
  
      if(dados.password.length < 8 || dados.password.length > 20) throw `Quantidade de caracteres para o password deve ser entre 8 e 20`;
  
      return dados;
    } catch (error) {
      throw error;
    }
  },
  authenticate: (dados) =>{
    try {
      if(!dados) throw `Input de dados não informado`;
  
      const required = ['email', 'password'];
      const isNotExist = required.filter(input => !dados[input]);
      if(isNotExist.length > 0) throw `Campos obrigatórios (${isNotExist.join(',')}) não preenchidos`;

      return dados
    } catch (error) {
      throw error; 
    }
  }
}

module.exports = Validacao;