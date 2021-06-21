const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

//RETORNA TODOS OS PEDIDOS
router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) {return res.status(500).send({error: error})};

        conn.query(
            'SELECT * FROM Pedidos',
            (error, result, fields) => {
                if(error) {return res.status(500).send({error: error})};

                const response = {
                    quandidade: result.length,
                    pedidos: result.map(ped => {
                        return{
                            idPedidos: ped.idPedidos,
                            quantidade: ped.quandidade,
                            idProdutos: ped.idProdutos,
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

        conn.query(
            'INSERT INTO Pedidos (idProdutos, quantidade) VALUES (?,?)',
            [req.body.idProdutos, req.body.quantidade],

            (error, result, field) => {
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
});

//RETORNA OS DADOS DE UM PEDIDO
router.get('/:id_pedido', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) {return res.status(500).send({error: error})};

        conn.query(
            'SELECT * FROM Pedidos WHERE idPedidos = ?',
            [req.params.idPedidos],
            (error, result, fields) => {
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
    res.status(201).send({
        mensagem: 'Deletando um pedido'
    });
});

module.exports = router