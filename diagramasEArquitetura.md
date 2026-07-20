# Arquitetura e diagramas do Gerenciador de Horários

> Documentação da implementação existente em 20/07/2026. Os diagramas foram construídos a partir do código presente em `frontend/`, `backend/api-barber/src/`, `backend/api-barber/prisma/schema.prisma` e das migrations SQL. Todos os blocos Mermaid podem ser renderizados diretamente pelo GitHub, GitLab, Mermaid Live Editor ou por extensões compatíveis de Markdown.

## 1. Visão geral

O **Gerenciador de Horários — P.H. Barbearia Itinerante** é uma aplicação full-stack para atendimento de barbearia a domicílio. O produto possui uma SPA instalável como PWA, uma API REST e um banco PostgreSQL. Existem duas áreas autenticadas: a área do cliente (`USER`) e o painel do barbeiro (`ADMIN`).

| Camada | Implementação atual |
|---|---|
| Frontend | React 19, TypeScript, Vite, Material UI, React Router, Context API, React Hook Form, Zod e i18next |
| PWA/offline | Workbox, Service Worker, Background Sync e IndexedDB por meio de `idb` |
| Comunicação | REST/JSON com Axios ou `fetch`, autenticação Bearer JWT e CORS |
| Backend | NestJS 11, controllers, services, guards, DTOs, ValidationPipe e Swagger/OpenAPI |
| Persistência | Prisma ORM 7 com adapter `pg` e PostgreSQL 15 |
| Identidade | E-mail/senha com bcrypt ou Google Identity; sessão da aplicação emitida como JWT |

### 1.1 Contexto geral do sistema

**Tipo:** diagrama UML de componentes em nível de contexto.

**Resumo:** mostra as partes executáveis do sistema e os serviços externos. O navegador executa a SPA/PWA, que conversa com a API por HTTP/JSON. A API valida o login Google quando necessário e é a única camada que acessa o PostgreSQL. O IndexedDB é um armazenamento local específico do navegador e sustenta o modo offline administrativo.

```mermaid
flowchart LR
    VIS[Visitante]
    CLI[Cliente USER]
    ADM[Barbeiro ADMIN]

    subgraph DEVICE[Dispositivo do usuário]
        PWA[SPA / PWA React]
        SW[Service Worker e Background Sync]
        IDB[(IndexedDB\nsnapshots e fila ADMIN)]
        LS[(localStorage\nJWT e usuário)]
    end

    API[API REST NestJS\nporta padrão 3000]
    DOC[Swagger / OpenAPI\n/api]
    DB[(PostgreSQL 15\nporta 5432)]
    GOOGLE[Google Identity]

    VIS --> PWA
    CLI --> PWA
    ADM --> PWA
    PWA -->|REST JSON / HTTP| API
    PWA -->|credencial Google| GOOGLE
    API -->|verifica ID token| GOOGLE
    API -->|Prisma + adapter pg| DB
    DOC -. descreve .-> API
    PWA <--> LS
    PWA <--> IDB
    PWA <--> SW
    SW <--> IDB
    SW -->|reenvio de mutações ADMIN| API
```

No ambiente local, o frontend é servido em `http://localhost:5173`, a URL padrão da API é `http://localhost:3000` e o `docker-compose.yml` publica o PostgreSQL em `localhost:5432`. O CORS do backend aceita atualmente apenas a origem do frontend local.

## 2. Arquitetura do frontend

### 2.1 Componentes e módulos do frontend

**Tipo:** diagrama UML de componentes/pacotes.

**Resumo:** apresenta a decomposição da aplicação React. O bootstrap monta os providers globais e o roteador. As rotas carregam os módulos de forma lazy; os módulos acessam serviços HTTP compartilhados e, no painel administrativo, também a infraestrutura offline.

