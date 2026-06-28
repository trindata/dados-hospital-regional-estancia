# Referência técnica — Mapa do Eixo

Referência operacional para quem vai mexer no código. Complementa o `README.md`.

> **Sobre as áreas:** "Mapa do Eixo" é a família de um sistema **multiárea**. O mesmo código atende Eixo, UTI, internamentos e estabilização. Onde algo varia por área, este documento usa o **Eixo** como exemplo concreto e marca o que muda. Coordenadas, colunas e regras de cada área vêm do **config daquela área** (`config_<área>.gs`).

---

## Arquitetura multiárea

Cada área é um **projeto Apps Script independente**, numa planilha própria. Um projeto é montado com:

- **Arquivos compartilhados** (idênticos em toda área): `modelo_geral.gs`, `turnos.gs`, `pacientes.gs`, `utils.gs`, `util_padronizacao.gs`, `fisioterapeutas.gs` (e `testes.gs`, opcional).
- **Um config da área**: define coordenadas, colunas, dropdowns, leitos e regras.
- **Uma interface do modo**: define o menu e o fluxo de criação.

| Área                     | config                  | interface               | modo           | colunas  |
| ------------------------ | ----------------------- | ----------------------- | -------------- | -------- |
| Eixo                     | `config_eixo`           | `interface_turno_duplo` | duplo (D/N)    | 16 (A–P) |
| UTI                      | `config_uti`            | `interface_turno_duplo` | duplo (D/N)    | 16 (A–P) |
| Estabilização Pediátrica | `config_estab_ped`      | `interface_turno_unico` | único (diário) | 16 (A–P) |
| Internamento Clínico     | `config_int_clinico`    | `interface_turno_unico` | único (diário) | 14 (A–N) |
| Internamento Pediátrico  | `config_int_pediatrico` | `interface_turno_unico` | único (diário) | 14 (A–N) |
| Internamento Cirúrgico   | `config_int_cirurgico`  | `interface_turno_unico` | único (diário) | 14 (A–N) |

**Regra dura:** um projeto leva **exatamente um** config, **uma** interface e o `modelo_geral`. Nunca dois configs, duas interfaces ou dois modelos no mesmo projeto — o Apps Script tem namespace global único e a segunda definição sobrescreve a primeira em silêncio (`onOpen`, `_criarAbaModelo`, etc.). A separação é organizacional, no repositório.

- **Modo duplo:** dois turnos por dia (D/N). Menu com Diurno/Noturno. Interface `interface_turno_duplo.gs`.
- **Modo único:** uma aba por dia. Menu com "Criar mapa do dia". Interface `interface_turno_unico.gs`. A letra `D` no nome da aba é apenas estética (`SUFIXO_ABA_DIARIA`); a lógica é centrada na data.

---

## Glossário

