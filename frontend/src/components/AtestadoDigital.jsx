import { formatarDataHora } from '../utils/formatters.js';

function AtestadoDigital({ atestado }) {
  if (!atestado) return null;

  return (
    <div className="rounded-lg border-l-4 border-l-vittas-blue bg-white p-4 shadow-sm ring-1 ring-slate-100">
      <p className="text-xs font-bold uppercase text-vittas-blue">Atestado digital - VITTAS</p>
      <div className="mt-3 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
        <p><span className="font-semibold">Paciente:</span> {atestado.paciente}</p>
        <p><span className="font-semibold">CPF:</span> {atestado.cpf}</p>
        <p><span className="font-semibold">Data:</span> {formatarDataHora(atestado.dataAtendimento)}</p>
        <p><span className="font-semibold">Unidade:</span> {atestado.unidade}</p>
        <p><span className="font-semibold">Profissional:</span> {atestado.profissional}</p>
        <p><span className="font-semibold">Dias:</span> {atestado.diasAfastamento}</p>
      </div>
      <p className="mt-3 text-sm"><span className="font-semibold">Observacao/CID:</span> {atestado.cidObservacao || 'Nao informado'}</p>
      <p className="mt-2 text-sm"><span className="font-semibold">Orientacao:</span> {atestado.orientacao}</p>
      <p className="mt-3 rounded-lg bg-vittas-gray px-3 py-2 text-xs font-medium text-slate-600">{atestado.aviso}</p>
    </div>
  );
}

export default AtestadoDigital;
