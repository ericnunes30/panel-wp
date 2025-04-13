# 🌐 Panel WP - Gerenciador Multi-site WordPress

## 📋 Descrição
Sistema de gerenciamento centralizado para múltiplos sites WordPress, focado em automação, monitoramento e segurança.

## 🚀 Versão 2.0.0
Esta versão traz uma reformulação completa da aplicação, com uma nova interface de usuário, melhor desempenho e novas funcionalidades.

## ✨ Funcionalidades Principais
- **Dashboard centralizado**: Visualize todos os seus sites WordPress em um único lugar
- **Monitoramento de status**: Verifique se seus sites estão online ou offline
- **Gerenciamento de depuração**: Ative/desative o modo de depuração, visualize e limpe logs
- **Informações do sistema**: Visualize informações detalhadas sobre seus sites WordPress
- **Login automático**: Acesse o painel administrativo dos seus sites sem precisar fazer login manualmente
- **Pesquisa de sites**: Encontre rapidamente seus sites por nome ou URL
- **Proteção de rotas**: Acesso seguro com autenticação em todas as páginas

## 🛠️ Tecnologias

### Backend
- **Node.js + AdonisJS 6** (substituindo Express)
- **Postgresql** (Banco de dados)
- **Lucid ORM** (ORM integrado do AdonisJS)
- **JWT** (Autenticação)
- **bcrypt** (Criptografia)
- **API RESTful** (Comunicação com o frontend)

### Frontend
- **React.js** com **Vite**
- **TailwindCSS** + **shadcn/ui** (substituindo Material-UI)
- **React Query** (Gerenciamento de estado e cache)
- **React Router v6** (Navegação e proteção de rotas)
- **Context API** (Gerenciamento de estado global)
- **Lucide Icons** (Biblioteca de ícones)

## 📂 Estrutura do projeto

- **frontend**: Aplicação React com Vite, TailwindCSS e shadcn/ui
- **backend**: API RESTful com AdonisJS 6 para gerenciar os dados dos sites
- **plugin**: Plugin WordPress para integração com o Panel WP

## 🔧 Requisitos do Sistema
- Node.js 18+
- Postgresql
- npm 9+
- WordPress 6.0+ (para os sites gerenciados)

## 📦 Instalação

### Instalação Manual

#### Backend
```bash
# Entre no diretório do backend
cd backend

# Instale as dependências
npm install

# Configure o arquivo .env
cp .env.example .env
# Edite o arquivo .env com suas configurações

# Execute as migrações do banco de dados
node ace migration:run

# Crie o primeiro usuário administrador
node ace create:user

# Inicie o servidor
npm start
```

#### Frontend
```bash
# Entre no diretório do frontend
cd frontend

# Instale as dependências
npm install

# Inicie o aplicativo em modo de desenvolvimento
npm run dev
```

## ⚙️ Configuração do Backend
Configure as variáveis de ambiente no arquivo `.env`:
```env
PORT=3333
HOST=0.0.0.0
NODE_ENV=development
APP_KEY=sua_chave_secreta_gerada_pelo_adonis

# Banco de dados
DB_CONNECTION=mysql
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=seu_usuario
MYSQL_PASSWORD=sua_senha
MYSQL_DB_NAME=panel_wp

# JWT
JWT_SECRET=sua_chave_jwt
JWT_EXPIRES_IN=7d
```

## 🔌 Plugin WordPress

Para integrar seus sites WordPress com o Panel WP, você precisa instalar o plugin Panel WP Connector v2.0.1 em cada site. O plugin está disponível no repositório:

[https://github.com/ericnunes30/plugin-panel-wp-connector-v2.0.1](https://github.com/ericnunes30/plugin-panel-wp-connector-v2.0.1)

## 🤝 Como Contribuir
1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença
Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor
Eric Nunes - [GitHub](https://github.com/ericnunes30)

## 🙏 Agradecimentos
- Equipe do WordPress
- Comunidade React
- Comunidade AdonisJS
- Contribuidores do projeto
