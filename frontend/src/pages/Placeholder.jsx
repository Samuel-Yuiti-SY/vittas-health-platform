import { Construction, Home } from 'lucide-react';

import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';

function Placeholder({ title, description }) {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-9rem)] w-full max-w-2xl items-center px-4 py-8">
      <Card className="w-full text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-vittas-mint text-vittas-navy">
          <Construction size={24} aria-hidden="true" />
        </span>
        <h1 className="mt-4 text-2xl font-bold text-vittas-navy">{title}</h1>
        <p className="mx-auto mt-2 max-w-md leading-7 text-slate-600">
          {description || 'Tela reservada para a proxima fase do MVP.'}
        </p>
        <div className="mt-5 flex justify-center">
          <Button to="/" variant="ghost">
            <Home size={18} aria-hidden="true" />
            Voltar ao inicio
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default Placeholder;
