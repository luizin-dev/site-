/* =====================================================
   SOLUR — PÁGINA INICIAL
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {
    solurRenderizarGrade(
        document.getElementById("gradeDestaques"),
        solurProdutosEmDestaque()
    );

    const formulario = document.getElementById("formNewsletter");
    const aviso = document.getElementById("avisoNewsletter");

    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const email = document.getElementById("emailNewsletter").value.trim();
        const valido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        if (!valido) {
            aviso.textContent = "Informe um e-mail válido para entrar para o clã.";
            aviso.style.color = "#ff5c6c";
            return;
        }

        const inscritos = JSON.parse(localStorage.getItem("solur_newsletter") || "[]");

        if (inscritos.indexOf(email) === -1) {
            inscritos.push(email);
            localStorage.setItem("solur_newsletter", JSON.stringify(inscritos));
        }

        aviso.textContent = "Bem-vindo ao clã. Seu primeiro cupom chega em breve: SOLUR10.";
        aviso.style.color = "#9fdf9f";
        formulario.reset();
        solurToast("Inscrição confirmada. Bem-vindo ao clã SOLUR.");
    });
});