| Termo                           | Significado                                                                                                                                                                                                               |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Área**                        | Unidade hospitalar atendida (Eixo, UTI, internamentos, estabilização). Cada uma é um projeto/planilha com seu config.                                                                                                     |
| **Modo**                        | `duplo` (dois turnos/dia, D/N) ou `único` (uma aba/dia). Definido pela interface instalada.                                                                                                                               |
| **Turno / mapa**                | Modo duplo: janela de 12h — Diurno (D) 7h–19h, Noturno (N) 19h–7h. Modo único: o mapa do dia. Cada um é uma aba.                                                                                                          |
| **Aba**                         | Sheet no Google Sheets, nomeada `DD/MM/YYYY D` ou `DD/MM/YYYY N` (duplo), ou `DD/MM/YYYY D` (único).                                                                                                                      |
| **Modelo**                      | Aba oculta `_MODELO_MAPA` clonada a cada criação de aba. Construída por `modelo_geral.gs::_criarAbaModelo`.                                                                                                               |
| **Leito**                       | Identificador da posição física do paciente. A lista fixa **varia por área** (`CONFIG.LEITOS_INICIAIS`). No Eixo: `V01-V03`, `A01-A08`, `ISOL01-ISOL02`. Em internamento: enfermarias (`A 01`–`A 05`, …) e isolamentos.   |
| **Linha divisora (enfermaria)** | Em áreas de internamento, faixa amarela mesclada que separa enfermarias (ex.: "ENFERMARIA A"). É só visual — não é leito nem paciente. Detectada e formatada por `_implementarLinhasDivisoras`.                           |
| **Leito extra**                 | Leito criado dinamicamente quando há mais pacientes ativos do que leitos fixos. Adicionado no final da lista, ordenado por `_compararLeitos`.                                                                             |
| **Leito duplicado**             | Dois pacientes registrados no mesmo leito na aba anterior. O primeiro fica na linha do leito; o segundo vira leito extra mantendo o mesmo nome de leito (sem sufixo). A separação fica por conta da ordenação dos extras. |
| **Leito não-identificado**      | Leito presente na aba anterior mas ausente da lista do modelo (ex: erro de digitação, valor fora do dropdown). É preservado como extra mantendo o nome original (sem sufixo), para correção manual depois.                |
| **Paciente ativo**              | Paciente com nome preenchido e desfecho diferente de ALTA, ÓBITO ou TRANSFERÊNCIA. Só pacientes ativos são copiados para a próxima aba.                                                                                   |
| **Desfecho**                    | Estado final do paciente. Valores: `ALTA`, `TRANSFERÊNCIA`, `ÓBITO`, ou vazio (paciente continua internado).                                                                                                              |
| **IMS**                         | Índice de Mobilidade. A coluna `IMS PRÉVIO \ ATUAL` registra a evolução motora.                                                                                                                                           |

---

## Estrutura física da aba

Cada aba tem 4 seções verticais. As coordenadas vêm de `config_<área>.gs` (derivadas de `PRIMEIRA`, `MAX`, `ULTIMA` e das constantes `LINHA_*`). O diagrama abaixo usa o **Eixo** (16 colunas, leitos V/A/ISOL); outras áreas mudam o número de colunas e a lista de leitos, mas a estrutura vertical é a mesma.

```
┌─ Linhas 1-8 ─────────────────────────────────────────────┐
│ SEÇÃO DE INFORMAÇÕES  (LINHA_INFO_INICIO..LINHA_INFO_FIM) │
│ A1: "Hospital:"            B1: HOSPITAL REGIONAL...        │
│ A2: "Data:"                B2: DD/MM/YYYY                  │
│ A3: "Turno:"               B3: DIURNO/NOTURNO + horário    │
│ (linha 4 vazia)                                           │
│ A5: "Fisioterapeuta 1:"    B5:D5 merged (dropdown)        │
│ A6: "Fisioterapeuta 2:"    B6:D6 merged (dropdown)        │
│ A7: "Enfermeiros:"         B7:D7 merged (texto livre)     │
│ A8: "Médicos:"             B8:D8 merged (texto livre)     │
├─ Linha 9 ────────────────────────────────────────────────┤
│ (vazia — gap visual)                                      │
├─ Linhas 10-11 ───────────────────────────────────────────┤
│ SEÇÃO DE INDICADORES                                      │
│ Linha 10: títulos (Atendimentos, Admissões, ...)          │
│ Linha 11: fórmulas COUNTIF/SUM sobre a área de dados      │
├─ Linha 12 ───────────────────────────────────────────────┤
│ (vazia — gap visual)                                      │
├─ Linha 13 ───────────────────────────────────────────────┤
│ CABEÇALHO DA TABELA DE DADOS (LINHA_CABECALHO)            │
│ Eixo: 16 colunas A-P | internamento: 14 colunas A-N      │
├─ Linhas 14-113 ──────────────────────────────────────────┤
│ DADOS DE PACIENTES (PRIMEIRA..ULTIMA, até MAX=100 linhas) │
│ - Eixo: leitos fixos V01-V03, A01-A08, ISOL a partir da   │
│   linha 14; leitos extras criados sob demanda no fim      │
│ - Internamento: linhas divisoras (enfermarias) intercaladas│
│   com os leitos de cada enfermaria                        │
└──────────────────────────────────────────────────────────┘
```

