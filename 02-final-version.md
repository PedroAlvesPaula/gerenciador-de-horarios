# CSI606-2026-01 - Remoto - Trabalho Final - Resultados

**Discente: Pedro Alves de Paula**

## Resumo

O **PH Barber** é um sistema web full-stack para gerenciar os atendimentos de um barbeiro que presta serviços em domicílio. O trabalho foi desenvolvido a partir da proposta registrada no [`README.md`](README.md), cujo objetivo era centralizar o agendamento dos clientes e oferecer ao profissional uma visão organizada da agenda e dos materiais necessários para os atendimentos.

A solução foi implementada como uma **Progressive Web App (PWA)** responsiva e mobile first. O cliente pode criar uma conta, cadastrar endereços, escolher um ou mais serviços, consultar horários disponíveis e acompanhar seus agendamentos. O administrador pode gerenciar a agenda, os clientes, o catálogo de serviços, o estoque e as regras de funcionamento do negócio. O backend expõe uma API REST autenticada, aplica as regras de disponibilidade e persiste os dados em PostgreSQL.

Além do escopo obrigatório, foram implementados login com Google, agendamentos com múltiplos serviços, funcionamento offline de operações administrativas, documentação Swagger e proteções contra conflitos de horário. A recuperação de senha e o acompanhamento de rotas do barbeiro, previstos inicialmente, não foram concluídos. Pagamentos integrados, navegação GPS nativa e suporte a múltiplos profissionais foram definidos desde a proposta como fora do escopo.

### Visão geral da solução

| Camada           | Responsabilidade                                                                                                                  |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Frontend         | Interface pública, autenticação, área do cliente, painel administrativo, navegação responsiva e recursos de PWA.                  |
| Backend          | API REST, autenticação e autorização, validação, regras de disponibilidade, agenda, catálogo, endereços, estoque e configurações. |
| Banco de dados   | Persistência de usuários, endereços, serviços, agendamentos, itens associados, horários comerciais, folgas e estoque.             |
| Operação offline | Cache da aplicação, snapshots locais e fila de mutações administrativas em IndexedDB.                                             |

O projeto está organizado principalmente nas pastas:

```text
gerenciador-de-horarios/
├── frontend/                  # Aplicação React/PWA
├── backend/
│   ├── docker-compose.yml     # PostgreSQL para desenvolvimento
│   └── api-barber/            # API NestJS e schema Prisma
├── prototipos/                # Protótipos que orientaram a interface
├── README.md                  # Proposta e escopo inicial
└── README2.md                 # Relatório dos resultados
```

## 1. Tecnologias utilizadas - Backend e Frontend

### Frontend

| Tecnologia                             | Uso no projeto                                                                                        |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| React 19                               | Construção das páginas e dos componentes reutilizáveis.                                               |
| TypeScript                             | Tipagem estática das entidades, propriedades, formulários e respostas da API.                         |
| Vite                                   | Ambiente de desenvolvimento, empacotamento e build de produção.                                       |
| Material UI e Emotion                  | Tema visual, componentes, ícones e estilos responsivos.                                               |
| React Router                           | Rotas públicas e privadas, layouts distintos para cliente e administrador e carregamento sob demanda. |
| React Hook Form e Zod                  | Controle dos formulários e validação dos dados no navegador.                                          |
| Axios                                  | Comunicação HTTP com a API e inclusão automática do token de autenticação.                            |
| i18next e react-i18next                | Infraestrutura de internacionalização, configurada com português do Brasil como idioma padrão.        |
| Google OAuth                           | Autenticação do usuário por uma conta Google.                                                         |
| vite-plugin-pwa e Workbox              | Manifesto instalável, Service Worker, precache e estratégias de funcionamento offline.                |
| IndexedDB (`idb`)                      | Snapshots locais e fila persistente de alterações administrativas feitas sem conexão.                 |
| React Hot Toast e React Error Boundary | Mensagens de retorno e tratamento de falhas inesperadas da interface.                                 |

