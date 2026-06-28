# Manual de Uso — Mapa do Eixo

Manual para o uso diário do Mapa do Eixo pela equipe assistencial (fisioterapia e equipe da unidade).

Este documento é uma **referência consultiva**: você não precisa ler do início ao fim. Use o índice para pular para o que precisa.

> **Sobre as áreas:** o sistema atende várias áreas do hospital (Eixo, UTI, internamentos, estabilização). O uso é o mesmo em quase tudo. Onde o comportamento muda por área — **se há dois turnos por dia ou um mapa diário**, e **quais leitos existem** — há um aviso destacado. Você só precisa olhar o aviso da **sua** área.

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

O Mapa do Eixo é uma planilha do Google que registra o estado clínico de cada paciente do setor sob acompanhamento da equipe: via aérea, eventos do período, metas terapêuticas, número de atendimentos, admissões, desfechos e avaliação diária.

Cada planilha nova é uma **aba**, criada por um menu próprio. Os pacientes ativos da aba anterior são copiados automaticamente — você não precisa redigitar quem está internado.

> **Conforme a sua área:**
>
> - **Turno duplo (Eixo, UTI):** há duas abas por dia, uma por turno (Diurno e Noturno).
> - **Turno único (internamentos, estabilização):** há **uma aba por dia** (o mapa do dia).

Em uma frase: você cria a aba no início do plantão, preenche durante, e marca os desfechos quando acontecem. O sistema cuida do resto.

---

## Conceitos básicos

| Termo                          | O que significa                                                                                                                                                                       |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Turno / mapa**               | Em áreas de turno duplo: janela de 12h — Diurno (D) 7h–19h, Noturno (N) 19h–7h. Em áreas de turno único: o mapa do dia. Cada um é uma aba.                                            |
| **Aba**                        | Cada "página" da planilha (vê na barra de baixo). Tem nome `DD/MM/AAAA D` ou `DD/MM/AAAA N` (turno duplo), ou `DD/MM/AAAA D` (turno único).                                           |
| **Leito**                      | Onde o paciente está fisicamente. Os leitos fixos **variam por área** (veja abaixo).                                                                                                  |
| **Enfermaria (faixa amarela)** | Em áreas de internamento, os leitos são agrupados por enfermaria. As **faixas amarelas** (ex.: "ENFERMARIA A") são apenas separadores visuais — não são pacientes e não se preenchem. |
| **Paciente ativo**             | Paciente que ainda está internado. Não recebeu alta, não foi transferido, não foi a óbito.                                                                                            |
| **Desfecho**                   | O que aconteceu com o paciente: `ALTA`, `TRANSFERÊNCIA`, `ÓBITO`. Quem tem desfecho **não vai** para a próxima aba.                                                                   |
| **Aba anterior**               | A aba de onde o sistema copia os pacientes ao criar uma aba nova.                                                                                                                     |

> **Leitos por área:** cada área tem sua própria lista de leitos fixos. No Eixo são `V01-V03`, `A01-A08`, `ISOL01-ISOL02`; nas áreas de internamento são as enfermarias (ex.: `A 01`–`A 05`, `B 01`–`B 05`, …) e isolamentos. Você sempre escolhe o leito na lista suspensa da coluna **LEITO**.

### De qual aba o sistema copia pacientes?

> **Conforme a sua área:**
>
> - **Turno duplo (Eixo, UTI):**
>   - Turno **Diurno** (manhã) → copia do **Noturno do dia anterior**
>   - Turno **Noturno** (noite) → copia do **Diurno do mesmo dia**
> - **Turno único (internamentos, estabilização):**
>   - Mapa de hoje → copia do **mapa do dia anterior**

Faz sentido: você sempre puxa de quem terminou o plantão antes do seu.

---

## Uso diário

### Criar o turno

No início do plantão:

1. Abra a planilha da sua área.
2. No menu superior, clique em **📋 GERAR MAPA**.
3. Clique na opção da sua área:
   - **Turno duplo:** **☀️ Criar turno DIURNO** ou **🌙 Criar turno NOTURNO**, conforme seu plantão.
   - **Turno único:** **📅 Criar mapa do dia**.
4. Vai aparecer uma caixa pedindo a data. Deixe em branco para usar **hoje** e clique **OK**.
5. Vai aparecer uma confirmação resumindo o que será feito (ex.: "Criar turno DIURNO de DD/MM/AAAA, copiando pacientes ativos de [aba anterior]?", ou "Criar o mapa de DD/MM/AAAA, copiando…"). Clique **Sim**.
6. Em poucos segundos, uma nova aba aparece na barra de baixo — pronto, você está no seu turno.

> **Importante:** crie a aba **uma vez só** por plantão. Se você criar e outro colega criar de novo, vai dar erro avisando que a aba já existe (e isso é proposital — para não apagar trabalho de ninguém).