**Congelamento:** `setFrozenRows(CONFIG.LINHA_CABECALHO)` — no Eixo, linhas 1-13 (cabeçalho fica visível ao rolar).

**Proteção:** modo **aviso** (`setWarningOnly(true)`), uniforme para todos. Ficam livres (sem aviso) os ranges `RANGE_DATA_TURNO` (`B2:B3`), `RANGE_EQUIPE` (`B5:D8`) e `RANGE_PACIENTES` (Eixo `A14:P113`; internamento `A14:N113`). Ver pegadinha 4 sobre por que não se usa `removeEditors`.

---

## Colunas de dados

A tabela abaixo é o layout do **Eixo** (16 colunas). **As colunas variam por área:** as áreas de internamento têm 14 colunas — **não têm VNI nem DESMAME VM** —, e por isso os índices das colunas seguintes são diferentes. Sempre leia os índices reais de `CONFIG.COL_*` da área, nunca da letra fixa.

| #   | Col | Nome                     | Validação                                      | Centralizado | Quebra de linha |
| --- | --- | ------------------------ | ---------------------------------------------- | ------------ | --------------- |
| 1   | A   | LEITO                    | Dropdown de leitos (`setAllowInvalid: true`)   | sim          | —               |
| 2   | B   | PACIENTE                 | Texto livre                                    | —            | sim             |
| 3   | C   | DIAGNÓSTICO CLINICO      | Texto livre                                    | —            | sim             |
| 4   | D   | VIA AÉREA                | `TOT/VM`, `TQT/VM`, `TQT+O2`, `VE+O2`, `VE/AA` | sim          | —               |
| 5   | E   | EVENTOS                  | Dropdown (`setAllowInvalid: true`)             | —            | —               |
| 6   | F   | VNI _(só 16 col)_        | `NÃO`, `TERAPEUTICA`, `PROFILÁTICA`            | sim          | —               |
| 7   | G   | DESMAME VM _(só 16 col)_ | `SIMPLES`, `PROLONGADO`, `SEM CONDIÇÕES`       | —            | —               |
| 8   | H   | META MOTORA              | valores fechados                               | —            | sim             |
| 9   | I   | META RESP.               | valores fechados                               | —            | —               |
| 10  | J   | IMS PRÉVIO \ ATUAL       | Texto livre (`numberFormat: "@"`)              | sim          | —               |
| 11  | K   | DEFICIT MOTOR            | `SIM`, `NÃO`                                   | sim          | —               |
| 12  | L   | Nº ATEND.                | Numérico livre                                 | sim          | —               |
| 13  | M   | PRESCRIÇÃO               | `SIM`, `NÃO`                                   | sim          | —               |
| 14  | N   | ADMISSÃO                 | `SIM`, `NÃO`                                   | sim          | —               |
| 15  | O   | DESFECHO                 | `ALTA`, `TRANSFERÊNCIA`, `ÓBITO`               | sim          | —               |
| 16  | P   | AVALIAÇÃO DIÁRIA         | Texto livre                                    | —            | sim             |

> Em internamento (14 col), VNI e DESMAME VM não existem; as colunas a partir de META MOTORA deslocam-se duas posições à esquerda. Por isso `_aplicarValidacoes` e `_ajustarColunas` guardam os blocos de VNI/DESMAME com `if (CONFIG.COL_VNI ...)`.

**Sobre `setAllowInvalid`:** quando `true` (LEITO e EVENTOS), o Sheets aceita valores fora do dropdown — útil para não perder dado por erro de digitação, e essencial para LEITO (aceita extras e divisores). Quando `false` (demais), o Sheets rejeita.

Listas completas de cada dropdown ficam em `CONFIG.VALIDACOES` (`config_<área>.gs`).

---

## Indicadores

Sete fórmulas calculadas automaticamente sobre a faixa de dados (`PRIMEIRA..ULTIMA`). As colunas variam por área — abaixo o exemplo do **Eixo**:

