/* =====================================================
   SOLUR — CATÁLOGO DE PRODUTOS
   Fonte única de dados usada por todas as páginas.
   ===================================================== */

const SOLUR_CATEGORIAS = {
    calcas: "Calças",
    camisas: "Camisas",
    calcados: "Calçados",
    acessorios: "Acessórios"
};

const SOLUR_PRODUTOS = [
    {
        id: 1,
        nome: "Calça Baggy Cinza Desbotada",
        categoria: "calcas",
        preco: 125.00,
        precoAntigo: null,
        destaque: true,
        novo: false,
        tamanhos: ["P", "M", "G", "GG"],
        imagens: ["../Imagens/calça 1.jpg"],
        descricao: "Modelagem baggy com lavagem cinza desbotada. Caimento largo e pesado, perfeita para composições sombrias do street ao goth."
    },
    {
        id: 2,
        nome: "Calça Baggy Preta South Pole",
        categoria: "calcas",
        preco: 150.00,
        precoAntigo: 189.90,
        destaque: true,
        novo: false,
        tamanhos: ["P", "M", "G", "GG"],
        imagens: ["../Imagens/calça 2.jpg"],
        descricao: "Calça preta desbotada com bordados South Pole. Tecido resistente e visual envelhecido de quem vive a rua."
    },
    {
        id: 3,
        nome: "Calça Cyberpunk Eskeleton",
        categoria: "calcas",
        preco: 180.00,
        precoAntigo: null,
        destaque: false,
        novo: true,
        tamanhos: ["P", "M", "G", "GG"],
        imagens: ["../Imagens/calça 3.jpg"],
        descricao: "Estética cyberpunk com estampas de esqueleto. Peças de atitude para quem carrega o futuro distópico no guarda-roupa."
    },
    {
        id: 4,
        nome: "Calça Jeans Estilo Tribal",
        categoria: "calcas",
        preco: 169.99,
        precoAntigo: null,
        destaque: false,
        novo: false,
        tamanhos: ["P", "M", "G", "GG"],
        imagens: ["../Imagens/calça 4.jpg"],
        descricao: "Jeans com arte tribal em alto contraste. Um clássico do underground, com presença forte em qualquer look."
    },
    {
        id: 5,
        nome: "Calça Baggy Cybersigilism",
        categoria: "calcas",
        preco: 210.00,
        precoAntigo: 259.90,
        destaque: true,
        novo: false,
        tamanhos: ["P", "M", "G", "GG"],
        imagens: ["../Imagens/calça 5.jpg"],
        descricao: "Cybersigilism aplicado em jeans pesado: traços agressivos, simbologia oculta e caimento oversized."
    },
    {
        id: 6,
        nome: "Calça Barrel Crossed Bones",
        categoria: "calcas",
        preco: 144.99,
        precoAntigo: null,
        destaque: false,
        novo: false,
        tamanhos: ["P", "M", "G", "GG"],
        imagens: ["../Imagens/calça 6.jpg"],
        descricao: "Modelagem barrel com detalhes de caveiras e ossos cruzados. Estrutura ampla que fecha no tornozelo."
    },
    {
        id: 7,
        nome: "Camisa Gótica Gruz",
        categoria: "camisas",
        preco: 49.99,
        precoAntigo: null,
        destaque: false,
        novo: false,
        tamanhos: ["P", "M", "G", "GG"],
        imagens: ["../Imagens/camisa 1.jpg"],
        descricao: "Estampa sigilism com cruz estilizada. Algodão preto profundo com arte branca de alto impacto."
    },
    {
        id: 8,
        nome: "Blusa Tapout Manga Longa",
        categoria: "camisas",
        preco: 70.00,
        precoAntigo: null,
        destaque: true,
        novo: false,
        tamanhos: ["P", "M", "G", "GG"],
        imagens: ["../Imagens/Camisa 1 (2).jpg"],
        descricao: "Manga longa Tapout com grafismos de combate. Conforto térmico e estética agressiva para o dia a dia."
    },
    {
        id: 9,
        nome: "Camisa Sigilism Caveiras",
        categoria: "camisas",
        preco: 35.00,
        precoAntigo: 54.90,
        destaque: false,
        novo: false,
        tamanhos: ["P", "M", "G", "GG"],
        imagens: ["../Imagens/camisa 3.jpg"],
        descricao: "Caveiras entrelaçadas em traço sigilism. Estampa frontal marcante em malha preta leve."
    },
    {
        id: 10,
        nome: "Camisa Caveira Manga Longa",
        categoria: "camisas",
        preco: 69.99,
        precoAntigo: null,
        destaque: false,
        novo: true,
        tamanhos: ["P", "M", "G", "GG"],
        imagens: ["../Imagens/camisa 4.jpg"],
        descricao: "Manga longa com caveira em arte fina cybersigilism. Para noites frias e intenções escuras."
    },
    {
        id: 11,
        nome: "Cinto Preto DC",
        categoria: "acessorios",
        preco: 40.00,
        precoAntigo: null,
        destaque: false,
        novo: false,
        tamanhos: null,
        imagens: ["../Imagens/cinto 2.jpg"],
        descricao: "Cinto de couro preto com fivela DC. Acabamento robusto para prender o look com atitude."
    },
    {
        id: 12,
        nome: "Cinto Cravejado de Lantejoulas",
        categoria: "acessorios",
        preco: 20.00,
        precoAntigo: null,
        destaque: false,
        novo: false,
        tamanhos: null,
        imagens: ["../Imagens/cinto 3.jpg"],
        descricao: "Cinto cravejado com brilho metálico. O detalhe que transforma o básico em ritual."
    },
    {
        id: 13,
        nome: "Cinto de Balas",
        categoria: "acessorios",
        preco: 35.40,
        precoAntigo: 44.90,
        destaque: false,
        novo: false,
        tamanhos: null,
        imagens: ["../Imagens/cinto 4.jpg"],
        descricao: "Cinto estilo bandoleira com cápsulas metálicas. Inspirado no punk e no visual de palco."
    },
    {
        id: 14,
        nome: "Cinto de Couro com Cruz",
        categoria: "acessorios",
        preco: 32.99,
        precoAntigo: null,
        destaque: true,
        novo: false,
        tamanhos: null,
        imagens: ["../Imagens/cinto.jpg"],
        descricao: "Couro legítimo com aplicação de cruz metálica. Símbolo gótico clássico em acabamento envelhecido."
    },
    {
        id: 15,
        nome: "Crucifixo Prata",
        categoria: "acessorios",
        preco: 25.00,
        precoAntigo: null,
        destaque: false,
        novo: false,
        tamanhos: null,
        imagens: ["../Imagens/corrente.jpg"],
        descricao: "Corrente com crucifixo em banho prata. Peça curinga do darkwear, do pescoço ao cinto."
    },
    {
        id: 16,
        nome: "Tênis DC Caveira",
        categoria: "calcados",
        preco: 144.99,
        precoAntigo: null,
        destaque: true,
        novo: false,
        tamanhos: ["38", "39", "40", "41", "42"],
        imagens: ["../Imagens/Tenis 1.jpg"],
        descricao: "Skate shoe DC com arte de caveira. Solado vulcanizado e cabedal reforçado para o asfalto."
    },
    {
        id: 17,
        nome: "Tênis DC Slayer Edition",
        categoria: "calcados",
        preco: 150.99,
        precoAntigo: 199.90,
        destaque: true,
        novo: false,
        tamanhos: ["38", "39", "40", "41", "42"],
        imagens: ["../Imagens/Tenis 2.jpg"],
        descricao: "Edição Slayer com grafismos de metal. Conforto de skate com alma de show underground."
    },
    {
        id: 18,
        nome: "Vans com Corrente",
        categoria: "calcados",
        preco: 200.00,
        precoAntigo: null,
        destaque: false,
        novo: true,
        tamanhos: ["38", "39", "40", "41", "42"],
        imagens: ["../Imagens/TENIS 3.jpg"],
        descricao: "Clássico customizado com corrente metálica lateral. Um par, nenhuma explicação necessária."
    },
    {
        id: 19,
        nome: "Touca Dreams",
        categoria: "acessorios",
        preco: 35.00,
        precoAntigo: null,
        destaque: false,
        novo: false,
        tamanhos: null,
        imagens: ["../Imagens/touca 2.jpg"],
        descricao: "Gorro em tricô com patch Dreams. Quente, discreto e essencial no inverno dark."
    },
    {
        id: 20,
        nome: "Touca Caveira Angélica",
        categoria: "acessorios",
        preco: 29.99,
        precoAntigo: 39.90,
        destaque: false,
        novo: false,
        tamanhos: null,
        imagens: ["../Imagens/touca.jpg"],
        descricao: "Touca com estampa de caveira angelical. Tricô macio com arte que fala por você."
    }
];

/* ---------- utilitários compartilhados ---------- */

function solurBuscarProduto(id) {
    return SOLUR_PRODUTOS.find(function (p) {
        return p.id === Number(id);
    }) || null;
}

function solurFormatarPreco(valor) {
    return "R$ " + valor.toFixed(2).replace(".", ",");
}

function solurProdutosEmPromocao() {
    return SOLUR_PRODUTOS.filter(function (p) {
        return p.precoAntigo !== null;
    });
}

function solurProdutosEmDestaque() {
    return SOLUR_PRODUTOS.filter(function (p) {
        return p.destaque;
    });
}

function solurDescontoPercentual(produto) {
    if (!produto.precoAntigo) return 0;
    return Math.round((1 - produto.preco / produto.precoAntigo) * 100);
}
