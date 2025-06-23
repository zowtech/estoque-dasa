class ReportGenerator {
  constructor(containerId, apiBaseUrl = "/api/relatorios") {
    this.container = document.getElementById(containerId);
    this.apiBaseUrl = apiBaseUrl;
    this.currentReportType = "consumo"; // Tipo de relatório padrão
    this.reportData = {};
    
    if (!this.container) {
      console.error(`Container with ID ${containerId} not found`);
      return;
    }
    
    this.renderLayout();
    this.setupEventListeners();
    this.loadReportData();
  }
  
  renderLayout() {
    this.container.innerHTML = `
      <div class="report-container">
        <div class="report-header">
          <h2 class="mb-4">Gerador de Relatórios</h2>
          <div class="d-flex justify-content-between align-items-center mb-4">
            <div class="btn-group report-type-toggle" role="group">
              <button type="button" class="btn btn-primary active" data-report="consumo">Consumo</button>
              <button type="button" class="btn btn-primary" data-report="desperdicio">Desperdício</button>
              <button type="button" class="btn btn-primary" data-report="comparativo">Comparativo</button>
            </div>
            <div class="report-actions">
              <button id="export-report-btn" class="btn btn-outline-primary">
                <i class="fas fa-file-export"></i> Exportar
              </button>
              <button id="print-report-btn" class="btn btn-outline-secondary">
                <i class="fas fa-print"></i> Imprimir
              </button>
            </div>
          </div>
          <div class="report-filter mb-4">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Filtros</h5>
                <div class="row">
                  <div class="col-md-4">
                    <div class="form-group">
                      <label for="period-select">Período</label>
                      <select class="form-control" id="period-select">
                        <option value="7">Últimos 7 dias</option>
                        <option value="30" selected>Últimos 30 dias</option>
                        <option value="90">Últimos 90 dias</option>
                        <option value="180">Últimos 6 meses</option>
                        <option value="365">Último ano</option>
                        <option value="custom">Personalizado</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-md-6 custom-date-range d-none">
                    <div class="row">
                      <div class="col-md-6">
                        <div class="form-group">
                          <label for="start-date">Data Inicial</label>
                          <input type="date" class="form-control" id="start-date">
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="form-group">
                          <label for="end-date">Data Final</label>
                          <input type="date" class="form-control" id="end-date">
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-2">
                    <div class="form-group">
                      <label class="d-block">&nbsp;</label>
                      <button id="apply-filter-btn" class="btn btn-primary">Aplicar</button>
                    </div>
                  </div>
                </div>
                <div class="row mt-2">
                  <div class="col-md-4">
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="compare-previous">
                      <label class="form-check-label" for="compare-previous">
                        Comparar com período anterior
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="report-loading text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="sr-only">Carregando...</span>
          </div>
          <p class="mt-2">Carregando dados do relatório...</p>
        </div>
        
        <div class="report-content">
          <!-- Relatório de Consumo -->
          <div id="report-consumo" class="report-section">
            <div class="row">
              <div class="col-md-6">
                <div class="card mb-4">
                  <div class="card-header">
                    <h5 class="card-title">Consumo por Andar</h5>
                  </div>
                  <div class="card-body">
                    <div class="chart-container" style="height: 300px;">
                      <canvas id="consumo-andar-chart"></canvas>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="card mb-4">
                  <div class="card-header">
                    <h5 class="card-title">Consumo por Tipo de Banheiro</h5>
                  </div>
                  <div class="card-body">
                    <div class="chart-container" style="height: 300px;">
                      <canvas id="consumo-tipo-chart"></canvas>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="card mb-4">
              <div class="card-header">
                <h5 class="card-title">Detalhamento por Produto</h5>
              </div>
              <div class="card-body">
                <div class="table-responsive">
                  <table class="table table-striped">
                    <thead>
                      <tr>
                        <th>Produto</th>
                        <th>Total</th>
                        <th>Masculino</th>
                        <th>Feminino</th>
                        <th>Média por Andar</th>
                        <th>Tendência</th>
                      </tr>
                    </thead>
                    <tbody id="consumo-table-body">
                      <!-- Dados serão inseridos dinamicamente -->
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            <div class="card mb-4">
              <div class="card-header">
                <h5 class="card-title">Análise de Tendência</h5>
              </div>
              <div class="card-body">
                <div class="chart-container" style="height: 300px;">
                  <canvas id="consumo-tendencia-chart"></canvas>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Relatório de Desperdício -->
          <div id="report-desperdicio" class="report-section d-none">
            <div class="row">
              <div class="col-md-6">
                <div class="card mb-4">
                  <div class="card-header">
                    <h5 class="card-title">Índice de Desperdício por Andar</h5>
                  </div>
                  <div class="card-body">
                    <div class="chart-container" style="height: 300px;">
                      <canvas id="desperdicio-andar-chart"></canvas>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="card mb-4">
                  <div class="card-header">
                    <h5 class="card-title">Economia Potencial</h5>
                  </div>
                  <div class="card-body">
                    <div class="chart-container" style="height: 300px;">
                      <canvas id="economia-chart"></canvas>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="card mb-4">
              <div class="card-header">
                <h5 class="card-title">Detalhamento por Produto</h5>
              </div>
              <div class="card-body">
                <div class="table-responsive">
                  <table class="table table-striped">
                    <thead>
                      <tr>
                        <th>Produto</th>
                        <th>Desperdício</th>
                        <th>Percentual</th>
                        <th>Economia Potencial</th>
                        <th>Recomendação</th>
                      </tr>
                    </thead>
                    <tbody id="desperdicio-table-body">
                      <!-- Dados serão inseridos dinamicamente -->
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            <div class="card mb-4">
              <div class="card-header">
                <h5 class="card-title">Análise de Causas</h5>
              </div>
              <div class="card-body">
                <div class="chart-container" style="height: 300px;">
                  <canvas id="causas-chart"></canvas>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Relatório Comparativo -->
          <div id="report-comparativo" class="report-section d-none">
            <div class="row">
              <div class="col-md-6">
                <div class="card mb-4">
                  <div class="card-header">
                    <h5 class="card-title">Comparativo por Período</h5>
                  </div>
                  <div class="card-body">
                    <div class="chart-container" style="height: 300px;">
                      <canvas id="comparativo-periodo-chart"></canvas>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="card mb-4">
                  <div class="card-header">
                    <h5 class="card-title">Comparativo Masculino vs Feminino</h5>
                  </div>
                  <div class="card-body">
                    <div class="chart-container" style="height: 300px;">
                      <canvas id="comparativo-genero-chart"></canvas>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="card mb-4">
              <div class="card-header">
                <h5 class="card-title">Detalhamento por Andar</h5>
              </div>
              <div class="card-body">
                <div class="table-responsive">
                  <table class="table table-striped">
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
                      <!-- Dados serão inseridos dinamicamente -->
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            <div class="card mb-4">
              <div class="card-header">
                <h5 class="card-title">Análise de Sazonalidade</h5>
              </div>
              <div class="card-body">
                <div class="chart-container" style="height: 300px;">
                  <canvas id="sazonalidade-chart"></canvas>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
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
              anterior: 1150,
              variacao: 8.5,
              variacaoPositiva: true
            },
            genero: {
              masculinoAtual: 595,
              femininoAtual: 653,
              masculinoAnterior: 550,
              femininoAnterior: 600
            },
            porAndar: [
              {
                andar: 'Andar 5',
                periodoAtual: 356,
                periodoAnterior: 320,
                variacao: 11.2,
                masculinoAtual: 170,
                femininoAtual: 186
              },
              {
                andar: 'Andar 3',
                periodoAtual: 310,
                periodoAnterior: 290,
                variacao: 6.9,
                masculinoAtual: 150,
                femininoAtual: 160
              },
              {
                andar: 'Andar 1',
                periodoAtual: 160,
                periodoAnterior: 155,
                variacao: 3.2,
                masculinoAtual: 75,
                femininoAtual: 85
              },
              {
                andar: 'Andar 4',
                periodoAtual: 245,
                periodoAnterior: 230,
                variacao: 6.5,
                masculinoAtual: 120,
                femininoAtual: 125
              },
              { 
                andar: 'Andar 2',
                periodoAtual: 177,
                periodoAnterior: 165,
                variacao: 7.3,
                masculinoAtual: 80,
                femininoAtual: 97
              }
            ],
            sazonalidade: {
              labels: ['Q1', 'Q2', 'Q3', 'Q4'],
              datasets: [
                { nome: '2024', valores: [1200, 1300, 1100, 1400] },
                { nome: '2025', valores: [1250, 1350, 1150, 1450] }
              ]
            }
          }
        };
        
        this.renderReport();
        this.toggleLoading(false);
        resolve(this.reportData);
      }, 800);
    });
  }

  renderReport() {
    // Esconder todas as seções de relatório
    document.querySelectorAll(".report-section").forEach(section => {
      section.classList.add("d-none");
    });

    // Mostrar a seção de relatório atual
    const currentSection = document.getElementById(`report-${this.currentReportType}`);
    if (currentSection) {
      currentSection.classList.remove("d-none");
    }

    // Renderizar o relatório com base no tipo atual
    switch (this.currentReportType) {
      case "consumo":
        this.renderConsumoReport();
        break;
      case "desperdicio":
        this.renderDesperdicioReport();
        break;
      case "comparativo":
        this.renderComparativoReport();
        break;
    }
  }

  renderConsumoReport() {
    const consumoData = this.reportData.consumo;
    if (!consumoData) return;

    // Gráfico de Consumo por Andar
    const consumoAndarCtx = document.getElementById("consumo-andar-chart").getContext("2d");
    if (this.consumoAndarChart) this.consumoAndarChart.destroy();
    this.consumoAndarChart = new Chart(consumoAndarCtx, {
      type: "bar",
      data: {
        labels: consumoData.porAndar.map(item => item.nome),
        datasets: [
          {
            label: "Consumo Total",
            data: consumoData.porAndar.map(item => item.valor),
            backgroundColor: "rgba(52, 152, 219, 0.7)",
            borderColor: "rgba(52, 152, 219, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    // Gráfico de Consumo por Tipo de Banheiro
    const consumoTipoCtx = document.getElementById("consumo-tipo-chart").getContext("2d");
    if (this.consumoTipoChart) this.consumoTipoChart.destroy();
    this.consumoTipoChart = new Chart(consumoTipoCtx, {
      type: "pie",
      data: {
        labels: consumoData.porTipo.map(item => item.nome),
        datasets: [
          {
            data: consumoData.porTipo.map(item => item.valor),
            backgroundColor: ["rgba(255, 99, 132, 0.7)", "rgba(54, 162, 235, 0.7)"],
            borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });

    // Tabela de Detalhamento por Produto
    const consumoTableBody = document.getElementById("consumo-table-body");
    consumoTableBody.innerHTML = consumoData.porProduto.map(item => `
      <tr>
        <td>${item.nome}</td>
        <td>${item.total}</td>
        <td>${item.masculino}</td>
        <td>${item.feminino}</td>
        <td>${item.mediaPorAndar.toFixed(1)}</td>
        <td>
          <span class="trend-indicator ${item.tendenciaPositiva === true ? 
            'trend-up' : item.tendenciaPositiva === false ? 'trend-down' : 'trend-neutral'}">
            ${item.tendenciaPositiva === true ? '<i class="fas fa-arrow-up"></i>' : item.tendenciaPositiva === false ? '<i class="fas fa-arrow-down"></i>' : ''}
            ${item.tendencia !== null ? item.tendencia.toFixed(1) + '%' : 'N/A'}
          </span>
        </td>
      </tr>
    `).join('');

    // Gráfico de Análise de Tendência
    const consumoTendenciaCtx = document.getElementById("consumo-tendencia-chart").getContext("2d");
    if (this.consumoTendenciaChart) this.consumoTendenciaChart.destroy();
    this.consumoTendenciaChart = new Chart(consumoTendenciaCtx, {
      type: "line",
      data: {
        labels: consumoData.tendencia.labels,
        datasets: consumoData.tendencia.datasets.map(dataset => ({
          label: dataset.nome,
          data: dataset.valores,
          fill: false,
          borderColor: this.getRandomColor(), // Função auxiliar para cores
          tension: 0.1
        }))
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  renderDesperdicioReport() {
    const desperdicioData = this.reportData.desperdicio;
    if (!desperdicioData) return;

    // Gráfico de Índice de Desperdício por Andar
    const desperdicioAndarCtx = document.getElementById("desperdicio-andar-chart").getContext("2d");
    if (this.desperdicioAndarChart) this.desperdicioAndarChart.destroy();
    this.desperdicioAndarChart = new Chart(desperdicioAndarCtx, {
      type: "bar",
      data: {
        labels: desperdicioData.porAndar.map(item => item.nome),
        datasets: [
          {
            label: "Índice de Desperdício (%)",
            data: desperdicioData.porAndar.map(item => item.valor),
            backgroundColor: "rgba(231, 76, 60, 0.7)",
            borderColor: "rgba(231, 76, 60, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    // Gráfico de Economia Potencial
    const economiaCtx = document.getElementById("economia-chart").getContext("2d");
    if (this.economiaChart) this.economiaChart.destroy();
    this.economiaChart = new Chart(economiaCtx, {
      type: "doughnut",
      data: {
        labels: ["Economia Atual", "Economia Potencial"],
        datasets: [
          {
            data: [desperdicioData.economia.atual, desperdicioData.economia.potencial - desperdicioData.economia.atual],
            backgroundColor: ["rgba(46, 204, 113, 0.7)", "rgba(241, 196, 15, 0.7)"],
            borderColor: ["rgba(46, 204, 113, 1)", "rgba(241, 196, 15, 1)"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });

    // Tabela de Detalhamento por Produto
    const desperdicioTableBody = document.getElementById("desperdicio-table-body");
    desperdicioTableBody.innerHTML = desperdicioData.porProduto.map(item => `
      <tr>
        <td>${item.nome}</td>
        <td>${item.desperdicio}</td>
        <td>${item.percentual}%</td>
        <td>R$ ${item.economia.toFixed(2)}</td>
        <td>${item.recomendacao}</td>
      </tr>
    `).join('');

    // Gráfico de Análise de Causas
    const causasCtx = document.getElementById("causas-chart").getContext("2d");
    if (this.causasChart) this.causasChart.destroy();
    this.causasChart = new Chart(causasCtx, {
      type: "pie",
      data: {
        labels: desperdicioData.causas.map(item => item.nome),
        datasets: [
          {
            data: desperdicioData.causas.map(item => item.valor),
            backgroundColor: ["rgba(52, 152, 219, 0.7)", "rgba(46, 204, 113, 0.7)", "rgba(241, 196, 15, 0.7)", "rgba(155, 89, 182, 0.7)"],
            borderColor: ["rgba(52, 152, 219, 1)", "rgba(46, 204, 113, 1)", "rgba(241, 196, 15, 1)", "rgba(155, 89, 182, 1)"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }

  renderComparativoReport() {
    const comparativoData = this.reportData.comparativo;
    if (!comparativoData) return;

    // Comparativo por Período
    const comparativoPeriodoCtx = document.getElementById("comparativo-periodo-chart").getContext("2d");
    if (this.comparativoPeriodoChart) this.comparativoPeriodoChart.destroy();
    this.comparativoPeriodoChart = new Chart(comparativoPeriodoCtx, {
      type: "bar",
      data: {
        labels: ["Período Atual", "Período Anterior"],
        datasets: [
          {
            label: "Consumo Total",
            data: [comparativoData.periodos.atual, comparativoData.periodos.anterior],
            backgroundColor: ["rgba(52, 152, 219, 0.7)", "rgba(149, 165, 166, 0.7)"],
            borderColor: ["rgba(52, 152, 219, 1)", "rgba(149, 165, 166, 1)"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    // Comparativo Masculino vs Feminino
    const comparativoGeneroCtx = document.getElementById("comparativo-genero-chart").getContext("2d");
    if (this.comparativoGeneroChart) this.comparativoGeneroChart.destroy();
    this.comparativoGeneroChart = new Chart(comparativoGeneroCtx, {
      type: "bar",
      data: {
        labels: ["Masculino", "Feminino"],
        datasets: [
          {
            label: "Período Atual",
            data: [comparativoData.genero.masculinoAtual, comparativoData.genero.femininoAtual],
            backgroundColor: ["rgba(54, 162, 235, 0.7)", "rgba(255, 99, 132, 0.7)"],
            borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 99, 132, 1)"],
            borderWidth: 1,
          },
          {
            label: "Período Anterior",
            data: [comparativoData.genero.masculinoAnterior, comparativoData.genero.femininoAnterior],
            backgroundColor: ["rgba(149, 165, 166, 0.7)", "rgba(192, 57, 43, 0.7)"],
            borderColor: ["rgba(149, 165, 166, 1)", "rgba(192, 57, 43, 1)"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    // Tabela de Detalhamento por Andar
    const comparativoTableBody = document.getElementById("comparativo-table-body");
    comparativoTableBody.innerHTML = comparativoData.porAndar.map(item => `
      <tr>
        <td>${item.andar}</td>
        <td>${item.periodoAtual}</td>
        <td>${item.periodoAnterior}</td>
        <td>
          <span class="trend-indicator ${item.variacao > 0 ? 
            'trend-up' : item.variacao < 0 ? 'trend-down' : 'trend-neutral'}">
            ${item.variacao > 0 ? '<i class="fas fa-arrow-up"></i>' : item.variacao < 0 ? '<i class="fas fa-arrow-down"></i>' : ''}
            ${item.variacao.toFixed(1)}%
          </span>
        </td>
        <td>${item.masculinoAtual}</td>
        <td>${item.femininoAtual}</td>
      </tr>
    `).join('');

    // Gráfico de Análise de Sazonalidade
    const sazonalidadeCtx = document.getElementById("sazonalidade-chart").getContext("2d");
    if (this.sazonalidadeChart) this.sazonalidadeChart.destroy();
    this.sazonalidadeChart = new Chart(sazonalidadeCtx, {
      type: "line",
      data: {
        labels: comparativoData.sazonalidade.labels,
        datasets: comparativoData.sazonalidade.datasets.map(dataset => ({
          label: dataset.nome,
          data: dataset.valores,
          fill: false,
          borderColor: this.getRandomColor(),
          tension: 0.1
        }))
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  // Função auxiliar para gerar cores aleatórias para gráficos
  getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  toggleLoading(show) {
    const loadingElement = this.container.querySelector(".report-loading");
    if (loadingElement) {
      if (show) {
        loadingElement.classList.remove("d-none");
      } else {
        loadingElement.classList.add("d-none");
      }
    }
  }

  setupEventListeners() {
    // Event listeners para os botões de tipo de relatório
    this.container.querySelectorAll(".report-type-toggle .btn").forEach(button => {
      button.addEventListener("click", (e) => {
        this.container.querySelectorAll(".report-type-toggle .btn").forEach(btn => btn.classList.remove("active"));
        e.target.classList.add("active");
        this.currentReportType = e.target.dataset.report;
        this.loadReportData(); // Recarregar dados para o novo tipo de relatório
      });
    });

    // Event listeners para exportar e imprimir (implementação futura)
    document.getElementById("export-report-btn").addEventListener("click", () => {
      alert("Funcionalidade de Exportar em desenvolvimento!");
    });

    document.getElementById("print-report-btn").addEventListener("click", () => {
      alert("Funcionalidade de Imprimir em desenvolvimento!");
    });
    
    // Event listener para o seletor de período
    document.getElementById("period-select").addEventListener("change", (e) => {
      const customDateRange = document.querySelector(".custom-date-range");
      if (e.target.value === "custom") {
        customDateRange.classList.remove("d-none");
      } else {
        customDateRange.classList.add("d-none");
      }
    });
    
    // Event listener para o botão de aplicar filtro
    document.getElementById("apply-filter-btn").addEventListener("click", () => {
      const periodSelect = document.getElementById("period-select");
      const startDate = document.getElementById("start-date").value;
      const endDate = document.getElementById("end-date").value;
      const compareWithPrevious = document.getElementById("compare-previous").checked;
      
      let filterData = {
        compareWithPrevious
      };
      
      if (periodSelect.value === "custom") {
        if (startDate && endDate) {
          filterData.startDate = startDate;
          filterData.endDate = endDate;
        } else {
          alert("Por favor, selecione datas válidas para o período personalizado.");
          return;
        }
      } else {
        filterData.period = parseInt(periodSelect.value);
      }
      
      this.loadReportData(filterData);
    });
  }
}

// Adicionar estilos CSS para os indicadores de tendência
document.addEventListener("DOMContentLoaded", function() {
  const style = document.createElement("style");
  style.textContent = `
    .trend-indicator {
      display: inline-flex;
      align-items: center;
      font-weight: 500;
    }
    .trend-up {
      color: #27ae60;
    }
    .trend-down {
      color: #e74c3c;
    }
    .trend-neutral {
      color: #7f8c8d;
    }
    .trend-indicator i {
      margin-right: 5px;
    }
    .report-container {
      padding: 20px 0;
    }
    .report-header {
      margin-bottom: 30px;
    }
    .chart-container {
      position: relative;
      width: 100%;
    }
    .report-actions {
      display: flex;
      gap: 10px;
    }
    .report-filter .card {
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .report-section .card {
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 24px;
    }
    .report-section .card-header {
      background-color: #f8f9fa;
      border-bottom: 1px solid #e9ecef;
      padding: 15px 20px;
    }
    .report-section .card-body {
      padding: 20px;
    }
    .report-section .card-title {
      margin-bottom: 0;
      font-size: 1.1rem;
      font-weight: 600;
    }
    .report-type-toggle .btn {
      min-width: 120px;
    }
  `;
  document.head.appendChild(style);
});

