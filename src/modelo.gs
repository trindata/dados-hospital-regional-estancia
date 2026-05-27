// ============================================================
// modelo.gs — CRIAÇÃO DA ABA-MODELO MAPA DO EIXO
// ============================================================
// Sistema de Gestão do Mapa do Eixo da Fisioterapia UTI
// Versão: 1.0
// Data: 2026-05-16
// ============================================================

/**
 * Cria a aba-modelo `_MODELO_MAPA_EIXO` do zero.
 *
 * Operação idempotente: se a aba já existir, é deletada antes da
 * recriação. Constrói toda a estrutura visual (informações,
 * indicadores, cabeçalho, dados iniciais), aplica validações,
 * larguras, proteção e oculta a aba ao final.
 *
 * É entry point de SETUP — executado manualmente pelo editor do
 * Apps Script na instalação inicial ou ao recriar o modelo após
 * mudanças estruturais. Não é parte do uso diário.
 *
 * Importante: recriar o modelo NÃO afeta abas de turnos já
 * criadas, pois cada turno é um clone independente.
 *
 * @throws {Error} Em qualquer falha durante a construção
 */
function _criarAbaModelo() {
  Logger.log("[INFO] ===== INICIANDO CRIAÇÃO DA ABA-MODELO MAPA DO EIXO =====");

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // Remove aba-modelo antiga se existir
    let modelo = ss.getSheetByName(CONFIG.MODELO_NOME);
    if (modelo) {
      Logger.log("[INFO] Deletando aba-modelo existente...");
      ss.deleteSheet(modelo);
    }

    // Cria nova aba-modelo
    Logger.log(`[INFO] Criando nova aba "${CONFIG.MODELO_NOME}"...`);
    modelo = ss.insertSheet(CONFIG.MODELO_NOME);

    // Constrói estrutura completa
    _criarSecaoInformacoes(modelo);
    _criarSecaoIndicadores(modelo);
    _criarCabecalhoDados(modelo);
    _criarLinhasIniciais(modelo);
    _aplicarValidacoes(modelo);
    _ajustarColunas(modelo);
    _protegerCelulas(modelo);

    // Padronização de formatação
    padronizarColunasDados(modelo);

    // Configura congelamento e oculta aba
    modelo.setFrozenRows(CONFIG.LINHA_CABECALHO); // Congela até cabeçalho
    modelo.hideSheet();

    Logger.log("[OK] ✅ Aba-modelo criada com sucesso!");
    Logger.log("[INFO] ===== FIM DA CRIAÇÃO DA ABA-MODELO =====");
  } catch (erro) {
    Logger.log(`[ERRO] ❌ Falha ao criar aba-modelo: ${erro.message}`);
    throw erro;
  }
}

// ============================================================
// SEÇÃO DE INFORMAÇÕES (Linhas 1-8)
// ============================================================

/**
 * Preenche as linhas 1-7 com a seção de informações do turno:
 * Hospital, Data, Turno (linhas 1-3) e Equipe — Fisioterapeuta,
 * Enfermeiros, Médicos (linhas 5-7). Os campos B5:D7 ficam mesclados.
 *
 * Os valores de data, turno e equipe ficam em branco no modelo —
 * são preenchidos a cada novo turno.
 *
 * @param {GoogleAppsScript.Spreadsheet.Sheet} modelo - Aba modelo em construção
 * @throws {Error} Em falha técnica
 */
