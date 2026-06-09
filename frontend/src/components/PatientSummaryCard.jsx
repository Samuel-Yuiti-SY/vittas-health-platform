import { CalendarDays, IdCard, MapPin, Phone, UserRound } from 'lucide-react';

import { formatarData, mascararCpf } from '../utils/formatters.js';

function PatientSummaryCard({ paciente, title = 'Dados do paciente' }) {
  if (!paciente) {
    return (
      <div className="rounded-lg border border-vittas-border bg-white p-4 shadow-sm">
        <p className="font-bold text-vittas-navy">{title}</p>
        <p className="mt-2 text-sm leading-6 text-vittas-muted">Informe nome e bairro para personalizar o fluxo.</p>
      </div>
    );
  }

  const linhas = [
    { label: paciente.nome || 'Nome nao informado', icon: UserRound },
    { label: paciente.bairro || 'Bairro nao informado', icon: MapPin },
    { label: mascararCpf(paciente.cpf), icon: IdCard },
    { label: paciente.telefone || 'Telefone nao informado', icon: Phone },
    { label: paciente.dataNascimento ? formatarData(paciente.dataNascimento) : `${paciente.idade || '-'} anos`, icon: CalendarDays },
  ];

  return (
    <div className="rounded-lg border border-vittas-border bg-white p-4 shadow-sm">
      <p className="font-bold text-vittas-navy">{title}</p>
      <div className="mt-3 grid gap-2 text-sm text-vittas-muted">
        {linhas.map(({ icon: Icon, label }) => (
          <p className="flex items-center gap-2" key={label}>
            <Icon className="h-4 w-4 text-vittas-blue" aria-hidden="true" />
            <span className="min-w-0 truncate">{label}</span>
          </p>
        ))}
      </div>
    </div>
  );
}

export default PatientSummaryCard;
