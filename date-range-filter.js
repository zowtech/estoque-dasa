// Componente de filtro por período
class DateRangeFilter {
  constructor(containerId, onFilterChange, options = {}) {
    this.container = document.getElementById(containerId);
    this.onFilterChange = onFilterChange;
    this.options = {
      showPresets: options.showPresets !== undefined ? options.showPresets : true,
      showSpecificDate: options.showSpecificDate !== undefined ? options.showSpecificDate : true,
      showDateRange: options.showDateRange !== undefined ? options.showDateRange : true,
      showComparison: options.showComparison !== undefined ? options.showComparison : false,
      defaultPeriod: options.defaultPeriod || 30
    };
    
    this.currentFilter = {
      type: 'preset',
      data: {
        period: this.options.defaultPeriod
      }
    };
    
    this.init();
  }
  
  init() {
    this.renderFilter();
    this.setupEventListeners();
  }
  
  renderFilter() {
    let filterHtml = `
      <div class="date-range-filter card">
        <div class="card-header filter-header">
          <h5 class="mb-0">Filtro de Período</h5>
        </div>
        <div class="card-body filter-body">
    `;
    
    // Presets rápidos
    if (this.options.showPresets) {
      filterHtml += `
        <div class="filter-section">
          <div class="btn-group" role="group">
            <button type="button" class="btn btn-outline-secondary btn-sm preset-btn ${this.currentFilter.data.period === 7 ? 'active' : ''}" data-period="7">7 dias</button>
            <button type="button" class="btn btn-outline-secondary btn-sm preset-btn ${this.currentFilter.data.period === 30 ? 'active' : ''}" data-period="30">30 dias</button>
            <button type="button" class="btn btn-outline-secondary btn-sm preset-btn ${this.currentFilter.data.period === 90 ? 'active' : ''}" data-period="90">90 dias</button>
            <button type="button" class="btn btn-outline-secondary btn-sm preset-btn ${this.currentFilter.data.period === 365 ? 'active' : ''}" data-period="365">1 ano</button>
          </div>
        </div>
      `;
    }
    
    // Filtro de data específica
    if (this.options.showSpecificDate) {
      filterHtml += `
        <div class="filter-section ms-2">
          <div class="input-group">
            <span class="input-group-text">Data específica</span>
            <input type="date" class="form-control form-control-sm" id="specific-date">
            <button class="btn btn-outline-primary btn-sm" type="button" id="apply-specific-date">Aplicar</button>
          </div>
        </div>
      `;
    }
    
    // Filtro de intervalo de datas
    if (this.options.showDateRange) {
      filterHtml += `
        <div class="filter-section ms-2">
          <div class="input-group">
            <span class="input-group-text">De</span>
            <input type="date" class="form-control form-control-sm" id="date-from">
            <span class="input-group-text">Até</span>
            <input type="date" class="form-control form-control-sm" id="date-to">
            <button class="btn btn-outline-primary btn-sm" type="button" id="apply-date-range">Aplicar</button>
          </div>
        </div>
      `;
    }
    
    // Opção de comparação
    if (this.options.showComparison) {
      filterHtml += `
        <div class="filter-section ms-2">
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" id="compare-periods">
            <label class="form-check-label" for="compare-periods">Comparar com período anterior</label>
          </div>
        </div>
      `;
    }
    
    filterHtml += `
        </div>
      </div>
    `;
    
    this.container.innerHTML = filterHtml;
    
    // Adicionar estilos
    this.addStyles();
  }
  
  addStyles() {
    const styleId = 'date-range-filter-styles';
    if (!document.getElementById(styleId)) {
      const styleElement = document.createElement('style');
      styleElement.id = styleId;
      styleElement.textContent = `
        .date-range-filter {
          margin-bottom: 20px;
        }
        
        .filter-body {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        
        .filter-section {
          display: flex;
          align-items: center;
        }
        
        @media (max-width: 768px) {
          .filter-body {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .filter-section {
            width: 100%;
            margin-left: 0 !important;
            margin-top: 10px;
          }
        }
      `;
      
      document.head.appendChild(styleElement);
    }
  }
  
