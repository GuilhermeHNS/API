const express = require('express');
const app = express();
const rotaProdutos = require('./routes/produtos');
const rotaPedidos = require('./routes/pedidos');
const morgan = require('morgan');

app.use(morgan('dev'));
app.use('/produtos', rotaProdutos );
app.use('/pedidos', rotaPedidos );


app.use((req, res, next) => {
    const erro = new Error('Pagina não encontrada');
    erro.status = 404;
    next(erro);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    return res.send({
        erro: {
            mensagem: error.message
        }
    })
});



module.exports = app;
