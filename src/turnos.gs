// ============================================================
// turnos.gs — GESTÃO DE TURNOS DO MAPA DO EIXO
// ============================================================
// Sistema de Gestão do Mapa do Eixo da Fisioterapia UTI
// Versão: 2.0 — Núcleo puro (sem UI)
// Data: 2026-05-24
// ============================================================
//
// Núcleo de criação de novos turnos.
//
// ARQUITETURA: Esta camada é PURA — não tem alerts, prompts,
// toasts ou getUi(). Recebe decisões já tomadas como parâmetros
// e apenas executa. Toda interação com o usuário acontece em
// interface.gs.
//
// Em caso de violação de contrato (parâmetros inválidos, pré-
// requisitos não atendidos), lança Error. Em sucesso, retorna
// a nova aba criada.
// ============================================================

/**
 * Cria uma nova aba de turno na planilha.
 *
 * NÃO faz validações de UX — o chamador deve ter validado antes:
 *   - que o modelo existe
 *   - que a aba destino não existe
 *   - que abaAnterior é null OU uma Sheet válida
 *
 * @param {Date} data - Data do turno a criar
 * @param {string} turno - "D" para Diurno ou "N" para Noturno
 * @param {GoogleAppsScript.Spreadsheet.Sheet|null} abaAnterior - Aba fonte para
 *        cópia de pacientes ativos, ou null para criar em branco
 * @returns {GoogleAppsScript.Spreadsheet.Sheet} A nova aba criada
 * @throws {Error} Em qualquer falha (parâmetros inválidos, modelo ausente,
 *         conflito de nome, falha técnica)
 */
function criarNovoTurno(data, turno, abaAnterior) {
  Logger.log("[INFO] ===== INICIANDO CRIAÇÃO DE NOVO TURNO =====");

  try {
    // ──────────────────────────────────────────────────────────
    // VALIDAÇÃO DE PARÂMETROS (defensiva)
    // ──────────────────────────────────────────────────────────
    if (!(data instanceof Date) || isNaN(data.getTime())) {
      throw new Error(
        "Parâmetro 'data' inválido. Esperado um objeto Date válido.",
      );
    }
    if (turno !== "D" && turno !== "N") {
      throw new Error(
        `Parâmetro 'turno' inválido. Esperado "D" ou "N", recebido: "${turno}".`,
      );
    }
    if (abaAnterior !== null && typeof abaAnterior.getName !== "function") {
      throw new Error(
        "Parâmetro 'abaAnterior' inválido. Esperado null ou um objeto Sheet.",
      );
    }

    // ──────────────────────────────────────────────────────────
    // VALIDAÇÃO DE PRÉ-REQUISITOS (defensiva)
    // ──────────────────────────────────────────────────────────
    if (!_abaExiste(CONFIG.MODELO_NOME)) {
      throw new Error(
        `Aba modelo "${CONFIG.MODELO_NOME}" não encontrada na planilha`,
      );
    }

    const nomeNovaAba = _formatarNomeAba(data, turno);

    if (_abaExiste(nomeNovaAba)) {
      throw new Error(
        `Aba "${nomeNovaAba}" já existe — operação não sobrescreve abas`,
      );
    }

    Logger.log(`[INFO] Nova aba: "${nomeNovaAba}"`);
    Logger.log(
      `[INFO] Aba anterior: ${abaAnterior ? `"${abaAnterior.getName()}"` : "(nenhuma — criação em branco)"}`,
    );

    // ──────────────────────────────────────────────────────────
    // EXECUÇÃO
    // ──────────────────────────────────────────────────────────

    // 1. Clonar o modelo
    const novaAba = _clonarModelo(nomeNovaAba);

    // 2. Preencher data e turno na seção de informações
    _preencherInformacoesTurno(novaAba, data, turno);

    // 3. Copiar pacientes ativos (apenas se houver aba anterior)
    if (abaAnterior) {
      _copiarPacientesAtivos(novaAba, abaAnterior);
    }

    // Padronização de formatação
    aplicarZebraDados(novaAba);
    padronizarColunasDados(novaAba);

    // Reaplica o banner: a zebra acima repinta a faixa e apaga o amarelo.
    // Guarda interna torna isto inócuo em áreas sem divisores (Eixo).
    _implementarLinhasDivisoras(novaAba);

    // Proteger células contra alterações indevidas.
    _protegerCelulas(novaAba);

    Logger.log(`[OK] ✅ Turno "${nomeNovaAba}" criado com sucesso!`);
    Logger.log("[INFO] ===== FIM DA CRIAÇÃO DE NOVO TURNO =====");

    return novaAba;
  } catch (erro) {
    Logger.log(`[ERRO] ❌ Falha ao criar novo turno: ${erro.message}`);
    Logger.log(`[ERRO] Stack: ${erro.stack}`);
    throw erro;
  }
}

// ============================================================
// FUNÇÕES AUXILIARES
// ============================================================

/**
 * Clona a aba modelo, criando uma nova aba com o nome especificado.
 *
 * @param {string} nomeNovaAba - Nome a atribuir à nova aba clonada
 * @returns {GoogleAppsScript.Spreadsheet.Sheet} A nova aba criada
 * @throws {Error} Se a aba modelo não existir
 */
function _clonarModelo(nomeNovaAba) {
  Logger.log(`[INFO] Clonando modelo para "${nomeNovaAba}"...`);

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const modelo = ss.getSheetByName(CONFIG.MODELO_NOME);

    if (!modelo) {
      throw new Error(
        `Aba modelo "${CONFIG.MODELO_NOME}" não encontrada na planilha`,
      );
    }

    // copyTo cria a nova aba no final da planilha,
    // com nome "Copy of <original>"
    const novaAba = modelo.copyTo(ss);

    // Renomear imediatamente
    novaAba.setName(nomeNovaAba);

    // Defensivo: se o modelo estiver oculto, a cópia também fica.
    // Garantir que a nova aba do turno seja visível.
    novaAba.showSheet();

    Logger.log(`[OK] Modelo clonado para "${nomeNovaAba}"`);
    return novaAba;
  } catch (erro) {
    Logger.log(`[ERRO] Falha ao clonar modelo: ${erro.message}`);
    throw erro;
  }
}