```mermaid
flowchart TB
    BOOT[main.tsx\nReact bootstrap]

    subgraph ROOT[App.view.tsx — providers globais]
        GOOGLE[GoogleOAuthProvider]
        ERROR[ErrorBoundary]
        THEME[ThemeProvider + CssBaseline]
        AUTH[AuthProvider\nsessão, papel e sync ADMIN]
        ROUTER[RouterProvider]
        TOAST[Toaster]
    end

    subgraph ROUTES[Roteamento]
        PUBLIC[Rotas públicas\n/ /login /signUp]
        USERROUTE[ProtectedRoute USER]
        ADMINROUTE[ProtectedRoute ADMIN]
        ACCESS[routeAccess\nnormalização e redirecionamento]
    end

    subgraph LAYOUTS[Layouts]
        MAIN[MainLayout\ntoolbar/footer condicionais]
        CLIENTLAYOUT[ClientLayout\nsidebar/bottom navigation]
        ADMINLAYOUT[AdminLayout\nsidebar/bottom navigation]
    end

    subgraph FEATURES[Módulos funcionais]
        LANDING[Landing Page]
        AUTHMOD[Auth\nLogin e Cadastro]
        CLIENT[Cliente\nDashboard, Agendamento, Endereços]
        ADMIN[Admin\nAgenda, Catálogo, Estoque,\nPerfil e Configurações]
    end

    subgraph SHARED[Infraestrutura compartilhada]
        UI[Components, theme, layouts,\ni18n, toast e utilitários]
        AXIOS[Axios api\ninterceptors JWT / erros]
        APISVC[Serviços REST por domínio]
    end

    subgraph OFFLINE[Infraestrutura offline ADMIN]
        OFFCLIENT[adminOffline.client]
        QUEUE[adminQueueProcessor]
        OFFDB[adminOfflineDb]
        SW[sw.ts / Workbox]
        IDB[(IndexedDB)]
    end

    NEST[API NestJS]

    BOOT --> GOOGLE --> ERROR --> THEME --> AUTH --> ROUTER
    AUTH --> TOAST
    ROUTER --> PUBLIC
    ROUTER --> USERROUTE
    ROUTER --> ADMINROUTE
    USERROUTE --> ACCESS
    ADMINROUTE --> ACCESS
    PUBLIC --> MAIN
    USERROUTE --> MAIN --> CLIENTLAYOUT
    ADMINROUTE --> ADMINLAYOUT
    MAIN --> LANDING
    MAIN --> AUTHMOD
    CLIENTLAYOUT --> CLIENT
    ADMINLAYOUT --> ADMIN
    FEATURES --> UI
    AUTHMOD --> APISVC
    CLIENT --> APISVC
    ADMIN --> APISVC
    APISVC --> AXIOS --> NEST
    ADMIN --> OFFCLIENT
    AUTH --> OFFCLIENT
    OFFCLIENT --> OFFDB --> IDB
    OFFCLIENT --> QUEUE
    SW --> QUEUE
    QUEUE --> OFFDB
    QUEUE -->|fetch com Bearer JWT| NEST
```

O `ProtectedRoute` faz a proteção no cliente para melhorar navegação e experiência, mas não substitui os guards do servidor. O `AuthProvider` restaura `@phbarber:user` e `@phbarber:token` do `localStorage`, enquanto o interceptor Axios injeta o token em cada requisição e trata `401`, `403` e falhas de servidor.

### 2.2 Estrutura interna de um módulo de tela

**Tipo:** diagrama UML de componentes com padrão Controller–Context–View.

**Resumo:** a maioria das funcionalidades segue o mesmo arranjo. O controller concentra estado e regras de interação, publica dados e ações em um Context, e a View consome esse contrato para renderizar componentes. Formulários usam React Hook Form com schemas Zod. Os arquivos `*.styles.tsx` isolam a apresentação Material UI.

```mermaid
flowchart LR
    ROUTE[Definição de rota lazy] --> CTRL[Controller.tsx]
    CTRL -->|estado, efeitos e handlers| CTX[Context.tsx]
    CTX -->|hook useContext| VIEW[View.tsx]
    VIEW --> CHILD[Componentes de tela\nCards e Dialogs]
    VIEW --> STYLE[Styles.tsx\nMaterial UI styled]
    CHILD --> FORM[React Hook Form]
    FORM --> ZOD[Schema Zod]
    CTRL --> DOMAIN[Serviços do domínio]
    DOMAIN --> API[Axios compartilhado]
    CTRL -. em Inventory .-> HOOK[useInventoryController]
    HOOK --> CTX
```

Esse padrão aparece em Landing Page, Login, Cadastro, dashboards e módulos administrativos. `Inventory` adiciona um hook de domínio próprio para separar as operações otimistas de estoque do provider que hidrata cache e monitora conectividade.

### 2.3 Mapa de navegação e controle de acesso

**Tipo:** diagrama UML de navegação/estados da interface.

**Resumo:** mostra todas as rotas implementadas, o layout que as hospeda e o papel exigido. Rotas públicas usam `MainLayout`; a área do cliente passa por `ProtectedRoute(USER)` e combina `MainLayout` com `ClientLayout`; a área administrativa passa por `ProtectedRoute(ADMIN)` e usa `AdminLayout`.

```mermaid
flowchart TD
    START([Acesso a uma URL]) --> MATCH{Qual grupo de rota?}

    MATCH -->|Pública| MAIN[MainLayout]
    MAIN --> HOME["/ — Landing Page"]
    MAIN --> LOGIN["/login — Login"]
    MAIN --> SIGNUP["/signUp — Cadastro"]

    MATCH -->|Área de cliente| CHECKUSER{Autenticado como USER?}
    CHECKUSER -->|Não autenticado| LOGIN
    CHECKUSER -->|Papel incorreto| ROLEHOME[Redireciona para a home permitida]
    CHECKUSER -->|Sim| CL[MainLayout + ClientLayout]
    CL --> CDASH["/client — Dashboard"]
    CL --> CSCHEDULE["/schedule/new — Novo agendamento"]
    CL --> CADDRESS["/client/enderecos — Endereços"]

    MATCH -->|Área administrativa| CHECKADMIN{Autenticado como ADMIN?}
    CHECKADMIN -->|Não autenticado| LOGIN
    CHECKADMIN -->|Papel incorreto| ROLEHOME
    CHECKADMIN -->|Sim| AL[AdminLayout]
    AL --> ASCHEDULE["/admin — Agenda"]
    AL --> ACATALOG["/admin/servicos — Catálogo"]
    AL --> AINV["/admin/estoque — Maleta / estoque"]
    AL --> APROFILE["/admin/perfil — Perfil e finanças mock"]
    AL --> ASETTINGS["/admin/configuracoes — Expediente e folgas"]
```

