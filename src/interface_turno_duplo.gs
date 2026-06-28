// ============================================================
// interface.gs — CAMADA DE INTERFACE DO MAPA DO EIXO
// ============================================================
// Sistema de Gestão do Mapa do Eixo da Fisioterapia UTI
// Versão: 1.0
// Data: 2026-05-24
// ============================================================
//
// Camada de UI do sistema.
//
// RESPONSABILIDADE: coletar inputs do usuário (data, turno),
// validar pré-requisitos com mensagens amigáveis, pedir
// confirmação, chamar o núcleo (turnos.gs) e exibir feedback
// (toasts, alerts de erro).
//
// Todo getUi(), alert(), prompt(), toast() vive aqui. O núcleo
// é puro e não conhece UI.
// ============================================================

// ============================================================
// SETUP DO MENU (executado automaticamente ao abrir a planilha)
// ============================================================

/**
 * Trigger simples do Google Sheets — roda automaticamente quando
 * a planilha é aberta. Adiciona o menu personalizado.
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu("📋 GERAR MAPA")
    .addItem("☀️ Criar turno DIURNO", "criarTurnoDiurno")
    .addItem("🌙 Criar turno NOTURNO", "criarTurnoNoturno")
    .addToUi();
}

// ============================================================
// CALLBACKS DO MENU (entry points)
// ============================================================

/**
 * Entry point: cria um novo turno DIURNO.
 * Disparado pelo item de menu correspondente.
 */
function criarTurnoDiurno() {
  fluxoCriarTurno("D");
}

/**
 * Entry point: cria um novo turno NOTURNO.
 * Disparado pelo item de menu correspondente.
 */
function criarTurnoNoturno() {
  fluxoCriarTurno("N");
}

// ============================================================
// FLUXO PRINCIPAL DE UI
// ============================================================

/**
 * Orquestra a criação de um turno do ponto de vista do usuário:
 *   1. Solicita a data (prompt com hoje como padrão)
 *   2. Valida pré-requisitos com alerts amigáveis
 *   3. Resolve aba anterior (com fallback se ausente)
 *   4. Pede confirmação final
 *   5. Sob trava de documento (re-checando existência), chama o
 *      núcleo e mostra feedback
 *
 * @param {string} turno - "D" ou "N" (vem fixo do menu callback)
 */
function fluxoCriarTurno(turno) {
  const ui = SpreadsheetApp.getUi();
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  try {
    // ──────────────────────────────────────────────────────────
    // PASSO 1: Coletar a data
    // ──────────────────────────────────────────────────────────
    const data = _solicitarData(ui);
    if (data === null) {
      Logger.log("[INFO] Usuário cancelou a entrada de data");
      return;
    }

    // ──────────────────────────────────────────────────────────
    // PASSO 2: Validar pré-requisitos com mensagens amigáveis
    // ──────────────────────────────────────────────────────────

    // 2a. Modelo deve existir
    if (!_abaExiste(CONFIG.MODELO_NOME)) {
      ui.alert(
        "Modelo não encontrado",
        `A aba "${CONFIG.MODELO_NOME}" não foi encontrada.\n\n` +
          `Execute a criação do modelo antes de gerar um novo turno.`,
        ui.ButtonSet.OK,
      );
      return;
    }

    // 2b. Nova aba não pode já existir
    const nomeNovaAba = _formatarNomeAba(data, turno);
    if (_abaExiste(nomeNovaAba)) {
      ui.alert(
        "Aba já existe",
        `A aba "${nomeNovaAba}" já existe na planilha.\n\n` +
          `Verifique antes de continuar — esta operação não sobrescreve abas existentes.`,
        ui.ButtonSet.OK,
      );
      return;
    }

    // ──────────────────────────────────────────────────────────
    // PASSO 3: Resolver aba anterior (fonte dos pacientes)
    // ──────────────────────────────────────────────────────────
    const nomeAbaAnterior = _obterNomeAbaAnterior(data, turno);
    let abaAnterior = null;

    if (_abaExiste(nomeAbaAnterior)) {
      abaAnterior = ss.getSheetByName(nomeAbaAnterior);
    } else {
      // Fallback: aba anterior ausente → perguntar se cria em branco
      const resposta = ui.alert(
        "Aba anterior não encontrada",
        `A aba anterior esperada ("${nomeAbaAnterior}") não foi encontrada.\n\n` +
          `Deseja criar a aba "${nomeNovaAba}" em branco (sem copiar pacientes)?`,
        ui.ButtonSet.YES_NO,
      );
      if (resposta !== ui.Button.YES) {
        Logger.log("[INFO] Usuário cancelou (sem aba anterior)");
        return;
      }
      // abaAnterior permanece null → criação em branco
    }

    // ──────────────────────────────────────────────────────────
    // PASSO 4: Confirmação final
    // ──────────────────────────────────────────────────────────
    const descricaoTurno = turno === "D" ? "DIURNO" : "NOTURNO";
    const dataFormatada = _formatarNomeAba(data, "").trim();

    const mensagemConfirmacao = abaAnterior
      ? `Criar turno ${descricaoTurno} de ${dataFormatada}, ` +
        `copiando pacientes ativos de "${nomeAbaAnterior}"?`
      : `Criar turno ${descricaoTurno} de ${dataFormatada} em branco (sem pacientes)?`;

    const confirmacao = ui.alert(
      "Confirmar criação de turno",
      mensagemConfirmacao,
      ui.ButtonSet.YES_NO,
    );
    if (confirmacao !== ui.Button.YES) {
      Logger.log("[INFO] Usuário cancelou na confirmação final");
      return;
    }

    // ──────────────────────────────────────────────────────────
    // PASSO 5: Executar e dar feedback (seção crítica)
    // ──────────────────────────────────────────────────────────
    //
    // Concorrência: a virada de turno acontece em horário fixo (7h
    // e 19h), então dois usuários podem disparar a criação quase
    // juntos. A checagem do PASSO 2b é cortesia (corta cedo, antes
    // dos prompts), mas não basta: o estado pode mudar enquanto o
    // usuário responde às caixas de diálogo dos passos 3 e 4.
    //
    // A trava de documento serializa esta seção entre todos os
    // editores da planilha. Ela é pega SÓ AQUI, depois de todos os
    // prompts — segurá-la durante um diálogo bloquearia o outro
    // usuário pelo tempo todo de leitura. Dentro da trava, uma
    // re-checagem de _abaExiste fecha de vez a janela de corrida:
    // "checar + criar" vira atômico.
    const lock = LockService.getDocumentLock();
    try {
      lock.waitLock(15000); // espera até 15s pela vez
    } catch (erroLock) {
      Logger.log("[INFO] Trava ocupada — outra criação de turno em andamento");
      ui.alert(
        "Sistema ocupado",
        `Outra pessoa está criando um turno neste momento.\n\n` +
          `Aguarde alguns segundos e tente novamente.`,
        ui.ButtonSet.OK,
      );
      return;
    }

    try {
      // Re-checagem DENTRO da trava: a aba pode ter sido criada por
      // outro usuário enquanto este confirmava (passos 3 e 4).
      if (_abaExiste(nomeNovaAba)) {
        ui.alert(
          "Aba já existe",
          `A aba "${nomeNovaAba}" foi criada enquanto você confirmava.\n\n` +
            `Nada foi sobrescrito.`,
          ui.ButtonSet.OK,
        );
        return;
      }

      ss.toast("Criando turno...", "Mapa do Eixo", -1);

      const novaAba = criarNovoTurno(data, turno, abaAnterior);

      // Ativar a nova aba (navegação é responsabilidade da camada de UI)
      ss.setActiveSheet(novaAba);

      const mensagemSucesso = abaAnterior
        ? `Turno ${descricaoTurno} criado com pacientes de ${nomeAbaAnterior}`
        : `Turno ${descricaoTurno} criado em branco`;

      ss.toast(mensagemSucesso, "✅ Sucesso", 5);
    } finally {
      // Libera sempre, mesmo se criarNovoTurno lançar. (O Apps Script
      // também libera ao fim da execução; o finally só antecipa.)
      lock.releaseLock();
    }
  } catch (erro) {
    // Qualquer Error vindo do núcleo cai aqui — exibir como alert amigável
    Logger.log(`[ERRO] Fluxo abortado: ${erro.message}`);
    ui.alert(
      "Erro ao criar turno",
      `Ocorreu um erro durante a criação:\n\n${erro.message}\n\n` +
        `Consulte os logs de execução para mais detalhes.`,
      ui.ButtonSet.OK,
    );
  }
}

