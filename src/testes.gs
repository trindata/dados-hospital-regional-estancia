// ============================================================
// testes.gs — SUÍTE DE TESTES DO MAPA DO EIXO
// ============================================================
// Sistema de Gestão do Mapa do Eixo da Fisioterapia UTI
// Versão: 1.1 — sincronizada com a refatoração de pacientes.gs
// Data: 2026-05-29
// ============================================================
//
// O Apps Script não tem framework de teste nativo. Este arquivo
// implementa um mini-harness de asserção e duas baterias:
//
//   1. TESTES UNITÁRIOS  — funções puras (sem tocar na planilha).
//      Seguros, sem efeito colateral. Rode `executarTestes()`.
//
//   2. TESTES DE INTEGRAÇÃO — lógica que mexe na planilha
//      (mapeamento de leitos, cópia de pacientes). Cria abas
//      temporárias e as apaga no final (try/finally). NÃO toca
//      em abas de turno nem no modelo. Rode `executarTestesIntegracao()`.
//
// COMO LER O RESULTADO: selecione a função no editor, clique em
// "Executar" e abra o registro de execução (Ctrl+Enter / "Ver
// registros"). Os ❌ aparecem detalhados; o resumo fica no fim.
//
// Cobertura unitária:
//   _formatarNomeAba, _obterNomeAbaAnterior, _parsearData,
//   _compararLeitos, _normalizarColuna, _letraParaIndice
//
// Cobertura de integração:
//   _mapearLinhasPorLeito, _copiarPacientesAtivos
//
// HISTÓRICO:
//   v1.1 — BATERIA 7 migrada de _encontrarLinhaDoLeito (removida)
//          para _mapearLinhasPorLeito. BATERIA 8 atualizada para
//          o comportamento atual (duplicata mantém nome original
//          do leito; separação por ordenação, sem sufixo).
// ============================================================

// ============================================================
// MINI-HARNESS DE ASSERÇÃO
// ============================================================

const _RESULTADOS_TESTE = { passou: 0, falhou: 0 };

function _resetarResultados() {
  _RESULTADOS_TESTE.passou = 0;
  _RESULTADOS_TESTE.falhou = 0;
}

/** Asserção básica: registra passou/falhou e loga falhas. */
function _afirmar(condicao, contexto) {
  if (condicao) {
    _RESULTADOS_TESTE.passou++;
  } else {
    _RESULTADOS_TESTE.falhou++;
    Logger.log(`  ❌ FALHOU: ${contexto}`);
  }
}

/** Igualdade estrita (===), com mensagem mostrando esperado vs obtido. */
function _afirmarIgual(esperado, obtido, contexto) {
  _afirmar(
    esperado === obtido,
    `${contexto} — esperado <${esperado}>, obteve <${obtido}>`,
  );
}

/** Compara dois Date pelo timestamp (ignora referência de objeto). */
function _afirmarData(esperado, obtido, contexto) {
  const ok = obtido instanceof Date && esperado.getTime() === obtido.getTime();
  _afirmar(ok, `${contexto} — esperado <${esperado}>, obteve <${obtido}>`);
}

/** Verifica apenas o SINAL de um número (-1 / 0 / +1). Útil para comparadores. */
function _afirmarSinal(sinalEsperado, valor, contexto) {
  const sinal = valor === 0 ? 0 : valor > 0 ? 1 : -1;
  _afirmarIgual(sinalEsperado, sinal, contexto);
}

/** Imprime o resumo da bateria atual. */
function _imprimirResumo(nomeSuite) {
  const total = _RESULTADOS_TESTE.passou + _RESULTADOS_TESTE.falhou;
  Logger.log("──────────────────────────────────────────");
  Logger.log(
    `RESUMO [${nomeSuite}]: ${_RESULTADOS_TESTE.passou}/${total} passaram`,
  );
  if (_RESULTADOS_TESTE.falhou > 0) {
    Logger.log(`⚠️  ${_RESULTADOS_TESTE.falhou} falha(s) — ver detalhes acima`);
  } else {
    Logger.log("✅ Tudo verde");
  }
  Logger.log("──────────────────────────────────────────");
}

