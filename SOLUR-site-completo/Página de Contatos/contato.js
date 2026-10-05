/* =====================================================
   SOLUR — PÁGINA DE CONTATO
   Busca no FAQ + formulário com validação
   ===================================================== */

function filtrarFAQ() {
    const input = document.getElementById("pesquisaFaq").value.toLowerCase();
    const perguntas = document.querySelectorAll(".pergunta");

    let visiveis = 0;

    perguntas.forEach(function (pergunta) {
        const texto = pergunta.innerText.toLowerCase();
        const mostrar = texto.includes(input);

        pergunta.style.display = mostrar ? "block" : "none";
        if (mostrar) visiveis++;
    });

    document.getElementById("faqVazia").hidden = visiveis > 0;
}

/* ---------- formulário ---------- */

function validarCampoContato(input, teste) {
    const campo = input.closest(".campo");
    const valido = teste(input.value.trim());
    campo.classList.toggle("invalido", !valido);
    return valido;
}

document.addEventListener("DOMContentLoaded", function () {
    const formulario = document.getElementById("formContato");
    const retorno = document.getElementById("retornoContato");

    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();

        let valido = true;

        valido = validarCampoContato(document.getElementById("nomeContato"), function (v) {
            return v.length >= 2;
        }) && valido;

        valido = validarCampoContato(document.getElementById("emailContato"), function (v) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        }) && valido;

        valido = validarCampoContato(document.getElementById("assuntoContato"), function (v) {
            return v !== "";
        }) && valido;

        valido = validarCampoContato(document.getElementById("mensagemContato"), function (v) {
            return v.length >= 10;
        }) && valido;

        if (!valido) {
            retorno.textContent = "";
            solurToast("Revise os campos destacados.", "erro");
            return;
        }

        const mensagens = JSON.parse(localStorage.getItem("solur_mensagens") || "[]");
        mensagens.push({
            nome: document.getElementById("nomeContato").value.trim(),
            email: document.getElementById("emailContato").value.trim(),
            assunto: document.getElementById("assuntoContato").value,
            mensagem: document.getElementById("mensagemContato").value.trim(),
            data: new Date().toISOString()
        });
        localStorage.setItem("solur_mensagens", JSON.stringify(mensagens));

        retorno.textContent = "Mensagem enviada! Retornaremos em até 1 dia útil.";
        solurToast("Mensagem enviada com sucesso.");
        formulario.reset();
        formulario.querySelectorAll(".campo").forEach(function (campo) {
            campo.classList.remove("invalido");
        });
    });
});
