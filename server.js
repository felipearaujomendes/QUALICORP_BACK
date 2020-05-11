/*
 * Arquivo: server.js
 * Descrição:
 * Author: Felipe Mendes
 * Data da Criação: 08/05/2020
 * 
 */

 // Configurar o Setup do App

 //Chamadas dos pacotes:
var express = require('express');
var app = express();
var bodyParser = require('body-parser'); //Calculating...
var mongoose = require('mongoose');
var Produto = require('./app/models/produto');

var cors = require('cors');
app.use(cors()); // habilitando o cors da aplicação para todas as rotas

// URI: MLab
mongoose.connect('mongodb+srv://mendesfreela:46858556@cluster0-ojgck.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});

//Maneira local
// mongoose.connect('mongodb://localhost/node-crud-api');

// Configuração da variável app para usar o 'bodyParser()'
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

//Definindo a porta onde será executada a nossa api:
var port = process.env.port || 8000;

//ROTAS DA API
//===================================================================




//Criando uma instancia das Rotas via Express:
var router = express.Router();

//POST

router.route('/produtos')

.post(function(req,res){
    
    var produto = new Produto();
    
    //setando os campos via request
    produto.nome = req.body.nome;
    produto.preco = req.body.preco;
    produto.descricao = req.body.descricao;


    
    produto.save(function(error){
     
        if(error)
            res.send('Erro ao tentar salvar o produto...' + error);


        res.json({message:'Produto cadastrado com sucesso!'});

    });
    
})

// Retorna todos os produtos

.get(function(req, res){
    Produto.find(function(error,produtos){
        if(error)
            res.send('Erro ao tentar selecionar todos os produtos... : '+ error)
        
            console.log('Cors 1 ok');
            res.setHeader('Access-Control-Allow-Origin', '*');
            console.log('Cors 2 ok');

            res.json(produtos);
    });
})

//Retornar por ID

router.route('/produtos/:produto_id')
.get(function(req,res){

    Produto.findById(req.params.produto_id, function(error, produto){
        if(error)
            res.send('Id do Produto não encontrado....:'+ error);

        res.json(produto);
    })
})

.put(function(req,res){

    Produto.findById(req.params.produto_id, function(error, produto){
        if(error)
            res.send('Id do Produto não encontrado....:'+ error);

            //segundo:
            produto.nome = req.body.nome;
            produto.preco = req.body.preco;
            produto.descricao = req.body.descricao;

            produto.save(function(error){
                if('Erro ao atualizar o produto...:'+ error);

            res.json({message: 'Produto atualizado com sucesso'});

            });
    })
})

.delete(function(req,res){

    Produto.remove({
        _id: req.params.produto_id
    },function(error){
        if(error)
            res.send('Id do Produto não encontrado...:'+error);

        res.json({message: 'Produto Excluido com sucesso!'});
    })
})
router.use(function(req, res,next){
   
    next();
});

// Rota de exemplo:
router.get('/', function(req, res){

    res.json({ message: 'Beleza! Bem vindo a nossa loja xxxxx'})

}); 

//Definindo um padrão das rotas prefixadas: '/api'
app.use('/api', router);

//Iniciando a Aplicação (servidor)
app.listen(port);
console.log("Iniciando a app na porta " + port);