| Indicador      | Fórmula (Eixo)                       | Lê de             |
| -------------- | ------------------------------------ | ----------------- |
| Atendimentos   | `SUM(L14:L113)`                      | Coluna Nº ATEND.  |
| Admissões      | `COUNTIF(N14:N113; "SIM")`           | Coluna ADMISSÃO   |
| Altas          | `COUNTIF(O14:O113; "ALTA")`          | Coluna DESFECHO   |
| Transferências | `COUNTIF(O14:O113; "TRANSFERÊNCIA")` | Coluna DESFECHO   |
| Óbitos         | `COUNTIF(O14:O113; "ÓBITO")`         | Coluna DESFECHO   |
| Prescritos     | `COUNTIF(M14:M113; "SIM")`           | Coluna PRESCRIÇÃO |
| Não Prescritos | `COUNTIF(M14:M113; "NÃO")`           | Coluna PRESCRIÇÃO |

Definidas em `CONFIG.INDICADORES`. Para adicionar/remover, editar o array — `_criarSecaoIndicadores` itera sobre ele automaticamente.

> **Atenção (ver pegadinha 9):** as letras de coluna nas fórmulas são **hardcoded** e precisam bater com `CONFIG.COL_*` daquela área. Em internamento (14 col), as colunas são diferentes do Eixo — Nº ATEND. = J, ADMISSÃO = L, DESFECHO = M, PRESCRIÇÃO = K.

---

## Regras de transição entre abas

Implementadas em `pacientes.gs::_copiarPacientesAtivos`. Quando uma nova aba é criada com aba anterior disponível:

**1. Filtragem.** Cada linha da aba anterior é avaliada:

- Sem nome de paciente → ignorada (inclui as linhas divisoras, que têm o rótulo no LEITO mas não têm paciente)
- Desfecho em `CONFIG.DESFECHOS_EXCLUIR` (`ALTA`, `ÓBITO`, `TRANSFERÊNCIA`) → ignorada
- Resto → marcada como ativa

**2. Reset de campos pontuais** (`CAMPOS_RESETAR`). Campos que descrevem "o que aconteceu nesta aba" são limpos. O mapa usa `CONFIG.COL_*` (não índices fixos), então vale para qualquer área:

| Coluna          | Reset para | Por quê                                             |
| --------------- | ---------- | --------------------------------------------------- |
| `COL_EVENTOS`   | vazio      | Eventos são pontuais do turno                       |
| `COL_NUM_ATEND` | vazio      | Contador zera a cada turno                          |
| `COL_ADMISSAO`  | `"NÃO"`    | Admissão acontece uma vez; default volta para "NÃO" |

Campos que descrevem "estado contínuo" do paciente (diagnóstico, via aérea, metas, IMS, déficit motor) **persistem** entre abas.

**3. Match por leito.** Para cada paciente ativo, busca-se a linha do leito correspondente na nova aba (clone fresco do modelo). Casos:

- **Leito encontrado, 1 paciente**: cópia direta para a linha do leito.
- **Leito encontrado, N pacientes** (duplicado): primeiro paciente vai para a linha do leito; demais viram leitos extras mantendo o mesmo nome de leito (sem sufixo).
- **Leito não encontrado** (não-identificado): todos os pacientes daquele leito viram extras, mantendo o nome original do leito (sem sufixo).

**4. Ordenação de extras.** Leitos extras são adicionados ao final da tabela, ordenados por `_compararLeitos`: categoria (V → A → ISOL → outros) e depois alfabético. A categorização atual é orientada ao Eixo; leitos de internamento que não começam com V/A/ISOL caem no bucket "outros".

---

## Cálculo da aba anterior

Determina de qual aba copiar pacientes. Duas funções, ambas em `utils.gs`, ambas **puras** (só calculam o nome; a checagem de existência e o fallback ficam na interface):

**Modo duplo** — `_obterNomeAbaAnterior(data, turno)`:

| Turno atual       | Aba anterior                             |
| ----------------- | ---------------------------------------- |
| Diurno (D) — 7h   | Noturno do dia anterior (`(data - 1) N`) |
| Noturno (N) — 19h | Diurno do mesmo dia (`(data) D`)         |

**Modo único** — `_obterNomeAbaAnteriorTurnoUnico(data)`: sempre o **dia anterior** (`(data - 1) D`, sufixo `SUFIXO_ABA_DIARIA`). Não há conceito de turno; a lógica é centrada na data.

Em ambos, se a aba anterior calculada não existir, a UI pergunta se deve criar em branco. (Modo único, após fim de semana/feriado, cai nesse fallback.)

---

## Linhas divisoras (enfermarias)

Áreas de internamento agrupam leitos por enfermaria, separados por uma **faixa amarela mesclada** (banner). Mecanismo:

- `CONFIG.LINHAS_DIVISORAS` — lista de rótulos (ex.: `["ENFERMARIA A", ..., "ISOLAMENTOS"]`). **Mora dentro de `CONFIG`** (não em `FORMATO_COLUNAS_DADOS` — ver pegadinha 8). Áreas sem essa lista não têm divisores (Eixo, UTI).
- Os rótulos são **semeados** em `CONFIG.LEITOS_INICIAIS`, intercalados com os leitos. `_criarLinhasIniciais` escreve a lista reta na coluna LEITO.
- `_implementarLinhasDivisoras(aba)` (em `modelo_geral.gs`) varre a coluna LEITO; toda linha cujo valor conste em `LINHAS_DIVISORAS` (igualdade exata após `trim`) é mesclada (`TOTAL_COLUNAS`) e formatada com `FORMATO_LINHA_DIVISORA`. Guard interno: sem a lista → no-op.
- Roda no **modelo** E em **cada turno** (`turnos.gs`), porque a zebra do turno repinta a faixa e apagaria o amarelo. `breakApart()` antes do `merge()` garante idempotência (o clone já vem mesclado).

> O texto da `LINHAS_DIVISORAS` precisa bater **exatamente** com o semeado em `LEITOS_INICIAIS` (maiúsculas, acentos, espaços). Rótulo semeado que não esteja na lista não vira banner; rótulo na lista sem semeadura é inócuo (no-op).

---

## Entry points (Pontos de Entrada)

| Função                | Tipo             | Como é chamada                                                                      |
| --------------------- | ---------------- | ----------------------------------------------------------------------------------- |
| `onOpen()`            | Trigger          | Automático ao abrir a planilha; instala o menu `📋 GERAR MAPA`                      |
| `criarTurnoDiurno()`  | Callback (duplo) | Item `☀️ Criar turno DIURNO`                                                        |
| `criarTurnoNoturno()` | Callback (duplo) | Item `🌙 Criar turno NOTURNO`                                                       |
| `criarMapaDoDia()`    | Callback (único) | Item `📅 Criar mapa do dia`                                                         |
| `_criarAbaModelo()`   | Setup            | Execução manual no editor do Apps Script (uma vez no setup, ou ao recriar o modelo) |

Cada projeto tem **uma** interface, então só um conjunto de callbacks existe. O fluxo interno é:

- **Duplo:** callback → `fluxoCriarTurno(turno)` em `interface_turno_duplo.gs` → `criarNovoTurno(data, turno, abaAnterior)` em `turnos.gs`.
- **Único:** callback → `fluxoCriarMapaDiario()` em `interface_turno_unico.gs` → `criarNovoTurno(data, SUFIXO_ABA_DIARIA, abaAnterior)`.

### Contrato de `criarNovoTurno`

```javascript
criarNovoTurno(data, turno, abaAnterior);
```

- `data`: `Date` válido (não-NaN). Lança `Error` se inválido.
- `turno`: string `"D"` ou `"N"`. Lança `Error` se outro valor. (No modo único, a interface passa `SUFIXO_ABA_DIARIA`, que é `"D"`.)
- `abaAnterior`: `Sheet` válida (com `getName`) **ou** `null` para criar em branco. Lança `Error` se for outra coisa.