function _criarSecaoInformacoes(modelo) {
  Logger.log("[INFO] Criando seção de informações...");

  try {
    // Linha 1: Hospital
    modelo
      .getRange("A1")
      .setValue("Hospital:")
      .setFontWeight("bold")
      .setFontSize(11)
      .setFontColor(CONFIG.CORES.INFO_TITULO);

    modelo
      .getRange("B1")
      .setValue("HOSPITAL REGIONAL JESSÉ FONTES")
      .setFontSize(11);

    // Linha 2: Data
    modelo
      .getRange("A2")
      .setValue("Data:")
      .setFontWeight("bold")
      .setFontSize(11)
      .setFontColor(CONFIG.CORES.INFO_TITULO);

    modelo
      .getRange("B2")
      .setValue("") // Será preenchido na criação do turno
      .setFontSize(11)
      .setBackground(CONFIG.CORES.INFO_FUNDO);

    // Linha 3: Turno
    modelo
      .getRange("A3")
      .setValue("Turno:")
      .setFontWeight("bold")
      .setFontSize(11)
      .setFontColor(CONFIG.CORES.INFO_TITULO);

    modelo
      .getRange("B3")
      .setValue("") // Será preenchido na criação do turno
      .setFontSize(11)
      .setBackground(CONFIG.CORES.INFO_FUNDO);

    // Linha 5: Fisioterapeuta
    modelo
      .getRange("A5")
      .setValue("Fisioterapeuta:")
      .setFontWeight("bold")
      .setFontSize(11)
      .setFontColor(CONFIG.CORES.INFO_TITULO);

    modelo
      .getRange("B5:D5")
      .merge()
      .setValue("")
      .setBackground(CONFIG.CORES.INFO_FUNDO);

    // Linha 6: Enfermeiros
    modelo
      .getRange("A6")
      .setValue("Enfermeiros:")
      .setFontWeight("bold")
      .setFontSize(11)
      .setFontColor(CONFIG.CORES.INFO_TITULO);

    modelo
      .getRange("B6:D6")
      .merge()
      .setValue("")
      .setBackground(CONFIG.CORES.INFO_FUNDO);

    // Linha 7: Médicos
    modelo
      .getRange("A7")
      .setValue("Médicos:")
      .setFontWeight("bold")
      .setFontSize(11)
      .setFontColor(CONFIG.CORES.INFO_TITULO);

    modelo
      .getRange("B7:D7")
      .merge()
      .setValue("")
      .setBackground(CONFIG.CORES.INFO_FUNDO);

    Logger.log("[OK] Seção de informações criada");
  } catch (erro) {
    Logger.log(`[ERRO] Falha ao criar seção de informações: ${erro.message}`);
    throw erro;
  }
}

// ============================================================
// SEÇÃO DE INDICADORES (Linhas 10-14)
// ============================================================

/**
 * Preenche as linhas 9-10 com a seção de indicadores: títulos
 * (linha 9) e fórmulas COUNTIF/SUM (linha 10). Itera sobre
 * `CONFIG.INDICADORES` — adicionar/remover indicadores se faz
 * editando esse array.
 *
 * @param {GoogleAppsScript.Spreadsheet.Sheet} modelo - Aba modelo em construção
 * @throws {Error} Em falha técnica
 */
function _criarSecaoIndicadores(modelo) {
  Logger.log("[INFO] Criando seção de indicadores...");

  try {
    const indicadores = CONFIG.INDICADORES;
    const linhaTitulos = CONFIG.LINHA_INDICADORES_INICIO;
    const linhaValores = CONFIG.LINHA_INDICADORES_DADOS;

    // Constrói arrays 2D para escrita em lote (mais rápido que setValue/setFormula em loop)
    const titulos = [indicadores.map((ind) => ind.label)];
    const formulas = [indicadores.map((ind) => ind.formula)];

    // Linha de títulos
    const rangeTitulos = modelo.getRange(
      linhaTitulos,
      1,
      1,
      indicadores.length,
    );
    rangeTitulos
      .setValues(titulos)
      .setFontWeight("bold")
      .setFontSize(10)
      .setBackground(CONFIG.CORES.CABECALHO_FUNDO)
      .setFontColor(CONFIG.CORES.CABECALHO_TEXTO)
      .setHorizontalAlignment("center")
      .setVerticalAlignment("middle")
      .setWrap(true);

    // Linha de valores (fórmulas)
    const rangeValores = modelo.getRange(
      linhaValores,
      1,
      1,
      indicadores.length,
    );
    rangeValores
      .setFormulas(formulas)
      .setFontWeight("bold")
      .setFontSize(11)
      .setBackground(CONFIG.CORES.INDICADOR_FUNDO)
      .setHorizontalAlignment("center")
      .setVerticalAlignment("middle");

    Logger.log(
      `[OK] Seção de indicadores criada com ${indicadores.length} indicadores`,
    );
  } catch (erro) {
    Logger.log(`[ERRO] Falha ao criar seção de indicadores: ${erro.message}`);
    throw erro;
  }
}

