# Plugin Panel WP Connector

## Descrição
O Panel WP Connector é um plugin avançado para WordPress que fornece uma ponte segura entre sites WordPress e sistemas centrais de automação e gerenciamento. Projetado para administradores de múltiplos sites WordPress, ele oferece uma API robusta para monitoramento, execução de tarefas, gerenciamento de arquivos e backup.

## Versão Atual
**Versão:** 1.3.0  
**Autor:** Eric Nunes  
**Repositório:** [GitHub](https://github.com/eric-nunes/panel-wp-connector)

## Funcionalidades Principais

### Sistema de Autenticação
- Geração segura de chaves de API únicas de 64 caracteres
- Vinculação de chaves API a usuários específicos
- Sistema de revogação e gestão de chaves
- Autenticação via cabeçalhos HTTP padronizados

### API REST Completa
- Endpoints para monitoramento de status
- Execução remota de tarefas de manutenção
- Gerenciamento de arquivos (listar, upload, download, renomear, excluir)
- Diagnóstico de sistema e coleta de informações
- Sistema de debug com logs detalhados

### Sistema de Backup
- Geração automatizada de backups completos
- Acompanhamento de status de backup em tempo real
- Download seguro de arquivos de backup
- Gestão de backups históricos

### Ferramentas de Debug
- Ativação/desativação de modo debug
- Visualização de logs detalhados
- Diagnóstico de problemas
- Limpeza de logs

## Endpoints da API

Todos os endpoints utilizam a base URL: `/wp-json/panel-wp/v1`

### Autenticação
- **URL**: `/authenticate`
- **Método**: POST
- **Cabeçalhos**: `X-Api-Key`
- **Resposta**: Informações do usuário e site
  ```json
  {
    "status": "success",
    "message": "Autenticação realizada com sucesso",
    "user": {
      "id": 1,
      "login": "admin",
      "email": "admin@example.com",
      "display_name": "Administrator",
      "roles": ["administrator"]
    },
    "site": {
      "name": "Site Name",
      "url": "https://example.com",
      "description": "Site Description",
      "admin_email": "admin@example.com",
      "language": "pt_BR",
      "wordpress_version": "6.0",
      "timezone": "America/Sao_Paulo"
    }
  }
  ```

### Status do Site
- **URL**: `/status`
- **Método**: GET
- **Cabeçalhos**: `X-Api-Key`
- **Resposta**: Status básico do site
  ```json
  {
    "status": "online",
    "wordpress_version": "6.0",
    "site_url": "https://example.com",
    "site_name": "Site Name",
    "timezone": "America/Sao_Paulo"
  }
  ```

### Informações do Sistema
- **URL**: `/system-info`
- **Método**: GET
- **Cabeçalhos**: `X-Api-Key`
- **Resposta**: Informações detalhadas do sistema
  ```json
  {
    "wordpress_version": "6.0",
    "php_version": "7.4",
    "mysql_version": "5.7",
    "site_url": "https://example.com",
    "site_name": "Site Name",
    "plugins_ativos": ["..."],
    "tema_atual": "Theme Name"
  }
  ```

### Debug
#### Status do Debug
- **URL**: `/debug/status`
- **Método**: GET
- **Cabeçalhos**: `X-Api-Key`

#### Alternar Debug
- **URL**: `/debug/toggle`
- **Método**: POST
- **Cabeçalhos**: `X-Api-Key`
- **Corpo**:
  ```json
  {
    "ativar": true
  }
  ```

#### Obter Log
- **URL**: `/debug/log`
- **Método**: GET
- **Cabeçalhos**: `X-Api-Key`

#### Limpar Log
- **URL**: `/debug/log/clear`
- **Método**: POST
- **Cabeçalhos**: `X-Api-Key`

### Sistema de Backup
#### Iniciar Backup
- **URL**: `/backup`
- **Método**: POST
- **Cabeçalhos**: `X-Api-Key`
- **Corpo**:
  ```json
  {
    "tipo": "completo" // Opções: "completo", "banco_dados", "arquivos"
  }
  ```

#### Status do Backup
- **URL**: `/backup-status/{backup_id}`
- **Método**: GET
- **Cabeçalhos**: `X-Api-Key`

#### Download de Backup
- **URL**: `/download-backup/{backup_id}`
- **Método**: GET
- **Cabeçalhos**: `X-Api-Key`

### Execução de Tarefas
- **URL**: `/execute-task`
- **Método**: POST
- **Cabeçalhos**: `X-Api-Key`
- **Corpo**:
  ```json
  {
    "task": "nome_da_tarefa",
    "params": {
      "parametro1": "valor1",
      "parametro2": "valor2"
    }
  }
  ```

### Notas de Segurança
- Todas as requisições requerem autenticação via cabeçalho `X-Api-Key`
- As chaves API devem ser geradas através do painel administrativo
- Recomenda-se o uso de HTTPS para todas as requisições
- As chaves API podem ser revogadas a qualquer momento através do painel administrativo

## Arquitetura do Plugin

### Estrutura de Diretórios
```
panel-wp-connector/
├── admin/                  # Interface administrativa
├── includes/               # Classes principais
│   ├── backup/             # Funcionalidades de backup
│   ├── class-panel-wp-admin.php
│   ├── class-panel-wp-authentication.php
│   ├── class-panel-wp-autoloader.php
│   ├── class-panel-wp-core.php
│   ├── class-panel-wp-debug.php
│   ├── class-panel-wp-migrations.php
│   ├── class-panel-wp-rest-routes.php
│   └── class-panel-wp-system.php
├── logs/                   # Diretório para logs
├── panel-wp-connector.php  # Arquivo principal do plugin
└── README.md               # Documentação
```

### Namespaces Principais
- `PanelWPConnector\Core`: Funcionalidades centrais
- `PanelWPConnector\Authentication`: Sistema de autenticação
- `PanelWPConnector\Admin`: Interface administrativa
- `PanelWPConnector\System`: Informações do sistema
- `PanelWPConnector\Debug`: Ferramentas de debug
- `PanelWPConnector\Backup`: Sistema de backup
- `PanelWPConnector\Routes`: Rotas REST

## Segurança
- Geração de chaves API criptograficamente seguras
- Validação rigorosa de parâmetros de entrada
- Proteção contra acessos não autorizados
- Validação de caminhos para operações com arquivos
- Armazenamento seguro de credenciais
- Proteção contra acesso direto aos arquivos do plugin
- Validação de origem das requisições

## Requisitos
- WordPress 5.8+
- PHP 7.4+
- Permissões de escrita para o diretório de logs
- API REST do WordPress ativada
- Credenciais de administrador para instalação

## Instalação
1. Faça o upload da pasta `panel-wp-connector` para o diretório `/wp-content/plugins/`
2. Ative o plugin no painel de administração do WordPress
3. Acesse a página de configurações em `Painel > Panel WP Connector`
4. Gere sua primeira chave API para começar a utilizar o sistema

## Configuração
1. Após a instalação, acesse o menu "Panel WP Connector" no painel administrativo
2. Gere uma nova chave API e associe a um usuário administrador
3. Configure as opções de segurança e funcionalidades desejadas
4. O plugin estará pronto para receber conexões de sistemas externos

## Depuração e Solução de Problemas
- Erros de conexão: Verifique se a API REST do WordPress está ativa
- Falhas de autenticação: Confirme a validade da chave API
- Erros de permissão: Verifique as permissões de escrita nos diretórios necessários
- Ative o modo de debug para registros detalhados de operações

## Contribuição
Contribuições são bem-vindas para melhorar o Plugin Panel WP Connector. Por favor, siga estas diretrizes:

1. Faça um fork do repositório
2. Crie um branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para o branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

### Relatando Problemas
- Use o rastreador de problemas do GitHub para relatar bugs
- Forneça detalhes do ambiente (versões de WordPress, PHP, plugins ativos)
- Inclua passos para reproduzir o problema

## Limitações e Considerações
- O plugin opera com privilégios elevados - use com cuidado em ambientes de produção
- Algumas operações de arquivo podem ser bloqueadas por configurações de servidor
- É recomendável implementar segurança adicional em ambientes críticos
- Backups de sites muito grandes podem exigir ajustes no timeout do PHP

## Licença
Este plugin é licenciado sob a **GPL v2 ou posterior**

Copyright (C) 2023 Eric Nunes

Este programa é software livre; você pode redistribuí-lo e/ou modificá-lo sob os termos da Licença Pública Geral GNU conforme publicada pela Free Software Foundation; tanto a versão 2 da Licença como qualquer versão posterior.

Este programa é distribuído na esperança de que seja útil, mas SEM QUALQUER GARANTIA; sem mesmo a garantia implícita de COMERCIALIZAÇÃO ou ADEQUAÇÃO A UM DETERMINADO FIM. Veja a Licença Pública Geral GNU para mais detalhes.

