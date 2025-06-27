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
          <div class="d-flex flex-wrap justify-content-between align-items-center mb-4">
            <div class="btn-group report-type-toggle" role="group">
              <button type="button" class="btn btn-primary active" data-report="consumo" title="Visualize o consumo por andar, produto e tipo de banheiro" aria-label="Relatório de Consumo" tabindex="0">Consumo</button>
              <button type="button" class="btn btn-primary" data-report="desperdicio" title="Veja onde há mais desperdício e oportunidades de economia" aria-label="Relatório de Desperdício" tabindex="0">Desperdício</button>
              <button type="button" class="btn btn-primary" data-report="comparativo" title="Compare períodos, andares e gêneros" aria-label="Relatório Comparativo" tabindex="0">Comparativo</button>
            </div>
            <div class="report-actions mt-2 mt-md-0">
              <button id="export-csv-btn" class="btn btn-outline-success" title="Exportar tabela para CSV" aria-label="Exportar CSV" tabindex="0">
                <i class="fas fa-file-csv"></i> Exportar CSV
              </button>
              <button id="export-pdf-btn" class="btn btn-outline-danger" title="Exportar relatório para PDF" aria-label="Exportar PDF" tabindex="0">
                <i class="fas fa-file-pdf"></i> Exportar PDF
              </button>
              <button id="print-report-btn" class="btn btn-outline-secondary" title="Imprimir relatório" aria-label="Imprimir relatório" tabindex="0">
                <i class="fas fa-print"></i> Imprimir
              </button>
            </div>
          </div>
          <div class="report-filter mb-4">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Filtros <i class='fas fa-info-circle' title='Use os filtros para refinar o relatório conforme sua necessidade.'></i></h5>
                <div class="row g-2">
                  <div class="col-12 col-md-3">
                    <div class="form-group">
                      <label for="period-select">Período <i class='fas fa-question-circle' title='Escolha o intervalo de tempo para o relatório.'></i></label>
                      <select class="form-control" id="period-select" aria-label="Selecionar período" tabindex="0">
                        <option value="7">Últimos 7 dias</option>
                        <option value="30" selected>Últimos 30 dias</option>
                        <option value="90">Últimos 90 dias</option>
                        <option value="180">Últimos 6 meses</option>
                        <option value="365">Último ano</option>
                        <option value="custom">Personalizado</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-12 col-md-3">
                    <div class="form-group">
                      <label for="product-select">Produto <i class='fas fa-question-circle' title='Filtre por produto específico ou veja todos.'></i></label>
                      <select class="form-control" id="product-select" aria-label="Selecionar produto" tabindex="0">
                        <option value="all">Todos</option>
                        <option value="papel">Papel Higiênico</option>
                        <option value="sabonete">Sabonete Líquido</option>
                        <option value="toalha">Papel Toalha</option>
                        <option value="alcool">Álcool em Gel</option>
                        <option value="desinfetante">Desinfetante</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-12 col-md-3">
                    <div class="form-group">
                      <label for="andar-select">Andar <i class='fas fa-question-circle' title='Selecione um andar específico ou todos.'></i></label>
                      <select class="form-control" id="andar-select" aria-label="Selecionar andar" tabindex="0">
                        <option value="all">Todos</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-12 col-md-2">
                    <div class="form-group">
                      <label for="tipo-banheiro-select">Tipo de Banheiro <i class='fas fa-question-circle' title='Filtre por gênero do banheiro.'></i></label>
                      <select class="form-control" id="tipo-banheiro-select" aria-label="Selecionar tipo de banheiro" tabindex="0">
                        <option value="all">Todos</option>
                        <option value="masculino">Masculino</option>
                        <option value="feminino">Feminino</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-12 col-md-1 d-flex align-items-end">
                    <button id="apply-filter-btn" class="btn btn-primary w-100" title="Aplicar filtros ao relatório" aria-label="Aplicar filtros" tabindex="0">Aplicar</button>
                  </div>
                </div>
                <div class="row mt-2">
                  <div class="col-md-4">
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="compare-previous" aria-label="Comparar com período anterior" tabindex="0">
                      <label class="form-check-label" for="compare-previous">
                        Comparar com período anterior <i class='fas fa-question-circle' title='Compare os dados atuais com o período anterior.'></i>
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
    // Chamar a API passando os filtros
    let url = this.apiBaseUrl + '?';
    if (filterData) {
      url += Object.entries(filterData).map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&');
    }
    this.toggleLoading(true);
    try {
      const response = await fetch(url);
      this.reportData = await response.json();
      this.renderReport();
    } catch (error) {
      this.showError('Erro ao carregar dados do relatório.');
    }
    this.toggleLoading(false);
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
    document.getElementById("export-csv-btn").addEventListener("click", () => {
      this.exportToCSV();
    });

    document.getElementById("export-pdf-btn").addEventListener("click", () => {
      this.exportToPDF();
    });
    
    document.getElementById("print-report-btn").addEventListener("click", () => {
      window.print();
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
      this.loadReportData(this.getCurrentFilters());
    });
  }

  getCurrentFilters() {
    return {
      periodo: document.getElementById('period-select').value,
      produto: document.getElementById('product-select').value,
      andar: document.getElementById('andar-select').value,
      tipoBanheiro: document.getElementById('tipo-banheiro-select').value,
      comparar: document.getElementById('compare-previous').checked
    };
  }

  exportToCSV() {
    // Exportar tabela visível para CSV
    const table = this.container.querySelector('.report-section:not(.d-none) table');
    if (!table) return alert('Nenhuma tabela encontrada para exportar.');
    let csv = '';
    const rows = table.querySelectorAll('tr');
    rows.forEach(row => {
      const cols = Array.from(row.querySelectorAll('th,td')).map(col => '"' + col.innerText.replace(/"/g, '""') + '"');
      csv += cols.join(',') + '\n';
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'relatorio.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  exportToPDF() {
    // Exportar tabela visível para PDF (usando print simplificado)
    const section = this.container.querySelector('.report-section:not(.d-none)');
    if (!section) return alert('Nenhum relatório encontrado para exportar.');
    const printWindow = window.open('', '', 'width=900,height=700');
    printWindow.document.write('<html><head><title>Relatório</title>');
    printWindow.document.write('<link rel="stylesheet" href="/static/css/reports.css">');
    printWindow.document.write('</head><body >');
    printWindow.document.write(section.innerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
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

