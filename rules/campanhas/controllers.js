const Campanhas = require("../../model/campanhas");
const Controller = {
    listarCampanhas: async (req, res) =>{
        try{
            const campanhas = await Campanhas.find({}).lean();
            console.log(campanhas)

            res.json({success: true, campaing: campanhas})
        }catch(err){
            console.log(err)
            res.json({success: false, message: "Erro ao recuperar canpanhas."})
        }
    }
}

module.exports = Controller;