// ============================================================
// ENTRY POINT — TESTES UNITÁRIOS (SEGUROS)
// ============================================================

/**
 * Roda todas as baterias de testes unitários (funções puras).
 * Sem efeito colateral — não toca na planilha.
 */
function executarTestes() {
  _resetarResultados();
  Logger.log("═══════ TESTES UNITÁRIOS — MAPA DO EIXO ═══════");

  _corpoFormatarNomeAba();
  _corpoObterNomeAbaAnterior();
  _corpoParsearData();
  _corpoCompararLeitos();
  _corpoNormalizarColuna();
  _corpoLetraParaIndice();

  _imprimirResumo("UNITÁRIOS");
}

// ── Wrappers individuais (rode um por vez se quiser isolar) ──
function testarFormatarNomeAba() {
  _resetarResultados();
  _corpoFormatarNomeAba();
  _imprimirResumo("_formatarNomeAba");
}
function testarObterNomeAbaAnterior() {
  _resetarResultados();
  _corpoObterNomeAbaAnterior();
  _imprimirResumo("_obterNomeAbaAnterior");
}
function testarParsearData() {
  _resetarResultados();
  _corpoParsearData();
  _imprimirResumo("_parsearData");
}
function testarCompararLeitos() {
  _resetarResultados();
  _corpoCompararLeitos();
  _imprimirResumo("_compararLeitos");
}
function testarNormalizarColuna() {
  _resetarResultados();
  _corpoNormalizarColuna();
  _imprimirResumo("_normalizarColuna");
}
function testarLetraParaIndice() {
  _resetarResultados();
  _corpoLetraParaIndice();
  _imprimirResumo("_letraParaIndice");
}

// ============================================================
// BATERIA 1 — _formatarNomeAba
// ============================================================

function _corpoFormatarNomeAba() {
  Logger.log("· _formatarNomeAba");

  // Data normal, turno Diurno
  _afirmarIgual(
    "16/05/2026 D",
    _formatarNomeAba(new Date(2026, 4, 16), "D"),
    "data normal + D",
  );

  // Padding de dia e mês com um dígito
  _afirmarIgual(
    "05/01/2026 N",
    _formatarNomeAba(new Date(2026, 0, 5), "N"),
    "dia/mês de 1 dígito devem ser zero-padded",
  );

  // Turno vazio deixa espaço sobrando ao final (os chamadores fazem .trim())
  _afirmarIgual(
    "16/05/2026 ",
    _formatarNomeAba(new Date(2026, 4, 16), ""),
    "turno vazio mantém o espaço final (.trim() é do chamador)",
  );
}

// ============================================================
// BATERIA 2 — _obterNomeAbaAnterior
// ============================================================

function _corpoObterNomeAbaAnterior() {
  Logger.log("· _obterNomeAbaAnterior");

  // Diurno → Noturno do dia anterior
  _afirmarIgual(
    "15/05/2026 N",
    _obterNomeAbaAnterior(new Date(2026, 4, 16), "D"),
    "Diurno busca Noturno de ONTEM",
  );

  // Noturno → Diurno do mesmo dia
  _afirmarIgual(
    "16/05/2026 D",
    _obterNomeAbaAnterior(new Date(2026, 4, 16), "N"),
    "Noturno busca Diurno de HOJE",
  );

  // Virada de mês (Diurno do dia 1)
  _afirmarIgual(
    "30/04/2026 N",
    _obterNomeAbaAnterior(new Date(2026, 4, 1), "D"),
    "Diurno do dia 01 → Noturno do último dia do mês anterior",
  );

  // Virada de ano
  _afirmarIgual(
    "31/12/2025 N",
    _obterNomeAbaAnterior(new Date(2026, 0, 1), "D"),
    "Diurno de 01/01 → Noturno de 31/12 do ano anterior",
  );
}

// ============================================================
// BATERIA 3 — _parsearData
// ============================================================

