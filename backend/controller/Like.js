import mememodel from "../models/MemeModel.js";

const likeMeme = async (req,res)=>{
    try{
        const user = req.user
        const memeId = req.params.id
        if(!memeId){
            return res.status(401).json({"success":"fail","error":"No meme id"})
        }
        const meme = await mememodel.findById(memeId)
        if(!meme){
            return res.status(401).json({"success":"fail",'message':"Meme not found"})
        }
        if(meme.author.toString()===user.id.toString()){
            return res.status(403).json({"sucess":false,"error":"You can't like your own meme dude"})
        }
       const liked =  meme.likes.includes(user.id)
       if(liked){
        meme.likes = meme.likes.filter((id)=>{
                return id.toString()!==user.id.toString()
        })
       }
       else{
        meme.likes.push(user.id)
       }
       await meme.save()

       res.status(200).json({
        "message": liked?"meme unliked":"meme liked",
        totalLikes:meme.likes.length
       })
    }catch(e){
        console.log(e)
        return res.status(500).json({"message":"Internal error"})
    }
}
export default likeMeme