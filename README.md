# Sistema de Controle de Estoque para Banheiros

## 📋 Descrição

Sistema web completo para controle e monitoramento de estoque de produtos de higiene em banheiros corporativos. Desenvolvido com Flask (Python) no backend e JavaScript vanilla no frontend, oferece uma interface moderna e intuitiva para gestão eficiente de recursos.

## ✨ Funcionalidades Principais

### 🏠 Dashboard Interativo
- **KPIs em Tempo Real**: Consumo total, redução de desperdício, produtos com estoque baixo e alertas críticos
- **Ranking de Banheiros**: Visualização do consumo por andar com diferenciação por gênero (masculino/feminino)
- **Produtos Mais Consumidos**: Lista dos itens com maior rotatividade

### 📊 Análise de Consumo
- **Gráficos Interativos**: Visualização por andar com opções de barras, pizza e linha
- **Filtros Personalizados**: Seleção de períodos específicos para análise
- **Comparativos**: Análise entre banheiros masculinos e femininos

### 🗑️ Controle de Desperdício
- **Índice de Desperdício por Andar**: Identificação de áreas com maior perda
- **Análise por Produto**: Visualização dos itens com maior desperdício
- **Economia Potencial**: Cálculo de possíveis economias com redução de desperdício
- **Plano de Ação**: Sugestões práticas para otimização

### 📦 Gestão de Estoque
- **Cadastro de Produtos**: Interface completa para adicionar novos itens
- **Controle de Movimentações**: Registro de entradas e saídas
- **Alertas de Estoque Baixo**: Notificações automáticas para reposição
- **Filtros Avançados**: Busca por categoria, status e nome

### 📈 Relatórios Detalhados
- **Relatórios de Consumo**: Análise detalhada por período e localização
- **Relatórios de Desperdício**: Identificação de oportunidades de melhoria
- **Relatórios Comparativos**: Análise de tendências entre períodos
- **Exportação**: Opções para impressão e compartilhamento

### 📅 Gestão de Eventos
- **Log de Atividades**: Registro de todas as ações do sistema
- **Alertas Automáticos**: Notificações para situações críticas
- **Histórico Completo**: Rastreabilidade de todas as operações

## 🛠️ Tecnologias Utilizadas

### Backend
- **Flask 3.1.0**: Framework web Python
- **SQLAlchemy 2.0.40**: ORM para banco de dados
- **SQLite**: Banco de dados leve e eficiente
- **Flask-CORS**: Suporte a requisições cross-origin
- **Gunicorn**: Servidor WSGI para produção

### Frontend
- **HTML5**: Estrutura semântica moderna
- **CSS3**: Design responsivo e profissional
- **JavaScript ES6+**: Interatividade e componentes modulares
- **Chart.js**: Gráficos interativos e responsivos
- **Bootstrap Icons**: Iconografia consistente

## 📁 Estrutura do Projeto

```
estoque/
├── src/
│   ├── main.py                 # Aplicação principal Flask
│   ├── models/                 # Modelos de dados
│   │   ├── __init__.py
│   │   ├── item.py            # Modelo de itens
│   │   ├── local.py           # Modelo de locais/banheiros
│   │   ├── movimentacao.py    # Modelo de movimentações
│   │   ├── evento.py          # Modelo de eventos
│   │   └── user.py            # Modelo de usuários
│   ├── routes/                # Rotas da API
│   │   ├── __init__.py
│   │   ├── item.py            # Rotas de itens
│   │   ├── local.py           # Rotas de locais
│   │   ├── movimentacao.py    # Rotas de movimentações
│   │   ├── dashboard.py       # Rotas do dashboard
│   │   ├── eventos.py         # Rotas de eventos
│   │   └── relatorios.py      # Rotas de relatórios
│   └── static/                # Arquivos estáticos
│       ├── index.html         # Página principal
│       ├── css/               # Estilos CSS
│       │   ├── inventory.css  # Estilos do estoque
│       │   └── reports.css    # Estilos dos relatórios
│       └── js/                # Scripts JavaScript
│           ├── app.js         # Aplicação principal
│           └── components/    # Componentes modulares
├── requirements.txt           # Dependências Python
├── .gitignore                # Arquivos ignorados pelo Git
└── README.md                 # Este arquivo
```

