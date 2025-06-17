// Componente de relatórios detalhados
class ReportGenerator {
  constructor(containerId, apiBaseUrl = '/api/dashboard') {
    this.container = document.getElementById(containerId);
    this.apiBaseUrl = apiBaseUrl;
    this.reportData = {};
    this.filterComponent = null;
    this.currentReportType = 'consumo'; // consumo, desperdicio, comparativo
    
    this.init();
  }
  
  async init() {
    this.renderLayout();
    this.initializeFilter();
    await this.loadReportData();
    this.setupEventListeners();
  }
  
  renderLayout() {
    this.container.innerHTML = `
      <div class="report-generator">
        <div class="report-header">
          <div class="report-title">
            <h2>Relatórios Detalhados</h2>
          </div>
          <div class="report-actions">
            <div class="btn-group report-type-toggle" role="group">
              <button type="button" class="btn btn-outline-primary active" data-report="consumo">Consumo</button>
              <button type="button" class="btn btn-outline-primary" data-report="desperdicio">Desperdício</button>
              <button type="button" class="btn btn-outline-primary" data-report="comparativo">Comparativo</button>
            </div>
            <div class="btn-group ms-2">
              <button type="button" class="btn btn-outline-success" id="export-report-btn">
                <i class="fas fa-file-export"></i> Exportar
              </button>
              <button type="button" class="btn btn-outline-secondary" id="print-report-btn">
                <i class="fas fa-print"></i> Imprimir
              </button>
            </div>
          </div>
        </div>
        
        <div class="filter-container" id="report-filter-container"></div>
        
        <div class="report-content">
          <div class="report-loading text-center p-5 d-none">
            <div class="spinner-border" role="status"></div>
            <p class="mt-2">Gerando relatório...</p>
          </div>
          
          <div id="report-consumo" class="report-section">
            <div class="report-section-header">
              <h3>Relatório de Consumo</h3>
              <p class="text-muted">Análise detalhada do consumo por andar e tipo de banheiro</p>
            </div>
            
            <div class="row">
              <div class="col-md-6">
                <div class="report-card">
                  <h4>Consumo Total por Andar</h4>
                  <div class="chart-container">
                    <canvas id="consumo-andar-chart"></canvas>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="report-card">
                  <h4>Consumo por Tipo de Banheiro</h4>
                  <div class="chart-container">
                    <canvas id="consumo-tipo-chart"></canvas>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="report-card mt-4">
              <h4>Detalhamento por Produto</h4>
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>Produto</th>
                      <th>Consumo Total</th>
                      <th>Masculino</th>
                      <th>Feminino</th>
                      <th>Média por Andar</th>
                      <th>Tendência</th>
                    </tr>
                  </thead>
                  <tbody id="consumo-table-body">
                    <!-- Dados serão inseridos aqui -->
                  </tbody>
                </table>
              </div>
            </div>
            
            <div class="report-card mt-4">
              <h4>Análise de Tendência</h4>
              <div class="chart-container">
                <canvas id="consumo-tendencia-chart"></canvas>
              </div>
            </div>
          </div>
          
          <div id="report-desperdicio" class="report-section d-none">
            <div class="report-section-header">
              <h3>Relatório de Desperdício</h3>
              <p class="text-muted">Análise detalhada do desperdício por andar e tipo de banheiro</p>
            </div>
            
            <div class="row">
              <div class="col-md-6">
                <div class="report-card">
                  <h4>Índice de Desperdício por Andar</h4>
                  <div class="chart-container">
                    <canvas id="desperdicio-andar-chart"></canvas>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="report-card">
                  <h4>Economia Potencial</h4>
                  <div class="chart-container">
                    <canvas id="economia-chart"></canvas>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="report-card mt-4">
              <h4>Detalhamento por Produto</h4>
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>Produto</th>
                      <th>Desperdício Total</th>
                      <th>Percentual</th>
                      <th>Economia Potencial</th>
                      <th>Recomendação</th>
                    </tr>
                  </thead>
                  <tbody id="desperdicio-table-body">
                    <!-- Dados serão inseridos aqui -->
                  </tbody>
                </table>
              </div>
            </div>
            
            <div class="report-card mt-4">
              <h4>Análise de Causas</h4>
              <div class="chart-container">
                <canvas id="causas-chart"></canvas>
              </div>
            </div>
          </div>
          
          <div id="report-comparativo" class="report-section d-none">
            <div class="report-section-header">
              <h3>Relatório Comparativo</h3>
              <p class="text-muted">Comparação entre períodos, andares e tipos de banheiro</p>
            </div>
            
            <div class="row">
              <div class="col-md-6">
                <div class="report-card">
                  <h4>Comparativo por Período</h4>
                  <div class="chart-container">
                    <canvas id="comparativo-periodo-chart"></canvas>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="report-card">
                  <h4>Comparativo Masculino vs Feminino</h4>
                  <div class="chart-container">
                    <canvas id="comparativo-genero-chart"></canvas>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="report-card mt-4">
              <h4>Detalhamento por Andar</h4>
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>Andar</th>
                      <th>Período Atual</th>
                      <th>Período Anterior</th>
                      <th>Variação</th>
                      <th>Masculino (Atual)</th>
                      <th>Feminino (Atual)</th>
                    </tr>
                  </thead>
                  <tbody id="comparativo-table-body">
                    <!-- Dados serão inseridos aqui -->
                  </tbody>
                </table>
              </div>
            </div>
            
            <div class="report-card mt-4">
              <h4>Análise de Sazonalidade</h4>
              <div class="chart-container">
                <canvas id="sazonalidade-chart"></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    this.addStyles();
  }
  
  addStyles() {
    const styleId = 'report-generator-styles';
    if (!document.getElementById(styleId)) {
      const styleElement = document.createElement('style');
      styleElement.id = styleId;
      styleElement.textContent = `
        .report-generator {
          margin-bottom: 30px;
        }
        
        .report-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 15px;
        }
        
