import { obterUsuario } from './auth.js';

export function formatarDataHora(valor) {
  if (!valor) return 'Nao informado';
  const data = new Date(valor);
  if (Number.isNaN(data.getTime())) return valor;
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(data);
}

export function formatarData(valor) {
  if (!valor) return 'Nao informado';
  const data = new Date(`${valor}T00:00:00`);
  if (Number.isNaN(data.getTime())) return valor;
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }).format(data);
}

export function mascararCpf(cpf = '') {
  const numeros = String(cpf).replace(/\D/g, '');
  if (numeros.length < 11) return cpf || 'Nao informado';
  return `${numeros.slice(0, 3)}.***.***-${numeros.slice(-2)}`;
}

export function usuarioAtual() {
  return obterUsuario();
}

export function salvarPacienteAtual(paciente) {
  if (!paciente) return;
  localStorage.setItem('pacienteAtual', JSON.stringify(paciente));
  localStorage.setItem('dadosPacienteTriagem', JSON.stringify(paciente));
  if (paciente.id) localStorage.setItem('vittas_paciente_id', String(paciente.id));
}

export function obterPacienteAtual() {
  try {
    return JSON.parse(
      localStorage.getItem('pacienteAtual')
        || localStorage.getItem('dadosPacienteTriagem')
        || 'null',
    );
  } catch {
    return null;
  }
}

export function salvarResultadoTriagem(resultado) {
  localStorage.setItem('resultadoTriagem', JSON.stringify(resultado));
  localStorage.setItem('vittas_triagem_resultado', JSON.stringify(resultado));
  if (resultado?.paciente) salvarPacienteAtual(resultado.paciente);
  if (resultado?.paciente?.id) localStorage.setItem('vittas_paciente_id', String(resultado.paciente.id));
  if (resultado?.triagem?.id) localStorage.setItem('vittas_triagem_id', String(resultado.triagem.id));
}

export function obterResultadoTriagem() {
  try {
    return JSON.parse(localStorage.getItem('resultadoTriagem') || localStorage.getItem('vittas_triagem_resultado') || 'null');
  } catch {
    return null;
  }
}

export function salvarAtendimentoAtual(atendimento) {
  localStorage.setItem('atendimentoAtual', JSON.stringify(atendimento));
  localStorage.setItem('vittas_atendimento_atual', JSON.stringify(atendimento));
  if (atendimento?.id) localStorage.setItem('vittas_atendimento_id', String(atendimento.id));
}

export function obterAtendimentoAtual() {
  try {
    return JSON.parse(localStorage.getItem('atendimentoAtual') || localStorage.getItem('vittas_atendimento_atual') || 'null');
  } catch {
    return null;
  }
}

export function textoPrioridade(classificacao) {
  if (classificacao === 'Emergencia') return 'Procure atendimento imediato. Em sinais graves, ligue 192.';
  if (classificacao === 'Alta prioridade') return 'Caso prioritario. A fila usa tempo reduzido e score maior.';
  if (classificacao === 'Media prioridade') return 'Recomendamos avaliacao presencial conforme unidade indicada.';
  return 'Caso leve ou de rotina. A UBS indicada e o fluxo recomendado para o MVP.';
}

export function tempoBasePorScore(score, tempoMedio = 15) {
  return score >= 70 ? 10 : tempoMedio || 15;
}
