const express = require('express')
const db = require('../../db')
const router = express.Router()
const {requireRole,verifyToken} = require('../../middleware/authmiddleware')
const bc = require('bcrypt')
// register api
router.get('/',verifyToken,requireRole('ผู้รับการประเมินผล'),async(req,res)=>{
    try {
        const id_member = req.user.id_member
        const [rows] = await db.query(`select  first_name,last_name,email,username,role from tb_member where id_member=?`,[id_member])
        res.json(rows[0])
    } catch (error) {
        console.error("Error Get Profile",error)
        res.status(500).json({message:'Error Get Profile'})
    }
})
router.put('/',verifyToken,requireRole('ผู้รับการประเมินผล'),async(req,res)=>{
    try {
        const id_member = req.user.id_member
        const {first_name,last_name,email,username,password,role} = req.body
        if(password && password.trim()){
            const hash = await dc.hash(password,10)
            await db.query(`update tb_member set fist_name=?,last_name=?,email=?,username=?,password=?,role=? where id_member='${id_member}'`,[first_name,last_name,email,username,hash,role])
        }else{
            await db.query(`update tb_member set fist_name=?,last_name=?,email=?,username=?,role=? where id_member='${id_member}'`,[first_name,last_name,email,username,role])
        }
        res.json({message:'Update Success'})
    } catch (error) {
         console.error("Error Get update",error)
        res.status(500).json({message:'Error Get update'})
    }
})

module.exports = router