### Backend

| Tecnologia                          | Uso no projeto                                                                    |
| ----------------------------------- | --------------------------------------------------------------------------------- |
| Node.js                             | Ambiente de execução da API.                                                      |
| NestJS 11                           | Organização modular da API REST em controllers, services, DTOs, guards e módulos. |
| TypeScript                          | Tipagem e manutenção do código do servidor.                                       |
| Prisma ORM 7                        | Modelagem, migrations e acesso tipado ao PostgreSQL.                              |
| PostgreSQL 15                       | Banco de dados relacional principal.                                              |
| Passport e JWT                      | Autenticação por Bearer token e proteção das rotas.                               |
| bcryptjs                            | Geração e comparação segura do hash das senhas locais.                            |
| Google Auth Library                 | Validação do token recebido no login com Google.                                  |
| class-validator e class-transformer | Validação, transformação e rejeição de propriedades indevidas nos DTOs.           |
| Swagger/OpenAPI                     | Documentação interativa dos endpoints da API.                                     |
| Jest e Supertest                    | Testes unitários e testes de integração/e2e do backend.                           |

### Infraestrutura, qualidade e ferramentas

| Tecnologia     | Uso no projeto                                                                 |
| -------------- | ------------------------------------------------------------------------------ |
| Docker Compose | Inicialização reproduzível de uma instância PostgreSQL com volume persistente. |
| ESLint         | Análise estática do frontend e do backend.                                     |
| Git e GitHub   | Versionamento e hospedagem do código-fonte.                                    |
| npm            | Instalação de dependências e execução dos scripts do projeto.                  |

### Arquitetura adotada

O frontend funciona como uma aplicação de página única. Suas telas consomem a API REST com JSON por meio do Axios. Depois da autenticação, o JWT fica disponível ao contexto de autenticação e é enviado nas requisições protegidas. As rotas do cliente e do administrador também possuem proteção no frontend para impedir a navegação para áreas incompatíveis com o perfil do usuário.

No backend, o NestJS divide a aplicação nos módulos de usuários, autenticação, catálogo, endereços, configurações de funcionamento, disponibilidade, agendamentos e estoque. Os controllers recebem as requisições, os DTOs validam os dados, os services aplicam as regras de negócio e o Prisma acessa o PostgreSQL. A autorização por perfil também é conferida no servidor; portanto, a proteção não depende apenas da interface.

O banco possui os seguintes grupos de dados:

- `users`: clientes e administradores, diferenciados pelos perfis `USER` e `ADMIN`;
- `addresses`: endereços pertencentes aos clientes;
- `catalog_items`: catálogo de serviços, preços, duração e descrição;
- `appointments`: agendamentos, horário, duração consolidada, status, cliente e endereço;
- `appointment_catalog_items`: associação muitos-para-muitos entre agendamentos e serviços;
- `business_hours`: horários de abertura, fechamento e intervalo por dia da semana;
- `days_off`: feriados, folgas e datas indisponíveis;
- `inventory_items`: materiais, categoria, unidade, quantidade atual e estoque mínimo recomendado.

Uma documentação arquitetural complementar, com diagramas Mermaid do frontend, backend, fluxos de usuário, comunicação cliente-servidor e banco de dados, está disponível em [`diagramasEArquitetura.md`](diagramasEArquitetura.md).

## 2. Funcionalidades implementadas

Esta seção apresenta as funcionalidades previstas no escopo inicial que foram efetivamente entregues.

### 2.1 Aplicação responsiva e instalável

- Interface mobile first, adaptada também para tablets e desktops.
- Landing page pública com apresentação da barbearia e acesso ao sistema.
- Manifesto de PWA, ícones e Service Worker, permitindo instalar a aplicação em dispositivos compatíveis.
- Navegação própria para a área do cliente e para a área administrativa.
- Componentes compartilhados de toolbar, drawer, navegação inferior, formulários, botões, cards e mensagens.
- Tema visual consistente entre as páginas e conteúdo padrão em português do Brasil.

