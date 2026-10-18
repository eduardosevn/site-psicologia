/* ==========================================================
   CONFIGURE AQUI: número de WhatsApp (55 + DDD + número, só dígitos)
   Exemplo: "5554999999999"
   ========================================================== */
const WHATSAPP_NUMERO = "5554991798686";
const WHATSAPP_MENSAGEM = "Olá! Encontrei seu site e gostaria de saber mais sobre o atendimento psicológico.";

const menos_movimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
document.documentElement.classList.add("js-ativo");

/* ---------- Cabeçalho: sombra ao rolar ---------- */
const cabecalho = document.querySelector("header");
function atualizarCabecalho() {
    if (cabecalho) cabecalho.classList.toggle("rolou", window.scrollY > 10);
}

/* ---------- Menu do celular ---------- */
const menu = document.querySelector("header nav");
if (cabecalho && menu) {
    const botaoMenu = document.createElement("button");
    botaoMenu.type = "button";
    botaoMenu.className = "menu-toggle";
    botaoMenu.textContent = "Menu";
    botaoMenu.setAttribute("aria-expanded", "false");
    cabecalho.insertBefore(botaoMenu, menu);

    botaoMenu.addEventListener("click", function () {
        const aberto = menu.classList.toggle("aberto");
        botaoMenu.setAttribute("aria-expanded", String(aberto));
        botaoMenu.textContent = aberto ? "Fechar" : "Menu";
    });
    menu.addEventListener("click", function (e) {
        if (e.target.tagName === "A") {
            menu.classList.remove("aberto");
            botaoMenu.setAttribute("aria-expanded", "false");
            botaoMenu.textContent = "Menu";
        }
    });
}

/* ---------- Animação de entrada (elementos com data-revelar) ---------- */
const itensRevelar = document.querySelectorAll("[data-revelar]");
if ("IntersectionObserver" in window && !menos_movimento) {
    const observador = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (entrada) {
            if (entrada.isIntersecting) {
                entrada.target.classList.add("visivel");
                observador.unobserve(entrada.target);
            }
        });
    }, { threshold: 0.15 });
    itensRevelar.forEach(function (el) { observador.observe(el); });
} else {
    itensRevelar.forEach(function (el) { el.classList.add("visivel"); });
}

/* ---------- Profundidade suave na foto do topo ---------- */
const fotoHero = document.querySelector(".hero-image img");
function moverFoto() {
    if (fotoHero && !menos_movimento && window.scrollY < 900) {
        fotoHero.style.setProperty("--py", (window.scrollY * 0.08) + "px");
    }
}

let agendado = false;
window.addEventListener("scroll", function () {
    if (agendado) return;
    agendado = true;
    requestAnimationFrame(function () {
        atualizarCabecalho();
        moverFoto();
        agendado = false;
    });
}, { passive: true });
atualizarCabecalho();

/* ---------- Botão flutuante de WhatsApp (todas as páginas, exceto contato) ---------- */
function linkWhatsApp(texto) {
    return "https://wa.me/" + WHATSAPP_NUMERO + "?text=" + encodeURIComponent(texto || WHATSAPP_MENSAGEM);
}
if (!location.pathname.endsWith("contato.html")) {
    const zap = document.createElement("a");
    zap.className = "zap-flutuante";
    zap.href = linkWhatsApp();
    zap.target = "_blank";
    zap.rel = "noopener noreferrer";
    zap.setAttribute("aria-label", "Conversar pelo WhatsApp");
    zap.innerHTML =
        '<svg class="icone" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM7 9h10v2H7zm0 4h7v2H7z"/></svg><span>WhatsApp</span>';
    document.body.appendChild(zap);
}

/* ---------- Escolha do público (só existe na página inicial) ---------- */
const botaoParaMim = document.getElementById("para-mim");
const botaoParaOutraPessoa = document.getElementById("para-outra-pessoa");
const mensagemPublico = document.getElementById("mensagem-publico");