// ============================================================
// CABEÇALHO DE DADOS (Linha 16)
// ============================================================

/**
 * Preenche a linha 12 com o cabeçalho da tabela de pacientes.
 * Lê os labels de `CONFIG.HEADERS` (16 colunas, A-P).
 *
 * @param {GoogleAppsScript.Spreadsheet.Sheet} modelo - Aba modelo em construção
 * @throws {Error} Em falha técnica
 */
function _criarCabecalhoDados(modelo) {
  Logger.log("[INFO] Criando cabeçalho de dados...");

  try {
    modelo
      .getRange(CONFIG.LINHA_CABECALHO, 1, 1, CONFIG.TOTAL_COLUNAS)
      .setValues(CONFIG.HEADERS)
      .setBackground(CONFIG.CORES.CABECALHO_FUNDO)
      .setFontColor(CONFIG.CORES.CABECALHO_TEXTO)
      .setFontWeight("bold")
      .setFontSize(10)
      .setHorizontalAlignment("center")
      .setVerticalAlignment("middle")
      .setWrap(true);

    Logger.log(
      `[OK] Cabeçalho de dados criado com ${CONFIG.TOTAL_COLUNAS} colunas`,
    );
  } catch (erro) {
    Logger.log(`[ERRO] Falha ao criar cabeçalho de dados: ${erro.message}`);
    throw erro;
  }
}

// ============================================================
// LINHAS INICIAIS DE DADOS
// ============================================================

/**
 * Inicializa a área de dados: aplica zebra striping nas
 * `CONFIG.MAX_LINHAS_DADOS` linhas e preenche a coluna LEITO das
 * primeiras linhas com os leitos fixos de `CONFIG.LEITOS_INICIAIS`.
 *
 * @param {GoogleAppsScript.Spreadsheet.Sheet} modelo - Aba modelo em construção
 * @throws {Error} Em falha técnica
 */
function _criarLinhasIniciais(modelo) {
  Logger.log("[INFO] Criando linhas de dados zebradas...");

  try {
    const totalLinhas = CONFIG.MAX_LINHAS_DADOS || 100;
    const numLeitosIniciais = CONFIG.LEITOS_INICIAIS.length;

    // ──────────────────────────────────────────────────────────
    // PASSO 1: Aplicar zebra striping em toda a área de dados
    // ──────────────────────────────────────────────────────────
    aplicarZebraDados(modelo);

    // ──────────────────────────────────────────────────────────
    // PASSO 2: Preencher leitos fixos nas primeiras linhas
    // ──────────────────────────────────────────────────────────
    for (let i = 0; i < numLeitosIniciais; i++) {
      const linha = CONFIG.PRIMEIRA_LINHA_DADOS + i;

      // Preencher nome do leito na coluna A
      modelo
        .getRange(linha, CONFIG.COL_LEITO)
        .setValue(CONFIG.LEITOS_INICIAIS[i]);
    }

    Logger.log(`[OK] ${numLeitosIniciais} leitos fixos preenchidos`);
    Logger.log(`[INFO] Leitos: ${CONFIG.LEITOS_INICIAIS.join(", ")}`);
  } catch (erro) {
    Logger.log(`[ERRO] Falha ao criar linhas iniciais: ${erro.message}`);
    throw erro;
  }
}

// ============================================================
// APLICAR VALIDAÇÕES (DROPDOWNS)
// ============================================================

/**
 * Aplica regras de validação de dados (dropdowns) em todas as
 * colunas pertinentes da área de dados, e no campo Fisioterapeuta
 * da seção de informações.
 *
 * As listas de valores vêm de `CONFIG.VALIDACOES` e de
 * `FISIOTERAPEUTAS`. As colunas LEITO e EVENTOS usam
 * `setAllowInvalid(true)` deliberadamente — ver REFERENCIA.md.
 *
 * @param {GoogleAppsScript.Spreadsheet.Sheet} modelo - Aba modelo em construção
 * @throws {Error} Em falha técnica
 */
