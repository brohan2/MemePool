import mememodel from "../models/MemeModel.js"

const deleteMeme = async (req,res)=>{
    try{
        const memeId = req.params.id 
        const userId = req.user.id
        
        const meme = await mememodel.findById(memeId)

        
        if(!meme){
            return res.status(404).json({"success":false,"Error":"Meme not found"})
        }
        if(meme.author.toString()!==userId.toString()){
            return res.status(403).json({"success":false,"Message":"It's not your meme, you can't delete it"})
        }

        await mememodel.findByIdAndDelete(memeId)
        return res.status(200).json({"success":true,"Message":"Meme deleted successfully"})
    }catch(e){
        console.log(e)
        return res.status(500).json({"success":false,"Error":"Internal server error"})
    }
}

export default deleteMeme