### 2.2 Cadastro, login e controle de acesso

- Cadastro com nome, e-mail e senha.
- Login local com e-mail e senha.
- Armazenamento de senha somente como hash produzido pelo `bcryptjs`.
- Emissão de JWT com validade configurada para um dia.
- Login com conta Google e associação pelo e-mail do usuário.
- Separação dos perfis `USER` e `ADMIN`.
- Guards no backend e rotas protegidas no frontend.
- Logout com remoção da sessão local e retorno ao fluxo público.
- Validação dos formulários no frontend e dos DTOs no backend.

### 2.3 Área do cliente

- Tela inicial com saudação, próximos horários e histórico recente.
- Exibição dos serviços, data, horário, duração, endereço e status dos agendamentos.
- Cadastro, edição, listagem e exclusão de endereços próprios.
- Proteção de propriedade: um usuário não consegue consultar ou alterar o endereço de outro usuário.
- Impedimento da exclusão de um endereço que ainda esteja associado a um agendamento.
- Fluxo guiado para criar um agendamento:
  1. seleção de um ou mais serviços;
  2. escolha da data;
  3. consulta e escolha de um horário disponível;
  4. escolha do endereço;
  5. revisão e confirmação.
- Cálculo automático do preço e da duração totais dos serviços escolhidos.
- Listagem dos próprios agendamentos sem acesso aos dados dos demais clientes.

### 2.4 Agenda administrativa

- Dashboard do administrador com os atendimentos cadastrados.
- Filtros e visualização dos dados relevantes da agenda.
- Criação de agendamento pelo administrador para um cliente.
- Edição de data, horário, cliente, endereço, serviços e situação do atendimento.
- Exclusão de agendamentos.
- Alteração de status entre `PENDING`, `CONFIRMED`, `COMPLETED` e `CANCELED`.
- Consulta dos clientes e de seus endereços para montagem do atendimento.
- Uso da mesma regra de disponibilidade tanto no fluxo do cliente quanto no administrativo.

### 2.5 Cálculo de disponibilidade

O servidor calcula os horários válidos com base em:

- dia da semana e expediente configurado;
- horário de abertura e fechamento;
- intervalo do dia;
- feriados e folgas cadastrados;
- duração total dos serviços selecionados;
- agendamentos pendentes ou confirmados que já ocupam a agenda;
- fuso horário do negócio, cujo padrão é `America/Sao_Paulo`;
- descarte de horários que já passaram;
- revalidação do horário no momento da gravação.

Para reduzir o risco de dois clientes ocuparem simultaneamente o mesmo intervalo, a criação é executada em transação serializável e a disponibilidade é conferida novamente antes da confirmação no banco.

### 2.6 Catálogo de serviços

- Listagem dos serviços disponíveis para o cliente.
- Cadastro, edição e exclusão pelo administrador.
- Registro de nome, descrição, preço e duração em minutos.
- Bloqueio da exclusão de serviços que façam parte do histórico de agendamentos.
- Suporte a vários serviços no mesmo agendamento por meio de uma relação muitos-para-muitos.

### 2.7 Controle de estoque

- Cadastro, edição, listagem e exclusão de itens.
- Categorias de retornáveis, descartáveis e cosméticos.
- Registro de unidade de medida, quantidade atual e quantidade mínima recomendada.
- Indicadores de estoque baixo, crítico ou esgotado.
- Atualização rápida da quantidade para apoiar a rotina do profissional.

Essa entrega cobre o controle básico de materiais previsto na proposta, como lâminas, produtos cosméticos e toalhas.

### 2.8 Configurações de funcionamento

- Definição dos dias em que a barbearia atende.
- Configuração de abertura, fechamento e intervalo de cada dia.
- Cadastro e remoção de feriados ou folgas.
- Integração dessas configurações ao cálculo real de disponibilidade.

