// Selecionar elementos principais
const containerProdutos = document.getElementById('lista-produtos');
const itensCesto = document.getElementById('itens-cesto');
const totalCesto = document.getElementById('total-cesto');

// Variáveis globais
let total = 0;
let cesto = {}; // Objeto para armazenar os itens no cesto

// Renderizar os produtos na página
produtos.forEach(produto => {
  // Criar o card de produto
  const produtoArticle = document.createElement('article');
  produtoArticle.classList.add('produto');

  produtoArticle.innerHTML = `
    <h3>${produto.title}</h3>
    <img src="${produto.image}" alt="${produto.title}">
    <p class="descricao-produto">${produto.description}</p>
    <p><strong>Custo total:</strong> ${produto.price.toFixed(2)} €</p>
    <button data-id="${produto.id}">+ Adicionar ao Cesto</button>
  `;

  // Adicionar o produto ao container
  containerProdutos.appendChild(produtoArticle);

  // Evento de clique no botão
  const botao = produtoArticle.querySelector('button');
  botao.addEventListener('click', () => {
    adicionarAoCesto(produto);
  });
});

function adicionarAoCesto(produto) {
  // Adicionar ou atualizar o produto no cesto
  if (cesto[produto.id]) {
    cesto[produto.id].quantidade += 1;
  } else {
    cesto[produto.id] = { ...produto, quantidade: 1 };
  }

  // Salvar o cesto no localStorage
  salvarCesto();

  // Atualizar a exibição do cesto
  atualizarCesto();
}

function removerDoCesto(produtoId) {
  if (cesto[produtoId]) {
    delete cesto[produtoId];
    salvarCesto();
    atualizarCesto();
  }
}

function atualizarCesto() {
  // Limpar o cesto antes de renderizar
  itensCesto.innerHTML = '';
  total = 0;

  // Adicionar os itens ao cesto
  Object.values(cesto).forEach(item => {
    const li = document.createElement('li');
    li.style.listStyle = 'none';

    li.innerHTML = `
      <section style="text-align: center; margin-bottom: 10px;">
        <h3 style="font-size: 16px; margin: 5px 0;">${item.title}</h3>
        <img src="${item.image}" alt="${item.title}" style="width: 150px; height: auto; margin-bottom: 10px;">
        <p style="margin: 5px 0; font-weight: bold;">Custo total: ${(item.price * item.quantidade).toFixed(2)} €</p>
        <p style="margin: 5px 0;">Quantidade: ${item.quantidade}</p>
        <button class="remover" data-id="${item.id}" style="background-color: #ff4d4d; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 5px;">
          - Remover do Cesto
        </button>
      </section>
    `;

    itensCesto.appendChild(li);

    // Atualizar o total
    total += item.price * item.quantidade;

    // Evento para remover itens
    const botaoRemover = li.querySelector('.remover');
    botaoRemover.addEventListener('click', () => {
      removerDoCesto(item.id);
    });
  });

  // Atualizar o total no HTML
  totalCesto.textContent = `Total: ${total.toFixed(2)} €`;
}

function salvarCesto() {
  localStorage.setItem('cesto', JSON.stringify(cesto));
}

// Carregar o cesto ao iniciar a página
document.addEventListener('DOMContentLoaded', () => {
  const cestoSalvo = localStorage.getItem('cesto');
  if (cestoSalvo) {
    cesto = JSON.parse(cestoSalvo);
    atualizarCesto();
  }
});