Após o login, `getRouteAfterLogin` só restaura a URL originalmente solicitada se ela pertencer ao papel autenticado. Caso contrário, o usuário é direcionado para `/client` ou `/admin`.

## 3. Arquitetura do backend

### 3.1 Camadas da API

**Tipo:** diagrama UML de componentes em camadas.

**Resumo:** descreve o processamento de uma chamada REST no NestJS. O pipeline global transforma e valida DTOs, os guards autenticam/autorizam, controllers traduzem HTTP para chamadas de aplicação, services executam regras de negócio e o Prisma persiste no PostgreSQL.

```mermaid
flowchart TB
    CLIENT[SPA/PWA ou Swagger]

    subgraph BOOT[Bootstrap NestJS]
        CORS[CORS]
        VALIDATION[ValidationPipe global\nwhitelist + transform]
        OPENAPI[Swagger / OpenAPI]
    end

    subgraph SECURITY[Segurança]
        JWTGUARD[JwtAuthGuard / Passport]
        JWTSTRATEGY[JwtStrategy]
        ADMINGUARD[AdminGuard]
        JWT[JwtService]
        BCRYPT[bcryptjs]
        GOOGLESRV[google-auth-library]
    end

    subgraph HTTP[Camada HTTP]
        CONTROLLERS[Controllers]
        DTOS[DTOs + class-validator]
    end

    subgraph APPLICATION[Regras de aplicação]
        SERVICES[Services de domínio]
        AVAILABILITY[AvailabilityService\ncálculo e prevenção de conflito]
        DATETIME[Utilitários de data/hora\nAmerica/Sao_Paulo por padrão]
    end

    PRISMA[PrismaService global\nPrisma Client + adapter pg]
    DB[(PostgreSQL)]

    CLIENT --> CORS --> VALIDATION --> CONTROLLERS
    OPENAPI -. documenta .-> CONTROLLERS
    CONTROLLERS --> DTOS
    CONTROLLERS --> JWTGUARD --> JWTSTRATEGY
    JWTGUARD --> ADMINGUARD
    CONTROLLERS --> SERVICES
    SERVICES --> AVAILABILITY
    AVAILABILITY --> DATETIME
    SERVICES --> PRISMA
    AVAILABILITY --> PRISMA
    PRISMA --> DB
    SERVICES --> JWT
    SERVICES --> BCRYPT
    SERVICES --> GOOGLESRV
```

As operações críticas de criação/edição de agendamento e de quantidade de estoque usam transações com isolamento `Serializable`. O agendamento recalcula a disponibilidade dentro da transação, reduzindo a possibilidade de duas requisições reservarem a mesma faixa de horário.

### 3.2 Módulos NestJS e dependências

**Tipo:** diagrama UML de pacotes.

**Resumo:** detalha os módulos registrados no `AppModule`. Cada domínio possui controller e service próprios. `PrismaModule` é global; `AuthModule` depende de usuários e `AppointmentsModule` importa disponibilidade para reutilizar a regra de validação dos horários.

```mermaid
flowchart TB
    APP[AppModule]

    APP --> USERS[UsersModule]
    APP --> AUTH[AuthModule]
    APP --> CATALOG[CatalogModule]
    APP --> ADDRESSES[AddressesModule]
    APP --> APPOINTMENTS[AppointmentsModule]
    APP --> AVAILABILITY[AvailabilityModule]
    APP --> SETTINGS[BusinessSettingsModule]
    APP --> INVENTORY[InventoryModule]
    APP --> PRISMA[PrismaModule global]

    AUTH -->|usa UsersService| USERS
    AUTH --> JWT[JwtModule global + Passport]
    APPOINTMENTS -->|usa AvailabilityService| AVAILABILITY
    SETTINGS --> BHC[BusinessHoursController]
    SETTINGS --> DOC[DaysOffController]
    BHC --> BSS[BusinessSettingsService]
    DOC --> BSS

    USERS -.-> PRISMA
    CATALOG -.-> PRISMA
    ADDRESSES -.-> PRISMA
    APPOINTMENTS -.-> PRISMA
    AVAILABILITY -.-> PRISMA
    SETTINGS -.-> PRISMA
    INVENTORY -.-> PRISMA
```

### 3.3 Responsabilidades dos domínios do backend

