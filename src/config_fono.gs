// ============================================================
// config.gs — CONFIGURAÇÃO DO MAPA DA FONOAUDIOLOGIA
// ============================================================
// Sistema de Gestão do Mapa do Eixo da Fisioterapia UTI
// Versão: 1.0
// Data: 2026-05-16
// ============================================================
//
// Ponto único de configuração do sistema. Todo o resto do
// código lê daqui — coordenadas, cores, dropdowns, larguras
// e regras de negócio ficam centralizadas.
//
// SEÇÕES:
//   1. IDENTIFICAÇÃO       — nome da aba modelo
//   2. COORDENADAS GERAIS  — ranges editáveis pelo usuário
//   3. INDICADORES         — fórmulas da linha de indicadores
//   4. COORDENADAS VERTICAIS — linhas das seções da aba
//   5. COORDENADAS HORIZONTAIS — índices das colunas (1-based)
//   6. HEADERS             — labels da linha 12
//   7. LEITOS_INICIAIS     — leitos pré-preenchidos no modelo
//   8. VALIDACOES          — listas dos dropdowns por coluna
//   9. CORES               — paleta visual padrão
//  10. LARGURAS            — larguras de coluna em pixels
//  11. REGRAS DE NEGÓCIO   — desfechos que removem e campos resetados
//
// Fora de CONFIG, no fim do arquivo, ficam três objetos que o
// núcleo consome diretamente:
//   - CAMPOS_RESETAR      — pacientes.gs
//   - VALIDACOES_COLUNAS  — modelo_geral.gs (_aplicarValidacoes)
//   - FORMATO_COLUNAS_DADOS — util_padronizacao.gs
// mais a função _validacoesCelulas(), também lida por
// _aplicarValidacoes.
// ============================================================

const PRIMEIRA = 14;
const MAX = 100;
const ULTIMA = PRIMEIRA + MAX - 1;
const SUFIXO_ABA_DIARIA = "D"; // Sufixo do nome da aba de turno único (diário)

