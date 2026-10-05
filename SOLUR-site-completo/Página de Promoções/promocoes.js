/* =====================================================
   SOLUR — PÁGINA DE PROMOÇÕES
   ===================================================== */

function copiarCupom(codigo) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(codigo).then(function () {
            solurToast("Cupom " + codigo + " copiado. Cole na sacola.");
        });
    } else {
        solurToast("Cupom " + codigo + " — anote e use na sacola.");
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const promocoes = solurProdutosEmPromocao().sort(function (a, b) {
        return solurDescontoPercentual(b) - solurDescontoPercentual(a);
    });

    solurRenderizarGrade(document.getElementById("gradePromocoes"), promocoes);
});