| Módulo | Controller(s) | Responsabilidade principal |
|---|---|---|
| `auth` | `AuthController` | Cadastro, login local, validação do ID token Google e emissão de JWT de 1 dia |
| `users` | `UsersController` | Persistência/consulta de usuários e listagem de clientes com endereços para o admin |
| `catalog` | `CatalogController` | CRUD de serviços, preço e duração; impede excluir serviço já agendado |
| `addresses` | `AddressesController` | CRUD dos endereços pertencentes ao usuário do JWT; impede excluir endereço já usado |
| `availability` | `AvailabilityController` | Calcula slots a partir de duração total, expediente, intervalo, folga e colisões |
| `appointments` | `AppointmentsController` | Criação do cliente/admin, consulta, edição, status e exclusão de agendamentos |
| `business-settings` | `BusinessHoursController`, `DaysOffController` | Expediente semanal, intervalos, folgas e feriados |
| `inventory` | `InventoryController` | CRUD e alteração transacional da quantidade do estoque |
| `prisma` | — | Conexão global compartilhada com PostgreSQL |

## 4. Usabilidade e comportamento dos usuários

### 4.1 Casos de uso por ator

**Tipo:** diagrama UML de casos de uso, representado em Mermaid como atores e elipses funcionais.

**Resumo:** separa o que pode ser feito por visitante, cliente e administrador. `USER` e `ADMIN` são papéis persistidos no usuário e verificados tanto pelo roteamento do frontend quanto pelos guards do backend.

```mermaid
flowchart LR
    VIS[Visitante]
    USER[Cliente USER]
    ADMIN[Barbeiro ADMIN]
    GOOGLE[Google Identity]

    subgraph PUBLIC[Casos de uso públicos]
        LAND([Conhecer a barbearia])
        REGISTER([Cadastrar conta])
        LOGIN([Entrar com e-mail e senha])
        GLOGIN([Entrar com Google])
    end

    subgraph CLIENT[Casos de uso do cliente]
        DASH([Consultar próximos atendimentos e histórico])
        ADDR([Cadastrar, editar e excluir endereços])
        CATALOG([Selecionar um ou mais serviços])
        AVAIL([Consultar horários disponíveis])
        BOOK([Criar agendamento a domicílio])
        LOGOUT([Encerrar sessão])
    end

    subgraph BARBER[Casos de uso do administrador]
        AGENDA([Gerenciar agenda e status])
        CLIENTS([Selecionar clientes e endereços])
        SERVICES([Gerenciar catálogo de serviços])
        STOCK([Gerenciar estoque e níveis críticos])
        HOURS([Configurar expediente e intervalo])
        DAYSOFF([Configurar folgas e feriados])
        PROFILE([Visualizar perfil/finanças demonstrativas])
        OFFLINE([Trabalhar com mutações offline])
    end

    VIS --> LAND
    VIS --> REGISTER
    VIS --> LOGIN
    VIS --> GLOGIN
    GOOGLE --> GLOGIN

    USER --> DASH
    USER --> ADDR
    USER --> CATALOG
    USER --> AVAIL
    USER --> BOOK
    USER --> LOGOUT
    BOOK -. inclui .-> CATALOG
    BOOK -. inclui .-> AVAIL
    BOOK -. exige .-> ADDR

    ADMIN --> AGENDA
    ADMIN --> CLIENTS
    ADMIN --> SERVICES
    ADMIN --> STOCK
    ADMIN --> HOURS
    ADMIN --> DAYSOFF
    ADMIN --> PROFILE
    ADMIN --> OFFLINE
    AGENDA -. usa .-> CLIENTS
    OFFLINE -. abrange .-> AGENDA
    OFFLINE -. abrange .-> SERVICES
    OFFLINE -. abrange .-> STOCK
    OFFLINE -. abrange .-> HOURS
    OFFLINE -. abrange .-> DAYSOFF
```

O conteúdo financeiro de `/admin/perfil` é atualmente demonstrativo: as transações estão definidas como dados mock no frontend e não possuem tabela ou endpoint no backend.

### 4.2 Jornada do cliente para agendar

**Tipo:** diagrama UML de atividades.

**Resumo:** representa o wizard implementado em `/schedule/new`. Serviços e endereços são carregados ao abrir a tela; a mudança de data ou serviços dispara uma nova consulta de disponibilidade. A confirmação só é enviada após todas as escolhas obrigatórias.

```mermaid
flowchart TD
    START([Abrir Novo agendamento]) --> LOAD[Carregar catálogo e endereços]
    LOAD --> OK{Dados carregados?}
    OK -->|Não| RETRY[Exibir erro e permitir nova tentativa]
    RETRY --> LOAD
    OK -->|Sim| SELECT[Selecionar de 1 a 20 serviços sem repetição]
    SELECT --> TOTAL[Calcular preço e duração totais]
    TOTAL --> DATE[Selecionar a data]
    DATE --> QUERY[Consultar disponibilidade para a seleção]
    QUERY --> SLOTS{Há horários livres?}
    SLOTS -->|Não| DATE
    SLOTS -->|Sim| TIME[Selecionar horário]
    TIME --> ADDRESS{Existe endereço cadastrado?}
    ADDRESS -->|Não| MANAGE[Ir para gerenciamento de endereços]
    MANAGE --> LOAD
    ADDRESS -->|Sim| CHOOSE[Selecionar endereço]
    CHOOSE --> REVIEW[Revisar serviços, data, hora, endereço e valor]
    REVIEW --> CONFIRM[Confirmar agendamento]
    CONFIRM --> SERVER{Servidor revalida o slot?}
    SERVER -->|Conflito ou inválido| DATE
    SERVER -->|Criado| DASH[Voltar ao dashboard do cliente]
    DASH --> END([Acompanhar status e histórico])
```