### 2.9 Persistência e API REST

- Persistência relacional em PostgreSQL.
- Histórico de alterações estruturais mantido por migrations do Prisma.
- API organizada por recursos, utilizando os métodos HTTP adequados.
- Validação global com descarte de propriedades desconhecidas e rejeição de dados não permitidos.
- Respostas de erro coerentes para autenticação, permissão, dados inválidos, conflitos e registros inexistentes.
- Documentação Swagger disponível em `/api` enquanto o backend estiver em execução.

### Resultado em relação ao escopo inicial

| Item proposto no `README.md`       | Resultado                                        |
| ---------------------------------- | ------------------------------------------------ |
| PWA responsiva e mobile first      | Implementado.                                    |
| Cadastro e login                   | Implementado.                                    |
| Recuperação de senha               | Não implementado.                                |
| Catálogo de serviços e preços      | Implementado.                                    |
| Agendamento guiado                 | Implementado e ampliado para múltiplos serviços. |
| Escolha de endereço e horário      | Implementado.                                    |
| Painel do cliente com status       | Implementado.                                    |
| Dashboard administrativo de agenda | Implementado.                                    |
| Alteração do status do atendimento | Implementado.                                    |
| Início e acompanhamento de rotas   | Não implementado.                                |
| Controle de estoque                | Implementado.                                    |
| Backend REST, JWT e persistência   | Implementado.                                    |

## 3. Funcionalidades previstas e não implementadas

### 3.1 Recuperação de senha

A proposta previa recuperação de senha, mas o sistema atual oferece apenas cadastro, login local, login com Google e logout. Não existem token de recuperação, expiração específica, envio de e-mail ou página para definição de uma nova senha.

Para concluir essa funcionalidade seriam necessários, no mínimo:

- endpoint para solicitar a recuperação sem revelar se o e-mail existe;
- token de uso único, armazenado de maneira segura e com expiração curta;
- serviço de envio de e-mail;
- página para validação do token e cadastro da nova senha;
- invalidação do token depois do uso e testes dos fluxos de sucesso e falha.

### 3.2 Início e acompanhamento de rotas

O escopo administrativo previa permitir que o barbeiro iniciasse as rotas do dia. A agenda e os endereços necessários estão disponíveis, mas não foi criado um domínio de rota, uma ordenação logística dos atendimentos ou um estado de rota em andamento.

Uma futura implementação poderia incluir:

- agrupamento dos compromissos confirmados por dia;
- ordenação manual ou calculada dos destinos;
- estado da rota e do deslocamento para cada atendimento;
- atalhos para abrir o endereço em um aplicativo externo de mapas;
- registro do horário de saída, chegada e conclusão.

Essa evolução não deve ser confundida com navegação GPS nativa, que já havia sido explicitamente retirada do escopo inicial.

### 3.3 Limitações conhecidas que não faziam parte da entrega obrigatória

- O conteúdo comercial da landing page é estático e não é administrado pelo catálogo armazenado no banco.
- O cliente ainda não possui um fluxo próprio para reagendar ou cancelar um compromisso; essas mudanças podem ser feitas pelo administrador.
- Não há notificações por e-mail, SMS ou push sobre confirmação e proximidade do atendimento.
- Não há pipeline de implantação ou ambiente de produção configurado no repositório.

### 3.4 Itens intencionalmente fora do escopo

Os itens abaixo não representam falhas de implementação, pois foram definidos como restrições desde a proposta:

- pagamento integrado;
- navegação GPS nativa;
- operação com múltiplos barbeiros ou profissionais.

## 4. Outras funcionalidades implementadas

As funcionalidades a seguir não eram requisitos centrais da proposta original ou foram entregues com profundidade maior do que a inicialmente prevista.

### 4.1 Login com Google

