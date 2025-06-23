// Componente de análise de consumo por produto e andar
class ConsumptionAnalysis {
  constructor(containerId, apiBaseUrl = '/api/dashboard') {
    this.container = document.getElementById(containerId);
    this.apiBaseUrl = apiBaseUrl;
    this.consumptionData = {};
    this.filterComponent = null;
    this.currentView = 'andar'; // andar, produto
    this.chartType = 'bar'; // bar, pie, line
    
    this.init();
  }
  
  async init() {
    this.renderLayout();
    this.initializeFilter();
    await this.loadConsumptionData();
    this.setupEventListeners();
  }
  
  renderLayout() {
    this.container.innerHTML = `
      <div class="consumption-analysis">
        <div class="analysis-header">
          <div class="analysis-title">
            <h2>Análise de Consumo</h2>
          </div>
          <div class="analysis-actions">
            <div class="btn-group view-toggle" role="group">
              <button type="button" class="btn btn-outline-primary active" data-view="andar">Por Andar</button>
              <button type="button" class="btn btn-outline-primary" data-view="produto">Por Produto</button>
            </div>
            <div class="btn-group chart-toggle ms-2" role="group">
              <button type="button" class="btn btn-outline-secondary active" data-chart="bar" title="Gráfico de Barras">
                <i class="fas fa-chart-bar"></i>
              </button>
              <button type="button" class="btn btn-outline-secondary" data-chart="pie" title="Gráfico de Pizza">
                <i class="fas fa-chart-pie"></i>
              </button>
              <button type="button" class="btn btn-outline-secondary" data-chart="line" title="Gráfico de Linha">
                <i class="fas fa-chart-line"></i>
              </button>
            </div>
          </div>
        </div>
        
        <div class="filter-container" id="consumption-filter-container"></div>
        
        <div class="chart-container">
          <div class="chart-wrapper">
            <canvas id="consumption-chart"></canvas>
          </div>
          <div id="chart-legend" class="chart-legend"></div>
        </div>
        
        <div class="data-table-container mt-4">
          <h4 id="table-title">Consumo por Andar</h4>
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Consumo</th>
                  <th>Percentual</th>
                </tr>
              </thead>
              <tbody id="consumption-table-body">
                <tr>
                  <td colspan="3" class="text-center">
                    <div class="spinner-border spinner-border-sm" role="status"></div>
                    <span class="ms-2">Carregando dados...</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
    
    this.addStyles();
  }
  
  addStyles() {
    const styleId = 'consumption-analysis-styles';
    if (!document.getElementById(styleId)) {
      const styleElement = document.createElement('style');
      styleElement.id = styleId;
      styleElement.textContent = `
        .consumption-analysis {
          margin-bottom: 30px;
        }
        
        .analysis-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 15px;
        }
        
        .chart-container {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          padding: 20px;
          margin-top: 20px;
        }
        
        .chart-wrapper {
          position: relative;
          height: 400px;
        }
        
        .chart-legend {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 15px;
          margin-top: 15px;
        }
        
        .legend-item {
          display: flex;
          align-items: center;
          font-size: 14px;
        }
        
        .legend-color {
          width: 15px;
          height: 15px;
          border-radius: 3px;
          margin-right: 5px;
        }
        
        .data-table-container {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          padding: 20px;
        }
        
        .data-table-container h4 {
          margin-bottom: 15px;
          font-size: 18px;
        }
        
        .filter-container {
          margin-bottom: 20px;
        }
        
        .filter-container .date-range-filter {
          border: none;
          box-shadow: none;
          padding: 0;
        }
        
        .filter-container .filter-header {
          display: none;
        }
        
        .filter-container .filter-body {
          padding: 0;
        }
        
        .progress-bar-container {
          width: 100%;
          background-color: #f1f1f1;
          border-radius: 4px;
          height: 8px;
          overflow: hidden;
        }
        
        .progress-bar {
          height: 100%;
          border-radius: 4px;
        }
        
