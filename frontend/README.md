# P.H. Barbearia - Sistema de Agendamento e Landing Page

Uma aplicação front-end e responsiva. O sistema engloba uma Landing Page premium para atração de clientes.

## Tecnologias Utilizadas

Este projeto foi construído utilizando as ferramentas mais modernas do ecossistema front-end:

- **[React](https://react.dev/)** - Biblioteca principal de UI.
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática para maior segurança e escalabilidade.
- **[Vite](https://vitejs.dev/)** - Bundler de altíssima velocidade para desenvolvimento e build.
- **[Material UI (v6)](https://mui.com/)** - Biblioteca de componentes baseada em Material Design.
- **[React Router DOM](https://reactrouter.com/)** - Roteamento modular utilizando a moderna API `createBrowserRouter`.
- **[i18next](https://www.i18next.com/)** - Estrutura de internacionalização (preparada para múltiplos idiomas).

## 🏗️ Arquitetura do Projeto

O projeto segue uma arquitetura modular e descentralizada, focada em separação de responsabilidades, garantindo que a aplicação seja escalável a nível enterprise.

- **`layouts/`**: Esqueletos estruturais da aplicação (ex: `MainLayout` que controla a NavBar e o Footer dinamicamente).
- **`modules/`**: Agrupa as páginas da aplicação. Cada módulo possui suas próprias rotas, estado (`Context`), regra de negócio (`Controller`), estilização (`Styles`) e interface visual (`View`).
- **`components/`**: Componentes globais e reaproveitáveis (ex: `sysFooter`).
- **`theme/`**: Configuração central do Material UI (Cores, Fontes, Bordas e Sombras exclusivas).

## ⚙️ Como executar o projeto localmente

### Pré-requisitos

Certifique-se de ter o [Node.js](https://nodejs.org/) instalado em sua máquina.

### Passos para instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/PedroAlvesPaula/gerenciador-de-horarios.git
   ```
2. Acesse a pasta específica do front-end:
   ```bash
   cd nome-do-repositorio/frontend
   npm install
   npm run dev
   ```
