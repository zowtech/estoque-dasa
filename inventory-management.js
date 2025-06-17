// Componente de gerenciamento de estoque
class InventoryManagement {
  constructor(containerId, apiBaseUrl = '/api/dashboard') {
    this.container = document.getElementById(containerId);
    this.apiBaseUrl = apiBaseUrl;
    this.inventoryData = {};
    this.currentView = 'list'; // list, add, edit, movement
    this.selectedItem = null;
    this.movementType = 'entrada'; // entrada, saida
    
    this.init();
  }
  
  async init() {
    this.renderLayout();
    await this.loadInventoryData();
    this.setupEventListeners();
  }
  
  renderLayout() {
    this.container.innerHTML = `
      <div class="inventory-management">
        <div class="inventory-header">
          <div class="inventory-title">
            <h2>Controle de Estoque</h2>
          </div>
          <div class="inventory-actions">
            <button type="button" class="btn btn-primary" id="add-item-btn">
              <i class="fas fa-plus"></i> Novo Item
            </button>
            <button type="button" class="btn btn-success" id="add-movement-btn">
              <i class="fas fa-exchange-alt"></i> Registrar Movimentação
            </button>
          </div>
        </div>
        
        <div class="inventory-content">
          <!-- Lista de Itens -->
          <div id="inventory-list-view" class="inventory-view">
            <div class="inventory-filters mb-3">
              <div class="row g-2">
                <div class="col-md-4">
                  <div class="input-group">
                    <span class="input-group-text"><i class="fas fa-search"></i></span>
                    <input type="text" class="form-control" id="inventory-search" placeholder="Buscar item...">
                  </div>
                </div>
                <div class="col-md-3">
                  <select class="form-select" id="inventory-category-filter">
                    <option value="">Todas as Categorias</option>
                    <option value="Papel">Papel</option>
                    <option value="Limpeza">Limpeza</option>
                    <option value="Higiene">Higiene</option>
                  </select>
                </div>
                <div class="col-md-3">
                  <select class="form-select" id="inventory-status-filter">
                    <option value="">Todos os Status</option>
                    <option value="normal">Normal</option>
                    <option value="baixo">Estoque Baixo</option>
                    <option value="critico">Estoque Crítico</option>
                  </select>
                </div>
                <div class="col-md-2">
                  <select class="form-select" id="inventory-sort">
                    <option value="nome">Nome</option>
                    <option value="quantidade">Quantidade</option>
                    <option value="categoria">Categoria</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>Imagem</th>
                    <th>Nome</th>
                    <th>Categoria</th>
                    <th>Quantidade</th>
                    <th>Localização</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody id="inventory-table-body">
                  <tr>
                    <td colspan="7" class="text-center">
                      <div class="spinner-border spinner-border-sm" role="status"></div>
                      <span class="ms-2">Carregando itens...</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <!-- Formulário de Adição/Edição de Item -->
          <div id="inventory-form-view" class="inventory-view d-none">
            <div class="card">
              <div class="card-header">
                <h4 id="form-title">Adicionar Novo Item</h4>
              </div>
              <div class="card-body">
                <form id="inventory-form">
                  <div class="row mb-3">
                    <div class="col-md-8">
                      <div class="mb-3">
                        <label for="item-name" class="form-label">Nome do Item</label>
                        <input type="text" class="form-control" id="item-name" required>
                      </div>
                      
                      <div class="row">
                        <div class="col-md-6">
                          <div class="mb-3">
                            <label for="item-category" class="form-label">Categoria</label>
                            <select class="form-select" id="item-category" required>
                              <option value="">Selecione...</option>
                              <option value="Papel">Papel</option>
                              <option value="Limpeza">Limpeza</option>
                              <option value="Higiene">Higiene</option>
                            </select>
                          </div>
                        </div>
                        <div class="col-md-6">
                          <div class="mb-3">
                            <label for="item-unit" class="form-label">Unidade de Medida</label>
                            <select class="form-select" id="item-unit" required>
                              <option value="">Selecione...</option>
                              <option value="Unidade">Unidade</option>
                              <option value="Rolo">Rolo</option>
                              <option value="Litro">Litro</option>
                              <option value="Pacote">Pacote</option>
                              <option value="Caixa">Caixa</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      
                      <div class="row">
                        <div class="col-md-6">
                          <div class="mb-3">
                            <label for="item-min-stock" class="form-label">Estoque Mínimo</label>
                            <input type="number" class="form-control" id="item-min-stock" min="0" required>
                          </div>
                        </div>
                        <div class="col-md-6">
                          <div class="mb-3">
                            <label for="item-critical-stock" class="form-label">Estoque Crítico</label>
                            <input type="number" class="form-control" id="item-critical-stock" min="0" required>
                          </div>
                        </div>
                      </div>
                      
                      <div class="mb-3">
                        <label for="item-location" class="form-label">Localização</label>
                        <input type="text" class="form-control" id="item-location" required>
                      </div>
                      
                      <div class="mb-3">
                        <label for="item-description" class="form-label">Descrição</label>
                        <textarea class="form-control" id="item-description" rows="3"></textarea>
                      </div>
                    </div>
                    
                    <div class="col-md-4">
                      <div class="mb-3">
                        <label class="form-label">Imagem do Item</label>
                        <div class="item-image-container">
                          <div class="item-image-preview" id="item-image-preview">
                            <i class="fas fa-image"></i>
                            <span>Sem imagem</span>
                          </div>
                          <div class="mt-2">
                            <button type="button" class="btn btn-outline-primary btn-sm" id="item-image-btn">
                              <i class="fas fa-upload"></i> Carregar Imagem
                            </button>
                            <input type="file" id="item-image-input" accept="image/*" class="d-none">
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="d-flex justify-content-end gap-2">
                    <button type="button" class="btn btn-secondary" id="cancel-form-btn">Cancelar</button>
                    <button type="submit" class="btn btn-primary" id="save-item-btn">Salvar</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          
          <!-- Formulário de Movimentação -->
          <div id="inventory-movement-view" class="inventory-view d-none">
            <div class="card">
              <div class="card-header">
                <h4>Registrar Movimentação</h4>
              </div>
              <div class="card-body">
                <form id="movement-form">
                  <div class="row mb-3">
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label for="movement-type" class="form-label">Tipo de Movimentação</label>
                        <div class="btn-group w-100" role="group">
                          <input type="radio" class="btn-check" name="movement-type" id="movement-entrada" value="entrada" checked>
                          <label class="btn btn-outline-success" for="movement-entrada">Entrada</label>
                          
                          <input type="radio" class="btn-check" name="movement-type" id="movement-saida" value="saida">
                          <label class="btn btn-outline-danger" for="movement-saida">Saída</label>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label for="movement-date" class="form-label">Data</label>
                        <input type="date" class="form-control" id="movement-date" required>
                      </div>
                    </div>
                  </div>
                  
                  <div class="mb-3">
                    <label for="movement-item" class="form-label">Item</label>
                    <select class="form-select" id="movement-item" required>
                      <option value="">Selecione um item...</option>
                    </select>
                  </div>
                  
                  <div class="row">
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label for="movement-quantity" class="form-label">Quantidade</label>
                        <input type="number" class="form-control" id="movement-quantity" min="1" required>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label for="movement-location" class="form-label">Localização</label>
                        <select class="form-select" id="movement-location" required>
                          <option value="">Selecione...</option>
                          <option value="Andar 1 - Masculino">Andar 1 - Masculino</option>
                          <option value="Andar 1 - Feminino">Andar 1 - Feminino</option>
                          <option value="Andar 2 - Masculino">Andar 2 - Masculino</option>
                          <option value="Andar 2 - Feminino">Andar 2 - Feminino</option>
                          <option value="Andar 3 - Masculino">Andar 3 - Masculino</option>
                          <option value="Andar 3 - Feminino">Andar 3 - Feminino</option>
                          <option value="Andar 4 - Masculino">Andar 4 - Masculino</option>
                          <option value="Andar 4 - Feminino">Andar 4 - Feminino</option>
                          <option value="Andar 5 - Masculino">Andar 5 - Masculino</option>
                          <option value="Andar 5 - Feminino">Andar 5 - Feminino</option>
                          <option value="Almoxarifado">Almoxarifado</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div class="mb-3">
                    <label for="movement-notes" class="form-label">Observações</label>
                    <textarea class="form-control" id="movement-notes" rows="2"></textarea>
                  </div>
                  
                  <div class="d-flex justify-content-end gap-2">
                    <button type="button" class="btn btn-secondary" id="cancel-movement-btn">Cancelar</button>
                    <button type="submit" class="btn btn-primary" id="save-movement-btn">Registrar</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    this.addStyles();
  }
  
  addStyles() {
    const styleId = 'inventory-management-styles';
    if (!document.getElementById(styleId)) {
      const styleElement = document.createElement('style');
      styleElement.id = styleId;
      styleElement.textContent = `
        .inventory-management {
          margin-bottom: 30px;
        }
        
        .inventory-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 15px;
        }
        