        .filter-container {
          margin-bottom: 20px;
        }
        
        .report-section-header {
          margin-bottom: 20px;
        }
        
        .report-section-header h3 {
          margin-bottom: 5px;
        }
        
        .report-card {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          padding: 20px;
          height: 100%;
        }
        
        .report-card h4 {
          margin-bottom: 15px;
          font-size: 18px;
        }
        
        .chart-container {
          position: relative;
          height: 300px;
        }
        
        .trend-indicator {
          display: inline-flex;
          align-items: center;
          font-weight: 500;
        }
        
        .trend-up {
          color: #2ecc71;
        }
        
        .trend-down {
          color: #e74c3c;
        }
        
        .trend-neutral {
          color: #7f8c8d;
        }
        
        @media (max-width: 768px) {
          .report-header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .report-actions {
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
          }
          
          .chart-container {
            height: 250px;
          }
        }
      `;
      
      document.head.appendChild(styleElement);
    }
  }
  
  initializeFilter() {
    const filterContainer = document.getElementById('report-filter-container');
    if (filterContainer && typeof DateRangeFilter !== 'undefined') {
      this.filterComponent = new DateRangeFilter('report-filter-container', this.handleFilterChange.bind(this), {
        showPresets: true,
        showSpecificDate: true,
        showDateRange: true,
        defaultPeriod: 30,
        showComparison: true
      });
    } else {
      console.error("Container de filtro ou componente DateRangeFilter não encontrado para Relatórios.");
    }
  }
  
  handleFilterChange(filterType, filterData) {
    console.log("Filtro de Relatórios alterado:", filterType, filterData);
    // Recarregar dados com base no novo filtro
    this.loadReportData(filterData);
  }
  
  async loadReportData(filterData = null) {
    // Mostrar loading
    this.toggleLoading(true);
    
    // Usar filtro padrão se nenhum for passado
    const currentFilter = filterData || this.filterComponent?.getCurrentFilter().data || { period: 30 };
    
    // Simular carregamento de dados com base no filtro
    console.log("Carregando dados de relatório com filtro:", currentFilter);
    
    return new Promise(resolve => {
      setTimeout(() => {
        // Dados fictícios para relatórios
        this.reportData = {
          consumo: {
            porAndar: [
              { nome: 'Andar 5', valor: 356, percentual: 28 },
              { nome: 'Andar 3', valor: 310, percentual: 24 },
              { nome: 'Andar 1', valor: 160, percentual: 13 },
              { nome: 'Andar 4', valor: 245, percentual: 19 },
              { nome: 'Andar 2', valor: 177, percentual: 16 }
            ],
            porTipo: [
              { nome: 'Feminino', valor: 653, percentual: 52 },
              { nome: 'Masculino', valor: 595, percentual: 48 }
            ],
            porProduto: [
              { 
                nome: 'Papel Higiênico', 
                total: 580, 
                masculino: 270, 
                feminino: 310, 
                mediaPorAndar: 116,
                tendencia: 5.2,
                tendenciaPositiva: true
              },
              { 
                nome: 'Sabonete Líquido', 
                total: 320, 
                masculino: 150, 
                feminino: 170, 
                mediaPorAndar: 64,
                tendencia: 3.8,
                tendenciaPositiva: true
              },
              { 
                nome: 'Papel Toalha', 
                total: 240, 
                masculino: 120, 
                feminino: 120, 
                mediaPorAndar: 48,
                tendencia: -1.5,
                tendenciaPositiva: false
              },
              { 
                nome: 'Álcool em Gel', 
                total: 80, 
                masculino: 40, 
                feminino: 40, 
                mediaPorAndar: 16,
                tendencia: 0,
                tendenciaPositiva: null
              },
              { 
                nome: 'Desinfetante', 
                total: 28, 
                masculino: 15, 
                feminino: 13, 
                mediaPorAndar: 5.6,
                tendencia: -2.3,
                tendenciaPositiva: false
              }
            ],
            tendencia: {
              labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
              datasets: [
                { nome: 'Papel Higiênico', valores: [520, 540, 560, 550, 570, 580] },
                { nome: 'Sabonete Líquido', valores: [300, 310, 305, 315, 310, 320] },
                { nome: 'Papel Toalha', valores: [250, 245, 240, 235, 230, 240] },
                { nome: 'Álcool em Gel', valores: [80, 80, 80, 80, 80, 80] },
                { nome: 'Desinfetante', valores: [30, 29, 28, 27, 28, 28] }
              ]
            }
          },
          desperdicio: {
            porAndar: [
              { nome: 'Andar 5', valor: 15.2, economia: 54 },
              { nome: 'Andar 3', valor: 12.8, economia: 40 },
              { nome: 'Andar 1', valor: 8.5, economia: 14 },
              { nome: 'Andar 4', valor: 10.3, economia: 25 },
              { nome: 'Andar 2', valor: 9.7, economia: 17 }
            ],
            economia: {
              atual: 150,
              potencial: 250,
              percentual: 60
            },
            porProduto: [
              { 
                nome: 'Papel Higiênico', 
                desperdicio: 87, 
                percentual: 15, 
                economia: 130,
                recomendacao: 'Instalar dispensers com controle de quantidade'
              },
              { 
                nome: 'Sabonete Líquido', 
                desperdicio: 32, 
                percentual: 10, 
                economia: 48,
                recomendacao: 'Utilizar dispensers com sensor'
              },
              { 
                nome: 'Papel Toalha', 
                desperdicio: 36, 
                percentual: 15, 
                economia: 54,
                recomendacao: 'Substituir por secadores de mão'
              },
              { 
                nome: 'Álcool em Gel', 
                desperdicio: 8, 
                percentual: 10, 
                economia: 12,
                recomendacao: 'Utilizar dispensers com dosagem controlada'
              },
              { 
                nome: 'Desinfetante', 
                desperdicio: 4, 
                percentual: 14, 
                economia: 6,
                recomendacao: 'Treinar equipe de limpeza sobre dosagem correta'
              }
            ],
            causas: [
              { nome: 'Uso excessivo', valor: 45 },
              { nome: 'Dispensers inadequados', valor: 30 },
              { nome: 'Falta de conscientização', valor: 15 },
              { nome: 'Produtos de baixa qualidade', valor: 10 }
            ]
          },
          comparativo: {
            periodos: {
              atual: 1248,
              anterior: 1180,
              variacao: 5.8
            },
            genero: {
              atual: {
                masculino: 595,
                feminino: 653
              },
              anterior: {
                masculino: 560,
                feminino: 620
              }
            },
            porAndar: [
              { 
                nome: 'Andar 5', 
                atual: 356, 
                anterior: 340, 
                variacao: 4.7,
                masculinoAtual: 170,
                femininoAtual: 186
              },
              { 
                nome: 'Andar 3', 
                atual: 310, 
                anterior: 290, 
                variacao: 6.9,
                masculinoAtual: 116,
                femininoAtual: 194
              },
              { 
                nome: 'Andar 1', 
                atual: 160, 
                anterior: 155, 
                variacao: 3.2,
                masculinoAtual: 31,
                femininoAtual: 129
              },
              { 
                nome: 'Andar 4', 
                atual: 245, 
                anterior: 230, 
                variacao: 6.5,
                masculinoAtual: 95,
                femininoAtual: 150
              },
              { 
                nome: 'Andar 2', 
                atual: 177, 
                anterior: 165, 
                variacao: 7.3,
                masculinoAtual: 83,
                femininoAtual: 94
              }
            ],
            sazonalidade: {
              labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
              datasets: [
                { 
                  nome: 'Ano Atual', 
                  valores: [1150, 1180, 1200, 1220, 1240, 1248, null, null, null, null, null, null]
                },
                { 
                  nome: 'Ano Anterior', 
                  valores: [1100, 1120, 1140, 1160, 1170, 1180, 1190, 1200, 1210, 1230, 1250, 1270]
                }
              ]
            }
          }
        };
        
        // Renderizar relatório atual
        this.renderReport();
        
        // Esconder loading
        this.toggleLoading(false);
        
        resolve(this.reportData);
      }, 1200);
    });
  }
  
  toggleLoading(show) {
    const loadingElement = this.container.querySelector('.report-loading');
    if (loadingElement) {
      if (show) {
        loadingElement.classList.remove('d-none');
      } else {
        loadingElement.classList.add('d-none');
      }
    }
  }
  
  renderReport() {
    // Esconder todas as seções de relatório
    const reportSections = this.container.querySelectorAll('.report-section');
    reportSections.forEach(section => {
      section.classList.add('d-none');
    });
    
    // Mostrar seção atual
    const currentSection = this.container.querySelector(`#report-${this.currentReportType}`);
    if (currentSection) {
      currentSection.classList.remove('d-none');
    }
    
