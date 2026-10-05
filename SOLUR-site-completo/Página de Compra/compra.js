/* =====================================================
   SOLUR — PÁGINA DE COMPRA
   Carrega o produto pelo ?id=, galeria, tamanhos,
   quantidade, sacola e relacionados
   ===================================================== */

const parametros = new URLSearchParams(window.location.search);
const produtoAtual = solurBuscarProduto(parametros.get("id")) || SOLUR_PRODUTOS[0];

let tamanhoSelecionado = null;
let quantidadeAtual = 1;

/* ---------- carregamento ---------- */

function carregarProduto() {
    document.title = produtoAtual.nome + " — SOLUR";

    document.getElementById("categoriaProduto").textContent =
        SOLUR_CATEGORIAS[produtoAtual.categoria];

    document.getElementById("nomeProduto").textContent = produtoAtual.nome;
    document.getElementById("precoProduto").textContent =
        solurFormatarPreco(produtoAtual.preco);

    const desconto = solurDescontoPercentual(produtoAtual);
    const selo = document.getElementById("seloDesconto");
    const precoAntigo = document.getElementById("precoAntigo");

    if (desconto > 0) {
        selo.textContent = "-" + desconto + "%";
        selo.hidden = false;
        precoAntigo.textContent = solurFormatarPreco(produtoAtual.precoAntigo);
        precoAntigo.hidden = false;
    }

    document.getElementById("parcelamento").textContent =
        "ou 3x de " + solurFormatarPreco(produtoAtual.preco / 3) + " sem juros";

    document.getElementById("descricaoProduto").textContent = produtoAtual.descricao;

    /* trilha de navegação */
    const trilhaCategoria = document.getElementById("trilhaCategoria");
    trilhaCategoria.textContent = SOLUR_CATEGORIAS[produtoAtual.categoria];
    trilhaCategoria.href =
        "../Página de Produtos/produtos.html?cat=" + produtoAtual.categoria;
    document.getElementById("trilhaNome").textContent = produtoAtual.nome;

    criarMiniaturas();
    configurarTamanhos();
    sincronizarFavorito();
    carregarRelacionados();
}

/* ---------- galeria ---------- */

function criarMiniaturas() {
    const area = document.getElementById("miniaturas");
    area.innerHTML = "";

    if (produtoAtual.imagens.length <= 1) {
        area.style.display = "none";
    }

    produtoAtual.imagens.forEach(function (src, indice) {
        const imagem = document.createElement("img");
        imagem.src = src;
        imagem.alt = produtoAtual.nome + " — foto " + (indice + 1);
        imagem.onclick = function () {
            trocarImagem(imagem);
        };
        area.appendChild(imagem);
    });

    const primeira = area.querySelector("img");
    if (primeira) trocarImagem(primeira);
}

function trocarImagem(imagem) {
    const principal = document.getElementById("imagemPrincipal");
    principal.src = imagem.src;
    principal.alt = imagem.alt;

    document.querySelectorAll(".miniaturas img").forEach(function (item) {
        item.classList.remove("selecionada");
    });
    imagem.classList.add("selecionada");
}

/* ---------- tamanhos ---------- */

function configurarTamanhos() {
    const area = document.getElementById("areaTamanhos");
    const container = document.getElementById("tamanhos");
    container.innerHTML = "";
    tamanhoSelecionado = null;

    if (!produtoAtual.tamanhos || produtoAtual.tamanhos.length === 0) {
        area.style.display = "none";
        return;
    }

    area.style.display = "block";

    produtoAtual.tamanhos.forEach(function (tamanho) {
        const botao = document.createElement("button");
        botao.textContent = tamanho;
        botao.onclick = function () {
            tamanhoSelecionado = tamanho;

            document.querySelectorAll(".tamanhos button").forEach(function (item) {
                item.classList.remove("selecionado");
            });
            botao.classList.add("selecionado");
        };
        container.appendChild(botao);
    });
}

/* ---------- quantidade ---------- */

function mudarQuantidade(delta) {
    quantidadeAtual = Math.min(99, Math.max(1, quantidadeAtual + delta));
    document.getElementById("quantidadeAtual").textContent = quantidadeAtual;
}

/* ---------- sacola ---------- */

function adicionarAoCarrinho() {
    if (produtoAtual.tamanhos && produtoAtual.tamanhos.length > 0 && !tamanhoSelecionado) {
        solurToast("Escolha um tamanho antes de continuar.", "erro");
        return false;
    }

    carrinhoAdicionar(produtoAtual.id, tamanhoSelecionado, quantidadeAtual);
    solurToast(produtoAtual.nome + " adicionado à sacola.");
    abrirDrawer();
    return true;
}

function comprarAgora() {
    if (adicionarAoCarrinho()) {
        fecharDrawer();
        window.location.href = "../Página de Carrinho/carrinho.html";
    }
}

/* ---------- favorito ---------- */

function sincronizarFavorito() {
    const botao = document.getElementById("botaoFavorito");
    const favorito = solurFavoritoContem(produtoAtual.id);
    botao.classList.toggle("favorito", favorito);
    botao.textContent = favorito ? "♥ REMOVER DOS FAVORITOS" : "♥ ADICIONAR AOS FAVORITOS";
}

function favoritarProduto() {
    solurFavoritoAlternar(produtoAtual.id);
    sincronizarFavorito();
}

/* ---------- relacionados ---------- */

function carregarRelacionados() {
    const relacionados = SOLUR_PRODUTOS.filter(function (produto) {
        return produto.categoria === produtoAtual.categoria &&
            produto.id !== produtoAtual.id;
    }).slice(0, 4);

    if (relacionados.length === 0) {
        document.querySelector(".secao-relacionados").style.display = "none";
        return;
    }

    solurRenderizarGrade(document.getElementById("gradeRelacionados"), relacionados);
}

document.addEventListener("DOMContentLoaded", carregarProduto);
