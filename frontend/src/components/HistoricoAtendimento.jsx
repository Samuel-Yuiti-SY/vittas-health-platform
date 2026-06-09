import AtestadoDigital from './AtestadoDigital.jsx';
import Card from './Card.jsx';
import StatusBadge from './StatusBadge.jsx';
import { formatarDataHora } from '../utils/formatters.js';

function HistoricoAtendimento({ historico = [] }) {
  if (!historico.length) {
    return <p className="rounded-lg bg-white px-4 py-3 text-sm text-slate-600 ring-1 ring-slate-100">Nenhum historico registrado ainda.</p>;
  }

  return (
    <div className="space-y-3">
      {historico.map((item) => (
        <Card key={item.atendimentoId}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="font-semibold text-vittas-navy">{item.unidade}</p>
              <p className="text-sm text-slate-500">{formatarDataHora(item.data)}</p>
            </div>
            <StatusBadge status={item.classificacao} />
          </div>
          {item.resultado && <p className="mt-3 text-sm"><span className="font-semibold">Resumo:</span> {item.resultado}</p>}
          {item.orientacao && <p className="mt-2 text-sm"><span className="font-semibold">Orientacao:</span> {item.orientacao}</p>}
          {item.medicacao && <p className="mt-2 text-sm"><span className="font-semibold">Medicacao:</span> {item.medicacao}</p>}
          {item.intervaloMedicacao && <p className="mt-2 text-sm"><span className="font-semibold">Intervalo:</span> {item.intervaloMedicacao}</p>}
          {(item.dataRetorno || item.horarioRetorno) && (
            <p className="mt-2 text-sm">
              <span className="font-semibold">Retorno:</span> {item.dataRetorno || 'data nao informada'} {item.horarioRetorno || ''}
            </p>
          )}
          {item.atestadoDigital && <div className="mt-3"><AtestadoDigital atestado={item.atestadoDigital} /></div>}
        </Card>
      ))}
    </div>
  );
}

export default HistoricoAtendimento;
