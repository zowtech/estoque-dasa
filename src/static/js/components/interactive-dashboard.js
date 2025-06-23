// Componente de menu expansível e interatividade para o dashboard
class InteractiveDashboard {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.activeSection = 'dashboard'; // Seção inicial ativa
    this.expandedItems = new Set(); // Itens expandidos
    
    this.init();
  }
  
  init() {
    this.render();
    this.setupEventListeners();
    this.initializeComponents();
  }
  
  render() {
    this.container.innerHTML = `
      <div class="interactive-dashboard">
        <div class="sidebar">
          <div class="sidebar-header">
            <div class="logo">
              <i class="fas fa-toilet"></i>
              <span>Sistema de Controle de Banheiros</span>
            </div>
            <button id="toggle-sidebar" class="toggle-sidebar">
              <i class="fas fa-bars"></i>
            </button>
          </div>
          
          <div class="sidebar-menu">
            <a href="#dashboard" class="menu-item active" data-section="dashboard">
              <i class="fas fa-tachometer-alt"></i>
              <span>Dashboard</span>
            </a>
            <a href="#ranking" class="menu-item" data-section="ranking">
              <i class="fas fa-trophy"></i>
              <span>Ranking</span>
            </a>
            <a href="#consumo" class="menu-item" data-section="consumo">
              <i class="fas fa-chart-line"></i>
              <span>Consumo</span>
            </a>
            <a href="#desperdicio" class="menu-item" data-section="desperdicio">
              <i class="fas fa-trash-alt"></i>
              <span>Desperdício</span>
            </a>
            <a href="#estoque" class="menu-item" data-section="estoque">
              <i class="fas fa-boxes"></i>
              <span>Estoque</span>
            </a>
            <a href="#eventos" class="menu-item" data-section="eventos">
              <i class="fas fa-calendar-alt"></i>
              <span>Eventos</span>
            </a>
            <a href="#relatorios" class="menu-item" data-section="relatorios">
              <i class="fas fa-file-alt"></i>
              <span>Relatórios</span>
            </a>
          </div>
        </div>
        
        <div class="main-content">
          <div class="top-bar">
            <div class="page-title">
              <h1 id="section-title">Dashboard</h1>
            </div>
            <div class="top-actions">
              <div class="date-filter">
                <div class="date-range-picker">
                  <button id="date-range-toggle" class="btn btn-outline-primary">
                    <i class="fas fa-calendar"></i>
                    <span id="current-date-range">Últimos 30 dias</span>
                    <i class="fas fa-chevron-down"></i>
                  </button>
                  <div id="date-range-dropdown" class="date-range-dropdown" style="display: none;">
                    <div class="date-presets">
                      <button data-days="7" class="date-preset">Últimos 7 dias</button>
                      <button data-days="30" class="date-preset active">Últimos 30 dias</button>
                      <button data-days="90" class="date-preset">Últimos 90 dias</button>
                      <button data-days="365" class="date-preset">Último ano</button>
                      <button data-days="custom" class="date-preset">Personalizado</button>
                    </div>
                    <div class="custom-date-inputs" style="display: none;">
                      <div class="input-group">
                        <label for="start-date">De:</label>
                        <input type="date" id="start-date" class="form-control">
                      </div>
                      <div class="input-group">
                        <label for="end-date">Até:</label>
                        <input type="date" id="end-date" class="form-control">
                      </div>
                      <button id="apply-custom-date" class="btn btn-primary">Aplicar</button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="actions">
                <button id="refresh-data" class="btn btn-outline-secondary" title="Atualizar dados">
                  <i class="fas fa-sync-alt"></i>
                </button>
                <button id="export-data" class="btn btn-outline-secondary" title="Exportar dados">
                  <i class="fas fa-download"></i>
                </button>
                <button id="settings" class="btn btn-outline-secondary" title="Configurações">
                  <i class="fas fa-cog"></i>
                </button>
              </div>
            </div>
          </div>
          
          <div class="content-sections">
            <!-- Dashboard Section -->
            <div id="dashboard-section" class="content-section active">
              <div class="kpi-summary">
                <div class="kpi-row">
                  <div class="kpi-card">
                    <div class="kpi-icon">
                      <i class="fas fa-building"></i>
                    </div>
                    <div class="kpi-content">
                      <h3>Andares</h3>
                      <div class="kpi-value">5</div>
                    </div>
                  </div>
                  
                  <div class="kpi-card">
                    <div class="kpi-icon">
                      <i class="fas fa-toilet"></i>
                    </div>
                    <div class="kpi-content">
                      <h3>Banheiros</h3>
                      <div class="kpi-value">10</div>
                    </div>
                  </div>
                  
                  <div class="kpi-card">
                    <div class="kpi-icon">
                      <i class="fas fa-box"></i>
                    </div>
                    <div class="kpi-content">
                      <h3>Produtos</h3>
                      <div class="kpi-value">5</div>
                    </div>
                  </div>
                  
                  <div class="kpi-card">
                    <div class="kpi-icon">
                      <i class="fas fa-chart-bar"></i>
                    </div>
                    <div class="kpi-content">
                      <h3>Consumo Total</h3>
                      <div class="kpi-value">1.052 unidades</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="dashboard-grid">
                <div class="dashboard-card">
                  <div class="card-header">
                    <h3>Consumo por Andar</h3>
                    <div class="card-actions">
                      <button class="btn-toggle-view" data-target="consumo-andar-chart" title="Alternar visualização">
                        <i class="fas fa-chart-bar"></i>
                      </button>
                      <button class="btn-expand" data-target="consumo-andar-card" title="Expandir">
                        <i class="fas fa-expand"></i>
                      </button>
                    </div>
                  </div>
                  <div class="card-body">
                    <div id="consumo-andar-chart" class="chart-container"></div>
                  </div>
                </div>
                
                <div class="dashboard-card">
                  <div class="card-header">
                    <h3>Consumo por Produto</h3>
                    <div class="card-actions">
                      <button class="btn-toggle-view" data-target="consumo-produto-chart" title="Alternar visualização">
                        <i class="fas fa-chart-pie"></i>
                      </button>
                      <button class="btn-expand" data-target="consumo-produto-card" title="Expandir">
                        <i class="fas fa-expand"></i>
                      </button>
                    </div>
                  </div>
                  <div class="card-body">
                    <div id="consumo-produto-chart" class="chart-container"></div>
                  </div>
                </div>
                
                <div class="dashboard-card full-width">
                  <div class="card-header">
                    <h3>Ranking de Banheiros</h3>
                    <div class="card-actions">
                      <button class="btn-expand" data-target="ranking-banheiros-card" title="Expandir">
                        <i class="fas fa-expand"></i>
                      </button>
                    </div>
                  </div>
                  <div class="card-body">
                    <div class="ranking-tabs">
                      <button class="ranking-tab active" data-target="ranking-masculino">Masculino</button>
                      <button class="ranking-tab" data-target="ranking-feminino">Feminino</button>
                    </div>
                    <div id="ranking-masculino" class="ranking-content active">
                      <div class="ranking-header">
                        <div class="ranking-title">
                          <h4>RANK BANHEIROS - MASCULINO</h4>
                          <button class="btn-sort" title="Ordenar">
                            <i class="fas fa-sort"></i> Topo
                          </button>
                        </div>
                      </div>
                      <div class="ranking-list">
                        <!-- Ranking items will be inserted here -->
                      </div>
                    </div>
                    <div id="ranking-feminino" class="ranking-content">
                      <div class="ranking-header">
                        <div class="ranking-title">
                          <h4>RANK BANHEIROS - FEMININO</h4>
                          <button class="btn-sort" title="Ordenar">
                            <i class="fas fa-sort"></i> Topo
                          </button>
                        </div>
                      </div>
                      <div class="ranking-list">
                        <!-- Ranking items will be inserted here -->
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Ranking Section -->
            <div id="ranking-section" class="content-section">
              <div id="product-ranking-container"></div>
            </div>
            
            <!-- Consumo Section -->
            <div id="consumo-section" class="content-section">
              <div id="advanced-charts-container"></div>
            </div>
            
            <!-- Desperdício Section -->
            <div id="desperdicio-section" class="content-section">
              <div id="kpi-dashboard-container"></div>
            </div>
            
            <!-- Estoque Section -->
            <div id="estoque-section" class="content-section">
              <div class="estoque-content">
                <h2>Controle de Estoque</h2>
                <p>Conteúdo do controle de estoque será carregado aqui.</p>
              </div>
            </div>
            
            <!-- Eventos Section -->
            <div id="eventos-section" class="content-section">
              <div id="event-calendar-container"></div>
            </div>
            
            <!-- Relatórios Section -->
            <div id="relatorios-section" class="content-section">
              <div class="relatorios-content">
                <h2>Relatórios</h2>
                <p>Conteúdo dos relatórios será carregado aqui.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Modal para visualização expandida -->
      <div id="expand-modal" class="expand-modal" style="display: none;">
        <div class="expand-modal-content">
          <div class="expand-modal-header">
            <h3 id="expand-modal-title">Título</h3>
            <button id="close-expand-modal" class="close-modal">&times;</button>
          </div>
          <div class="expand-modal-body">
            <div id="expand-modal-content"></div>
          </div>
        </div>
      </div>
    `;
  }
  
  setupEventListeners() {
    // Menu de navegação
    const menuItems = this.container.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const section = item.dataset.section;
        this.changeSection(section);
      });
    });
    
    // Toggle sidebar
    const toggleSidebar = this.container.querySelector('#toggle-sidebar');
    toggleSidebar.addEventListener('click', () => {
      this.container.querySelector('.interactive-dashboard').classList.toggle('sidebar-collapsed');
    });
    
    // Date range picker
    const dateRangeToggle = this.container.querySelector('#date-range-toggle');
    dateRangeToggle.addEventListener('click', () => {
      const dropdown = this.container.querySelector('#date-range-dropdown');
      dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    });
    
    // Date presets
    const datePresets = this.container.querySelectorAll('.date-preset');
    datePresets.forEach(preset => {
      preset.addEventListener('click', () => {
        // Remover classe active de todos os presets
        datePresets.forEach(p => p.classList.remove('active'));
        
        // Adicionar classe active ao preset selecionado
        preset.classList.add('active');
        
        const days = preset.dataset.days;
        
        if (days === 'custom') {
          // Mostrar inputs de data personalizada
          this.container.querySelector('.custom-date-inputs').style.display = 'block';
        } else {
          // Esconder inputs de data personalizada
          this.container.querySelector('.custom-date-inputs').style.display = 'none';
          
          // Atualizar texto do botão
          this.container.querySelector('#current-date-range').textContent = preset.textContent;
          
          // Fechar dropdown
          this.container.querySelector('#date-range-dropdown').style.display = 'none';
          
          // Disparar evento de mudança de período
          this.triggerDateRangeChange(parseInt(days));
        }
      });
    });
    
    // Botão de aplicar data personalizada
    const applyCustomDate = this.container.querySelector('#apply-custom-date');
    applyCustomDate.addEventListener('click', () => {
      const startDate = this.container.querySelector('#start-date').value;
      const endDate = this.container.querySelector('#end-date').value;
      
      if (!startDate || !endDate) {
        alert('Por favor, selecione data inicial e final');
        return;
      }
      
      // Formatar datas para exibição
      const start = new Date(startDate);
      const end = new Date(endDate);
      const formattedStart = `${start.getDate().toString().padStart(2, '0')}/${(start.getMonth() + 1).toString().padStart(2, '0')}/${start.getFullYear()}`;
      const formattedEnd = `${end.getDate().toString().padStart(2, '0')}/${(end.getMonth() + 1).toString().padStart(2, '0')}/${end.getFullYear()}`;
      
      // Atualizar texto do botão
      this.container.querySelector('#current-date-range').textContent = `${formattedStart} - ${formattedEnd}`;
      
      // Fechar dropdown
      this.container.querySelector('#date-range-dropdown').style.display = 'none';
      
      // Calcular diferença em dias
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // Disparar evento de mudança de período
      this.triggerDateRangeChange(diffDays, startDate, endDate);
    });
    
    // Botão de atualizar dados
    const refreshData = this.container.querySelector('#refresh-data');
    refreshData.addEventListener('click', () => {
      this.refreshData();
    });
    
    // Botão de exportar dados
    const exportData = this.container.querySelector('#export-data');
    exportData.addEventListener('click', () => {
      this.exportData();
    });
    
    // Botões de alternar visualização
    const toggleViewButtons = this.container.querySelectorAll('.btn-toggle-view');
    toggleViewButtons.forEach(button => {
      button.addEventListener('click', () => {
        const target = button.dataset.target;
        this.toggleChartView(target);
      });
    });
    
    // Botões de expandir
    const expandButtons = this.container.querySelectorAll('.btn-expand');
    expandButtons.forEach(button => {
      button.addEventListener('click', () => {
        const target = button.dataset.target;
        this.expandCard(target);
      });
    });
    
    // Botão de fechar modal
    const closeModal = this.container.querySelector('#close-expand-modal');
    closeModal.addEventListener('click', () => {
      this.closeExpandModal();
    });
    
    // Tabs de ranking
    const rankingTabs = this.container.querySelectorAll('.ranking-tab');
    rankingTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Remover classe active de todas as tabs
        rankingTabs.forEach(t => t.classList.remove('active'));
        
        // Adicionar classe active à tab selecionada
        tab.classList.add('active');
        
        // Esconder todos os conteúdos
        const contents = this.container.querySelectorAll('.ranking-content');
        contents.forEach(content => content.classList.remove('active'));
        
        // Mostrar conteúdo selecionado
        const targetId = tab.dataset.target;
        this.container.querySelector(`#${targetId}`).classList.add('active');
      });
    });
    
    // Fechar dropdown de data ao clicar fora
    document.addEventListener('click', (e) => {
      const dropdown = this.container.querySelector('#date-range-dropdown');
      const toggle = this.container.querySelector('#date-range-toggle');
      
      if (dropdown.style.display === 'block' && 
          !dropdown.contains(e.target) && 
          !toggle.contains(e.target)) {
        dropdown.style.display = 'none';
      }
    });
  }
  
  initializeComponents() {
    // Inicializar componentes nas seções correspondentes
    this.initializeProductRanking();
    this.initializeAdvancedCharts();
    this.initializeKpiDashboard();
    this.initializeEventCalendar();
    
    // Carregar dados iniciais
    this.loadDashboardData();
  }
  
  initializeProductRanking() {
    // Verificar se o componente está disponível
    if (window.ProductRanking) {
      const container = this.container.querySelector('#product-ranking-container');
      if (container) {
        this.productRanking = new ProductRanking('product-ranking-container');
      }
    }
  }
  
  initializeAdvancedCharts() {
    // Verificar se o componente está disponível
    if (window.AdvancedCharts) {
      const container = this.container.querySelector('#advanced-charts-container');
      if (container) {
        this.advancedCharts = new AdvancedCharts('advanced-charts-container');
      }
    }
  }
  
  initializeKpiDashboard() {
    // Verificar se o componente está disponível
    if (window.KpiDashboard) {
      const container = this.container.querySelector('#kpi-dashboard-container');
      if (container) {
        this.kpiDashboard = new KpiDashboard('kpi-dashboard-container');
      }
    }
  }
  
  initializeEventCalendar() {
    // Verificar se os componentes estão disponíveis
    if (window.EventService && window.EventCalendarIntegrated) {
      const container = this.container.querySelector('#event-calendar-container');
      if (container) {
        const eventService = new EventService();
        this.eventCalendar = new EventCalendarIntegrated('event-calendar-container', eventService);
      }
    }
  }
  
  async loadDashboardData() {
    try {
      // Carregar dados para o dashboard principal
      const [consumoAndar, consumoProduto, rankingMasculino, rankingFeminino] = await Promise.all([
        this.fetchConsumoPorAndar(),
        this.fetchConsumoPorProduto(),
        this.fetchRankingBanheiros('masculino'),
        this.fetchRankingBanheiros('feminino')
      ]);
      
      // Renderizar gráficos
      this.renderConsumoPorAndarChart(consumoAndar);
      this.renderConsumoPorProdutoChart(consumoProduto);
      
      // Renderizar rankings
      this.renderRankingBanheiros('masculino', rankingMasculino);
      this.renderRankingBanheiros('feminino', rankingFeminino);
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
      this.showError('Não foi possível carregar os dados do dashboard. Tente novamente mais tarde.');
    }
  }
  
  async fetchConsumoPorAndar() {
    // Simular dados para demonstração
    return [
      { andar: 1, quantidade: 180 },
      { andar: 2, quantidade: 175 },
      { andar: 3, quantidade: 220 },
      { andar: 4, quantidade: 175 },
      { andar: 5, quantidade: 270 }
    ];
  }
  
  async fetchConsumoPorProduto() {
    // Simular dados para demonstração
    return [
      { nome: 'Papel Higiênico', quantidade: 450 },
      { nome: 'Sabonete Líquido', quantidade: 320 },
      { nome: 'Papel Toalha', quantidade: 180 },
      { nome: 'Álcool em Gel', quantidade: 80 },
      { nome: 'Desinfetante', quantidade: 22 }
    ];
  }
  
  async fetchRankingBanheiros(tipo) {
    // Simular dados para demonstração
    if (tipo === 'masculino') {
      return [
        { andar: 5, tipo: 'masculino', consumo: 137, produtos: [
          { nome: 'Papel Higiênico', quantidade: 80 },
          { nome: 'Sabonete Líquido', quantidade: 35 },
          { nome: 'Papel Toalha', quantidade: 22 }
        ]},
        { andar: 3, tipo: 'masculino', consumo: 116, produtos: [
          { nome: 'Papel Higiênico', quantidade: 65 },
          { nome: 'Sabonete Líquido', quantidade: 30 },
          { nome: 'Papel Toalha', quantidade: 21 }
        ]},
        { andar: 2, tipo: 'masculino', consumo: 90, produtos: [
          { nome: 'Papel Higiênico', quantidade: 50 },
          { nome: 'Sabonete Líquido', quantidade: 25 },
          { nome: 'Papel Toalha', quantidade: 15 }
        ]},
        { andar: 1, tipo: 'masculino', consumo: 90, produtos: [
          { nome: 'Papel Higiênico', quantidade: 48 },
          { nome: 'Sabonete Líquido', quantidade: 27 },
          { nome: 'Papel Toalha', quantidade: 15 }
        ]},
        { andar: 4, tipo: 'masculino', consumo: 90, produtos: [
          { nome: 'Papel Higiênico', quantidade: 52 },
          { nome: 'Sabonete Líquido', quantidade: 23 },
          { nome: 'Papel Toalha', quantidade: 15 }
        ]}
      ];
    } else {
      return [
        { andar: 3, tipo: 'feminino', consumo: 137, produtos: [
          { nome: 'Papel Higiênico', quantidade: 75 },
          { nome: 'Sabonete Líquido', quantidade: 40 },
          { nome: 'Papel Toalha', quantidade: 22 }
        ]},
        { andar: 5, tipo: 'feminino', consumo: 129, produtos: [
          { nome: 'Papel Higiênico', quantidade: 70 },
          { nome: 'Sabonete Líquido', quantidade: 38 },
          { nome: 'Papel Toalha', quantidade: 21 }
        ]},
        { andar: 1, tipo: 'feminino', consumo: 94, produtos: [
          { nome: 'Papel Higiênico', quantidade: 50 },
          { nome: 'Sabonete Líquido', quantidade: 30 },
          { nome: 'Papel Toalha', quantidade: 14 }
        ]},
        { andar: 2, tipo: 'feminino', consumo: 94, produtos: [
          { nome: 'Papel Higiênico', quantidade: 52 },
          { nome: 'Sabonete Líquido', quantidade: 28 },
          { nome: 'Papel Toalha', quantidade: 14 }
        ]},
        { andar: 4, tipo: 'feminino', consumo: 94, produtos: [
          { nome: 'Papel Higiênico', quantidade: 48 },
          { nome: 'Sabonete Líquido', quantidade: 32 },
          { nome: 'Papel Toalha', quantidade: 14 }
        ]}
      ];
    }
  }
  
  renderConsumoPorAndarChart(data) {
    const chartContainer = document.getElementById('consumo-andar-chart');
    
    // Verificar se Chart.js está disponível
    if (!window.Chart) {
      chartContainer.innerHTML = '<div class="error">Chart.js não está disponível</div>';
      return;
    }
    
    // Destruir gráfico anterior se existir
    if (this.charts && this.charts.consumoAndar) {
      this.charts.consumoAndar.destroy();
    }
    
    // Inicializar objeto de gráficos se não existir
    if (!this.charts) {
      this.charts = {};
    }
    
    // Preparar dados para o gráfico
    const labels = data.map(item => `Andar ${item.andar}`);
    const values = data.map(item => item.quantidade);
    const backgroundColors = [
      'rgba(54, 162, 235, 0.7)',
      'rgba(75, 192, 192, 0.7)',
      'rgba(255, 206, 86, 0.7)',
      'rgba(255, 99, 132, 0.7)',
      'rgba(153, 102, 255, 0.7)'
    ];
    
    // Criar gráfico
    this.charts.consumoAndar = new Chart(chartContainer, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Quantidade Consumida',
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
            text: 'Consumo por Andar'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Quantidade'
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
  
  renderConsumoPorProdutoChart(data) {
    const chartContainer = document.getElementById('consumo-produto-chart');
    
    // Verificar se Chart.js está disponível
    if (!window.Chart) {
      chartContainer.innerHTML = '<div class="error">Chart.js não está disponível</div>';
      return;
    }
    
    // Destruir gráfico anterior se existir
    if (this.charts && this.charts.consumoProduto) {
      this.charts.consumoProduto.destroy();
    }
    
    // Inicializar objeto de gráficos se não existir
    if (!this.charts) {
      this.charts = {};
    }
    
    // Preparar dados para o gráfico
    const labels = data.map(item => item.nome);
    const values = data.map(item => item.quantidade);
    const backgroundColors = [
      'rgba(54, 162, 235, 0.7)',
      'rgba(75, 192, 192, 0.7)',
      'rgba(255, 206, 86, 0.7)',
      'rgba(255, 99, 132, 0.7)',
      'rgba(153, 102, 255, 0.7)'
    ];
    
    // Criar gráfico
    this.charts.consumoProduto = new Chart(chartContainer, {
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
            text: 'Consumo por Produto'
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
    });
  }
  
  renderRankingBanheiros(tipo, data) {
    const rankingList = this.container.querySelector(`#ranking-${tipo} .ranking-list`);
    
    // Gerar HTML para cada item do ranking
    let html = '';
    
    data.forEach((item, index) => {
      html += `
        <div class="ranking-item">
          <div class="ranking-item-header">
            <div class="ranking-info">
              <span class="ranking-position">${index + 1}.</span>
              <span class="ranking-name">Base Dasa Wtorre - Andar ${item.andar} - ${item.tipo.charAt(0).toUpperCase() + item.tipo.slice(1)}</span>
            </div>
            <div class="ranking-value">${item.consumo}</div>
          </div>
          <div class="ranking-item-details" id="ranking-${tipo}-${item.andar}-details" style="display: none;">
            <h5>Produtos mais consumidos:</h5>
            <div class="top-products">
              ${item.produtos.map((produto, prodIndex) => `
                <div class="top-product">
                  <span class="product-rank">${prodIndex + 1}</span>
                  <span class="product-name">${produto.nome}</span>
                  <span class="product-quantity">${produto.quantidade}</span>
                </div>
              `).join('')}
            </div>
          </div>
          <button class="btn-toggle-details" data-target="ranking-${tipo}-${item.andar}-details">
            <i class="fas fa-chevron-down"></i>
          </button>
        </div>
      `;
    });
    
    rankingList.innerHTML = html;
    
    // Adicionar listeners para os botões de toggle
    const toggleButtons = rankingList.querySelectorAll('.btn-toggle-details');
    toggleButtons.forEach(button => {
      button.addEventListener('click', () => {
        const targetId = button.dataset.target;
        const detailsDiv = document.getElementById(targetId);
        const isExpanded = detailsDiv.style.display !== 'none';
        
        // Alternar visibilidade
        detailsDiv.style.display = isExpanded ? 'none' : 'block';
        
        // Alternar ícone
        button.innerHTML = isExpanded ? 
          '<i class="fas fa-chevron-down"></i>' : 
          '<i class="fas fa-chevron-up"></i>';
      });
    });
  }
  
  changeSection(section) {
    // Atualizar menu
    const menuItems = this.container.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
      item.classList.remove('active');
      if (item.dataset.section === section) {
        item.classList.add('active');
      }
    });
    
    // Atualizar título da página
    const sectionTitle = this.container.querySelector('#section-title');
    sectionTitle.textContent = section.charAt(0).toUpperCase() + section.slice(1);
    
    // Atualizar seção ativa
    const contentSections = this.container.querySelectorAll('.content-section');
    contentSections.forEach(contentSection => {
      contentSection.classList.remove('active');
    });
    
    const activeSection = this.container.querySelector(`#${section}-section`);
    if (activeSection) {
      activeSection.classList.add('active');
    }
    
    // Armazenar seção ativa
    this.activeSection = section;
    
    // Carregar dados específicos da seção se necessário
    this.loadSectionData(section);
  }
  
  loadSectionData(section) {
    // Carregar dados específicos para cada seção
    switch (section) {
      case 'ranking':
        if (this.productRanking) {
          // Recarregar dados do ranking se necessário
        }
        break;
      case 'consumo':
        if (this.advancedCharts) {
          // Recarregar dados dos gráficos avançados se necessário
        }
        break;
      case 'desperdicio':
        if (this.kpiDashboard) {
          // Recarregar dados dos KPIs se necessário
        }
        break;
      case 'eventos':
        if (this.eventCalendar) {
          // Recarregar dados do calendário se necessário
        }
        break;
    }
  }
  
  toggleChartView(targetId) {
    const chartContainer = document.getElementById(targetId);
    
    // Implementar lógica para alternar entre tipos de visualização
    if (targetId === 'consumo-andar-chart') {
      // Alternar entre bar e line
      const currentType = this.charts.consumoAndar.config.type;
      const newType = currentType === 'bar' ? 'line' : 'bar';
      
      // Buscar dados atuais
      this.fetchConsumoPorAndar().then(data => {
        // Destruir gráfico atual
        this.charts.consumoAndar.destroy();
        
        // Preparar dados para o gráfico
        const labels = data.map(item => `Andar ${item.andar}`);
        const values = data.map(item => item.quantidade);
        
        // Criar novo gráfico com tipo alternado
        if (newType === 'line') {
          this.charts.consumoAndar = new Chart(chartContainer, {
            type: 'line',
            data: {
              labels: labels,
              datasets: [{
                label: 'Quantidade Consumida',
                data: values,
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.1)',
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
                  text: 'Consumo por Andar'
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Quantidade'
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
        } else {
          this.renderConsumoPorAndarChart(data);
        }
      });
    } else if (targetId === 'consumo-produto-chart') {
      // Alternar entre pie e bar
      const currentType = this.charts.consumoProduto.config.type;
      const newType = currentType === 'pie' ? 'bar' : 'pie';
      
      // Buscar dados atuais
      this.fetchConsumoPorProduto().then(data => {
        // Destruir gráfico atual
        this.charts.consumoProduto.destroy();
        
        // Preparar dados para o gráfico
        const labels = data.map(item => item.nome);
        const values = data.map(item => item.quantidade);
        const backgroundColors = [
          'rgba(54, 162, 235, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(255, 99, 132, 0.7)',
          'rgba(153, 102, 255, 0.7)'
        ];
        
        // Criar novo gráfico com tipo alternado
        if (newType === 'bar') {
          this.charts.consumoProduto = new Chart(chartContainer, {
            type: 'bar',
            data: {
              labels: labels,
              datasets: [{
                label: 'Quantidade Consumida',
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
                  text: 'Consumo por Produto'
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Quantidade'
                  }
                },
                x: {
                  title: {
                    display: true,
                    text: 'Produto'
                  }
                }
              }
            }
          });
        } else {
          this.renderConsumoPorProdutoChart(data);
        }
      });
    }
  }
  
  expandCard(targetId) {
    const modal = document.getElementById('expand-modal');
    const modalTitle = document.getElementById('expand-modal-title');
    const modalContent = document.getElementById('expand-modal-content');
    
    // Determinar título e conteúdo com base no alvo
    let title = '';
    let content = '';
    
    if (targetId === 'consumo-andar-card') {
      title = 'Consumo por Andar';
      content = `<div class="expanded-chart-container"><canvas id="expanded-consumo-andar-chart"></canvas></div>`;
    } else if (targetId === 'consumo-produto-card') {
      title = 'Consumo por Produto';
      content = `<div class="expanded-chart-container"><canvas id="expanded-consumo-produto-chart"></canvas></div>`;
    } else if (targetId === 'ranking-banheiros-card') {
      title = 'Ranking de Banheiros';
      content = `
        <div class="expanded-ranking">
          <div class="ranking-tabs">
            <button class="ranking-tab active" data-target="expanded-ranking-masculino">Masculino</button>
            <button class="ranking-tab" data-target="expanded-ranking-feminino">Feminino</button>
          </div>
          <div id="expanded-ranking-masculino" class="ranking-content active"></div>
          <div id="expanded-ranking-feminino" class="ranking-content"></div>
        </div>
      `;
    }
    
    // Atualizar modal
    modalTitle.textContent = title;
    modalContent.innerHTML = content;
    
    // Mostrar modal
    modal.style.display = 'flex';
    
    // Renderizar conteúdo expandido
    if (targetId === 'consumo-andar-card') {
      this.renderExpandedConsumoPorAndarChart();
    } else if (targetId === 'consumo-produto-card') {
      this.renderExpandedConsumoPorProdutoChart();
    } else if (targetId === 'ranking-banheiros-card') {
      this.renderExpandedRankingBanheiros();
    }
  }
  
  closeExpandModal() {
    const modal = document.getElementById('expand-modal');
    modal.style.display = 'none';
  }
  
  async renderExpandedConsumoPorAndarChart() {
    const chartContainer = document.getElementById('expanded-consumo-andar-chart');
    
    // Buscar dados
    const data = await this.fetchConsumoPorAndar();
    
    // Preparar dados para o gráfico
    const labels = data.map(item => `Andar ${item.andar}`);
    const values = data.map(item => item.quantidade);
    const backgroundColors = [
      'rgba(54, 162, 235, 0.7)',
      'rgba(75, 192, 192, 0.7)',
      'rgba(255, 206, 86, 0.7)',
      'rgba(255, 99, 132, 0.7)',
      'rgba(153, 102, 255, 0.7)'
    ];
    
    // Criar gráfico expandido
    new Chart(chartContainer, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Quantidade Consumida',
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
            text: 'Consumo por Andar'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Quantidade'
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
  
  async renderExpandedConsumoPorProdutoChart() {
    const chartContainer = document.getElementById('expanded-consumo-produto-chart');
    
    // Buscar dados
    const data = await this.fetchConsumoPorProduto();
    
    // Preparar dados para o gráfico
    const labels = data.map(item => item.nome);
    const values = data.map(item => item.quantidade);
    const backgroundColors = [
      'rgba(54, 162, 235, 0.7)',
      'rgba(75, 192, 192, 0.7)',
      'rgba(255, 206, 86, 0.7)',
      'rgba(255, 99, 132, 0.7)',
      'rgba(153, 102, 255, 0.7)'
    ];
    
    // Criar gráfico expandido
    new Chart(chartContainer, {
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
            text: 'Consumo por Produto'
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
    });
  }
  
  async renderExpandedRankingBanheiros() {
    // Buscar dados
    const [rankingMasculino, rankingFeminino] = await Promise.all([
      this.fetchRankingBanheiros('masculino'),
      this.fetchRankingBanheiros('feminino')
    ]);
    
    // Renderizar rankings expandidos
    this.renderExpandedRanking('masculino', rankingMasculino);
    this.renderExpandedRanking('feminino', rankingFeminino);
    
    // Adicionar listeners para as tabs
    const rankingTabs = document.querySelectorAll('.expanded-ranking .ranking-tab');
    rankingTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Remover classe active de todas as tabs
        rankingTabs.forEach(t => t.classList.remove('active'));
        
        // Adicionar classe active à tab selecionada
        tab.classList.add('active');
        
        // Esconder todos os conteúdos
        const contents = document.querySelectorAll('.expanded-ranking .ranking-content');
        contents.forEach(content => content.classList.remove('active'));
        
        // Mostrar conteúdo selecionado
        const targetId = tab.dataset.target;
        document.getElementById(targetId).classList.add('active');
      });
    });
  }
  
  renderExpandedRanking(tipo, data) {
    const rankingContent = document.getElementById(`expanded-ranking-${tipo}`);
    
    // Gerar HTML para o ranking expandido
    let html = `
      <div class="ranking-header">
        <div class="ranking-title">
          <h4>RANK BANHEIROS - ${tipo.toUpperCase()}</h4>
          <button class="btn-sort" title="Ordenar">
            <i class="fas fa-sort"></i> Topo
          </button>
        </div>
      </div>
      <div class="ranking-list expanded">
    `;
    
    data.forEach((item, index) => {
      html += `
        <div class="ranking-item">
          <div class="ranking-item-header">
            <div class="ranking-info">
              <span class="ranking-position">${index + 1}.</span>
              <span class="ranking-name">Base Dasa Wtorre - Andar ${item.andar} - ${item.tipo.charAt(0).toUpperCase() + item.tipo.slice(1)}</span>
            </div>
            <div class="ranking-value">${item.consumo}</div>
          </div>
          <div class="ranking-item-details expanded-details">
            <h5>Produtos mais consumidos:</h5>
            <div class="top-products">
              ${item.produtos.map((produto, prodIndex) => `
                <div class="top-product">
                  <span class="product-rank">${prodIndex + 1}</span>
                  <span class="product-name">${produto.nome}</span>
                  <span class="product-quantity">${produto.quantidade}</span>
                </div>
              `).join('')}
            </div>
            <div class="product-chart-container">
              <canvas id="expanded-ranking-${tipo}-${item.andar}-chart"></canvas>
            </div>
          </div>
        </div>
      `;
    });
    
    html += '</div>';
    
    rankingContent.innerHTML = html;
    
    // Renderizar gráficos para cada item
    data.forEach(item => {
      const chartContainer = document.getElementById(`expanded-ranking-${tipo}-${item.andar}-chart`);
      
      // Preparar dados para o gráfico
      const labels = item.produtos.map(produto => produto.nome);
      const values = item.produtos.map(produto => produto.quantidade);
      const backgroundColors = [
        'rgba(54, 162, 235, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(255, 206, 86, 0.7)'
      ];
      
      // Criar gráfico
      new Chart(chartContainer, {
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
                boxWidth: 12,
                font: {
                  size: 10
                }
              }
            },
            title: {
              display: true,
              text: `Consumo por Produto - Andar ${item.andar}`,
              font: {
                size: 14
              }
            }
          }
        }
      });
    });
  }
  
  refreshData() {
    // Recarregar dados com base na seção ativa
    if (this.activeSection === 'dashboard') {
      this.loadDashboardData();
    } else {
      this.loadSectionData(this.activeSection);
    }
  }
  
  exportData() {
    // Implementar exportação de dados
    alert('Funcionalidade de exportação será implementada em breve.');
  }
  
  triggerDateRangeChange(days, startDate = null, endDate = null) {
    // Disparar evento personalizado para notificar mudança de período
    const event = new CustomEvent('dateRangeChange', {
      detail: {
        days,
        startDate,
        endDate
      }
    });
    
    document.dispatchEvent(event);
    
    // Recarregar dados com novo período
    this.refreshData();
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
window.InteractiveDashboard = InteractiveDashboard;