function _aplicarValidacoes(modelo) {
  Logger.log("[INFO] Aplicando validações de dados...");

  try {
    // FISIOTERAPEUTAS (Cabeçalho)
    const ruleFisios = SpreadsheetApp.newDataValidation()
      .requireValueInList(FISIOTERAPEUTAS, true)
      .setAllowInvalid(false)
      .build();
    modelo
      .getRange(CONFIG.LINHA_FISIOS, CONFIG.COL_FISIOS, 1, 1)
      .setDataValidation(ruleFisios);

    // LEITO (Coluna A)
    const ruleLeito = SpreadsheetApp.newDataValidation()
      .requireValueInList(CONFIG.VALIDACOES.LEITO, true)
      .setAllowInvalid(true)
      .build();
    modelo
      .getRange(
        CONFIG.PRIMEIRA_LINHA_DADOS,
        CONFIG.COL_LEITO,
        CONFIG.MAX_LINHAS_DADOS,
        1,
      )
      .setDataValidation(ruleLeito);

    // VIA AÉREA (Coluna D)
    const ruleViaAerea = SpreadsheetApp.newDataValidation()
      .requireValueInList(CONFIG.VALIDACOES.VIA_AEREA, true)
      .setAllowInvalid(false)
      .build();
    modelo
      .getRange(
        CONFIG.PRIMEIRA_LINHA_DADOS,
        CONFIG.COL_VIA_AEREA,
        CONFIG.MAX_LINHAS_DADOS,
        1,
      )
      .setDataValidation(ruleViaAerea);

    // EVENTOS (Coluna E)
    const ruleEventos = SpreadsheetApp.newDataValidation()
      .requireValueInList(CONFIG.VALIDACOES.EVENTOS, true)
      .setAllowInvalid(true) // Permite múltipla seleção manual
      .build();
    modelo
      .getRange(
        CONFIG.PRIMEIRA_LINHA_DADOS,
        CONFIG.COL_EVENTOS,
        CONFIG.MAX_LINHAS_DADOS,
        1,
      )
      .setDataValidation(ruleEventos);

    // VNI (Coluna F)
    const ruleVNI = SpreadsheetApp.newDataValidation()
      .requireValueInList(CONFIG.VALIDACOES.VNI, true)
      .setAllowInvalid(false)
      .build();
    modelo
      .getRange(
        CONFIG.PRIMEIRA_LINHA_DADOS,
        CONFIG.COL_VNI,
        CONFIG.MAX_LINHAS_DADOS,
        1,
      )
      .setDataValidation(ruleVNI);

    // DESMAME VM (Coluna G)
    const ruleDesmame = SpreadsheetApp.newDataValidation()
      .requireValueInList(CONFIG.VALIDACOES.DESMAME_VM, true)
      .setAllowInvalid(false)
      .build();
    modelo
      .getRange(
        CONFIG.PRIMEIRA_LINHA_DADOS,
        CONFIG.COL_DESMAME_VM,
        CONFIG.MAX_LINHAS_DADOS,
        1,
      )
      .setDataValidation(ruleDesmame);

    // META MOTORA (Coluna H)
    const ruleMetaMotora = SpreadsheetApp.newDataValidation()
      .requireValueInList(CONFIG.VALIDACOES.META_MOTORA, true)
      .setAllowInvalid(false)
      .build();
    modelo
      .getRange(
        CONFIG.PRIMEIRA_LINHA_DADOS,
        CONFIG.COL_META_MOTORA,
        CONFIG.MAX_LINHAS_DADOS,
        1,
      )
      .setDataValidation(ruleMetaMotora);

    // META RESP. (Coluna I)
    const ruleMetaResp = SpreadsheetApp.newDataValidation()
      .requireValueInList(CONFIG.VALIDACOES.META_RESP, true)
      .setAllowInvalid(false)
      .build();
    modelo
      .getRange(
        CONFIG.PRIMEIRA_LINHA_DADOS,
        CONFIG.COL_META_RESP,
        CONFIG.MAX_LINHAS_DADOS,
        1,
      )
      .setDataValidation(ruleMetaResp);

    // DEFICIT MOTOR (Coluna K)
    const ruleDeficit = SpreadsheetApp.newDataValidation()
      .requireValueInList(CONFIG.VALIDACOES.DEFICIT_MOTOR, true)
      .setAllowInvalid(false)
      .build();
    modelo
      .getRange(
        CONFIG.PRIMEIRA_LINHA_DADOS,
        CONFIG.COL_DEFICIT_MOTOR,
        CONFIG.MAX_LINHAS_DADOS,
        1,
      )
      .setDataValidation(ruleDeficit);

    // PRESCRIÇÃO (Coluna M)
    const rulePrescricao = SpreadsheetApp.newDataValidation()
      .requireValueInList(CONFIG.VALIDACOES.PRESCRICAO, true)
      .setAllowInvalid(false)
      .build();
    modelo
      .getRange(
        CONFIG.PRIMEIRA_LINHA_DADOS,
        CONFIG.COL_PRESCRICAO,
        CONFIG.MAX_LINHAS_DADOS,
        1,
      )
      .setDataValidation(rulePrescricao);

    // ADMISSÃO (Coluna N)
    const ruleAdmissao = SpreadsheetApp.newDataValidation()
      .requireValueInList(CONFIG.VALIDACOES.ADMISSAO, true)
      .setAllowInvalid(false)
      .build();
    modelo
      .getRange(
        CONFIG.PRIMEIRA_LINHA_DADOS,
        CONFIG.COL_ADMISSAO,
        CONFIG.MAX_LINHAS_DADOS,
        1,
      )
      .setDataValidation(ruleAdmissao);

    // DESFECHO (Coluna O)
    const ruleDesfecho = SpreadsheetApp.newDataValidation()
      .requireValueInList(CONFIG.VALIDACOES.DESFECHO, true)
      .setAllowInvalid(false)
      .build();
    modelo
      .getRange(
        CONFIG.PRIMEIRA_LINHA_DADOS,
        CONFIG.COL_DESFECHO,
        CONFIG.MAX_LINHAS_DADOS,
        1,
      )
      .setDataValidation(ruleDesfecho);

    Logger.log("[OK] Validações aplicadas em colunas");
  } catch (erro) {
    Logger.log(`[ERRO] Falha ao aplicar validações: ${erro.message}`);
    throw erro;
  }
}

