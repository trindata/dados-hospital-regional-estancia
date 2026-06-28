// ============================================================
// config.gs — CONFIGURAÇÃO DO MAPA DA UTI
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
// Há também o objeto FORMATO_COLUNAS_DADOS no fim do arquivo,
// fora de CONFIG, consumido por util_padronizacao.gs.
// ============================================================

const PRIMEIRA = 14;
const MAX = 100;
const ULTIMA = PRIMEIRA + MAX - 1;
const SUFIXO_ABA_DIARIA = "D"; // Sufixo do nome da aba de turno único (diário)

function colunaParaLetra(coluna) {
  let letra = "";

  while (coluna > 0) {
    let temp = (coluna - 1) % 26;
    letra = String.fromCharCode(temp + 65) + letra;
    coluna = Math.floor((coluna - temp - 1) / 26);
  }

  return letra;
}

const CONFIG = {
  // ============================================================
  // IDENTIFICAÇÃO
  // ============================================================
  MODELO_NOME: "_MODELO_MAPA",

  // ============================================================
  // COORDENADAS GERAIS
  // ============================================================

  RANGE_DATA_TURNO: "B2:B3", // Data e Turno
  RANGE_EQUIPE: "B5:D8", // Fisioterapeuta, Enfermeiros, Médicos
  RANGE_PACIENTES: `A${PRIMEIRA}:P${ULTIMA}`, // Dados dos pacientes

  // ============================================================
  // INDICADORES
  // ============================================================

  // ATENÇÃO, NECESSÁRIO ATUALIZAR SE MODIFICAR COORDENADAS HORIZONTAIS OU VERTICAIS
  INDICADORES: [
    {
      label: "Atendimentos",
      formula: `=SUM(J${PRIMEIRA}:J${ULTIMA})`,
    },
    {
      label: "Admissões",
      formula: `=COUNTIF(L${PRIMEIRA}:L${ULTIMA};"SIM")`,
    },
    {
      label: "Altas",
      formula: `=COUNTIF(M${PRIMEIRA}:M${ULTIMA};"ALTA")`,
    },
    {
      label: "Transferências",
      formula: `=COUNTIF(M${PRIMEIRA}:M${ULTIMA};"TRANSFERÊNCIA")`,
    },
    {
      label: "Óbitos",
      formula: `=COUNTIF(M${PRIMEIRA}:M${ULTIMA};"ÓBITO")`,
    },
    {
      label: "Prescritos",
      formula: `=COUNTIF(K${PRIMEIRA}:K${ULTIMA};"SIM")`,
    },
    {
      label: "Não Prescritos",
      formula: `=COUNTIF(K${PRIMEIRA}:K${ULTIMA};"NÃO")`,
    },
  ],

  // ============================================================
  // COORDENADAS VERTICAIS (linhas)
  // ============================================================
  LINHA_FISIO_1: 5, // Linha da informação de fisioterapeutas
  LINHA_FISIO_2: 6, // Linha da informação de fisioterapeutas
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
  COL_LEITO: 1, // A: Leito (dinâmico)
  COL_FISIOS: 2, // B: Fisioterapeutas
  COL_PACIENTE: 2, // B: Paciente
  COL_DIAGNOSTICO: 3, // C: Diagnóstico Clínico
  COL_VIA_AEREA: 4, // D: Via Aérea
  COL_EVENTOS: 5, // E: Eventos
  COL_META_MOTORA: 6, // F: Meta Motora
  COL_META_RESP: 7, // G: Meta Resp.
  COL_IMS: 8, // H: IMS Prévio \ Atual
  COL_DEFICIT_MOTOR: 9, // I: Déficit Motor
  COL_NUM_ATEND: 10, // J: Nº Atend.
  COL_PRESCRICAO: 11, // K: Prescrição
  COL_ADMISSAO: 12, // L: Admissão
  COL_DESFECHO: 13, // M: Desfecho
  COL_AVALIACAO: 14, // N: Avaliação Diária

  TOTAL_COLUNAS: 14,

  // ============================================================
  // HEADERS (LINHA 13)=====================================================

  HEADERS: [
    [
      "LEITO",
      "PACIENTE",
      "DIAGNÓSTICO CLINICO",
      "VIA AÉREA",
      "EVENTOS",
      "META MOTORA",
      "META RESP.",
      "IMS PRÉVIO - ATUAL",
      "DEFICIT MOTOR",
      "Nº ATEND.",
      "PRESCRIÇÃO",
      "ADMISSÃO",
      "DESFECHO",
      "AVALIAÇÃO DIÁRIA",
    ],
  ],

  // ============================================================
  // LEITOS INICIAIS
  // ============================================================
  LEITOS_INICIAIS: [
    "ENFERMARIA A",
    "A 01",
    "A 02",
    "A 03",
    "A 04",
    "A 05",
    "ENFERMARIA B",
    "B 01",
    "B 02",
    "B 03",
    "B 04",
    "B 05",
    "ENFERMARIA C",
    "C 01",
    "C 02",
    "C 03",
    "C 04",
    "C 05",
    "ENFERMARIA D",
    "D 01",
    "D 02",
    "D 03",
    "D 04",
    "D 05",
    "ENFERMARIA E",
    "E 01",
    "E 02",
    "E 03",
    "E 04",
    "E 05",
    "ENFERMARIA F",
    "F 01",
    "F 02",
    "F 03",
    "F 04",
    "F 05",
    "ENFERMARIA G",
    "G 01",
    "G 02",
    "G 03",
    "G 04",
    "G 05",
    "ISOLAMENTOS",
    "ISOL01",
  ],

  // ============================================================
  // VALORES DE VALIDAÇÃO (DROPDOWNS)
  // ============================================================

  VALIDACOES: {
    LEITO: [
      "A 01",
      "A 02",
      "A 03",
      "A 04",
      "A 05",
      "B 01",
      "B 02",
      "B 03",
      "B 04",
      "B 05",
      "C 01",
      "C 02",
      "C 03",
      "C 04",
      "C 05",
      "D 01",
      "D 02",
      "D 03",
      "D 04",
      "D 05",
      "E 01",
      "E 02",
      "E 03",
      "E 04",
      "E 05",
      "F 01",
      "F 02",
      "F 03",
      "F 04",
      "F 05",
      "G 01",
      "G 02",
      "G 03",
      "G 04",
      "G 05",
      "ISOL01",
      "ENFERMARIA A",
      "ENFERMARIA B",
      "ENFERMARIA C",
      "ENFERMARIA D",
      "ENFERMARIA E",
      "ENFERMARIA F",
      "ENFERMARIA G",
      "ISOLAMENTOS",
    ],

    VIA_AEREA: ["TQT+O2", "VE+O2", "VE/AA", "TQT/AA"],

    EVENTOS: [
      "INSTABILIDADE HEMOD",
      "ANEMIA GRAVE",
      "PLAQUETOPENIA",
      "TROCATOT",
      "RNC",
      "PCR",
      "ROLHA",
      "FEBRE",
      "REINFECÇÃO",
      "QUEDA",
      "PNEUMOTÓRAX",
    ],

    META_MOTORA: [
      "MANUTENÇÃO IMS",
      "EVOLUIR IMS",
      "GANHO DE FORÇA",
      "GANHO DE MOBILIDADE",
      "MELHORAR EQUILÍBRIO",
      "MOBILIZAÇÃO",
      "CONFORTO",
    ],

    META_RESP: [
      "PATÊNCIA VA",
      "OTIMIZAR TROCAS",
      "AUMENTO DE VOLUMES E CAPACIDADES",
      "REDUZIR WOB",
      "DESMAME O2",
      "PREVENÇÃO PAV",
    ],

    DEFICIT_MOTOR: ["SIM", "NÃO"],

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
    LEITO: 150,
    PACIENTE: 150,
    DIAGNOSTICO: 200,
    VIA_AEREA: 120,
    EVENTOS: 150,
    META_MOTORA: 140,
    META_RESP: 150,
    IMS: 100,
    DEFICIT_MOTOR: 100,
    NUM_ATEND: 80,
    PRESCRICAO: 95,
    ADMISSAO: 80,
    DESFECHO: 140,
    AVALIACAO: 400, // Coluna mais larga para avaliação clínica detalhada
  },

  // ============================================================
  // REGRAS DE NEGÓCIO
  // ============================================================

  // Desfechos que excluem paciente do próximo turno
  DESFECHOS_EXCLUIR: ["ALTA", "ÓBITO", "TRANSFERÊNCIA"],

  LINHAS_DIVISORAS: [
    "ENFERMARIA A",
    "ENFERMARIA B",
    "ENFERMARIA C",
    "ENFERMARIA D",
    "ENFERMARIA E",
    "ENFERMARIA F",
    "ENFERMARIA G",
    "ENFERMARIA H",
    "ISOLAMENTOS",
  ],
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
// Eventos e atendimentos são sempre zerados; admissão
// recebe valor padrão "NÃO".
// ============================================================

const CAMPOS_RESETAR = {
  [CONFIG.COL_EVENTOS]: "", // EVENTOS - Limpar eventos do turno anterior
  [CONFIG.COL_NUM_ATEND]: "", // Nº ATEND. - Resetar contador de atendimentos
  [CONFIG.COL_ADMISSAO]: "NÃO", // ADMISSÃO - Limpar admissão
};

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

  [CONFIG.COL_VIA_AEREA]: {
    horizontalAlignment: "center",
    width: CONFIG.LARGURAS.VIA_AEREA,
  },

  [CONFIG.COL_IMS]: {
    horizontalAlignment: "center",
    numberFormat: "@",
    width: CONFIG.LARGURAS.IMS,
  },

  [CONFIG.COL_PRESCRICAO]: {
    horizontalAlignment: "center",
    width: CONFIG.LARGURAS.PRESCRICAO,
  },

  [CONFIG.COL_ADMISSAO]: {
    horizontalAlignment: "center",
    width: CONFIG.LARGURAS.ADMISSAO,
  },

  [CONFIG.COL_DESFECHO]: {
    horizontalAlignment: "center",
    width: CONFIG.LARGURAS.DESFECHO,
  },

  [CONFIG.COL_DEFICIT_MOTOR]: {
    horizontalAlignment: "center",
    width: CONFIG.LARGURAS.DEFICIT_MOTOR,
  },

  [CONFIG.COL_NUM_ATEND]: {
    horizontalAlignment: "center",
    width: CONFIG.LARGURAS.NUM_ATEND,
  },

  [CONFIG.COL_DIAGNOSTICO]: {
    wrap: true,
    verticalAlignment: "middle",
    width: CONFIG.LARGURAS.DIAGNOSTICO,
  },

  [CONFIG.COL_PACIENTE]: {
    wrap: true,
    verticalAlignment: "middle",
    width: CONFIG.LARGURAS.PACIENTE,
  },

  [CONFIG.COL_META_MOTORA]: {
    wrap: true,
    width: CONFIG.LARGURAS.META_MOTORA,
  },

  [CONFIG.COL_META_RESP]: {
    wrap: true,
    width: CONFIG.LARGURAS.META_RESP,
  },

  [CONFIG.COL_EVENTOS]: {
    wrap: true,
    width: CONFIG.LARGURAS.EVENTOS,
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