### 4.3 Ciclo de vida do agendamento

**Tipo:** diagrama UML de máquina de estados.

**Resumo:** mostra os quatro valores persistidos no enum `AppointmentStatus`. A implementação aceita que o administrador escolha qualquer valor a partir de qualquer estado. `PENDING` e `CONFIRMED` são estados ativos e bloqueiam disponibilidade; ao reativar um agendamento concluído/cancelado, o backend revalida o slot.

```mermaid
stateDiagram-v2
    [*] --> PENDING: criação
    PENDING --> CONFIRMED: admin altera status
    PENDING --> COMPLETED: admin altera status
    PENDING --> CANCELED: admin altera status
    CONFIRMED --> PENDING: admin altera status
    CONFIRMED --> COMPLETED: admin altera status
    CONFIRMED --> CANCELED: admin altera status
    COMPLETED --> PENDING: revalida disponibilidade
    COMPLETED --> CONFIRMED: revalida disponibilidade
    COMPLETED --> CANCELED: admin altera status
    CANCELED --> PENDING: revalida disponibilidade
    CANCELED --> CONFIRMED: revalida disponibilidade
    CANCELED --> COMPLETED: admin altera status
```

Não existe hoje uma tabela de histórico de status; somente o valor atual é mantido em `appointments.status`.

## 5. Comunicação entre cliente e servidor

### 5.1 Autenticação local e Google

**Tipo:** diagrama UML de sequência.

**Resumo:** compara os dois caminhos de autenticação. Nos dois casos, a API termina emitindo seu próprio JWT. A credencial Google é verificada no servidor, e uma conta pode ser criada ou vinculada pelo e-mail validado.

```mermaid
sequenceDiagram
    actor Pessoa
    participant SPA as SPA React
    participant Google as Google Identity
    participant AuthC as AuthController
    participant AuthS as AuthService
    participant Users as UsersService
    participant DB as PostgreSQL
    participant JWT as JwtService

    alt Login por e-mail e senha
        Pessoa->>SPA: envia formulário
        SPA->>AuthC: POST /auth/login
        AuthC->>AuthS: login(dto)
        AuthS->>Users: findByEmail(email)
        Users->>DB: SELECT users
        DB-->>Users: usuário e hash
        Users-->>AuthS: usuário
        AuthS->>AuthS: bcrypt.compare
    else Login com Google
        Pessoa->>Google: escolhe conta
        Google-->>SPA: Google ID token
        SPA->>AuthC: POST /auth/google {token}
        AuthC->>AuthS: verifyGoogleToken(token)
        AuthS->>Google: verifyIdToken(token, audience)
        Google-->>AuthS: identidade verificada
        AuthS->>Users: localizar por googleId/e-mail
        Users->>DB: SELECT / INSERT / UPDATE users
        DB-->>Users: usuário vinculado ou criado
        Users-->>AuthS: usuário
    end

    AuthS->>JWT: signAsync(sub, email, role)
    JWT-->>AuthS: access_token
    AuthS-->>AuthC: token + usuário
    AuthC-->>SPA: 200 JSON
    SPA->>SPA: salva token/usuário no localStorage
    SPA-->>Pessoa: redireciona para /client ou /admin
```

O cadastro local (`POST /auth/register`) valida os dados, rejeita e-mail repetido, aplica hash bcrypt com custo 10 e cria por padrão um usuário `USER`.

### 5.2 Consulta de disponibilidade e criação de agendamento

**Tipo:** diagrama UML de sequência.

**Resumo:** mostra que a disponibilidade exibida no frontend é apenas uma prévia. Na criação, o backend verifica novamente endereço, serviços, expediente, folgas e colisões dentro de uma transação serializável, e grava os serviços na tabela associativa.

```mermaid
sequenceDiagram
    actor Cliente
    participant UI as ScheduleController
    participant HTTP as Axios + interceptor JWT
    participant API as Controllers NestJS
    participant Guard as JwtAuthGuard
    participant Av as AvailabilityService
    participant Ap as AppointmentsService
    participant DB as PostgreSQL via Prisma

    par Dados iniciais
        UI->>HTTP: GET /catalog
        HTTP->>API: catálogo público
        API->>DB: SELECT catalog_items
        DB-->>UI: serviços
    and Endereços do usuário
        UI->>HTTP: GET /addresses
        HTTP->>Guard: Authorization Bearer JWT
        Guard-->>API: req.user
        API->>DB: SELECT addresses WHERE userId = token.sub
        DB-->>UI: endereços
    end

    Cliente->>UI: seleciona serviços e data
    UI->>HTTP: GET /availability?date&catalogItemIds
    HTTP->>API: consulta pública validada por DTO
    API->>Av: getAvailability
    Av->>DB: lê catálogo, folga, expediente e agendamentos ativos
    DB-->>Av: dados do dia
    Av-->>UI: availableSlots
    Cliente->>UI: escolhe horário/endereço e confirma
    UI->>HTTP: POST /appointments + Bearer JWT
    HTTP->>Guard: autenticar token
    Guard-->>API: clientId = token.sub
    API->>Ap: create(clientId, dto)
    Ap->>DB: BEGIN SERIALIZABLE
    Ap->>DB: confirma que endereço pertence ao cliente
    Ap->>Av: assertSlotIsAvailable
    Av->>DB: recalcula duração e colisões
    Av-->>Ap: duração total ou conflito
    Ap->>DB: INSERT appointment e appointment_catalog_items
    Ap->>DB: COMMIT
    DB-->>Ap: agendamento completo
    Ap-->>UI: 201 JSON
    UI-->>Cliente: sucesso e retorno ao dashboard
```

