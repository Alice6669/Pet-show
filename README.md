# 🐾 Pet Show

Uma plataforma completa de e-commerce para produtos e serviços para animais de estimação, desenvolvida com React, Node.js e MySQL. A aplicação oferece uma experiência de compra intuitiva com sistema de autenticação, carrinho de compras e gestão de perfil de usuário.

## 📋 Sobre o Projeto

Pet Show é um marketplace especializado em produtos para pets (gatos, cachorros, pássaros, répteis e peixes). O projeto integra um frontend moderno com React e um backend robusto com Node.js/Express, conectado a um banco de dados MySQL com sistema de backup automático via triggers.

## 📦 Composição do Repositório

### 🗂️ Estrutura Principal

```
Pet-show/
├── DB_pet_show.sql                 # Script SQL do banco de dados
├── Site/                           # Diretório principal da aplicação
│   ├── package.json               # Dependências do projeto
│   ├── package-lock.json          # Lock file das dependências
│   ├── node_modules/              # Módulos Node.js (não versionado)
│   └── Pet show/                  # Aplicação React
│       ├── index.html             # Ponto de entrada HTML
│       ├── vite.config.js         # Configuração do Vite
│       ├── eslint.config.js       # Configuração ESLint
│       ├── package.json           # Dependências da app
│       ├── package-lock.json      # Lock file
│       ├── comandos.txt           # Comandos úteis de desenvolvimento
│       ├── .gitignore             # Arquivos ignorados pelo git
│       ├── README.md              # Documentação da app
│       ├── public/                # Arquivos estáticos
│       ├── src/                   # Código-fonte React
│       └── backend/               # API Node.js
```

---

## 📁 Descrição das Pastas

### 1. **`DB_pet_show.sql`** 📊
- **Função**: Script completo para criar o banco de dados MySQL
- **Conteúdo**:
  - Tabelas principais: `Pessoa`, `Telefone`, `Endereco`, `Produto`, `Fornecedor`, `Cliente`, `FornecedorProduto`, `ClienteProduto`
  - Banco de dados de backup (`BK_DB_pet_show`) com triggers automáticos para auditoria
  - Triggers para rastrear inserts, updates e deletes
  - Dados iniciais (seed data) com usuários, endereços e produtos
- **Modelos de Pet**: Gato, Cachorro, Pássaro, Réptil, Peixe
- **Categorias de Produtos**: Comida, Brinquedo, Casa

### 2. **`Site/`** 🌐
Diretório raiz do projeto frontend e backend

#### 2.1 **`Site/Pet show/`** ⚛️ (Aplicação React + Vite)

##### 📁 **`public/`** 🖼️
Arquivos estáticos públicos:
- `logo.png` - Logo da aplicação Pet Show
- `carrinho.png` - Ícone do carrinho de compras
- `setaLeft.png` - Seta esquerda (carrossel)
- `setaRight.png` - Seta direita (carrossel)

##### 📁 **`src/`** 💻 (Código-fonte)

###### **`src/componentes/`** 🧩
Componentes React reutilizáveis:
- **`busca.jsx` / `busca.css`**: Campo de busca de produtos
- **`carrocelDescontos.jsx` / `carrocelDescontos.css`**: Carrossel de produtos com desconto
- **`headerPrincipal.jsx` / `headerPrincipal.css`**: Cabeçalho da aplicação com navegação
- **`footer.jsx` / `footer.css`**: Rodapé da aplicação
- **`listaProdutos.jsx` / `listaProdutos.css`**: Lista de produtos com exibição em cards
- **`userContext.jsx`**: Context API para gerenciar dados do usuário autenticado
- **`privateRoutes.jsx`**: Componente para rotas privadas (requer autenticação)

###### **`src/pages/`** 📄
Páginas de autenticação:
- **`Login.jsx` / `Login.css`**: Página de login de usuários
- **`Cadastro.jsx` / `Cadastro.css`**: Formulário de registro de novos usuários
- **`Blog.jsx` / `Blog.css`**: Página com conteúdo/artigos sobre pets

###### **`src/routes/`** 🛣️
Páginas principais da aplicação:
- **`home.jsx` / `home.css`**: Página inicial com apresentação da plataforma
- **`produtos.jsx` / `produtos.css`**: Catálogo completo de produtos com filtros
- **`carrinho.jsx` / `carrinho.css`**: Carrinho de compras com cálculo de totais
- **`DadosContato.jsx`**: Página de dados de contato e checkout
- **`minhaConta.jsx` / `minhaConta.css`**: Perfil do usuário e histórico de compras
- **`Fornecedor.jsx` / `Fornecedor.css`**: Painel do fornecedor para gerenciar produtos
- **`contato.jsx` / `contato.css`**: Formulário de contato/suporte
- **`sobre.jsx` / `sobre.css`**: Página sobre a empresa Pet Show
- **`erroPage.jsx` / `erroPage.css`**: Página 404 para rotas não encontradas