const CONFIG = {
  // ============================================================
  // IDENTIFICAÇÃO
  // ============================================================
  MODELO_NOME: "_MODELO_MAPA",

  // ============================================================
  // COORDENADAS GERAIS
  // ============================================================

  RANGE_DATA_TURNO: "B2:B3", // Data e Turno
  RANGE_EQUIPE: "B5:D8", // Profissional, Enfermeiros, Médicos
  RANGE_PROFISSIONAIS: "B5:B6", // Fonte do dropdown da coluna PROFISSIONAL
  RANGE_PACIENTES: `A${PRIMEIRA}:M${ULTIMA}`, // Dados dos pacientes

  // ============================================================
  // INDICADORES
  // ============================================================

  // ATENÇÃO, NECESSÁRIO ATUALIZAR SE MODIFICAR COORDENADAS HORIZONTAIS OU VERTICAIS
  INDICADORES: [
    { label: "Atendimentos", formula: `=SUM(G${PRIMEIRA}:G${ULTIMA})` },
    { label: "Admissões", formula: `=COUNTIF(I${PRIMEIRA}:I${ULTIMA};"SIM")` },
    { label: "Altas", formula: `=COUNTIF(J${PRIMEIRA}:J${ULTIMA};"ALTA")` },
    {
      label: "Transferências",
      formula: `=COUNTIF(J${PRIMEIRA}:J${ULTIMA};"TRANSFERÊNCIA")`,
    },
    { label: "Óbitos", formula: `=COUNTIF(J${PRIMEIRA}:J${ULTIMA};"ÓBITO")` },
    { label: "Prescritos", formula: `=COUNTIF(K${PRIMEIRA}:K${ULTIMA};"SIM")` },
    {
      label: "Não Prescritos",
      formula: `=COUNTIF(K${PRIMEIRA}:K${ULTIMA};"NÃO")`,
    },
  ],

  // ============================================================
  // COORDENADAS VERTICAIS (linhas)
  // ============================================================
  LINHA_PROFISSIONAL_1: 5, // Linha da informação de profissional
  LINHA_PROFISSIONAL_2: 6, // Linha da informação de profissional
  LINHA_INFO_INICIO: 1, // Início da seção de informações (hospital, data, equipe)
  LINHA_INFO_FIM: 8, // Fim da seção de informações
  LINHA_INDICADORES_INICIO: 10, // Linha dos títulos dos indicadores
  LINHA_INDICADORES_DADOS: 11, // Linha das fórmulas dos indicadores
  LINHA_CABECALHO: 13, // Linha do cabeçalho da tabela de pacientes
  PRIMEIRA_LINHA_DADOS: PRIMEIRA, // Primeira linha de dados de pacientes
  MAX_LINHAS_DADOS: MAX, // Total de linhas disponíveis para dados
  ULTIMA_LINHA_DADOS: ULTIMA, // Última linha de dados (PRIMEIRA + MAX - 1)

  // ============================================================
  // COORDENADAS HORIZONTAIS (colunas)
  // ============================================================
  COL_LEITO: 1, // A: Leito
  COL_PROFISSIONAL: 2, // B: campo da SEÇÃO DE INFORMAÇÕES (B5/B6)
  COL_PACIENTE: 2, // B: Paciente
  COL_DIAGNOSTICO: 3, // C: Diagnóstico Clínico
  COL_VIA_AEREA: 4, // D: Via Aérea
  COL_VIA_ALIMENTACAO: 5, // E: Via de Alimentação
  COL_FOIS: 6, // F: FOIS
  COL_NUM_ATEND: 7, // G: Nº Atend.
  COL_PRIORIDADE: 8, // H: Prioridade
  COL_ADMISSAO: 9, // I: Admissão
  COL_DESFECHO: 10, // J: Desfecho
  COL_PRESCRICAO: 11, // K: Prescrição
  COL_FONO: 12, // L: Profissional responsável (coluna de DADOS)
  COL_AVALIACAO: 13, // M: Avaliação Diária

  TOTAL_COLUNAS: 13,

  // ============================================================
  // HEADERS (LINHA 13)
  // ============================================================

  HEADERS: [
    [
      "LEITO",
      "PACIENTE",
      "DIAGNÓSTICO CLINICO",
      "VIA AÉREA",
      "VIA DE ALIMENTAÇÃO",
      "FOIS",
      "Nº ATEND.",
      "PRIORIDADE",
      "ADMISSÃO",
      "DESFECHO",
      "PRESCRIÇÃO",
      "PROFISSIONAL",
      "AVALIAÇÃO DIÁRIA",
    ],
  ],

  // ============================================================
  // LEITOS INICIAIS
  // ============================================================
  LEITOS_INICIAIS: [
    "Box 01", // Box 01
    "Box 02", // Box 02
    "Box 03", // Box 03
    "Box 04", // Box 04
    "Box 05", // Box 05
    "Box 06", // Box 06
    "Box 07", // Box 07
    "Box 08", // Box 08
    "Box 09", // Box 09
    "Box 10", // Box 10
    "ISOL01", // Isolamento 1
    "ISOL02", // Isolamento 2
  ],

  // ============================================================
  // VALORES DE VALIDAÇÃO (DROPDOWNS)
  // ============================================================

  VALIDACOES: {
    VIA_AEREA: [
      "VE/AA",
      "VE + O2",
      "MH",
      "TQT PLÁSTICA CUFF INSUFLADO",
      "TQT PLÁSTICA CUFF DESINSUFLADO",
      "TQT METÁLICA",
      "IOT",
      "OUTRA",
    ],

    // Ordenada da consistência mais restritiva para a mais livre.
    VIA_ALIMENTACAO: [
      "VO LÍQUIDA",
      "LIQUIDIFICADA + LÍQUIDOS",
      "LIQUIDIFICADA + LÍQUIDOS NÉCTAR",
      "LIQUIDIFICADA + LÍQUIDOS MEL",
      "PASTOSA P/ DISFÁGICO + LÍQUIDOS",
      "PASTOSA P/ DISFÁGICO + LÍQUIDOS NÉCTAR",
      "PASTOSA P/ DISFÁGICO + LÍQUIDOS MEL",
      "PASTOSA + LÍQUIDOS",
      "PASTOSA + LÍQUIDOS NÉCTAR",
      "PASTOSA + LÍQUIDOS MEL",
      "BRANDA COM PROTEÍNA TRITURADA + LÍQUIDOS",
      "BRANDA + LÍQUIDOS",
      "VO LIVRE",
    ],

    FOIS: ["1", "2", "3", "4", "5", "6", "7"],

    PRIORIDADE: ["ROTINA", "PRIORITÁRIO", "GRAVE"],

    PRESCRICAO: ["SIM", "NÃO"],

    ADMISSAO: ["SIM", "NÃO"],

    DESFECHO: ["ALTA", "TRANSFERÊNCIA", "ÓBITO"],
  },

  // ============================================================
  // CORES DO TEMA VISUAL (Padrão Ouro)
  // ============================================================

  CORES: {
    // Cabeçalhos
    CABECALHO_FUNDO: "#1F4E79", // Azul escuro
    CABECALHO_TEXTO: "#FFFFFF", // Branco

    // Linhas zebradas (dados)
    ZEBRA_CLARO: "#FFFFFF", // Branco
    ZEBRA_ESCURO: "#F2F2F2", // Cinza claro

    // Indicadores
    INDICADOR_FUNDO: "#D5E8F0", // Azul claro
    INDICADOR_TEXTO: "#000000", // Preto

    // Informações
    INFO_TITULO: "#1F4E79", // Azul escuro
    INFO_FUNDO: "#E7E6E6", // Cinza muito claro
  },

  // ============================================================
  // LARGURAS DAS COLUNAS (em pixels)
  // ============================================================

  LARGURAS: {
    LEITO: 90,
    PACIENTE: 190,
    DIAGNOSTICO: 210,
    VIA_AEREA: 135,
    VIA_ALIMENTACAO: 180,
    FOIS: 55,
    NUM_ATEND: 75,
    PRIORIDADE: 100,
    ADMISSAO: 80,
    DESFECHO: 125,
    PRESCRICAO: 95,
    PROFISSIONAL: 205,
    AVALIACAO: 430, // Coluna mais larga para avaliação clínica detalhada
  },

  // ============================================================
  // REGRAS DE NEGÓCIO
  // ============================================================

  // Desfechos que excluem paciente do próximo turno
  DESFECHOS_EXCLUIR: ["ALTA", "ÓBITO", "TRANSFERÊNCIA"],
};

