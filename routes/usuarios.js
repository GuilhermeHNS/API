const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');

router.post('/cadastro', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) {return res.status(500).send({error: error})};
        bcrypt.hash(req.body.senha, 10)
        conn.query(
            ''
        )
    })
})


module.exports = router;