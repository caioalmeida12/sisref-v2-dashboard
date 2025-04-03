# 🍽️ SisRef - Sistema de Refeitório RU Cedro

![NextJS](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![React Query](https://img.shields.io/badge/React_Query-FF4154?style=for-the-badge&logo=react-query&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

> Sistema integrado para gestão do Restaurante Universitário - Campus Cedro

## 📑 Sumário

- [Visão Geral](#-visão-geral)
- [Tecnologias](#-tecnologias)
- [Arquitetura](#-arquitetura)
- [Perfis de Usuário](#-perfis-de-usuário)
- [Funcionalidades](#-funcionalidades-do-sistema)
- [Fluxos de Trabalho](#-fluxos-de-trabalho)
- [Capturas de Tela](#-capturas-de-tela)
- [Configuração](#-configuração-do-projeto)
- [Desenvolvimento](#-desenvolvimento)
- [Padrões de Código](#-padrões-de-código)
- [Testes](#-testes)
- [Contribuição](#-contribuição)
- [FAQ](#-faq)

## 🌟 Visão Geral

O SisRef é um sistema para gestão do Restaurante Universitário do Campus Cedro, integrando agendamentos de refeições, controle de acess. A plataforma atende diferentes perfis de usuários, desde estudantes até equipes administrativas, proporcionando uma gestão eficiente e do refeitório universitário.

### Objetivos Principais

- **Otimização de Recursos**: Reduzir desperdício alimentar e melhorar planejamento
- **Automação de Processos**: Eliminar controles manuais e burocráticos
- **Experiência do Usuário**: Facilitar agendamentos e acesso ao refeitório
- **Gestão Informativa**: Prover dados e relatórios para tomada de decisão

## 🧩 Tecnologias

### Core Stack
- **Next.js 14** com App Router para SSR e RSC
- **TypeScript** para tipagem estática e segurança
- **Tailwind CSS** para estilização responsiva
- **TanStack Query** para gerenciamento de estado e cache
- **API RESTful** para comunicação com backend

### Bibliotecas e Ferramentas
- **Shadcn UI** - Componentes personalizáveis baseados em Radix UI
- **Radix UI** - Primitivos de UI acessíveis e customizáveis
- **Zod** - Validação e tipagem em runtime
- **Nuqs** - Gerenciamento de query params persistentes
- **TanStack Table** - Tabelas com ordenação, filtragem e paginação
- **React Hook Form** - Gerenciamento de formulários
- **Lucide React** - Ícones consistentes e escaláveis
- **React Loading Skeleton** - Feedback visual de carregamento
- **JWT** - Autenticação baseada em tokens
- **Roboto Slab** - Família tipográfica principal

## 🏗️ Arquitetura

### Estrutura de Diretórios

```
src/
├── app/                              # Módulo principal Next.js App Router
│   ├── (paginas)/                    # Grupos de rotas por perfil de usuário
│   │   ├── (administrativas)/        # Perfis administrativos
│   │   │   ├── administrador/        # Páginas de administrador
│   │   │   ├── assistencia_estudantil/
│   │   │   ├── nutricionista/
│   │   │   └── recepcao/
│   │   └── (estudante)/              # Páginas para perfil estudante
│   ├── actions/                      # Server Actions para operações de dados
│   ├── elementos/                    # Componentes da aplicação
│   │   ├── componentes/              # Componentes básicos reutilizáveis
│   │   ├── modulos/                  # Componentes específicos por módulo
│   │   └── shadcn/                   # Componentes do Shadcn UI
│   ├── interfaces/                   # Interfaces e tipos TypeScript
│   ├── lib/                          # Lógica de negócio e utilitários
│   │   ├── actions/                  # Helpers para comunicação com API
│   │   ├── elementos/                # Utilitários e auxiliares
│   │   └── middlewares/              # Middlewares para autenticação
│   ├── api/                          # Route Handlers da API
│   └── globals.css                   # Estilos globais
└── middleware.ts                     # Middleware central do Next.js
```

### Diagrama de Arquitetura

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│                 │      │                 │      │                 │
│  Camada de UI   │◄────►│  Lógica de App  │◄────►│  API RESTful    │
│  (Componentes)  │      │  (Server Actions)│      │  (Backend)      │
│                 │      │                 │      │                 │
└─────────────────┘      └─────────────────┘      └─────────────────┘
        ▲                       ▲                         ▲
        │                       │                         │
        ▼                       ▼                         ▼
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│                 │      │                 │      │                 │
│  Estado Local   │      │  React Query    │      │  Auth/Sessão    │
│  (Hooks)        │      │  (Cache)        │      │  (JWT)          │
│                 │      │                 │      │                 │
└─────────────────┘      └─────────────────┘      └─────────────────┘
```

### Padrão de Autenticação

O sistema implementa autenticação baseada em tokens JWT armazenados em cookies, com validação em todas as rotas protegidas através de middleware centralizado:

```typescript
// Fluxo de autenticação:
1. Requisição interceptada pelo middleware central
2. Token JWT verificado nos cookies do navegador
3. Se inválido/expirado, redirecionamento para página de login
4. Se válido, verificação adicional de autorização por perfil
5. Acesso concedido apenas a rotas permitidas para o perfil do usuário
```

### Padrão de Comunicação com API

O SisRef utiliza uma abstração robusta para comunicação com backend via:

```typescript
// Exemplo de método de API usando FetchHelper
export async function buscarRelatorioDeDesperdicio({
  data_inicial,
  data_final,
}: {
  data_inicial?: string;
  data_final?: string;
}) {
  const resposta = await FetchHelper.get<unknown>({
    rota: "/food-waste/report",
    cookies: await cookies(),
    params: { start_date: data_inicial, end_date: data_final },
  });

  if (!resposta.sucesso) {
    return { sucesso: false, mensagem: resposta.message };
  }

  return {
    sucesso: true,
    resposta: resposta.resposta,
  };
}
```

## 👥 Perfis de Usuário

### 👨‍🎓 Estudante
- Visualização de cardápios diários
- Agendamento de refeições
- Acompanhamento de histórico
- Justificativas de ausências

### 👨‍💼 Administrador
- Gerenciamento de usuários
- Configurações gerais do sistema
- Visão global das operações

### 👩‍🔬 Nutricionista
- Gestão de cardápios
- Relatórios de refeições servidas
- Monitoramento de desperdício alimentar
- Estatísticas de consumo

### 👩‍🎓 Assistência Estudantil
- Gestão de estudantes e cursos
- Gerenciamento de permissões de refeição
- Análise de justificativas
- Relatórios personalizados

### 🛎️ Recepção
- Confirmação de presença
- Controle de acesso ao refeitório
- Relatórios diários de refeições servidas

## 📊 Funcionalidades do Sistema

### Sistema de Agendamentos
- Agendamento prévio de refeições pelos estudantes
- Controle de elegibilidade por dia e tipo de refeição
- Justificativas para ausências com workflow de aprovação
- Dashboard para acompanhamento de agendamentos

### Gestão de Cardápios
- Cadastro detalhado de refeições por tipo e data
- Visualização de cardápio semanal
- Informações nutricionais
- Vínculo com sistema de desperdício

### Sistema de Relatórios
- **Relatórios de Refeições**: Consumo por período, curso, turno
- **Relatórios de Desperdício**: Monitoramento de resíduos alimentares
- **Relatórios de Presença**: Comparativo entre agendamentos e presenças efetivas
- Exportação de dados para análise externa

### Gestão de Autorizações de Refeições
- Controle individualizado de permissões por estudante
- Configuração de dias da semana permitidos
- Associação com cursos e turnos específicos
- Sistema de comentários e anotações

### Controle de Desperdício
- Registro detalhado de desperdício por cardápio
- Análise quantitativa por período
- Integração com sistema de cardápios
- Metas e indicadores de sustentabilidade

## 🔄 Fluxos de Trabalho

### Fluxo de Agendamento de Refeição
1. Estudante acessa plataforma com credenciais
2. Visualiza cardápio disponível para a semana
3. Seleciona refeições desejadas nos dias permitidos
4. Sistema valida elegibilidade conforme regras configuradas
5. Confirmação de agendamento com QR Code

### Fluxo de Controle de Desperdício
1. Nutricionista registra cardápio semanal
2. Após refeição, equipe registra quantidade de alimento desperdiçado
3. Sistema vincula desperdício ao cardápio específico
4. Geração de relatórios e métricas para análise
5. Identificação de padrões para otimização de porções

### Fluxo de Autorização de Refeições
1. Equipe de assistência estudantil acessa perfil do estudante
2. Configura dias e refeições permitidas individualmente
3. Adiciona comentários/justificativas quando necessário
4. Sistema aplica regras nas solicitações de agendamento
5. Monitoramento de utilização por estudante

## 📸 Capturas de Tela

### Dashboard do Estudante
Interface principal onde o estudante visualiza seu histórico e realiza novos agendamentos.

### Tela de Gestão de Cardápio
Interface onde nutricionistas gerenciam o cardápio semanal e associam informações nutricionais.

### Relatório de Desperdícios
Visão gerencial para acompanhamento e controle de desperdício alimentar.

### Painel de Autorizações
Interface para configuração granular das permissões de refeição por estudante.

## 🚀 Configuração do Projeto

### Pré-requisitos
- Node.js 18.x ou superior
- NPM ou Yarn
- Acesso à API do SisRef

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/sisref-v2-dashboard.git
cd sisref-v2-dashboard

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local
# Edite o arquivo .env.local com as configurações necessárias

# Inicie o servidor de desenvolvimento
npm run dev
```

### Variáveis de Ambiente

```env
# URL base da API
URL_BASE_API=http://localhost:3333

# Configurações de autenticação
JWT_SECRET=chave_secreta_jwt

# Ambiente
NODE_ENV=development

# Configuração de logs (opcional)
LOG_LEVEL=info

# Porta do servidor (opcional)
PORT=3000
```

## 💻 Desenvolvimento

### Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Produção
npm start

# Lint
npm run lint

# Verificação de tipos
npm run typecheck

# Testes
npm run test
```

### Estrutura de Tipos e Interfaces

O sistema utiliza TypeScript com tipagem forte para garantir consistência e prevenir erros:

```typescript
// Exemplo de interface para modelo de dados
interface TRelatorioDeRefeicoes {
  id: number;
  name: string;
  mat: string;
  menu_id: number;
  menu_description: string;
  meal_id: number;
  meal_description: string;
  date: string;
}

// Schema Zod para validação em runtime
const TRelatorioDeRefeicoesSchema = z.object({
  id: z.number(),
  name: z.string(),
  mat: z.string(),
  menu_id: z.number(),
  menu_description: z.string(),
  meal_id: z.number(),
  meal_description: z.string(),
  date: z.string(),
});
```

## 📝 Padrões de Código

### Convenções de Nomenclatura

- **Componentes**: PascalCase (Ex: `TabelaDeDados.tsx`)
- **Hooks**: camelCase com prefixo 'use' (Ex: `useQueryStates`)
- **Interfaces/Types**: Prefixo 'I' para interfaces, 'T' para types (Ex: `IRespostaPaginada`, `TUsuario`)
- **Schemas Zod**: Sufixo 'Schema' (Ex: `TUsuarioSchema`)
- **Server Actions**: camelCase descritivo (Ex: `buscarRelatorioDeDesperdicio`)

### Padrões de UI

- **Estilização**: Classes de utilidade Tailwind CSS diretamente nos elementos
- **Responsividade**: Design mobile-first com breakpoints em SM, MD, LG e XL
- **Acessibilidade**: Componentes acessíveis via Radix UI e marcação semântica
- **Feedback Visual**: Estados de carregamento, erro e sucesso para todas interações
- **Consistência**: Uso de tokens de design para cores, espaçamentos e tipografia

### Padrões de Estado

- **Estado Local**: React useState e useReducer
- **Estado de Servidor**: React Query para fetchs e cache
- **Estado de URL**: Parâmetros de consulta via Nuqs para persistência
- **Estado Global**: Context API para informações compartilhadas entre componentes

## 🧪 Testes

### Estrutura de Testes

- **Testes de Unidade**: Funções e hooks isolados
- **Testes de Componentes**: Renderização e interações de componentes
- **Testes de Integração**: Fluxos completos de usuário
- **Testes de E2E**: Simulação de uso real em ambiente de teste

### Executando Testes

```bash
# Executar todos os testes
npm run test

# Executar testes com watch mode
npm run test:watch

# Executar testes com coverage
npm run test:coverage
```

## 🤝 Contribuição

Para contribuir com o projeto:

1. Crie um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Faça commit das alterações (`git commit -m 'Adiciona nova funcionalidade'`)
4. Envie para o GitHub (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

### Padrão de Commits

Seguimos o padrão [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Alterações na documentação
- `style:` - Alterações que não afetam o código (formatação, etc)
- `refactor:` - Refatoração de código existente
- `perf:` - Melhorias de performance
- `test:` - Adição ou correção de testes
- `chore:` - Alterações no processo de build ou ferramentas auxiliares

## ❓ FAQ

### Como adicionar um novo tipo de refeição ao sistema?

Para adicionar um novo tipo de refeição, é necessário:
1. Adicionar o novo tipo no backend
2. Atualizar os schemas Zod correspondentes
3. Atualizar os componentes de visualização de cardápio
4. Atualizar os formulários de agendamento

### Como personalizar as regras de agendamento?

As regras de agendamento são configuráveis através do módulo de Assistência Estudantil:
1. Acesse o perfil do estudante
2. Configure as refeições autorizadas por dia da semana
3. Adicione comentários/observações quando necessário

### Como gerar relatórios personalizados?

O sistema possui módulos específicos para relatórios, acessíveis pelos perfis administrativos:
1. Acesse o módulo de relatórios correspondente
2. Defina os filtros desejados (período, curso, turno, etc)
3. Visualize os dados na interface ou exporte para análise externa

## 📄 Licença

Este projeto é licenciado sob a licença MIT - veja o arquivo [LICENSE.md](LICENSE.md) para detalhes.

---

Desenvolvido pela equipe de estudante do Campus Cedro 💚
- [Caio](https://github.com/caioalmeida12)
- [Luan](https://github.com/LuanF11)
- [Kayky](https://github.com/Kaykbr)