        .inventory-actions {
          display: flex;
          gap: 10px;
        }
        
        .item-image-container {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .item-image-preview {
          width: 150px;
          height: 150px;
          border: 1px dashed #ccc;
          border-radius: 5px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: #aaa;
          background-color: #f8f9fa;
          overflow: hidden;
        }
        
        .item-image-preview i {
          font-size: 2rem;
          margin-bottom: 10px;
        }
        
        .item-image-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .table-image {
          width: 40px;
          height: 40px;
          border-radius: 4px;
          object-fit: cover;
        }
        
        .status-badge {
          display: inline-block;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.75rem;
          font-weight: 600;
          text-align: center;
          white-space: nowrap;
          vertical-align: baseline;
        }
        
        .status-normal {
          background-color: #d1e7dd;
          color: #0f5132;
        }
        
        .status-baixo {
          background-color: #fff3cd;
          color: #856404;
        }
        
        .status-critico {
          background-color: #f8d7da;
          color: #842029;
        }
        
        @media (max-width: 768px) {
          .inventory-header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .inventory-actions {
            width: 100%;
          }
        }
      `;
      
      document.head.appendChild(styleElement);
    }
  }
  
  async loadInventoryData() {
    // Simular carregamento de dados
    console.log("Carregando dados de estoque");
    
    return new Promise(resolve => {
      setTimeout(() => {
        // Dados fictícios de estoque
        this.inventoryData = {
          items: [
            {
              id: 1,
              nome: 'Papel Higiênico',
              categoria: 'Papel',
              unidade: 'Rolo',
              quantidade: 120,
              estoqueMinimo: 50,
              estoqueCritico: 20,
              localizacao: 'Almoxarifado A1',
              descricao: 'Papel higiênico folha dupla, 30m, pacote com 4 unidades',
              imagem: 'https://m.media-amazon.com/images/I/71Zf9uUp+GL._AC_SX569_.jpg',
              status: 'normal'
            },
            {
              id: 2,
              nome: 'Sabonete Líquido',
              categoria: 'Higiene',
              unidade: 'Litro',
              quantidade: 35,
              estoqueMinimo: 30,
              estoqueCritico: 15,
              localizacao: 'Almoxarifado A2',
              descricao: 'Sabonete líquido para mãos, fragrância neutra',
              imagem: 'https://m.media-amazon.com/images/I/61eDw4ODJWL._AC_SX569_.jpg',
              status: 'baixo'
            },
            {
              id: 3,
              nome: 'Papel Toalha',
              categoria: 'Papel',
              unidade: 'Pacote',
              quantidade: 45,
              estoqueMinimo: 40,
              estoqueCritico: 20,
              localizacao: 'Almoxarifado A1',
              descricao: 'Papel toalha interfolhado, pacote com 1000 folhas',
              imagem: 'https://m.media-amazon.com/images/I/71Qe6O4BVFL._AC_SX569_.jpg',
              status: 'baixo'
            },
            {
              id: 4,
              nome: 'Álcool em Gel',
              categoria: 'Higiene',
              unidade: 'Litro',
              quantidade: 12,
              estoqueMinimo: 20,
              estoqueCritico: 10,
              localizacao: 'Almoxarifado A2',
              descricao: 'Álcool em gel 70%, para higienização das mãos',
              imagem: 'https://m.media-amazon.com/images/I/51YDzI9TmWL._AC_SX569_.jpg',
              status: 'critico'
            },
            {
              id: 5,
              nome: 'Desinfetante',
              categoria: 'Limpeza',
              unidade: 'Litro',
              quantidade: 25,
              estoqueMinimo: 15,
              estoqueCritico: 8,
              localizacao: 'Almoxarifado A3',
              descricao: 'Desinfetante concentrado para limpeza de banheiros',
              imagem: 'https://m.media-amazon.com/images/I/61Xb9U6PjWL._AC_SX569_.jpg',
              status: 'normal'
            },
            {
              id: 6,
              nome: 'Luvas Descartáveis',
              categoria: 'Limpeza',
              unidade: 'Caixa',
              quantidade: 8,
              estoqueMinimo: 10,
              estoqueCritico: 5,
              localizacao: 'Almoxarifado A3',
              descricao: 'Luvas descartáveis de látex, caixa com 100 unidades',
              imagem: 'https://m.media-amazon.com/images/I/71Jj-arMZOL._AC_SX569_.jpg',
              status: 'critico'
            },
            {
              id: 7,
              nome: 'Sacos de Lixo',
              categoria: 'Limpeza',
              unidade: 'Pacote',
              quantidade: 18,
              estoqueMinimo: 15,
              estoqueCritico: 8,
              localizacao: 'Almoxarifado A3',
              descricao: 'Sacos de lixo 50L, pacote com 10 unidades',
              imagem: 'https://m.media-amazon.com/images/I/71Ug0S7qWJL._AC_SX569_.jpg',
              status: 'baixo'
            }
          ],
          movements: [
            {
              id: 1,
              tipo: 'entrada',
              itemId: 1,
              quantidade: 50,
              data: '2025-06-01',
              localizacao: 'Almoxarifado',
              observacoes: 'Reposição de estoque'
            },
            {
              id: 2,
              tipo: 'saida',
              itemId: 1,
              quantidade: 10,
              data: '2025-06-02',
              localizacao: 'Andar 3 - Feminino',
              observacoes: 'Abastecimento regular'
            },
            {
              id: 3,
              tipo: 'saida',
              itemId: 2,
              quantidade: 5,
              data: '2025-06-02',
              localizacao: 'Andar 5 - Masculino',
              observacoes: 'Abastecimento regular'
            },
            {
              id: 4,
              tipo: 'entrada',
              itemId: 4,
              quantidade: 12,
              data: '2025-06-03',
              localizacao: 'Almoxarifado',
              observacoes: 'Compra emergencial'
            },
            {
              id: 5,
              tipo: 'saida',
              itemId: 3,
              quantidade: 8,
              data: '2025-06-04',
              localizacao: 'Andar 2 - Feminino',
              observacoes: 'Abastecimento regular'
            }
          ]
        };
        
        // Renderizar lista de itens
        this.renderInventoryList();
        
        // Preencher select de itens para movimentação
        this.populateItemSelect();
        
        resolve(this.inventoryData);
      }, 800);
    });
  }
  
  renderInventoryList() {
    const tableBody = document.getElementById('inventory-table-body');
    if (!tableBody) return;
    
    const items = this.inventoryData.items;
    
    if (!items || items.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="7" class="text-center">Nenhum item encontrado no estoque.</td></tr>';
      return;
    }
    
    let tableHtml = '';
    
    items.forEach(item => {
      const statusClass = `status-${item.status}`;
      const statusText = item.status === 'normal' ? 'Normal' : (item.status === 'baixo' ? 'Estoque Baixo' : 'Estoque Crítico');
      
      tableHtml += `
        <tr data-item-id="${item.id}">
          <td>
            <img src="${item.imagem}" alt="${item.nome}" class="table-image" onerror="this.src='https://via.placeholder.com/40?text=Sem+Imagem'">
          </td>
          <td>${item.nome}</td>
          <td>${item.categoria}</td>
          <td>${item.quantidade} ${item.unidade}</td>
          <td>${item.localizacao}</td>
          <td><span class="status-badge ${statusClass}">${statusText}</span></td>
          <td>
            <div class="btn-group btn-group-sm">
              <button type="button" class="btn btn-outline-primary edit-item-btn" data-item-id="${item.id}" title="Editar">
                <i class="fas fa-edit"></i>
              </button>
              <button type="button" class="btn btn-outline-success movement-item-btn" data-item-id="${item.id}" title="Movimentar">
                <i class="fas fa-exchange-alt"></i>
              </button>
              <button type="button" class="btn btn-outline-danger delete-item-btn" data-item-id="${item.id}" title="Excluir">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    });
    
    tableBody.innerHTML = tableHtml;
  }
  
  populateItemSelect() {
    const itemSelect = document.getElementById('movement-item');
    if (!itemSelect) return;
    
    const items = this.inventoryData.items;
    
    if (!items || items.length === 0) {
      itemSelect.innerHTML = '<option value="">Nenhum item disponível</option>';
      return;
    }
    
    let optionsHtml = '<option value="">Selecione um item...</option>';
    
    items.forEach(item => {
      optionsHtml += `<option value="${item.id}">${item.nome} (${item.quantidade} ${item.unidade})</option>`;
    });
    
    itemSelect.innerHTML = optionsHtml;
  }
  
  showView(viewName) {
    // Esconder todas as views
    const views = this.container.querySelectorAll('.inventory-view');
    views.forEach(view => {
      view.classList.add('d-none');
    });
    
    // Mostrar view solicitada
    const targetView = document.getElementById(`inventory-${viewName}-view`);
    if (targetView) {
      targetView.classList.remove('d-none');
    }
    
    // Atualizar view atual
    this.currentView = viewName;
  }
  
  setupEventListeners() {
    // Botão de adicionar item
    const addItemBtn = document.getElementById('add-item-btn');
    if (addItemBtn) {
      addItemBtn.addEventListener('click', () => {
        this.selectedItem = null;
        document.getElementById('form-title').textContent = 'Adicionar Novo Item';
        this.resetForm('inventory-form');
        this.showView('form');
      });
    }
    
    // Botão de registrar movimentação
    const addMovementBtn = document.getElementById('add-movement-btn');
    if (addMovementBtn) {
      addMovementBtn.addEventListener('click', () => {
        // Definir data atual como padrão
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('movement-date').value = today;
        
        this.resetForm('movement-form');
        this.showView('movement');
      });
    }
    
    // Botões de cancelar formulários
    const cancelFormBtn = document.getElementById('cancel-form-btn');
    if (cancelFormBtn) {
      cancelFormBtn.addEventListener('click', () => {
        this.showView('list');
      });
    }
    
    const cancelMovementBtn = document.getElementById('cancel-movement-btn');
    if (cancelMovementBtn) {
      cancelMovementBtn.addEventListener('click', () => {
        this.showView('list');
      });
    }
    
    // Botão de carregar imagem
    const itemImageBtn = document.getElementById('item-image-btn');
    const itemImageInput = document.getElementById('item-image-input');
    if (itemImageBtn && itemImageInput) {
      itemImageBtn.addEventListener('click', () => {
        itemImageInput.click();
      });
      
      itemImageInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const preview = document.getElementById('item-image-preview');
            preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
          };
          reader.readAsDataURL(file);
        }
      });
    }
    
    // Formulário de item
    const inventoryForm = document.getElementById('inventory-form');
    if (inventoryForm) {
      inventoryForm.addEventListener('submit', (event) => {
        event.preventDefault();
        this.saveItem();
      });
    }
    
    // Formulário de movimentação
    const movementForm = document.getElementById('movement-form');
    if (movementForm) {
      movementForm.addEventListener('submit', (event) => {
        event.preventDefault();
        this.saveMovement();
      });
    }
    
    // Botões de editar, movimentar e excluir item (delegação de eventos)
    this.container.addEventListener('click', (event) => {
      // Botão de editar
      if (event.target.closest('.edit-item-btn')) {
        const button = event.target.closest('.edit-item-btn');
        const itemId = parseInt(button.dataset.itemId);
        this.editItem(itemId);
      }
      
      // Botão de movimentar
      if (event.target.closest('.movement-item-btn')) {
        const button = event.target.closest('.movement-item-btn');
        const itemId = parseInt(button.dataset.itemId);
        this.prepareMovement(itemId);
      }
      
      // Botão de excluir
      if (event.target.closest('.delete-item-btn')) {
        const button = event.target.closest('.delete-item-btn');
        const itemId = parseInt(button.dataset.itemId);
        this.deleteItem(itemId);
      }
    });
    
    // Filtros e busca
    const searchInput = document.getElementById('inventory-search');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        this.filterItems();
      });
    }
    
    const categoryFilter = document.getElementById('inventory-category-filter');
    if (categoryFilter) {
      categoryFilter.addEventListener('change', () => {
        this.filterItems();
      });
    }
    
    const statusFilter = document.getElementById('inventory-status-filter');
    if (statusFilter) {
      statusFilter.addEventListener('change', () => {
        this.filterItems();
      });
    }
    
    const sortSelect = document.getElementById('inventory-sort');
    if (sortSelect) {
      sortSelect.addEventListener('change', () => {
        this.sortItems(sortSelect.value);
      });
    }
  }
  
  resetForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
      form.reset();
      
      // Resetar preview de imagem se for o formulário de item
      if (formId === 'inventory-form') {
        const preview = document.getElementById('item-image-preview');
        if (preview) {
          preview.innerHTML = '<i class="fas fa-image"></i><span>Sem imagem</span>';
        }
      }
    }
  }
  
  editItem(itemId) {
    const item = this.inventoryData.items.find(item => item.id === itemId);
    if (!item) return;
    
    this.selectedItem = item;
    
    // Preencher formulário
    document.getElementById('form-title').textContent = 'Editar Item';
    document.getElementById('item-name').value = item.nome;
    document.getElementById('item-category').value = item.categoria;
    document.getElementById('item-unit').value = item.unidade;
    document.getElementById('item-min-stock').value = item.estoqueMinimo;
    document.getElementById('item-critical-stock').value = item.estoqueCritico;
    document.getElementById('item-location').value = item.localizacao;
    document.getElementById('item-description').value = item.descricao || '';
    
    // Atualizar preview de imagem
    const preview = document.getElementById('item-image-preview');
    if (preview) {
      if (item.imagem) {
        preview.innerHTML = `<img src="${item.imagem}" alt="${item.nome}">`;
      } else {
        preview.innerHTML = '<i class="fas fa-image"></i><span>Sem imagem</span>';
      }
    }
    
    this.showView('form');
  }
  
  prepareMovement(itemId) {
    const item = this.inventoryData.items.find(item => item.id === itemId);
    if (!item) return;
    
    // Definir data atual como padrão
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('movement-date').value = today;
    
    // Selecionar o item no select
    document.getElementById('movement-item').value = item.id;
    
    this.resetForm('movement-form');
    this.showView('movement');
  }
  
  saveItem() {
    // Obter valores do formulário
    const name = document.getElementById('item-name').value;
    const category = document.getElementById('item-category').value;
    const unit = document.getElementById('item-unit').value;
    const minStock = parseInt(document.getElementById('item-min-stock').value);
    const criticalStock = parseInt(document.getElementById('item-critical-stock').value);
    const location = document.getElementById('item-location').value;
    const description = document.getElementById('item-description').value;
    
    // Obter imagem (simulação)
    const preview = document.getElementById('item-image-preview');
    const hasImage = preview.querySelector('img') !== null;
    let imageUrl = hasImage ? preview.querySelector('img').src : '';
    
    // Se não for uma edição, criar novo item
    if (!this.selectedItem) {
      const newId = Math.max(0, ...this.inventoryData.items.map(item => item.id)) + 1;
      
      const newItem = {
        id: newId,
        nome: name,
        categoria: category,
        unidade: unit,
        quantidade: 0, // Novo item começa com quantidade zero
        estoqueMinimo: minStock,
        estoqueCritico: criticalStock,
        localizacao: location,
        descricao: description,
        imagem: imageUrl || 'https://via.placeholder.com/150?text=Sem+Imagem',
        status: 'critico' // Novo item começa com status crítico (quantidade zero)
      };
      
      this.inventoryData.items.push(newItem);
      
      // Mostrar mensagem de sucesso
      alert('Item adicionado com sucesso!');
    } else {
      // Atualizar item existente
      const item = this.inventoryData.items.find(item => item.id === this.selectedItem.id);
      if (item) {
        item.nome = name;
        item.categoria = category;
        item.unidade = unit;
        item.estoqueMinimo = minStock;
        item.estoqueCritico = criticalStock;
        item.localizacao = location;
        item.descricao = description;
        
        // Só atualizar imagem se uma nova foi selecionada
        if (hasImage) {
          item.imagem = imageUrl;
        }
        
        // Recalcular status
        if (item.quantidade > minStock) {
          item.status = 'normal';
        } else if (item.quantidade > criticalStock) {
          item.status = 'baixo';
        } else {
          item.status = 'critico';
        }
      }
      
      // Mostrar mensagem de sucesso
      alert('Item atualizado com sucesso!');
    }
    
    // Atualizar lista e voltar para a view de lista
    this.renderInventoryList();
    this.populateItemSelect();
    this.showView('list');
  }
  
  saveMovement() {
    // Obter valores do formulário
    const type = document.querySelector('input[name="movement-type"]:checked').value;
    const date = document.getElementById('movement-date').value;
    const itemId = parseInt(document.getElementById('movement-item').value);
    const quantity = parseInt(document.getElementById('movement-quantity').value);
    const location = document.getElementById('movement-location').value;
    const notes = document.getElementById('movement-notes').value;
    
    // Validar item
    const item = this.inventoryData.items.find(item => item.id === itemId);
    if (!item) {
      alert('Item não encontrado!');
      return;
    }
    
    // Validar quantidade para saída
    if (type === 'saida' && quantity > item.quantidade) {
      alert(`Quantidade insuficiente em estoque! Disponível: ${item.quantidade} ${item.unidade}`);
      return;
    }
    
    // Criar nova movimentação
    const newId = Math.max(0, ...this.inventoryData.movements.map(mov => mov.id)) + 1;
    
    const newMovement = {
      id: newId,
      tipo: type,
      itemId: itemId,
      quantidade: quantity,
      data: date,
      localizacao: location,
      observacoes: notes
    };
    
    this.inventoryData.movements.push(newMovement);
    
    // Atualizar quantidade do item
    if (type === 'entrada') {
      item.quantidade += quantity;
    } else {
      item.quantidade -= quantity;
    }
    
    // Atualizar status do item
    if (item.quantidade > item.estoqueMinimo) {
      item.status = 'normal';
    } else if (item.quantidade > item.estoqueCritico) {
      item.status = 'baixo';
    } else {
      item.status = 'critico';
    }
    
    // Mostrar mensagem de sucesso
    alert('Movimentação registrada com sucesso!');
    
    // Atualizar lista e voltar para a view de lista
    this.renderInventoryList();
    this.populateItemSelect();
    this.showView('list');
  }
  
  deleteItem(itemId) {
    // Confirmar exclusão
    if (!confirm('Tem certeza que deseja excluir este item?')) {
      return;
    }
    
    // Verificar se há movimentações para este item
    const hasMovements = this.inventoryData.movements.some(mov => mov.itemId === itemId);
    if (hasMovements) {
      alert('Não é possível excluir este item pois existem movimentações registradas para ele.');
      return;
    }
    
    // Remover item
    this.inventoryData.items = this.inventoryData.items.filter(item => item.id !== itemId);
    
    // Atualizar lista
    this.renderInventoryList();
    this.populateItemSelect();
    
    // Mostrar mensagem de sucesso
    alert('Item excluído com sucesso!');
  }
  
  filterItems() {
    const searchTerm = document.getElementById('inventory-search').value.toLowerCase();
    const categoryFilter = document.getElementById('inventory-category-filter').value;
    const statusFilter = document.getElementById('inventory-status-filter').value;
    
    // Filtrar itens
    let filteredItems = this.inventoryData.items.filter(item => {
      // Filtro de busca
      const matchesSearch = searchTerm === '' || 
        item.nome.toLowerCase().includes(searchTerm) || 
        item.descricao?.toLowerCase().includes(searchTerm) ||
        item.localizacao.toLowerCase().includes(searchTerm);
      
      // Filtro de categoria
      const matchesCategory = categoryFilter === '' || item.categoria === categoryFilter;
      
      // Filtro de status
      const matchesStatus = statusFilter === '' || item.status === statusFilter;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
    
    // Renderizar itens filtrados
    this.renderFilteredItems(filteredItems);
  }
  
  sortItems(sortBy) {
    let sortedItems = [...this.inventoryData.items];
    
    switch (sortBy) {
      case 'nome':
        sortedItems.sort((a, b) => a.nome.localeCompare(b.nome));
        break;
      case 'quantidade':
        sortedItems.sort((a, b) => b.quantidade - a.quantidade);
        break;
      case 'categoria':
        sortedItems.sort((a, b) => a.categoria.localeCompare(b.categoria));
        break;
    }
    
    // Renderizar itens ordenados
    this.renderFilteredItems(sortedItems);
  }
  
  renderFilteredItems(items) {
    const tableBody = document.getElementById('inventory-table-body');
    if (!tableBody) return;
    
    if (!items || items.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="7" class="text-center">Nenhum item encontrado com os filtros aplicados.</td></tr>';
      return;
    }
    
    let tableHtml = '';
    
    items.forEach(item => {
      const statusClass = `status-${item.status}`;
      const statusText = item.status === 'normal' ? 'Normal' : (item.status === 'baixo' ? 'Estoque Baixo' : 'Estoque Crítico');
      
      tableHtml += `
        <tr data-item-id="${item.id}">
          <td>
            <img src="${item.imagem}" alt="${item.nome}" class="table-image" onerror="this.src='https://via.placeholder.com/40?text=Sem+Imagem'">
          </td>
          <td>${item.nome}</td>
          <td>${item.categoria}</td>
          <td>${item.quantidade} ${item.unidade}</td>
          <td>${item.localizacao}</td>
          <td><span class="status-badge ${statusClass}">${statusText}</span></td>
          <td>
            <div class="btn-group btn-group-sm">
              <button type="button" class="btn btn-outline-primary edit-item-btn" data-item-id="${item.id}" title="Editar">
                <i class="fas fa-edit"></i>
              </button>
              <button type="button" class="btn btn-outline-success movement-item-btn" data-item-id="${item.id}" title="Movimentar">
                <i class="fas fa-exchange-alt"></i>
              </button>
              <button type="button" class="btn btn-outline-danger delete-item-btn" data-item-id="${item.id}" title="Excluir">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    });
    
    tableBody.innerHTML = tableHtml;
  }
}

// Exportar o componente
window.InventoryManagement = InventoryManagement;
