// Componente de gráficos avançados para a aba de Consumo
class AdvancedCharts {
  constructor(containerId, apiBaseUrl = '/api/dashboard') {
    this.container = document.getElementById(containerId);
    this.apiBaseUrl = apiBaseUrl;
    this.filterComponent = null;
    this.charts = {};
    this.currentData = {};
    
    this.init();
  }
  
  async init() {
    this.renderLayout();
    this.initializeFilter();
    await this.loadChartData();
    this.setupEventListeners();
  }
  
  renderLayout() {
    this.container.innerHTML = `
      <div class="advanced-charts">
        <div class="charts-header">
          <h2>Análise de Consumo</h2>
          <div id="consumo-filter-container"></div>
        </div>
        
        <div class="charts-grid">
          <div class="chart-card">
            <div id="consumo-por-andar-chart-container"></div>
          </div>
          
          <div class="chart-card">
            <div id="consumo-por-produto-chart-container"></div>
          </div>
          
          <div class="chart-card">
            <div id="consumo-por-genero-chart-container"></div>
          </div>
          
          <div class="chart-card">
            <div id="tendencia-consumo-chart-container"></div>
          </div>
        </div>
        
        <div class="detailed-data-section mt-4">
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h3>Dados Detalhados de Consumo</h3>
              <div class="btn-group">
                <button class="btn btn-sm btn-outline-secondary" id="export-csv-btn">
                  <i class="fas fa-file-csv"></i> Exportar CSV
                </button>
                <button class="btn btn-sm btn-outline-secondary" id="print-data-btn">
                  <i class="fas fa-print"></i> Imprimir
                </button>
              </div>
            </div>
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-sm table-hover">
                  <thead>
                    <tr>
                      <th>Andar</th>
                      <th>Banheiro</th>
                      <th>Papel Higiênico</th>
                      <th>Sabonete Líquido</th>
                      <th>Papel Toalha</th>
                      <th>Álcool em Gel</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody id="detailed-consumo-table">
                    <tr><td colspan="7" class="text-center"><div class="spinner-border spinner-border-sm" role="status"></div> Carregando...</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    this.addStyles();
  }
  
  addStyles() {
    const styleId = 'advanced-charts-styles';
    if (!document.getElementById(styleId)) {
      const styleElement = document.createElement('style');
      styleElement.id = styleId;
      styleElement.textContent = `
        .advanced-charts {
          /* Estilos gerais */
        }
        
        .charts-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 15px;
        }
        
