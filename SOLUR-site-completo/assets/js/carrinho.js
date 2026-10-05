/* =====================================================
   SOLUR — CARRINHO DE COMPRAS
   Persistência em localStorage + drawer lateral + cupons
   ===================================================== */

const SOLUR_CHAVE_CARRINHO = "solur_carrinho";
const SOLUR_CHAVE_CUPOM = "solur_cupom";

const SOLUR_CUPONS = {
    SOLUR10: { descricao: "10% de desconto", minimo: 0, percentual: 10 },
    CAVEIRA15: { descricao: "15% acima de R$ 200", minimo: 200, percentual: 15 }
};

/* ---------- armazenamento ---------- */

function carrinhoObter() {
    try {
        const dados = JSON.parse(localStorage.getItem(SOLUR_CHAVE_CARRINHO));
        return Array.isArray(dados) ? dados : [];
    } catch (e) {
        return [];
    }
}

function carrinhoSalvar(itens) {
    localStorage.setItem(SOLUR_CHAVE_CARRINHO, JSON.stringify(itens));
    solurAtualizarBadges();
    renderizarDrawer();
}

function carrinhoContagem() {
    return carrinhoObter().reduce(function (total, item) {
        return total + item.qtd;
    }, 0);
}

/* ---------- operações ---------- */

function carrinhoAdicionar(id, tamanho, qtd) {
    qtd = qtd || 1;

    const itens = carrinhoObter();
    const existente = itens.find(function (item) {
        return item.id === Number(id) && (item.tamanho || null) === (tamanho || null);
    });

    if (existente) {
        existente.qtd += qtd;
    } else {
        itens.push({ id: Number(id), tamanho: tamanho || null, qtd: qtd });
    }

    carrinhoSalvar(itens);
}

function carrinhoRemover(indice) {
    const itens = carrinhoObter();
    itens.splice(indice, 1);
    carrinhoSalvar(itens);
}

function carrinhoAlterarQtd(indice, delta) {
    const itens = carrinhoObter();
    if (!itens[indice]) return;

    itens[indice].qtd += delta;

    if (itens[indice].qtd <= 0) {
        itens.splice(indice, 1);
    }

    carrinhoSalvar(itens);
}

function carrinhoLimpar() {
    localStorage.removeItem(SOLUR_CHAVE_CARRINHO);
    localStorage.removeItem(SOLUR_CHAVE_CUPOM);
    solurAtualizarBadges();
    renderizarDrawer();
}

/* ---------- cupom ---------- */

function carrinhoCupomAtual() {
    return localStorage.getItem(SOLUR_CHAVE_CUPOM);
}

function carrinhoAplicarCupom(codigo) {
    const cupom = SOLUR_CUPONS[codigo.trim().toUpperCase()];
    if (!cupom) return { ok: false, mensagem: "Cupom inválido." };

    if (carrinhoTotais().subtotal < cupom.minimo) {
        return {
            ok: false,
            mensagem: "Este cupom exige pedido mínimo de " + solurFormatarPreco(cupom.minimo) + "."
        };
    }

    localStorage.setItem(SOLUR_CHAVE_CUPOM, codigo.trim().toUpperCase());
    return { ok: true, mensagem: "Cupom aplicado: " + cupom.descricao + "." };
}

function carrinhoRemoverCupom() {
    localStorage.removeItem(SOLUR_CHAVE_CUPOM);
}

/* ---------- totais ---------- */

function carrinhoTotais() {
    const itens = carrinhoObter();

    let subtotal = 0;

    itens.forEach(function (item) {
        const produto = solurBuscarProduto(item.id);
        if (produto) subtotal += produto.preco * item.qtd;
    });

    let desconto = 0;
    const codigoCupom = carrinhoCupomAtual();

    if (codigoCupom && SOLUR_CUPONS[codigoCupom]) {
        const cupom = SOLUR_CUPONS[codigoCupom];
        if (subtotal >= cupom.minimo) {
            desconto = subtotal * (cupom.percentual / 100);
        }
    }

    return {
        subtotal: subtotal,
        desconto: desconto,
        total: subtotal - desconto,
        cupom: codigoCupom
    };
}

/* ---------- drawer (gaveta lateral) ---------- */

