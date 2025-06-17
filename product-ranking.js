// Componente de ranking detalhado por produto e banheiro
class ProductRanking {
  constructor(containerId, apiBaseUrl = 
'/api/dashboard
') {
    this.container = document.getElementById(containerId);
    this.apiBaseUrl = apiBaseUrl;
    this.rankingData = {};
    this.filterComponent = null; // Placeholder for DateRangeFilter
    
    this.init();
  }
  
  async init() {
    this.renderLayout();
    this.initializeFilter();
    await this.loadRankingData(); // Load initial data with default filter
    this.setupEventListeners();
  }
  
  renderLayout() {
    this.container.innerHTML = `
      <div class="product-ranking">
        <div class="ranking-header">
          <h2>Ranking de Consumo por Banheiro</h2>
          <div id="ranking-filter-container"></div> <!-- Container for DateRangeFilter -->
        </div>
        
        <div class="ranking-grid">
          <div class="ranking-card masculine">
            <div class="ranking-card-header">
              <h3>RANK BANHEIROS - MASCULINO</h3>
              <span class="ranking-icon"><i class="fas fa-male"></i></span>
            </div>
            <div class="ranking-card-body" id="ranking-masculino">
              <div class="text-center p-3"><div class="spinner-border spinner-border-sm" role="status"></div> Carregando...</div>
            </div>
          </div>
          
          <div class="ranking-card feminine">
            <div class="ranking-card-header">
              <h3>RANK BANHEIROS - FEMININO</h3>
              <span class="ranking-icon"><i class="fas fa-female"></i></span>
            </div>
            <div class="ranking-card-body" id="ranking-feminino">
              <div class="text-center p-3"><div class="spinner-border spinner-border-sm" role="status"></div> Carregando...</div>
            </div>
          </div>
        </div>
        
        <div class="detailed-product-ranking mt-4 card">
          <div class="card-header">
            <h3>Ranking Detalhado por Produto (Geral)</h3>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-sm table-hover">
                <thead>
                  <tr>
                    <th>Posição</th>
                    <th>Produto</th>
                    <th>Quantidade Consumida</th>
                    <th>% do Total</th>
                  </tr>
                </thead>
                <tbody id="detailed-product-ranking-table">
                  <tr><td colspan="4" class="text-center"><div class="spinner-border spinner-border-sm" role="status"></div> Carregando...</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;
    this.addStyles();
  }
  
  initializeFilter() {
    const filterContainer = document.getElementById(
'ranking-filter-container
');
    if (filterContainer && typeof DateRangeFilter !== 
'undefined
') {
      this.filterComponent = new DateRangeFilter(
'ranking-filter-container
', this.handleFilterChange.bind(this), {
        showPresets: true,
        showSpecificDate: true,
        showDateRange: true,
        defaultPeriod: 30
      });
    } else {
      console.error(
"Container de filtro ou componente DateRangeFilter não encontrado para Ranking.
");
    }
  }
  
  handleFilterChange(filterType, filterData) {
    console.log(
"Filtro de Ranking alterado:
", filterType, filterData);
    // Recarregar dados com base no novo filtro
    this.loadRankingData(filterData);
  }
  
  addStyles() {
    const styleId = 
'product-ranking-styles
';
    if (!document.getElementById(styleId)) {
      const styleElement = document.createElement(
'style
');
      styleElement.id = styleId;
      styleElement.textContent = `
        .product-ranking {
          /* Estilos gerais se necessário */
        }
        
        .ranking-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 15px;
        }
        