## 🚀 Instalação e Configuração Local

### Pré-requisitos
- Python 3.8 ou superior
- pip (gerenciador de pacotes Python)
- Git

### Passos para Instalação

1. **Clone o repositório**
```bash
git clone <url-do-seu-repositorio>
cd estoque
```

2. **Crie um ambiente virtual**
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate     # Windows
```

3. **Instale as dependências**
```bash
pip install -r requirements.txt
```

4. **Execute a aplicação**
```bash
cd src
python main.py
```

5. **Acesse o sistema**
Abra seu navegador e acesse: `http://localhost:5000`

## 🌐 Deploy no Render

### Preparação do Repositório GitHub

1. **Crie um repositório no GitHub**
2. **Faça upload dos arquivos**
```bash
git init
git add .
git commit -m "Initial commit - Sistema de Estoque"
git branch -M main
git remote add origin <url-do-seu-repositorio>
git push -u origin main
```

### Configuração no Render

1. **Acesse [render.com](https://render.com) e faça login**

2. **Crie um novo Web Service**
   - Clique em "New +" → "Web Service"
   - Conecte seu repositório GitHub
   - Selecione o repositório do projeto

3. **Configure o serviço**
   - **Name**: `sistema-estoque-banheiros` (ou nome de sua preferência)
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn src.main:app`
   - **Instance Type**: `Free` (para testes) ou `Starter` (para produção)

4. **Variáveis de Ambiente (opcional)**
   - `SECRET_KEY`: Uma chave secreta para produção
   - `FLASK_ENV`: `production`

5. **Deploy**
   - Clique em "Create Web Service"
   - Aguarde o processo de build e deploy
   - Seu sistema estará disponível na URL fornecida pelo Render

### Configurações Importantes para Produção

- **Banco de Dados**: O sistema usa SQLite por padrão. Para produção com múltiplos usuários, considere migrar para PostgreSQL
- **Variáveis de Ambiente**: Configure uma `SECRET_KEY` segura
- **Monitoramento**: Utilize os logs do Render para monitorar a aplicação
- **Backup**: Configure backups regulares do banco de dados

## 📱 Uso do Sistema

### Acesso Inicial
1. Acesse a URL do sistema
2. O dashboard principal será exibido com dados simulados
3. Use o menu lateral para navegar entre as funcionalidades

### Cadastro de Produtos
1. Acesse a aba "Estoque"
2. Clique em "Novo Item"
3. Preencha as informações do produto
4. Salve para adicionar ao estoque

### Registro de Movimentações
1. Na aba "Estoque", clique em "Movimentar" no produto desejado
2. Selecione o tipo (Entrada/Saída)
3. Informe a quantidade
4. Adicione observações se necessário

### Geração de Relatórios
1. Acesse a aba "Relatórios"
2. Selecione o tipo de relatório desejado
3. Configure os filtros de período
4. Clique em "Aplicar" para gerar
5. Use "Exportar" ou "Imprimir" conforme necessário

## 🔧 Personalização

### Adicionando Novos Banheiros
Edite o arquivo `src/routes/dashboard.py` na função `get_ranking_banheiros()` para incluir novos locais.

### Modificando KPIs
Ajuste os cálculos em `src/routes/dashboard.py` na função `get_kpis()` conforme suas métricas específicas.

### Customizando Interface
- **Cores e Estilos**: Modifique os arquivos CSS em `src/static/css/`
- **Layout**: Ajuste o HTML em `src/static/index.html`
- **Funcionalidades**: Adicione novos componentes em `src/static/js/components/`

## 🐛 Solução de Problemas

### Erro de Importação de Módulos
```bash
# Certifique-se de estar no diretório correto
cd src
python main.py
```

### Banco de Dados Não Inicializa
```bash
# Delete o arquivo de banco e reinicie
rm estoque_banheiros.db
python main.py
```

### Problemas de CORS
Verifique se `Flask-CORS` está instalado e configurado em `main.py`.

## 📞 Suporte

Para dúvidas, problemas ou sugestões:
- Abra uma issue no repositório GitHub
- Consulte a documentação das tecnologias utilizadas
- Verifique os logs do sistema para diagnóstico

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

---

**Desenvolvido com ❤️ para otimização de recursos e sustentabilidade corporativa**

