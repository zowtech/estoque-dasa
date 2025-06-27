// Componente de KPIs para o Dashboard
class KpiDashboard {
  constructor(containerId, apiBaseUrl = '/api/dashboard') {
    this.container = document.getElementById(containerId);
    this.apiBaseUrl = apiBaseUrl;
    this.kpiData = {};
    this.alertsData = [];
    
    this.init();
  }
  
  async init() {
    this.renderLayout();
    await this.loadKpiData();
    this.setupEventListeners();
  }
  
  renderLayout() {
    this.container.innerHTML = `
      <div class="kpi-dashboard">
        <div class="kpi-header">
          <h3>Visão Geral do Consumo</h3>
          <div class="kpi-actions">
            <button class="btn btn-sm btn-outline-primary" id="refresh-kpi-btn" title="Atualizar os KPIs do dashboard" aria-label="Atualizar KPIs" tabindex="0">
              <i class="fas fa-sync-alt"></i> Atualizar
            </button>
          </div>
        </div>
        
        <div class="kpi-grid">
          <div class="kpi-card" id="kpi-consumo-total" title="Total de produtos consumidos em todos os banheiros no período selecionado." aria-label="Consumo Total" tabindex="0">
            <div class="kpi-card-inner">
              <div class="kpi-icon">
                <i class="fas fa-chart-line"></i>
              </div>
              <div class="kpi-content">
                <h4>Consumo Total <i class='fas fa-info-circle' title='Soma de todas as saídas de produtos no período.'></i></h4>
                <div class="kpi-value">
                  <span class="value">--</span>
                  <span class="unit">unidades</span>
                </div>
                <div class="kpi-trend">
                  <span class="trend-icon"><i class="fas fa-arrow-up"></i></span>
                  <span class="trend-value">--</span> vs. período anterior
                </div>
              </div>
            </div>
          </div>
          
          <div class="kpi-card" id="kpi-desperdicio" title="Percentual de produtos desperdiçados em relação ao total de entradas." aria-label="Desperdício" tabindex="0">
            <div class="kpi-card-inner">
              <div class="kpi-icon">
                <i class="fas fa-trash-alt"></i>
              </div>
              <div class="kpi-content">
                <h4>Desperdício <i class='fas fa-info-circle' title='Percentual de produtos descartados ou perdidos.'></i></h4>
                <div class="kpi-value">
                  <span class="value">--</span>
                  <span class="unit">%</span>
                </div>
                <div class="kpi-trend">
                  <span class="trend-icon"><i class="fas fa-arrow-down"></i></span>
                  <span class="trend-value">--</span> vs. período anterior
                </div>
              </div>
            </div>
          </div>
          
          <div class="kpi-card" id="kpi-economia-potencial" title="Quantidade de produtos que poderiam ser economizados com redução do desperdício." aria-label="Economia Potencial" tabindex="0">
            <div class="kpi-card-inner">
              <div class="kpi-icon">
                <i class="fas fa-piggy-bank"></i>
              </div>
              <div class="kpi-content">
                <h4>Economia Potencial <i class='fas fa-info-circle' title='Produtos que poderiam ser economizados se o desperdício fosse reduzido.'></i></h4>
                <div class="kpi-value">
                  <span class="value">--</span>
                  <span class="unit">unidades</span>
                </div>
                <div class="kpi-trend">
                  <span class="trend-icon"><i class="fas fa-arrow-up"></i></span>
                  <span class="trend-value">--</span> vs. período anterior
                </div>
              </div>
            </div>
          </div>
          
          <div class="kpi-card" id="kpi-produtos-criticos" title="Quantidade de produtos com estoque baixo ou crítico." aria-label="Produtos Críticos" tabindex="0">
            <div class="kpi-card-inner">
              <div class="kpi-icon">
                <i class="fas fa-exclamation-triangle"></i>
              </div>
              <div class="kpi-content">
                <h4>Produtos Críticos <i class='fas fa-info-circle' title='Produtos que estão com estoque baixo ou zerado.'></i></h4>
                <div class="kpi-value">
                  <span class="value">--</span>
                  <span class="unit">itens</span>
                </div>
                <div class="kpi-trend">
                  <span class="trend-icon"><i class="fas fa-arrow-up"></i></span>
                  <span class="trend-value">--</span> vs. período anterior
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="alerts-section" id="alerts-container">
          <div class="alerts-header">
            <h3>Alertas de Estoque</h3>
            <div class="alerts-actions">
              <button class="btn btn-sm btn-outline-secondary" id="view-all-alerts-btn" aria-label="Ver todos os alertas" tabindex="0">
                Ver Todos
              </button>
            </div>
          </div>
          <div class="alerts-list" id="alerts-list">
            <div class="text-center p-3">
              <div class="spinner-border spinner-border-sm" role="status"></div>
              <span class="ms-2">Carregando alertas...</span>
            </div>
          </div>
        </div>
      </div>
    `;
    
    this.addStyles();
  }
  