O horário é persistido como `DateTime`; as regras de negócio usam `BUSINESS_TIME_ZONE` (padrão `America/Sao_Paulo`) para interpretar o dia e a hora comercial. A duração total é copiada para o agendamento como um snapshot e é usada para detectar sobreposição futura. Os horários candidatos avançam em passos iguais à duração total da seleção, portanto a grade disponível pode mudar quando o cliente adiciona ou remove um serviço.

### 5.3 Mutação administrativa offline e sincronização

**Tipo:** diagrama UML de sequência.

**Resumo:** detalha a estratégia offline do painel administrativo. A UI é atualizada otimisticamente. Se não houver rede — ou se uma tentativa Axios falhar sem resposta HTTP — a mutação e o JWT são gravados no IndexedDB; nas criações, a UI também gera um UUID idempotente. A fila é processada em ordem pela página ou pelo Service Worker.

```mermaid
sequenceDiagram
    actor Admin
    participant Ctrl as Controller ADMIN
    participant Cache as IndexedDB snapshots
    participant Queue as IndexedDB mutations
    participant Bridge as adminOffline.client
    participant SW as Service Worker
    participant API as API NestJS
    participant DB as PostgreSQL

    Admin->>Ctrl: cria, edita ou exclui
    Ctrl->>Ctrl: aplica atualização otimista
    Ctrl->>Cache: atualiza snapshot local

    alt Online e API responde
        Ctrl->>API: REST + Bearer JWT
        API->>DB: valida e persiste
        DB-->>API: resultado
        API-->>Ctrl: estado confirmado
    else Offline ou erro sem resposta
        Ctrl->>Bridge: queueAdminMutation
        Bridge->>Queue: grava mutação pending
        Bridge->>SW: registra Background Sync
    end

    Note over SW,Queue: evento online, sync ou mensagem explícita
    SW->>Queue: claim da próxima mutação
    Queue-->>SW: mutação processing com lease
    SW->>API: fetch(path, method, body, Bearer JWT)
    API->>DB: revalida autorização e regra de negócio

    alt HTTP 2xx ou DELETE já aplicado com 404
        API-->>SW: sucesso
        SW->>Queue: remove mutação
        SW->>Cache: invalida snapshot afetado
        SW-->>Ctrl: notifica resultado
        Ctrl->>API: recarrega fonte autoritativa
    else Erro HTTP de regra/autorização
        API-->>SW: 4xx/5xx com resposta
        SW->>Queue: remove mutação rejeitada
        SW->>Cache: invalida snapshot
        SW-->>Ctrl: informa falha
        Ctrl->>API: recarrega e desfaz estado otimista divergente
    else Rede ainda indisponível
        SW->>Queue: devolve mutação para pending
        SW->>SW: agenda nova tentativa
    end
```

O cache offline cobre snapshots de `appointments`, `appointment-clients`, `catalog`, `inventory`, `business-hours` e `days-off`. As leituras comuns do cliente não possuem cache de API próprio; o Workbox precacheia os assets da aplicação e oferece fallback de navegação para `index.html`.

### 5.4 Mapa da API REST e permissões

**Tipo:** diagrama de comunicação por interfaces, complementado por matriz de endpoints.

**Resumo:** agrupa os recursos HTTP acessados pelo frontend e indica onde são aplicados JWT e papel administrativo.

```mermaid
flowchart LR
    PUBLIC[Visitante / chamadas públicas] --> AUTH["/auth"]
    PUBLIC --> CATALOG["/catalog — leitura"]
    PUBLIC --> AVAIL["/availability"]

    USER[JWT USER] --> ADDRESSES["/addresses"]
    USER --> MYAPPTS["/appointments — próprios"]

    ADMIN[JWT ADMIN] --> USERS["/users/clients"]
    ADMIN --> ALLAPPTS["/appointments/admin e /all"]
    ADMIN --> CATALOGWRITE["/catalog — escrita"]
    ADMIN --> HOURS["/business-hours"]
    ADMIN --> OFF["/days-off"]
    ADMIN --> INV["/inventory"]

    AUTH --> API[Controllers NestJS]
    CATALOG --> API
    AVAIL --> API
    ADDRESSES --> API
    MYAPPTS --> API
    USERS --> API
    ALLAPPTS --> API
    CATALOGWRITE --> API
    HOURS --> API
    OFF --> API
    INV --> API
```