// ============================================================
// AJUSTAR LARGURAS DAS COLUNAS
// ============================================================

/**
 * Define larguras explícitas para as 16 colunas de dados a partir
 * de `CONFIG.LARGURAS`.
 *
 * Sobreposição parcial com `padronizarColunasDados` (que também
 * aceita `width`), mantido aqui para garantir largura desde a
 * criação do modelo, antes da padronização rodar.
 *
 * @param {GoogleAppsScript.Spreadsheet.Sheet} modelo - Aba modelo em construção
 * @throws {Error} Em falha técnica
 */
function _ajustarColunas(modelo) {
  Logger.log("[INFO] Ajustando larguras das colunas...");

  try {
    modelo.setColumnWidth(CONFIG.COL_LEITO, CONFIG.LARGURAS.LEITO);
    modelo.setColumnWidth(CONFIG.COL_PACIENTE, CONFIG.LARGURAS.PACIENTE);
    modelo.setColumnWidth(CONFIG.COL_DIAGNOSTICO, CONFIG.LARGURAS.DIAGNOSTICO);
    modelo.setColumnWidth(CONFIG.COL_VIA_AEREA, CONFIG.LARGURAS.VIA_AEREA);
    modelo.setColumnWidth(CONFIG.COL_EVENTOS, CONFIG.LARGURAS.EVENTOS);
    modelo.setColumnWidth(CONFIG.COL_VNI, CONFIG.LARGURAS.VNI);
    modelo.setColumnWidth(CONFIG.COL_DESMAME_VM, CONFIG.LARGURAS.DESMAME_VM);
    modelo.setColumnWidth(CONFIG.COL_META_MOTORA, CONFIG.LARGURAS.META_MOTORA);
    modelo.setColumnWidth(CONFIG.COL_META_RESP, CONFIG.LARGURAS.META_RESP);
    modelo.setColumnWidth(CONFIG.COL_IMS, CONFIG.LARGURAS.IMS);
    modelo.setColumnWidth(
      CONFIG.COL_DEFICIT_MOTOR,
      CONFIG.LARGURAS.DEFICIT_MOTOR,
    );
    modelo.setColumnWidth(CONFIG.COL_NUM_ATEND, CONFIG.LARGURAS.NUM_ATEND);
    modelo.setColumnWidth(CONFIG.COL_PRESCRICAO, CONFIG.LARGURAS.PRESCRICAO);
    modelo.setColumnWidth(CONFIG.COL_ADMISSAO, CONFIG.LARGURAS.ADMISSAO);
    modelo.setColumnWidth(CONFIG.COL_DESFECHO, CONFIG.LARGURAS.DESFECHO);
    modelo.setColumnWidth(CONFIG.COL_AVALIACAO, CONFIG.LARGURAS.AVALIACAO);

    Logger.log("[OK] Larguras das colunas ajustadas");
  } catch (erro) {
    Logger.log(`[ERRO] Falha ao ajustar colunas: ${erro.message}`);
    throw erro;
  }
}