  addStyles() {
    const styleId = 'kpi-dashboard-styles';
    if (!document.getElementById(styleId)) {
      const styleElement = document.createElement('style');
      styleElement.id = styleId;
      styleElement.textContent = `
        .kpi-dashboard {
          margin-bottom: 30px;
        }
        
        .kpi-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .kpi-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
        }
        
        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }
        
        .kpi-card {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .kpi-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .kpi-card-inner {
          padding: 20px;
          display: flex;
          align-items: center;
        }
        
        .kpi-icon {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 15px;
          font-size: 20px;
        }
        
        #kpi-consumo-total .kpi-icon {
          background-color: rgba(52, 152, 219, 0.1);
          color: #3498db;
        }
        
        #kpi-desperdicio .kpi-icon {
          background-color: rgba(231, 76, 60, 0.1);
          color: #e74c3c;
        }
        
        #kpi-economia-potencial .kpi-icon {
          background-color: rgba(46, 204, 113, 0.1);
          color: #2ecc71;
        }
        
        #kpi-produtos-criticos .kpi-icon {
          background-color: rgba(241, 196, 15, 0.1);
          color: #f1c40f;
        }
        
        .kpi-content {
          flex-grow: 1;
        }
        
        .kpi-content h4 {
          margin: 0 0 5px 0;
          font-size: 14px;
          color: #7f8c8d;
        }
        
        .kpi-value {
          display: flex;
          align-items: baseline;
          margin-bottom: 5px;
        }
        
        .kpi-value .value {
          font-size: 24px;
          font-weight: 700;
          margin-right: 5px;
        }
        
        .kpi-value .unit {
          font-size: 14px;
          color: #7f8c8d;
        }
        
        .kpi-trend {
          font-size: 12px;
          color: #7f8c8d;
        }
        
        .kpi-trend .trend-icon {
          margin-right: 3px;
        }
        
        .kpi-trend .fa-arrow-up {
          color: #2ecc71;
        }
        
        .kpi-trend .fa-arrow-down {
          color: #e74c3c;
        }
        
        .alerts-section {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }
        
        .alerts-header {
          padding: 15px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #eee;
        }
        
        .alerts-header h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
        }
        
        .alerts-list {
          max-height: 300px;
          overflow-y: auto;
        }
        
        .alert-item {
          padding: 15px 20px;
          border-bottom: 1px solid #eee;
          display: flex;
          align-items: center;
        }
        
        .alert-item:last-child {
          border-bottom: none;
        }
        
        .alert-icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 15px;
          font-size: 16px;
        }
        
        .alert-icon.critical {
          background-color: rgba(231, 76, 60, 0.1);
          color: #e74c3c;
        }
        
        .alert-icon.warning {
          background-color: rgba(241, 196, 15, 0.1);
          color: #f1c40f;
        }
        
        .alert-icon.info {
          background-color: rgba(52, 152, 219, 0.1);
          color: #3498db;
        }
        
        .alert-content {
          flex-grow: 1;
        }
        
        .alert-title {
          font-weight: 600;
          margin-bottom: 3px;
        }
        
        .alert-description {
          font-size: 13px;
          color: #7f8c8d;
        }
        
        .alert-actions {
          margin-left: 10px;
        }
        
        .alert-actions button {
          background: none;
          border: none;
          color: #3498db;
          cursor: pointer;
          padding: 5px;
        }
        
        .alert-actions button:hover {
          color: #2980b9;
        }
        
        @media (max-width: 768px) {
          .kpi-grid {
            grid-template-columns: 1fr;
          }
        }
      `;
      
      document.head.appendChild(styleElement);
    }
  }
  
