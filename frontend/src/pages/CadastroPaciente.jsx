import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, MapPin, Save, UserRound } from 'lucide-react';

import { criarPaciente } from '../api/api.js';
import { bairrosMaringa } from '../data/bairros.js';
import Button from '../components/Button.jsx';
import InstitutionalHeader from '../components/InstitutionalHeader.jsx';
import PageHeader from '../components/PageHeader.jsx';
import PublicFooter from '../components/PublicFooter.jsx';
import SectionTitle from '../components/SectionTitle.jsx';
import { salvarUsuario } from '../utils/auth.js';
import { salvarPacienteAtual } from '../utils/formatters.js';

const estadoInicial = {
  nome: '',
  cpf: '',
  dataNascimento: '',
  telefone: '',
  email: '',
  senha: '',
  bairro: 'Centro',
  endereco: '',
  cartaoSus: '',
  historicoMedico: '',
  alergias: '',
  medicamentosUsoContinuo: '',
  contatoEmergencia: '',
};

function calcularIdade(dataNascimento) {
  if (!dataNascimento) return '';
  const nascimento = new Date(`${dataNascimento}T00:00:00`);
  if (Number.isNaN(nascimento.getTime())) return '';
  const hoje = new Date();
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const aniversarioPassou =
    hoje.getMonth() > nascimento.getMonth()
    || (hoje.getMonth() === nascimento.getMonth() && hoje.getDate() >= nascimento.getDate());
  if (!aniversarioPassou) idade -= 1;
  return idade >= 0 ? idade : '';
}

function Field({ label, name, onChange, required = false, type = 'text', value, ...props }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-vittas-navy">
        {label}
        {required && <span className="text-vittas-danger"> *</span>}
      </span>
      <input
        className="w-full rounded-lg border border-vittas-border bg-white px-3 py-3 text-sm outline-none focus:border-vittas-blue focus:ring-2 focus:ring-blue-100"
        name={name}
        onChange={onChange}
        required={required}
        type={type}
        value={value}
        {...props}
      />
    </label>
  );
}

function TextArea({ label, name, onChange, value }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-vittas-navy">{label}</span>
      <textarea
        className="min-h-24 w-full rounded-lg border border-vittas-border bg-white px-3 py-3 text-sm outline-none focus:border-vittas-blue focus:ring-2 focus:ring-blue-100"
        name={name}
        onChange={onChange}
        value={value}
      />
    </label>
  );
}

