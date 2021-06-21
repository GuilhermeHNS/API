const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');

router.post('/cadastro', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) {return res.status(500).send({error: error})};

        conn.query('SELECT * FROM Usuarios WHERE email = ?',
            [req.body.email],
            (error, results) => {
                if(error) {return res.status(500).send({error: error})}
                if(results.length > 0){
                    res.status(409).send({
                        mensagem: 'Email ja utilizado'
                    })
                }
                else{

                    bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) => {
                        if(errBcrypt) { return res.status(500).send({error: errBcrypt})};
            
                        conn.query(
                            `INSERT INTO Usuarios (email, senha) VALUES (?,?)`,
                            [req.body.email, hash],
                            (error, result) => {
                                conn.release();
                                if(error) {return res.status(500).send({error: error})}
            
                                const response = {
                                    mensagem: 'Usuario cadastrado com sucesso',
                                    usuarioCriado: {
                                        idUsuario: result.insertId,
                                        email: req.body.email
                                    }
                                }
            
                                return res.status(201).send(response);
                            }
                        )
                    });
                }
            }
        )

    })
})


module.exports = router;