  async loadKpiData() {
    try {
      const response = await fetch(`${this.apiBaseUrl}/kpis`);
      const data = await response.json();
      this.kpiData = {
        consumoTotal: {
          valor: data.consumo_total || 0,
          unidade: 'unidades',
          tendencia: 0, // implementar cálculo de tendência se necessário
          tendenciaPositiva: true
        },
        desperdicio: {
          valor: data.percentual_desperdicio || 0,
          unidade: '%',
          tendencia: 0, // implementar cálculo de tendência se necessário
          tendenciaPositiva: false
        },
        economiaPotencial: {
          valor: data.total_desperdicio || 0, // pode ser ajustado para economia real
          unidade: 'unidades',
          tendencia: 0,
          tendenciaPositiva: true
        },
        produtosCriticos: {
          valor: data.produtos_estoque_baixo || 0,
          unidade: 'itens',
          tendencia: 0,
          tendenciaPositiva: false
        }
      };
      // Alertas automáticos de desperdício
      this.alertsData = [];
      if (data.percentual_desperdicio && data.percentual_desperdicio >= 20) {
        this.alertsData.push({
          id: 1000,
          tipo: 'critical',
          titulo: 'Desperdício Elevado',
          descricao: `O desperdício global está em ${data.percentual_desperdicio}%. Recomenda-se ação imediata, como treinamento e revisão de processos.`,
          data: new Date(),
          lido: false
        });
      }
      if (data.local_mais_desperdicio) {
        this.alertsData.push({
          id: 1001,
          tipo: 'warning',
          titulo: 'Área Crítica de Desperdício',
          descricao: `O local com maior desperdício é: ${data.local_mais_desperdicio}. Avalie ações corretivas.`,
          data: new Date(),
          lido: false
        });
      }
      if (data.produto_mais_desperdicado) {
        this.alertsData.push({
          id: 1002,
          tipo: 'info',
          titulo: 'Produto Mais Desperdiçado',
          descricao: `Atenção ao produto: ${data.produto_mais_desperdicado}. Considere revisar o uso ou dispenser.`,
          data: new Date(),
          lido: false
        });
      }
      this.renderKpis();
      this.renderAlerts();
    } catch (error) {
      console.error('Erro ao carregar KPIs:', error);
    }
  }
  
  renderKpis() {
    // Consumo Total
    const consumoTotalCard = document.getElementById('kpi-consumo-total');
    if (consumoTotalCard) {
      const data = this.kpiData.consumoTotal;
      consumoTotalCard.querySelector('.kpi-value .value').textContent = data.valor.toLocaleString();
      consumoTotalCard.querySelector('.kpi-value .unit').textContent = data.unidade;
      
      const trendIcon = consumoTotalCard.querySelector('.kpi-trend .trend-icon i');
      trendIcon.className = data.tendenciaPositiva ? 'fas fa-arrow-up' : 'fas fa-arrow-down';
      trendIcon.style.color = data.tendenciaPositiva ? '#2ecc71' : '#e74c3c';
      
      consumoTotalCard.querySelector('.kpi-trend .trend-value').textContent = `${data.tendencia}%`;
    }
    
    // Desperdício
    const desperdicioCard = document.getElementById('kpi-desperdicio');
    if (desperdicioCard) {
      const data = this.kpiData.desperdicio;
      desperdicioCard.querySelector('.kpi-value .value').textContent = data.valor.toLocaleString();
      desperdicioCard.querySelector('.kpi-value .unit').textContent = data.unidade;
      
      const trendIcon = desperdicioCard.querySelector('.kpi-trend .trend-icon i');
      trendIcon.className = data.tendenciaPositiva ? 'fas fa-arrow-up' : 'fas fa-arrow-down';
      // Para desperdício, tendência positiva (aumento) é ruim, então invertemos as cores
      trendIcon.style.color = data.tendenciaPositiva ? '#e74c3c' : '#2ecc71';
      
      desperdicioCard.querySelector('.kpi-trend .trend-value').textContent = `${data.tendencia}%`;
    }
    
    // Economia Potencial
    const economiaCard = document.getElementById('kpi-economia-potencial');
    if (economiaCard) {
      const data = this.kpiData.economiaPotencial;
      economiaCard.querySelector('.kpi-value .value').textContent = data.valor.toLocaleString();
      economiaCard.querySelector('.kpi-value .unit').textContent = data.unidade;
      
      const trendIcon = economiaCard.querySelector('.kpi-trend .trend-icon i');
      trendIcon.className = data.tendenciaPositiva ? 'fas fa-arrow-up' : 'fas fa-arrow-down';
      trendIcon.style.color = data.tendenciaPositiva ? '#2ecc71' : '#e74c3c';
      
      economiaCard.querySelector('.kpi-trend .trend-value').textContent = `${data.tendencia}%`;
    }
    
    // Produtos Críticos
    const criticosCard = document.getElementById('kpi-produtos-criticos');
    if (criticosCard) {
      const data = this.kpiData.produtosCriticos;
      criticosCard.querySelector('.kpi-value .value').textContent = data.valor.toLocaleString();
      criticosCard.querySelector('.kpi-value .unit').textContent = data.unidade;
      
      const trendIcon = criticosCard.querySelector('.kpi-trend .trend-icon i');
      trendIcon.className = data.tendenciaPositiva ? 'fas fa-arrow-up' : 'fas fa-arrow-down';
      // Para produtos críticos, tendência positiva (aumento) é ruim, então invertemos as cores
      trendIcon.style.color = data.tendenciaPositiva ? '#e74c3c' : '#2ecc71';
      
      criticosCard.querySelector('.kpi-trend .trend-value').textContent = `${data.tendencia}`;
    }
  }
  
