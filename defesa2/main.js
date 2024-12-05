const API_URL = "https://deisishop.pythonanywhere.com";
const containerProdutos = document.getElementById('lista-produtos');
const itensCesto = document.getElementById('itens-cesto');
const totalCesto = document.getElementById('total-cesto');
const categoriaSelect = document.getElementById('categoria');
const ordenacaoSelect = document.getElementById('ordenacao');
const pesquisaInput = document.getElementById('pesquisa');
const cupaoInput = document.getElementById('cupao');
const estudanteCheckbox = document.getElementById('estudante');
const nomeInput = document.getElementById('nome');
const resumoCompra = document.getElementById('resumo-compra');
let cesto = {};
let total = 0;

// Função para buscar produtos
function obterProdutos() {
    fetch(`${API_URL}/products/`)
        .then(response => response.json())
        .then(produtos => {
            todosProdutos = produtos;
            renderizarProdutos(produtos);
        });
}

// Função para carregar categorias 
function carregarCategorias() {
    fetch(`${API_URL}/categories/`)
        .then(response => response.json())
        .then(categorias => {
            categorias.forEach(categoria => {
                const option = document.createElement('option');
                option.value = categoria;
                option.textContent = categoria;
                categoriaSelect.appendChild(option);
            });
        });
}

document.getElementById('remover-desc').addEventListener('click', () => {
    const descricoes = document.querySelectorAll('.descricao-produto');
    descricoes.forEach(desc => {
        desc.style.display = desc.style.display === 'none' ? 'block' : 'none';
    });
});

document.getElementById('remove-todos').addEventListener('click', () => {
    const produtosVisiveis = document.querySelectorAll('.produto button');
    produtosVisiveis.forEach(botao => {
        const produtoId = parseInt(botao.dataset.id);
        const produto = todosProdutos.find(p => p.id === produtoId);
        if (produto) {
            removerDoCesto(produtoId);
        }
    });
});

// Função para filtrar produtos
function filtrarProdutos() {
    let url = `${API_URL}/products/`;
    const categoria = categoriaSelect.value;

    fetch(url)
        .then(response => response.json())
        .then(produtos => {
            let filtrados = produtos;

            if (categoria) {
                filtrados = filtrados.filter(produto => produto.category === categoria);
            }

            if (ordenacaoSelect.value === "asc") {
                filtrados.sort((a, b) => a.price - b.price);
            } else if (ordenacaoSelect.value === "desc") {
                filtrados.sort((a, b) => b.price - a.price);
            } else if (ordenacaoSelect.value === "rating") {
                filtrados.sort((a, b) => b.rating.count - a.rating.count);
            }

            const termoPesquisa = pesquisaInput.value.toLowerCase();
            if (termoPesquisa) {
                filtrados = filtrados.filter(produto =>
                    produto.title.toLowerCase().includes(termoPesquisa) ||
                    produto.description.toLowerCase().includes(termoPesquisa)
                );
            }

            renderizarProdutos(filtrados);
        });
}

// Renderizar produtos
function renderizarProdutos(produtos) {
    containerProdutos.innerHTML = '';
    produtos.forEach(produto => {
        const produtoArticle = document.createElement('article');
        produtoArticle.classList.add('produto');

        produtoArticle.innerHTML = `
            <h3>${produto.title}</h3>
            <img src="${produto.image}" alt="${produto.title}">
            <p class="descricao-produto">${produto.description}</p>
            <p><strong>Preço:</strong> ${produto.price.toFixed(2)} €</p>
            <p>
                <strong>Avaliações:</strong> 
                <span>${produto.rating.rate.toFixed(1)} ⭐ (${produto.rating.count} avaliações)</span>
            </p>
            <button data-id="${produto.id}">+ Adicionar ao Cesto</button>
        `;
        containerProdutos.appendChild(produtoArticle);

        const botao = produtoArticle.querySelector('button');
        botao.addEventListener('click', () => {
            adicionarAoCesto(produto);
        });
    });
}

// Funções do cesto
function adicionarAoCesto(produto) {
    if (cesto[produto.id]) {
        cesto[produto.id].quantidade += 1;
    } else {
        cesto[produto.id] = { ...produto, quantidade: 1 };
    }
    salvarCesto();
    atualizarCesto();
}

function removerDoCesto(produtoId) {
    delete cesto[produtoId];
    salvarCesto();
    atualizarCesto();
}

function atualizarCesto() {
    itensCesto.innerHTML = '';
    total = 0;
    Object.values(cesto).forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
            <section style="text-align: center; margin-bottom: 10px;">
                <h3 style="font-size: 16px; margin: 5px 0;">${item.title}</h3>
                <img src="${item.image}" alt="${item.title}" style="width: 150px; height: auto; margin-bottom: 10px;">
                <p style="margin: 5px 0; font-weight: bold;">Custo total: ${(item.price * item.quantidade).toFixed(2)} €</p>
                <p style="margin: 5px 0;">Quantidade: ${item.quantidade}</p>
                <p>
                <strong>Avaliações:</strong> 
                <span>${item.rating.rate.toFixed(1)} ⭐ (${item.rating.count} avaliações)</span>
                </p>
                <button class="remover" data-id="${item.id}" style="background-color: #ff4d4d; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 5px;">
                  - Remover do Cesto
                </button>
            </section>
        `;
        itensCesto.appendChild(li);

        li.querySelector('.remover').addEventListener('click', () => {
            removerDoCesto(item.id);
        });

        total += item.price * item.quantidade;
    });
    totalCesto.textContent = `Total: ${total.toFixed(2)} €`;
}

function salvarCesto() {
    localStorage.setItem('cesto', JSON.stringify(cesto));
}

function realizarCompra() {
    const estudante = estudanteCheckbox.checked;
    const cupao = cupaoInput.value.trim();
    const nome = nomeInput.value.trim();

    fetch(`${API_URL}/buy/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            products: Object.keys(cesto).map(id => parseInt(id)),
            student: estudante,
            coupon: cupao || null,
            name: nome || null
        })
    })
        .then(response => response.json())
        .then(resultado => {
            resumoCompra.innerHTML = `
            <p><strong>Referência de Pagamento:</strong> ${resultado.reference}</p>
            <p><strong>Total com Descontos:</strong> ${resultado.totalCost} €</p>
            <p><strong>Mensagem:</strong> ${resultado.message}</p>
        `;

            cesto = {};
            salvarCesto();
            atualizarCesto();
        });
}

document.getElementById('comprar').addEventListener('click', realizarCompra);

// Eventos de filtros e pesquisa
categoriaSelect.addEventListener('change', filtrarProdutos);
ordenacaoSelect.addEventListener('change', filtrarProdutos);
pesquisaInput.addEventListener('input', filtrarProdutos);

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    obterProdutos();
    carregarCategorias();
    const cestoSalvo = localStorage.getItem('cesto');
    if (cestoSalvo) cesto = JSON.parse(cestoSalvo);
    atualizarCesto();
});
