// ============================================================
// utils.gs — FUNÇÕES AUXILIARES
// ============================================================
// Sistema de Gestão do Mapa do Eixo da Fisioterapia UTI
// Versão: 1.0
// Data: 2026-05-16
// ============================================================

/**
 * Formata data e turno para nome da aba
 *
 * @param {Date} data - Data do turno
 * @param {string} turno - "D" para Diurno ou "N" para Noturno
 * @returns {string} Nome formatado (ex: "16/05/2026 D")
 */
function _formatarNomeAba(data, turno) {
  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const ano = data.getFullYear();

  return `${dia}/${mes}/${ano} ${turno}`;
}

/**
 * Calcula nome da aba anterior baseada no turno atual
 *
 * @param {Date} data - Data do turno atual
 * @param {string} turno - "D" para Diurno ou "N" para Noturno
 * @returns {string} Nome da aba anterior
 *
 * @example
 * // Turno Diurno às 7h → busca Noturno de ONTEM
 * _obterNomeAbaAnterior(new Date("2026-05-16"), "D");
 * // Retorna: "15/05/2026 N"
 *
 * @example
 * // Turno Noturno às 19h → busca Diurno de HOJE
 * _obterNomeAbaAnterior(new Date("2026-05-16"), "N");
 * // Retorna: "16/05/2026 D"
 */
function _obterNomeAbaAnterior(data, turno) {
  if (turno === "D") {
    // Turno DIURNO → aba anterior é NOTURNO de ONTEM
    const ontem = new Date(data);
    ontem.setDate(ontem.getDate() - 1);
    return _formatarNomeAba(ontem, "N");
  } else {
    // Turno NOTURNO → aba anterior é DIURNO de HOJE
    return _formatarNomeAba(data, "D");
  }
}

/**
 * Pinta linhas alternadas (zebra striping) num intervalo de linhas.
 *
 * Utilitário genérico, totalmente parametrizado. Wrapper de domínio:
 * `aplicarZebraDados(aba)` no fim deste arquivo.
 *
 * @param {GoogleAppsScript.Spreadsheet.Sheet} aba - Aba alvo
 * @param {number} totalLinhas - Quantidade de linhas a pintar
 * @param {number} linhaInicial - Primeira linha (1-based) onde começar
 * @param {number} totalColunas - Largura horizontal a formatar
 * @param {string} corClara - Cor de fundo das linhas pares (hex)
 * @param {string} corEscura - Cor de fundo das linhas ímpares (hex)
 */
function _criarLinhasZebradas(
  aba,
  totalLinhas,
  linhaInicial,
  totalColunas,
  corClara,
  corEscura,
) {
  Logger.log(
    `[INFO] Criando ${totalLinhas} linhas zebradas a partir da linha ${linhaInicial}...`,
  );

  try {
    for (let i = 0; i < totalLinhas; i++) {
      const linha = linhaInicial + i;
      const cor = i % 2 === 0 ? corClara : corEscura;

      // Aplicar formatação zebrada em todas as colunas
      aba
        .getRange(linha, 1, 1, totalColunas)
        .setBackground(cor)
        .setVerticalAlignment("top")
        .setFontSize(10);
    }

    Logger.log(`[OK] ${totalLinhas} linhas zebradas criadas com sucesso`);
  } catch (erro) {
    Logger.log(`[ERRO] Falha ao criar linhas zebradas: ${erro.message}`);
    throw erro;
  }
}

/**
 * Verifica se uma aba existe na planilha
 *
 * @param {string} nomeAba - Nome da aba para verificar
 * @returns {boolean} true se existe, false caso contrário
 */
function _abaExiste(nomeAba) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(nomeAba) !== null;
}

/**
 * Registra informação de data e turno na aba
 *
 * @param {GoogleAppsScript.Spreadsheet.Sheet} aba - Aba para preencher
 * @param {Date} data - Data do turno
 * @param {string} turno - "D" ou "N"
 */
function _preencherInformacoesTurno(aba, data, turno) {
  const dataFormatada = _formatarNomeAba(data, "").trim(); // Apenas data sem turno
  const descricaoTurno =
    turno === "D" ? "DIURNO (7h às 19h)" : "NOTURNO (19h às 7h)";

  aba.getRange("B2").setValue(dataFormatada);
  aba.getRange("B3").setValue(descricaoTurno);
}

/**
 * Aplica zebra striping na área de dados de uma aba.
 *
 * Wrapper de domínio sobre `_criarLinhasZebradas`: lê as coordenadas
 * e cores de `CONFIG` e aplica sobre o intervalo padrão de dados de
 * pacientes (linhas PRIMEIRA_LINHA_DADOS a ULTIMA_LINHA_DADOS).
 *
 * @param {GoogleAppsScript.Spreadsheet.Sheet} aba - Aba alvo
 * @throws {Error} Se `aba` não for fornecida
 */
function aplicarZebraDados(aba) {
  if (!aba) {
    throw new Error('aplicarZebraDados: parâmetro "aba" não fornecido');
  }

  _criarLinhasZebradas(
    aba,
    CONFIG.ULTIMA_LINHA_DADOS,
    CONFIG.PRIMEIRA_LINHA_DADOS,
    CONFIG.TOTAL_COLUNAS,
    CONFIG.CORES.ZEBRA_CLARO,
    CONFIG.CORES.ZEBRA_ESCURO,
  );
}
