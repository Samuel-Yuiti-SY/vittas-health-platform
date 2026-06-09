import { MapPin } from 'lucide-react';

import Card from './Card.jsx';

function UnidadeCard({ unidade, especialidade }) {
  if (!unidade) return null;

  return (
    <Card>
      <div className="flex gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-vittas-blueSoft text-vittas-blue">
          <MapPin size={20} aria-hidden="true" />
        </span>
        <div>
          <p className="text-xs font-bold uppercase text-vittas-green">{unidade.tipo}</p>
          <h2 className="mt-1 text-lg font-bold text-vittas-navy">{unidade.nome}</h2>
          <p className="mt-1 text-sm text-vittas-muted">{unidade.endereco}</p>
          <p className="mt-1 text-sm text-vittas-muted">{unidade.bairro}</p>
          {especialidade && <p className="mt-2 text-sm font-semibold text-vittas-blue">{especialidade}</p>}
        </div>
      </div>
    </Card>
  );
}

export default UnidadeCard;
