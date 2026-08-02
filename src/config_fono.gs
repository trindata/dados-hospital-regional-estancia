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
  RANGE_PACIENTES: `A${PRIMEIRA}:L${ULTIMA}`, // Dados dos pacientes

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
  COL_LEITO: 1, // A
  COL_PROFISSIONAL: 2, // B
  COL_PACIENTE: 2, // B
  COL_DIAGNOSTICO: 3, // C
  COL_VIA_AEREA: 4, // D
  COL_VIA_DE_ALIMENTACAO: 5, // E
  COL_FOIS: 6, // F
  COL_NUM_ATEND: 7, // G
  COL_PRIORIDADE: 8, // H
  COL_ADMISSAO: 9, // I
  COL_DESFECHO: 10, // J
  COL_PRESCRICAO: 11, // K
  COL_FONO: 12, // L
  COL_AVALIACAO: 13 // M

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
        "OUTRA"
      ],
      VIA_ALIMENTACAO: [
        "VAA EXCLUSIVA", 
        "VO LIVRE", 
        "VO BRANDA", 
        "VO PASTOSA",
        "VO PASTOSA PARA DISFÁGICO", 
        "VO PASTOSA LIQUIDIFICADA",
        "VO LÍQUIDOS FINOS", 
        "VO LÍQUIDOS NÉCTAR", 
        "VO LÍQUIDOS MEL",
        "VO + VAA", 
        "ZERO ATÉ AVALIAÇÃO DA FONO"
      ],
      FOIS: ["1", "2", "3", "4", "5", "6", "7"],
      PRIORIDADE: ["ROTINA", "PRIORITÁRIO", "GRAVE"],
      ADMISSAO: ["SIM", "NÃO"],
      DESFECHO: ["ALTA", "TRANSFERÊNCIA", "ÓBITO"]
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
    PROFISSIONAL: 205, 
    AVALIACAO: 430
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
  [CONFIG.COL_LEITO]: { horizontalAlignment: "center", width: CONFIG.LARGURAS.LEITO },
  [CONFIG.COL_PACIENTE]: { wrap: true, verticalAlignment: "middle", width: CONFIG.LARGURAS.PACIENTE },
  [CONFIG.COL_DIAGNOSTICO]: { wrap: true, verticalAlignment: "middle", width: CONFIG.LARGURAS.DIAGNOSTICO },
  [CONFIG.COL_VIA_AEREA]: { horizontalAlignment: "center", wrap: true, width: CONFIG.LARGURAS.VIA_AEREA },
  [CONFIG.COL_VIA_ALIMENTACAO]: { horizontalAlignment: "center", wrap: true, width: CONFIG.LARGURAS.VIA_ALIMENTACAO },
  [CONFIG.COL_FOIS]: { horizontalAlignment: "center", width: CONFIG.LARGURAS.FOIS },
  [CONFIG.COL_NUM_ATEND]: { horizontalAlignment: "center", width: CONFIG.LARGURAS.NUM_ATEND },
  [CONFIG.COL_PRIORIDADE]: { horizontalAlignment: "center", width: CONFIG.LARGURAS.PRIORIDADE },
  [CONFIG.COL_ADMISSAO]: { horizontalAlignment: "center", width: CONFIG.LARGURAS.ADMISSAO },
  [CONFIG.COL_DESFECHO]: { horizontalAlignment: "center", width: CONFIG.LARGURAS.DESFECHO },
  [CONFIG.COL_PROFISSIONAL]: { wrap: true, width: CONFIG.LARGURAS.PROFISSIONAL },
  [CONFIG.COL_AVALIACAO]: { wrap: true, verticalAlignment: "middle", width: CONFIG.LARGURAS.AVALIACAO }
}

const FORMATO_LINHA_DIVISORA = {
  background: "#FFFF00",
  bold: true,
  horizontalAlignment: "center",
  verticalAlignment: "middle",
  fontColor: "#000000",
};