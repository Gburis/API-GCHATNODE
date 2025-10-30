const mongoose = require('mongoose');
const schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const userSchema = new schema({ 
    nome: {type: String, required: true},
    dt_aniversario: {type: Date, required: false},
    email: {type: String, required: true},
    password: {type: String, required: () => { return !this.googleSub; }},
    dt_cadastro: {type: Date, required: false},
    sexo: {type: String, required: false},
    foto_perfil: {type: String, required: false},
    perfil: {type: String, required: true},
    ultimo_login: {type: Date, required: false},
    googleSub: { type: String, index: true, sparse: true, unique: false },
});

userSchema.pre('save', function(next){
    this.password = bcrypt.hashSync(this.password, 10);
    next();
})  

userSchema.methods.comparePassword = async function(password) {
    return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('user_gchat', userSchema);    