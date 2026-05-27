// ============================================================
// fisioterapeutas.gs — LISTA DE FISIOTERAPEUTAS AUTORIZADOS
// ============================================================
// Sistema de Gestão do Mapa do Eixo da Fisioterapia UTI
// Versão: 1.0
// Data: 2026-05-16
// ============================================================
//
// Lista nominal usada como fonte do dropdown da célula B5
// (campo "Fisioterapeuta") em cada turno.
//
// Mantido isolado de config.gs deliberadamente: a manutenção
// desta lista (entrada/saída de profissionais, atualização de
// CREFITO) é tarefa operacional do RT da fisioterapia, não
// requer revisão do código central.
//
// Formato: "Nome Completo - CREFITO XX######"
// ============================================================

const FISIOTERAPEUTAS = [
  "Igor Araújo Santos Trindade - CREFITO SE123456",
  "Davyd Alysson Carvalho Lopes - CREFITO SE654321",
];