        .charts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-bottom: 20px;
        }
        
        .chart-card {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }
        
        @media (max-width: 768px) {
          .charts-grid {
            grid-template-columns: 1fr;
          }
        }
        
        #consumo-filter-container .date-range-filter {
          border: none;
          box-shadow: none;
          padding: 0;
        }
        
        #consumo-filter-container .filter-header {
          display: none;
        }
        
        #consumo-filter-container .filter-body {
          padding: 0;
          display: flex;
          gap: 10px;
          align-items: flex-end;
        }
      `;
      
      document.head.appendChild(styleElement);
    }
  }
  
  initializeFilter() {
    const filterContainer = document.getElementById('consumo-filter-container');
    if (filterContainer && typeof DateRangeFilter !== 'undefined') {
      this.filterComponent = new DateRangeFilter('consumo-filter-container', this.handleFilterChange.bind(this), {
        showPresets: true,
        showSpecificDate: true,
        showDateRange: true,
        defaultPeriod: 30
      });
    } else {
      console.error("Container de filtro ou componente DateRangeFilter não encontrado para Consumo.");
    }
  }
  
  handleFilterChange(filterType, filterData) {
    console.log("Filtro de Consumo alterado:", filterType, filterData);
    // Recarregar dados com base no novo filtro
    this.loadChartData(filterData);
  }
  
  async loadChartData(filterData = null) {
    // Usar filtro padrão se nenhum for passado
    const currentFilter = filterData || this.filterComponent?.getCurrentFilter().data || { period: 30 };
    
    // Mostrar carregamento em todos os gráficos
    Object.values(this.charts).forEach(chart => {
      if (chart && typeof chart.showLoading === 'function') {
        chart.showLoading();
      }
    });
    
    // Simular carregamento de dados com base no filtro
    console.log("Carregando dados de consumo com filtro:", currentFilter);
    
    return new Promise(resolve => {
      setTimeout(() => {
        // Dados fictícios baseados no período (simulação)
        const factor = currentFilter.period ? (currentFilter.period / 30) : 1;
        
        this.currentData = {
          consumoPorAndar: {
            labels: ['Andar 1', 'Andar 2', 'Andar 3', 'Andar 4', 'Andar 5'],
            datasets: [{
              label: 'Consumo Total',
              data: [
                Math.round(160 * factor),
                Math.round(177 * factor),
                Math.round(310 * factor),
                Math.round(245 * factor),
                Math.round(356 * factor)
              ],
              backgroundColor: [
                'rgba(54, 162, 235, 0.7)',
                'rgba(75, 192, 192, 0.7)',
                'rgba(255, 206, 86, 0.7)',
                'rgba(153, 102, 255, 0.7)',
                'rgba(255, 99, 132, 0.7)'
              ]
            }],
            yAxisLabel: 'Quantidade'
          },
          
          consumoPorProduto: {
            labels: ['Papel Higiênico', 'Sabonete Líquido', 'Papel Toalha', 'Álcool em Gel', 'Desinfetante'],
            datasets: [{
              label: 'Quantidade Consumida',
              data: [
                Math.round(740 * factor),
                Math.round(301 * factor),
                Math.round(177 * factor),
                Math.round(30 * factor),
                Math.round(15 * factor)
              ],
              backgroundColor: [
                'rgba(255, 99, 132, 0.7)',
                'rgba(54, 162, 235, 0.7)',
                'rgba(255, 206, 86, 0.7)',
                'rgba(75, 192, 192, 0.7)',
                'rgba(153, 102, 255, 0.7)'
              ]
            }],
            yAxisLabel: 'Quantidade'
          },
          
          consumoPorGenero: {
            labels: ['Masculino', 'Feminino'],
            datasets: [{
              label: 'Consumo Total',
              data: [
                Math.round(495 * factor),
                Math.round(753 * factor)
              ],
              backgroundColor: [
                'rgba(54, 162, 235, 0.7)',
                'rgba(255, 99, 132, 0.7)'
              ]
            }],
            yAxisLabel: 'Quantidade'
          },
          
          tendenciaConsumo: {
            labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho'],
            datasets: [
              {
                label: 'Papel Higiênico',
                data: [650, 590, 800, 810, 760, 740].map(val => Math.round(val * (factor / 6))),
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)'
              },
              {
                label: 'Sabonete Líquido',
                data: [280, 350, 300, 320, 290, 301].map(val => Math.round(val * (factor / 6))),
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)'
              },
              {
                label: 'Papel Toalha',
                data: [150, 190, 210, 180, 160, 177].map(val => Math.round(val * (factor / 6))),
                borderColor: 'rgba(255, 206, 86, 1)',
                backgroundColor: 'rgba(255, 206, 86, 0.2)'
              }
            ],
            xAxisLabel: 'Mês',
            yAxisLabel: 'Quantidade'
          },
          
          dadosDetalhados: [
            { andar: 1, banheiro: 'Masculino', papel_higienico: Math.round(31 * factor), sabonete: Math.round(10 * factor), papel_toalha: Math.round(15 * factor), alcool: Math.round(5 * factor) },
            { andar: 1, banheiro: 'Feminino', papel_higienico: Math.round(60 * factor), sabonete: Math.round(25 * factor), papel_toalha: Math.round(20 * factor), alcool: Math.round(8 * factor) },
            { andar: 2, banheiro: 'Masculino', papel_higienico: Math.round(50 * factor), sabonete: Math.round(15 * factor), papel_toalha: Math.round(18 * factor), alcool: Math.round(4 * factor) },
            { andar: 2, banheiro: 'Feminino', papel_higienico: Math.round(55 * factor), sabonete: Math.round(20 * factor), papel_toalha: Math.round(15 * factor), alcool: Math.round(6 * factor) },
            { andar: 3, banheiro: 'Masculino', papel_higienico: Math.round(70 * factor), sabonete: Math.round(25 * factor), papel_toalha: Math.round(20 * factor), alcool: Math.round(5 * factor) },
            { andar: 3, banheiro: 'Feminino', papel_higienico: Math.round(110 * factor), sabonete: Math.round(45 * factor), papel_toalha: Math.round(35 * factor), alcool: Math.round(10 * factor) },
            { andar: 4, banheiro: 'Masculino', papel_higienico: Math.round(60 * factor), sabonete: Math.round(20 * factor), papel_toalha: Math.round(15 * factor), alcool: Math.round(5 * factor) },
            { andar: 4, banheiro: 'Feminino', papel_higienico: Math.round(90 * factor), sabonete: Math.round(35 * factor), papel_toalha: Math.round(20 * factor), alcool: Math.round(8 * factor) },
            { andar: 5, banheiro: 'Masculino', papel_higienico: Math.round(100 * factor), sabonete: Math.round(35 * factor), papel_toalha: Math.round(25 * factor), alcool: Math.round(6 * factor) },
            { andar: 5, banheiro: 'Feminino', papel_higienico: Math.round(120 * factor), sabonete: Math.round(40 * factor), papel_toalha: Math.round(30 * factor), alcool: Math.round(10 * factor) }
          ]
        };
        
        // Restaurar canvas e renderizar gráficos
        this.renderCharts();
        this.renderDetailedTable();
        
        resolve(this.currentData);
      }, 800);
    });
  }
  
  renderCharts() {
    this.renderConsumoPorAndarChart();
    this.renderConsumoPorProdutoChart();
    this.renderConsumoPorGeneroChart();
    this.renderTendenciaConsumoChart();
  }
  
  renderConsumoPorAndarChart() {
    const containerId = 'consumo-por-andar-chart-container';
    
    if (!this.charts.consumoPorAndar) {
      // Inicializar o componente de visualização
      this.charts.consumoPorAndar = new ChartVisualizer(containerId, {
        title: 'Consumo por Andar',
        defaultType: 'bar',
        showControls: true,
        height: 300
      });
    }
    
    // Atualizar dados do gráfico
    this.charts.consumoPorAndar.updateChart(this.currentData.consumoPorAndar);
  }
  
  renderConsumoPorProdutoChart() {
    const containerId = 'consumo-por-produto-chart-container';
    
    if (!this.charts.consumoPorProduto) {
      // Inicializar o componente de visualização
      this.charts.consumoPorProduto = new ChartVisualizer(containerId, {
        title: 'Consumo por Produto',
        defaultType: 'pie',
        showControls: true,
        height: 300
      });
    }
    
    // Atualizar dados do gráfico
    this.charts.consumoPorProduto.updateChart(this.currentData.consumoPorProduto);
  }
  
  renderConsumoPorGeneroChart() {
    const containerId = 'consumo-por-genero-chart-container';
    
    if (!this.charts.consumoPorGenero) {
      // Inicializar o componente de visualização
      this.charts.consumoPorGenero = new ChartVisualizer(containerId, {
        title: 'Comparativo Masculino vs Feminino',
        defaultType: 'bar',
        showControls: true,
        height: 300
      });
    }
    
    // Atualizar dados do gráfico
    this.charts.consumoPorGenero.updateChart(this.currentData.consumoPorGenero);
  }
  
  renderTendenciaConsumoChart() {
    const containerId = 'tendencia-consumo-chart-container';
    
    if (!this.charts.tendenciaConsumo) {
      // Inicializar o componente de visualização
      this.charts.tendenciaConsumo = new ChartVisualizer(containerId, {
        title: 'Tendência de Consumo',
        defaultType: 'line',
        showControls: true,
        height: 300
      });
    }
    
    // Atualizar dados do gráfico
    this.charts.tendenciaConsumo.updateChart(this.currentData.tendenciaConsumo);
  }
  
  renderDetailedTable() {
    const tableBody = document.getElementById('detailed-consumo-table');
    if (!tableBody) return;
    
    const data = this.currentData.dadosDetalhados;
    
    if (!data || data.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">Nenhum dado encontrado para este período.</td></tr>';
      return;
    }
    
    tableBody.innerHTML = ''; // Limpar tabela
    
    data.forEach(item => {
      const total = item.papel_higienico + item.sabonete + item.papel_toalha + item.alcool;
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.andar}</td>
        <td>${item.banheiro}</td>
        <td>${item.papel_higienico}</td>
        <td>${item.sabonete}</td>
        <td>${item.papel_toalha}</td>
        <td>${item.alcool}</td>
        <td><strong>${total}</strong></td>
      `;
      tableBody.appendChild(row);
    });
  }
  
  setupEventListeners() {
    // Botão de exportar CSV
    const exportCsvBtn = document.getElementById('export-csv-btn');
    if (exportCsvBtn) {
      exportCsvBtn.addEventListener('click', () => {
        this.exportTableToCSV('consumo_detalhado.csv');
      });
    }
    
    // Botão de imprimir
    const printDataBtn = document.getElementById('print-data-btn');
    if (printDataBtn) {
      printDataBtn.addEventListener('click', () => {
        this.printTable();
      });
    }
  }
  
  exportTableToCSV(filename) {
    const data = this.currentData.dadosDetalhados;
    if (!data || data.length === 0) {
      alert('Não há dados para exportar.');
      return;
    }
    
    // Criar cabeçalho CSV
    let csvContent = 'Andar,Banheiro,Papel Higiênico,Sabonete Líquido,Papel Toalha,Álcool em Gel,Total\n';
    
    // Adicionar linhas de dados
    data.forEach(item => {
      const total = item.papel_higienico + item.sabonete + item.papel_toalha + item.alcool;
      csvContent += `${item.andar},${item.banheiro},${item.papel_higienico},${item.sabonete},${item.papel_toalha},${item.alcool},${total}\n`;
    });
    
    // Criar blob e link para download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Mostrar notificação
    if (typeof showAppNotification === 'function') {
      showAppNotification('Dados exportados com sucesso!', 'success');
    } else {
      alert('Dados exportados com sucesso!');
    }
  }
  
  printTable() {
    const printWindow = window.open('', '_blank');
    const tableData = this.currentData.dadosDetalhados;
    
    if (!tableData || tableData.length === 0) {
      alert('Não há dados para imprimir.');
      return;
    }
    
    // Criar conteúdo HTML para impressão
    let printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Relatório de Consumo Detalhado</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { font-size: 18px; margin-bottom: 10px; }
          table { border-collapse: collapse; width: 100%; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .footer { margin-top: 30px; font-size: 12px; color: #666; }
          @media print {
            .no-print { display: none; }
            body { margin: 0; }
          }
        </style>
      </head>
      <body>
        <h1>Relatório de Consumo Detalhado</h1>
        <p>Período: ${this.filterComponent ? this.formatDateRange() : 'Todos os períodos'}</p>
        
        <table>
          <thead>
            <tr>
              <th>Andar</th>
              <th>Banheiro</th>
              <th>Papel Higiênico</th>
              <th>Sabonete Líquido</th>
              <th>Papel Toalha</th>
              <th>Álcool em Gel</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
    `;
    
    // Adicionar linhas de dados
    tableData.forEach(item => {
      const total = item.papel_higienico + item.sabonete + item.papel_toalha + item.alcool;
      printContent += `
        <tr>
          <td>${item.andar}</td>
          <td>${item.banheiro}</td>
          <td>${item.papel_higienico}</td>
          <td>${item.sabonete}</td>
          <td>${item.papel_toalha}</td>
          <td>${item.alcool}</td>
          <td><strong>${total}</strong></td>
        </tr>
      `;
    });
    
    // Adicionar totais
    const totals = tableData.reduce((acc, item) => {
      acc.papel_higienico += item.papel_higienico;
      acc.sabonete += item.sabonete;
      acc.papel_toalha += item.papel_toalha;
      acc.alcool += item.alcool;
      return acc;
    }, { papel_higienico: 0, sabonete: 0, papel_toalha: 0, alcool: 0 });
    
    const grandTotal = totals.papel_higienico + totals.sabonete + totals.papel_toalha + totals.alcool;
    
    printContent += `
          <tr>
            <td colspan="2"><strong>TOTAL</strong></td>
            <td><strong>${totals.papel_higienico}</strong></td>
            <td><strong>${totals.sabonete}</strong></td>
            <td><strong>${totals.papel_toalha}</strong></td>
            <td><strong>${totals.alcool}</strong></td>
            <td><strong>${grandTotal}</strong></td>
          </tr>
        </tbody>
      </table>
      
      <div class="footer">
        <p>Relatório gerado em: ${new Date().toLocaleString()}</p>
      </div>
      
      <div class="no-print" style="margin-top: 20px; text-align: center;">
        <button onclick="window.print()">Imprimir</button>
        <button onclick="window.close()">Fechar</button>
      </div>
    </body>
    </html>
    `;
    
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // Mostrar notificação
    if (typeof showAppNotification === 'function') {
      showAppNotification('Relatório de impressão gerado!', 'success');
    }
  }
  
  formatDateRange() {
    if (!this.filterComponent) return 'Período não especificado';
    
    const filter = this.filterComponent.getCurrentFilter();
    if (filter.type === 'specific_date') {
      return `Data: ${filter.data.date}`;
    } else {
      return `De ${filter.data.startDate} até ${filter.data.endDate}`;
    }
  }
}

// Exportar o componente
window.AdvancedCharts = AdvancedCharts;
