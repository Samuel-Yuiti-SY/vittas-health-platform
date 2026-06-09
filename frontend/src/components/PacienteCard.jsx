import Card from './Card.jsx';
import { mascararCpf } from '../utils/formatters.js';

function PacienteCard({ paciente }) {
  if (!paciente) return null;

  return (
    <Card>
      <p className="text-xs font-bold uppercase text-vittas-green">Paciente</p>
      <h2 className="mt-2 text-xl font-bold text-vittas-navy">{paciente.nome}</h2>
      <div className="mt-3 grid gap-2 text-sm text-vittas-muted sm:grid-cols-2">
        <p><span className="font-semibold">CPF:</span> {mascararCpf(paciente.cpf)}</p>
        <p><span className="font-semibold">Idade:</span> {paciente.idade} anos</p>
        <p><span className="font-semibold">Bairro:</span> {paciente.bairro}</p>
        <p><span className="font-semibold">Telefone:</span> {paciente.telefone}</p>
      </div>
    </Card>
  );
}

export default PacienteCard;
