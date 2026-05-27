# Referência técnica — Mapa do Eixo

Referência operacional para quem vai mexer no código. Complementa o `README.md`.

---

## Glossário

| Termo                      | Significado                                                                                                                                                              |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Turno**                  | Janela de 12h. Diurno (D) das 7h às 19h; Noturno (N) das 19h às 7h. Cada turno é uma aba.                                                                                |
| **Aba**                    | Sheet no Google Sheets, nomeada `DD/MM/YYYY D` ou `DD/MM/YYYY N`.                                                                                                        |
| **Modelo**                 | Aba oculta `_MODELO_MAPA_EIXO` clonada a cada criação de turno.                                                                                                          |
| **Leito**                  | Identificador da posição física do paciente na UTI. 13 leitos fixos: `V01-V03` (Vermelha), `A01-A08` (Amarela), `ISOL01-ISOL02` (Isolamento).                            |
| **Leito extra**            | Leito criado dinamicamente quando há mais pacientes ativos do que leitos fixos. Adicionado no final da lista, ordenado V → A → ISOL.                                     |
| **Leito duplicado**        | Dois pacientes registrados no mesmo leito no turno anterior. O primeiro fica no leito original; o segundo vira leito extra com sufixo `_duplicado_N`.                    |
| **Leito não-identificado** | Leito presente na aba anterior mas ausente da lista do modelo (ex: erro de digitação, valor fora do dropdown). É preservado como extra com sufixo `_não_identificado_N`. |
| **Paciente ativo**         | Paciente com nome preenchido e desfecho diferente de ALTA, ÓBITO ou TRANSFERÊNCIA. Só pacientes ativos são copiados para o próximo turno.                                |
| **Desfecho**               | Estado final do paciente no turno. Valores: `ALTA`, `TRANSFERÊNCIA`, `ÓBITO`, ou vazio (paciente continua internado).                                                    |
| **IMS**                    | Índice de Mobilidade. Coluna `IMS PRÉVIO \ ATUAL` registra a evolução motora.                                                                                            |

---

## Estrutura física da aba

Cada aba tem 4 seções verticais. Coordenadas e larguras totais batem com `config.gs`.

```
┌─ Linhas 1-7 ─────────────────────────────────────────────┐
│ SEÇÃO DE INFORMAÇÕES                                     │
│ A1: "Hospital:"           B1: HOSPITAL REGIONAL...       │
│ A2: "Data:"               B2: DD/MM/YYYY                 │
│ A3: "Turno:"              B3: DIURNO/NOTURNO + horário   │
│ (linha 4 vazia)                                          │
│ A5: "Fisioterapeuta:"     B5:D5 merged (dropdown)        │
│ A6: "Enfermeiros:"        B6:D6 merged (texto livre)     │
│ A7: "Médicos:"            B7:D7 merged (texto livre)     │
├─ Linha 8 ────────────────────────────────────────────────┤
│ (vazia — gap visual)                                     │
├─ Linhas 9-10 ────────────────────────────────────────────┤
│ SEÇÃO DE INDICADORES                                     │
│ Linha 9:  títulos (Atendimentos, Admissões, Altas, ...)  │
│ Linha 10: fórmulas COUNTIF/SUM sobre a área de dados     │
├─ Linha 11 ───────────────────────────────────────────────┤
│ (vazia — gap visual)                                     │
├─ Linha 12 ───────────────────────────────────────────────┤
│ CABEÇALHO DA TABELA DE DADOS (16 colunas, A-P)          │
├─ Linhas 13-112 ──────────────────────────────────────────┤
│ DADOS DE PACIENTES (até 100 linhas)                      │
│ - Linhas 13-25: 13 leitos fixos (V01-V03, A01-A08, ISOL) │
│ - Linhas 26+: leitos extras (criados sob demanda)        │
└──────────────────────────────────────────────────────────┘
```

**Congelamento:** linhas 1-12 (cabeçalho fica visível ao rolar).

**Proteção:** toda a aba é protegida; apenas os ranges `B2:B3` (data/turno), `B5:D7` (equipe) e `A13:P112` (dados de pacientes) são editáveis por todos. O resto só pelo criador do script.

---

## Colunas de dados (linha 12 em diante)

