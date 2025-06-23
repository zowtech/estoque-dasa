// Componente de análise de desperdício
class WasteAnalysis {
  constructor(containerId, apiBaseUrl = '/api/dashboard') {
    this.container = document.getElementById(containerId);
    this.apiBaseUrl = apiBaseUrl;
    this.currentPeriod = 30; // Padrão: últimos 30 dias
    this.currentDate = new Date();
    this.selectedDate = this.formatDate(this.currentDate);
    this.charts = {}; // Armazenar instâncias de gráficos
    
    this.init();
  }
  
  async init() {
    this.render();
    await this.loadData();
    this.setupEventListeners();
  }
  
  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  render() {
    this.container.innerHTML = `
      <div class="waste-analysis">
        <div class="waste-header">
          <h2>Análise de Desperdício</h2>
          <div class="waste-filters">
            <div class="filter-group">
              <label for="waste-date-filter">Data específica:</label>
              <input type="date" id="waste-date-filter" class="form-control" value="${this.selectedDate}">
            </div>
            <div class="filter-group">
              <label for="waste-period-filter">Ou período:</label>
              <select id="waste-period-filter" class="form-control">
                <option value="7">Últimos 7 dias</option>
                <option value="30" selected>Últimos 30 dias</option>
                <option value="90">Últimos 90 dias</option>
                <option value="365">Último ano</option>
              </select>
            </div>
            <div class="filter-group">
              <label for="waste-product-filter">Produto:</label>
              <select id="waste-product-filter" class="form-control">
                <option value="all" selected>Todos os produtos</option>
                <option value="1">Papel Higiênico</option>
                <option value="2">Sabonete Líquido</option>
                <option value="3">Papel Toalha</option>
                <option value="4">Álcool em Gel</option>
                <option value="5">Desinfetante</option>
              </select>
            </div>
            <button id="apply-waste-filters" class="btn btn-primary">Aplicar</button>
          </div>
        </div>
        
        <div class="waste-overview">
          <div class="waste-card total-waste">
            <div class="waste-card-header">
              <h3>Desperdício Total</h3>
              <span class="waste-card-icon"><i class="fas fa-trash-alt"></i></span>
            </div>
            <div class="waste-card-body">
              <div class="waste-card-value">15.2%</div>
              <div class="waste-card-label">do consumo total</div>
            </div>
            <div class="waste-card-footer">
              <div class="waste-trend up">
                <i class="fas fa-arrow-up"></i> 2.3% em relação ao período anterior
              </div>
            </div>
          </div>
          
          <div class="waste-card estimated-loss">
            <div class="waste-card-header">
              <h3>Perda Estimada</h3>
              <span class="waste-card-icon"><i class="fas fa-money-bill-wave"></i></span>
            </div>
            <div class="waste-card-body">
              <div class="waste-card-value">R$ 1.250</div>
              <div class="waste-card-label">no período</div>
            </div>
            <div class="waste-card-footer">
              <div class="waste-trend up">
                <i class="fas fa-arrow-up"></i> R$ 180 em relação ao período anterior
              </div>
            </div>
          </div>
          
          <div class="waste-card potential-savings">
            <div class="waste-card-header">
              <h3>Economia Potencial</h3>
              <span class="waste-card-icon"><i class="fas fa-piggy-bank"></i></span>
            </div>
            <div class="waste-card-body">
              <div class="waste-card-value">R$ 950</div>
              <div class="waste-card-label">com redução de 75% do desperdício</div>
            </div>
            <div class="waste-card-footer">
              <div class="waste-action">
                <button class="btn btn-sm btn-outline-primary">Ver plano de ação</button>
              </div>
            </div>
          </div>
          
          <div class="waste-card critical-areas">
            <div class="waste-card-header">
              <h3>Áreas Críticas</h3>
              <span class="waste-card-icon"><i class="fas fa-exclamation-triangle"></i></span>
            </div>
            <div class="waste-card-body">
              <div class="waste-card-value">2</div>
              <div class="waste-card-label">andares com desperdício acima de 20%</div>
            </div>
            <div class="waste-card-footer">
              <div class="waste-action">
                <button class="btn btn-sm btn-outline-danger">Ver detalhes</button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="waste-charts-grid">
          <div class="waste-chart-card">
            <div class="waste-chart-header">
              <h3>Desperdício por Andar</h3>
              <div class="chart-actions">
                <button class="btn-chart-type active" data-chart="waste-andar" data-type="bar" title="Gráfico de barras">
                  <i class="fas fa-chart-bar"></i>
                </button>
                <button class="btn-chart-type" data-chart="waste-andar" data-type="pie" title="Gráfico de pizza">
                  <i class="fas fa-chart-pie"></i>
                </button>
                <button class="btn-chart-type" data-chart="waste-andar" data-type="line" title="Gráfico de linha">
                  <i class="fas fa-chart-line"></i>
                </button>
              </div>
            </div>
            <div class="waste-chart-container">
              <canvas id="waste-andar-chart"></canvas>
            </div>
          </div>
          
          <div class="waste-chart-card">
            <div class="waste-chart-header">
              <h3>Desperdício por Produto</h3>
              <div class="chart-actions">
                <button class="btn-chart-type" data-chart="waste-produto" data-type="bar" title="Gráfico de barras">
                  <i class="fas fa-chart-bar"></i>
                </button>
                <button class="btn-chart-type active" data-chart="waste-produto" data-type="pie" title="Gráfico de pizza">
                  <i class="fas fa-chart-pie"></i>
                </button>
                <button class="btn-chart-type" data-chart="waste-produto" data-type="line" title="Gráfico de linha">
                  <i class="fas fa-chart-line"></i>
                </button>
              </div>
            </div>
            <div class="waste-chart-container">
              <canvas id="waste-produto-chart"></canvas>
            </div>
          </div>
          
          <div class="waste-chart-card">
            <div class="waste-chart-header">
              <h3>Comparativo Masculino vs Feminino</h3>
              <div class="chart-actions">
                <button class="btn-chart-type active" data-chart="waste-genero" data-type="bar" title="Gráfico de barras">
                  <i class="fas fa-chart-bar"></i>
                </button>
                <button class="btn-chart-type" data-chart="waste-genero" data-type="pie" title="Gráfico de pizza">
                  <i class="fas fa-chart-pie"></i>
                </button>
                <button class="btn-chart-type" data-chart="waste-genero" data-type="line" title="Gráfico de linha">
                  <i class="fas fa-chart-line"></i>
                </button>
              </div>
            </div>
            <div class="waste-chart-container">
              <canvas id="waste-genero-chart"></canvas>
            </div>
          </div>
          
          <div class="waste-chart-card">
            <div class="waste-chart-header">
              <h3>Tendência de Desperdício</h3>
              <div class="chart-actions">
                <button class="btn-chart-type" data-chart="waste-tendencia" data-type="bar" title="Gráfico de barras">
                  <i class="fas fa-chart-bar"></i>
                </button>
                <button class="btn-chart-type" data-chart="waste-tendencia" data-type="pie" title="Gráfico de pizza">
                  <i class="fas fa-chart-pie"></i>
                </button>
                <button class="btn-chart-type active" data-chart="waste-tendencia" data-type="line" title="Gráfico de linha">
                  <i class="fas fa-chart-line"></i>
                </button>
              </div>
            </div>
            <div class="waste-chart-container">
              <canvas id="waste-tendencia-chart"></canvas>
            </div>
          </div>
        </div>
        
        <div class="waste-detailed-analysis">
          <h3>Análise Detalhada de Desperdício</h3>
          <div class="waste-table-container">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>Andar</th>
                  <th>Banheiro</th>
                  <th>Produto</th>
                  <th>Consumo</th>
                  <th>Desperdício</th>
                  <th>% Desperdício</th>
                  <th>Economia Potencial</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody id="waste-table-body">
                <tr>
                  <td>5</td>
                  <td>Masculino</td>
                  <td>Papel Higiênico</td>
                  <td>170</td>
                  <td>38</td>
                  <td>22.4%</td>
                  <td>R$ 152</td>
                  <td><span class="badge bg-danger">Crítico</span></td>
                </tr>
                <tr>
                  <td>5</td>
                  <td>Feminino</td>
                  <td>Papel Higiênico</td>
                  <td>186</td>
                  <td>35</td>
                  <td>18.8%</td>
                  <td>R$ 140</td>
                  <td><span class="badge bg-warning">Alto</span></td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>Masculino</td>
                  <td>Papel Higiênico</td>
                  <td>116</td>
                  <td>22</td>
                  <td>19.0%</td>
                  <td>R$ 88</td>
                  <td><span class="badge bg-warning">Alto</span></td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>Feminino</td>
                  <td>Papel Higiênico</td>
                  <td>137</td>
                  <td>24</td>
                  <td>17.5%</td>
                  <td>R$ 96</td>
                  <td><span class="badge bg-warning">Alto</span></td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Masculino</td>
                  <td>Papel Higiênico</td>
                  <td>83</td>
                  <td>12</td>
                  <td>14.5%</td>
                  <td>R$ 48</td>
                  <td><span class="badge bg-info">Médio</span></td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Feminino</td>
                  <td>Papel Higiênico</td>
                  <td>94</td>
                  <td>13</td>
                  <td>13.8%</td>
                  <td>R$ 52</td>
                  <td><span class="badge bg-info">Médio</span></td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>Masculino</td>
                  <td>Papel Higiênico</td>
                  <td>31</td>
                  <td>3</td>
                  <td>9.7%</td>
                  <td>R$ 12</td>
                  <td><span class="badge bg-success">Baixo</span></td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>Feminino</td>
                  <td>Papel Higiênico</td>
                  <td>129</td>
                  <td>15</td>
                  <td>11.6%</td>
                  <td>R$ 60</td>
                  <td><span class="badge bg-info">Médio</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div class="waste-action-plan">
          <h3>Plano de Ação para Redução de Desperdício</h3>
          <div class="action-cards">
            <div class="action-card">
              <div class="action-card-header">
                <h4>Treinamento de Conscientização</h4>
                <span class="action-priority high">Alta Prioridade</span>
              </div>
              <div class="action-card-body">
                <p>Realizar treinamentos de conscientização sobre o uso adequado de papel higiênico nos andares 5 e 3, que apresentam os maiores índices de desperdício.</p>
                <div class="action-metrics">
                  <div class="action-metric">
                    <span class="metric-label">Economia estimada:</span>
                    <span class="metric-value">R$ 380/mês</span>
                  </div>
                  <div class="action-metric">
                    <span class="metric-label">Tempo de implementação:</span>
                    <span class="metric-value">2 semanas</span>
                  </div>
                </div>
              </div>
              <div class="action-card-footer">
                <button class="btn btn-sm btn-primary">Implementar</button>
                <button class="btn btn-sm btn-outline-secondary">Detalhes</button>
              </div>
            </div>
            
            <div class="action-card">
              <div class="action-card-header">
                <h4>Instalação de Dispensers Controlados</h4>
                <span class="action-priority medium">Média Prioridade</span>
              </div>
              <div class="action-card-body">
                <p>Substituir os dispensers de papel higiênico atuais por modelos com controle de quantidade nos banheiros dos andares 5 e 3.</p>
                <div class="action-metrics">
                  <div class="action-metric">
                    <span class="metric-label">Economia estimada:</span>
                    <span class="metric-value">R$ 450/mês</span>
                  </div>
                  <div class="action-metric">
                    <span class="metric-label">Tempo de implementação:</span>
                    <span class="metric-value">1 mês</span>
                  </div>
                  <div class="action-metric">
                    <span class="metric-label">Investimento:</span>
                    <span class="metric-value">R$ 2.800</span>
                  </div>
                </div>
              </div>
              <div class="action-card-footer">
                <button class="btn btn-sm btn-primary">Implementar</button>
                <button class="btn btn-sm btn-outline-secondary">Detalhes</button>
              </div>
            </div>
            
            <div class="action-card">
              <div class="action-card-header">
                <h4>Monitoramento Semanal</h4>
                <span class="action-priority low">Baixa Prioridade</span>
              </div>
              <div class="action-card-body">
                <p>Implementar sistema de monitoramento semanal do consumo e desperdício em todos os andares, com feedback visual para os usuários.</p>
                <div class="action-metrics">
                  <div class="action-metric">
                    <span class="metric-label">Economia estimada:</span>
                    <span class="metric-value">R$ 120/mês</span>
                  </div>
                  <div class="action-metric">
                    <span class="metric-label">Tempo de implementação:</span>
                    <span class="metric-value">2 dias</span>
                  </div>
                </div>
              </div>
              <div class="action-card-footer">
                <button class="btn btn-sm btn-primary">Implementar</button>
                <button class="btn btn-sm btn-outline-secondary">Detalhes</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Adicionar estilos específicos
    this.addStyles();
  }
  
  addStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      .waste-analysis {
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        padding: 20px;
      }
      
      .waste-header {
        margin-bottom: 20px;
      }
      
      .waste-filters {
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
        margin-top: 15px;
        align-items: flex-end;
      }
      
      .filter-group {
        display: flex;
        flex-direction: column;
        gap: 5px;
      }
      
      .waste-overview {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin-bottom: 30px;
      }
      
      .waste-card {
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        overflow: hidden;
        border: 1px solid #eee;
        padding: 15px;
        display: flex;
        flex-direction: column;
      }
      
      .waste-card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
      }
      
      .waste-card-header h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        color: #555;
      }
      
      .waste-card-icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: #f8f9fa;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        color: #6c757d;
      }
      
      .total-waste .waste-card-icon {
        color: #dc3545;
        background-color: rgba(220, 53, 69, 0.1);
      }
      
      .estimated-loss .waste-card-icon {
        color: #fd7e14;
        background-color: rgba(253, 126, 20, 0.1);
      }
      
      .potential-savings .waste-card-icon {
        color: #198754;
        background-color: rgba(25, 135, 84, 0.1);
      }
      
      .critical-areas .waste-card-icon {
        color: #dc3545;
        background-color: rgba(220, 53, 69, 0.1);
      }
      
      .waste-card-body {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 10px 0;
      }
      
      .waste-card-value {
        font-size: 28px;
        font-weight: 700;
        margin-bottom: 5px;
      }
      
      .total-waste .waste-card-value {
        color: #dc3545;
      }
      
      .estimated-loss .waste-card-value {
        color: #fd7e14;
      }
      
      .potential-savings .waste-card-value {
        color: #198754;
      }
      
      .critical-areas .waste-card-value {
        color: #dc3545;
      }
      
      .waste-card-label {
        font-size: 14px;
        color: #6c757d;
      }
      
      .waste-card-footer {
        margin-top: 15px;
        padding-top: 15px;
        border-top: 1px solid #eee;
      }
      
      .waste-trend {
        font-size: 14px;
        display: flex;
        align-items: center;
        gap: 5px;
      }
      
      .waste-trend.up {
        color: #dc3545;
      }
      
      .waste-trend.down {
        color: #198754;
      }
      
      .waste-action {
        display: flex;
        justify-content: center;
      }
      
      .waste-charts-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        gap: 20px;
        margin-bottom: 30px;
      }
      
      .waste-chart-card {
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        overflow: hidden;
        border: 1px solid #eee;
      }
      
      .waste-chart-header {
        padding: 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #eee;
      }
      
      .waste-chart-header h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
      }
      
      .waste-chart-container {
        height: 300px;
        padding: 15px;
        position: relative;
      }
      
      .waste-detailed-analysis {
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        padding: 20px;
        border: 1px solid #eee;
        margin-bottom: 30px;
      }
      
      .waste-table-container {
        overflow-x: auto;
      }
      
      .waste-action-plan {
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        padding: 20px;
        border: 1px solid #eee;
      }
      
      .action-cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
        margin-top: 20px;
      }
      
      .action-card {
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        overflow: hidden;
        border: 1px solid #eee;
      }
      
      .action-card-header {
        padding: 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #eee;
        background-color: #f8f9fa;
      }
      
      .action-card-header h4 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
      }
      
      .action-priority {
        font-size: 12px;
        padding: 4px 8px;
        border-radius: 4px;
      }
      
      .action-priority.high {
        background-color: rgba(220, 53, 69, 0.1);
        color: #dc3545;
      }
      
      .action-priority.medium {
        background-color: rgba(255, 193, 7, 0.1);
        color: #ffc107;
      }
      
      .action-priority.low {
        background-color: rgba(25, 135, 84, 0.1);
        color: #198754;
      }
      
      .action-card-body {
        padding: 15px;
      }
      
      .action-metrics {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 15px;
      }
      
      .action-metric {
        background-color: #f8f9fa;
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 14px;
        display: flex;
        flex-direction: column;
      }
      
      .metric-label {
        font-size: 12px;
        color: #6c757d;
      }
      
      .metric-value {
        font-weight: 600;
      }
      
      .action-card-footer {
        padding: 15px;
        border-top: 1px solid #eee;
        display: flex;
        gap: 10px;
      }
      
      @media (max-width: 768px) {
        .waste-filters {
          flex-direction: column;
          align-items: stretch;
        }
        
        .waste-charts-grid {
          grid-template-columns: 1fr;
        }
        
        .action-cards {
          grid-template-columns: 1fr;
        }
      }
    `;
    
    document.head.appendChild(styleElement);
  }
  
