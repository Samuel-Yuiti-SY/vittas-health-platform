import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, ArrowLeft, CheckCircle2, ClipboardList, MapPin, Send, UserRound } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  atualizarPaciente,
  criarTriagem,
  listarEspecialidades,
  listarPacientes,
  obterMensagemErro,
  obterMetadadosTriagem,
  obterUnidade,
} from '../api/api.js';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import PageHeader from '../components/PageHeader.jsx';
import PatientSummaryCard from '../components/PatientSummaryCard.jsx';
import SectionTitle from '../components/SectionTitle.jsx';
import { bairrosMaringa } from '../data/bairros.js';
import {
  obterPacienteAtual,
  salvarPacienteAtual,
  salvarResultadoTriagem,
  usuarioAtual,
} from '../utils/formatters.js';

const sintomasPadrao = [
  'Febre',
  'Dor de cabeca',
  'Tosse',
  'Dor abdominal',
  'Nausea ou vomito',
  'Falta de ar',
  'Sangramento',
  'Desmaio',
  'Convulsao',
  'Suspeita de AVC',
  'Acidente',
  'Dor no peito',
  'Consulta de rotina',
  'Retorno',
  'Vacinacao',
];

const estadoInicial = {
  sintomas: [],
  inicioSintomas: '',
  verificouFebre: false,
  faltaArIntensa: false,
  desmaio: false,
  convulsao: false,
  sangramentoIntenso: false,
  acidenteGrave: false,
  suspeitaAvc: false,
  gestante: false,
  prioridade: 'nao',
  especialidadeDesejada: 'Clinico Geral',
};

const etapas = [
  { id: 'sintomas', pergunta: 'Quais sintomas voce esta sentindo?' },
  { id: 'inicioSintomas', pergunta: 'Desde quando esta com esses sintomas?' },
  { id: 'verificouFebre', pergunta: 'Verificou se houve febre?' },
  { id: 'faltaArIntensa', pergunta: 'Voce esta com falta de ar intensa?' },
  { id: 'desmaio', pergunta: 'Voce teve desmaio?' },
  { id: 'convulsao', pergunta: 'Voce teve convulsao?' },
  { id: 'sangramentoIntenso', pergunta: 'Voce esta com sangramento intenso?' },
  { id: 'acidenteGrave', pergunta: 'Voce sofreu algum acidente grave?' },
  { id: 'suspeitaAvc', pergunta: 'Existe suspeita de AVC?' },
  { id: 'gestante', pergunta: 'Voce e gestante?' },
  { id: 'prioridade', pergunta: 'Voce e crianca, idoso ou possui alguma prioridade?' },
  { id: 'especialidadeDesejada', pergunta: 'Voce deseja atendimento para alguma especialidade?' },
];

const respostasPrioridade = [
  { label: 'Nao', value: 'nao' },
  { label: 'Crianca', value: 'crianca' },
  { label: 'Idoso', value: 'idoso' },
  { label: 'Outra prioridade', value: 'outra' },
];

const mensagemDorPeito =
  'A dor no peito pode ter varias causas e deve ser avaliada por um profissional de saude. Se estiver associada a falta de ar intensa, desmaio, suor frio ou piora rapida, procure atendimento imediato.';

