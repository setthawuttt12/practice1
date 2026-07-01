const express = require('express')
const db = require('../../db')
const router = express.Router()
const {requireRole,verifyToken} = require('../../middleware/authmiddleware')
const path = require('path')
const uploadDir = path.join(__dirname,'../../uploads/evadetail')

// regis APi
router.get('/user',verifyToken,requireRole('ผู้รับการประเมินผล'),async(req,res)=>{
    try {
        const id_member = req.user.id_member
        const [rows] = await db.query(`select * from tb_member m,tb_eva e,tb_system s where e.id_member=? and e.id_member=m.id_member and e.id_sys=s.id_sys order by e.id_eva desc`,[id_member])
        res.json(rows[0])
    } catch (error) {
        console.error("Error Get Profile",error)
        res.status(500).json({message:'Error Get Profile'})
    }
})

router.get('/topic',verifyToken,requireRole('ผู้รับการประเมินผล'),async(req,res)=>{
    try {
        const id_member = req.user.id_member
        const [topics] = await db.query(`select * from tb_topic`)
        const [indicates] = await db.query(`select * from tb_indicate`)
        const result = topics.map(t =>({
            ...t,
            indicates:indicates.filter((i)=> i.id_topic === t.id_topic)
        }))
        res.json(result)
    } catch (error) {
        console.error("Error Get Profile",error)
        res.status(500).json({message:'Error Get Profile'})
    }
})

router.post('/save',verifyToken,requireRole('ผู้รับการประเมินผล'),async(req,res)=>{
    try {
        const id_member = req.user.id_member
        const fileMap = {}
        const scores = JSON.parse(req.body.scores)
        await Promise.all(Object.entries(req.files).map(async ([key,file])=>{
            const filename = Date.now()+Math.random().toString(36).slice(2)+path.extname(file.name)
            await file.mv(path.join(uploadDir,filename))
            fileMap[key] = filename
        }))
        const [[evaRow]] = await db.query(`select * from tb_member m, tb_eva e,tb_system s where e.id_member=? and e.id_member=m.id_member and e.id_sys=s.id_sys order by e.id_eva desc`,[id_member])
        const id_eva = evaRow.id_eva
        for(const item of scores){
            const filename = fileMap[item.file_key]
            await db.query(`insert into tb_evadetail (id_eva,id_indicate,status_eva,score_member,detail_eva,file_eva) values(?,?,?,?,?,?)`,[id_eva,item.id_indicate,1,item.score,item.detail_eva,filename])
        }
        const [[sumRow]] = await db.query(`select coalesce(sum(score_member*(select i.point_indicate from tb_indicate i where i.id_indicate=d.id_indicate)),0) as total from tb_evadetail d where d.id_eva=?`,[id_eva])
        await db.query('update tb_eva set status_eva=?,total_eva=? where id_eva=?',[2,sumRow.total,id_eva])
        res.json({message:'Post scoer Success'})
    } catch (error) {
        console.error("Error Post scoer",error)
        res.status(500).json({message:'Error post score'})
    }
})

module.exports = router