function FormSection({ children, description, icon: Icon, title }) {
  return (
    <section className="rounded-lg border border-vittas-border bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-start gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-vittas-blueSoft text-vittas-blue">
          <Icon size={20} aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-bold text-vittas-navy">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-vittas-muted">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function CadastroPaciente() {
  const navigate = useNavigate();
  const [form, setForm] = useState(estadoInicial);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);
  const idade = useMemo(() => calcularIdade(form.dataNascimento), [form.dataNascimento]);

  function atualizarCampo(event) {
    const { name, value } = event.target;
    setForm((atual) => ({ ...atual, [name]: value }));
  }

  function montarPayload() {
    const sufixo = String(Date.now()).slice(-2).padStart(2, '0');
    return {
      nome: form.nome.trim(),
      cpf: form.cpf.trim() || `000.000.000-${sufixo}`,
      dataNascimento: form.dataNascimento || '1990-01-01',
      telefone: form.telefone.trim() || '(44) 99999-9999',
      email: form.email.trim(),
      senha: form.senha,
      bairro: form.bairro,
      endereco: form.endereco.trim() || `Endereco nao informado - ${form.bairro}`,
      cartaoSus: form.cartaoSus.trim() || '000000000000000',
      historicoMedico: form.historicoMedico.trim() || 'Nao informado',
      alergias: form.alergias.trim() || 'Nao informado',
      medicamentosUsoContinuo: form.medicamentosUsoContinuo.trim() || 'Nao informado',
      contatoEmergencia: form.contatoEmergencia.trim() || 'Nao informado',
    };
  }

  async function enviarCadastro(event) {
    event.preventDefault();
    setSalvando(true);
    setErro('');
    setMensagem('');

    try {
      const payload = montarPayload();
      const { data } = await criarPaciente(payload);
      salvarPacienteAtual(data);
      salvarUsuario({
        id: data.id,
        nome: data.nome,
        email: data.email,
        perfil: 'paciente',
        pacienteId: data.id,
      });
      setMensagem('Cadastro salvo. Vamos iniciar a pre-triagem com seus dados.');
      setTimeout(() => {
        navigate('/pre-triagem', { state: { pacienteId: data.id } });
      }, 700);
    } catch (error) {
      const detalhe = error.response?.data?.detail || error.mensagemAmigavel || 'Nao foi possivel salvar. Confira se o back-end esta rodando.';
      setErro(detalhe);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="min-h-screen bg-vittas-gray">
      <InstitutionalHeader />

      <main className="mx-auto w-full max-w-6xl px-4 py-8">
        <PageHeader
          description="O cadastro inicial guarda os dados necessarios para o MVP calcular a pre-triagem e recomendar a unidade com base no bairro."
          eyebrow="Novo paciente"
          title="Cadastro do paciente"
        />

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <aside className="space-y-4">
            <section className="rounded-lg border border-vittas-border bg-white p-5 shadow-sm">
              <SectionTitle
                description="Nome, e-mail, senha e bairro sao os dados centrais desta etapa."
                eyebrow="Identificacao"
                title="Dados que orientam o fluxo"
              />
              <div className="mt-5 space-y-3 text-sm leading-6 text-vittas-muted">
                <p className="rounded-lg bg-vittas-blueSoft p-3 font-semibold text-vittas-navy">
                  O bairro escolhido sera usado na pre-triagem para aproximar a unidade recomendada.
                </p>
                <p className="rounded-lg bg-vittas-warningSoft p-3 font-semibold text-yellow-900">
                  MVP academico com dados simulados. Nao use dados reais sensiveis.
                </p>
              </div>
            </section>

            <section className="rounded-lg border border-vittas-border bg-white p-5 shadow-sm">
              <p className="text-sm font-bold uppercase text-vittas-green">Resumo</p>
              <div className="mt-4 grid gap-3 text-sm text-vittas-muted">
                <p><span className="font-semibold text-vittas-navy">Paciente:</span> {form.nome || 'Nao informado'}</p>
                <p><span className="font-semibold text-vittas-navy">Bairro:</span> {form.bairro}</p>
                <p><span className="font-semibold text-vittas-navy">Idade:</span> {idade || 'Nao informada'}</p>
              </div>
            </section>
          </aside>

          <form className="space-y-4" onSubmit={enviarCadastro}>
            <FormSection
              description="Identifique o paciente para acesso ao portal e historico simulado."
              icon={UserRound}
              title="Identificacao"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Nome completo" name="nome" onChange={atualizarCampo} required value={form.nome} />
                <Field label="CPF" name="cpf" onChange={atualizarCampo} placeholder="000.000.000-00" value={form.cpf} />
                <Field label="Data de nascimento" name="dataNascimento" onChange={atualizarCampo} type="date" value={form.dataNascimento} />
                <Field label="Numero do Cartao SUS" name="cartaoSus" onChange={atualizarCampo} value={form.cartaoSus} />
              </div>
            </FormSection>

            <FormSection
              description="O e-mail e a senha permitem acessar a area do paciente no MVP."
              icon={ClipboardList}
              title="Contato e acesso"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="E-mail" name="email" onChange={atualizarCampo} required type="email" value={form.email} />
                <Field label="Senha" name="senha" onChange={atualizarCampo} required type="password" value={form.senha} />
                <Field label="Telefone" name="telefone" onChange={atualizarCampo} placeholder="(44) 99999-9999" value={form.telefone} />
                <Field label="Contato de emergencia" name="contatoEmergencia" onChange={atualizarCampo} value={form.contatoEmergencia} />
              </div>
            </FormSection>

            <FormSection
              description="O bairro e usado pelo backend para ordenar unidades candidatas na recomendacao."
              icon={MapPin}
              title="Endereco"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block text-sm font-semibold text-vittas-navy">
                    Bairro <span className="text-vittas-danger">*</span>
                  </span>
                  <select
                    className="w-full rounded-lg border border-vittas-border bg-white px-3 py-3 text-sm outline-none focus:border-vittas-blue focus:ring-2 focus:ring-blue-100"
                    name="bairro"
                    onChange={atualizarCampo}
                    required
                    value={form.bairro}
                  >
                    {bairrosMaringa.map((bairro) => (
                      <option key={bairro} value={bairro}>
                        {bairro}
                      </option>
                    ))}
                  </select>
                </label>
                <Field label="Endereco" name="endereco" onChange={atualizarCampo} value={form.endereco} />
              </div>
            </FormSection>

            <FormSection
              description="Informacoes opcionais que aparecem no painel do profissional."
              icon={ClipboardList}
              title="Informacoes de saude"
            >
              <div className="grid gap-4 md:grid-cols-3">
                <TextArea label="Historico medico basico" name="historicoMedico" onChange={atualizarCampo} value={form.historicoMedico} />
                <TextArea label="Alergias" name="alergias" onChange={atualizarCampo} value={form.alergias} />
                <TextArea label="Medicamentos de uso continuo" name="medicamentosUsoContinuo" onChange={atualizarCampo} value={form.medicamentosUsoContinuo} />
              </div>
            </FormSection>

            {mensagem && <p className="rounded-lg bg-vittas-mint px-3 py-2 text-sm font-semibold text-vittas-greenDark">{mensagem}</p>}
            {erro && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-vittas-danger">{erro}</p>}

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button disabled={salvando} type="submit">
                <Save size={18} aria-hidden="true" />
                {salvando ? 'Salvando...' : 'Salvar e iniciar pre-triagem'}
              </Button>
              <Button to="/login" variant="ghost">
                Ja tenho acesso
              </Button>
            </div>
          </form>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}

export default CadastroPaciente;