| #   | Col | Nome                | Validação                                        | Centralizado | Quebra de linha |
| --- | --- | ------------------- | ------------------------------------------------ | ------------ | --------------- |
| 1   | A   | LEITO               | Dropdown de leitos (`setAllowInvalid: true`)     | sim          | —               |
| 2   | B   | PACIENTE            | Texto livre                                      | —            | sim             |
| 3   | C   | DIAGNÓSTICO CLINICO | Texto livre                                      | —            | sim             |
| 4   | D   | VIA AÉREA           | `TOT\VM`, `TQT\VM`, `TQT+O2`, `VE+O2`, `VE\AA`   | sim          | —               |
| 5   | E   | EVENTOS             | Dropdown de 19 valores (`setAllowInvalid: true`) | —            | —               |
| 6   | F   | VNI                 | `NÃO`, `TERAPEUTICA`, `PROFILÁTICA`              | sim          | —               |
| 7   | G   | DESMAME VM          | `SIMPLES`, `PROLONGADO`, `SEM CONDIÇÕES`         | —            | —               |
| 8   | H   | META MOTORA         | 7 valores fechados                               | —            | sim             |
| 9   | I   | META RESP.          | 9 valores fechados                               | —            | —               |
| 10  | J   | IMS PRÉVIO \ ATUAL  | Texto livre                                      | sim          | —               |
| 11  | K   | DEFICIT MOTOR       | `SIM`, `NÃO`                                     | sim          | —               |
| 12  | L   | Nº ATEND.           | Numérico livre                                   | sim          | —               |
| 13  | M   | PRESCRIÇÃO          | `SIM`, `NÃO`                                     | sim          | —               |
| 14  | N   | ADMISSÃO            | `SIM`, `NÃO`                                     | sim          | —               |
| 15  | O   | DESFECHO            | `ALTA`, `TRANSFERÊNCIA`, `ÓBITO`                 | sim          | —               |
| 16  | P   | AVALIAÇÃO DIÁRIA    | Texto livre                                      | —            | sim             |

**Sobre `setAllowInvalid`:** quando `true` (LEITO e EVENTOS), o Sheets aceita valores fora do dropdown — útil para não perder dado por erro de digitação. Quando `false` (demais), o Sheets rejeita.

Listas completas de cada dropdown ficam em `CONFIG.VALIDACOES` (`config.gs`).

---

## Indicadores (linha 10)

Cinco fórmulas calculadas automaticamente sobre as 100 linhas de dados:

| Indicador      | Fórmula                              | Lê de            |
| -------------- | ------------------------------------ | ---------------- |
| Atendimentos   | `SUM(L13:L112)`                      | Coluna Nº ATEND. |
| Admissões      | `COUNTIF(N13:N112; "SIM")`           | Coluna ADMISSÃO  |
| Altas          | `COUNTIF(O13:O112; "ALTA")`          | Coluna DESFECHO  |
| Transferências | `COUNTIF(O13:O112; "TRANSFERÊNCIA")` | Coluna DESFECHO  |
| Óbitos         | `COUNTIF(O13:O112; "ÓBITO")`         | Coluna DESFECHO  |

Definidas em `CONFIG.INDICADORES`. Para adicionar/remover, editar o array — a função `_criarSecaoIndicadores` itera sobre ele automaticamente.

---

## Regras de transição entre turnos

Implementadas em `pacientes.gs::_copiarPacientesAtivos`. Quando uma nova aba é criada com aba anterior disponível:

**1. Filtragem.** Cada linha da aba anterior é avaliada:

- Sem nome de paciente → ignorada
- Desfecho em `CONFIG.DESFECHOS_EXCLUIR` (`ALTA`, `ÓBITO`, `TRANSFERÊNCIA`) → ignorada
- Resto → marcada como ativa

**2. Reset de campos pontuais** (`CONFIG.CAMPOS_RESETAR`). Campos que descrevem "o que aconteceu neste turno" são limpos:

| Coluna         | Reset para | Por quê                                             |
| -------------- | ---------- | --------------------------------------------------- |
| 5 (EVENTOS)    | vazio      | Eventos são pontuais do turno                       |
| 12 (Nº ATEND.) | vazio      | Contador zera a cada turno                          |
| 14 (ADMISSÃO)  | `"NÃO"`    | Admissão acontece uma vez; default volta para "NÃO" |

Campos que descrevem "estado contínuo" do paciente (diagnóstico, via aérea, metas, IMS, déficit motor) **persistem** entre turnos.

**3. Match por leito.** Para cada paciente ativo, busca-se a linha do leito correspondente na nova aba (clone fresco do modelo). Casos:

- **Leito encontrado, 1 paciente**: cópia direta para a linha do leito.
- **Leito encontrado, N pacientes** (duplicado): primeiro paciente vai para o leito original; demais viram leitos extras com sufixo `_duplicado_1`, `_duplicado_2`, etc.
- **Leito não encontrado** (não-identificado): todos os pacientes daquele leito viram extras. O primeiro mantém o nome original; demais ganham sufixo `_não_identificado_N`.

**4. Ordenação de extras.** Leitos extras são adicionados ao final da tabela, ordenados por categoria (V → A → ISOL → outros) e depois alfabeticamente. Lógica em `_compararLeitos`.

