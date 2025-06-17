// Componente de visualização de gráficos
class ChartVisualizer {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.options = {
      title: 'Visualização de Dados',
      defaultType: 'bar', // bar, pie, line
      showControls: true,
      height: 300,
      ...options
    };
    
    this.chartInstance = null;
    this.currentType = this.options.defaultType;
    
    this.init();
  }
  
  init() {
    this.render();
    if (this.options.showControls) {
      this.setupEventListeners();
    }
  }
  
  render() {
    // Criar estrutura básica
    this.container.innerHTML = `
      <div class="chart-visualizer">
        <div class="chart-header">
          <h4>${this.options.title}</h4>
          ${this.options.showControls ? `
            <div class="chart-controls">
              <button class="btn-chart-type ${this.currentType === 'bar' ? 'active' : ''}" data-type="bar" title="Gráfico de barras">
                <i class="fas fa-chart-bar"></i>
              </button>
              <button class="btn-chart-type ${this.currentType === 'pie' ? 'active' : ''}" data-type="pie" title="Gráfico de pizza">
                <i class="fas fa-chart-pie"></i>
              </button>
              <button class="btn-chart-type ${this.currentType === 'line' ? 'active' : ''}" data-type="line" title="Gráfico de linha">
                <i class="fas fa-chart-line"></i>
              </button>
            </div>
          ` : ''}
        </div>
        <div class="chart-container" style="height: ${this.options.height}px;">
          <canvas id="${this.container.id}-canvas"></canvas>
        </div>
      </div>
    `;
    
    this.addStyles();
  }
  
  addStyles() {
    const styleId = 'chart-visualizer-styles';
    
    // Verificar se os estilos já foram adicionados
    if (!document.getElementById(styleId)) {
      const styleElement = document.createElement('style');
      styleElement.id = styleId;
      styleElement.textContent = `
        .chart-visualizer {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          border: 1px solid #eee;
          overflow: hidden;
        }
        
        .chart-header {
          padding: 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #eee;
        }
        
        .chart-header h4 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
        }
        
        .chart-controls {
          display: flex;
          gap: 5px;
        }
        
        .btn-chart-type {
          width: 36px;
          height: 36px;
          border-radius: 4px;
          border: 1px solid #ddd;
          background-color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .btn-chart-type:hover {
          background-color: #f5f5f5;
        }
        
        .btn-chart-type.active {
          background-color: #3498db;
          color: white;
          border-color: #3498db;
        }
        
        .chart-container {
          padding: 15px;
          position: relative;
        }
      `;
      
      document.head.appendChild(styleElement);
    }
  }
  
  setupEventListeners() {
    // Botões de tipo de gráfico
    const chartTypeButtons = this.container.querySelectorAll('.btn-chart-type');
    chartTypeButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Remover classe active de todos os botões
        chartTypeButtons.forEach(btn => btn.classList.remove('active'));
        
        // Adicionar classe active ao botão clicado
        button.classList.add('active');
        
        // Atualizar tipo de gráfico
        this.currentType = button.dataset.type;
        
        // Renderizar gráfico com o novo tipo
        if (this.chartData) {
          this.updateChart(this.chartData);
        }
      });
    });
  }
  
  updateChart(data) {
    this.chartData = data; // Armazenar dados para possíveis mudanças de tipo
    
    const canvas = document.getElementById(`${this.container.id}-canvas`);
    if (!canvas) {
      console.error(`Canvas não encontrado para o gráfico: ${this.container.id}-canvas`);
      return;
    }
    
    // Verificar se Chart.js está disponível
    if (!window.Chart) {
      console.error('Chart.js não está disponível');
      return;
    }
    
    // Destruir gráfico anterior se existir
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
    
    // Configurar gráfico com base no tipo atual
    let chartConfig = this.getChartConfig(data);
    
    // Criar gráfico
    this.chartInstance = new Chart(canvas, chartConfig);
  }
  
  getChartConfig(data) {
    // Configurações básicas com base no tipo de gráfico
    switch (this.currentType) {
      case 'bar':
        return {
          type: 'bar',
          data: {
            labels: data.labels,
            datasets: data.datasets.map(dataset => ({
              ...dataset,
              borderWidth: 1
            }))
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: data.datasets.length > 1,
                position: 'top',
              },
              title: {
                display: false
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    let label = context.dataset.label || '';
                    if (label) {
                      label += ': ';
                    }
                    label += context.raw;
                    return label;
                  }
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: data.yAxisLabel ? true : false,
                  text: data.yAxisLabel || ''
                }
              },
              x: {
                title: {
                  display: data.xAxisLabel ? true : false,
                  text: data.xAxisLabel || ''
                }
              }
            }
          }
        };
        
      case 'pie':
        return {
          type: 'pie',
          data: {
            labels: data.labels,
            datasets: [{
              data: data.datasets[0].data,
              backgroundColor: data.datasets[0].backgroundColor || this.generateColors(data.labels.length),
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
                display: false
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const value = context.raw;
                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                    const percentage = Math.round((value / total) * 100);
                    return `${context.label}: ${value} (${percentage}%)`;
                  }
                }
              }
            }
          }
        };
        
      case 'line':
        return {
          type: 'line',
          data: {
            labels: data.labels,
            datasets: data.datasets.map(dataset => ({
              ...dataset,
              borderWidth: 2,
              tension: 0.3,
              fill: false
            }))
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: data.datasets.length > 1,
                position: 'top',
              },
              title: {
                display: false
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: data.yAxisLabel ? true : false,
                  text: data.yAxisLabel || ''
                }
              },
              x: {
                title: {
                  display: data.xAxisLabel ? true : false,
                  text: data.xAxisLabel || ''
                }
              }
            }
          }
        };
        
      default:
        console.error(`Tipo de gráfico não suportado: ${this.currentType}`);
        return {
          type: 'bar',
          data: {
            labels: [],
            datasets: []
          },
          options: {
            responsive: true,
            maintainAspectRatio: false
          }
        };
    }
  }
  
  generateColors(count) {
    const baseColors = [
      'rgba(54, 162, 235, 0.7)',  // azul
      'rgba(255, 99, 132, 0.7)',  // vermelho
      'rgba(75, 192, 192, 0.7)',  // verde
      'rgba(255, 206, 86, 0.7)',  // amarelo
      'rgba(153, 102, 255, 0.7)', // roxo
      'rgba(255, 159, 64, 0.7)',  // laranja
      'rgba(199, 199, 199, 0.7)', // cinza
      'rgba(83, 102, 255, 0.7)',  // azul escuro
      'rgba(255, 99, 71, 0.7)',   // tomate
      'rgba(50, 205, 50, 0.7)'    // verde limão
    ];
    
    const colors = [];
    for (let i = 0; i < count; i++) {
      colors.push(baseColors[i % baseColors.length]);
    }
    
    return colors;
  }
  
  // Método para atualizar apenas o título
  updateTitle(title) {
    const titleElement = this.container.querySelector('.chart-header h4');
    if (titleElement) {
      titleElement.textContent = title;
      this.options.title = title;
    }
  }
  
  // Método para mostrar mensagem de carregamento
  showLoading() {
    const chartContainer = this.container.querySelector('.chart-container');
    if (chartContainer) {
      chartContainer.innerHTML = `
        <div class="chart-loading" style="display: flex; align-items: center; justify-content: center; height: 100%;">
          <div class="spinner-border spinner-border-sm text-primary" role="status"></div>
          <span class="ms-2">Carregando...</span>
        </div>
      `;
    }
  }
  
  // Método para mostrar mensagem de erro
  showError(message) {
    const chartContainer = this.container.querySelector('.chart-container');
    if (chartContainer) {
      chartContainer.innerHTML = `
        <div class="chart-error" style="display: flex; align-items: center; justify-content: center; height: 100%; color: #dc3545;">
          <i class="fas fa-exclamation-circle me-2"></i>
          <span>${message}</span>
        </div>
      `;
    }
  }
  
  // Método para restaurar o canvas após loading ou erro
  restoreCanvas() {
    const chartContainer = this.container.querySelector('.chart-container');
    if (chartContainer) {
      chartContainer.innerHTML = `<canvas id="${this.container.id}-canvas"></canvas>`;
    }
  }
}

// Exportar o componente
window.ChartVisualizer = ChartVisualizer;
