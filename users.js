const express = require('express')
const router = express.Router()
const conn = require('../mariadb')

router.use(express.json())

router.post('/login', function(req, res) {
    let {email, password} = req.body

    let sql =`SELECT * FROM users WHERE email = ?`
    conn.query(sql, email,
        function (err, results) {
            var loginUser = results[0]

            if(loginUser && loginUser.password == password) {
                res.status(200).json({
                    message : `${loginUser.name}님 로그인 되었습니다.`
                })
            } else {
                res.status(404).json({
                    message : "이메일 또는 비밀번호가 틀렸습니다."
                })
            }
        }
    )
})

router.post('/join', function(req, res) {

    if (Object.keys(req.body).length == 4) {
        const {email, name, password, contact} = req.body
        
        let sql =`INSERT INTO users (email, name, password, contact) VALUES (?, ?, ?, ?)`
        let values = [email, name, password, contact]
        conn.query(sql, values,
            function (err, results) {
                    res.status(201).json(results)
            }
        )
    } else {
        res.status(400).json({
            message : `입력 값을 다시 확인해주세요.`
        })
    }
})

router
    .route('/users')
    .get(function(req, res) {
        let {email} = req.body

        let sql = `SELECT * FROM users WHERE email = ?`
        conn.query(sql, email,
            function (err, results) {
                    res.status(200).json(results)
            }
        )
    })
    .delete(function(req, res) {
        let {email} = req.body

        let sql = `DELETE FROM users WHERE email = ?`
        conn.query(sql, email,
            function (err, results) {
                    res.status(200).json(results)
            }
        )
    })

module.exports = router