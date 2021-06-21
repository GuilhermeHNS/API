const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

//RETORNA TODOS OS PEDIDOS
router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) {return res.status(500).send({error: error})};

        conn.query(
            `
                SELECT Pedidos.idPedidos,
                    Pedidos.quantidade,
                    Produtos.idProdutos,
                    Produtos.nome,
                    Produtos.preco
                FROM Pedidos INNER JOIN Produtos ON Produtos.idProdutos = Pedidos.idProdutos;
            `,
            (error, result, fields) => {
                conn.release();
                if(error) {return res.status(500).send({error: error})};

                const response = {
                    pedidos: result.map(ped => {
                        return{
                            idPedidos: ped.idPedidos,
                            quantidade: ped.quandidade,
                            produto:{
                                idProdutos: ped.idProdutos,
                                nome: ped.nome,
                                preco: ped.preco
                            },
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna os detalhes de um produto especifico',
                                url: 'http://localhost:3000/pedidos/' + ped.idPedidos
                            }
                        }
                    })
                }
                return res.status(200).send(response);
            }
        )
    })
});

//INSERE UM PEDIDO
router.post('/', (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if(error) {return res.status(500).send({error: error})};

        conn.query('SELECT * FROM Produtos WHERE idProdutos = ?',
        [req.body.idProdutos],
        (error, result, field) => {
           conn.release();
           if(error) {return res.status(500).send({error: error})};

           if(result.length == 0){
               return res.status(404).send({
                   mensagem: 'Este produto não está cadastrado em nosso sistema'
               })
           }
           conn.query(
            'INSERT INTO Pedidos (idProdutos, quantidade) VALUES (?,?)',
            [req.body.idProdutos, req.body.quantidade],

            (error, result, field) => {
                conn.release();
                if(error) {return res.status(500).send({error: error})};
                const response = {
                    mensagem: 'Pedido inserido com sucesso',
                    pedidoCriado: {
                        idPedidos: result.idPedidos,
                        idProdutos: req.body.idProdutos,
                        quandiade: req.body.quantidade,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os pedidos',
                            url: 'http://localhost:3000/pedidos'
                        }
                    }
                }

                return res.status(201).send(response);
            }
        )

           
        })
    })

});

//RETORNA OS DADOS DE UM PEDIDO
router.get('/:id_pedido', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) {return res.status(500).send({error: error})};

        conn.query(
            'SELECT * FROM Pedidos WHERE idPedidos = ?',
            [req.params.id_pedido],
            (error, result, fields) => {
                conn.release();
                if(error) {return res.status(500).send({error: error})};

                if(result.length == 0){
                    return res.status(404).send({
                        mensagem: 'Pedido não localizado'
                    });
                }

                const response = {
                    pedidos:{
                        idPedidos: result[0].idPedidos,
                        idProdutos: result[0].idProdutos,
                        quantidade: result[0].quantidade,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os produtos',
                            url: 'http://localhost:3000/pedidos'
                        }
                    }
                }

                return res.status(200).send(response);
            }
        )
    })
    
});

//DELETA UM PEDIDO
router.delete('/', (req, res, next) => {
    mysql.getConnection((error, conn) =>{
        if(error) {return res.status(500).send({error: error})};

        conn.query(
            'DELETE FROM Pedidos WHERE idPedidos = ?',
            [req.body.idPedidos],
            (error, result, field) => {
                conn.release();
                if(error) {return res.status(500).send({error: error})};

                const response = {
                    mensagem: 'Pedido deletado com sucesso',
                    request: {
                        tipo: 'POST',
                        descricao: 'Insere um novo pedido',
                        url: 'http://localhost:3000/pedidos',
                        body: {
                            idProdutos: 'Number',
                            quantidade: 'Number'
                        }
                    }
                }

                return res.status(202).send(response);
            }
        )
    })
});

module.exports = router