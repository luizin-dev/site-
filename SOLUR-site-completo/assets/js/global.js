/* =====================================================
   SOLUR — UTILITÁRIOS GLOBAIS
   Ícones, toast, badges, favoritos, busca, cards e menu
   ===================================================== */

/* ---------- ícones (SVG inline) ---------- */

const SOLUR_ICONE_BUSCA =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>';

const SOLUR_ICONE_SACOLA =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 7h12l1 14H5L6 7Z"/><path d="M9 7a3 3 0 0 1 6 0v3H9V7Z"/></svg>';

const SOLUR_ICONE_CORACAO =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 20s-7-4.6-9.2-8.6C1.2 8.5 3 5 6.5 5c2 0 3.4 1.1 4.2 2.4h2.6C14.1 6.1 15.5 5 17.5 5 21 5 22.8 8.5 21.2 11.4 19 15.4 12 20 12 20Z"/></svg>';

const SOLUR_ICONE_MENU =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';

/* ---------- toast ---------- */

function solurToast(mensagem, tipo) {
    let area = document.querySelector(".toast-area");

    if (!area) {
        area = document.createElement("div");
        area.className = "toast-area";
        document.body.appendChild(area);
    }

    const toast = document.createElement("div");
    toast.className = "toast" + (tipo === "erro" ? " erro" : "");
    toast.textContent = mensagem;
    area.appendChild(toast);

    setTimeout(function () {
        toast.style.transition = "0.4s";
        toast.style.opacity = "0";
        toast.style.transform = "translateY(10px)";
        setTimeout(function () {
            toast.remove();
        }, 400);
    }, 2600);
}

/* ---------- favoritos ---------- */

function solurFavoritosObter() {
    try {
        const dados = JSON.parse(localStorage.getItem("solur_favoritos"));
        return Array.isArray(dados) ? dados : [];
    } catch (e) {
        return [];
    }
}

function solurFavoritoContem(id) {
    return solurFavoritosObter().indexOf(Number(id)) !== -1;
}

function solurFavoritoAlternar(id) {
    let favoritos = solurFavoritosObter();
    id = Number(id);

    const posicao = favoritos.indexOf(id);

    if (posicao === -1) {
        favoritos.push(id);
        solurToast("Adicionado aos favoritos.");
    } else {
        favoritos.splice(posicao, 1);
        solurToast("Removido dos favoritos.");
    }

    localStorage.setItem("solur_favoritos", JSON.stringify(favoritos));
    solurAtualizarBadges();
    solurSincronizarCoracoes();
    return posicao === -1;
}

function solurSincronizarCoracoes() {
    document.querySelectorAll("[data-favorito]").forEach(function (botao) {
        botao.classList.toggle("favorito", solurFavoritoContem(botao.dataset.favorito));
    });
}

/* ---------- badges do header ---------- */

function solurAtualizarBadges() {
    const badgeCarrinho = document.getElementById("badgeCarrinho");
    const badgeFavoritos = document.getElementById("badgeFavoritos");

    if (badgeCarrinho) {
        const qtd = carrinhoContagem();
        badgeCarrinho.textContent = qtd;
        badgeCarrinho.hidden = qtd === 0;
    }

    if (badgeFavoritos) {
        const qtd = solurFavoritosObter().length;
        badgeFavoritos.textContent = qtd;
        badgeFavoritos.hidden = qtd === 0;
    }
}

/* ---------- card de produto ---------- */

