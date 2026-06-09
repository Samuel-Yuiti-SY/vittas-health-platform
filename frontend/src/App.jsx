import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';

import BottomNav from './components/BottomNav.jsx';
import Header from './components/Header.jsx';
import CadastroPaciente from './pages/CadastroPaciente.jsx';
import Dashboard from './pages/Dashboard.jsx';
import FilaPaciente from './pages/FilaPaciente.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import PainelFuncionario from './pages/PainelFuncionario.jsx';
import PainelProfissionalSaude from './pages/PainelProfissionalSaude.jsx';
import PreTriagem from './pages/PreTriagem.jsx';
import ResultadoTriagem from './pages/ResultadoTriagem.jsx';

function AppShell() {
  const location = useLocation();
  const publicRoutes = new Set(['/', '/login', '/cadastro']);
  const isPublicRoute = publicRoutes.has(location.pathname);

  return (
    <div className="min-h-screen bg-vittas-gray text-vittas-text">
      {!isPublicRoute && <Header />}
      <main className={isPublicRoute ? '' : 'pb-24 md:pb-8'}>
        <Routes>
          <Route element={<Home />} path="/" />
          <Route element={<Login />} path="/login" />
          <Route element={<CadastroPaciente />} path="/cadastro" />
          <Route element={<PreTriagem />} path="/pre-triagem" />
          <Route element={<ResultadoTriagem />} path="/resultado-triagem" />
          <Route element={<FilaPaciente />} path="/fila-paciente" />
          <Route element={<PainelFuncionario />} path="/painel-funcionario" />
          <Route element={<PainelProfissionalSaude />} path="/painel-profissional" />
          <Route element={<Dashboard />} path="/dashboard" />
          <Route element={<Navigate replace to="/" />} path="*" />
        </Routes>
      </main>
      {!isPublicRoute && <BottomNav />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}

export default App;