---

## Cálculo da aba anterior

Implementado em `utils.gs::_obterNomeAbaAnterior`. Determina de qual aba copiar pacientes:

| Turno atual       | Aba anterior                             |
| ----------------- | ---------------------------------------- |
| Diurno (D) — 7h   | Noturno do dia anterior (`(data - 1) N`) |
| Noturno (N) — 19h | Diurno do mesmo dia (`(data) D`)         |

Se a aba anterior calculada não existir, a UI pergunta se deve criar em branco.

---

## Entry points (Pontos de Entrada)

| Função                | Tipo             | Como é chamada                                                                      |
| --------------------- | ---------------- | ----------------------------------------------------------------------------------- |
| `onOpen()`            | Trigger          | Automático ao abrir a planilha; instala o menu                                      |
| `criarTurnoDiurno()`  | Callback de menu | Item `☀️ Criar turno DIURNO`                                                        |
| `criarTurnoNoturno()` | Callback de menu | Item `🌙 Criar turno NOTURNO`                                                       |
| `_criarAbaModelo()`   | Setup            | Execução manual no editor do Apps Script (uma vez no setup, ou ao recriar o modelo) |

Internamente o fluxo é: callback do menu → `fluxoCriarTurno(turno)` em `interface.gs` → `criarNovoTurno(data, turno, abaAnterior)` em `turnos.gs`.

### Contrato de `criarNovoTurno`

```javascript
criarNovoTurno(data, turno, abaAnterior);
```

- `data`: `Date` válido (não-NaN). Lança `Error` se inválido.
- `turno`: string `"D"` ou `"N"`. Lança `Error` se outro valor.
- `abaAnterior`: `Sheet` válida (com `getName`) **ou** `null` para criar em branco. Lança `Error` se for outra coisa.

**Pré-requisitos:**

- Aba `_MODELO_MAPA_EIXO` deve existir.
- Aba destino (`DD/MM/YYYY X`) **não** pode existir — não sobrescreve.

**Retorno:** a `Sheet` recém-criada.

**Comportamento em caso de falha:** se algo der errado (parâmetro inválido, modelo ausente, aba já existente, falha técnica), a função lança `Error` e interrompe a execução. Ela não mostra alerts nem caixas de diálogo — essa responsabilidade é de quem chamou. Em uso normal, quem chama é `interface.gs::fluxoCriarTurno`, que envolve a chamada em `try/catch` e traduz o erro para uma mensagem ao usuário.

---

## Pegadinhas técnicas

Coisas que parecem bug mas são intencionais, ou que custam tempo se você não conhece.

### 1. Locale PT-BR em fórmulas

Planilhas em PT-BR usam **`;`** como separador de argumentos, não `,`. Fórmulas com vírgula falham silenciosamente.

```javascript
// ❌ Quebra
`=COUNTIF(O13:O112, "ALTA")`
// ✅ Funciona
`=COUNTIF(O13:O112; "ALTA")`;
```

### 2. `setValues` / `setFormulas` exigem array 2D

Mesmo para uma única linha:

```javascript
// ❌ Erro
range.setValues(["A", "B", "C"]);
// ✅ Correto
range.setValues([["A", "B", "C"]]);
```

E `headers[0].length` (não `headers.length`) quando `headers` é 2D — fácil de errar ao calcular o número de colunas.

### 3. Indexação dupla

Google Sheets API é **1-based**, arrays JavaScript são **0-based**. Por isso aparece `linha[CONFIG.COL_PACIENTE - 1]` ao ler valores de uma linha retornada por `getValues()`.

### 4. Proteção que não protege

`protection.setDomainEdit(false)` parece bloquear editores, mas **não bloqueia**. O que efetivamente protege é:

```javascript
protection.removeEditors(protection.getEditors());
```

Alternativa mais suave (avisa, não bloqueia): `protection.setWarningOnly(true)`.

### 5. `copyTo` herda visibilidade

O modelo é uma aba **oculta**. `modelo.copyTo(ss)` cria a cópia também oculta. Por isso `_clonarModelo` chama `novaAba.showSheet()` explicitamente.

### 6. Date constructor auto-corrige datas inválidas

`new Date(2026, 1, 31)` não lança erro — vira `03/03/2026`. Por isso `_parsearData` valida que os componentes pós-construção batem com os de entrada antes de retornar o `Date`.

### 7. Modelo é cache visual, não fonte da verdade

Recriar o modelo (`_criarAbaModelo()`) apaga e reconstrói a aba `_MODELO_MAPA_EIXO`. As abas de turnos já criadas **não são afetadas** — cada uma é um clone independente, sem vínculo dinâmico com o modelo. Alterar o modelo só afeta turnos criados depois.