function _corpoParsearData() {
  Logger.log("· _parsearData");

  // Data válida
  _afirmarData(
    new Date(2026, 4, 16),
    _parsearData("16/05/2026"),
    "data válida DD/MM/AAAA",
  );

  // Um dígito em dia/mês é aceito
  _afirmarData(
    new Date(2026, 4, 1),
    _parsearData("1/5/2026"),
    "aceita 1 dígito em dia/mês",
  );

  // Dia que não existe no mês → null (o construtor Date auto-corrige; a função rejeita)
  _afirmarIgual(null, _parsearData("31/02/2026"), "31/02 deve ser rejeitado");
  _afirmarIgual(
    null,
    _parsearData("30/02/2024"),
    "30/02 em ano bissexto rejeitado",
  );
  _afirmarIgual(null, _parsearData("32/01/2026"), "dia 32 rejeitado");
  _afirmarIgual(null, _parsearData("00/01/2026"), "dia 00 rejeitado");

  // Formatos errados
  _afirmarIgual(null, _parsearData("16-05-2026"), "separador errado rejeitado");
  _afirmarIgual(null, _parsearData("16/05/26"), "ano de 2 dígitos rejeitado");
  _afirmarIgual(null, _parsearData("abc"), "texto não-numérico rejeitado");
  _afirmarIgual(null, _parsearData(""), "string vazia rejeitada");
}

// ============================================================
// BATERIA 4 — _compararLeitos
// ============================================================
// Contrato documentado: V → A → ISOL → outros, depois alfabético.
// Testamos pelo SINAL porque a implementação retorna a diferença
// de categoria (ex: -2), não estritamente -1/0/1.

function _corpoCompararLeitos() {
  Logger.log("· _compararLeitos");

  _afirmarSinal(-1, _compararLeitos("V01", "A01"), "V vem antes de A");
  _afirmarSinal(-1, _compararLeitos("A01", "ISOL01"), "A vem antes de ISOL");
  _afirmarSinal(1, _compararLeitos("ISOL01", "V01"), "ISOL vem depois de V");
  _afirmarSinal(
    -1,
    _compararLeitos("V01", "V02"),
    "mesma categoria → alfabético",
  );
  _afirmarSinal(0, _compararLeitos("A05", "A05"), "iguais → 0");
  _afirmarSinal(
    -1,
    _compararLeitos("V02_extra", "A01"),
    "prefixo V vence mesmo com sufixo",
  );
  _afirmarSinal(
    1,
    _compararLeitos("XPTO", "ISOL01"),
    "leito fora do padrão vai pro fim",
  );
}

// ============================================================
// BATERIA 5 — _normalizarColuna
// ============================================================

function _corpoNormalizarColuna() {
  Logger.log("· _normalizarColuna");

  _afirmarIgual(3, _normalizarColuna(3), "número passa direto");
  _afirmarIgual(3, _normalizarColuna("3"), "string numérica vira número");
  _afirmarIgual(3, _normalizarColuna("C"), "letra C → 3");
  _afirmarIgual(27, _normalizarColuna("AA"), "letra AA → 27");
}

// ============================================================
// BATERIA 6 — _letraParaIndice
// ============================================================

function _corpoLetraParaIndice() {
  Logger.log("· _letraParaIndice");

  _afirmarIgual(1, _letraParaIndice("A"), "A → 1");
  _afirmarIgual(12, _letraParaIndice("L"), "L → 12");
  _afirmarIgual(26, _letraParaIndice("Z"), "Z → 26");
  _afirmarIgual(27, _letraParaIndice("AA"), "AA → 27");
  _afirmarIgual(28, _letraParaIndice("AB"), "AB → 28");
  _afirmarIgual(1, _letraParaIndice("a"), "minúscula é normalizada (a → 1)");
}

// ============================================================
// ENTRY POINT — TESTES DE INTEGRAÇÃO (MEXEM NA PLANILHA)
// ============================================================
//
// ⚠️  Estes testes CRIAM abas temporárias e as APAGAM no final.
//     Não tocam em abas de turno nem no modelo. Mesmo assim,
//     rode com a planilha de testes, não na de produção.
//
//     O prefixo das abas temporárias é propositalmente esquisito
//     para nunca colidir com nomes reais (DD/MM/AAAA D|N).
// ============================================================

const _PREFIXO_TEMP = "__TESTE_TMP__";

