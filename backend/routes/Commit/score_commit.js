const express = require('express')
const db = require('../../db')
const router = express.Router()
const {requireRole,verifyToken} = require('../../middleware/authMiddleware')


router.get('/user/:id_eva',verifyToken,requireRole('กรรมการประเมิน'),async(req,res)=>{
    try {
        const id_member = req.user.id_member
        const id_eva = req.params.id_eva
        const [rows] = await db.query(`select * from tb_member m,tb_eva e,tb_system s,tb_commit c where c.id_member=? and c.id_eva=? and c.id_eva=e.id_eva and e.id_member=m.id_member and e.id_sys=s.id_sys order by e.id_eva desc`,[id_member,id_eva])
        res.json(rows[0])
    } catch (error) {
        console.error("Error Get Profile",error)
        res.status(500).json({message:'Error Get Profile'})
    }
})


router.get('/topic/:id_eva',verifyToken,requireRole('กรรมการประเมิน'),async =>{
    try {
        const id_member = req.user.id_member
        const id_eva = req.params.id_eva
        const fileMap = {}
        const scores = JSON.parse(req.body.scores)
        const detail_commit = req.body.detail_commit
        // const [[RowCommit]] = await db.query(`select * from tb_commit where id_member=? and id_eva=?`,[id_member,id_eva])
        var statusCommit = 0
        if(RowCommit.level_commit === 'ประธาน'){
            statusCommit =2
        }else if(RowCommit.level_commit === 'กรรมการ'){
            statusCommit =3
        }else if(RowCommit.level_commit === 'เลขา'){
            statusCommit =4
        }
        const [topics] = await db.query(`select * from tb_topic`)
        const [indicates] = await db.query(`select * from tb_indicate i,tb_evadetail d where i.id_indicate=d.id_indicate and status_eva=? and id_eva=?`,[statusCommit,id_eva])
        const result = topic.map(t =>({
            ...t,
            indicates:indicates.filter((i) => i.id_topic === t.id_topic)
        }))
        res.json(result)
    } catch (error) {
        console.error("Error GET User",error)
        res.status(500).json({message:'Error GET User'})
    }
})

module.exports = router