function solurCardProduto(produto) {
    const desconto = solurDescontoPercentual(produto);

    let selo = "";
    if (desconto > 0) {
        selo = '<span class="selo">-' + desconto + "%</span>";
    } else if (produto.novo) {
        selo = '<span class="selo selo-novo">NOVO</span>';
    }

    return (
        '<article class="produto" data-id="' + produto.id + '">' +
        '<div class="produto-imagem">' +
        selo +
        '<button class="favoritar" data-favorito="' + produto.id + '" aria-label="Favoritar ' + produto.nome + '">' +
        SOLUR_ICONE_CORACAO +
        "</button>" +
        '<a href="../Página de Compra/compra.html?id=' + produto.id + '" aria-label="Ver ' + produto.nome + '">' +
        '<img src="' + produto.imagens[0] + '" alt="' + produto.nome + '" loading="lazy">' +
        "</a>" +
        "</div>" +
        '<div class="produto-corpo">' +
        '<span class="produto-categoria">' + SOLUR_CATEGORIAS[produto.categoria] + "</span>" +
        '<h3 class="produto-nome"><a href="../Página de Compra/compra.html?id=' + produto.id + '">' + produto.nome + "</a></h3>" +
        '<div class="produto-precos">' +
        '<span class="produto-preco">' + solurFormatarPreco(produto.preco) + "</span>" +
        (produto.precoAntigo ? '<span class="produto-preco-antigo">' + solurFormatarPreco(produto.precoAntigo) + "</span>" : "") +
        "</div>" +
        '<div class="produto-acoes">' +
        '<button class="botao" data-adicionar="' + produto.id + '">Adicionar</button>' +
        '<a class="botao-fantasma botao-ver" href="../Página de Compra/compra.html?id=' + produto.id + '" aria-label="Ver produto">Ver</a>' +
        "</div>" +
        "</div>" +
        "</article>"
    );
}

function solurRenderizarGrade(container, produtos) {
    if (!container) return;

    if (produtos.length === 0) {
        container.innerHTML = '<p class="mensagem-vazia">Nenhum produto encontrado nas trevas.</p>';
        return;
    }

    container.innerHTML = produtos.map(solurCardProduto).join("");
    solurSincronizarCoracoes();
}

/* ---------- adição rápida ao carrinho ---------- */

function solurAdicaoRapida(id) {
    const produto = solurBuscarProduto(id);
    if (!produto) return;

    if (produto.tamanhos && produto.tamanhos.length > 0) {
        solurToast("Escolha o tamanho na página do produto.");
        window.location.href = "../Página de Compra/compra.html?id=" + produto.id;
        return;
    }

    carrinhoAdicionar(produto.id, null, 1);
    solurToast(produto.nome + " adicionado à sacola.");
    abrirDrawer();
}

/* ---------- inicialização global ---------- */

document.addEventListener("DOMContentLoaded", function () {
    /* menu mobile */
    const botaoMenu = document.getElementById("botaoMenuMobile");
    const menu = document.querySelector(".menu");

    if (botaoMenu && menu) {
        botaoMenu.addEventListener("click", function () {
            menu.classList.toggle("aberto");
        });
    }

    /* busca do header */
    document.querySelectorAll("form.campo-busca").forEach(function (formulario) {
        formulario.addEventListener("submit", function (evento) {
            if (window.SOLUR_BUSCA_LOCAL) return;

            evento.preventDefault();
            const termo = formulario.querySelector("input").value.trim();
            window.location.href =
                "../Página de Produtos/produtos.html" + (termo ? "?q=" + encodeURIComponent(termo) : "");
        });
    });

    /* delegação: favoritos e adição rápida */
    document.addEventListener("click", function (evento) {
        const coracao = evento.target.closest("[data-favorito]");
        if (coracao) {
            evento.preventDefault();
            solurFavoritoAlternar(coracao.dataset.favorito);
            return;
        }

        const adicionar = evento.target.closest("[data-adicionar]");
        if (adicionar) {
            evento.preventDefault();
            solurAdicaoRapida(adicionar.dataset.adicionar);
        }
    });

    /* ano automático no rodapé */
    document.querySelectorAll("[data-ano]").forEach(function (el) {
        el.textContent = new Date().getFullYear();
    });

    solurAtualizarBadges();
    solurSincronizarCoracoes();
});