  setupEventListeners() {
    // Botões de preset
    const presetButtons = this.container.querySelectorAll('.preset-btn');
    presetButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Remover classe active de todos os botões
        presetButtons.forEach(btn => btn.classList.remove('active'));
        
        // Adicionar classe active ao botão clicado
        button.classList.add('active');
        
        // Atualizar filtro atual
        const period = parseInt(button.dataset.period);
        this.currentFilter = {
          type: 'preset',
          data: {
            period: period
          }
        };
        
        // Notificar mudança
        this.onFilterChange('preset', this.currentFilter.data);
      });
    });
    
    // Botão de aplicar data específica
    const applySpecificDateBtn = this.container.querySelector('#apply-specific-date');
    if (applySpecificDateBtn) {
      applySpecificDateBtn.addEventListener('click', () => {
        const specificDate = this.container.querySelector('#specific-date').value;
        if (!specificDate) {
          alert('Por favor, selecione uma data.');
          return;
        }
        
        // Remover classe active de todos os botões de preset
        const presetButtons = this.container.querySelectorAll('.preset-btn');
        presetButtons.forEach(btn => btn.classList.remove('active'));
        
        // Atualizar filtro atual
        this.currentFilter = {
          type: 'specific',
          data: {
            date: specificDate
          }
        };
        
        // Notificar mudança
        this.onFilterChange('specific', this.currentFilter.data);
      });
    }
    
    // Botão de aplicar intervalo de datas
    const applyDateRangeBtn = this.container.querySelector('#apply-date-range');
    if (applyDateRangeBtn) {
      applyDateRangeBtn.addEventListener('click', () => {
        const dateFrom = this.container.querySelector('#date-from').value;
        const dateTo = this.container.querySelector('#date-to').value;
        
        if (!dateFrom || !dateTo) {
          alert('Por favor, selecione ambas as datas.');
          return;
        }
        
        if (new Date(dateFrom) > new Date(dateTo)) {
          alert('A data inicial deve ser anterior à data final.');
          return;
        }
        
        // Remover classe active de todos os botões de preset
        const presetButtons = this.container.querySelectorAll('.preset-btn');
        presetButtons.forEach(btn => btn.classList.remove('active'));
        
        // Atualizar filtro atual
        this.currentFilter = {
          type: 'range',
          data: {
            from: dateFrom,
            to: dateTo
          }
        };
        
        // Notificar mudança
        this.onFilterChange('range', this.currentFilter.data);
      });
    }
    
    // Checkbox de comparação
    const compareCheckbox = this.container.querySelector('#compare-periods');
    if (compareCheckbox) {
      compareCheckbox.addEventListener('change', () => {
        // Atualizar opção de comparação no filtro atual
        this.currentFilter.data.compare = compareCheckbox.checked;
        
        // Notificar mudança
        this.onFilterChange(this.currentFilter.type, this.currentFilter.data);
      });
    }
    
    // Definir valores padrão para os campos de data
    this.setDefaultDates();
  }
  
  setDefaultDates() {
    // Data específica: hoje
    const specificDateInput = this.container.querySelector('#specific-date');
    if (specificDateInput) {
      specificDateInput.value = new Date().toISOString().split('T')[0];
    }
    
    // Intervalo de datas: últimos 30 dias
    const dateFromInput = this.container.querySelector('#date-from');
    const dateToInput = this.container.querySelector('#date-to');
    
    if (dateFromInput && dateToInput) {
      const today = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(today.getDate() - 30);
      
      dateFromInput.value = thirtyDaysAgo.toISOString().split('T')[0];
      dateToInput.value = today.toISOString().split('T')[0];
    }
  }
  
  getCurrentFilter() {
    return this.currentFilter;
  }
  
  setFilter(filterType, filterData) {
    this.currentFilter = {
      type: filterType,
      data: filterData
    };
    
    // Atualizar UI de acordo com o filtro
    switch (filterType) {
      case 'preset':
        const presetButtons = this.container.querySelectorAll('.preset-btn');
        presetButtons.forEach(btn => {
          if (parseInt(btn.dataset.period) === filterData.period) {
            btn.classList.add('active');
          } else {
            btn.classList.remove('active');
          }
        });
        break;
        
      case 'specific':
        const specificDateInput = this.container.querySelector('#specific-date');
        if (specificDateInput && filterData.date) {
          specificDateInput.value = filterData.date;
        }
        break;
        
      case 'range':
        const dateFromInput = this.container.querySelector('#date-from');
        const dateToInput = this.container.querySelector('#date-to');
        
        if (dateFromInput && dateToInput && filterData.from && filterData.to) {
          dateFromInput.value = filterData.from;
          dateToInput.value = filterData.to;
        }
        break;
    }
    
    // Atualizar checkbox de comparação
    const compareCheckbox = this.container.querySelector('#compare-periods');
    if (compareCheckbox && filterData.compare !== undefined) {
      compareCheckbox.checked = filterData.compare;
    }
  }
}

// Exportar o componente
window.DateRangeFilter = DateRangeFilter;
