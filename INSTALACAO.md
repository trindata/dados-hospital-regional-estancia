# Tutorial de Instalação — Mapa do Eixo

Este tutorial é para instalar o Mapa do Eixo numa planilha vazia. Ao final, a planilha vai ter um menu próprio (`📋 Mapa do Eixo`) com os botões de criação de turno Diurno e Noturno funcionando.

A instalação é feita uma única vez. Depois, o uso é só pelo menu.

---

## Antes de começar

**Pré-requisitos:**

- Conta Google ativa, com acesso ao Google Drive e Planilhas
- Computador (não funciona bem pelo celular — alguns passos não estão disponíveis no app móvel)
- Acesso aos 8 arquivos de código do projeto:
  - **Link do repositório / pasta no Drive:** _[A SER PREENCHIDO POR IGOR]_

**Tempo estimado:** 20 a 30 minutos, sem pressa.

**Se algo der errado:** não se preocupe em "consertar" — anote em que passo aconteceu, tire um print da tela se conseguir, e fale com o Igor.

---

## Visão geral

O que vamos fazer, em ordem:

1. Criar uma planilha em branco no Google Drive
2. Abrir o editor de scripts (Apps Script) dessa planilha
3. Criar 8 arquivos no editor e colar o código de cada um
4. Atualizar a lista de fisioterapeutas com os CREFITOs reais
5. Autorizar permissões e rodar o setup inicial
6. Validar que o menu apareceu na planilha
7. Compartilhar a planilha com a equipe

---

## Passo 1 — Criar a planilha

