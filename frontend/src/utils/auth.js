const USUARIO_KEY = 'usuarioLogado';
const LEGACY_USUARIO_KEY = 'vittas_usuario';

export function salvarUsuario(usuario) {
  localStorage.setItem(USUARIO_KEY, JSON.stringify(usuario));
  localStorage.setItem(LEGACY_USUARIO_KEY, JSON.stringify(usuario));
}

export function obterUsuario() {
  const usuario = localStorage.getItem(USUARIO_KEY) || localStorage.getItem(LEGACY_USUARIO_KEY);
  if (!usuario) return null;

  try {
    return JSON.parse(usuario);
  } catch {
    removerUsuario();
    return null;
  }
}

export function removerUsuario() {
  localStorage.removeItem(USUARIO_KEY);
  localStorage.removeItem(LEGACY_USUARIO_KEY);
}

export function obterPerfilUsuario() {
  const usuario = obterUsuario();
  return usuario?.perfil || usuario?.tipo || null;
}
