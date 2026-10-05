/* =====================================================
   SOLUR — PÁGINA DE PRODUTOS
   Filtros, busca local, ordenação e favoritos
   ===================================================== */

window.SOLUR_BUSCA_LOCAL = true;

const estadoProdutos = {
    categoria: "todos",
    busca: "",
    somenteFavoritos: false,
    ordem: "relevancia"
};

/* ---------- aplicação dos filtros ---------- */

function aplicarFiltros() {
    estadoProdutos.ordem = document.getElementById("ordenar").value;

    let lista = SOLUR_PRODUTOS.filter(function (produto) {
        if (estadoProdutos.categoria !== "todos" &&
            produto.categoria !== estadoProdutos.categoria) {
            return false;
        }

        if (estadoProdutos.somenteFavoritos && !solurFavoritoContem(produto.id)) {
            return false;
        }

        if (estadoProdutos.busca) {
            const alvo = (produto.nome + " " + SOLUR_CATEGORIAS[produto.categoria])
                .toLowerCase();
            if (alvo.indexOf(estadoProdutos.busca) === -1) return false;
        }

        return true;
    });

    if (estadoProdutos.ordem === "menor-preco") {
        lista.sort(function (a, b) { return a.preco - b.preco; });
    } else if (estadoProdutos.ordem === "maior-preco") {
        lista.sort(function (a, b) { return b.preco - a.preco; });
    } else if (estadoProdutos.ordem === "nome") {
        lista.sort(function (a, b) { return a.nome.localeCompare(b.nome, "pt-BR"); });
    }

    solurRenderizarGrade(document.getElementById("gradeProdutos"), lista);

    const contagem = document.getElementById("contagemResultados");
    contagem.textContent =
        lista.length + (lista.length === 1 ? " peça encontrada" : " peças encontradas");

    marcarCategoriaSelecionada();
}

/* ---------- categorias ---------- */

function abrirCategorias() {
    document.getElementById("menuCategorias").classList.toggle("aberto");
}

function filtrarCategoria(categoria) {
    estadoProdutos.categoria = categoria;
    document.getElementById("menuCategorias").classList.remove("aberto");
    aplicarFiltros();
}

function marcarCategoriaSelecionada() {
    document.querySelectorAll("#menuCategorias button").forEach(function (botao) {
        const chamada = botao.getAttribute("onclick") || "";
        botao.classList.toggle(
            "selecionada",
            chamada.indexOf("'" + estadoProdutos.categoria + "'") !== -1
        );
    });
}

/* ---------- favoritos ---------- */

function alternarFiltroFavoritos() {
    estadoProdutos.somenteFavoritos = !estadoProdutos.somenteFavoritos;
    document.getElementById("chipFavoritos").classList.toggle(
        "ativo",
        estadoProdutos.somenteFavoritos
    );
    aplicarFiltros();
}

/* re-renderiza ao favoritar, para respeitar o filtro "só favoritos" */
document.addEventListener("click", function (evento) {
    if (evento.target.closest("[data-favorito]") && estadoProdutos.somenteFavoritos) {
        aplicarFiltros();
    }
});

/* ---------- inicialização ---------- */

document.addEventListener("DOMContentLoaded", function () {
    const parametros = new URLSearchParams(window.location.search);

    const categoria = parametros.get("cat");
    if (categoria && SOLUR_CATEGORIAS[categoria]) {
        estadoProdutos.categoria = categoria;
    }

    if (parametros.get("filtro") === "favoritos") {
        estadoProdutos.somenteFavoritos = true;
        document.getElementById("chipFavoritos").classList.add("ativo");
    }

    const termo = parametros.get("q");
    if (termo) {
        estadoProdutos.busca = termo.toLowerCase();
        document.getElementById("pesquisa").value = termo;
    }

    /* busca local ao digitar */
    const inputPesquisa = document.getElementById("pesquisa");

    inputPesquisa.addEventListener("input", function () {
        estadoProdutos.busca = inputPesquisa.value.trim().toLowerCase();
        aplicarFiltros();
    });

    document.querySelector("form.campo-busca").addEventListener("submit", function (evento) {
        evento.preventDefault();
        estadoProdutos.busca = inputPesquisa.value.trim().toLowerCase();
        aplicarFiltros();
    });

    /* fecha o dropdown de categorias ao clicar fora */
    document.addEventListener("click", function (evento) {
        if (!evento.target.closest(".area-categorias")) {
            document.getElementById("menuCategorias").classList.remove("aberto");
        }
    });

    aplicarFiltros();
});
