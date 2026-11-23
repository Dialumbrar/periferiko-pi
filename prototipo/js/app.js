// Dados iniciais padrão para o protótipo não começar vazio
const PECAS_INICIAIS = [
  { id: 101, nome: "Switch Akko Cream Yellow V3", categoria: "Teclado - Switches", preco: 95.00, estoque: 40 },
  { id: 102, nome: "Keycaps PBT Cyberpunk Neon", categoria: "Teclado - Keycaps", preco: 149.90, estoque: 15 },
  { id: 103, nome: "Grips Antiderrapantes Honeycomb", categoria: "Mouse - Carcaça/Grips", preco: 45.00, estoque: 30 },
  { id: 104, nome: "Paddles Traseiros Metálicos Pro", categoria: "Controle - Analógicos/Paddles", preco: 110.00, estoque: 12 }
];

// Recupera peças do localStorage ou inicializa
function obterPecas() {
  const dados = localStorage.getItem("periferiko_pecas");
  if (!dados) {
    localStorage.setItem("periferiko_pecas", JSON.stringify(PECAS_INICIAIS));
    return PECAS_INICIAIS;
  }
  return JSON.parse(dados);
}

// Exibe alertas na tela
function mostrarMensagem(texto, tipo) {
  const box = document.getElementById("feedback-msg");
  if (!box) return;
  box.textContent = texto;
  box.className = `alert alert-${tipo}`;
  box.style.display = "block";
}

// 1. Lógica da Página de Login (index.html)
const formLogin = document.getElementById("form-login");
if (formLogin) {
  formLogin.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();

    if (!email || !senha) {
      mostrarMensagem("Erro: Preencha o e-mail e a senha para continuar.", "error");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      mostrarMensagem("Erro: Informe um endereço de e-mail válido.", "error");
      return;
    }

    if (email === "admin@periferiko.com.br" && senha === "123456") {
      mostrarMensagem("Login realizado com sucesso! Redirecionando...", "success");
      setTimeout(() => {
        window.location.href = "lista.html";
      }, 1000);
    } else {
      mostrarMensagem("Erro: E-mail ou senha incorretos.", "error");
    }
  });
}

// 2. Lógica da Página de Cadastro (cadastro.html)
const formCadastro = document.getElementById("form-cadastro");
if (formCadastro) {
  formCadastro.addEventListener("submit", function (e) {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const categoria = document.getElementById("categoria").value;
    const preco = parseFloat(document.getElementById("preco").value);
    const estoque = parseInt(document.getElementById("estoque").value);

    // Validações
    if (nome.length < 3) {
      mostrarMensagem("Erro: O nome do componente deve ter pelo menos 3 caracteres.", "error");
      return;
    }

    if (!categoria) {
      mostrarMensagem("Erro: Selecione uma categoria de periférico.", "error");
      return;
    }

    if (isNaN(preco) || preco <= 0) {
      mostrarMensagem("Erro: Informe um preço válido maior que zero.", "error");
      return;
    }

    if (isNaN(estoque) || estoque < 0) {
      mostrarMensagem("Erro: A quantidade em estoque não pode ser negativa ou vazia.", "error");
      return;
    }

    // Salva no localStorage
    const pecas = obterPecas();
    const novoId = pecas.length > 0 ? Math.max(...pecas.map(p => p.id)) + 1 : 101;

    pecas.push({
      id: novoId,
      nome: nome,
      categoria: categoria,
      preco: preco,
      estoque: estoque
    });

    localStorage.setItem("periferiko_pecas", JSON.stringify(pecas));
    mostrarMensagem("Componente cadastrado com sucesso no catálogo!", "success");
    formCadastro.reset();
  });
}

// 3. Lógica da Página de Listagem (lista.html)
const tabelaPecas = document.getElementById("tabela-pecas");
if (tabelaPecas) {
  function renderizarTabela() {
    const pecas = obterPecas();
    tabelaPecas.innerHTML = "";

    if (pecas.length === 0) {
      tabelaPecas.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#9ca3af;">Nenhum componente cadastrado.</td></tr>`;
      return;
    }

    pecas.forEach((peca) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>#${peca.id}</td>
        <td><strong>${peca.nome}</strong></td>
        <td><span class="badge">${peca.categoria}</span></td>
        <td>R$ ${peca.preco.toFixed(2).replace(".", ",")}</td>
        <td>${peca.estoque} un.</td>
        <td><button class="btn btn-danger" onclick="removerPeca(${peca.id})">Excluir</button></td>
      `;
      tabelaPecas.appendChild(tr);
    });
  }

  window.removerPeca = function (id) {
    let pecas = obterPecas();
    pecas = pecas.filter(p => p.id !== id);
    localStorage.setItem("periferiko_pecas", JSON.stringify(pecas));
    renderizarTabela();
  };

  renderizarTabela();
}