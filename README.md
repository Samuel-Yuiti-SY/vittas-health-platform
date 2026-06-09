# VITTAS - MVP

MVP academico de uma plataforma digital para apoio ao atendimento em saude publica, com foco em pre-triagem, fila virtual, recomendacao de unidades de saude e painel de gestao.

O projeto foi desenvolvido como parte da segunda entrega da AEP, relacionado ao ODS 11 - Cidades e Comunidades Sustentaveis.

## Acesse o site

GitHub:

[link sera inserido apos publicar o repositorio]

Front-end na Vercel:

[link sera inserido apos deploy]

API no Render:

[link sera inserido apos deploy]

## Versao

Versao atual: 1.0.0

## Funcionalidades

- Login demonstrativo por perfil
- Cadastro de paciente
- Pre-triagem assistida pelo Vitti, com confirmacao de nome e bairro
- Classificacao de prioridade
- Recomendacao de UBS, UPA ou hospital
- Alerta de emergencia com botao para ligar 192
- Fila virtual com posicao e tempo estimado
- Painel do funcionario
- Painel profissional da saude
- Registro de orientacao, medicacao manual e atestado digital
- Dashboard administrativo
- Dados ficticios para demonstracao
- Visual institucional responsivo em azul, verde e branco

## Usuarios de teste

Paciente:

- e-mail: paciente@vittas.com.br
- senha: 123456

Funcionario:

- e-mail: funcionario@vittas.com.br
- senha: 123456

Administrador:

- e-mail: admin@vittas.com.br
- senha: 123456

Profissional da saude:

- e-mail: profissional@vittas.com.br
- senha: 123456

## Prints do sistema

Inserir prints apos rodar o projeto localmente ou apos o deploy:

- Home institucional
- Login com perfis de teste
- Cadastro do paciente
- Pre-triagem assistida
- Resultado da triagem
- Fila virtual
- Painel do funcionario
- Painel profissional
- Dashboard administrativo

## Tecnologias

### Front-End

- React 18
- Vite 6
- Tailwind CSS
- React Router DOM 6.30.1
- Axios
- lucide-react

### Back-End

- Python
- FastAPI
- Uvicorn
- Pydantic

### Deploy

- Vercel para o front-end
- Render para o back-end

## Como usar a versao publicada

1. Acesse o link da Vercel.
2. Clique em entrar.
3. Use um dos usuarios de teste.
4. Faca a pre-triagem.
5. Entre na fila.
6. Acesse os paineis com os outros perfis.

## Como rodar localmente

### Back-end

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

Acesse:

```txt
http://127.0.0.1:8000/docs
```

Health check:

```txt
http://127.0.0.1:8000/health
```

### Front-end

```bash
cd frontend
npm.cmd install
npm.cmd run dev -- --force
```

Para validar o build antes de abrir o navegador:

```bash
npm.cmd run build
```

Acesse:

```txt
http://127.0.0.1:5173
```

Rotas para teste rapido:

```txt
http://127.0.0.1:5173/
http://127.0.0.1:5173/login
http://127.0.0.1:5173/cadastro
http://127.0.0.1:5173/pre-triagem
http://127.0.0.1:5173/fila-paciente
http://127.0.0.1:5173/painel-funcionario
http://127.0.0.1:5173/painel-profissional
http://127.0.0.1:5173/dashboard
```

No Windows, tambem e possivel iniciar os dois servidores com:

```bat
iniciar_vittas.bat
```

## Variaveis de ambiente

### Front-end

Criar arquivo `frontend/.env.local`:

```txt
VITE_API_URL=http://127.0.0.1:8000
```

Em producao na Vercel, configurar:

```txt
VITE_API_URL=https://sua-api-render.onrender.com
```

### Back-end

No Render, configurar se necessario:

```txt
ALLOWED_ORIGINS=https://seu-front.vercel.app
```

Para mais de uma origem:

```txt
ALLOWED_ORIGINS=https://seu-front.vercel.app,https://outro-preview.vercel.app
```

## Estrutura principal