  renderAlerts() {
    const alertsList = document.getElementById('alerts-list');
    if (!alertsList) return;
    
    if (!this.alertsData || this.alertsData.length === 0) {
      alertsList.innerHTML = '<div class="text-center p-3 text-muted">Nenhum alerta encontrado.</div>';
      return;
    }
    
    alertsList.innerHTML = ''; // Limpar lista
    
    // Mostrar apenas os 3 alertas mais recentes
    const recentAlerts = this.alertsData.slice(0, 3);
    
    recentAlerts.forEach(alert => {
      const alertItem = document.createElement('div');
      alertItem.className = `alert-item ${alert.lido ? 'read' : ''}`;
      alertItem.dataset.alertId = alert.id;
      
      let iconClass = 'fas fa-info-circle';
      if (alert.tipo === 'critical') {
        iconClass = 'fas fa-exclamation-circle';
      } else if (alert.tipo === 'warning') {
        iconClass = 'fas fa-exclamation-triangle';
      }
      
      alertItem.innerHTML = `
        <div class="alert-icon ${alert.tipo}">
          <i class="${iconClass}"></i>
        </div>
        <div class="alert-content">
          <div class="alert-title">${alert.titulo}</div>
          <div class="alert-description">${alert.descricao}</div>
        </div>
        <div class="alert-actions">
          <button class="mark-read-btn" title="Marcar como lido">
            <i class="fas ${alert.lido ? 'fa-check-circle' : 'fa-circle'}"></i>
          </button>
        </div>
      `;
      
      alertsList.appendChild(alertItem);
    });
    
    // Se houver mais alertas, mostrar indicador
    if (this.alertsData.length > 3) {
      const moreAlertsItem = document.createElement('div');
      moreAlertsItem.className = 'alert-item more-alerts';
      moreAlertsItem.innerHTML = `
        <div class="text-center w-100 py-2">
          <button class="btn btn-sm btn-link" id="load-more-alerts-btn">
            Ver mais ${this.alertsData.length - 3} alertas
          </button>
        </div>
      `;
      alertsList.appendChild(moreAlertsItem);
    }
  }
  
