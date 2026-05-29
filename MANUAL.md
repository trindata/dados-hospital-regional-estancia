# Manual de Uso — Mapa do Eixo

Manual para o uso diário do Mapa do Eixo pela equipe de fisioterapia da UTI.

Este documento é uma **referência consultiva**: você não precisa ler do início ao fim. Use o índice para pular para o que precisa.

---

## Índice

- [O que é o Mapa do Eixo](#o-que-é-o-mapa-do-eixo)
- [Conceitos básicos](#conceitos-básicos)
- [Uso diário](#uso-diário)
  - [Criar o turno](#criar-o-turno)
  - [Preencher os dados durante o turno](#preencher-os-dados-durante-o-turno)
  - [Fechar o turno](#fechar-o-turno)
- [Cenários comuns](#cenários-comuns)
- [Situações de exceção](#situações-de-exceção)
- [Perguntas frequentes](#perguntas-frequentes)

---

## O que é o Mapa do Eixo

O Mapa do Eixo é uma planilha do Google que registra, **a cada turno**, o estado clínico de cada paciente da UTI sob acompanhamento da fisioterapia: via aérea, eventos do turno, metas terapêuticas, número de atendimentos, admissões, desfechos e avaliação diária.

Cada turno é uma **aba** da planilha, criada por um menu próprio. Os pacientes ativos do turno anterior são copiados automaticamente — você não precisa redigitar quem está internado.

Em uma frase: você cria o turno no início do plantão, preenche durante, e marca os desfechos quando acontecem. O sistema cuida do resto.

---

## Conceitos básicos

| Termo              | O que significa                                                                                                                |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| **Turno**          | Janela de 12h. Diurno (D) das 7h às 19h; Noturno (N) das 19h às 7h. Cada turno = uma aba.                                      |
| **Aba**            | Cada "página" da planilha (vê na barra de baixo). Tem nome `DD/MM/AAAA D` ou `DD/MM/AAAA N`.                                   |
| **Leito**          | Onde o paciente está fisicamente. Os fixos são `V01-V03`, `A01-A08`, `ISOL01-ISOL02`.                                          |
| **Paciente ativo** | Paciente que ainda está internado. Não recebeu alta, não foi transferido, não foi a óbito.                                     |
| **Desfecho**       | O que aconteceu com o paciente no turno: `ALTA`, `TRANSFERÊNCIA`, `ÓBITO`. Quem tem desfecho **não vai** para o próximo turno. |
| **Aba anterior**   | A aba de onde o sistema copia os pacientes ao criar um turno novo.                                                             |

### De qual aba o sistema copia pacientes?

- Turno **Diurno** (manhã) → copia do **Noturno do dia anterior**
- Turno **Noturno** (noite) → copia do **Diurno do mesmo dia**

Faz sentido: você sempre puxa de quem terminou o plantão antes do seu.

---

## Uso diário

### Criar o turno

No início do plantão:

1. Abra a planilha do Mapa do Eixo.
2. No menu superior, clique em **📋 Mapa do Eixo**.
3. Clique em **☀️ Criar turno DIURNO** ou **🌙 Criar turno NOTURNO**, conforme seu plantão.
4. Vai aparecer uma caixa pedindo a data. Deixe em branco para usar **hoje** e clique **OK**.
5. Vai aparecer uma confirmação resumindo o que será feito ("Criar turno DIURNO de DD/MM/AAAA, copiando pacientes ativos de [aba anterior]?"). Clique **Sim**.
6. Em poucos segundos, uma nova aba aparece na barra de baixo — pronto, você está no seu turno.

> **Importante:** crie o turno **uma vez só** por plantão. Se você criar e outro colega criar de novo, vai dar erro avisando que a aba já existe (e isso é proposital — para não apagar trabalho de ninguém).

### Preencher os dados durante o turno

Ao longo do plantão, edite as colunas conforme o atendimento. Os campos com **seta para baixo** têm lista pronta — clique e escolha. Os outros são texto livre.

**Campos que mudam pouco (já vêm preenchidos do turno anterior):**

- PACIENTE, DIAGNÓSTICO CLÍNICO, VIA AÉREA, VNI, DESMAME VM, META MOTORA, META RESP., IMS, DEFICIT MOTOR, PRESCRIÇÃO — atualize só se houver mudança clínica.

**Campos que você preenche do zero a cada turno:**

- **EVENTOS** — eventos clínicos relevantes que aconteceram no turno (IOT, PRONA, PCR, FEBRE, etc.). Vem em branco.
- **Nº ATEND.** — quantos atendimentos foram realizados neste turno. Começa em branco; vai somando ao longo do plantão.
- **ADMISSÃO** — marcar `SIM` se foi admitido **neste turno**. Vem como `NÃO`.
- **AVALIAÇÃO DIÁRIA** — texto livre com a avaliação clínica do dia.

**Campos de saída:**

- **DESFECHO** — preencher só se o paciente teve alta, foi transferido, ou foi a óbito **neste turno**. Senão, deixe em branco.

### Fechar o turno

Não há "botão fechar". Quando seu plantão termina:

1. Confira que todos os pacientes têm os campos do turno preenchidos (Nº ATEND., EVENTOS se houve, AVALIAÇÃO DIÁRIA).
2. Marque os desfechos dos pacientes que saíram.
3. Pronto. Quem entrar no próximo turno cria a nova aba e os pacientes ativos vão automaticamente.

> Os **indicadores no topo da aba** (Atendimentos, Admissões, Altas, Transferências, Óbitos) atualizam sozinhos conforme você preenche. Não precisa fazer conta.

---

## Cenários comuns

### Admissão de paciente novo

Paciente novo entrou na UTI durante seu plantão:

1. Encontre uma **linha vazia** na tabela (use um leito fixo que esteja desocupado, ou role para baixo se precisar).
2. Selecione o leito na coluna **LEITO** (lista suspensa).
3. Digite o **PACIENTE** e o **DIAGNÓSTICO CLÍNICO**.
4. Preencha o estado clínico atual: VIA AÉREA, VNI, DESMAME VM, etc.
5. Marque **ADMISSÃO** como `SIM`.
6. Atualize o Nº ATEND. conforme for atendendo.

### Alta hospitalar

Paciente teve alta:

1. Na linha do paciente, vá na coluna **DESFECHO**.
2. Selecione `ALTA`.
3. Não precisa apagar o resto — fica como histórico do plantão.

No próximo turno, esse paciente **não aparece**. O leito dele fica livre.

### Transferência ou óbito

Mesma lógica da alta — marcar `TRANSFERÊNCIA` ou `ÓBITO` na coluna DESFECHO. O paciente sai do próximo turno automaticamente.

### Troca de leito

Paciente mudou de leito durante o turno:

1. Na linha do paciente, altere o valor da coluna **LEITO** para o novo.
2. Pronto.

> No próximo turno, o paciente vai aparecer na linha do **novo** leito.

### Múltiplos eventos no mesmo paciente

A coluna EVENTOS aceita só um valor por vez no dropdown. Se houve mais de um evento (ex: PRONA e FEBRE), você pode:

- Escolher o mais relevante no dropdown, **ou**
- Digitar manualmente algo como `PRONA + FEBRE` na célula (o sistema aceita texto fora da lista nessa coluna).

---

## Situações de exceção

### "A aba anterior não foi encontrada"

Aparece quando o turno anterior esperado não existe na planilha. Cenários:

- **Primeiro turno do sistema** — normal, ainda não tem histórico. Crie em branco.
- **Esqueceram de criar o turno anterior** — alguém pulou um plantão. O sistema pergunta se quer criar em branco. Responda **Sim**, e depois preencha os pacientes manualmente baseado em qual foi a última aba existente. Se quiser, copie e cole linhas da última aba existente para economizar digitação.
- **Você selecionou a data errada** — cancele, confira a data, e crie de novo.

### O mesmo leito apareceu em duas linhas

Significa que no turno anterior **duas linhas tinham o mesmo leito**. Provavelmente alguém colocou um paciente novo numa linha sem perceber que o leito já estava ocupado. O sistema copia os dois: um fica na linha normal do leito e o outro vai para o fim da lista, com o mesmo nome de leito.

O que fazer:

1. Confira na aba atual qual paciente está realmente naquele leito.
2. Corrija a coluna LEITO do paciente "duplicado" para o leito real onde ele está, ou apague a linha se for erro.
3. Avise o colega para evitar repetir.

### Apareceu um leito com nome fora da lista padrão

Significa que no turno anterior havia um paciente com **um nome de leito que não está na lista padrão** — por exemplo, alguém digitou `V0$` em vez de `V03`, ou usou um leito `_extra` que não existe.

O que fazer:

1. Localize qual paciente é (pelo nome) e qual leito ele realmente ocupa.
2. Corrija a coluna LEITO para o valor correto da lista.

### O sistema travou ou deu erro

1. **Não recarregue ainda.** Tire um print da tela.
2. Anote o que estava fazendo no momento.
3. Avise o Igor pelo canal combinado.
4. Se for urgente continuar o plantão, prossiga preenchendo os pacientes manualmente naquela aba mesmo — o importante é não perder informação clínica.

### Preenchi a aba errada

Você editou uma aba que não era a do seu turno (talvez a do dia anterior). O Google Sheets tem **histórico de versões**:

1. **Arquivo** → **Histórico de versões** → **Ver histórico de versões**.
2. Localize a versão antes da edição errada.
3. Você pode restaurar ou copiar dados de lá.

---

## Perguntas frequentes

**P: Posso ter mais de uma pessoa editando ao mesmo tempo?**
R: Sim, até 2 ao mesmo tempo. Acima disso pode dar conflito. Se for criar turno (operação que mexe na estrutura), faça só uma pessoa por vez.

**P: Posso editar a aba do turno anterior depois que ele já passou?**
R: Pode, sim. Útil para corrigir um Nº ATEND. esquecido, ajustar um desfecho, etc. Mas atenção: edições retroativas na aba anterior **não** afetam a aba atual (os pacientes já foram copiados).

**P: Como apagar uma aba criada por engano?**
R: Botão direito no nome da aba (rodapé) → **Excluir**. Confirme. Atenção: ação irreversível (mas o histórico de versões salva você se precisar).

**P: O sistema sugeriu copiar de uma aba antiga porque a esperada não existe — posso recusar?**
R: Pode. O sistema oferece criar **em branco** como alternativa. Mas em condições normais o melhor é nunca criar em branco — sempre puxar dos pacientes ativos do turno anterior.

**P: O nome do paciente mudou (correção ortográfica). Preciso fazer algo?**
R: Não. Pode editar livremente na aba atual. No próximo turno, o nome corrigido é o que vai junto.

**P: Posso adicionar colunas ou mudar os dropdowns?**
R: Não pela planilha. Mudanças estruturais (nova coluna, novo evento, novo desfecho) precisam ser feitas no código pelo Igor. Avise-o se algo for relevante incluir.

**P: E se o paciente ficar mais de 24h sem ser atendido (ex: sábado/domingo sem fisio)?**
R: O sistema continua copiando ele entre turnos normalmente. O Nº ATEND. do turno fica em branco (ou 0), e o paciente segue ativo até receber desfecho.

---

## Em caso de dúvida

- Sobre **uso clínico** (o que registrar, como classificar) — converse com o RT da fisioterapia (Davyd).
- Sobre **problemas técnicos** (erro, travamento, comportamento estranho) — fale com o Igor.
