exports.checkEmail = 
async (req,res) => {
    const {token} = req.body;
    if(meuCache.get(token)){
        res.status(200).json({msg: "Token válido"})
        cache.del(token);
    }
    else{
        res.status(400).json({msg: "Token inválido ou expirado"})
    }
    
    
}