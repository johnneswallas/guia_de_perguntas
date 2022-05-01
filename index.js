const express = require("express");
const app = express();
const connection = require("./database/database");
const Pergunta = require("./database/Pergunta");
const Resposta = require("./database/Resposta");

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

connection.authenticate().then(()=>{
    console.log("Conectado ao banco")
}).catch((erro)=>{
    console.log("Erro " + erro)
})

app.get("/", (req, res)=>{
    Pergunta.findAll({raw: true, order:[['id',"desc"]]}).then(perguntas =>{
        res.render("index",{
            pergunta: perguntas
        })
    })
})

app.get("/perguntar",(req, res)=>{
    res.render("perguntar");
})

app.post("/salvarpergunta", (req, res)=>{
    var titulo = req.body.titulo
    var descricao = req.body.descricao
    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(()=>{
        res.redirect("/")
    })
})

app.get("/pergunta/:id",(req, res)=>{
    var id = req.params.id
    Pergunta.findOne({
        where:{ id: id}
    }).then(pergunta =>{
        if(pergunta != undefined){  
            
            Resposta.findAll({                  
                where:{perguntaId: id},
                order:[ ['id','desc'] ]           //faço um peesquisa na tabela resposta todos que tem o perguntaid igual o id da pergunta   
            }).then(resposta =>{                //jogo o resultado dentro da lista resposta    
                res.render("pergunta",{         
                    pergunta: pergunta,
                    respostas: resposta})           //passo o resultado como "respostas" pra pagina pergunta 
            })
            
        }
        else{
            res.redirect("/")
        }

    })
})
app.post("/responder", (req, res)=>{
    var corpo = req.body.corpo;
    var perguntaId = req.body.pergunta;
    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(()=>{
        res.redirect("/pergunta/"+perguntaId)
    })
})



app.listen(80, ()=>{
    console.log("servidor rodando!")
})