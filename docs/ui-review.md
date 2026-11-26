# Revisão de interface — VITTAS

Data: 25/11/2026. Branch: refactor/professional-ui-ux.

## Direção visual

Clínico e institucional: azul petróleo, verde, tipografia sem serifa, guia do paciente e navegação móvel.

Referência consultada: https://minimal.gallery/tag/healthcare/. Uso como pesquisa de composição; sem cópia de componentes, marcas ou imagens. Logotipos e imagens existentes preservados. Sem dependências novas de interface.

## Alterações

Redução de decoração, superfícies consistentes, hierarquia e textos específicos do projeto; foco visível e respeito a movimento reduzido. Rotas, dados, APIs, autenticação e regras existentes preservados.

## Validação executada

Build Vite aprovado; nove larguras sem overflow; menu móvel, login/cadastro e seleção de perfis testados. Login de paciente e administrador exercitados contra a API local FastAPI. Sem erros JavaScript e sem violações axe A/AA na página inicial.

Larguras da página inicial: 360, 390, 430, 768, 1024, 1280, 1440, 1920 e 2560 px. Essas medições não equivalem a uma revisão manual completa de todas as telas.

Lighthouse móvel em build local, ordem performance/acessibilidade/boas práticas/SEO: 100/100/100/100. Execução de laboratório, sem dados de campo ou INP. Resultados variam com ambiente e carga; detalhes no relatório consolidado.

## Limitações e continuidade

Não havia lint, tipagem estática ou suíte de testes configurados. A API de produção no Render e seu CORS precisam ser conferidos no preview; nenhum dado real foi usado.

axe e Lighthouse não certificam conformidade WCAG. Validação de preview e publicação estão registradas no controle consolidado. O commit inicial foi preservado para rollback.
