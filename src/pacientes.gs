// ============================================================
// pacientes.gs — GESTÃO DE PACIENTES ENTRE TURNOS
// ============================================================
// Sistema de Gestão do Mapa do Eixo da Fisioterapia UTI
// Versão: 2.0 - Cópia baseada em LEITO
// Data: 2026-05-21
// ============================================================

/**
 * Copia pacientes ativos da aba anterior para a nova aba
 *
 * NOVA LÓGICA (v2.0):
 * - Busca pacientes por LEITO (não cópia cega de linhas)
 * - Copia para linha correspondente do leito no modelo
 * - Detecta leitos duplicados (mesmo leito, múltiplos pacientes)
 * - Mantém sempre o nome original do leito (não renomeia duplicatas)
 * - Duplicatas e leitos fora do modelo entram como extras no fim
 * - Ordena leitos extras: V → A → ISOL
 *
 * REGRAS:
 * - Remove pacientes com desfecho: ALTA, ÓBITO, TRANSFERÊNCIA
 * - Reseta campos pontuais de acordo com variável CAMPOS_RESETAR
 * - Mantém formatação zebrada
 *
 * @param {GoogleAppsScript.Spreadsheet.Sheet} abaDestino - Aba onde copiar pacientes
 * @param {GoogleAppsScript.Spreadsheet.Sheet} abaOrigem - Aba de onde copiar pacientes
 */