        #ranking-filter-container .date-range-filter {
          border: none;
          box-shadow: none;
          padding: 0;
        }
        
        #ranking-filter-container .filter-header {
          display: none; /* Oculta o header do filtro genérico */
        }
        
        #ranking-filter-container .filter-body {
          padding: 0;
          display: flex;
          gap: 10px;
          align-items: flex-end;
        }
        
        .ranking-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 20px;
        }
        
        .ranking-card {
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .ranking-card-header {
          padding: 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: white;
        }
        
        .ranking-card.masculine .ranking-card-header {
          background-color: #3498db; /* Azul */
        }
        
        .ranking-card.feminine .ranking-card-header {
          background-color: #e83e8c; /* Rosa */
        }
        
        .ranking-card-header h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
        }
        
        .ranking-icon {
          font-size: 20px;
        }
        
        .ranking-card-body {
          padding: 0;
          background-color: white;
        }
        
        .ranking-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .ranking-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 15px;
          border-bottom: 1px solid #eee;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        
        .ranking-item:last-child {
          border-bottom: none;
        }
        
        .ranking-item:hover {
          background-color: #f8f9fa;
        }
        
        .ranking-item-location {
          font-weight: 500;
          flex-grow: 1;
          margin-right: 15px;
        }
        
        .ranking-item-value {
          font-weight: 600;
          min-width: 50px;
          text-align: right;
        }
        
        .ranking-item-details {
          display: none;
          padding: 10px 15px;
          background-color: #f8f9fa;
          border-top: 1px solid #eee;
        }
        
        .ranking-item-details.show {
          display: block;
        }
        
        .ranking-item-details h5 {
          font-size: 14px;
          margin-bottom: 8px;
          color: #555;
        }
        
        .ranking-item-details ul {
          list-style: none;
          padding: 0;
          margin: 0;
          font-size: 13px;
        }
        
        .ranking-item-details li {
          display: flex;
          justify-content: space-between;
          padding: 3px 0;
        }
        
        .detailed-product-ranking .card-header {
          background-color: #f8f9fa;
        }
        
        .detailed-product-ranking th {
          font-weight: 600;
        }
      `;
      document.head.appendChild(styleElement);
    }
  }
  
  async loadRankingData(filterData = null) {
    // Usar filtro padrão se nenhum for passado
    const currentFilter = filterData || this.filterComponent?.getCurrentFilter().data || { period: 30 }; 
    
    // Simular carregamento de dados com base no filtro
    console.log(
"Carregando dados de ranking com filtro:
", currentFilter);
    const masculinoContainer = document.getElementById(
'ranking-masculino
');
    const femininoContainer = document.getElementById(
'ranking-feminino
');
    const detailedTableBody = document.getElementById(
'detailed-product-ranking-table
');
    
    masculinoContainer.innerHTML = 
'<div class="text-center p-3"><div class="spinner-border spinner-border-sm" role="status"></div> Carregando...</div>
';
    femininoContainer.innerHTML = 
'<div class="text-center p-3"><div class="spinner-border spinner-border-sm" role="status"></div> Carregando...</div>
';
    detailedTableBody.innerHTML = 
'<tr><td colspan="4" class="text-center"><div class="spinner-border spinner-border-sm" role="status"></div> Carregando...</td></tr>
';
    
    return new Promise(resolve => {
      setTimeout(() => {
        // Dados fictícios baseados no período (simulação)
        const factor = currentFilter.period ? (currentFilter.period / 30) : 1;
        
        this.rankingData = {
          masculino: [
            { id: 9, localizacao: 
'Andar 5 - Masculino
', valor: Math.round(170 * factor), topProdutos: [{ nome: 
'Papel Higiênico
', qtd: Math.round(100 * factor) }, { nome: 
'Sabonete Líquido
', qtd: Math.round(40 * factor) }, { nome: 
'Papel Toalha
', qtd: Math.round(30 * factor) }] },
            { id: 5, localizacao: 
'Andar 3 - Masculino
', valor: Math.round(116 * factor), topProdutos: [{ nome: 
'Papel Higiênico
', qtd: Math.round(70 * factor) }, { nome: 
'Sabonete Líquido
', qtd: Math.round(30 * factor) }, { nome: 
'Álcool em Gel
', qtd: Math.round(16 * factor) }] },
            { id: 3, localizacao: 
'Andar 2 - Masculino
', valor: Math.round(83 * factor), topProdutos: [{ nome: 
'Papel Higiênico
', qtd: Math.round(50 * factor) }, { nome: 
'Papel Toalha
', qtd: Math.round(25 * factor) }, { nome: 
'Sabonete Líquido
', qtd: Math.round(8 * factor) }] },
            { id: 1, localizacao: 
'Andar 1 - Masculino
', valor: Math.round(31 * factor), topProdutos: [{ nome: 
'Papel Higiênico
', qtd: Math.round(20 * factor) }, { nome: 
'Papel Toalha
', qtd: Math.round(7 * factor) }, { nome: 
'Sabonete Líquido
', qtd: Math.round(4 * factor) }] },
             { id: 7, localizacao: 
'Andar 4 - Masculino
', valor: Math.round(95 * factor), topProdutos: [{ nome: 
'Papel Higiênico
', qtd: Math.round(60 * factor) }, { nome: 
'Sabonete Líquido
', qtd: Math.round(25 * factor) }, { nome: 
'Papel Toalha
', qtd: Math.round(10 * factor) }] },
          ].sort((a, b) => b.valor - a.valor), // Ordenar por valor desc
          feminino: [
            { id: 6, localizacao: 
'Andar 3 - Feminino
', valor: Math.round(194 * factor), topProdutos: [{ nome: 
'Papel Higiênico
', qtd: Math.round(110 * factor) }, { nome: 
'Sabonete Líquido
', qtd: Math.round(50 * factor) }, { nome: 
'Papel Toalha
', qtd: Math.round(34 * factor) }] },
            { id: 10, localizacao: 
'Andar 5 - Feminino
', valor: Math.round(186 * factor), topProdutos: [{ nome: 
'Papel Higiênico
', qtd: Math.round(100 * factor) }, { nome: 
'Sabonete Líquido
', qtd: Math.round(55 * factor) }, { nome: 
'Papel Toalha
', qtd: Math.round(31 * factor) }] },
            { id: 2, localizacao: 
'Andar 1 - Feminino
', valor: Math.round(129 * factor), topProdutos: [{ nome: 
'Papel Higiênico
', qtd: Math.round(80 * factor) }, { nome: 
'Sabonete Líquido
', qtd: Math.round(35 * factor) }, { nome: 
'Álcool em Gel
', qtd: Math.round(14 * factor) }] },
            { id: 4, localizacao: 
'Andar 2 - Feminino
', valor: Math.round(94 * factor), topProdutos: [{ nome: 
'Papel Higiênico
', qtd: Math.round(60 * factor) }, { nome: 
'Papel Toalha
', qtd: Math.round(20 * factor) }, { nome: 
'Sabonete Líquido
', qtd: Math.round(14 * factor) }] },
            { id: 8, localizacao: 
'Andar 4 - Feminino
', valor: Math.round(150 * factor), topProdutos: [{ nome: 
'Papel Higiênico
', qtd: Math.round(90 * factor) }, { nome: 
'Sabonete Líquido
', qtd: Math.round(40 * factor) }, { nome: 
'Papel Toalha
', qtd: Math.round(20 * factor) }] },
          ].sort((a, b) => b.valor - a.valor), // Ordenar por valor desc
          produtosGeral: [
            { nome: 
'Papel Higiênico
', quantidade: Math.round(1000 * factor) },
            { nome: 
'Sabonete Líquido
', quantidade: Math.round(650 * factor) },
            { nome: 
'Papel Toalha
', quantidade: Math.round(400 * factor) },
            { nome: 
'Álcool em Gel
', quantidade: Math.round(150 * factor) },
            { nome: 
'Desinfetante
', quantidade: Math.round(50 * factor) },
          ].sort((a, b) => b.quantidade - a.quantidade)
        };
        
        this.renderRankings();
        this.renderDetailedProductRanking();
        resolve(this.rankingData);
      }, 500);
    });
  }
  
  renderRankings() {
    this.renderRankingList(
'ranking-masculino
', this.rankingData.masculino);
    this.renderRankingList(
'ranking-feminino
', this.rankingData.feminino);
  }
  
  renderRankingList(containerId, data) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (!data || data.length === 0) {
      container.innerHTML = 
'<p class="text-center p-3 text-muted">Nenhum dado encontrado para este período.</p>
';
      return;
    }
    
    const list = document.createElement(
'ul
');
    list.className = 
'ranking-list
';
    
    data.forEach((item, index) => {
      const listItem = document.createElement(
'li
');
      listItem.className = 
'ranking-item
';
      listItem.dataset.itemId = item.id;
      
      listItem.innerHTML = `
        <span class="ranking-item-location">${index + 1}. ${item.localizacao}</span>
        <span class="ranking-item-value">${item.valor}</span>
      `;
      
      // Detalhes expansíveis
      const detailsDiv = document.createElement(
'div
');
      detailsDiv.className = 
'ranking-item-details
';
      detailsDiv.id = `details-${item.id}`;
      let detailsHtml = 
'<h5>Top 3 Produtos Consumidos:</h5><ul>
';
      if (item.topProdutos && item.topProdutos.length > 0) {
        item.topProdutos.forEach(prod => {
          detailsHtml += `<li><span>${prod.nome}</span><span>${prod.qtd}</span></li>`;
        });
      } else {
        detailsHtml += 
'<li>Nenhum produto registrado</li>
';
      }
      detailsHtml += 
'</ul>
';
      detailsDiv.innerHTML = detailsHtml;
      
      listItem.appendChild(detailsDiv);
      list.appendChild(listItem);
    });
    
    container.innerHTML = 
'
'; // Limpar container
    container.appendChild(list);
  }
  
  renderDetailedProductRanking() {
    const tableBody = document.getElementById(
'detailed-product-ranking-table
');
    if (!tableBody) return;
    
    const data = this.rankingData.produtosGeral;
    
    if (!data || data.length === 0) {
      tableBody.innerHTML = 
'<tr><td colspan="4" class="text-center text-muted">Nenhum dado de produto encontrado.</td></tr>
';
      return;
    }
    
    tableBody.innerHTML = 
'
'; // Limpar tabela
    const totalGeral = data.reduce((sum, item) => sum + item.quantidade, 0);
    
    data.forEach((item, index) => {
      const percentage = totalGeral > 0 ? ((item.quantidade / totalGeral) * 100).toFixed(1) : 0;
      const row = document.createElement(
'tr
');
      row.innerHTML = `
        <td>${index + 1}º</td>
        <td>${item.nome}</td>
        <td>${item.quantidade}</td>
        <td>${percentage}%</td>
      `;
      tableBody.appendChild(row);
    });
  }
  
  setupEventListeners() {
    // Event listener para expandir/recolher detalhes
    this.container.addEventListener(
'click
', (event) => {
      const targetItem = event.target.closest(
'.ranking-item
');
      if (targetItem) {
        const detailsId = `details-${targetItem.dataset.itemId}`;
        const detailsDiv = targetItem.querySelector(
'.ranking-item-details
');
        if (detailsDiv) {
          detailsDiv.classList.toggle(
'show
');
        }
      }
    });
  }
}

// Exportar o componente
window.ProductRanking = ProductRanking;
