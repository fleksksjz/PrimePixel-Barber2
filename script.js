// ==============================
// ELEMENTOS PRINCIPAIS
// ==============================
const container = document.getElementById("horarios-container");
const btnAgendar = document.getElementById("btn-agendar");
const modal = document.getElementById("modal-agendamento");
const closeModal = document.getElementById("close-modal");
const form = document.getElementById("form-agendamento");
const msg = document.getElementById("msg");

const adminPanel = document.getElementById("admin-panel");
const closeAdmin = document.getElementById("close-admin");
const listaAgendamentos = document.getElementById("lista-agendamentos");
const btnLimpar = document.getElementById("btn-limpar");

const horarios = [
  "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00"
];

// ==============================
// GERAÇÃO DE HORÁRIOS
// ==============================
horarios.forEach(hora => {
  const div = document.createElement("div");
  div.classList.add("balaozinho");
  div.innerText = hora;

  div.addEventListener("click", () => {
    document.querySelectorAll(".balaozinho").forEach(b => b.classList.remove("ativo"));
    div.classList.add("ativo");
    form.hora.value = hora; // define o horário automaticamente
    modal.style.display = "flex";
  });

  container.appendChild(div);
});

// ==============================
// CONTROLE DO MODAL DE AGENDAMENTO
// ==============================
btnAgendar.addEventListener("click", () => modal.style.display = "flex");
closeModal.addEventListener("click", () => modal.style.display = "none");
window.addEventListener("click", e => { if (e.target === modal) modal.style.display = "none"; });

// ==============================
// ENVIO DO FORMULÁRIO
// ==============================
form.addEventListener("submit", e => {
  e.preventDefault();
  const dados = new FormData(form);
  const agendamento = {
    nome: dados.get("nome"),
    telefone: dados.get("telefone"),
    servico: dados.get("servico"),
    data: dados.get("data"),
    hora: dados.get("hora")
  };

  // Pega lista existente e adiciona o novo
  const lista = JSON.parse(localStorage.getItem("agendamentos") || "[]");
  lista.push(agendamento);
  localStorage.setItem("agendamentos", JSON.stringify(lista));

  modal.style.display = "none";
  msg.innerText = "✅ Agendamento confirmado!";
  msg.style.color = "#00ff7f";
  form.reset();

  setTimeout(() => msg.innerText = "", 3000);
});

// ==============================
// FUNÇÃO PARA RENDERIZAR ADMIN
// ==============================
function renderAdmin() {
  const lista = JSON.parse(localStorage.getItem("agendamentos") || "[]");
  listaAgendamentos.innerHTML = lista.length
    ? lista.map(a =>
        `<div class="agendamento-item">
          <strong>${a.data}</strong> - ${a.hora} <br>
          ${a.nome} (${a.telefone}) <br>
          Serviço: ${a.servico}
        </div>`
      ).join("")
    : "<p>Nenhum agendamento salvo.</p>";
}

// ==============================
// BOTÕES DO ADMIN
// ==============================
closeAdmin.addEventListener("click", () => adminPanel.style.display = "none");

btnLimpar.addEventListener("click", () => {
  if (confirm("Tem certeza que deseja limpar todos os agendamentos?")) {
    localStorage.removeItem("agendamentos");
    renderAdmin();
  }
});

// ==============================
// ACESSO AO PAINEL ADMIN
// ==============================
// Ao clicar 5x no footer → abre painel admin
let clicks = 0;
document.getElementById("footer").addEventListener("click", () => {
  clicks++;
  if (clicks >= 5) {
    const senha = prompt("🔐 Digite a senha do admin:");
    if (senha === "0956") {
      renderAdmin();
      adminPanel.style.display = "flex";
    } else {
      alert("Senha incorreta!");
    }
    clicks = 0;
  }
});