### Preencher os dados durante o turno

Ao longo do plantão, edite as colunas conforme o atendimento. Os campos com **seta para baixo** têm lista pronta — clique e escolha. Os outros são texto livre.

> **As colunas variam por área.** Áreas de internamento, por exemplo, não têm as colunas **VNI** e **DESMAME VM**. A lógica abaixo (o que persiste e o que se preenche a cada turno) vale para todas; ignore as colunas que não existirem na sua área.

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

> Os **indicadores no topo da aba** (Atendimentos, Admissões, Altas, Transferências, Óbitos, Prescritos) atualizam sozinhos conforme você preenche. Não precisa fazer conta.

---

## Cenários comuns

### Admissão de paciente novo

Paciente novo entrou no setor durante seu plantão:

1. Encontre uma **linha vazia** na tabela (use um leito fixo que esteja desocupado, ou role para baixo se precisar).
2. Selecione o leito na coluna **LEITO** (lista suspensa).
3. Digite o **PACIENTE** e o **DIAGNÓSTICO CLÍNICO**.
4. Preencha o estado clínico atual: VIA AÉREA, metas, etc. (as colunas disponíveis dependem da sua área).
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

Aparece quando a aba anterior esperada não existe na planilha. Cenários:

- **Primeira aba do sistema** — normal, ainda não tem histórico. Crie em branco.
- **Esqueceram de criar a aba anterior** — alguém pulou um plantão (ou, em áreas de turno único, pulou um dia: fim de semana, feriado). O sistema pergunta se quer criar em branco. Responda **Sim**, e depois preencha os pacientes manualmente com base na última aba existente. Se quiser, copie e cole linhas da última aba existente para economizar digitação.
- **Você selecionou a data errada** — cancele, confira a data, e crie de novo.

### O mesmo leito apareceu em duas linhas

Significa que na aba anterior **duas linhas tinham o mesmo leito**. Provavelmente alguém colocou um paciente novo numa linha sem perceber que o leito já estava ocupado. O sistema copia os dois: um fica na linha normal do leito e o outro vai para o fim da lista, com o mesmo nome de leito.

O que fazer:

1. Confira na aba atual qual paciente está realmente naquele leito.
2. Corrija a coluna LEITO do paciente "duplicado" para o leito real onde ele está, ou apague a linha se for erro.
3. Avise o colega para evitar repetir.

### Apareceu um leito com nome fora da lista padrão

Significa que na aba anterior havia um paciente com **um nome de leito que não está na lista padrão** — por exemplo, alguém digitou um leito que não existe, ou um valor com erro de digitação.

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
R: Sim, até 2 ao mesmo tempo. Acima disso pode dar conflito. Se for criar a aba (operação que mexe na estrutura), faça só uma pessoa por vez.

**P: Posso editar a aba anterior depois que ela já passou?**
R: Pode, sim. Útil para corrigir um Nº ATEND. esquecido, ajustar um desfecho, etc. Mas atenção: edições retroativas na aba anterior **não** afetam a aba atual (os pacientes já foram copiados).

**P: Como apagar uma aba criada por engano?**
R: Botão direito no nome da aba (rodapé) → **Excluir**. Confirme. Atenção: ação irreversível (mas o histórico de versões salva você se precisar).

**P: O sistema sugeriu copiar de uma aba antiga porque a esperada não existe — posso recusar?**
R: Pode. O sistema oferece criar **em branco** como alternativa. Mas em condições normais o melhor é nunca criar em branco — sempre puxar dos pacientes ativos da aba anterior.

**P: O nome do paciente mudou (correção ortográfica). Preciso fazer algo?**
R: Não. Pode editar livremente na aba atual. Na próxima aba, o nome corrigido é o que vai junto.

**P: Posso adicionar colunas ou mudar os dropdowns?**
R: Não pela planilha. Mudanças estruturais (nova coluna, novo evento, novo desfecho) precisam ser feitas no código pelo Igor. Avise-o se algo for relevante incluir.

**P: As faixas amarelas de enfermaria atrapalham? Posso editar?**
R: Não precisa mexer. Elas são só separadores visuais entre as enfermarias. Não digite nada nelas — preencha sempre as linhas dos leitos abaixo de cada faixa.

**P: E se o paciente ficar mais de 24h sem ser atendido (ex: sábado/domingo sem atendimento)?**
R: O sistema continua copiando ele entre as abas normalmente. O Nº ATEND. da aba fica em branco (ou 0), e o paciente segue ativo até receber desfecho.

---

## Em caso de dúvida

- Sobre **uso clínico** (o que registrar, como classificar) — converse com o RT da fisioterapia (Davyd).
- Sobre **problemas técnicos** (erro, travamento, comportamento estranho) — fale com o Igor.
