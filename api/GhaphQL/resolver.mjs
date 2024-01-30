import knex from '../mysql.mjs';

const resolvers = {
    Query: {
        produto: async (_, { id }) => {
            const produto = await knex("produtos").where("id", id).first();
            return produto;
        },
        todosProdutos: async () => {
            return await knex("produtos").select("*");
          },
    },
    Mutation: {
        createProduto: async(_, {data}) => {
			const novoProduto = await knex("produtos").insert(data);
			return novoProduto;
        },
        createPedido: async (_, { dataHora, produtos }) => {
            const valor = produtos.reduce((acc, produto) => acc + produto.preco, 0);
            const [pedidoId] = await knex("pedido").insert({ dataHora, valor });

            const pedidoItens = await Promise.all(
                produtos.map(async (produto) => {
                    const [pedidoItemId] = await knex("pedido_itens").insert({
                        pedido_id: pedidoId,
                        produto_id: produto.id,
                        preco: produto.preco,
                    });

                    const pedidoItem = await knex("pedido_itens")
                        .where("id", pedidoItemId)
                        .first();

                    const produtoDoPedido = await knex("produtos")
                        .where("id", produto.id)
                        .first();

                    return {
                        id: pedidoItem.id,
                        produto: produtoDoPedido,
                        preco: pedidoItem.preco,
                    };
                })
            );

            const novoPedido = await knex("pedido")
                .where("id", pedidoId)
                .first();

            return {
                id: novoPedido.id,
                dataHora: novoPedido.dataHora,
                valor: novoPedido.valor,
                itens: pedidoItens,
            };
        }
    }
};

export default resolvers;