###### **`src/assets/`** 🎨
Recursos de design (ícones, imagens)

###### **`src/imgs/`** 🖼️
Imagens usadas na aplicação

###### **`src/hooks/`** 🪝
Custom hooks React (para lógica reutilizável)

###### **Arquivos principais do `src/`**:
- **`App.jsx`**: Componente raiz com configuração de rotas
- **`main.jsx`**: Ponto de entrada da aplicação React
- **`index.css`**: Estilos globais
- **`App.css`**: Estilos do componente App

##### **`backend/`** 🖥️ (API Node.js/Express)

###### **`backend/server.js`** 🚀
Servidor Express principal:
- Configuração do servidor HTTP
- Definição de rotas da API
- Endpoints para autenticação (login, cadastro)
- CRUD de produtos
- Gestão do carrinho
- Processamento de pedidos
- Integração com banco de dados MySQL

###### **`backend/db.js`** 🗄️
Módulo de conexão com MySQL:
- Configuração da conexão com banco de dados
- Pool de conexões
- Execução de queries

###### **`backend/package.json`**
Dependências do backend:
- `express`: Framework web
- `mysql2`: Driver MySQL
- `cors`: Cors para requisições cross-origin
- `dotenv`: Variáveis de ambiente

###### **Dependências de desenvolvimento**
- `@vitejs/plugin-react`: Plugin React para Vite
- `vite`: Build tool de próxima geração

#### 2.2 **`Site/node_modules/`** 📦
Módulos Node.js instalados (gerados pelo npm install)

#### 2.3 **`Site/package.json`** ⚙️
Dependências gerais do projeto com scripts:
- `dev`: Inicia servidor de desenvolvimento Vite
- `start`: Inicia o servidor backend
- `build`: Build para produção
- `preview`: Visualiza o build
- `test`: Testes

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Uso |
|-----------|-----|
| **React 18** | Frontend UI e componentes |
| **Vite** | Build tool e dev server |
| **Node.js/Express** | Backend e API REST |
| **MySQL 2** | Banco de dados |
| **React Router DOM** | Roteamento na SPA |
| **CORS** | Política de requisições cross-origin |
| **dotenv** | Variáveis de ambiente |

---

## 🚀 Como Começar

### Pré-requisitos
- Node.js (v16+)
- MySQL Server
- Git

### Instalação

1. **Clone o repositório**:
```bash
git clone https://github.com/Alice6669/Pet-show.git
cd Pet-show
```

2. **Configure o banco de dados**:
```bash
# Abra MySQL e execute:
mysql -u root -p < DB_pet_show.sql
```

3. **Instale dependências do Site**:
```bash
cd Site
npm install
```

4. **Instale dependências do backend**:
```bash
cd "Pet show"/backend
npm install
```

5. **Configure variáveis de ambiente**:
Crie arquivo `.env` no backend com:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=DB_pet_show
PORT=3001
```

6. **Inicie o backend**:
```bash
npm start
```

7. **Em outro terminal, inicie o frontend**:
```bash
cd "Pet show"
npm run dev
```

Acesse `http://localhost:5173` no navegador.

---

## 📊 Modelos de Dados

### Tabelas Principais

- **Pessoa**: Usuários (clientes e fornecedores)
- **Cliente**: Extensão de Pessoa com CPF, datas
- **Fornecedor**: Extensão de Pessoa com CNPJ
- **Produto**: Catálogo de produtos (alimentos, brinquedos, casas)
- **Telefone**: Contatos (TEL, CEL, COM)
- **Endereco**: Endereços associados a usuários
- **ClienteProduto**: Pedidos dos clientes
- **FornecedorProduto**: Estoque dos fornecedores

### Backup Automático
Triggers mantêm histórico completo em `BK_DB_pet_show` com status de operação (C=Create, U=Update, D=Delete)

---

## 📝 Scripts Úteis

Veja `Site/Pet show/comandos.txt` para lista de comandos úteis de desenvolvimento.

---

## 👥 Fluxo de Usuários

1. **Visitante**: Visualiza produtos e blog
2. **Novo Cliente**: Se cadastra no formulário
3. **Cliente Autenticado**: Adiciona produtos ao carrinho, realiza compra
4. **Fornecedor**: Gerencia seus produtos e estoque

---

## 🎨 Funcionalidades Principais

✅ Autenticação de usuários (Login/Cadastro)  
✅ Catálogo de produtos com filtros  
✅ Carrinho de compras funcional  
✅ Gestão de perfil do usuário  
✅ Painel de fornecedor  
✅ Carrossel de produtos em desconto  
✅ Sistema de busca de produtos  
✅ Página de contato  
✅ Blog/Artigos sobre pets  
✅ Responsivo para mobile

---

## 📄 Licença

ISC

---

## 👤 Autor

**Alice6669** - [@Alice6669](https://github.com/Alice6669)

---

<div align="center">

**⭐ Se você gostou do projeto, considere dar uma estrela!**

Made with 🐾 for pet lovers

</div>