function Escolha({ ativo, children, onClick }) {
  return (
    <button
      className={`rounded-lg px-3 py-2 text-sm font-semibold ring-1 transition ${
        ativo
          ? 'bg-vittas-blue text-white ring-vittas-blue'
          : 'bg-white text-vittas-navy ring-vittas-border hover:ring-vittas-blue'
      }`}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

function respostaTexto(etapa, form) {
  const valor = form[etapa.id];
  if (etapa.id === 'sintomas') return form.sintomas.join(', ') || 'Nao informado';
  if (etapa.id === 'prioridade') return respostasPrioridade.find((item) => item.value === valor)?.label || 'Nao';
  if (etapa.id === 'especialidadeDesejada') return valor;
  if (typeof valor === 'boolean') return valor ? 'Sim' : 'Nao';
  return valor || 'Nao informado';
}

function PreTriagem() {
  const navigate = useNavigate();
  const location = useLocation();
  const usuario = usuarioAtual();
  const pacienteLocal = obterPacienteAtual();
  const [pacientes, setPacientes] = useState([]);
  const [especialidades, setEspecialidades] = useState(['Clinico Geral']);
  const [metadados, setMetadados] = useState({ opcoesSintomas: sintomasPadrao });
  const [form, setForm] = useState(estadoInicial);
  const [etapaAtual, setEtapaAtual] = useState(0);
  const [pacienteId, setPacienteId] = useState(
    location.state?.pacienteId || usuario?.pacienteId || pacienteLocal?.id || localStorage.getItem('vittas_paciente_id') || 1,
  );
  const [pacienteInfo, setPacienteInfo] = useState({
    id: location.state?.pacienteId || usuario?.pacienteId || pacienteLocal?.id || localStorage.getItem('vittas_paciente_id') || 1,
    nome: pacienteLocal?.nome || usuario?.nome || '',
    bairro: pacienteLocal?.bairro || 'Centro',
    cpf: pacienteLocal?.cpf || '',
    telefone: pacienteLocal?.telefone || '',
  });
  const [identificacaoConfirmada, setIdentificacaoConfirmada] = useState(Boolean(pacienteLocal?.nome && pacienteLocal?.bairro));
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    async function carregar() {
      const [pacientesResp, especialidadesResp, metadadosResp] = await Promise.allSettled([
        listarPacientes(),
        listarEspecialidades(),
        obterMetadadosTriagem(),
      ]);

      if (pacientesResp.status === 'fulfilled') setPacientes(pacientesResp.value.data);
      if (especialidadesResp.status === 'fulfilled') setEspecialidades(especialidadesResp.value.data);
      if (metadadosResp.status === 'fulfilled') setMetadados(metadadosResp.value.data);
      if (pacientesResp.status === 'rejected') {
        setErro('Nao foi possivel carregar os pacientes simulados. Verifique se a API esta ativa.');
      }
    }
    carregar();
  }, []);

  const pacienteSelecionado = useMemo(
    () => pacientes.find((paciente) => String(paciente.id) === String(pacienteId)),
    [pacientes, pacienteId],
  );

  useEffect(() => {
    if (!pacienteSelecionado) return;
    const proximo = {
      id: pacienteSelecionado.id,
      nome: pacienteSelecionado.nome || '',
      bairro: pacienteSelecionado.bairro || 'Centro',
      cpf: pacienteSelecionado.cpf || '',
      telefone: pacienteSelecionado.telefone || '',
      dataNascimento: pacienteSelecionado.dataNascimento,
      idade: pacienteSelecionado.idade,
    };
    setPacienteInfo((atual) => ({ ...atual, ...proximo }));
    salvarPacienteAtual({ ...pacienteSelecionado, ...proximo });
    setIdentificacaoConfirmada(true);
  }, [pacienteSelecionado]);

  const pacienteParaResumo = useMemo(
    () => ({ ...(pacienteSelecionado || {}), ...pacienteInfo, id: pacienteId }),
    [pacienteId, pacienteInfo, pacienteSelecionado],
  );

  const etapa = etapas[etapaAtual];
  const finalizado = etapaAtual >= etapas.length;
  const progresso = finalizado ? etapas.length : etapaAtual + 1;
  const etapasRespondidas = etapas.slice(0, Math.min(etapaAtual, etapas.length));

  function atualizarPacienteInfo(event) {
    const { name, value } = event.target;
    setPacienteInfo((atual) => ({ ...atual, [name]: value }));
    setIdentificacaoConfirmada(false);
  }

  function confirmarIdentificacao() {
    if (!pacienteInfo.nome.trim() || !pacienteInfo.bairro) {
      setErro('Informe nome e bairro do paciente antes de iniciar a pre-triagem.');
      return;
    }
    const paciente = { ...pacienteParaResumo, nome: pacienteInfo.nome.trim(), bairro: pacienteInfo.bairro };
    salvarPacienteAtual(paciente);
    setIdentificacaoConfirmada(true);
    setErro('');
  }

  function selecionarPaciente(event) {
    const id = event.target.value;
    setPacienteId(id);
    const paciente = pacientes.find((item) => String(item.id) === String(id));
    if (paciente) {
      setPacienteInfo({
        id: paciente.id,
        nome: paciente.nome || '',
        bairro: paciente.bairro || 'Centro',
        cpf: paciente.cpf || '',
        telefone: paciente.telefone || '',
        dataNascimento: paciente.dataNascimento,
        idade: paciente.idade,
      });
      salvarPacienteAtual(paciente);
      setIdentificacaoConfirmada(true);
    }
  }

  function proximaEtapa() {
    setErro('');
    setEtapaAtual((atual) => Math.min(atual + 1, etapas.length));
  }

  function etapaAnterior() {
    setErro('');
    setEtapaAtual((atual) => Math.max(atual - 1, 0));
  }

  function alternarSintoma(sintoma) {
    setForm((atual) => ({
      ...atual,
      sintomas: atual.sintomas.includes(sintoma)
        ? atual.sintomas.filter((item) => item !== sintoma)
        : [...atual.sintomas, sintoma],
    }));
  }

  function confirmarEtapaTexto() {
    if (!identificacaoConfirmada) {
      setErro('Confirme os dados do paciente antes de responder a pre-triagem.');
      return;
    }
    if (etapa.id === 'sintomas' && !form.sintomas.length) {
      setErro('Selecione pelo menos um sintoma para continuar.');
      return;
    }
    if (etapa.id === 'inicioSintomas' && !form.inicioSintomas.trim()) {
      setErro('Informe desde quando esta com os sintomas.');
      return;
    }
    proximaEtapa();
  }

  function responderBooleano(campo, valor) {
    if (!identificacaoConfirmada) {
      setErro('Confirme os dados do paciente antes de responder a pre-triagem.');
      return;
    }
    setForm((atual) => ({ ...atual, [campo]: valor }));
    proximaEtapa();
  }

  function responderPrioridade(valor) {
    setForm((atual) => ({ ...atual, prioridade: valor }));
    proximaEtapa();
  }

  async function sincronizarPaciente() {
    const paciente = {
      ...(pacienteSelecionado || {}),
      ...pacienteInfo,
      id: Number(pacienteId),
      nome: pacienteInfo.nome.trim(),
      bairro: pacienteInfo.bairro,
    };
    salvarPacienteAtual(paciente);
    if (pacienteId) {
      await atualizarPaciente(Number(pacienteId), {
        nome: paciente.nome,
        bairro: paciente.bairro,
        cpf: paciente.cpf,
        telefone: paciente.telefone,
      });
    }
    return paciente;
  }

  async function enviarTriagem() {
    setErro('');

    if (!pacienteId) {
      setErro('Selecione um paciente para continuar.');
      return;
    }
    if (!identificacaoConfirmada) {
      setErro('Confirme nome e bairro antes de finalizar.');
      return;
    }

    setCarregando(true);
    try {
      const paciente = await sincronizarPaciente();
      const payload = {
        pacienteId: Number(pacienteId),
        sintomas: form.sintomas,
        inicioSintomas: form.inicioSintomas,
        verificouFebre: form.verificouFebre,
        faltaArIntensa: form.faltaArIntensa,
        desmaio: form.desmaio,
        convulsao: form.convulsao,
        sangramentoIntenso: form.sangramentoIntenso,
        acidenteGrave: form.acidenteGrave,
        suspeitaAvc: form.suspeitaAvc,
        gestante: form.gestante,
        crianca: form.prioridade === 'crianca',
        idoso: form.prioridade === 'idoso' || paciente?.idade >= 60,
        condicaoPrioritaria: form.prioridade === 'outra',
        especialidadeDesejada: form.especialidadeDesejada,
      };
      const { data: triagem } = await criarTriagem(payload);
      const unidade = triagem.unidadeRecomendada || (await obterUnidade(triagem.unidadeRecomendadaId)).data;
      salvarResultadoTriagem({ triagem, unidade, paciente });
      navigate('/resultado-triagem');
    } catch (error) {
      setErro(obterMensagemErro(error, 'Nao foi possivel concluir a triagem. Confira se o back-end esta rodando.'));
    } finally {
      setCarregando(false);
    }
  }

  function renderControles() {
    if (!identificacaoConfirmada) {
      return (
        <div className="rounded-lg bg-vittas-warningSoft p-4 text-sm font-semibold leading-6 text-yellow-900">
          Confirme os dados do paciente para liberar as perguntas da pre-triagem.
        </div>
      );
    }

    if (!etapa) {
      return (
        <div className="space-y-4">
          <p className="text-sm leading-6 text-vittas-muted">
            Revise as respostas e envie para calcular a classificacao simulada de prioridade.
          </p>
          <Button className="w-full" disabled={carregando} onClick={enviarTriagem}>
            <Send size={18} aria-hidden="true" />
            {carregando ? 'Enviando...' : 'Finalizar pre-triagem'}
          </Button>
        </div>
      );
    }

    if (etapa.id === 'sintomas') {
      return (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {(metadados.opcoesSintomas || sintomasPadrao).map((sintoma) => (
              <Escolha
                ativo={form.sintomas.includes(sintoma)}
                key={sintoma}
                onClick={() => alternarSintoma(sintoma)}
              >
                {sintoma}
              </Escolha>
            ))}
          </div>
          <Button className="w-full" onClick={confirmarEtapaTexto}>
            <CheckCircle2 size={18} aria-hidden="true" />
            Confirmar sintomas
          </Button>
        </div>
      );
    }

    if (etapa.id === 'inicioSintomas') {
      return (
        <div className="space-y-4">
          <input
            className="w-full rounded-lg border border-vittas-border px-3 py-3 text-sm outline-none focus:border-vittas-blue focus:ring-2 focus:ring-blue-100"
            onChange={(event) => setForm((atual) => ({ ...atual, inicioSintomas: event.target.value }))}
            placeholder="Ex: ha 2 dias, desde ontem, retorno de rotina"
            value={form.inicioSintomas}
          />
          <Button className="w-full" onClick={confirmarEtapaTexto}>
            <CheckCircle2 size={18} aria-hidden="true" />
            Confirmar resposta
          </Button>
        </div>
      );
    }

    if (etapa.id === 'prioridade') {
      return (
        <div className="grid gap-2 sm:grid-cols-2">
          {respostasPrioridade.map((item) => (
            <Button key={item.value} onClick={() => responderPrioridade(item.value)} variant={form.prioridade === item.value ? 'primary' : 'ghost'}>
              {item.label}
            </Button>
          ))}
        </div>
      );
    }

    if (etapa.id === 'especialidadeDesejada') {
      return (
        <div className="space-y-4">
          <select
            className="w-full rounded-lg border border-vittas-border px-3 py-3 text-sm outline-none focus:border-vittas-blue focus:ring-2 focus:ring-blue-100"
            onChange={(event) => setForm((atual) => ({ ...atual, especialidadeDesejada: event.target.value }))}
            value={form.especialidadeDesejada}
          >
            {especialidades.map((especialidade) => (
              <option key={especialidade} value={especialidade}>
                {especialidade}
              </option>
            ))}
          </select>
          <Button className="w-full" onClick={proximaEtapa}>
            <CheckCircle2 size={18} aria-hidden="true" />
            Confirmar especialidade
          </Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 gap-3">
        <Button onClick={() => responderBooleano(etapa.id, true)}>Sim</Button>
        <Button onClick={() => responderBooleano(etapa.id, false)} variant="ghost">
          Nao
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6">
      <PageHeader
        description="O Vitti orienta uma pre-triagem inicial, sem diagnostico e sem substituir avaliacao profissional."
        eyebrow="Pre-triagem"
        title="Atendimento inicial assistido"
      />

      <div className="mt-6 grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
        <section className="space-y-4">
          <Card>
            <SectionTitle
              description="Confirme o paciente e o bairro antes das perguntas. O bairro influencia a unidade recomendada pelo backend."
              eyebrow="Identificacao"
              title="Dados do paciente"
            />

            <div className="mt-4 grid gap-3">
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-vittas-navy">Paciente simulado</span>
                <select
                  className="w-full rounded-lg border border-vittas-border px-3 py-3 text-sm outline-none focus:border-vittas-blue focus:ring-2 focus:ring-blue-100"
                  onChange={selecionarPaciente}
                  value={pacienteId}
                >
                  {pacientes.map((paciente) => (
                    <option key={paciente.id} value={paciente.id}>
                      {paciente.nome} - {paciente.bairro}
                    </option>
                  ))}
                  {!pacientes.length && <option value={pacienteId}>Paciente atual</option>}
                </select>
              </label>

              <label className="block">
                <span className="mb-1 flex items-center gap-2 text-sm font-semibold text-vittas-navy">
                  <UserRound size={16} aria-hidden="true" />
                  Nome do paciente
                </span>
                <input
                  className="w-full rounded-lg border border-vittas-border px-3 py-3 text-sm outline-none focus:border-vittas-blue focus:ring-2 focus:ring-blue-100"
                  name="nome"
                  onChange={atualizarPacienteInfo}
                  value={pacienteInfo.nome}
                />
              </label>

              <label className="block">
                <span className="mb-1 flex items-center gap-2 text-sm font-semibold text-vittas-navy">
                  <MapPin size={16} aria-hidden="true" />
                  Bairro
                </span>
                <select
                  className="w-full rounded-lg border border-vittas-border px-3 py-3 text-sm outline-none focus:border-vittas-blue focus:ring-2 focus:ring-blue-100"
                  name="bairro"
                  onChange={atualizarPacienteInfo}
                  value={pacienteInfo.bairro}
                >
                  {bairrosMaringa.map((bairro) => (
                    <option key={bairro} value={bairro}>
                      {bairro}
                    </option>
                  ))}
                </select>
              </label>

              <Button onClick={confirmarIdentificacao} variant={identificacaoConfirmada ? 'secondary' : 'primary'}>
                <CheckCircle2 size={18} aria-hidden="true" />
                {identificacaoConfirmada ? 'Dados confirmados' : 'Confirmar dados'}
              </Button>
            </div>
          </Card>

          <PatientSummaryCard paciente={pacienteParaResumo} title="Resumo para atendimento" />

          <Card className="bg-vittas-blueSoft">
            <p className="flex items-center gap-2 text-sm font-bold text-vittas-navy">
              <ClipboardList size={18} aria-hidden="true" />
              Mensagem do Vitti
            </p>
            <p className="mt-2 text-sm leading-6 text-vittas-muted">
              Vou fazer algumas perguntas para organizar o atendimento. Em sintomas graves, procure ajuda imediata.
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <Card>
            <div className="mb-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase text-vittas-green">
                    Etapa {progresso} de {etapas.length}
                  </p>
                  <h2 className="mt-1 text-xl font-extrabold text-vittas-navy">
                    {finalizado ? 'Resumo da pre-triagem' : etapa.pergunta}
                  </h2>
                </div>
                {etapaAtual > 0 && (
                  <button
                    className="rounded-lg bg-vittas-slate p-2 text-vittas-navy ring-1 ring-vittas-border"
                    onClick={etapaAnterior}
                    title="Voltar etapa"
                    type="button"
                  >
                    <ArrowLeft size={18} aria-hidden="true" />
                  </button>
                )}
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-vittas-slate">
                <div className="h-full rounded-full bg-vittas-green" style={{ width: `${(progresso / etapas.length) * 100}%` }} />
              </div>
            </div>

            {renderControles()}

            {erro && (
              <p className="mt-4 flex gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-vittas-danger">
                <AlertTriangle size={18} aria-hidden="true" />
                {erro}
              </p>
            )}
          </Card>

          <Card>
            <p className="font-bold text-vittas-navy">Respostas registradas</p>
            <div className="mt-3 grid gap-2">
              {etapasRespondidas.map((item) => (
                <div className="rounded-lg bg-vittas-slate p-3" key={item.id}>
                  <p className="text-xs font-bold uppercase text-vittas-muted">{item.pergunta}</p>
                  <p className="mt-1 text-sm font-semibold text-vittas-navy">{respostaTexto(item, form)}</p>
                </div>
              ))}
              {!etapasRespondidas.length && (
                <p className="text-sm leading-6 text-vittas-muted">As respostas aparecerao aqui conforme a pre-triagem avancar.</p>
              )}
            </div>
          </Card>

          {form.sintomas.includes('Dor no peito') && (
            <Card className="border-yellow-200 bg-vittas-warningSoft">
              <p className="font-bold text-yellow-900">Atencao sobre dor no peito</p>
              <p className="mt-2 text-sm leading-6 text-yellow-900">{mensagemDorPeito}</p>
            </Card>
          )}

          <Card className="bg-vittas-slate">
            <p className="text-sm font-semibold leading-6 text-vittas-navy">
              MVP academico com informacoes simuladas. A classificacao nao substitui avaliacao medica profissional.
            </p>
          </Card>
        </section>
      </div>
    </div>
  );
}

export default PreTriagem;
