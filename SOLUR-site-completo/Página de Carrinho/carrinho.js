/* =====================================================
   SOLUR — PÁGINA DE SACOLA / CHECKOUT
   Etapas: sacola → entrega/pagamento → confirmação
   ===================================================== */

let etapaAtual = 1;

/* ---------- etapas ---------- */

function mostrarEtapa(numero) {
    etapaAtual = numero;

    document.getElementById("etapaSacola").hidden = numero !== 1;
    document.getElementById("etapaCheckout").hidden = numero !== 2;
    document.getElementById("etapaConfirmacao").hidden = numero !== 3;

    document.querySelectorAll(".etapa").forEach(function (etapa) {
        etapa.classList.toggle("ativa", Number(etapa.dataset.etapa) <= numero);
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ---------- etapa 1: sacola ---------- */

function renderizarSacola() {
    const lista = document.getElementById("listaItens");
    const itens = carrinhoObter();

    if (itens.length === 0) {
        lista.innerHTML =
            '<div class="sacola-vazia">' +
            SOLUR_ICONE_SACOLA +
            "<p>Sua sacola está vazia.</p>" +
            '<a class="botao" href="../Página de Produtos/produtos.html">VER PRODUTOS</a>' +
            "</div>";
        document.getElementById("botaoContinuar").disabled = true;
    } else {
        document.getElementById("botaoContinuar").disabled = false;

        lista.innerHTML = itens.map(function (item, indice) {
            const produto = solurBuscarProduto(item.id);
            if (!produto) return "";

            return (
                '<div class="item-sacola">' +
                '<img src="' + produto.imagens[0] + '" alt="' + produto.nome + '">' +
                '<div class="item-sacola-info">' +
                '<h3><a href="../Página de Compra/compra.html?id=' + produto.id + '">' + produto.nome + "</a></h3>" +
                '<span class="detalhe">' + SOLUR_CATEGORIAS[produto.categoria] +
                (item.tamanho ? " • Tam. " + item.tamanho : "") + "</span>" +
                '<span class="detalhe">' + solurFormatarPreco(produto.preco) + " / un.</span>" +
                '<div class="item-sacola-rodape">' +
                '<div class="controle-qtd">' +
                '<button onclick="carrinhoAlterarQtd(' + indice + ', -1)" aria-label="Diminuir">&minus;</button>' +
                "<span>" + item.qtd + "</span>" +
                '<button onclick="carrinhoAlterarQtd(' + indice + ', 1)" aria-label="Aumentar">+</button>' +
                "</div>" +
                '<button class="remover-item" onclick="carrinhoRemover(' + indice + ')">Remover</button>' +
                '<span class="item-sacola-preco">' + solurFormatarPreco(produto.preco * item.qtd) + "</span>" +
                "</div>" +
                "</div>" +
                "</div>"
            );
        }).join("");
    }

    atualizarResumos();
}

function atualizarResumos() {
    const totais = carrinhoTotais();

    document.getElementById("resumoSubtotal").textContent = solurFormatarPreco(totais.subtotal);
    document.getElementById("resumoTotal").textContent = solurFormatarPreco(totais.total);
    document.getElementById("resumoSubtotal2").textContent = solurFormatarPreco(totais.subtotal);
    document.getElementById("resumoTotal2").textContent = solurFormatarPreco(totais.total);

    const linhaDesconto = document.getElementById("linhaDesconto");
    const linhaDesconto2 = document.getElementById("linhaDesconto2");

    linhaDesconto.hidden = totais.desconto <= 0;
    linhaDesconto2.hidden = totais.desconto <= 0;

    if (totais.desconto > 0) {
        document.getElementById("resumoDesconto").textContent = "- " + solurFormatarPreco(totais.desconto);
        document.getElementById("resumoDesconto2").textContent = "- " + solurFormatarPreco(totais.desconto);
    }

    /* desconto PIX no resumo do checkout */
    const formaSelecionada = document.querySelector('input[name="pagamento"]:checked');
    const linhaPix = document.getElementById("linhaPix2");
    const descontoPix = formaSelecionada && formaSelecionada.value === "pix"
        ? totais.total * 0.05
        : 0;

    linhaPix.hidden = descontoPix <= 0;
    document.getElementById("resumoTotal2").textContent =
        solurFormatarPreco(totais.total - descontoPix);

    if (descontoPix > 0) {
        document.getElementById("resumoPix2").textContent = "- " + solurFormatarPreco(descontoPix);
    }

    const status = document.getElementById("cupomStatus");
    if (totais.cupom && status.textContent === "") {
        status.textContent = "Cupom " + totais.cupom + " aplicado.";
        status.className = "cupom-status ok";
    }

    /* resumo de itens do checkout */
    const resumoItens = document.getElementById("resumoItensCheckout");
    resumoItens.innerHTML = carrinhoObter().map(function (item) {
        const produto = solurBuscarProduto(item.id);
        if (!produto) return "";
        return (
            '<div class="resumo-itens-linha">' +
            "<span>" + item.qtd + "x</span>" +
            "<strong>" + produto.nome + (item.tamanho ? " (" + item.tamanho + ")" : "") + "</strong>" +
            "</div>"
        );
    }).join("");
}

/* re-renderiza a sacola quando o carrinho muda (drawer/quantidade) */
const carrinhoSalvarOriginal = carrinhoSalvar;
carrinhoSalvar = function (itens) {
    carrinhoSalvarOriginal(itens);
    if (etapaAtual === 1) renderizarSacola();
};

/* ---------- cupom ---------- */

function aplicarCupomInterface() {
    const input = document.getElementById("inputCupom");
    const status = document.getElementById("cupomStatus");

    const resultado = carrinhoAplicarCupom(input.value);

    status.textContent = resultado.mensagem;
    status.className = "cupom-status " + (resultado.ok ? "ok" : "erro");

    if (resultado.ok) input.value = "";
    atualizarResumos();
}

/* ---------- etapa 2: checkout ---------- */

function irParaCheckout() {
    if (carrinhoObter().length === 0) {
        solurToast("Sua sacola está vazia.", "erro");
        return;
    }
    mostrarEtapa(2);
}

function voltarParaSacola() {
    mostrarEtapa(1);
}

/* máscaras simples */
function mascararCep(valor) {
    const digitos = valor.replace(/\D/g, "").slice(0, 8);
    return digitos.length > 5 ? digitos.slice(0, 5) + "-" + digitos.slice(5) : digitos;
}

function mascararTelefone(valor) {
    const digitos = valor.replace(/\D/g, "").slice(0, 11);
    if (digitos.length <= 2) return digitos;
    if (digitos.length <= 6) return "(" + digitos.slice(0, 2) + ") " + digitos.slice(2);
    if (digitos.length <= 10) {
        return "(" + digitos.slice(0, 2) + ") " + digitos.slice(2, 6) + "-" + digitos.slice(6);
    }
    return "(" + digitos.slice(0, 2) + ") " + digitos.slice(2, 7) + "-" + digitos.slice(7);
}

/* validação */
function validarCampo(input, teste) {
    const campo = input.closest(".campo");
    const valido = teste(input.value.trim());
    campo.classList.toggle("invalido", !valido);
    return valido;
}

function validarCheckout() {
    let valido = true;

    valido = validarCampo(document.getElementById("nomeCompleto"), function (v) {
        return v.split(" ").length >= 2;
    }) && valido;

    valido = validarCampo(document.getElementById("emailCheckout"), function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    }) && valido;

    valido = validarCampo(document.getElementById("telefoneCheckout"), function (v) {
        return v.replace(/\D/g, "").length >= 10;
    }) && valido;

    valido = validarCampo(document.getElementById("cepCheckout"), function (v) {
        return v.replace(/\D/g, "").length === 8;
    }) && valido;

    valido = validarCampo(document.getElementById("cidadeCheckout"), function (v) {
        return v.length >= 2;
    }) && valido;

    valido = validarCampo(document.getElementById("enderecoCheckout"), function (v) {
        return v.length >= 5;
    }) && valido;

    return valido;
}

/* parcelamento */
function atualizarParcelas() {
    const forma = document.querySelector('input[name="pagamento"]:checked').value;
    const campoParcelas = document.getElementById("campoParcelas");
    const select = document.getElementById("parcelasCheckout");

    campoParcelas.hidden = forma !== "cartao";
    if (forma !== "cartao") return;

    const total = carrinhoTotais().total;
    select.innerHTML = "";

    for (let i = 1; i <= 3; i++) {
        const opcao = document.createElement("option");
        opcao.value = i;
        opcao.textContent = i + "x de " + solurFormatarPreco(total / i) + " sem juros";
        select.appendChild(opcao);
    }
}

function totalComPix() {
    const forma = document.querySelector('input[name="pagamento"]:checked').value;
    const totais = carrinhoTotais();

    if (forma === "pix") {
        return totais.total * 0.95;
    }
    return totais.total;
}

/* ---------- etapa 3: confirmação ---------- */

function finalizarPedido(evento) {
    evento.preventDefault();

    if (!validarCheckout()) {
        solurToast("Revise os campos destacados.", "erro");
        return;
    }

    const numero = Math.floor(1000 + Math.random() * 9000);
    document.getElementById("numeroPedido").textContent = "#" + numero;

    carrinhoLimpar();
    mostrarEtapa(3);
    solurToast("Pedido #" + numero + " confirmado. Obrigado!");
}

/* ---------- inicialização ---------- */

document.addEventListener("DOMContentLoaded", function () {
    renderizarSacola();
    mostrarEtapa(1);

    document.getElementById("cepCheckout").addEventListener("input", function () {
        this.value = mascararCep(this.value);
    });

    document.getElementById("telefoneCheckout").addEventListener("input", function () {
        this.value = mascararTelefone(this.value);
    });

    document.querySelectorAll('input[name="pagamento"]').forEach(function (radio) {
        radio.addEventListener("change", function () {
            atualizarParcelas();
            atualizarResumos();
            document.getElementById("botaoFinalizar").textContent =
                "FINALIZAR PEDIDO • " + solurFormatarPreco(totalComPix());
        });
    });

    atualizarParcelas();
    document.getElementById("botaoFinalizar").textContent =
        "FINALIZAR PEDIDO • " + solurFormatarPreco(totalComPix());

    document.getElementById("formCheckout").addEventListener("submit", finalizarPedido);
});
