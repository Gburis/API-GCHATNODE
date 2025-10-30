const mongoose = require('mongoose');
const schema = mongoose.Schema;
const capamnhaSchema = new schema({ 
    imagem : {type: String, required: true},
    title  : {type: String, required: true},
    desc   : {type: String, required: true},
    action : {type: String, required: true},
    link   : {type: String, required: false}
});


module.exports = mongoose.model('campanhas_gchat', capamnhaSchema);    