// Selecionar elementos principais
const containerProdutos = document.getElementById('lista-produtos');
const itensCesto = document.getElementById('itens-cesto');
const totalCesto = document.getElementById('total-cesto');

// Variáveis globais
let total = 0;

// Renderizar os produtos na página
produtos.forEach(produto => {
  // Criar o card de produto
  const produtoDiv = document.createElement('div');
  produtoDiv.classList.add('produto');

  produtoDiv.innerHTML = `
  <h3>${produto.title}</h3>
  <img src="${produto.image}" alt="${produto.title}">
  <p>${produto.description}</p>
  <p><strong>Custo total:</strong> ${produto.price.toFixed(2)} €</p>
  <button data-id="${produto.id}">+ Adicionar ao Cesto</button>
`;

  // Adicionar o produto ao container
  containerProdutos.appendChild(produtoDiv);

  // Evento de clique no botão
  const botao = produtoDiv.querySelector('button');
  botao.addEventListener('click', () => {
    adicionarAoCesto(produto);
  });
});

// Função para adicionar itens ao cesto
function adicionarAoCesto(produto) {
  const item = document.createElement('li');
  item.textContent = `${produto.title} - ${produto.price.toFixed(2)} €`;
  itensCesto.appendChild(item);

  total += produto.price;
  totalCesto.textContent = `Total: ${total.toFixed(2)} €`;
}