1. Abra o Google Drive ([drive.google.com](https://drive.google.com)).
2. Clique no botão **+ Novo** (canto superior esquerdo) → **Planilhas Google** → **Planilha em branco**.
3. Uma nova aba do navegador vai abrir com uma planilha sem nome.
4. Clique no título "Planilha sem título" (canto superior esquerdo) e renomeie para algo como:
   ```
   Mapa do Eixo - UTI - Hospital Jessé Fontes
   ```
5. **Não feche essa aba.** Vamos voltar para ela ao final.

[SCREENSHOT: planilha em branco recém-criada com o nome aplicado]

✅ Ao fim deste passo: você tem uma planilha em branco aberta no navegador, com o nome correto.

---

## Passo 2 — Abrir o editor de scripts

Aqui é onde a maior parte do trabalho acontece. O **Apps Script** é um editor de código que vive dentro do Google — é separado da planilha, mas conectado a ela.

1. Na planilha que você acabou de criar, no menu superior, clique em **Extensões** → **Apps Script**.
2. Uma **nova aba** do navegador vai abrir mostrando o editor de scripts.
3. No editor, você vai ver:
   - Do lado esquerdo: uma lista chamada **Arquivos**, com um arquivo padrão chamado `Código.gs`.
   - No centro: o conteúdo desse arquivo, que tem só uma função vazia `myFunction()`.
   - No topo: o nome do projeto, que está como "Projeto sem título".

[SCREENSHOT: editor do Apps Script recém-aberto, mostrando o arquivo Código.gs e a função vazia]

4. Clique no nome **"Projeto sem título"** (no topo) e renomeie para `Mapa do Eixo`. Confirme.

✅ Ao fim deste passo: editor aberto numa aba separada, projeto renomeado.

---

## Passo 3 — Criar os 8 arquivos de código

Esta é a parte mais demorada. Vamos criar 8 arquivos no editor, um de cada vez, copiando o conteúdo de cada um do repositório.

### 3.1. Apagar o arquivo padrão

1. Na lista **Arquivos** do lado esquerdo, passe o mouse sobre `Código.gs`.
2. Clique nos **três pontinhos** que aparecem do lado direito do nome.
3. Escolha **Excluir**. Confirme.

[SCREENSHOT: menu de três pontinhos com a opção "Excluir" destacada]

### 3.2. Criar cada arquivo

Você vai criar 8 arquivos com estes nomes exatos (sem o `.gs` — o editor adiciona sozinho):

1. `config`
2. `fisioterapeutas`
3. `utils`
4. `util_padronizacao`
5. `modelo`
6. `pacientes`
7. `turnos`
8. `interface`

Para **cada um** dos 8 arquivos, repita estes passos:

1. No lado esquerdo, ao lado de **Arquivos**, clique no botão **+** (símbolo de mais).
2. Escolha **Script** (não escolha HTML).
3. Digite o nome exato do arquivo (ex: `config`) e pressione **Enter**.
4. Um novo arquivo abre no centro, com um esqueleto de função vazia.
5. **Selecione tudo** (Ctrl+A no Windows / Cmd+A no Mac) e **apague** (Delete).
6. Vá ao repositório / pasta do Drive (link no topo deste tutorial), abra o arquivo correspondente (ex: `config.gs`), e **copie todo o conteúdo** (Ctrl+A → Ctrl+C).
7. Volte ao editor do Apps Script e **cole** no arquivo vazio (Ctrl+V).
8. Salve com **Ctrl+S** (ou Cmd+S no Mac). Você deve ver uma confirmação rápida no topo.

[SCREENSHOT: botão "+" ao lado de Arquivos, com a opção "Script" destacada]

[SCREENSHOT: arquivo `config` criado e preenchido, com indicação visual de "salvo"]

### 3.3. Validação intermediária

Quando terminar os 8 arquivos, a lista de **Arquivos** no lado esquerdo deve mostrar exatamente isto, na ordem que você criou:

```
config.gs
fisioterapeutas.gs
utils.gs
util_padronizacao.gs
modelo.gs
pacientes.gs
turnos.gs
interface.gs
```

[SCREENSHOT: lista completa dos 8 arquivos no painel lateral]

> **Atenção:** os nomes precisam ser **exatamente** esses. Se você digitou `Config` (com C maiúsculo) ou `fisioterapeuta` (sem o "s"), o sistema pode não funcionar. Caso veja qualquer diferença, clique nos três pontinhos do arquivo, escolha **Renomear** e corrija.

✅ Ao fim deste passo: os 8 arquivos estão criados, preenchidos com o código correspondente, e salvos.

---

## Passo 4 — Atualizar os CREFITOs

Esta é a única customização necessária. O arquivo `fisioterapeutas.gs` tem os números de CREFITO como `SE123456` e `SE654321` — são valores **falsos**, só para o código rodar. Você precisa substituir pelos números reais.

1. Na lista de arquivos, clique em `fisioterapeutas.gs`.
2. Você vai ver algo parecido com:
   ```javascript
   const FISIOTERAPEUTAS = [
     "Igor Araújo Santos Trindade - CREFITO SE123456",
     "Davyd Alysson Carvalho Lopes - CREFITO SE654321",
   ];
   ```
3. Substitua `SE123456` pelo CREFITO real do Igor e `SE654321` pelo seu.
4. **Não mexa nas aspas, vírgulas, ou em qualquer outra parte da linha.** Só troque o número.
5. Salve com **Ctrl+S**.

[SCREENSHOT: arquivo fisioterapeutas.gs com os CREFITOs reais preenchidos]

✅ Ao fim deste passo: os CREFITOs reais estão no arquivo, salvos.

---

## Passo 5 — Autorizar permissões e rodar o setup

Agora vamos rodar a função que cria a estrutura visual do Mapa do Eixo na planilha. Na primeira execução, o Google vai pedir permissões — é normal.

### 5.1. Selecionar a função

1. Na **barra superior** do editor (acima do código), há um menu suspenso (dropdown) com nome de função. Por padrão pode estar mostrando alguma função qualquer.
2. Clique nesse dropdown e procure por **`_criarAbaModelo`** (vai estar no meio da lista). Selecione.

[SCREENSHOT: dropdown da barra superior com `_criarAbaModelo` selecionado]

### 5.2. Executar

3. Clique no botão **Executar** (▶), ao lado do dropdown.
4. Vai aparecer uma janela: **"Autorização necessária"** — clique em **Revisar permissões**.

### 5.3. Autorizar (primeira vez apenas)

5. Uma nova janela do Google abre pedindo para escolher a conta. Escolha sua conta Google (a mesma da planilha).
6. Pode aparecer uma tela amarela/laranja com o aviso **"Google não verificou este app"**. Isso é esperado — não estamos publicando o app, é uso pessoal.
   - Clique em **Avançado** (link pequeno no canto inferior).
   - Clique em **Acessar Mapa do Eixo (não seguro)**.

   > Esse "não seguro" assusta mas significa apenas que o app não passou por revisão pública do Google — o que faz sentido, já que é um script interno da sua equipe. Você está autorizando seu próprio script a usar suas próprias planilhas.

7. Na tela seguinte, o Google mostra a lista de permissões que o script precisa:
   - **Ver, editar, criar e excluir todas as suas planilhas do Google Drive**
   - **Exibir e executar conteúdo de terceiros em planilhas...**

   Clique em **Permitir**.

[SCREENSHOT: tela "Google não verificou este app" com link "Avançado" visível]

[SCREENSHOT: tela final de permissões com botão "Permitir"]

### 5.4. Aguardar execução

8. A janela de autorização fecha e a função começa a rodar. Você vê uma barra cinza no rodapé com **"Em execução..."**.
9. Em alguns segundos, vai aparecer **"Execução concluída"**.

10. Abaixo do editor há uma área chamada **Registro de execução** (ou **Logs**). Role essa área para baixo — a última linha deve ser:
    ```
    [OK] ✅ Aba-modelo criada com sucesso!
    ```

[SCREENSHOT: registro de execução mostrando a mensagem de sucesso final]

> **Se aparecer erro vermelho:** anote a mensagem exata, tire print do registro de execução e mande para o Igor.

✅ Ao fim deste passo: o script está autorizado e a aba-modelo foi criada (mas ela é oculta, então você não vai vê-la na planilha ainda).

---

## Passo 6 — Validar o menu na planilha

1. Volte para a aba do navegador onde está a **planilha** (não o editor).
2. **Recarregue a página** (F5 ou Ctrl+R).
3. Aguarde a planilha terminar de carregar.
4. Na barra de menus superior, ao lado de **Ajuda**, deve aparecer um novo item:

   ```
   📋 Mapa do Eixo
   ```

5. Clique nele. Devem aparecer duas opções:
   - ☀️ Criar turno DIURNO
   - 🌙 Criar turno NOTURNO

[SCREENSHOT: barra de menus da planilha mostrando o menu "📋 Mapa do Eixo" expandido com as duas opções]

### Teste rápido

6. Para confirmar que tudo está funcionando, clique em **☀️ Criar turno DIURNO**.
7. Uma caixa pergunta pela data — deixe em branco e clique **OK** (usa a data de hoje).
8. Outra caixa pergunta se quer criar em branco (já que não existe turno anterior na primeira vez) — clique **Sim**.
9. Confirmação final — clique **Sim**.
10. Em alguns segundos, uma nova aba aparece na parte inferior da planilha com o nome `DD/MM/AAAA D`, mostrando o Mapa do Eixo pronto para uso.

[SCREENSHOT: aba recém-criada com o Mapa do Eixo, mostrando seção de informações, indicadores e cabeçalho da tabela]

✅ Ao fim deste passo: o sistema está instalado e funcionando.

> **Opcional:** depois de validar, você pode deletar a aba de teste clicando com o botão direito no nome da aba (rodapé) → **Excluir**.

---

## Passo 7 — Compartilhar a planilha com a equipe

Agora que o sistema funciona, libere o acesso para quem vai usar.

1. Na planilha, clique no botão **Compartilhar** (azul, canto superior direito).
2. No campo de e-mail, adicione os e-mails das pessoas autorizadas a editar (fisioterapeutas, enfermagem, médicos — conforme o protocolo da unidade).
3. Para cada pessoa, escolha a permissão **Editor**.
4. Clique em **Enviar**.

[SCREENSHOT: caixa de diálogo de compartilhamento com permissão "Editor" selecionada]

> **Importante:** o sistema foi projetado para até **2 editores ativos ao mesmo tempo**. Adicionar mais pessoas com permissão de Editor não é problema — só evite que mais de 2 estejam editando turnos simultaneamente, para não dar conflito.

✅ Ao fim deste passo: a equipe tem acesso e o sistema está pronto para uso diário.

---

## Resolução de problemas

### O menu `📋 Mapa do Eixo` não aparece na planilha

- Verifique se você **salvou** todos os arquivos no editor (Ctrl+S em cada).
- **Recarregue** a planilha (F5). O menu só aparece após o reload, não automaticamente após salvar.
- Se mesmo assim não aparecer, abra novamente **Extensões → Apps Script**, verifique se os 8 arquivos ainda estão lá com os nomes corretos.

### Erro ao executar `_criarAbaModelo`

- Verifique se os 8 arquivos foram criados com os nomes **exatos** listados no passo 3.
- Verifique se você colou o **conteúdo inteiro** de cada arquivo (às vezes a cópia falha).
- Tire print do erro no registro de execução e envie para o Igor.

### Tela "Google não verificou este app" não tem opção "Avançado"

- Acontece em algumas contas Google corporativas que bloqueiam scripts não verificados.
- Tente usar uma conta Google pessoal (Gmail comum) para a instalação inicial.
- Se não for possível, fale com o Igor para uma alternativa.

### O turno foi criado mas está sem leitos ou sem formatação

- Provavelmente o arquivo `config.gs` ou `modelo.gs` foi colado incompleto.
- Vá no editor, abra o `config.gs`, role até o fim e veja se termina com `};`.
- Se não terminar, refaça a cópia desse arquivo e rode `_criarAbaModelo` novamente.

### Outro problema

Tire print da tela e do registro de execução do Apps Script, anote em qual passo aconteceu, e envie para o Igor.

---

## Pronto!

A instalação está completa. Para o uso diário, basta usar o menu **📋 Mapa do Eixo** na planilha — não precisa voltar no editor de scripts.

A documentação técnica do sistema fica nos arquivos `README.md` e `REFERENCIA.md` do repositório.
