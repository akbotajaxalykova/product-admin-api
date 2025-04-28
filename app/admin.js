const express= require ('express');
const auth= require('./middleware/auth')
const router=express.Router()

router.get('/', auth,(req,res)=>{
    res.send({message:'It is a secret info', username:req.username});
})
module.exports=router;