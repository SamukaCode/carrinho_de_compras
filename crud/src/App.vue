<template>
  <div class="abas-container">
    <!-- Aba de Cadastro de Produto -->
    <div class="aba-cadastro">
      <h2>Cadastro de Produto</h2>
      <div class="input-cadastro">
        <label for="codigo" class="label">Código do Produto</label>
        <input type="text" v-model="codigo" class="input-consulta" />
        <label for="nome" class="label">Nome do Produto</label>
        <input type="text" v-model="nome" class="input-consulta" />
        <label for="preco" class="label">Preço do Produto</label>
        <input type="text" v-model="preco" class="input-consulta" />
        <button @click="cadastrarProduto" class="btn-cadastrar">
          Cadastrar Produto
        </button>
      </div>
      <div class="tabela-rolagem-cadastro">
        <table class="produto-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="produto in listaProdutos" :key="produto.id">
              <td>{{ produto.id }}</td>
              <td>{{ produto.nome }}</td>
              <td>{{ produto.preco }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Aba de Consulta de Produto e Carrinho -->
    <div class="aba-consulta-carrinho">
      <div class="input-container">
        <label for="produto" class="label">Código do Produto</label>
        <input type="text" v-model="produto" class="input-consulta" />
        <button @click="inserirProduto" class="btn-inserir">
          Adicionar ao Carrinho
        </button>
      </div>
      <div class="carrinho-container">
        <h2>Carrinho</h2>
        <div class="tabela-rolagem-carrinho">
          <table class="carrinho-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="produto in listaCarrinho" :key="produto.id">
                <td>{{ produto.id }}</td>
                <td>{{ produto.nome }}</td>
                <td>{{ produto.preco }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="carrinho-resumo">
          <h3>Total: {{ total }}</h3>
          <button @click="confirmarCompra" class="btn-confirmar">
            Confirmar Compra
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import axios from "axios";

export default {
  name: "App",
  data() {
    return {
      produto: "",
      codigo: "",
      nome: "",
      preco: "",
      listaProdutos: [],
      listaCarrinho: [],
      total: 0,
    };
  },
  mounted() {
    this.consultarProdutos(); // Consulta produtos ao montar o componente
  },
  methods: {
    cadastrarProduto() {
      if (!this.codigo || !this.nome || !this.preco) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Preencha todos os Campos!",
          customClass: {
            confirmButton: "btn-confirmar-sweetalert", // Classe CSS personalizada
          },
        });
        return;
      }

      const codigoInt = parseInt(this.codigo);
      if (isNaN(codigoInt)) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "O código do produto deve ser um número inteiro válido.",
          customClass: {
            confirmButton: "btn-confirmar-sweetalert",
          },
        });
        return;
      }

      const precoFloat = parseFloat(this.preco);
      if (isNaN(precoFloat)) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "O preço do produto deve ser um número válido.",
          customClass: {
            confirmButton: "btn-confirmar-sweetalert",
          },
        });
        return;
      }

      const query = `
      mutation CreateProduto($data: dadosProduto) {
  createProduto(data: $data) {
    id
    nome
    preco
  }
}`;

      const variables = {
        data: {
          id: parseInt(this.codigo),
          nome: this.nome,
          preco: parseFloat(this.preco),
        },
      };

      console.log(variables);

      axios
        .post("http://localhost:4000/", { query, variables })
        .then((result) => {
          const responseData = result.data;
          console.log(responseData);
          this.codigo = "";
          this.nome = "";
          this.preco = "";
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Produto Cadastrado!",
            showConfirmButton: false,
            timer: 1500,
          });
          this.consultarProdutos();
        })
        .catch((error) => {
          console.error(error);
        });
    },
    inserirProduto() {
      if (!this.produto || isNaN(parseInt(this.produto))) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Código do Produto inválido!",
          customClass: {
            confirmButton: "btn-confirmar-sweetalert",
          },
        });
        return;
      }
      const query = `
        query Produto($produtoId: Int!) {
          produto(id: $produtoId) {
            id
            nome
            preco
          }
        }`;

      const variables = {
        produtoId: parseInt(this.produto),
      };

      axios
        .post("http://localhost:4000/", { query, variables })
        .then((result) => {
          const produto = result.data.data.produto;
          this.listaCarrinho.push(produto);
          this.total += produto.preco;
          this.produto = "";
          console.log(this.listaCarrinho);
        })
        .catch((error) => {
          console.error(error);
        });
    },
    confirmarCompra() {
      if (this.listaCarrinho.length === 0) {
        Swal.fire({
          icon: "warning",
          title: "Oops...",
          text: "O carrinho está vazio! Adicione produtos antes de confirmar a compra.",
          customClass: {
            confirmButton: "btn-confirmar-sweetalert",
          },
        });
        return;
      }

      const dataHora = new Date().toISOString();
      const produtos = this.listaCarrinho.map((produto) => ({
        id: produto.id,
        preco: produto.preco,
      }));

      const query = `
    mutation CreatePedido($dataHora: String!, $produtos: [ProdutoInput!]!) {
      createPedido(dataHora: $dataHora, produtos: $produtos) {
        id
        dataHora
        valor
      }
    }`;

      const variables = {
        dataHora,
        produtos,
      };

      axios
        .post("http://localhost:4000/", { query, variables })
        .then((result) => {
          const responseData = result.data.data;
          console.log(responseData);

          if (responseData && responseData.createPedido) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Compra Realizada!",
              showConfirmButton: false,
              timer: 1500,
            });
            const novoPedido = responseData.createPedido;
            console.log("Pedido criado:", novoPedido);
            this.listaCarrinho = [];
            this.total = 0;
            this.produto = "";
          } else {
            console.error("Resposta da API não contém dados do pedido.");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    consultarProdutos() {
      const query = `
        query todosProdutos {
          todosProdutos {
            id
            nome
            preco
          }
        }`;

      axios.post("http://localhost:4000/", { query })
        .then((result) => {
          this.listaProdutos = result.data.data.todosProdutos;
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
};
</script>

<style>
body {
  background-color: #320839;
}

.table-container {
  margin-top: 20px;
}

.product-table,
.carrinho-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}
.product-table th,
.product-table td,
.carrinho-table th,
.carrinho-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

.produto-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.produto-table th,
.produto-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

.abas-container {
  display: flex;
  justify-content: space-between;
  align-items: center; 
  margin: 0 auto;
  max-width: 1300px; 
  height: 95vh;
}

.input-container {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.label {
  font-weight: bold;
  margin-right: 10px;
}

.input-consulta {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-right: 10px;
}

.btn-inserir,
.btn-confirmar {
  background-color: #df9036;
  color: white;
  padding: 10px 15px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease-in-out;
}

.btn-inserir:hover {
  background-color: #c96d21;
}

.btn-confirmar:hover {
  background-color: #0954e9;
}

.carrinho-container {
  margin-top: 20px;
}

.carrinho-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.carrinho-table th,
.carrinho-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

.carrinho-resumo {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn-confirmar {
  background-color: #008cba;
  margin-left: 10px;
}

.carrinho-resumo h3 {
  margin: 0;
  font-size: 18px;
}

.aba-cadastro {
  width: 600px;
  height: 500px;
  padding: 20px;
  margin: 30px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: #eeeeee; 
  transition: 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}

.aba-cadastro:hover {
  box-shadow: 0 0 40px rgba(164, 21, 142, 0.351);
}


.input-cadastro {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

.input-cadastro label {
  font-weight: bold;
  margin-bottom: 5px;
}

.input-cadastro input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-bottom: 10px;
}

.input-cadastro button {
  background-color: #268b2a;
  color: white;
  padding: 10px 15px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease-in-out;
}

.input-cadastro button:hover {
  background-color: #074e0a;
}

.aba-consulta-carrinho {
  width: 600px;
  height: 500px;
  padding: 20px;
  margin: 30px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: #eeeeee;
  transition: box-shadow 0.3s ease-in-out;
}
.aba-consulta-carrinho:hover {
  box-shadow: 0 0 40px rgba(164, 21, 142, 0.351);
}

.btn-confirmar-sweetalert {
  background-color: #0f7314 !important; 
  color: white !important; 
}

.tabela-rolagem-carrinho {
  max-height: 35vh;
  overflow-y: auto;
}

.tabela-rolagem-cadastro {
  max-height: 18vh;
  overflow-y: auto;
}
.btn-cadastrar {
  background-color: #4caf50;
  color: white;
  padding: 10px 15px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease-in-out;
}

.btn-cadastrar:hover {
  background-color: #45a049;
}
</style>