// ============================================================
// FUNÇÕES AUXILIARES DE UI
// ============================================================

/**
 * Solicita a data do turno via prompt, com hoje como padrão.
 * Permite múltiplas tentativas em caso de formato inválido,
 * até o usuário fornecer uma data válida ou cancelar.
 *
 * @param {GoogleAppsScript.Base.Ui} ui - Instância da UI
 * @returns {Date|null} A data informada, ou null se cancelado
 */
function _solicitarData(ui) {
  const hoje = new Date();
  const hojeFormatado = _formatarNomeAba(hoje, "").trim();

  // Loop até obter data válida ou cancelar
  while (true) {
    const resposta = ui.prompt(
      "Data do turno",
      `Digite a data do turno no formato DD/MM/AAAA.\n\n` +
        `Deixe em branco para usar hoje (${hojeFormatado}).`,
      ui.ButtonSet.OK_CANCEL,
    );

    // Cancelar ou fechar
    if (resposta.getSelectedButton() !== ui.Button.OK) {
      return null;
    }

    const texto = resposta.getResponseText().trim();

    // Vazio → usar hoje
    if (texto === "") {
      return hoje;
    }

    // Tentar parsear
    const data = _parsearData(texto);
    if (data !== null) {
      return data;
    }

    // Inválida → avisar e repetir loop
    ui.alert(
      "Data inválida",
      `O texto "${texto}" não é uma data válida.\n\n` +
        `Use o formato DD/MM/AAAA (exemplo: 17/05/2026).`,
      ui.ButtonSet.OK,
    );
  }
}

/**
 * Parseia uma string no formato DD/MM/AAAA e retorna um Date.
 * Valida que a data é real (rejeita 31/02/2026, 32/01/2026, etc).
 *
 * @param {string} texto - String a parsear
 * @returns {Date|null} Date válido ou null se inválido
 */
function _parsearData(texto) {
  // Match estrito DD/MM/AAAA (aceita 1 ou 2 dígitos em dia/mês)
  const match = texto.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) return null;

  const dia = parseInt(match[1], 10);
  const mes = parseInt(match[2], 10);
  const ano = parseInt(match[3], 10);

  // Construir Date (mês 0-indexado em JS)
  const data = new Date(ano, mes - 1, dia);

  // Validar: o Date construtor "corrige" datas inválidas
  // (ex: 31/02 vira 03/03). Se os componentes não baterem,
  // a data original era inválida.
  if (
    data.getDate() !== dia ||
    data.getMonth() !== mes - 1 ||
    data.getFullYear() !== ano
  ) {
    return null;
  }

  return data;
}
