const express = require('express');
const app = express();
const rotaProdutos = require('./routes/produtos');
const rotaPedidos = require('./routes/pedidos');
const morgan = require('morgan');
const bodyParser = require('body-parser');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended:false })); //apenas dados simples
app.use(bodyParser.json()); //json de entrada no body apenas

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Header',
        'Content-Type, Origin, X-Requerested-With, Accept, Authorization'
    );

    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).send({});
    }

    next();
})


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
