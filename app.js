const express = require('express');   //Importação do express 
const { randomUUID } = require('crypto');  // Importação do crypto para utilizar o randomUUID
const fs = require('fs');           // Importação do file system para escrita e leitura de arquivos
 
const app = express();       // Instancia o express para criar rotas na aplicação

app.use(express.json());     // Define o formato

// Cria um array para armazenar os produtos
let products = [];     

// Lê o arquivo, que simula um banco de dados, e adiciona os valores encontrados ao array
fs.readFile('products.json', 'utf-8', (err, data) => {

    if(err) {
        console.log(err);
    } else {
        products = JSON.parse(data);
    }
})

// Cria a primeira requisição POST, para registrar os valores enviados na requisição
app.post('/produtos', (request, response) => {

    // Desmembra o body da requisição, aplicando somente as variáveis em questão
    const {name, price} = request.body;
    
    // Declara um produto com os valores recebidos, gerando um id aleatório
    const product = {

        name,
        price,
        id: randomUUID()
    };

    // Adiciona produto no array

    products.push(product);

    // Atualiza o arquivo ("banco de dados")
    upgradeFile();

    // Retorna o response com o prouto em formato json
    return response.json(product);
})

// Requisição GET, para receber todos os itens cadastrados
app.get('/produtos', (request, response) => {

    // Apenas retorna o array de produtos em formato json
    return response.json(products);
})

// Requisição para retornar um produto especificando seu id
app.get('/produtos/:id', (request, response) => {

    // recupera o id enviado como parâmetro e salva numa constante
    const {id} = request.params;

    // Constante produto vai receber o produco encontrado pelo método find de acorod com o id passado
    const produto = products.find(produto => produto.id === id);

    // Retorna o produto em formato json
    return response.json(produto);
})

// Requisição para alterar os valores de um produto
app.put('/produtos/:id', (request, response) => {

    // Constante que vai receber o id atribuído como parâmetro
    const {id} = request.params;

    //Desmebra o body recebendo somente as variáveis desejáveis
    const {name, price} = request.body;

    // Constante que recebe o valor do index do array pelo método findIndex de acordo com o id
    const productID = products.findIndex(produto => produto.id === id);

    // Atualiza os valores do produto através do index encontrado 
    products[productID] = {
        ...products[productID],
        name,
        price
    };

    // Atualiza no arquivo
    upgradeFile();

    // Retorna uma mensagem de confirmação em formato json
    return response.json({message: "Produto alterado com sucesso"});
})

// Requisição DELETE, para apagar um produto de acordo com seu id
app.delete('/produtos/:id', (request, response) => {

    // Recebe o id passado como parâmetro pela requisição
    const {id} = request.params;
    
    // Recebe o index do produto requerido dentro do array
    const productID = products.findIndex(produto => produto.id === id);

    // Deleta o produto que corresponde ao index encontrado
    products.splice(productID, 1);

    // Atualiza o arquivo
    upgradeFile();
})

// Função para atualizar o arquivo
function upgradeFile() {

    // Método para escrever no arquivo, o array completo em formato json, retornando um erro caso necessário
    fs.writeFile("products.json", JSON.stringify(products), (err) => {

        if (err) {
            console.log(err);
        } else {
            console.log('Produto inserido');
        }
    })
}

// App inicializando o servidor na porta requisitada
app.listen(4002, () => console.log("Servidor está rodando na porta 4002"));