function _copiarPacientesAtivos(abaDestino, abaOrigem) {
  Logger.log("[INFO] ===== INICIANDO CÓPIA INTELIGENTE DE PACIENTES =====");

  try {
    // ──────────────────────────────────────────────────────────
    // PASSO 1: Ler dados da aba origem
    // ──────────────────────────────────────────────────────────

    // obtem o número da última linha de dados
    const ultimaLinhaOrigem = abaOrigem.getLastRow();

    // compara com a primeira linha de dados declarada para
    // decidir se tem algum paciente. Na prática, novas planilhas
    // copiadas do modelo nunca cairão nessa verificação
    // contudo, tê-la serve como proteção contra falhas.
    if (ultimaLinhaOrigem < CONFIG.PRIMEIRA_LINHA_DADOS) {
      Logger.log("[INFO] Nenhum paciente encontrado na aba origem");
      return;
    }

    // determina o número de linhas de dados de pacientes
    const numLinhasOrigem = ultimaLinhaOrigem - CONFIG.PRIMEIRA_LINHA_DADOS + 1;

    // coleta os dados dos pacientes em um Array 2D (tabela)
    const dadosOrigem = abaOrigem
      .getRange(
        CONFIG.PRIMEIRA_LINHA_DADOS,
        1,
        numLinhasOrigem,
        CONFIG.TOTAL_COLUNAS,
      )
      .getValues();

    Logger.log(`[INFO] ${numLinhasOrigem} linhas lidas da aba origem`);

    // ──────────────────────────────────────────────────────────
    // PASSO 2: Filtrar pacientes ativos e agrupar por LEITO
    // ──────────────────────────────────────────────────────────

    // declara objeto que receberá os leitos e suas informações
    const pacientesPorLeito = {}; // { "V02": [linha1, linha2], "A05": [linha3] }

    // variável para contagem de pacientes ativos
    let totalAtivos = 0;

    // inicia loop para cada linha de dados
    for (let i = 0; i < dadosOrigem.length; i++) {
      // extração de todos os dados para validação
      // coleta linha
      const linha = dadosOrigem[i];
      // coleta valor na coluna leito
      // subtrai 1 por conta das diferenças na numeração do Planilhas e JS
      const leito = linha[CONFIG.COL_LEITO - 1];
      // coleta nome do paciente
      const nomePaciente = linha[CONFIG.COL_PACIENTE - 1];
      // coleta desfecho
      const desfecho = linha[CONFIG.COL_DESFECHO - 1];

      // Ignorar linhas vazias (sem nome de paciente)
      if (!nomePaciente || nomePaciente.toString().trim() === "") {
        continue;
      }

      // Ignorar pacientes com desfecho de saída
      if (CONFIG.DESFECHOS_EXCLUIR.includes(desfecho)) {
        Logger.log(
          `[INFO] Paciente com ${desfecho} não copiado: ${nomePaciente} (${leito})`,
        );
        continue;
      }

      // Faz cópia da linha inteira para não alterar dados originais
      const linhaCopia = [...linha];

      // Resetar campos de eventos pontuais
      // Determina o valor de cada coluna como configurado em CAMPOS_RESETAR
      for (const [col, valorReset] of Object.entries(CAMPOS_RESETAR)) {
        const index = parseInt(col) - 1;
        linhaCopia[index] = valorReset;
      }

      // Agrupar por leito
      // Verifica se o leito existe, retornando um array vazio se true
      if (!pacientesPorLeito[leito]) {
        pacientesPorLeito[leito] = [];
      }
      // Adiciona a linha de de dados copiada com o nome do pacinete
      // Isso será importante para o controle de duplicatas posteriormente
      pacientesPorLeito[leito].push({
        dados: linhaCopia,
        nomePaciente: nomePaciente,
      });

      totalAtivos++;
    }
    /**
     *  estrutura de dados:
     *   pacientesPorLeito = {
     *     "V02": [
     *       { dados: [...], nomePaciente: "João Silva" },
     *       { dados: [...], nomePaciente: "Maria Costa" }
     *     ],
     *     "A05": [
     *       { dados: [...], nomePaciente: "Pedro Santos" }
     *     ]
     *   }
     */
    Logger.log(`[INFO] ${totalAtivos} pacientes ativos encontrados`);
    Logger.log(`[INFO] ${Object.keys(pacientesPorLeito).length} leitos únicos`);

    // Verifica se há pacientes ativos e encerra a função caso não haja.
    if (totalAtivos === 0) {
      Logger.log("[INFO] Nenhum paciente ativo para copiar");
      return;
    }

    // ──────────────────────────────────────────────────────────
    // PASSO 3: Copiar para leitos fixos do modelo
    // ──────────────────────────────────────────────────────────
    const leitosExtras = []; // Leitos que não existem no modelo
    let countCopiados = 0; // Contagem de leitos copiados
    let countDuplicados = 0; // Contagem de leitos com mais de um paciente ativo

    // Mapeia a linha de cada leito da aba destino em UMA única leitura.
    // Antes, cada leito disparava uma busca célula a célula; agora a coluna
    // é lida uma vez e as buscas viram consulta em memória (ver _mapearLinhasPorLeito).
    const linhasPorLeito = _mapearLinhasPorLeito(abaDestino);

    /**
     * Iterando sobre cada item de pacientesPorLeito. Estrutura:
     *     "V02": [
     *      { dados: [...], nomePaciente: "João Silva" },
     *      { dados: [...], nomePaciente: "Maria Costa" }
     *     ],
     */
    for (const [leito, pacientes] of Object.entries(pacientesPorLeito)) {
      Logger.log(
        `[INFO] Processando leito ${leito} (${pacientes.length} paciente(s))`,
      );

      // Buscar a linha do leito no mapa pré-carregado (consulta em memória).
      // Normaliza com trim() para casar com as chaves do mapa e usa null
      // como "não encontrado", preservando o contrato da verificação abaixo.
      const linhaLeito = linhasPorLeito[leito.toString().trim()] ?? null;

      // Se existir leito na aba destino, ou seja, diferente de null
      if (linhaLeito !== null) {
        // Seleciona o primeiro paciente dentro do array de pacientes do leito
        const primeiroPaciente = pacientes[0];

        // Copiar dados do primeiro paciente na linha correspondente
        // Utiliza linhaLeito adquirida pela função auxiliar e TOTAL_COLUNAS configurada
        abaDestino
          .getRange(linhaLeito, 1, 1, CONFIG.TOTAL_COLUNAS)
          .setValues([primeiroPaciente.dados]);

        Logger.log(
          `[OK] Copiado: ${primeiroPaciente.nomePaciente} → ${leito} (linha ${linhaLeito})`,
        );
        // Atualiza contador de pacientes copiados
        countCopiados++;

        // Se houver mais de um paciente ativo cadastrado no mesmo leito
        if (pacientes.length > 1) {
          Logger.log(
            `[INFO] Leito ${leito} tem ${pacientes.length} pacientes (duplicado)`,
          );
          // Diminui por um porque conta-se somente os pacientes duplicados
          countDuplicados += pacientes.length - 1;

          // Criar leitos extras para demais pacientes
          // Inicia contagem de [1], porque paciente [0] já entrou no campo padrão
          for (let i = 1; i < pacientes.length; i++) {
            // Seleciona o paciente
            const pacienteExtra = pacientes[i];
            // Adiciona como extra mantendo o NOME ORIGINAL do leito.
            // A separação visual fica por conta da ordenação no PASSO 4.
            leitosExtras.push({
              leito: leito,
              dados: pacienteExtra.dados,
              nomePaciente: pacienteExtra.nomePaciente,
            });
            /**
             * Estrutura de dados de leitosExtras:
             * leitosExtras = [
             *   {
             *     leito: "V02",
             *     dados: [...],
             *     nomePaciente: "Maria Costa"
             *   },
             */

            Logger.log(
              `[INFO] Duplicata de ${leito} adicionada como extra: ${pacienteExtra.nomePaciente}`,
            );
          }
        }
        // Leito NÃO existe no modelo → adicionar todos como extras
        // ATENÇÃO: Campo leito é um menu drop-down, mas permite que leitos sejam nomeados com valores fora dos
        // pré-determinados. Foi definido assim para evitar a perda de valores e garantir que os dados sejam
        // passados para a planilha seguinte mesmo que tendo erro humano. Isso permite que sejam corrigidos depois.
      } else {
        Logger.log(
          `[INFO] Leito ${leito} não encontrado no modelo (será adicionado como extra)`,
        );

        for (let i = 0; i < pacientes.length; i++) {
          // Seleciona o paciente
          const paciente = pacientes[i];
          // Todos entram como extras mantendo o NOME ORIGINAL do leito,
          // inclusive eventuais duplicatas do mesmo leito fora do modelo.
          // A separação visual fica por conta da ordenação no PASSO 4.
          leitosExtras.push({
            leito: leito,
            dados: paciente.dados,
            nomePaciente: paciente.nomePaciente,
          });
        }
      }
    }

    Logger.log(`[OK] ${countCopiados} pacientes copiados para leitos fixos`);
    if (countDuplicados > 0) {
      Logger.log(
        `[INFO] ${countDuplicados} pacientes duplicados detectados (serão adicionados como extras)`,
      );
    }

    // ──────────────────────────────────────────────────────────
    // PASSO 4: Adicionar leitos extras no final (ordenados)
    // ──────────────────────────────────────────────────────────

    // Se existirem entradas em leitosExtras
    if (leitosExtras.length > 0) {
      Logger.log(`[INFO] Adicionando ${leitosExtras.length} leitos extras...`);

      // Ordenar leitos extras: V → A → ISOL
      leitosExtras.sort((a, b) => {
        return _compararLeitos(a.leito, b.leito);
      });

      // Determina a última linha de dados na aba destino
      const ultimaLinha = abaDestino.getLastRow();
      // Determina a linha para começar a inserção de dados.
      // Usa Math.max para proteger contra o caso em que a abaDestino
      // está vazia (apenas com os leitos do modelo).
      const proximaLinha = Math.max(
        ultimaLinha + 1,
        CONFIG.PRIMEIRA_LINHA_DADOS,
      );

      for (let i = 0; i < leitosExtras.length; i++) {
        // Seleciona leito
        const extra = leitosExtras[i];
        // Determina linha de inserção
        const linha = proximaLinha + i;

        // Copiar dados para linha
        abaDestino
          .getRange(linha, 1, 1, CONFIG.TOTAL_COLUNAS)
          .setValues([extra.dados]);
        Logger.log(
          `[OK] Adicionado: ${extra.nomePaciente} → ${extra.leito} (linha ${linha})`,
        );
      }

      Logger.log(`[OK] ${leitosExtras.length} leitos extras adicionados`);
    }

    // ──────────────────────────────────────────────────────────
    // RESUMO FINAL
    // ──────────────────────────────────────────────────────────
    Logger.log("[INFO] ===== RESUMO DA CÓPIA =====");
    Logger.log(`  • Total de pacientes ativos: ${totalAtivos}`);
    Logger.log(`  • Copiados para leitos fixos: ${countCopiados}`);
    Logger.log(`  • Leitos extras criados: ${leitosExtras.length}`);
    Logger.log(`  • Duplicados detectados: ${countDuplicados}`);
    Logger.log("[INFO] ===== FIM DA CÓPIA =====");
  } catch (erro) {
    Logger.log(`[ERRO] Falha ao copiar pacientes: ${erro.message}`);
    Logger.log(`[ERRO] Stack: ${erro.stack}`);
    throw erro;
  }
}

