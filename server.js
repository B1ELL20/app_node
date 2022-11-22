const http = require("http") // Importa o http

// Cria um servidor http para trabalhar com as rotas
http.createServer((request, response) => {

    // Define o status e o formato dos conteúdos
    response.writeHead(200, {'Content-Type' : 'application/json'})

    // Verifica a url aplicada e, de acordo com a mesma, redireciona uma mensagem correspondente
    if (request.url === '/produto') {

        response.end(JSON.stringify({

            message: "Rota de produto"
        }))
    } 

    if (request.url === '/usuario') {

        response.end(JSON.stringify({

            message: "Rota de usuário"
        }))
    }
// Inicializa o servidor na porta 4001
}).listen(4001, () => console.log("Servidor está rodando na porta 4001"))