// ============================================================
// PROTEGER CÉLULAS
// ============================================================

/**
 * Protege a aba inteira, exceto os ranges editáveis pela equipe:
 * data/turno (`B2:B3`), equipe (`B5:D7`) e dados de pacientes
 * (linhas PRIMEIRA a ULTIMA, colunas A-P).
 *
 * Estratégia: cria proteção da aba toda, marca os ranges editáveis
 * como `UnprotectedRanges`, e remove todos os editores explícitos
 * da proteção — só o criador do script consegue editar células
 * protegidas. Ver REFERENCIA.md sobre por que esta abordagem em
 * vez de `setDomainEdit(false)`.
 *
 * @param {GoogleAppsScript.Spreadsheet.Sheet} modelo - Aba alvo
 * @throws {Error} Em falha técnica
 */
function _protegerCelulas(modelo) {
  Logger.log("[INFO] Configurando proteção de células...");
  try {
    const rangeDataTurno = CONFIG.RANGE_DATA_TURNO; // Data e Turno
    const rangeEquipe = CONFIG.RANGE_EQUIPE; // Fisioterapeuta, Enfermeiros, Médicos
    const rangePacientes = CONFIG.RANGE_PACIENTES; // Dados dos pacientes

    // Proteger toda a aba
    const protection = modelo
      .protect()
      .setDescription("Proteção do Mapa do Eixo");

    // Definir ranges NÃO protegidos (editáveis por todos)
    const rangesEditaveis = [
      modelo.getRange(rangeDataTurno),
      modelo.getRange(rangeEquipe),
      modelo.getRange(rangePacientes),
    ];

    protection.setUnprotectedRanges(rangesEditaveis);

    // ✅ CORREÇÃO: Remover TODOS os editores (exceto você)
    // Isso garante que APENAS o criador pode editar células protegidas
    protection.removeEditors(protection.getEditors());

    // Se quiser adicionar editores específicos que podem editar células protegidas:
    // protection.addEditor('email@exemplo.com');

    Logger.log("[OK] Proteção configurada:");
    Logger.log("  - Apenas o criador pode editar células protegidas");
    Logger.log(`  - ${rangeDataTurno} (Data, Turno): editável por todos`);
    Logger.log(`  - ${rangeEquipe} (Equipe): editável por todos`);
    Logger.log(`  - ${rangePacientes} (Dados): editável por todos`);
  } catch (erro) {
    Logger.log(`[ERRO] Falha ao proteger células: ${erro.message}`);
    throw erro;
  }
}