  async loadData() {
    try {
      // Carregar dados para os gráficos
      await Promise.all([
        this.loadWastePorAndarData(),
        this.loadWastePorProdutoData(),
        this.loadWasteGeneroData(),
        this.loadWasteTendenciaData()
      ]);
      
      // Renderizar gráficos
      this.renderWastePorAndarChart();
      this.renderWastePorProdutoChart();
      this.renderWasteGeneroChart();
      this.renderWasteTendenciaChart();
    } catch (error) {
      console.error('Erro ao carregar dados de desperdício:', error);
      this.showError('Não foi possível carregar os dados de desperdício. Tente novamente mais tarde.');
    }
  }
  
  async loadWastePorAndarData() {
    // Simular carregamento de dados
    return new Promise(resolve => {
      setTimeout(() => {
        this.wastePorAndarData = [
          { andar: 1, desperdicio: 9.7 },
          { andar: 2, desperdicio: 14.2 },
          { andar: 3, desperdicio: 18.3 },
          { andar: 4, desperdicio: 15.5 },
          { andar: 5, desperdicio: 20.6 }
        ];
        
        resolve(this.wastePorAndarData);
      }, 300);
    });
  }
  
  async loadWastePorProdutoData() {
    // Simular carregamento de dados
    return new Promise(resolve => {
      setTimeout(() => {
        this.wastePorProdutoData = [
          { nome: 'Papel Higiênico', desperdicio: 18.5 },
          { nome: 'Sabonete Líquido', desperdicio: 12.3 },
          { nome: 'Papel Toalha', desperdicio: 15.8 },
          { nome: 'Álcool em Gel', desperdicio: 8.2 },
          { nome: 'Desinfetante', desperdicio: 5.4 }
        ];
        
        resolve(this.wastePorProdutoData);
      }, 300);
    });
  }
  
