# Manual do Sistema de Controle de Estoque

## Visão Geral

O Sistema de Controle de Estoque é uma aplicação web desenvolvida para gerenciar o inventário de produtos, registrar movimentações de entrada e saída, e controlar a localização dos itens. O sistema foi construído utilizando Flask (backend) e HTML/CSS/JavaScript (frontend), com banco de dados MySQL.

## Funcionalidades Principais

1. **Gestão de Itens**
   - Cadastro de novos itens
   - Visualização do estoque atual
   - Edição e exclusão de itens

2. **Gestão de Locais**
   - Cadastro de locais de armazenamento
   - Visualização dos locais disponíveis
   - Edição e exclusão de locais

3. **Movimentações**
   - Registro de entradas de itens
   - Registro de saídas de itens
   - Transferência entre locais
   - Histórico completo de movimentações

4. **Dashboard**
   - Visão geral do estoque
   - Alertas de itens com estoque baixo
   - Resumo das últimas movimentações

5. **Relatórios**
   - Relatório de estoque atual
   - Relatório de movimentações por período

## Instruções de Uso

### Acessando o Sistema

1. Execute o servidor Flask com o comando:
   ```
   cd sistema_estoque/estoque
   source venv/bin/activate
   cd src
   python main.py
   ```

2. Acesse o sistema pelo navegador em: `http://localhost:5000`

### Utilizando o Sistema

#### Dashboard

A tela inicial apresenta um resumo do estoque, incluindo:
- Total de itens cadastrados
- Entradas e saídas do dia
- Itens com estoque baixo
- Últimas movimentações

#### Itens

Na seção de Itens, você pode:
- Visualizar todos os itens cadastrados
- Adicionar novos itens clicando em "Novo Item"
- Ver detalhes de um item clicando no ícone de visualização
- Excluir um item clicando no ícone de lixeira (apenas se não houver movimentações associadas)

#### Movimentações

Na seção de Movimentações, você pode:
- Registrar entradas de itens no estoque
- Registrar saídas de itens do estoque
- Transferir itens entre locais
- Consultar o histórico de movimentações com filtros por item, tipo e data

#### Locais

Na seção de Locais, você pode:
- Visualizar todos os locais cadastrados
- Adicionar novos locais clicando em "Novo Local"
- Excluir um local clicando no ícone de lixeira (apenas se não houver itens associados)

#### Relatórios

Na seção de Relatórios, você pode:
- Gerar relatório do estoque atual
- Gerar relatório de movimentações por período

## Estrutura do Sistema

O sistema foi desenvolvido seguindo uma arquitetura MVC (Model-View-Controller):

- **Models**: Representam as tabelas do banco de dados (Item, Local, Movimentação)
- **Routes**: Controladores que processam as requisições e retornam respostas
- **Views**: Interface do usuário em HTML/CSS/JavaScript

## Requisitos Técnicos

- Python 3.11 ou superior
- Flask 3.1.0
- MySQL (ou outro banco de dados compatível com SQLAlchemy)
- Navegador web moderno (Chrome, Firefox, Edge, Safari)

## Suporte e Manutenção

Para suporte técnico ou dúvidas sobre o sistema, entre em contato com o desenvolvedor.

---

Desenvolvido por Manus AI - 2025