if (botaoParaMim && botaoParaOutraPessoa && mensagemPublico) {
    const tituloPublico = document.getElementById("titulo-publico");
    const textoPublico = document.getElementById("texto-publico");
    const botoesPublico = [botaoParaMim, botaoParaOutraPessoa];

    const mensagens = {
        "mim": {
            botao: botaoParaMim,
            titulo: "Este espaço é para você.",
            texto: "Talvez você esteja passando por um momento difícil, tentando compreender o que sente ou simplesmente buscando um espaço para conversar. Você não precisa ter tudo organizado para dar o primeiro passo.",
            whats: "Olá! Encontrei seu site e gostaria de saber mais sobre atendimento psicológico para mim."
        },
        "outra-pessoa": {
            botao: botaoParaOutraPessoa,
            titulo: "Você está buscando apoio para alguém importante para você.",
            texto: "Pode ser difícil saber como ajudar ou como iniciar essa conversa. Conheça as possibilidades de atendimento e, se precisar, entre em contato para esclarecer suas dúvidas.",
            whats: "Olá! Encontrei seu site e gostaria de saber mais sobre atendimento psicológico para outra pessoa."
        }
    };

    function selecionarPublico(publico) {
        const dados = mensagens[publico];
        try { sessionStorage.setItem("publicoEscolhido", publico); } catch (erro) { /* sem armazenamento: segue normalmente */ }
        botoesPublico.forEach(function (botao) {
            botao.classList.remove("selecionado");
            botao.setAttribute("aria-pressed", "false");
        });
        dados.botao.classList.add("selecionado");
        dados.botao.setAttribute("aria-pressed", "true");

        tituloPublico.textContent = dados.titulo;
        textoPublico.textContent = dados.texto;

        mensagemPublico.hidden = false;
        mensagemPublico.scrollIntoView({ behavior: menos_movimento ? "auto" : "smooth", block: "nearest" });
    }

    botaoParaMim.addEventListener("click", function () { selecionarPublico("mim"); });
    botaoParaOutraPessoa.addEventListener("click", function () { selecionarPublico("outra-pessoa"); });
}

/* ---------- Links de WhatsApp fixos no HTML (data-whatsapp) ---------- */
document.querySelectorAll("[data-whatsapp]").forEach(function (a) {
    a.href = linkWhatsApp();
    a.target = "_blank";
    a.rel = "noopener noreferrer";
});

/* ---------- Quadros por tema: balão ao clicar ---------- */
const cartoesTema = document.querySelectorAll(".cartao-tema");
if (cartoesTema.length && typeof HTMLDialogElement === "function") {
    const dialogo = document.createElement("dialog");
    dialogo.className = "tema-dialogo";
    dialogo.setAttribute("aria-labelledby", "tema-titulo");
    dialogo.innerHTML =
        '<button type="button" class="tema-fechar" aria-label="Fechar">&times;</button>' +
        '<h2 id="tema-titulo"></h2>' +
        '<div class="tema-corpo"></div>' +
        '<div class="botoes"><a href="contato.html" class="botao">Quero conversar sobre isso</a></div>';
    document.body.appendChild(dialogo);

    const tituloTema = dialogo.querySelector("#tema-titulo");
    const corpoTema = dialogo.querySelector(".tema-corpo");

    cartoesTema.forEach(function (cartao) {
        const titulo = cartao.querySelector("h3");
        const detalhe = cartao.querySelector(".tema-detalhe");
        if (!titulo || !detalhe) return;

        const abrir = document.createElement("button");
        abrir.type = "button";
        abrir.className = "tema-abrir";
        abrir.textContent = "Ler mais";
        abrir.setAttribute("aria-label", "Ler mais sobre: " + titulo.textContent);
        cartao.appendChild(abrir);

        abrir.addEventListener("click", function () {
            tituloTema.textContent = titulo.textContent;
            corpoTema.innerHTML = detalhe.innerHTML;
            dialogo.showModal();
            dialogo.scrollTop = 0;
        });
    });

    dialogo.querySelector(".tema-fechar").addEventListener("click", function () { dialogo.close(); });
    dialogo.addEventListener("click", function (e) { if (e.target === dialogo) dialogo.close(); });
}

/* ---------- Balões simples abertos por botões (data-abrir="id-do-balão") ---------- */
document.querySelectorAll("[data-abrir]").forEach(function (botao) {
    const balao = document.getElementById(botao.dataset.abrir);
    if (!balao || typeof balao.showModal !== "function") return;

    botao.addEventListener("click", function () {
        balao.showModal();
        balao.scrollTop = 0;
    });
    balao.addEventListener("click", function (e) { if (e.target === balao) balao.close(); });
    balao.querySelectorAll("[data-fechar]").forEach(function (x) {
        x.addEventListener("click", function () { balao.close(); });
    });
});
