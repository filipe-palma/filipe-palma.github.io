const API_URL = "https://deisishop.pythonanywhere.com";
const containerProdutos = document.getElementById('lista-produtos');
const itensCesto = document.getElementById('itens-cesto');
const totalCesto = document.getElementById('total-cesto');
const categoriaSelect = document.getElementById('categoria');
const ordenacaoSelect = document.getElementById('ordenacao');
const pesquisaInput = document.getElementById('pesquisa');
const cupaoInput = document.getElementById('cupao');
const estudanteCheckbox = document.getElementById('estudante');
const resumoCompra = document.getElementById('resumo-compra');
let cesto = {};
let total = 0;

// Função para buscar produtos
async function obterProdutos() {
    try {
        const response = await fetch(`${API_URL}/products/`);
        if (!response.ok) throw new Error("Erro ao buscar produtos.");
        const produtos = await response.json();
        renderizarProdutos(produtos);
    } catch (error) {
        console.error(error);
    }
}

// Função para carregar categorias
async function carregarCategorias() {
    try {
        const response = await fetch(`${API_URL}/categories/`);
        if (!response.ok) throw new Error("Erro ao buscar categorias.");
        const categorias = await response.json();
        categorias.forEach(categoria => {
            const option = document.createElement('option');
            option.value = categoria;
            option.textContent = categoria;
            categoriaSelect.appendChild(option);
        });
    } catch (error) {
        console.error(error);
    }
}

// Função para filtrar produtos
async function filtrarProdutos() {
    let url = `${API_URL}/products/`;
    const categoria = categoriaSelect.value;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Erro ao filtrar produtos.");
        const produtos = await response.json();

        let filtrados = produtos;

        if (categoria) {
            filtrados = filtrados.filter(produto => produto.category === categoria);
        }

        if (ordenacaoSelect.value === "asc") {
            filtrados.sort((a, b) => a.price - b.price);
        } else if (ordenacaoSelect.value === "desc") {
            filtrados.sort((a, b) => b.price - a.price);
        }

        const termoPesquisa = pesquisaInput.value.toLowerCase();
        if (termoPesquisa) {
            filtrados = filtrados.filter(produto =>
                produto.title.toLowerCase().includes(termoPesquisa)
            );
        }

        renderizarProdutos(filtrados);
    } catch (error) {
        console.error(error);
    }
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

async function realizarCompra() {
    const estudante = estudanteCheckbox.checked;
    const cupao = cupaoInput.value.trim();

    try {
        const response = await fetch(`${API_URL}/buy/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                products: Object.keys(cesto).map(id => parseInt(id)),
                student: estudante,
                coupon: cupao || null
            })
        });

        if (!response.ok) throw new Error("Erro ao realizar compra.");
        const resultado = await response.json();

        resumoCompra.innerHTML = `
            <p><strong>Referência de Pagamento:</strong> ${resultado.reference}</p>
            <p><strong>Total com Descontos:</strong> ${resultado.totalCost} €</p>
        `;

        cesto = {};
        salvarCesto();
        atualizarCesto();
    } catch (error) {
        console.error(error);
        resumoCompra.innerHTML = `<p style="color: red;">Erro ao processar a compra.</p>`;
    }
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