// ============================================================
// CAMPOS RESETADOS ENTRE TURNOS
// ============================================================
//
// Mapa coluna → valor de reset
// Aplicado sobre as linhas de dados após processamento
// de cada turno.
//
// Propriedades suportadas:
//   - Chave: referência da coluna via CONFIG (variável)
//   - Valor: conteúdo limpo (string vazia "" ou valor padrão)
//
// Colunas omitidas não são alteradas entre turnos.
// Atendimentos são sempre zerados; admissão recebe valor
// padrão "NÃO". Esta área não tem coluna de eventos.
// ============================================================

const CAMPOS_RESETAR = {
  [CONFIG.COL_NUM_ATEND]: "", // Nº ATEND. - Resetar contador de atendimentos
  [CONFIG.COL_ADMISSAO]: "NÃO", // ADMISSÃO - Limpar admissão
};

// ============================================================
// VALIDAÇÕES POR COLUNA (FAIXA DE DADOS)
// ============================================================
//
// Mapa coluna → descritor de validação, consumido por
// _aplicarValidacoes() em modelo_geral.gs. Aplicado sobre toda a
// área de dados (linhas PRIMEIRA a ULTIMA).
//
// Propriedades suportadas (use lista OU range, nunca os dois):
//   - lista: array de valores fixos do dropdown
//   - range: notação A1 da PRÓPRIA aba — dropdown vivo, que espelha
//     o conteúdo atual das células (ex.: os profissionais de plantão
//     digitados em B5/B6). Como cada turno é um clone do modelo, a
//     referência acompanha a cópia e cada aba lê os próprios valores.
//   - permitirInvalido: true libera digitação fora da lista
//     (default false)
//
// Colunas omitidas ficam sem validação. É assim que a mesma
// _aplicarValidacoes serve áreas com conjuntos de colunas
// diferentes — sem nenhum `if` no núcleo.
// ============================================================

const VALIDACOES_COLUNAS = {
  [CONFIG.COL_VIA_AEREA]: { lista: CONFIG.VALIDACOES.VIA_AEREA },
  [CONFIG.COL_VIA_ALIMENTACAO]: { lista: CONFIG.VALIDACOES.VIA_ALIMENTACAO },
  [CONFIG.COL_FOIS]: { lista: CONFIG.VALIDACOES.FOIS },
  [CONFIG.COL_PRIORIDADE]: { lista: CONFIG.VALIDACOES.PRIORIDADE },
  [CONFIG.COL_PRESCRICAO]: { lista: CONFIG.VALIDACOES.PRESCRICAO },
  [CONFIG.COL_ADMISSAO]: { lista: CONFIG.VALIDACOES.ADMISSAO },
  [CONFIG.COL_DESFECHO]: { lista: CONFIG.VALIDACOES.DESFECHO },

  // Dropdown vivo: alimentado pelos profissionais escalados no turno
  // (B5 e B6 da própria aba). permitirInvalido fica true porque a fonte
  // muda a cada turno e o profissional do turno anterior é carregado
  // junto com o paciente — sem isso, a linha herdada nasceria em erro.
  [CONFIG.COL_FONO]: {
    range: CONFIG.RANGE_PROFISSIONAIS,
    permitirInvalido: true,
  },
};