**Pré-requisitos:**

- Aba `_MODELO_MAPA` deve existir.
- Aba destino (`DD/MM/YYYY X`) **não** pode existir — não sobrescreve.

**Retorno:** a `Sheet` recém-criada.

**Comportamento em caso de falha:** se algo der errado (parâmetro inválido, modelo ausente, aba já existente, falha técnica), a função lança `Error` e interrompe a execução. Ela não mostra alerts nem caixas de diálogo — essa responsabilidade é de quem chamou (a interface), que envolve a chamada em `try/catch` e traduz o erro para uma mensagem ao usuário. O núcleo (`turnos.gs`, `pacientes.gs`, `modelo_geral.gs`) é compartilhado e agnóstico ao modo.

---

## Pegadinhas técnicas

Coisas que parecem bug mas são intencionais, ou que custam tempo se você não conhece.

### 1. Locale PT-BR em fórmulas

Planilhas em PT-BR usam **`;`** como separador de argumentos, não `,`. Fórmulas com vírgula falham silenciosamente.

```javascript
// ❌ Quebra
`=COUNTIF(O14:O113, "ALTA")`
// ✅ Funciona
`=COUNTIF(O14:O113; "ALTA")`;
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

### 4. Proteção: por que modo aviso

A proteção por lista de editores (`removeEditors`) nunca bloqueia o dono **nem o usuário que executa o script**. Como cada turno é criado pelos próprios editores via menu, o criador sempre ficaria isento da proteção que ele mesmo cria. Por isso `_protegerCelulas` usa `setWarningOnly(true)`: vale para todos por igual e cobre o objetivo real (evitar edição acidental das células estruturais).

### 5. `copyTo` herda visibilidade

O modelo é uma aba **oculta**. `modelo.copyTo(ss)` cria a cópia também oculta. Por isso `_clonarModelo` chama `novaAba.showSheet()` explicitamente.

### 6. Date constructor auto-corrige datas inválidas

`new Date(2026, 1, 31)` não lança erro — vira `03/03/2026`. Por isso `_parsearData` valida que os componentes pós-construção batem com os de entrada antes de retornar o `Date`.

### 7. Modelo é cache visual, não fonte da verdade

Recriar o modelo (`_criarAbaModelo()`) apaga e reconstrói a aba `_MODELO_MAPA`. As abas já criadas **não são afetadas** — cada uma é um clone independente, sem vínculo dinâmico com o modelo. Alterar o modelo só afeta abas criadas depois.

### 8. Zona morta do `CONFIG` (TDZ)

`FORMATO_COLUNAS_DADOS` é declarado **fora** do literal `const CONFIG = {...}` porque referencia chaves do próprio `CONFIG` (`CONFIG.COL_*`, `CONFIG.LARGURAS.*`) — fazê-lo dentro dispara `ReferenceError`. Cuidado relacionado: `LINHAS_DIVISORAS` (que **não** referencia `CONFIG`) deve ficar **dentro** do `CONFIG`. Se cair dentro de `FORMATO_COLUNAS_DADOS` por engano, `CONFIG.LINHAS_DIVISORAS` fica `undefined` (divisores não aplicam) e o `padronizarColunasDados` ainda tenta tratá-la como coluna.

### 9. Letras de coluna hardcoded nos indicadores

As fórmulas de `CONFIG.INDICADORES` usam a letra da coluna escrita à mão (ex.: `COUNTIF(M...)`). Ela **não** acompanha `CONFIG.COL_*` automaticamente, então cada área precisa da letra certa do seu layout (16 vs 14 colunas). Conferir ao copiar indicadores entre configs — é fonte recorrente de indicador somando a coluna errada.

### 10. Um config / uma interface / um modelo por projeto

Namespace global único no Apps Script: dois configs, duas interfaces ou dois modelos no mesmo projeto colidem e o último a carregar vence em silêncio. A coexistência dos modos é só no repositório; cada projeto monta exatamente um de cada.
