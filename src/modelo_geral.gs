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
    _protegerCelulas(modelo);

    // Padronização de formatação
    padronizarColunasDados(modelo);

    // Banner das linhas divisoras (depois de toda pintura da faixa)
    _implementarLinhasDivisoras(modelo);

    // Configura aba oculta
    modelo.hideSheet();

    Logger.log("[OK] ✅ Aba-modelo criada com sucesso!");
    Logger.log("[INFO] ===== FIM DA CRIAÇÃO DA ABA-MODELO =====");
  } catch (erro) {
    Logger.log(`[ERRO] ❌ Falha ao criar aba-modelo: ${erro.message}`);
    throw erro;
  }
}

// ============================================================
// SEÇÃO DE INFORMAÇÕES
// ============================================================

/**
 * Preenche as linhas inciais com a seção de informações do turno:
 * Hospital, Data, Turno e Equipe — Fisioterapeuta,
 * Enfermeiros, Médicos. Os campos para preenchimento mesclam 3 colunas.
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

    // Linha 5: Fisioterapeuta 1
    modelo
      .getRange("A5")
      .setValue("Profissional 1:")
      .setFontWeight("bold")
      .setFontSize(11)
      .setFontColor(CONFIG.CORES.INFO_TITULO);

    modelo
      .getRange("B5:D5")
      .merge()
      .setValue("")
      .setBackground(CONFIG.CORES.INFO_FUNDO);

    // Linha 6: Fisioterapeuta 2
    modelo
      .getRange("A6")
      .setValue("Profissional 2:")
      .setFontWeight("bold")
      .setFontSize(11)
      .setFontColor(CONFIG.CORES.INFO_TITULO);

    modelo
      .getRange("B6:D6")
      .merge()
      .setValue("")
      .setBackground(CONFIG.CORES.INFO_FUNDO);

    // Linha 7: Enfermeiros
    modelo
      .getRange("A7")
      .setValue("Enfermeiros:")
      .setFontWeight("bold")
      .setFontSize(11)
      .setFontColor(CONFIG.CORES.INFO_TITULO);

    modelo
      .getRange("B7:D7")
      .merge()
      .setValue("")
      .setBackground(CONFIG.CORES.INFO_FUNDO);

    // Linha 8: Médicos
    modelo
      .getRange("A8")
      .setValue("Médicos:")
      .setFontWeight("bold")
      .setFontSize(11)
      .setFontColor(CONFIG.CORES.INFO_TITULO);

    modelo
      .getRange("B8:D8")
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
// SEÇÃO DE INDICADORES
// ============================================================

/**
 * Preenche a seção de indicadores: títulos e fórmulas
 * COUNTIF/SUM (linha 10). Itera sobre
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
 * Aplica regras de validação de dados (dropdowns) na aba modelo.
 *
 * AGNÓSTICA DE ÁREA: não conhece nenhuma coluna pelo nome. Consome
 * dois pontos de extensão declarados no config do setor:
 *
 *   - `VALIDACOES_COLUNAS` — mapa coluna → descritor, aplicado sobre
 *     toda a faixa de dados. Coluna que não existe na área
 *     simplesmente não aparece no mapa; nada de `if` aqui.
 *     O descritor traz `lista` (valores fixos) OU `range` (notação A1
 *     da própria aba, para dropdown que espelha células vivas — ex.:
 *     a coluna PROFISSIONAL lendo os profissionais escalados no turno).
 *
 *   - `_validacoesCelulas()` — lista de células avulsas da seção de
 *     informações (ex.: profissional 1 e 2). É função, e não const,
 *     porque referencia listas de outros arquivos (FISIOTERAPEUTAS);
 *     a avaliação tardia evita depender da ordem dos arquivos no
 *     projeto Apps Script.
 *
 * `permitirInvalido: true` libera valor fora da fonte — usado em LEITO
 * e EVENTOS deliberadamente (ver REFERENCIA.md), e recomendado em
 * dropdowns por `range`, cuja fonte muda a cada turno.
 *
 * @param {GoogleAppsScript.Spreadsheet.Sheet} modelo - Aba modelo em construção
 * @throws {Error} Em falha técnica
 */
function _aplicarValidacoes(modelo) {
  Logger.log("[INFO] Aplicando validações de dados...");

  try {
    let aplicadas = 0;

    // ──────────────────────────────────────────────────────────
    // Colunas da faixa de dados
    // ──────────────────────────────────────────────────────────
    Object.entries(VALIDACOES_COLUNAS).forEach(([colunaKey, descritor]) => {
      const construtor = SpreadsheetApp.newDataValidation();

      if (descritor.range) {
        // Dropdown vivo: aponta para células da PRÓPRIA aba. Cada turno é
        // um clone e o Sheets reescreve a referência para a cópia, então
        // cada aba passa a ler a sua própria equipe.
        construtor.requireValueInRange(modelo.getRange(descritor.range), true);
      } else if (Array.isArray(descritor.lista) && descritor.lista.length > 0) {
        construtor.requireValueInList(descritor.lista, true);
      } else {
        Logger.log(
          `[AVISO] Coluna ${colunaKey}: sem lista nem range de validação — ignorada`,
        );
        return;
      }

      const regra = construtor
        .setAllowInvalid(descritor.permitirInvalido === true)
        .build();

      modelo
        .getRange(
          CONFIG.PRIMEIRA_LINHA_DADOS,
          _normalizarColuna(colunaKey),
          CONFIG.MAX_LINHAS_DADOS,
          1,
        )
        .setDataValidation(regra);

      aplicadas++;
    });

    // ──────────────────────────────────────────────────────────
    // Células avulsas da seção de informações (equipe)
    // ──────────────────────────────────────────────────────────
    _validacoesCelulas().forEach((celula) => {
      if (!Array.isArray(celula.lista) || celula.lista.length === 0) {
        Logger.log(
          `[AVISO] Célula (${celula.linha}, ${celula.coluna}): lista vazia — ignorada`,
        );
        return;
      }

      const regra = SpreadsheetApp.newDataValidation()
        .requireValueInList(celula.lista, true)
        .setAllowInvalid(false)
        .build();

      modelo
        .getRange(celula.linha, celula.coluna, 1, 1)
        .setDataValidation(regra);

      aplicadas++;
    });

    Logger.log(`[OK] ${aplicadas} validação(ões) aplicada(s)`);
  } catch (erro) {
    Logger.log(`[ERRO] Falha ao aplicar validações: ${erro.message}`);
    throw erro;
  }
}