Além de e-mail e senha, o usuário pode autenticar-se com uma conta Google. O backend valida o token do provedor e associa ou cria a conta local pelo e-mail, mantendo o restante do sistema protegido pelo mesmo JWT da aplicação.

### 4.2 Agendamento de múltiplos serviços

O modelo inicial foi ampliado para aceitar de um a vinte serviços distintos em um compromisso. O sistema soma preços e durações, usa a duração consolidada no cálculo da agenda e conserva o relacionamento com todos os itens contratados.

### 4.3 Operações administrativas offline

O painel administrativo pode conservar dados de apoio e registrar alterações mesmo durante uma perda de conexão. A solução utiliza:

- precache do shell da aplicação pelo Service Worker;
- snapshots em IndexedDB de agenda, clientes, catálogo, estoque, expediente e folgas;
- interface otimista para resposta imediata ao usuário;
- fila persistente de criações, edições e exclusões;
- nova tentativa de sincronização quando a conexão retorna ou a página é reaberta;
- identificadores UUID nas criações para tornar novas tentativas idempotentes e evitar duplicação.

Esse suporte offline concentra-se no fluxo administrativo. Os dados dinâmicos da área do cliente ainda dependem da API e não possuem a mesma cobertura independente de conexão.

### 4.4 Regras de consistência e preservação do histórico

- Revalidação transacional para evitar conflito de agenda.
- Duração consolidada armazenada no agendamento, preservando o tempo contratado mesmo após futuras mudanças no catálogo.
- Restrições de exclusão para endereços e serviços associados a compromissos.
- Validação de propriedade dos recursos do cliente.
- Proteção das operações administrativas pelo perfil do usuário tanto no frontend quanto no backend.

### 4.5 Documentação técnica complementar

- Swagger/OpenAPI gerado pela própria API.
- Diagramas de arquitetura, componentes, implantação, casos de uso, sequências e entidade-relacionamento em [`diagramasEArquitetura.md`](diagramasEArquitetura.md).
- Protótipos versionados junto ao projeto para comparação entre a concepção e o resultado.

## 5. Principais desafios e dificuldades

### 5.1 Disponibilidade com durações variáveis

Um horário não pode ser tratado como um ponto isolado: ele precisa comportar toda a duração dos serviços escolhidos sem ultrapassar o fechamento, entrar no intervalo ou colidir com outro atendimento. O problema tornou-se mais complexo com a inclusão de múltiplos serviços. A solução foi centralizar o cálculo no backend e reutilizar a mesma regra nos fluxos de cliente e administrador.

### 5.2 Concorrência na confirmação do agendamento

Uma consulta pode indicar que um horário está livre e, antes da gravação, outra requisição pode ocupá-lo. Apenas validar na interface não seria suficiente. A criação passou a reconsultar os conflitos dentro de uma transação serializável, fazendo o servidor rejeitar a operação quando a agenda já tiver mudado.

### 5.3 Datas, horários e fuso horário

O domínio depende de datas locais, horários sem deslocamento, instantes armazenados no banco e comparação com o momento atual. Diferenças entre o navegador, o servidor e o PostgreSQL poderiam deslocar o atendimento de dia ou hora. Por isso, as conversões foram concentradas em utilitários e o fuso do negócio foi configurado explicitamente, com padrão para `America/Sao_Paulo`.

### 5.4 Evolução do modelo de dados

O sistema evoluiu de um serviço único para vários serviços por agendamento e também recebeu endereços, expediente, folgas e estoque. Essa mudança exigiu migrations cuidadosas, tabela associativa e preservação dos registros existentes. Algumas exclusões precisaram ser restringidas para que o histórico permanecesse íntegro.

### 5.5 Sincronização offline

Permitir alterações administrativas sem rede exigiu mais do que armazenar páginas no cache. Foi necessário definir snapshots, ordem da fila, respostas otimistas, credenciais, novas tentativas, tratamento de conflitos e idempotência. A principal dificuldade foi manter a percepção de continuidade sem esconder do usuário que ainda havia dados esperando sincronização.