// ============================================================
// VALIDAÇÕES DE CÉLULAS AVULSAS (SEÇÃO DE INFORMAÇÕES)
// ============================================================
//
// Células únicas fora da faixa de dados — hoje, os campos de
// profissional (B5 e B6).
//
// É FUNÇÃO, e não const, de propósito: referencia FISIOTERAPEUTAS,
// declarado em outro arquivo. Uma const de topo dependeria da ordem
// de avaliação dos arquivos no projeto Apps Script (temporal dead
// zone); a função só é avaliada quando chamada.
//
// @returns {Array<{linha: number, coluna: number, lista: string[]}>}
// ============================================================

function _validacoesCelulas() {
  return [
    {
      linha: CONFIG.LINHA_PROFISSIONAL_1,
      coluna: CONFIG.COL_PROFISSIONAL,
      lista: FISIOTERAPEUTAS,
    },
    {
      linha: CONFIG.LINHA_PROFISSIONAL_2,
      coluna: CONFIG.COL_PROFISSIONAL,
      lista: FISIOTERAPEUTAS,
    },
  ];
}

// ============================================================
// FORMATO PADRÃO DAS COLUNAS DE DADOS
// ============================================================
//
// Mapa coluna → descritor de formatação, consumido por
// padronizarColunasDados() em util_padronizacao.gs. Aplicado
// sobre toda a área de dados (linhas PRIMEIRA a ULTIMA).
//
// Propriedades suportadas:
//   - horizontalAlignment: "left" | "center" | "right"
//   - verticalAlignment: "top" | "middle" | "bottom"
//   - wrap: boolean
//   - width: número em pixels (aplicado via setColumnWidth)
//
// Colunas omitidas mantêm a formatação default da aba-modelo.
// ============================================================

const FORMATO_COLUNAS_DADOS = {
  [CONFIG.COL_LEITO]: {
    horizontalAlignment: "center",
    width: CONFIG.LARGURAS.LEITO,
  },

  [CONFIG.COL_PACIENTE]: {
    wrap: true,
    verticalAlignment: "middle",
    width: CONFIG.LARGURAS.PACIENTE,
  },

  [CONFIG.COL_DIAGNOSTICO]: {
    wrap: true,
    verticalAlignment: "middle",
    width: CONFIG.LARGURAS.DIAGNOSTICO,
  },

  [CONFIG.COL_VIA_AEREA]: {
    horizontalAlignment: "center",
    wrap: true,
    width: CONFIG.LARGURAS.VIA_AEREA,
  },

  [CONFIG.COL_VIA_ALIMENTACAO]: {
    horizontalAlignment: "center",
    wrap: true,
    width: CONFIG.LARGURAS.VIA_ALIMENTACAO,
  },

  [CONFIG.COL_FOIS]: {
    horizontalAlignment: "center",
    numberFormat: "@", // Forçar texto: a lista FOIS é de strings ("1".."7")
    width: CONFIG.LARGURAS.FOIS,
  },

  [CONFIG.COL_NUM_ATEND]: {
    horizontalAlignment: "center",
    width: CONFIG.LARGURAS.NUM_ATEND,
  },

  [CONFIG.COL_PRIORIDADE]: {
    horizontalAlignment: "center",
    width: CONFIG.LARGURAS.PRIORIDADE,
  },

  [CONFIG.COL_ADMISSAO]: {
    horizontalAlignment: "center",
    width: CONFIG.LARGURAS.ADMISSAO,
  },

  [CONFIG.COL_DESFECHO]: {
    horizontalAlignment: "center",
    width: CONFIG.LARGURAS.DESFECHO,
  },

  [CONFIG.COL_PRESCRICAO]: {
    horizontalAlignment: "center",
    width: CONFIG.LARGURAS.PRESCRICAO,
  },

  [CONFIG.COL_FONO]: {
    wrap: true,
    width: CONFIG.LARGURAS.PROFISSIONAL,
  },

  [CONFIG.COL_AVALIACAO]: {
    wrap: true,
    verticalAlignment: "middle",
    width: CONFIG.LARGURAS.AVALIACAO,
  },
};

const FORMATO_LINHA_DIVISORA = {
  background: "#FFFF00",
  bold: true,
  horizontalAlignment: "center",
  verticalAlignment: "middle",
  fontColor: "#000000",
};