/** Roda a bateria de integração. */
function executarTestesIntegracao() {
  _resetarResultados();
  Logger.log("═══════ TESTES DE INTEGRAÇÃO — MAPA DO EIXO ═══════");

  _limparAbasTemp(); // limpa lixo de execuções anteriores que tenham falhado

  try {
    _corpoMapearLinhasPorLeito();
    _corpoCopiarPacientesAtivos();
  } finally {
    _limparAbasTemp(); // cleanup garantido mesmo se um teste lançar
  }

  _imprimirResumo("INTEGRAÇÃO");
}

// ── Helpers de fixture ──

/** Apaga todas as abas que começam com o prefixo de teste. */
function _limparAbasTemp() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.getSheets().forEach((aba) => {
    if (aba.getName().indexOf(_PREFIXO_TEMP) === 0) {
      ss.deleteSheet(aba);
    }
  });
}

/** Cria uma aba temporária vazia com nome único. */
function _criarAbaTemp(sufixo) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const nome = `${_PREFIXO_TEMP}${sufixo}_${Date.now()}`;
  return ss.insertSheet(nome);
}

/**
 * Monta uma linha de paciente (array de TOTAL_COLUNAS posições)
 * a partir de um objeto enxuto. Posições não informadas ficam "".
 */
function _linhaPaciente(props) {
  const linha = new Array(CONFIG.TOTAL_COLUNAS).fill("");
  if (props.leito !== undefined) linha[CONFIG.COL_LEITO - 1] = props.leito;
  if (props.paciente !== undefined)
    linha[CONFIG.COL_PACIENTE - 1] = props.paciente;
  if (props.eventos !== undefined)
    linha[CONFIG.COL_EVENTOS - 1] = props.eventos;
  if (props.numAtend !== undefined)
    linha[CONFIG.COL_NUM_ATEND - 1] = props.numAtend;
  if (props.admissao !== undefined)
    linha[CONFIG.COL_ADMISSAO - 1] = props.admissao;
  if (props.desfecho !== undefined)
    linha[CONFIG.COL_DESFECHO - 1] = props.desfecho;
  return linha;
}

// ============================================================
// BATERIA 7 — _mapearLinhasPorLeito
// ============================================================
// Substitui a antiga bateria de _encontrarLinhaDoLeito (removida
// na refatoração de performance). A função agora devolve um mapa
// { leito: linha } construído numa única leitura da coluna.
//
// Contrato exercitado:
//   - cada leito preenchido vira chave → número da linha
//   - leito ausente → undefined (não está no mapa)
//   - leito repetido na própria aba → mantém a PRIMEIRA ocorrência
//   - chaves normalizadas com trim()

function _corpoMapearLinhasPorLeito() {
  Logger.log("· _mapearLinhasPorLeito");

  const aba = _criarAbaTemp("mapa");

  // Leitos a partir da primeira linha de dados (13).
  // Linha 16 repete "V01" de propósito (testa "primeira ocorrência vence").
  // Linha 17 tem espaços em volta (testa normalização por trim).
  aba
    .getRange(CONFIG.PRIMEIRA_LINHA_DADOS, CONFIG.COL_LEITO, 5, 1)
    .setValues([["V01"], ["A02"], ["ISOL01"], ["V01"], [" A05 "]]);

  const mapa = _mapearLinhasPorLeito(aba);

  _afirmarIgual(13, mapa["V01"], "V01 → linha 13");
  _afirmarIgual(14, mapa["A02"], "A02 → linha 14");
  _afirmarIgual(15, mapa["ISOL01"], "ISOL01 → linha 15");
  _afirmarIgual(
    17,
    mapa["A05"],
    "chave é normalizada com trim (' A05 ' → 'A05')",
  );
  _afirmarIgual(
    13,
    mapa["V01"],
    "leito repetido mantém a primeira ocorrência (13, não 16)",
  );
  _afirmarIgual(undefined, mapa["X99"], "leito inexistente → ausente do mapa");
}

// ============================================================
// BATERIA 8 — _copiarPacientesAtivos
// ============================================================
// Cenário coberto:
//   - paciente ativo é copiado para a linha do seu leito
//   - campos pontuais (eventos, nº atend., admissão) são resetados
//   - paciente com ALTA é EXCLUÍDO
//   - segundo paciente no mesmo leito vira extra no fim da tabela,
//     MANTENDO o nome original do leito (sem sufixo) — ver NOTA.

