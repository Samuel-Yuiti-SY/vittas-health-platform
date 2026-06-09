export const appRoutes = [
  {
    path: '/',
    label: 'Inicio',
  },
  {
    path: '/login',
    label: 'Login',
  },
  {
    path: '/cadastro',
    label: 'Cadastro',
  },
  {
    path: '/pre-triagem',
    label: 'Pre-triagem',
  },
  {
    path: '/resultado-triagem',
    label: 'Resultado da triagem',
  },
  {
    path: '/fila-paciente',
    label: 'Fila virtual',
  },
  {
    path: '/painel-funcionario',
    label: 'Painel funcionario',
  },
  {
    path: '/painel-profissional',
    label: 'Painel profissional',
  },
  {
    path: '/dashboard',
    label: 'Dashboard',
  },
];

export const perfilRedirects = {
  paciente: '/pre-triagem',
  funcionario: '/painel-funcionario',
  admin: '/dashboard',
  profissional: '/painel-profissional',
};
