const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

//RETORNA TODOS OS PRODUTOS
router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({error: error})}

        conn.query(
            'SELECT * FROM Produtos',
            (error, result, fields) => {
                if(error) { return res.status(500).send({error: error})}
                const response = {
                    quantidade: result.length,
                    produtos: result.map(prod => {
                        return {
                            idProdutos: prod.idProdutos,
                            nome: prod.nome,
                            preco: prod.preco,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna os detalhes do produto',
                                url: 'http://localhost:3000/produtos/' + prod.idProdutos
                            }
                        }
                    })
                }

                return res.status(200).send({response: response})
            }
        )
    })
});

//INSERE UM PRODUTO
router.post('/', (req, res, next) => {

    mysql.getConnection((error, conn) => {

        if(error) { return res.status(500).send({error: error})}
        conn.query(
            'INSERT INTO Produtos (nome, preco) VALUES (?,?)',
            [req.body.nome, req.body.preco],
            (error, result, field) => {
                conn.release();

                if(error) { return res.status(500).send({error: error})}

                const response = {
                    mensagem: 'Produto inserido com sucesso',
                    produtoCriado: {
                        idProduto: result.idProduto,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna detalhes de todos os produtos',
                            url: 'http://localhost:3000/produtos/'
                        }
                    }
                }

                return res.status(201).send(response);
            }
        )
    });

});

//RETORNA OS DADOS DE UM PRODUTO
router.get('/:id_produto', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({error: error})}

        conn.query(
            'SELECT * FROM Produtos WHERE idProdutos = ?',
            [req.params.id_produto],
            (error, result, fields) => {
                if(error) { return res.status(500).send({error: error})}

                if(result.length == 0){
                    return res.status(404).send({
                        mensagem: 'Produto encontrado'
                    })
                }

                const response = {
                    produto: {
                        idProduto: result[0].idProduto,
                        nome: result[0].nome,
                        preco: result[0].preco,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna detalhes de todos os produtos',
                            url: 'http://localhost:3000/produtos/'
                        }
                    }
                }

                return res.status(200).send(response);
            }
        )
    })
  
});

//ALTERA UM PRODUTO
router.patch('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {

        if(error) { return res.status(500).send({error: error})}
        conn.query(
            `UPDATE Produtos
                SET nome = ?,
                    preco = ?
                WHERE idProdutos = ?`,
            [
                req.body.nome, 
                req.body.preco, 
                req.body.idProdutos
            ],
            (error, result, field) => {
                conn.release();

                if(error) { return res.status(500).send({error: error})}

                const response = {
                    mensagem: 'Produto atualizado com sucesso',
                    produtoAtualizado: {
                        idProduto: req.body.idProduto,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna detalhes de um produto',
                            url: 'http://localhost:3000/produtos/' + req.body.idProduto
                        }
                    }
                }

                return res.status(202).send(response);
            }
        )
    });
});

//DELETA UM PRODUTO
router.delete('/', (req, res, next) => {
   mysql.getConnection((error, conn) => {
       if(error) { return res.status(500).send({error: error})}

       conn.query(

        `DELETE FROM Produtos WHERE idProdutos = ?`,
        [req.body.idProdutos],
         
        (error, result, field) => {
            conn.release();
            if(error) { return res.status(500).send({error: error})}

            const response = {
                mensagem: "Produto removido com sucesso",
                request: {
                    tipo: 'POST',
                    descricao: 'Insere um produto',
                    url: 'http://localhost/produtos',
                    body: {
                        nome: 'String',
                        preco: 'Number'
                    } 
                }
            }

            return res.status(202).send(response);
        }
       )
   });
});

module.exports = router