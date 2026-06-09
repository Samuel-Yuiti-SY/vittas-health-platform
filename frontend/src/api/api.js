import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      error.mensagemAmigavel = 'Nao foi possivel conectar ao servidor do VITTAS. Verifique se a API esta ativa.';
    }
    return Promise.reject(error);
  },
);

export function obterMensagemErro(error, fallback = 'Nao foi possivel conectar ao servidor do VITTAS. Verifique se a API esta ativa.') {
  return error.response?.data?.detail || error.mensagemAmigavel || fallback;
}

export const login = (credenciais) => api.post('/login', credenciais);
export const listarUsuarios = () => api.get('/usuarios');
export const listarBairros = () => api.get('/bairros');
export const listarEspecialidades = () => api.get('/especialidades');
export const listarPacientes = () => api.get('/pacientes');
export const obterPaciente = (pacienteId) => api.get(`/pacientes/${pacienteId}`);
export const obterHistoricoPaciente = (pacienteId) => api.get(`/pacientes/${pacienteId}/historico`);
export const listarUnidades = (params = {}) => api.get('/unidades', { params });
export const obterUnidade = (unidadeId) => api.get(`/unidades/${unidadeId}`);
export const criarPaciente = (paciente) => api.post('/pacientes', paciente);
export const atualizarPaciente = (pacienteId, paciente) => api.put(`/pacientes/${pacienteId}`, paciente);
export const criarTriagem = (triagem) => api.post('/triagem', triagem);
export const obterTriagem = (triagemId) => api.get(`/triagem/${triagemId}`);
export const obterMetadadosTriagem = () => api.get('/triagem/metadados');
export const listarFila = (params = {}) => api.get('/fila', { params });
export const entrarNaFila = (entrada) => api.post('/fila/entrar', entrada);
export const chamarProximo = (payload = {}) => api.post('/fila/chamar-proximo', payload);
export const atualizarStatusFila = (atendimentoId, status) => api.put(`/fila/${atendimentoId}/status`, { status });
export const obterFilaPaciente = (pacienteId) => api.get(`/fila/paciente/${pacienteId}`);
export const listarAtendimentos = (params = {}) => api.get('/atendimentos', { params });
export const obterAtendimento = (atendimentoId) => api.get(`/atendimentos/${atendimentoId}`);
export const registrarResultadoAtendimento = (atendimentoId, resultado) => api.post(`/atendimentos/${atendimentoId}/resultado`, resultado);
export const finalizarAtendimento = (atendimentoId) => api.put(`/atendimentos/${atendimentoId}/finalizar`);
export const listarProfissionais = () => api.get('/profissionais');
export const listarPacientesEncaminhados = () => api.get('/profissionais/pacientes-encaminhados');
export const obterDashboard = () => api.get('/dashboard');

export default api;