function injetarDrawer() {
    if (document.querySelector(".carrinho-drawer")) return;

    const overlay = document.createElement("div");
    overlay.className = "carrinho-overlay";
    overlay.id = "carrinhoOverlay";
    overlay.onclick = fecharDrawer;

    const drawer = document.createElement("aside");
    drawer.className = "carrinho-drawer";
    drawer.id = "carrinhoDrawer";
    drawer.setAttribute("aria-label", "Carrinho de compras");
    drawer.innerHTML =
        '<header>' +
        '   <h2>SUA SACOLA</h2>' +
        '   <button class="fechar-drawer" onclick="fecharDrawer()" aria-label="Fechar carrinho">&times;</button>' +
        "</header>" +
        '<div class="carrinho-itens" id="carrinhoItens"></div>' +
        '<div class="carrinho-rodape" id="carrinhoRodape"></div>';

    document.body.appendChild(overlay);
    document.body.appendChild(drawer);

    renderizarDrawer();
}

function abrirDrawer() {
    injetarDrawer();
    document.getElementById("carrinhoDrawer").classList.add("aberto");
    document.getElementById("carrinhoOverlay").classList.add("aberto");
    document.body.style.overflow = "hidden";
}

function fecharDrawer() {
    const drawer = document.getElementById("carrinhoDrawer");
    const overlay = document.getElementById("carrinhoOverlay");
    if (!drawer) return;

    drawer.classList.remove("aberto");
    overlay.classList.remove("aberto");
    document.body.style.overflow = "";
}

function renderizarDrawer() {
    const area = document.getElementById("carrinhoItens");
    const rodape = document.getElementById("carrinhoRodape");
    if (!area || !rodape) return;

    const itens = carrinhoObter();

    if (itens.length === 0) {
        area.innerHTML =
            '<div class="carrinho-vazio">' +
            SOLUR_ICONE_SACOLA +
            "<p>Sua sacola está vazia.<br>As trevas aguardam suas escolhas.</p>" +
            '<a class="botao-fantasma" href="../Página de Produtos/produtos.html">VER PRODUTOS</a>' +
            "</div>";
        rodape.innerHTML = "";
        return;
    }

    area.innerHTML = itens.map(function (item, indice) {
        const produto = solurBuscarProduto(item.id);
        if (!produto) return "";

        return (
            '<div class="item-carrinho">' +
            '<img src="' + produto.imagens[0] + '" alt="' + produto.nome + '">' +
            '<div class="item-carrinho-info">' +
            "<h4>" + produto.nome + "</h4>" +
            (item.tamanho ? '<span class="detalhe">Tam. ' + item.tamanho + "</span>" : "") +
            '<div class="item-carrinho-rodape">' +
            '<div class="controle-qtd">' +
            '<button onclick="carrinhoAlterarQtd(' + indice + ', -1)" aria-label="Diminuir">&minus;</button>' +
            "<span>" + item.qtd + "</span>" +
            '<button onclick="carrinhoAlterarQtd(' + indice + ', 1)" aria-label="Aumentar">+</button>' +
            "</div>" +
            '<span class="item-carrinho-preco">' + solurFormatarPreco(produto.preco * item.qtd) + "</span>" +
            "</div>" +
            '<button class="remover-item" onclick="carrinhoRemover(' + indice + ')">Remover</button>' +
            "</div>" +
            "</div>"
        );
    }).join("");

    const totais = carrinhoTotais();

    rodape.innerHTML =
        '<div class="linha-total"><span>Subtotal</span><span>' + solurFormatarPreco(totais.subtotal) + "</span></div>" +
        (totais.desconto > 0
            ? '<div class="linha-total"><span>Cupom ' + totais.cupom + "</span><span>-" + solurFormatarPreco(totais.desconto) + "</span></div>"
            : "") +
        '<div class="linha-total"><span>Frete</span><span>GRÁTIS</span></div>' +
        '<div class="linha-total forte"><span>Total</span><span>' + solurFormatarPreco(totais.total) + "</span></div>" +
        '<a class="botao" href="../Página de Carrinho/carrinho.html">FINALIZAR COMPRA</a>' +
        '<button class="botao-fantasma" onclick="fecharDrawer()">CONTINUAR COMPRANDO</button>';
}

document.addEventListener("DOMContentLoaded", function () {
    injetarDrawer();
    solurAtualizarBadges();
});