  async loadWasteGeneroData() {
    // Simular carregamento de dados
    return new Promise(resolve => {
      setTimeout(() => {
        this.wasteGeneroData = {
          andares: [1, 2, 3, 4, 5],
          masculino: [9.7, 14.5, 19.0, 16.2, 22.4],
          feminino: [11.6, 13.8, 17.5, 14.8, 18.8]
        };
        
        resolve(this.wasteGeneroData);
      }, 300);
    });
  }
  
  async loadWasteTendenciaData() {
    // Simular carregamento de dados
    return new Promise(resolve => {
      setTimeout(() => {
        // Gerar dados para os últimos 6 meses
        const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
        const desperdicio = [12.5, 13.2, 14.8, 15.3, 15.8, 15.2];
        
        this.wasteTendenciaData = {
          meses,
          desperdicio
        };
        
        resolve(this.wasteTendenciaData);
      }, 300);
    });
  }
  
  renderWastePorAndarChart() {
    const chartContainer = document.getElementById('waste-andar-chart');
    
    // Verificar se Chart.js está disponível
    if (!window.Chart) {
      chartContainer.innerHTML = '<div class="error">Chart.js não está disponível</div>';
      return;
    }
    
    // Destruir gráfico anterior se existir
    if (this.charts.wasteAndar) {
      this.charts.wasteAndar.destroy();
    }
    
    // Preparar dados para o gráfico
    const labels = this.wastePorAndarData.map(item => `Andar ${item.andar}`);
    const values = this.wastePorAndarData.map(item => item.desperdicio);
    const backgroundColors = values.map(value => {
      if (value >= 20) return 'rgba(220, 53, 69, 0.7)'; // Vermelho para crítico
      if (value >= 15) return 'rgba(255, 193, 7, 0.7)'; // Amarelo para alto
      if (value >= 10) return 'rgba(13, 202, 240, 0.7)'; // Azul para médio
      return 'rgba(25, 135, 84, 0.7)'; // Verde para baixo
    });
    
    // Criar gráfico
    this.charts.wasteAndar = new Chart(chartContainer, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Desperdício (%)',
          data: values,
          backgroundColor: backgroundColors,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Desperdício por Andar (%)'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Desperdício (%)'
            },
            ticks: {
              callback: function(value) {
                return value + '%';
              }
            }
          },
          x: {
            title: {
              display: true,
              text: 'Andar'
            }
          }
        }
      }
    });
  }
  
  renderWastePorProdutoChart() {
    const chartContainer = document.getElementById('waste-produto-chart');
    
    // Verificar se Chart.js está disponível
    if (!window.Chart) {
      chartContainer.innerHTML = '<div class="error">Chart.js não está disponível</div>';
      return;
    }
    
    // Destruir gráfico anterior se existir
    if (this.charts.wasteProduto) {
      this.charts.wasteProduto.destroy();
    }
    
    // Preparar dados para o gráfico
    const labels = this.wastePorProdutoData.map(item => item.nome);
    const values = this.wastePorProdutoData.map(item => item.desperdicio);
    const backgroundColors = values.map(value => {
      if (value >= 20) return 'rgba(220, 53, 69, 0.7)'; // Vermelho para crítico
      if (value >= 15) return 'rgba(255, 193, 7, 0.7)'; // Amarelo para alto
      if (value >= 10) return 'rgba(13, 202, 240, 0.7)'; // Azul para médio
      return 'rgba(25, 135, 84, 0.7)'; // Verde para baixo
    });
    
    // Criar gráfico
    this.charts.wasteProduto = new Chart(chartContainer, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: backgroundColors,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              boxWidth: 15
            }
          },
          title: {
            display: true,
            text: 'Desperdício por Produto (%)'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const value = context.raw;
                return `${context.label}: ${value}%`;
              }
            }
          }
        }
      }
    });
  }
  
  renderWasteGeneroChart() {
    const chartContainer = document.getElementById('waste-genero-chart');
    
    // Verificar se Chart.js está disponível
    if (!window.Chart) {
      chartContainer.innerHTML = '<div class="error">Chart.js não está disponível</div>';
      return;
    }
    
    // Destruir gráfico anterior se existir
    if (this.charts.wasteGenero) {
      this.charts.wasteGenero.destroy();
    }
    
    // Preparar dados para o gráfico
    const labels = this.wasteGeneroData.andares.map(andar => `Andar ${andar}`);
    const masculino = this.wasteGeneroData.masculino;
    const feminino = this.wasteGeneroData.feminino;
    
    // Criar gráfico
    this.charts.wasteGenero = new Chart(chartContainer, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Masculino',
            data: masculino,
            backgroundColor: 'rgba(54, 162, 235, 0.7)',
            borderWidth: 1
          },
          {
            label: 'Feminino',
            data: feminino,
            backgroundColor: 'rgba(255, 99, 132, 0.7)',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Desperdício por Gênero (%)'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Desperdício (%)'
            },
            ticks: {
              callback: function(value) {
                return value + '%';
              }
            }
          },
          x: {
            title: {
              display: true,
              text: 'Andar'
            }
          }
        }
      }
    });
  }
  
  renderWasteTendenciaChart() {
    const chartContainer = document.getElementById('waste-tendencia-chart');
    
    // Verificar se Chart.js está disponível
    if (!window.Chart) {
      chartContainer.innerHTML = '<div class="error">Chart.js não está disponível</div>';
      return;
    }
    
    // Destruir gráfico anterior se existir
    if (this.charts.wasteTendencia) {
      this.charts.wasteTendencia.destroy();
    }
    
    // Preparar dados para o gráfico
    const labels = this.wasteTendenciaData.meses;
    const values = this.wasteTendenciaData.desperdicio;
    
    // Criar gráfico
    this.charts.wasteTendencia = new Chart(chartContainer, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Desperdício (%)',
          data: values,
          borderColor: 'rgba(220, 53, 69, 1)',
          backgroundColor: 'rgba(220, 53, 69, 0.1)',
          borderWidth: 2,
          tension: 0.3,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Tendência de Desperdício'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Desperdício (%)'
            },
            ticks: {
              callback: function(value) {
                return value + '%';
              }
            }
          },
          x: {
            title: {
              display: true,
              text: 'Mês'
            }
          }
        }
      }
    });
  }
  
  setupEventListeners() {
    // Botões de tipo de gráfico
    const chartTypeButtons = this.container.querySelectorAll('.btn-chart-type');
    chartTypeButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Identificar o gráfico alvo
        const chartTarget = button.dataset.chart;
        const chartType = button.dataset.type;
        
        // Remover classe active de todos os botões do mesmo gráfico
        const relatedButtons = this.container.querySelectorAll(`.btn-chart-type[data-chart="${chartTarget}"]`);
        relatedButtons.forEach(b => b.classList.remove('active'));
        
        // Adicionar classe active ao botão selecionado
        button.classList.add('active');
        
        // Renderizar gráfico com o novo tipo
        // Implementar lógica para cada tipo de gráfico
      });
    });
    
    // Filtro de data
    const dateFilter = this.container.querySelector('#waste-date-filter');
    dateFilter.addEventListener('change', () => {
      this.selectedDate = dateFilter.value;
    });
    
    // Filtro de período
    const periodFilter = this.container.querySelector('#waste-period-filter');
    periodFilter.addEventListener('change', () => {
      this.currentPeriod = parseInt(periodFilter.value);
    });
    
    // Botão de aplicar filtros
    const applyFiltersButton = this.container.querySelector('#apply-waste-filters');
    applyFiltersButton.addEventListener('click', () => {
      this.loadData();
    });
    
    // Botões de ação
    const actionButtons = this.container.querySelectorAll('.waste-action button, .action-card-footer button');
    actionButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Funcionalidade em desenvolvimento');
      });
    });
  }
  
  showError(message) {
    // Mostrar mensagem de erro
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-notification';
    errorDiv.textContent = message;
    
    document.body.appendChild(errorDiv);
    
    // Remover após alguns segundos
    setTimeout(() => {
      document.body.removeChild(errorDiv);
    }, 5000);
  }
}

// Exportar o componente
window.WasteAnalysis = WasteAnalysis;