| Recurso | Operações implementadas | Acesso efetivo |
|---|---|---|
| `/` | `GET` de saúde/mensagem da API | Público |
| `/auth/register` | `POST` | Público |
| `/auth/login` | `POST` | Público |
| `/auth/google` | `POST` | Público, com ID token Google |
| `/catalog`, `/catalog/:id` | `GET` | Público |
| `/catalog`, `/catalog/:id` | `POST`, `PATCH`, `DELETE` | JWT + `ADMIN` |
| `/availability` | `GET` com `date` e `catalogItemIds` | Público |
| `/addresses`, `/addresses/:id` | `POST`, `GET`, `PATCH`, `DELETE` | JWT; operações limitadas ao `userId` do token |
| `/appointments` | `POST`, `GET` | JWT; cria/lista para o `sub` do token |
| `/appointments/admin` | `POST` | JWT + `ADMIN` |
| `/appointments/all`, `/appointments/:id` | `GET` | JWT + `ADMIN` |
| `/appointments/:id` | `PUT`, `DELETE` | JWT + `ADMIN` |
| `/appointments/:id/status` | `PATCH` | JWT + `ADMIN` |
| `/users/clients`, `/users/admin-dashboard` | `GET` | JWT + `ADMIN` |
| `/business-hours`, `/business-hours/:id` | `GET`, `POST`, `PUT`, `DELETE` | JWT + `ADMIN` |
| `/days-off`, `/days-off/:id` | `GET`, `POST`, `DELETE` | JWT + `ADMIN` |
| `/inventory`, `/inventory/:id`, `/inventory/:id/quantity` | `GET`, `POST`, `PATCH`, `DELETE` | JWT + `ADMIN` |
| `/api` | Interface Swagger/OpenAPI | Sem guard global na implementação atual |

## 6. Modelagem atual do PostgreSQL

### 6.1 Diagrama entidade-relacionamento físico

**Tipo:** diagrama ER (entidade-relacionamento) da modelagem física atual.

**Resumo:** contém todas as oito tabelas definidas pelo Prisma e suas chaves. O relacionamento entre agendamentos e serviços é muitos-para-muitos por `appointment_catalog_items`. Expediente, folgas e inventário são tabelas independentes, consultadas por regra de negócio e sem chave estrangeira para outras entidades.

```mermaid
erDiagram
    USER {
        string id PK
        string name
        string email UK
        string password "nullable"
        string googleId UK "nullable"
        string phone "nullable"
        Role role
    }

    ADDRESS {
        string id PK
        string street
        string number
        string complement "nullable"
        string neighborhood
        string city
        string state
        string zipCode "nullable"
        string userId FK
    }

    CATALOG_ITEM {
        string id PK
        string name
        string description "nullable"
        decimal price "Decimal 10,2"
        int durationMinutes
        datetime createdAt
        datetime updatedAt
    }

    APPOINTMENT {
        string id PK
        datetime scheduledAt
        int durationMinutes "snapshot"
        AppointmentStatus status
        string clientId FK
        string addressId FK "nullable no banco"
    }

    APPOINTMENT_CATALOG_ITEM {
        string appointmentId PK, FK
        string catalogItemId PK, FK
    }

    BUSINESS_HOUR {
        string id PK
        int dayOfWeek UK "0 domingo a 6 sábado"
        string openTime
        string closeTime
        string breakStart "nullable HH:mm"
        string breakEnd "nullable HH:mm"
    }

    DAY_OFF {
        string id PK
        date date UK
        string reason "nullable"
    }

    INVENTORY_ITEM {
        string id PK
        string name
        ItemCategory category
        int minRecommended
        int quantity
        datetime createdAt
        datetime updatedAt
    }

    USER ||--o{ ADDRESS : possui
    USER ||--o{ APPOINTMENT : agenda
    ADDRESS o|--o{ APPOINTMENT : local_de_atendimento
    APPOINTMENT ||--o{ APPOINTMENT_CATALOG_ITEM : contém
    CATALOG_ITEM ||--o{ APPOINTMENT_CATALOG_ITEM : participa
```

Embora `addressId` seja anulável no schema físico por compatibilidade, os DTOs atuais de criação e edição exigem um endereço, e o service confirma que ele pertence ao cliente selecionado.

### 6.2 Modelo lógico por domínio e influência na disponibilidade

**Tipo:** diagrama UML de classes conceituais/modelo lógico.

**Resumo:** evidencia relações que não são chaves estrangeiras. `BusinessHour` e `DayOff` influenciam o cálculo por dia; os agendamentos ativos ocupam intervalos; a soma das durações dos serviços define o tamanho de cada slot. `InventoryItem` permanece isolado do agendamento.