function _corpoCopiarPacientesAtivos() {
  Logger.log("· _copiarPacientesAtivos");

  const origem = _criarAbaTemp("origem");
  const destino = _criarAbaTemp("destino");

  // DESTINO: clone mínimo do modelo — leitos fixos em A13:A15
  destino
    .getRange(CONFIG.PRIMEIRA_LINHA_DADOS, CONFIG.COL_LEITO, 3, 1)
    .setValues([["V01"], ["V02"], ["A01"]]);

  // ORIGEM: 3 pacientes
  const pacientes = [
    _linhaPaciente({
      leito: "V01",
      paciente: "Ana Ativa",
      eventos: "PCR",
      numAtend: 3,
      admissao: "SIM",
      desfecho: "",
    }),
    _linhaPaciente({ leito: "V02", paciente: "Bruno Alta", desfecho: "ALTA" }),
    _linhaPaciente({ leito: "V01", paciente: "Carlos Dup", desfecho: "" }),
  ];
  origem
    .getRange(
      CONFIG.PRIMEIRA_LINHA_DADOS,
      1,
      pacientes.length,
      CONFIG.TOTAL_COLUNAS,
    )
    .setValues(pacientes);

  // EXECUTA
  _copiarPacientesAtivos(destino, origem);

  // ── Asserções ──
  const ler = (linha, col) => destino.getRange(linha, col).getValue();

  // Ana (ativa) copiada para a linha do leito V01 (13), com resets
  _afirmarIgual(
    "Ana Ativa",
    ler(13, CONFIG.COL_PACIENTE),
    "ativo copiado p/ a linha do seu leito",
  );
  _afirmarIgual("", ler(13, CONFIG.COL_EVENTOS), "EVENTOS resetado");
  _afirmarIgual("", ler(13, CONFIG.COL_NUM_ATEND), "Nº ATEND. resetado");
  _afirmarIgual(
    "NÃO",
    ler(13, CONFIG.COL_ADMISSAO),
    "ADMISSÃO resetada p/ NÃO",
  );

  // Bruno (ALTA) NÃO copiado — a linha do V02 (14) segue vazia
  _afirmarIgual("", ler(14, CONFIG.COL_PACIENTE), "paciente com ALTA excluído");

  // Carlos (duplicata de V01) → extra na primeira linha livre após os
  // leitos fixos. Destino tem leitos em 13-15 → extra cai na linha 16.
  _afirmarIgual(
    "Carlos Dup",
    ler(16, CONFIG.COL_PACIENTE),
    "duplicata vira extra (nome do paciente preservado)",
  );
  _afirmarIgual(
    "V01",
    ler(16, CONFIG.COL_LEITO),
    "duplicata mantém o NOME ORIGINAL do leito (sem sufixo) — ver NOTA",
  );
}

// ============================================================
// NOTA — DECISÃO DE DESIGN SOBRE LEITOS DUPLICADOS
// ============================================================
//
// Quando dois pacientes ativos compartilham o mesmo leito (ou um
// leito não consta do modelo), o primeiro ocupa a linha do leito e
// os demais entram como EXTRAS no fim da tabela. A implementação
// atual MANTÉM o nome original do leito nesses extras — não aplica
// sufixo (_duplicado_N / _não_identificado_N). A separação visual
// fica por conta da ordenação do PASSO 4 (V → A → ISOL).
//
// Consequência prática: a aba pode exibir duas linhas com o mesmo
// rótulo de leito (ex: dois "V01") lado a lado. É comportamento
// esperado, não bug — por isso a BATERIA 8 afirma "V01" e não um
// rótulo sufixado.
//
// Trade-off consciente: o sufixo comunicaria "há dois pacientes no
// mesmo leito"; o nome puro deixa esse sinal só na adjacência das
// linhas. Se a desambiguação explícita voltar a ser requisito,
// reintroduzir o sufixo em pacientes.gs (gravando-o em
// dados[CONFIG.COL_LEITO - 1] antes do push) e inverter esta
// asserção para o rótulo sufixado.
// ============================================================