```txt
backend/
  main.py
  models.py
  database.py
  services/
  requirements.txt

frontend/
  src/
    components/
    pages/
    api/
    data/
    utils/
  package.json
  vercel.json
  .env.example
```

## Rotas do front-end

- `/`
- `/login`
- `/cadastro`
- `/pre-triagem`
- `/resultado-triagem`
- `/fila-paciente`
- `/painel-funcionario`
- `/painel-profissional`
- `/dashboard`

## Endpoints principais

- `GET /health`
- `POST /login`
- `GET /usuarios`
- `GET /pacientes`
- `POST /pacientes`
- `PUT /pacientes/{paciente_id}`
- `GET /unidades`
- `POST /triagem`
- `GET /fila`
- `POST /fila/entrar`
- `POST /fila/chamar-proximo`
- `PUT /fila/{atendimento_id}/status`
- `POST /atendimentos/{atendimento_id}/resultado`
- `PUT /atendimentos/{atendimento_id}/finalizar`
- `GET /dashboard`

## Estrutura de dados

O MVP utiliza uma fila de prioridade para organizar os pacientes considerando:

- classificacao da triagem
- score de prioridade
- idade
- gestante
- crianca
- sintomas graves
- ordem de chegada

## Orientacao a objetos

O projeto utiliza modelos como:

- Paciente
- Usuario
- Unidade de Saude
- Triagem
- Atendimento
- Profissional da Saude
- Fila de Atendimento

## Deploy

### Front-end na Vercel

Configuracoes recomendadas:

```txt
Framework Preset: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

Variavel de ambiente obrigatoria na Vercel:

```txt
VITE_API_URL=https://sua-api-render.onrender.com
```

O arquivo `frontend/vercel.json` ja possui rewrite para o React Router:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Back-end no Render

Configuracoes recomendadas:

```txt
Root Directory: backend
Build Command: pip install -r requirements.txt
Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
```

Variavel de ambiente recomendada no Render, depois que a Vercel gerar o link:

```txt
ALLOWED_ORIGINS=https://seu-front.vercel.app
```

Depois do deploy, testar:

```txt
https://sua-api-render.onrender.com/health
https://sua-api-render.onrender.com/docs
```

## Passo a passo de deploy

1. Subir o projeto no GitHub.
2. Criar Web Service no Render apontando para a pasta `backend`.
3. Copiar a URL da API gerada pelo Render.
4. Criar projeto na Vercel apontando para a pasta `frontend`.
5. Configurar `VITE_API_URL` na Vercel com a URL do Render.
6. Configurar `ALLOWED_ORIGINS` no Render com a URL da Vercel.
7. Fazer redeploy do back-end se necessario.
8. Testar login, pre-triagem e dashboard na URL publicada.

## GitHub

Nome sugerido do repositorio:

```txt
Vittas
```

ou:

```txt
VITTAS-MVP
```

Se o repositorio ainda nao existir e o GitHub CLI estiver configurado:

```bash
git init
git add .
git commit -m "feat: cria MVP funcional do VITTAS"
git branch -M main
gh repo create Samuel-Yuiti-SY/Vittas --public --source=. --remote=origin --push
```

Se o repositorio ja tiver sido criado manualmente:

```bash
git init
git add .
git commit -m "feat: cria MVP funcional do VITTAS"
git branch -M main
git remote add origin https://github.com/Samuel-Yuiti-SY/Vittas.git
git push -u origin main
```

Se ja existir remote:

```bash
git remote -v
git add .
git commit -m "fix: corrige tela branca e prepara deploy do VITTAS"
git push
```

Nao subir:

- `node_modules`
- `dist`
- `.env`
- `.env.local`
- `venv`
- `.npm-cache`
- `__pycache__`

## Observacao

Este projeto e um MVP academico. Nenhum dado real de paciente e utilizado.

O sistema nao realiza diagnostico medico. O chatbot Vitti apenas auxilia na organizacao inicial do fluxo de atendimento.

Como os dados sao simulados em memoria, alteracoes feitas durante o uso podem ser perdidas quando o servidor reiniciar ou quando o Render suspender a aplicacao gratuita.

## Creditos

Projeto criado por Samuel Yuiti Endo Silva e equipe.
