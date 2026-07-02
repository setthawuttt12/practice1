const express = require('express')
const db = require('../../db')
const router = express.Router()
const {requireRole,verifyToken} = require('../../middleware/authMiddleware')

router.get('/topic/:id_eva',verifyToken,requireRole('กรรมการประเมิน'),async =>{
    try {
        const id_member = req.user.id_member
        const id_eva = req.params.id_eva
        const [[RowCommit]] = await db.query(`select * from tb_commit where id_membr=? and id_eva=?,`[id_member,id_eva])
        var statusCommit = 0
        if(RowCommit.level_commit === 'ประธาน'){
            statusCommit = 2
        }else if(RowCommit.level_commit === 'กรรมการ'){
            statusCommit = 3
        }else if(RowCommit.level_commit  === 'เลขา'){
            statusCommit = 4
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