```mermaid
flowchart LR
    USER[User\nrole USER ou ADMIN] -->|1:N| ADDRESS[Address]
    USER -->|1:N como client| APPOINTMENT[Appointment]
    ADDRESS -->|0..1 por agendamento| APPOINTMENT
    APPOINTMENT -->|N:N por tabela associativa| CATALOG[CatalogItem]
    CATALOG -->|soma de durationMinutes| ENGINE[Motor de disponibilidade]
    HOURS[BusinessHour\nexpediente e intervalo] -->|dia da semana| ENGINE
    OFF[DayOff\nfolga ou feriado] -->|bloqueia a data| ENGINE
    APPOINTMENT -->|PENDING e CONFIRMED ocupam faixa| ENGINE
    ENGINE -->|valida scheduledAt e duração| APPOINTMENT
    INVENTORY[InventoryItem] -. domínio independente .-> ADMIN[Gestão ADMIN]
```

### 6.3 Enums persistidos

**Tipo:** diagrama UML de enumerações.

**Resumo:** lista os valores fechados usados pelo PostgreSQL/Prisma para autorização, estado dos agendamentos e classificação do estoque.

```mermaid
classDiagram
    class Role {
        <<enumeration>>
        USER
        ADMIN
    }

    class AppointmentStatus {
        <<enumeration>>
        PENDING
        CONFIRMED
        COMPLETED
        CANCELED
    }

    class ItemCategory {
        <<enumeration>>
        RETORNAVEIS
        DESCARTAVEIS
        COSMETICOS
    }

    class User
    class Appointment
    class InventoryItem

    User --> Role : role
    Appointment --> AppointmentStatus : status
    InventoryItem --> ItemCategory : category
```

### 6.4 Chaves, índices e regras de integridade

| Tabela | Integridade relevante |
|---|---|
| `users` | PK UUID; `email` e `googleId` únicos; `role` padrão `USER`; senha é opcional para contas Google |
| `addresses` | FK `userId → users.id` com `ON DELETE CASCADE` |
| `catalog_items` | Preço `DECIMAL(10,2)`; timestamps automáticos pelo Prisma |
| `appointments` | FKs para cliente e endereço com restrição de exclusão; índice composto em `(scheduledAt, status)`; `status` padrão `PENDING` |
| `appointment_catalog_items` | PK composta `(appointmentId, catalogItemId)`; cascade ao excluir agendamento; restrict ao excluir serviço; índice por `catalogItemId` |
| `business_hours` | Um registro por `dayOfWeek` por meio de índice único |
| `days_off` | Uma folga por `date` por meio de índice único |
| `inventory_items` | Índice em `(category, name)` e checks SQL que impedem `minRecommended` e `quantity` negativos |

Regras adicionais vivem na aplicação: não repetir serviços em um agendamento, limitar a seleção a 20 itens, impedir colisão de intervalos, exigir horário futuro, validar intervalo dentro do expediente, impedir quantidade negativa e usar UUID enviado pelo cliente nas criações administrativas offline para obter idempotência por `upsert`/reconhecimento de registro já existente.

## 7. Fluxo de dados resumido por funcionalidade

| Funcionalidade | Frontend | Backend | Tabelas principais |
|---|---|---|---|
| Cadastro/login | Auth Controllers, AuthContext, `auth.service.ts` | AuthService, UsersService, JWT/Google/bcrypt | `users` |
| Endereços | Client Addresses Controller e service | AddressesService | `addresses`, `users` |
| Catálogo | Client scheduling e Admin Catalog | CatalogService | `catalog_items`, `appointment_catalog_items` |
| Disponibilidade | Schedule do cliente | AvailabilityService | `catalog_items`, `business_hours`, `days_off`, `appointments` |
| Agendamentos | Dashboard/Schedule do cliente e Agenda admin | AppointmentsService + AvailabilityService | `appointments`, `appointment_catalog_items`, `users`, `addresses`, `catalog_items` |
| Configuração do negócio | BusinessSettings admin | BusinessSettingsService | `business_hours`, `days_off` |
| Estoque | Inventory Context/Controller/hook | InventoryService | `inventory_items` |
| Offline administrativo | snapshots, fila, Service Worker | Mesmos endpoints protegidos; idempotência nos POSTs suportados | IndexedDB local e tabelas do domínio sincronizado |

## 8. Observações sobre o estado atual

- A aplicação é **single-professional**: não existe entidade de barbeiro/profissional associada a agenda, catálogo ou expediente.
- Pagamentos, navegação GPS e recuperação de senha não estão implementados no código atual.
- A Landing Page exibe um catálogo estático demonstrativo; o catálogo persistido é consumido no wizard do cliente e no painel admin.
- A proteção existe em duas camadas: redirecionamento por papel no React Router e autorização efetiva com JWT/`AdminGuard` na API.
- O catálogo e o endereço usados por um agendamento não podem ser excluídos enquanto estiverem associados. A duração é preservada no próprio agendamento; nome/preço do serviço e campos do endereço continuam sendo lidos das entidades relacionadas atuais.
- A documentação Swagger é montada em `/api`; os DTOs e o `ValidationPipe` removem propriedades não declaradas e rejeitam campos extras.
- O PWA oferece shell instalável e suporte offline administrativo, mas o backend e o PostgreSQL continuam sendo a fonte autoritativa dos dados sincronizados.