// ============================================================
// PROTEGER CÉLULAS
// ============================================================

/**
 * Aplica proteção em modo AVISO à aba, deixando livres os ranges
 * editáveis pela equipe (data/turno, equipe, dados de pacientes).
 *
 * Por que modo aviso e não removeEditors: a proteção por lista de
 * editores nunca bloqueia o dono NEM o usuário que executa o script.
 * Como os turnos são criados pelos próprios editores (fisioterapeutas)
 * via menu, cada criador ficaria isento da proteção que ele mesmo cria.
 * O modo aviso vale para todos por igual e cobre o objetivo real:
 * prevenir edição acidental das células estruturais.
 *
 * @param {GoogleAppsScript.Spreadsheet.Sheet} aba - Aba alvo
 * @throws {Error} Em falha técnica
 */
function _protegerCelulas(aba) {
  Logger.log("[INFO] Configurando proteção de células (modo aviso)...");
  try {
    const protection = aba.protect().setDescription("Proteção do Mapa do Eixo");

    // Ranges livres (editáveis sem aviso)
    protection.setUnprotectedRanges([
      aba.getRange(CONFIG.RANGE_DATA_TURNO),
      aba.getRange(CONFIG.RANGE_EQUIPE),
      aba.getRange(CONFIG.RANGE_PACIENTES),
    ]);

    // Proteção baseada em aviso: uniforme para todos, sem isenções
    protection.setWarningOnly(true);

    Logger.log("[OK] Proteção em modo aviso configurada.");
  } catch (erro) {
    Logger.log(`[ERRO] Falha ao proteger células: ${erro.message}`);
    throw erro;
  }
}

/**
 * Aplica o banner visual nas linhas divisoras da seção de dados.
 *
 * Varre a coluna LEITO da faixa de dados; toda linha cujo valor conste
 * em CONFIG.LINHAS_DIVISORAS é mesclada (TOTAL_COLUNAS) e formatada
 * como banner. O texto já vem semeado no LEITOS_INICIAIS — esta função
 * só detecta e formata, não escreve rótulo.
 *
 * Idempotente: roda no modelo E em cada turno gerado (a zebra do turno
 * repinta a faixa e apaga o amarelo, então o banner é reaplicado).
 * Por isso o breakApart antes do merge — o clone já vem mesclado.
 *
 * Guarda: área sem CONFIG.LINHAS_DIVISORAS (ex.: Eixo) → no-op.
 *
 * @param {GoogleAppsScript.Spreadsheet.Sheet} aba - Aba alvo (modelo ou turno)
 */
function _implementarLinhasDivisoras(aba) {
  // Guarda: sem lista de divisores, não aplica nada.
  if (
    !Array.isArray(CONFIG.LINHAS_DIVISORAS) ||
    CONFIG.LINHAS_DIVISORAS.length === 0
  ) {
    return;
  }

  Logger.log("[INFO] Aplicando linhas divisoras...");

  try {
    // Lê a coluna LEITO inteira numa única leitura (1 chamada à API).
    const valores = aba
      .getRange(
        CONFIG.PRIMEIRA_LINHA_DADOS,
        CONFIG.COL_LEITO,
        CONFIG.MAX_LINHAS_DADOS,
        1,
      )
      .getValues();

    const divisores = CONFIG.LINHAS_DIVISORAS;
    let aplicadas = 0;

    for (let i = 0; i < valores.length; i++) {
      const valor = (valores[i][0] || "").toString().trim();

      // Só formata linhas cujo valor casa com a lista de divisores.
      if (valor === "" || divisores.indexOf(valor) === -1) {
        continue;
      }

      const linha = CONFIG.PRIMEIRA_LINHA_DADOS + i;
      const range = aba.getRange(linha, 1, 1, CONFIG.TOTAL_COLUNAS);

      // Idempotência: desfaz mescla anterior (clone já vem mesclado) e refaz.
      range.breakApart();
      range.merge();

      aplicarFormatacao(range, FORMATO_LINHA_DIVISORA);
      aplicadas++;
    }

    Logger.log(`[OK] ${aplicadas} linha(s) divisora(s) aplicada(s)`);
  } catch (erro) {
    Logger.log(`[ERRO] Falha ao aplicar linhas divisoras: ${erro.message}`);
    throw erro;
  }
}