// ============================================================
// FUNÇÕES AUXILIARES
// ============================================================

/**
 * Mapeia, em uma única leitura, a linha de cada leito da aba.
 *
 * MOTIVAÇÃO (performance):
 * Substitui a antiga busca célula a célula, que fazia um getValue() por
 * linha e era chamada uma vez por leito — gerando, com a aba cheia,
 * centenas de round-trips à API do Apps Script por cópia. Aqui a coluna
 * de leitos é lida UMA vez (getValues()) e o restante é consulta em
 * memória, custo desprezível.
 *
 * COMPORTAMENTO:
 * - Lê a região fixa de dados (PRIMEIRA_LINHA_DADOS por MAX_LINHAS_DADOS).
 * - Em caso de leito repetido na própria aba, mantém a PRIMEIRA ocorrência
 *   (mesmo critério da busca linear anterior).
 * - Chaves normalizadas com trim() para casar com a comparação do chamador.
 *
 * @param {GoogleAppsScript.Spreadsheet.Sheet} aba - Aba onde mapear os leitos
 * @returns {Object<string, number>} Dicionário { leito: número da linha }
 */
function _mapearLinhasPorLeito(aba) {
  // Lê a coluna de leitos inteira de uma vez (1 chamada à API).
  // Região fixa de dados: PRIMEIRA_LINHA_DADOS até PRIMEIRA + MAX - 1.
  const valores = aba
    .getRange(
      CONFIG.PRIMEIRA_LINHA_DADOS,
      CONFIG.COL_LEITO,
      CONFIG.MAX_LINHAS_DADOS,
      1,
    )
    .getValues();

  // Dicionário de saída: { "V02": 14, "A05": 18, ... }
  const mapa = {};

  // Percorre o array 2D em memória (sem custo de API)
  for (let i = 0; i < valores.length; i++) {
    // Cada linha lida tem 1 célula → valores[i][0]
    const valorCelula = valores[i][0];

    // Ignora células vazias
    if (!valorCelula) {
      continue;
    }

    // Normaliza o nome do leito (mesma regra de comparação da busca antiga)
    const leito = valorCelula.toString().trim();
    if (leito === "") {
      continue;
    }

    // Converte o índice do array (0-based) para número de linha da planilha
    const linha = CONFIG.PRIMEIRA_LINHA_DADOS + i;

    // Mantém apenas a primeira ocorrência de cada leito
    if (mapa[leito] === undefined) {
      mapa[leito] = linha;
    }
  }

  return mapa;
}

/**
 * Compara dois leitos para ordenação: V → A → ISOL
 *
 * @param {string} leitoA - Primeiro leito
 * @param {string} leitoB - Segundo leito
 * @returns {number} -1 se A < B, 1 se A > B, 0 se iguais
 */
function _compararLeitos(leitoA, leitoB) {
  // Determina categoria de ordenação pro leito (primeira letra ou prefixo)
  const getCategoria = (leito) => {
    if (leito.startsWith("V")) return 1; // Vermelha
    if (leito.startsWith("A")) return 2; // Amarela
    if (leito.startsWith("ISOL")) return 3; // Isolamento
    return 4; // Outros
  };

  // Categoriza leitos informados como parâmetros
  const catA = getCategoria(leitoA);
  const catB = getCategoria(leitoB);

  // Se categorias diferentes, ordenar por categoria como determinado por getCategoria
  if (catA !== catB) {
    return catA - catB;
  }

  // Mesma categoria, ordenar alfabeticamente
  return leitoA.localeCompare(leitoB);
}