  setupEventListeners() {
    // Botão de atualizar KPIs
    const refreshBtn = document.getElementById('refresh-kpi-btn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        this.loadKpiData();
      });
    }
    
    // Botão de ver todos os alertas
    const viewAllBtn = document.getElementById('view-all-alerts-btn');
    if (viewAllBtn) {
      viewAllBtn.addEventListener('click', () => {
        this.showAllAlertsModal();
      });
    }
    
    // Botão de carregar mais alertas
    const loadMoreBtn = document.getElementById('load-more-alerts-btn');
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', () => {
        this.showAllAlertsModal();
      });
    }
    
    // Botões de marcar como lido
    const alertsList = document.getElementById('alerts-list');
    if (alertsList) {
      alertsList.addEventListener('click', (event) => {
        const markReadBtn = event.target.closest('.mark-read-btn');
        if (markReadBtn) {
          const alertItem = markReadBtn.closest('.alert-item');
          const alertId = parseInt(alertItem.dataset.alertId);
          this.toggleAlertReadStatus(alertId);
        }
      });
    }
  }
  
  toggleAlertReadStatus(alertId) {
    // Encontrar o alerta pelo ID
    const alertIndex = this.alertsData.findIndex(alert => alert.id === alertId);
    if (alertIndex !== -1) {
      // Inverter status de lido
      this.alertsData[alertIndex].lido = !this.alertsData[alertIndex].lido;
      
      // Atualizar UI
      this.renderAlerts();
      
      // Simular chamada de API para atualizar status
      console.log(`Alerta #${alertId} marcado como ${this.alertsData[alertIndex].lido ? 'lido' : 'não lido'}`);
    }
  }
  
  showAllAlertsModal() {
    // Criar modal para mostrar todos os alertas
    const modalId = 'all-alerts-modal';
    
    // Verificar se o modal já existe
    let modal = document.getElementById(modalId);
    if (!modal) {
      // Criar elemento do modal
      modal = document.createElement('div');
      modal.id = modalId;
      modal.className = 'modal fade';
      modal.tabIndex = -1;
      modal.setAttribute('aria-labelledby', 'alertsModalLabel');
      modal.setAttribute('aria-hidden', 'true');
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      
      modal.innerHTML = `
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="alertsModalLabel">Todos os Alertas</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
            </div>
            <div class="modal-body">
              <div class="alerts-filter mb-3">
                <div class="btn-group" role="group">
                  <button type="button" class="btn btn-outline-secondary active" data-filter="all">Todos</button>
                  <button type="button" class="btn btn-outline-danger" data-filter="critical">Críticos</button>
                  <button type="button" class="btn btn-outline-warning" data-filter="warning">Avisos</button>
                  <button type="button" class="btn btn-outline-info" data-filter="info">Informativos</button>
                </div>
                <div class="form-check form-switch ms-3">
                  <input class="form-check-input" type="checkbox" id="show-read-alerts">
                  <label class="form-check-label" for="show-read-alerts">Mostrar lidos</label>
                </div>
              </div>
              
              <div class="alerts-list-modal" id="modal-alerts-list">
                <!-- Alertas serão inseridos aqui -->
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
              <button type="button" class="btn btn-primary" id="mark-all-read-btn">Marcar todos como lidos</button>
            </div>
          </div>
        </div>
      `;
      
      document.body.appendChild(modal);
      
      // Adicionar estilos específicos para o modal
      const styleElement = document.createElement('style');
      styleElement.textContent = `
        .alerts-filter {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .alerts-list-modal {
          max-height: 400px;
          overflow-y: auto;
        }
        
        .alerts-list-modal .alert-item {
          padding: 15px;
          border-bottom: 1px solid #eee;
          display: flex;
          align-items: center;
        }
        
        .alerts-list-modal .alert-item.read {
          opacity: 0.7;
        }
        
        .alerts-list-modal .alert-item:last-child {
          border-bottom: none;
        }
        
        .alerts-list-modal .alert-date {
          font-size: 12px;
          color: #7f8c8d;
          margin-top: 3px;
        }
      `;
      document.head.appendChild(styleElement);
      
      // Configurar event listeners do modal
      modal.addEventListener('show.bs.modal', () => {
        this.renderModalAlerts('all', false);
      });
      
      // Filtros de alertas
      const filterButtons = modal.querySelectorAll('.alerts-filter button[data-filter]');
      filterButtons.forEach(button => {
        button.addEventListener('click', () => {
          // Remover classe active de todos os botões
          filterButtons.forEach(btn => btn.classList.remove('active'));
          
          // Adicionar classe active ao botão clicado
          button.classList.add('active');
          
          // Aplicar filtro
          const filterType = button.dataset.filter;
          const showRead = modal.querySelector('#show-read-alerts').checked;
          this.renderModalAlerts(filterType, showRead);
        });
      });
      
      // Checkbox para mostrar lidos
      const showReadCheckbox = modal.querySelector('#show-read-alerts');
      showReadCheckbox.addEventListener('change', () => {
        const filterType = modal.querySelector('.alerts-filter button.active').dataset.filter;
        this.renderModalAlerts(filterType, showReadCheckbox.checked);
      });
      
      // Botão para marcar todos como lidos
      const markAllReadBtn = modal.querySelector('#mark-all-read-btn');
      markAllReadBtn.addEventListener('click', () => {
        this.markAllAlertsAsRead();
      });
    }
    
    // Mostrar o modal
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
    // Foco automático
    setTimeout(() => { modal.focus(); }, 200);
    // Fechar por ESC
    const escHandler = (e) => {
      if (e.key === 'Escape') {
        bsModal.hide();
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);
  }
  
  renderModalAlerts(filterType, showRead) {
    const alertsList = document.getElementById('modal-alerts-list');
    if (!alertsList) return;
    
    // Filtrar alertas
    let filteredAlerts = [...this.alertsData];
    
    if (filterType !== 'all') {
      filteredAlerts = filteredAlerts.filter(alert => alert.tipo === filterType);
    }
    
    if (!showRead) {
      filteredAlerts = filteredAlerts.filter(alert => !alert.lido);
    }
    
    if (filteredAlerts.length === 0) {
      alertsList.innerHTML = '<div class="text-center p-3 text-muted">Nenhum alerta encontrado.</div>';
      return;
    }
    
    alertsList.innerHTML = ''; // Limpar lista
    
    filteredAlerts.forEach(alert => {
      const alertItem = document.createElement('div');
      alertItem.className = `alert-item ${alert.lido ? 'read' : ''}`;
      alertItem.dataset.alertId = alert.id;
      
      let iconClass = 'fas fa-info-circle';
      if (alert.tipo === 'critical') {
        iconClass = 'fas fa-exclamation-circle';
      } else if (alert.tipo === 'warning') {
        iconClass = 'fas fa-exclamation-triangle';
      }
      
      // Formatar data
      const formattedDate = this.formatAlertDate(alert.data);
      
      alertItem.innerHTML = `
        <div class="alert-icon ${alert.tipo}">
          <i class="${iconClass}"></i>
        </div>
        <div class="alert-content">
          <div class="alert-title">${alert.titulo}</div>
          <div class="alert-description">${alert.descricao}</div>
          <div class="alert-date">${formattedDate}</div>
        </div>
        <div class="alert-actions">
          <button class="mark-read-btn" title="Marcar como ${alert.lido ? 'não lido' : 'lido'}">
            <i class="fas ${alert.lido ? 'fa-check-circle' : 'fa-circle'}"></i>
          </button>
        </div>
      `;
      
      alertsList.appendChild(alertItem);
    });
    
    // Adicionar event listeners para botões de marcar como lido
    alertsList.querySelectorAll('.mark-read-btn').forEach(button => {
      button.addEventListener('click', (event) => {
        const alertItem = event.target.closest('.alert-item');
        const alertId = parseInt(alertItem.dataset.alertId);
        this.toggleAlertReadStatus(alertId);
        
        // Atualizar UI do modal
        const filterType = document.querySelector('.alerts-filter button.active').dataset.filter;
        const showRead = document.querySelector('#show-read-alerts').checked;
        this.renderModalAlerts(filterType, showRead);
      });
    });
  }
  
  formatAlertDate(date) {
    // Verificar se a data é de hoje
    const today = new Date();
    const isToday = date.getDate() === today.getDate() &&
                    date.getMonth() === today.getMonth() &&
                    date.getFullYear() === today.getFullYear();
    
    if (isToday) {
      // Formato para hoje: "Hoje, 14:30"
      return `Hoje, ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    } else {
      // Formato para outros dias: "05/06/2025, 14:30"
      return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }
  
  markAllAlertsAsRead() {
    // Marcar todos os alertas como lidos
    this.alertsData.forEach(alert => {
      alert.lido = true;
    });
    
    // Atualizar UI
    this.renderAlerts();
    
    // Atualizar UI do modal
    const filterType = document.querySelector('.alerts-filter button.active').dataset.filter;
    const showRead = document.querySelector('#show-read-alerts').checked;
    this.renderModalAlerts(filterType, showRead);
    
    // Simular chamada de API
    console.log('Todos os alertas marcados como lidos');
    
    // Mostrar notificação
    if (typeof showAppNotification === 'function') {
      showAppNotification('Todos os alertas foram marcados como lidos', 'success');
    }
  }
}

// Exportar o componente
window.KpiDashboard = KpiDashboard;