### 5.6 Autenticação e autorização em duas camadas

O projeto combina credenciais locais e identidade Google, mas ambos os caminhos precisam resultar na mesma autorização por JWT e perfil. Também foi necessário repetir a verificação de permissão no backend, pois esconder uma opção na interface não protege um endpoint contra acesso direto.

### 5.7 Experiência responsiva em áreas diferentes

Cliente e administrador possuem necessidades de navegação distintas, com drawer em telas grandes e barra inferior em dispositivos móveis. O desafio foi reaproveitar componentes sem permitir que uma alteração visual de uma área afetasse a outra, mantendo legibilidade, estados selecionados e ações importantes em diferentes larguras.

### 5.8 Consistência entre formulários, API e banco

Os mesmos conceitos aparecem em schemas Zod, tipos TypeScript, DTOs, regras dos services e constraints do banco. Divergências entre essas camadas podem permitir uma entrada em um ponto e rejeitá-la em outro. A estratégia adotada foi validar cedo no frontend, validar novamente no backend e deixar restrições essenciais também no banco.

## 6. Instruções para instalação e execução

### 6.1 Pré-requisitos

- Git;
- Node.js 20 ou superior;
- npm;
- Docker com Docker Compose, para usar o PostgreSQL fornecido pelo projeto;
- opcionalmente, um Client ID OAuth 2.0 do Google para habilitar o login com Google.

As portas padrão utilizadas são:

| Serviço    | Porta  |
| ---------- | ------ |
| Frontend   | `5173` |
| Backend    | `3000` |
| PostgreSQL | `5432` |

### 6.2 Clonar o repositório

```bash
git clone https://github.com/PedroAlvesPaula/gerenciador-de-horarios.git
cd gerenciador-de-horarios
```

### 6.3 Iniciar o banco de dados

Na raiz do projeto, execute:

```bash
docker compose -f backend/docker-compose.yml up -d
```

Esse comando cria o container `phbarber-db`, com PostgreSQL 15, banco `phbarber` e volume persistente. Para conferir o estado:

```bash
docker compose -f backend/docker-compose.yml ps
```

### 6.4 Configurar e executar o backend

Entre na aplicação do backend e instale as dependências:

```bash
cd backend/api-barber
npm install
```

Crie o arquivo `backend/api-barber/.env` com valores equivalentes aos seguintes:

```dotenv
DATABASE_URL="postgresql://admin:adminpassword@localhost:5432/phbarber?schema=public"
JWT_SECRET="substitua-por-uma-chave-longa-e-segura"
GOOGLE_CLIENT_ID="seu-client-id.apps.googleusercontent.com"
BUSINESS_TIME_ZONE="America/Sao_Paulo"
PORT=3000
```

`GOOGLE_CLIENT_ID` é necessário apenas para o login com Google. Em uma implantação real, a senha do banco e o segredo JWT devem ser diferentes dos valores de desenvolvimento e nunca devem ser versionados.

Gere o cliente Prisma, aplique as migrations existentes e inicie a API:

```bash
npx prisma generate
npx prisma migrate deploy
npm run start:dev
```

Com o backend ativo:

- API: `http://localhost:3000`;
- Swagger: `http://localhost:3000/api`.

### 6.5 Configurar e executar o frontend

Em outro terminal, a partir da raiz do repositório:

```bash
cd frontend
npm install
```

Crie o arquivo `frontend/.env`:

```dotenv
VITE_API_URL="http://localhost:3000"
VITE_GOOGLE_CLIENT_ID="seu-client-id.apps.googleusercontent.com"
```

O valor de `VITE_GOOGLE_CLIENT_ID` deve corresponder ao Client ID configurado no backend. Para autenticação Google em desenvolvimento, cadastre `http://localhost:5173` como origem JavaScript autorizada no provedor.

Inicie o servidor do frontend:

```bash
npm run dev
```

A aplicação ficará disponível em `http://localhost:5173`.

### 6.6 Preparar o primeiro administrador

Novos cadastros recebem o perfil de cliente (`USER`). Para testar o painel administrativo:

1. crie uma conta normalmente pela interface;
2. substitua o e-mail no comando abaixo e execute-o no terminal;
3. saia da aplicação e entre novamente para receber um novo token com o perfil atualizado.

```bash
docker exec -it phbarber-db psql -U admin -d phbarber \
  -c "UPDATE users SET role = 'ADMIN' WHERE email = 'seu-email@exemplo.com';"
```

Depois do login administrativo, configure os horários de funcionamento e, se necessário, os dias de folga. Sem um expediente válido não haverá horários disponíveis para novos agendamentos.

### 6.7 Fluxo recomendado para validação manual

1. Entre como administrador e cadastre os serviços do catálogo.
2. Configure dias e horários de funcionamento.
3. Cadastre itens de estoque para validar os indicadores.
4. Crie ou use uma conta de cliente.
5. Cadastre um endereço na área do cliente.
6. Escolha um ou mais serviços e conclua um agendamento.
7. Volte ao painel administrativo, confirme o atendimento e depois marque-o como concluído.
8. Confira a separação entre próximos horários e histórico na página do cliente.

### 6.8 Testes e verificações de qualidade

Backend:

```bash
cd backend/api-barber
npm run lint
npm test
npm run test:e2e
npm run build
```

Frontend:

```bash
cd frontend
npm run lint
npm run build
```

### 6.9 Build e execução de produção

Backend:

```bash
cd backend/api-barber
npm run build
node dist/src/main.js
```

Frontend:

```bash
cd frontend
npm run build
npm run preview
```

O comando `preview` serve apenas para conferir localmente o build do Vite. Em produção, a pasta `frontend/dist` deve ser publicada em um servidor de arquivos estáticos, e as origens permitidas pelo CORS do backend devem ser ajustadas para o domínio real.

### 6.10 Encerramento do banco local

Para parar o container sem apagar os dados:

```bash
docker compose -f backend/docker-compose.yml stop
```

O volume do PostgreSQL é persistente. A remoção do volume apagaria os dados locais e, por isso, deve ser feita somente de forma intencional.

## 7. Referências

### Documentação do projeto

- [Proposta e escopo inicial](README.md)
- [Arquitetura e diagramas](diagramasEArquitetura.md)
- [Protótipos da interface](prototipos/)

### Documentações oficiais consultadas

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Vite](https://vite.dev/guide/)
- [Material UI](https://mui.com/material-ui/getting-started/)
- [React Router](https://reactrouter.com/)
- [React Hook Form](https://react-hook-form.com/get-started)
- [Zod](https://zod.dev/)
- [Axios](https://axios-http.com/docs/intro)
- [i18next](https://www.i18next.com/overview/getting-started)
- [Vite PWA](https://vite-pwa-org.netlify.app/)
- [Workbox](https://developer.chrome.com/docs/workbox/what-is-workbox/)
- [NestJS](https://docs.nestjs.com/first-steps)
- [Prisma ORM](https://www.prisma.io/docs/)
- [Prisma com NestJS](https://www.prisma.io/docs/guides/frameworks/nestjs)
- [PostgreSQL 15](https://www.postgresql.org/docs/15/)
- [Docker Compose](https://docs.docker.com/compose/)
- [JSON Web Token - RFC 7519](https://www.rfc-editor.org/rfc/rfc7519)
- [Google Identity Services para Web](https://developers.google.com/identity/gsi/web)
- [OpenAPI Specification](https://spec.openapis.org/oas/latest.html)

---

**Situação da entrega:** o núcleo de cadastro, agendamento, agenda administrativa, catálogo, estoque e persistência foi concluído. As principais pendências em relação à proposta são a recuperação de senha e o fluxo operacional de rotas.
