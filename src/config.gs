// ============================================================
// config.gs — CONFIGURAÇÃO DO MAPA DO EIXO
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

const PRIMEIRA = 13;
const MAX = 100;
const ULTIMA = PRIMEIRA + MAX - 1;

const CONFIG = {
  // ============================================================
  // IDENTIFICAÇÃO
  // ============================================================
  MODELO_NOME: "_MODELO_MAPA_EIXO",

  // ============================================================
  // COORDENADAS GERAIS
  // ============================================================

  RANGE_DATA_TURNO: "B2:B3", // Data e Turno
  RANGE_EQUIPE: "B5:D7", // Fisioterapeuta, Enfermeiros, Médicos
  RANGE_PACIENTES: `A${PRIMEIRA}:P${ULTIMA}`, // Dados dos pacientes

  // ============================================================
  // INDICADORES
  // ============================================================

  // ATENÇÃO, NECESSÁRIO ATUALIZAR SE MODIFICAR COORDENADAS HORIZONTAIS OU VERTICAIS
  INDICADORES: [
    { label: "Atendimentos", formula: `=SUM(L${PRIMEIRA}:L${ULTIMA})` },
    { label: "Admissões", formula: `=COUNTIF(N${PRIMEIRA}:N${ULTIMA};"SIM")` },
    { label: "Altas", formula: `=COUNTIF(O${PRIMEIRA}:O${ULTIMA};"ALTA")` },
    {
      label: "Transferências",
      formula: `=COUNTIF(O${PRIMEIRA}:O${ULTIMA};"TRANSFERÊNCIA")`,
    },
    { label: "Óbitos", formula: `=COUNTIF(O${PRIMEIRA}:O${ULTIMA};"ÓBITO")` },
  ],

  // ============================================================
  // COORDENADAS VERTICAIS (linhas)
  // ============================================================
  LINHA_FISIOS: 5, // Linha da informação de fisioterapeutas
  LINHA_INFO_INICIO: 1, // Início da seção de informações (hospital, data, equipe)
  LINHA_INFO_FIM: 7, // Fim da seção de informações
  LINHA_INDICADORES_INICIO: 9, // Linha dos títulos dos indicadores
  LINHA_INDICADORES_DADOS: 10, // Linha das fórmulas dos indicadores
  LINHA_CABECALHO: 12, // Linha do cabeçalho da tabela de pacientes
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
  COL_VNI: 6, // F: VNI
  COL_DESMAME_VM: 7, // G: Desmame VM
  COL_META_MOTORA: 8, // H: Meta Motora
  COL_META_RESP: 9, // I: Meta Resp.
  COL_IMS: 10, // J: IMS Prévio \ Atual
  COL_DEFICIT_MOTOR: 11, // K: Déficit Motor
  COL_NUM_ATEND: 12, // L: Nº Atend.
  COL_PRESCRICAO: 13, // M: Prescrição
  COL_ADMISSAO: 14, // N: Admissão
  COL_DESFECHO: 15, // O: Desfecho
  COL_AVALIACAO: 16, // P: Avaliação Diária

  TOTAL_COLUNAS: 16,

  // ============================================================
  // HEADERS (LINHA 12)
  // ============================================================

  HEADERS: [
    [
      "LEITO",
      "PACIENTE",
      "DIAGNÓSTICO CLINICO",
      "VIA AÉREA",
      "EVENTOS",
      "VNI",
      "DESMAME VM",
      "META MOTORA",
      "META RESP.",
      "IMS PRÉVIO \\ ATUAL",
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
    "V01", // Vaga 1
    "V02", // Vaga 2
    "V03", // Vaga 3
    "A01", // Box A01
    "A02", // Box A02
    "A03", // Box A03
    "A04", // Box A04
    "A05", // Box A05
    "A06", // Box A06
    "A07", // Box A07
    "A08", // Box A08
    "ISOL01", // Isolamento 1
    "ISOL02", // Isolamento 2
  ],

  // ============================================================
  // VALORES DE VALIDAÇÃO (DROPDOWNS)
  // ============================================================

  VALIDACOES: {
    LEITO: [
      "V01",
      "V02",
      "V03",
      "V01_extra",
      "V02_extra",
      "V03_extra",
      "V04_extra",
      "V05_extra",
      "V06_extra",
      "V07_extra",
      "V08_extra",
      "V09_extra",
      "V10_extra",
      "A01",
      "A02",
      "A03",
      "A04",
      "A05",
      "A06",
      "A07",
      "A08",
      "A01_extra",
      "A02_extra",
      "A03_extra",
      "A04_extra",
      "A05_extra",
      "A06_extra",
      "A07_extra",
      "A08_extra",
      "A09_extra",
      "A10_extra",
      "ISOL01",
      "ISOL02",
      "ISOL01_extra",
      "ISOL02_extra",
      "ISOL03_extra",
      "ISOL04_extra",
      "ISOL05_extra",
    ],

    VIA_AEREA: ["TOT\\VM", "TQT\\VM", "TQT+O2", "VE+O2", "VE\\AA"],

    EVENTOS: [
      "IOT",
      "EOT ACIDENTAL",
      "RE IOT",
      "INSTABILIDADE HEMOD",
      "ANEMIA GRAVE",
      "PLAQUETOPENIA",
      "TROCA TOT",
      "TROCATOT",
      "PRONA",
      "SUPINO",
      "EOT TOT",
      "DESCONEXÃO",
      "RNC",
      "PCR",
      "ROLHA",
      "FEBRE",
      "REINFECÇÃO",
      "QUEDA",
      "PNEUMOTÓRAX",
    ],

    VNI: ["NÃO", "TERAPEUTICA", "PROFILÁTICA"],

    DESMAME_VM: ["SIMPLES", "PROLONGADO", "SEM CONDIÇÕES"],

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
      "VM PROTETORA",
      "OTIMIZAR TROCAS",
      "AUMENTO DE VOLUMES E CAPACIDADES",
      "REDUZIR WOB",
      "DESMAME O2",
      "DESMAME VM",
      "VM ADEQUADA",
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
    VIA_AEREA: 100,
    EVENTOS: 150,
    VNI: 100,
    DESMAME_VM: 120,
    META_MOTORA: 140,
    META_RESP: 150,
    IMS: 100,
    DEFICIT_MOTOR: 100,
    NUM_ATEND: 80,
    PRESCRICAO: 95,
    ADMISSAO: 80,
    DESFECHO: 140,
    AVALIACAO: 300, // Coluna mais larga para avaliação clínica detalhada
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
  // Centralizadas
  [CONFIG.COL_LEITO]: {
    horizontalAlignment: "center",
    width: CONFIG.LARGURAS.LEITO,
  },
  [CONFIG.COL_IMS]: {
    horizontalAlignment: "center",
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
  [CONFIG.COL_VNI]: {
    horizontalAlignment: "center",
    width: CONFIG.LARGURAS.VNI,
  },
  [CONFIG.COL_VIA_AEREA]: {
    horizontalAlignment: "center",
    width: CONFIG.LARGURAS.VIA_AEREA,
  },

  // Wrap (texto longo)
  [CONFIG.COL_DIAGNOSTICO]: {
    wrap: true,
    verticalAlignment: "middle",
    width: CONFIG.LARGURAS.DIAGNOSTICO,
  },
  [CONFIG.COL_AVALIACAO]: {
    wrap: true,
    verticalAlignment: "middle",
    width: CONFIG.LARGURAS.AVALIACAO,
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
};