        @media (max-width: 768px) {
          .analysis-header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .analysis-actions {
            width: 100%;
            display: flex;
            justify-content: space-between;
          }
          
          .chart-wrapper {
            height: 300px;
          }
        }
      `;
      
      document.head.appendChild(styleElement);
    }
  }
  
  initializeFilter() {
    const filterContainer = document.getElementById('consumption-filter-container');
    if (filterContainer && typeof DateRangeFilter !== 'undefined') {
      this.filterComponent = new DateRangeFilter('consumption-filter-container', this.handleFilterChange.bind(this), {
        showPresets: true,
        showSpecificDate: true,
        showDateRange: true,
        defaultPeriod: 30
      });
    } else {
      console.error("Container de filtro ou componente DateRangeFilter não encontrado para Análise de Consumo.");
    }
  }
  
  handleFilterChange(filterType, filterData) {
    console.log("Filtro de Análise de Consumo alterado:", filterType, filterData);
    // Recarregar dados com base no novo filtro
    this.loadConsumptionData(filterData);
  }
  
  async loadConsumptionData(filterData = null) {
    // Usar filtro padrão se nenhum for passado
    const currentFilter = filterData || this.filterComponent?.getCurrentFilter().data || { period: 30 };
    
    // Simular carregamento de dados com base no filtro
    console.log("Carregando dados de consumo com filtro:", currentFilter);
    
    return new Promise(resolve => {
      setTimeout(() => {
        // Dados fictícios baseados no período (simulação)
        const factor = currentFilter.period ? (currentFilter.period / 30) : 1;
        
        this.consumptionData = {
          andar: [
            { nome: 'Andar 5', valor: Math.round(356 * factor), percentual: 28 },
            { nome: 'Andar 3', valor: Math.round(310 * factor), percentual: 24 },
            { nome: 'Andar 1', valor: Math.round(160 * factor), percentual: 13 },
            { nome: 'Andar 4', valor: Math.round(245 * factor), percentual: 19 },
            { nome: 'Andar 2', valor: Math.round(177 * factor), percentual: 16 }
          ],
          produto: [
            { nome: 'Papel Higiênico', valor: Math.round(580 * factor), percentual: 46 },
            { nome: 'Sabonete Líquido', valor: Math.round(320 * factor), percentual: 26 },
            { nome: 'Papel Toalha', valor: Math.round(240 * factor), percentual: 19 },
            { nome: 'Álcool em Gel', valor: Math.round(80 * factor), percentual: 6 },
            { nome: 'Desinfetante', valor: Math.round(28 * factor), percentual: 3 }
          ],
          // Dados para gráfico de linha (tendência ao longo do tempo)
          tendencia: {
            andar: {
              labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
              datasets: [
                { nome: 'Andar 5', valores: [320, 340, 360, 330, 350, 356] },
                { nome: 'Andar 3', valores: [280, 300, 290, 310, 305, 310] },
                { nome: 'Andar 1', valores: [150, 140, 160, 155, 165, 160] },
                { nome: 'Andar 4', valores: [220, 230, 240, 235, 250, 245] },
                { nome: 'Andar 2', valores: [170, 165, 175, 180, 170, 177] }
              ]
            },
            produto: {
              labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
              datasets: [
                { nome: 'Papel Higiênico', valores: [520, 540, 560, 550, 570, 580] },
                { nome: 'Sabonete Líquido', valores: [300, 310, 305, 315, 310, 320] },
                { nome: 'Papel Toalha', valores: [220, 230, 235, 225, 235, 240] },
                { nome: 'Álcool em Gel', valores: [70, 75, 80, 75, 85, 80] },
                { nome: 'Desinfetante', valores: [25, 30, 28, 30, 25, 28] }
              ]
            }
          }
        };
        
        // Ordenar dados por valor (decrescente)
        this.consumptionData.andar.sort((a, b) => b.valor - a.valor);
        this.consumptionData.produto.sort((a, b) => b.valor - a.valor);
        
        // Renderizar visualização atual
        this.renderConsumptionView();
        
        resolve(this.consumptionData);
      }, 800);
    });
  }
  
  renderConsumptionView() {
    // Atualizar título da tabela
    const tableTitle = document.getElementById('table-title');
    if (tableTitle) {
      tableTitle.textContent = this.currentView === 'andar' ? 'Consumo por Andar' : 'Consumo por Produto';
    }
    
    // Renderizar tabela
    this.renderDataTable();
    
    // Renderizar gráfico
    this.renderChart();
  }
  
  renderDataTable() {
    const tableBody = document.getElementById('consumption-table-body');
    if (!tableBody) return;
    
    const data = this.currentView === 'andar' ? this.consumptionData.andar : this.consumptionData.produto;
    
    if (!data || data.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="3" class="text-center">Nenhum dado encontrado para este período.</td></tr>';
      return;
    }
    
    let tableHtml = '';
    
    data.forEach(item => {
      tableHtml += `
        <tr>
          <td>${item.nome}</td>
          <td>${item.valor}</td>
          <td>
            <div class="d-flex align-items-center">
              <div class="me-2">${item.percentual}%</div>
              <div class="progress-bar-container">
                <div class="progress-bar" style="width: ${item.percentual}%; background-color: ${this.getItemColor(item.nome)}"></div>
              </div>
            </div>
          </td>
        </tr>
      `;
    });
    
    tableBody.innerHTML = tableHtml;
  }
  
  renderChart() {
    const chartCanvas = document.getElementById('consumption-chart');
    if (!chartCanvas) return;
    
    // Destruir gráfico anterior se existir
    if (this.chart) {
      this.chart.destroy();
    }
    
    const data = this.currentView === 'andar' ? this.consumptionData.andar : this.consumptionData.produto;
    
    if (!data || data.length === 0) {
      return;
    }
    
    const labels = data.map(item => item.nome);
    const values = data.map(item => item.valor);
    const colors = data.map(item => this.getItemColor(item.nome));
    
    let chartConfig;
    
    if (this.chartType === 'pie') {
      // Gráfico de pizza
      chartConfig = {
        type: 'pie',
        data: {
          labels: labels,
          datasets: [{
            data: values,
            backgroundColor: colors,
            borderColor: 'white',
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
            tooltip: {
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const value = context.raw || 0;
                  const dataset = context.dataset;
                  const total = dataset.data.reduce((acc, data) => acc + data, 0);
                  const percentage = Math.round((value / total) * 100);
                  return `${label}: ${value} (${percentage}%)`;
                }
              }
            }
          }
        }
      };
    } else if (this.chartType === 'line') {
      // Gráfico de linha (tendência)
      const tendenciaData = this.currentView === 'andar' ? 
        this.consumptionData.tendencia.andar : 
        this.consumptionData.tendencia.produto;
      
      const datasets = tendenciaData.datasets.map((dataset, index) => {
        return {
          label: dataset.nome,
          data: dataset.valores,
          borderColor: this.getItemColor(dataset.nome),
          backgroundColor: this.getItemColor(dataset.nome, 0.1),
          borderWidth: 2,
          tension: 0.4,
          fill: false
        };
      });
      
      chartConfig = {
        type: 'line',
        data: {
          labels: tendenciaData.labels,
          datasets: datasets
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              mode: 'index',
              intersect: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Consumo'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Período'
              }
            }
          }
        }
      };
    } else {
      // Gráfico de barras (padrão)
      chartConfig = {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: this.currentView === 'andar' ? 'Consumo por Andar' : 'Consumo por Produto',
            data: values,
            backgroundColor: colors,
            borderColor: colors.map(color => this.adjustColor(color, -20)),
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Consumo'
              }
            },
            x: {
              title: {
                display: true,
                text: this.currentView === 'andar' ? 'Andar' : 'Produto'
              }
            }
          }
        }
      };
    }
    
    // Criar novo gráfico
    this.chart = new Chart(chartCanvas, chartConfig);
    
    // Renderizar legenda personalizada
    this.renderChartLegend(labels, colors);
  }
  
  renderChartLegend(labels, colors) {
    const legendContainer = document.getElementById('chart-legend');
    if (!legendContainer) return;
    
    let legendHtml = '';
    
    labels.forEach((label, index) => {
      legendHtml += `
        <div class="legend-item">
          <div class="legend-color" style="background-color: ${colors[index]}"></div>
          <div class="legend-label">${label}</div>
        </div>
      `;
    });
    
    legendContainer.innerHTML = legendHtml;
  }
  
  getItemColor(name, alpha = 1) {
    // Cores consistentes para itens específicos
    const colorMap = {
      // Andares
      'Andar 1': `rgba(52, 152, 219, ${alpha})`, // Azul
      'Andar 2': `rgba(155, 89, 182, ${alpha})`, // Roxo
      'Andar 3': `rgba(46, 204, 113, ${alpha})`, // Verde
      'Andar 4': `rgba(241, 196, 15, ${alpha})`, // Amarelo
      'Andar 5': `rgba(231, 76, 60, ${alpha})`, // Vermelho
      
      // Produtos
      'Papel Higiênico': `rgba(52, 152, 219, ${alpha})`, // Azul
      'Sabonete Líquido': `rgba(46, 204, 113, ${alpha})`, // Verde
      'Papel Toalha': `rgba(241, 196, 15, ${alpha})`, // Amarelo
      'Álcool em Gel': `rgba(155, 89, 182, ${alpha})`, // Roxo
      'Desinfetante': `rgba(231, 76, 60, ${alpha})` // Vermelho
    };
    
    return colorMap[name] || `rgba(149, 165, 166, ${alpha})`; // Cinza para itens não mapeados
  }
  
  adjustColor(color, amount) {
    // Função para escurecer ou clarear uma cor
    const rgbaMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
    if (!rgbaMatch) return color;
    
    const r = Math.max(0, Math.min(255, parseInt(rgbaMatch[1]) + amount));
    const g = Math.max(0, Math.min(255, parseInt(rgbaMatch[2]) + amount));
    const b = Math.max(0, Math.min(255, parseInt(rgbaMatch[3]) + amount));
    
    return `rgba(${r}, ${g}, ${b}, 1)`;
  }
  
  setupEventListeners() {
    // Alternar entre visualizações (andar/produto)
    const viewToggleButtons = this.container.querySelectorAll('.view-toggle button');
    viewToggleButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Remover classe active de todos os botões
        viewToggleButtons.forEach(btn => btn.classList.remove('active'));
        
        // Adicionar classe active ao botão clicado
        button.classList.add('active');
        
        // Atualizar visualização atual
        this.currentView = button.dataset.view;
        
        // Renderizar nova visualização
        this.renderConsumptionView();
      });
    });
    
    // Alternar entre tipos de gráfico (bar/pie/line)
    const chartToggleButtons = this.container.querySelectorAll('.chart-toggle button');
    chartToggleButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Remover classe active de todos os botões
        chartToggleButtons.forEach(btn => btn.classList.remove('active'));
        
        // Adicionar classe active ao botão clicado
        button.classList.add('active');
        
        // Atualizar tipo de gráfico atual
        this.chartType = button.dataset.chart;
        
        // Renderizar novo gráfico
        this.renderChart();
      });
    });
  }
}

// Exportar o componente
window.ConsumptionAnalysis = ConsumptionAnalysis;
