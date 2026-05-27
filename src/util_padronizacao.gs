// ============================================================
// util_padronizacao.gs — FORMATAÇÃO GENÉRICA DE COLUNAS
// ============================================================
// Sistema de Gestão do Mapa do Eixo da Fisioterapia UTI
// Versão: 1.0
// Data: 2026-05-21
// ============================================================
//
// Utilitários de formatação parametrizada (alinhamento, wrap,
// largura, cor, fonte). Não conhece nenhuma regra do domínio
// "Mapa do Eixo" — recebe descritores e aplica.
//
// O wrapper de domínio `padronizarColunasDados(aba)` aplica
// o mapa `FORMATO_COLUNAS_DADOS` (definido em config.gs) sobre
// a área de dados padrão de pacientes.
// ============================================================

/**
 * Aplica formatação a um range a partir de um objeto descritor.
 * Propriedades omitidas não são alteradas (não há reset implícito).
 *
 * @param {Range} range - Range alvo
 * @param {Object} formato - Descritor de formatação
 * @param {string}  [formato.horizontalAlignment] - "left" | "center" | "right"
 * @param {string}  [formato.verticalAlignment]   - "top" | "middle" | "bottom"
 * @param {boolean} [formato.wrap]                - Quebra de linha automática
 * @param {boolean} [formato.bold]
 * @param {boolean} [formato.italic]
 * @param {number}  [formato.fontSize]
 * @param {string}  [formato.fontColor]           - Cor do texto (hex)
 * @param {string}  [formato.background]          - Cor de fundo (hex)
 * @param {string}  [formato.numberFormat]        - Ex: "0", "0.00", "dd/MM/yyyy"
 */
function aplicarFormatacao(range, formato) {
  if (formato.horizontalAlignment !== undefined)
    range.setHorizontalAlignment(formato.horizontalAlignment);
  if (formato.verticalAlignment !== undefined)
    range.setVerticalAlignment(formato.verticalAlignment);
  if (formato.wrap !== undefined) range.setWrap(formato.wrap);
  if (formato.bold !== undefined)
    range.setFontWeight(formato.bold ? "bold" : "normal");
  if (formato.italic !== undefined)
    range.setFontStyle(formato.italic ? "italic" : "normal");
  if (formato.fontSize !== undefined) range.setFontSize(formato.fontSize);
  if (formato.fontColor !== undefined) range.setFontColor(formato.fontColor);
  if (formato.background !== undefined) range.setBackground(formato.background);
  if (formato.numberFormat !== undefined)
    range.setNumberFormat(formato.numberFormat);
}

/**
 * Aplica formatação a múltiplas colunas de uma só vez.
 *
 * A chave do mapa pode ser:
 *   - Índice numérico (1-based): ex. CONFIG.COL_NOME
 *   - Letra de coluna: ex. "A", "L", "AA"
 *
 * A propriedade `width` é tratada à parte (setColumnWidth é da sheet, não do range).
 *
 * @param {Sheet}  sheet
 * @param {Object} mapaFormatacao - Mapa coluna → descritor de formatação
 * @param {Object} [opcoes]
 * @param {number} [opcoes.linhaInicial=1] - Primeira linha (recomendado passar explícito para não clobberizar headers)
 * @param {number} [opcoes.linhaFinal]     - Última linha (default: última linha da sheet)
 *
 * @example
 *   aplicarFormatacaoColunas(modelo, {
 *     [CONFIG.COL_LEITO]:    { horizontalAlignment: "center", bold: true, width: 60 },
 *     [CONFIG.COL_NOME]:     { horizontalAlignment: "left",   wrap: true, width: 200 },
 *     [CONFIG.COL_DESFECHO]: { horizontalAlignment: "center", width: 110 },
 *   }, { linhaInicial: CONFIG.LINHA_DADOS_INICIO });
 */
function aplicarFormatacaoColunas(sheet, mapaFormatacao, opcoes = {}) {
  const linhaInicial = opcoes.linhaInicial || 1;
  const linhaFinal = opcoes.linhaFinal || sheet.getMaxRows();
  const numLinhas = linhaFinal - linhaInicial + 1;

  Object.entries(mapaFormatacao).forEach(([colunaKey, formato]) => {
    const indiceColuna = _normalizarColuna(colunaKey);

    // Largura é propriedade da sheet, não do range
    if (formato.width !== undefined) {
      sheet.setColumnWidth(indiceColuna, formato.width);
    }

    const range = sheet.getRange(linhaInicial, indiceColuna, numLinhas, 1);
    aplicarFormatacao(range, formato);
  });
}

/**
 * Normaliza identificador de coluna para índice numérico (1-based).
 * Aceita: número (3), string numérica ("3"), ou letra ("C", "AA").
 */
function _normalizarColuna(coluna) {
  if (typeof coluna === "number") return coluna;
  if (/^\d+$/.test(coluna)) return parseInt(coluna, 10);
  return _letraParaIndice(coluna);
}

/**
 * Converte letra de coluna do Sheets em índice numérico (1-based).
 * Ex: "A" → 1, "L" → 12, "AA" → 27
 */
function _letraParaIndice(letra) {
  letra = letra.toUpperCase();
  let indice = 0;
  for (let i = 0; i < letra.length; i++) {
    indice = indice * 26 + (letra.charCodeAt(i) - 64);
  }
  return indice;
}

/**
 * Aplica o formato padrão de colunas na área de dados da aba.
 *
 * Wrapper de domínio: lê `FORMATO_COLUNAS_DADOS` de config.gs e
 * aplica sobre as linhas PRIMEIRA_LINHA_DADOS a ULTIMA_LINHA_DADOS.
 *
 * @param {Sheet} aba - Aba alvo
 * @throws {Error} Se `aba` não for fornecida
 */
function padronizarColunasDados(aba) {
  if (!aba) {
    throw new Error('padronizarColunasDados: parâmetro "aba" não fornecido');
  }

  aplicarFormatacaoColunas(aba, FORMATO_COLUNAS_DADOS, {
    linhaInicial: CONFIG.PRIMEIRA_LINHA_DADOS,
    linhaFinal: CONFIG.ULTIMA_LINHA_DADOS,
  });
}