    // Renderizar relatório específico
    switch (this.currentReportType) {
      case 'consumo':
        this.renderConsumoReport();
        break;
      case 'desperdicio':
        this.renderDesperdicioReport();
        break;
      case 'comparativo':
        this.renderComparativoReport();
        break;
    }
  }
  
  renderConsumoReport() {
    // Renderizar tabela de consumo por produto
    this.renderConsumoTable();
    
    // Renderizar gráficos
    this.renderConsumoAndarChart();
    this.renderConsumoTipoChart();
    this.renderConsumoTendenciaChart();
  }
  
  renderConsumoTable() {
    const tableBody = document.getElementById('consumo-table-body');
    if (!tableBody) return;
    
    const data = this.reportData.consumo.porProduto;
    
    if (!data || data.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="6" class="text-center">Nenhum dado encontrado para este período.</td></tr>';
      return;
    }
    
    let tableHtml = '';
    
    data.forEach(item => {
      let tendenciaHtml = '';
      
      if (item.tendenciaPositiva === true) {
        tendenciaHtml = `<span class="trend-indicator trend-up"><i class="fas fa-arrow-up me-1"></i> ${item.tendencia}%</span>`;
      } else if (item.tendenciaPositiva === false) {
        tendenciaHtml = `<span class="trend-indicator trend-down"><i class="fas fa-arrow-down me-1"></i> ${item.tendencia}%</span>`;
      } else {
        tendenciaHtml = `<span class="trend-indicator trend-neutral"><i class="fas fa-minus me-1"></i> ${item.tendencia}%</span>`;
      }
      
      tableHtml += `
        <tr>
          <td>${item.nome}</td>
          <td>${item.total}</td>
          <td>${item.masculino}</td>
          <td>${item.feminino}</td>
          <td>${item.mediaPorAndar}</td>
          <td>${tendenciaHtml}</td>
        </tr>
      `;
    });
    
    tableBody.innerHTML = tableHtml;
  }
  
  renderConsumoAndarChart() {
    const chartCanvas = document.getElementById('consumo-andar-chart');
    if (!chartCanvas) return;
    
    // Destruir gráfico anterior se existir
    if (this.consumoAndarChart) {
      this.consumoAndarChart.destroy();
    }
    
    const data = this.reportData.consumo.porAndar;
    
    if (!data || data.length === 0) {
      return;
    }
    
    const labels = data.map(item => item.nome);
    const values = data.map(item => item.valor);
    const colors = data.map(item => this.getItemColor(item.nome));
    
    const chartConfig = {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Consumo por Andar',
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
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.dataset.label || '';
                const value = context.raw || 0;
                const total = context.dataset.data.reduce((acc, data) => acc + data, 0);
                const percentage = Math.round((value / total) * 100);
                return `${label}: ${value} (${percentage}%)`;
              }
            }
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
              text: 'Andar'
            }
          }
        }
      }
    };
    
    // Criar novo gráfico
    this.consumoAndarChart = new Chart(chartCanvas, chartConfig);
  }
  
  renderConsumoTipoChart() {
    const chartCanvas = document.getElementById('consumo-tipo-chart');
    if (!chartCanvas) return;
    
    // Destruir gráfico anterior se existir
    if (this.consumoTipoChart) {
      this.consumoTipoChart.destroy();
    }
    
    const data = this.reportData.consumo.porTipo;
    
    if (!data || data.length === 0) {
      return;
    }
    
    const labels = data.map(item => item.nome);
    const values = data.map(item => item.valor);
    const colors = [
      'rgba(52, 152, 219, 0.7)', // Azul para Masculino
      'rgba(232, 62, 140, 0.7)'  // Rosa para Feminino
    ];
    
    const chartConfig = {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
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
            position: 'bottom'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.raw || 0;
                const total = context.dataset.data.reduce((acc, data) => acc + data, 0);
                const percentage = Math.round((value / total) * 100);
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    };
    
    // Criar novo gráfico
    this.consumoTipoChart = new Chart(chartCanvas, chartConfig);
  }
  
  renderConsumoTendenciaChart() {
    const chartCanvas = document.getElementById('consumo-tendencia-chart');
    if (!chartCanvas) return;
    
    // Destruir gráfico anterior se existir
    if (this.consumoTendenciaChart) {
      this.consumoTendenciaChart.destroy();
    }
    
    const tendenciaData = this.reportData.consumo.tendencia;
    
    if (!tendenciaData || !tendenciaData.datasets || tendenciaData.datasets.length === 0) {
      return;
    }
    
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
    
    const chartConfig = {
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
            position: 'bottom'
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
    
    // Criar novo gráfico
    this.consumoTendenciaChart = new Chart(chartCanvas, chartConfig);
  }
  
  renderDesperdicioReport() {
    // Renderizar tabela de desperdício por produto
    this.renderDesperdicioTable();
    
    // Renderizar gráficos
    this.renderDesperdicioAndarChart();
    this.renderEconomiaChart();
    this.renderCausasChart();
  }
  
  renderDesperdicioTable() {
    const tableBody = document.getElementById('desperdicio-table-body');
    if (!tableBody) return;
    
    const data = this.reportData.desperdicio.porProduto;
    
    if (!data || data.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="5" class="text-center">Nenhum dado encontrado para este período.</td></tr>';
      return;
    }
    
    let tableHtml = '';
    
    data.forEach(item => {
      tableHtml += `
        <tr>
          <td>${item.nome}</td>
          <td>${item.desperdicio}</td>
          <td>${item.percentual}%</td>
          <td>R$ ${item.economia.toFixed(2)}</td>
          <td>${item.recomendacao}</td>
        </tr>
      `;
    });
    
    tableBody.innerHTML = tableHtml;
  }
  
  renderDesperdicioAndarChart() {
    const chartCanvas = document.getElementById('desperdicio-andar-chart');
    if (!chartCanvas) return;
    
    // Destruir gráfico anterior se existir
    if (this.desperdicioAndarChart) {
      this.desperdicioAndarChart.destroy();
    }
    
    const data = this.reportData.desperdicio.porAndar;
    
    if (!data || data.length === 0) {
      return;
    }
    
    const labels = data.map(item => item.nome);
    const values = data.map(item => item.valor);
    const colors = data.map(item => this.getItemColor(item.nome, 0.7));
    
    const chartConfig = {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Índice de Desperdício (%)',
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
              text: 'Percentual (%)'
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
    };
    
    // Criar novo gráfico
    this.desperdicioAndarChart = new Chart(chartCanvas, chartConfig);
  }
  
  renderEconomiaChart() {
    const chartCanvas = document.getElementById('economia-chart');
    if (!chartCanvas) return;
    
    // Destruir gráfico anterior se existir
    if (this.economiaChart) {
      this.economiaChart.destroy();
    }
    
    const economiaData = this.reportData.desperdicio.economia;
    
    if (!economiaData) {
      return;
    }
    
    const chartConfig = {
      type: 'doughnut',
      data: {
        labels: ['Economia Atual', 'Economia Potencial Adicional'],
        datasets: [{
          data: [economiaData.atual, economiaData.potencial - economiaData.atual],
          backgroundColor: [
            'rgba(46, 204, 113, 0.7)', // Verde para economia atual
            'rgba(241, 196, 15, 0.7)'  // Amarelo para economia potencial adicional
          ],
          borderColor: [
            'rgba(46, 204, 113, 1)',
            'rgba(241, 196, 15, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.raw || 0;
                return `${label}: R$ ${value.toFixed(2)}`;
              }
            }
          }
        }
      }
    };
    
    // Criar novo gráfico
    this.economiaChart = new Chart(chartCanvas, chartConfig);
  }
  
  renderCausasChart() {
    const chartCanvas = document.getElementById('causas-chart');
    if (!chartCanvas) return;
    
    // Destruir gráfico anterior se existir
    if (this.causasChart) {
      this.causasChart.destroy();
    }
    
    const data = this.reportData.desperdicio.causas;
    
    if (!data || data.length === 0) {
      return;
    }
    
    const labels = data.map(item => item.nome);
    const values = data.map(item => item.valor);
    const colors = [
      'rgba(231, 76, 60, 0.7)',   // Vermelho
      'rgba(241, 196, 15, 0.7)',  // Amarelo
      'rgba(52, 152, 219, 0.7)',  // Azul
      'rgba(155, 89, 182, 0.7)'   // Roxo
    ];
    
    const chartConfig = {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
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
            position: 'bottom'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.raw || 0;
                const total = context.dataset.data.reduce((acc, data) => acc + data, 0);
                const percentage = Math.round((value / total) * 100);
                return `${label}: ${percentage}%`;
              }
            }
          }
        }
      }
    };
    
    // Criar novo gráfico
    this.causasChart = new Chart(chartCanvas, chartConfig);
  }
  
  renderComparativoReport() {
    // Renderizar tabela comparativa por andar
    this.renderComparativoTable();
    
    // Renderizar gráficos
    this.renderComparativoPeriodoChart();
    this.renderComparativoGeneroChart();
    this.renderSazonalidadeChart();
  }
  
  renderComparativoTable() {
    const tableBody = document.getElementById('comparativo-table-body');
    if (!tableBody) return;
    
    const data = this.reportData.comparativo.porAndar;
    
    if (!data || data.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="6" class="text-center">Nenhum dado encontrado para este período.</td></tr>';
      return;
    }
    
    let tableHtml = '';
    
    data.forEach(item => {
      const variacao = item.variacao;
      const variacaoClass = variacao > 0 ? 'text-success' : (variacao < 0 ? 'text-danger' : 'text-muted');
      const variacaoIcon = variacao > 0 ? 'fa-arrow-up' : (variacao < 0 ? 'fa-arrow-down' : 'fa-minus');
      
      tableHtml += `
        <tr>
          <td>${item.nome}</td>
          <td>${item.atual}</td>
          <td>${item.anterior}</td>
          <td class="${variacaoClass}">
            <i class="fas ${variacaoIcon} me-1"></i> ${Math.abs(variacao)}%
          </td>
          <td>${item.masculinoAtual}</td>
          <td>${item.femininoAtual}</td>
        </tr>
      `;
    });
    
    tableBody.innerHTML = tableHtml;
  }
  
  renderComparativoPeriodoChart() {
    const chartCanvas = document.getElementById('comparativo-periodo-chart');
    if (!chartCanvas) return;
    
    // Destruir gráfico anterior se existir
    if (this.comparativoPeriodoChart) {
      this.comparativoPeriodoChart.destroy();
    }
    
    const comparativoData = this.reportData.comparativo.periodos;
    
    if (!comparativoData) {
      return;
    }
    
    const chartConfig = {
      type: 'bar',
      data: {
        labels: ['Período Atual', 'Período Anterior'],
        datasets: [{
          label: 'Consumo Total',
          data: [comparativoData.atual, comparativoData.anterior],
          backgroundColor: [
            'rgba(52, 152, 219, 0.7)', // Azul para período atual
            'rgba(149, 165, 166, 0.7)'  // Cinza para período anterior
          ],
          borderColor: [
            'rgba(52, 152, 219, 1)',
            'rgba(149, 165, 166, 1)'
          ],
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
              text: 'Consumo Total'
            }
          }
        }
      }
    };
    
    // Criar novo gráfico
    this.comparativoPeriodoChart = new Chart(chartCanvas, chartConfig);
  }
  
  renderComparativoGeneroChart() {
    const chartCanvas = document.getElementById('comparativo-genero-chart');
    if (!chartCanvas) return;
    
    // Destruir gráfico anterior se existir
    if (this.comparativoGeneroChart) {
      this.comparativoGeneroChart.destroy();
    }
    
    const generoData = this.reportData.comparativo.genero;
    
    if (!generoData) {
      return;
    }
    
    const chartConfig = {
      type: 'bar',
      data: {
        labels: ['Masculino', 'Feminino'],
        datasets: [
          {
            label: 'Período Atual',
            data: [generoData.atual.masculino, generoData.atual.feminino],
            backgroundColor: 'rgba(52, 152, 219, 0.7)', // Azul para período atual
            borderColor: 'rgba(52, 152, 219, 1)',
            borderWidth: 1
          },
          {
            label: 'Período Anterior',
            data: [generoData.anterior.masculino, generoData.anterior.feminino],
            backgroundColor: 'rgba(149, 165, 166, 0.7)', // Cinza para período anterior
            borderColor: 'rgba(149, 165, 166, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Consumo'
            }
          }
        }
      }
    };
    
    // Criar novo gráfico
    this.comparativoGeneroChart = new Chart(chartCanvas, chartConfig);
  }
  
  renderSazonalidadeChart() {
    const chartCanvas = document.getElementById('sazonalidade-chart');
    if (!chartCanvas) return;
    
    // Destruir gráfico anterior se existir
    if (this.sazonalidadeChart) {
      this.sazonalidadeChart.destroy();
    }
    
    const sazonalidadeData = this.reportData.comparativo.sazonalidade;
    
    if (!sazonalidadeData || !sazonalidadeData.datasets || sazonalidadeData.datasets.length === 0) {
      return;
    }
    
    const datasets = sazonalidadeData.datasets.map((dataset, index) => {
      return {
        label: dataset.nome,
        data: dataset.valores,
        borderColor: index === 0 ? 'rgba(52, 152, 219, 1)' : 'rgba(149, 165, 166, 1)', // Azul para atual, cinza para anterior
        backgroundColor: index === 0 ? 'rgba(52, 152, 219, 0.1)' : 'rgba(149, 165, 166, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true
      };
    });
    
    const chartConfig = {
      type: 'line',
      data: {
        labels: sazonalidadeData.labels,
        datasets: datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
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
              text: 'Mês'
            }
          }
        }
      }
    };
    
    // Criar novo gráfico
    this.sazonalidadeChart = new Chart(chartCanvas, chartConfig);
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
    // Alternar entre tipos de relatório
    const reportToggleButtons = this.container.querySelectorAll('.report-type-toggle button');
    reportToggleButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Remover classe active de todos os botões
        reportToggleButtons.forEach(btn => btn.classList.remove('active'));
        
        // Adicionar classe active ao botão clicado
        button.classList.add('active');
        
        // Atualizar tipo de relatório atual
        this.currentReportType = button.dataset.report;
        
        // Renderizar novo relatório
        this.renderReport();
      });
    });
    
    // Botão de exportar relatório
    const exportButton = this.container.querySelector('#export-report-btn');
    if (exportButton) {
      exportButton.addEventListener('click', () => {
        this.exportReport();
      });
    }
    
    // Botão de imprimir relatório
    const printButton = this.container.querySelector('#print-report-btn');
    if (printButton) {
      printButton.addEventListener('click', () => {
        this.printReport();
      });
    }
  }
  
  exportReport() {
    // Simular exportação de relatório
    alert('Relatório exportado com sucesso!');
  }
  
  printReport() {
    // Simular impressão de relatório
    window.print();
  }
}

// Exportar o componente
window.ReportGenerator = ReportGenerator;
