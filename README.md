# Carrinho de Compras

 O Sistema consiste em um Cadastro de Produtos e um Lançamentos de Pedidos.

 ## Stack utilizada

**Front-end:** Vue.js, Axios

**Back-end:** Node, GraphQL, Apollo Server

**Banco de dados:** MySQL

## Documentação da API e WEB

Essa interface já está moldada aos propósitos da aplicação, não sendo necessária grossas mudanças em sua estrutura, apenas no que se refere no tutorial de instalação da referida.

A API é moldada usando GraphQL, o que a dá características específicas que se diferencia de uma API Rest, ou seja, não há diversos endpoints, apenas um.

### Para iniciar a API:

É necessário possuir **Node.js** e **Git** instalado do computador ou no servidor para que a API se instale e inicie.

1. Instalar node.js e git:
Para windows:
```
Acessar o site: https://nodejs.org/en
Fazer o download da versão mais recente.
Seguir o passo a passo da instalação.

Para o Git:
https://git-scm.com/downloads
Fazer o download da versão mais recente.
Seguir o passo a passo da instalação.

```
Para linux, passar os comandos em sequência no terminal:
```git
sudo apt-get install curl
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install git-all
```

2. Clonar o repositório em questão com o seguinte comando no terminal.
```git
git clone https://github.com/SamukaCode/carrinho_de_compras
```

3. Acessar a pasta em que o repositório foi clonado.
4. Acessar a pasta 'api':
```git
cd api
```
5. Instalar todas as dependências para a API funcionar:
```git
npm install
npm run build
```

6. É necessário alterar as informações do banco contidas no arquivo src/mysql.js. Informações em **MAIÚSCULAS** devem ser alteradas.
```js
connection: {
		host: "IP DO SERVIDOR",
		user: "USUÁRIO DO SERVIDOR",
		password: "SENHA DO USUÁRIO",
		database: "BANCO USADO",
		port: "PORTA DO SERVIDOR - GERALMENTE 3306",
	}
```

7. Execute a API:
   
Se for em versão de desenvolvimento:
```git
npm run dev
```
Se for em produção (o comando *npm run build* deve ser executado apenas uma vez):
```git
npm run build
npm start
```

8. Para testar, acesse:
```
http://localhost:4000/
```

### Criação de tabelas no banco de dados:

É necessário ter conhecimentos básicos de MySQL para instanciar um banco de dados. Este banco de dados deve se manter ligado enquanto ser necessário que a aplicação funcione.

Use os comandos abaixo para criação das 5 tabelas. Você pode copiá-los todos e colar juntos ou executá-los separadamente.
```sql
CREATE TABLE `produtos` (
  `id` int NOT NULL,
  `nome` varchar(45) NOT NULL,
  `preco` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `pedido` (
  `dataHora` varchar(45) NOT NULL,
  `valor` decimal(10,2) NOT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `pedido_itens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `preco` decimal(10,2) NOT NULL,
  `produto_id` int NOT NULL,
  `pedido_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_pedido_id` (`pedido_id`),
  KEY `fk_produto_id_idx` (`produto_id`),
  CONSTRAINT `fk_pedido_id` FOREIGN KEY (`pedido_id`) REFERENCES `pedido` (`id`),
  CONSTRAINT `fk_produto_id` FOREIGN KEY (`produto_id`) REFERENCES `produtos` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
```

### Para iniciar a aplicação WEB:

É necessário possuir **Node.js** e **Git** instalado do computador ou no servidor para que a aplicação se instale e inicie.
Se você já tem Node e Git instalados, pule ao passo 2.

1. Instalar node.js e git:
Para windows:
```
Acessar o site: https://nodejs.org/en
Fazer o download da versão mais recente.
Seguir o passo a passo da instalação.

Para o Git:
https://git-scm.com/downloads
Fazer o download da versão mais recente.
Seguir o passo a passo da instalação.

```
Para linux, passar os comandos em sequência no terminal:
```git
sudo apt-get install curl
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install git-all
```

2. Clonar o repositório em questão com o seguinte comando no terminal.
```git
git clone https://github.com/SamukaCode/carrinho_de_compras
```

3. Acessar a pasta em que o repositório foi clonado.
4. Acessar a pasta 'crud':
```git
cd crud
```
5. Instalar todas as dependências para a aplicação funcionar:
```git
npm install
```

6. Inicie a aplicação:
```git
npm run serve
```
