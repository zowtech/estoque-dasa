// Integração do frontend com o backend para eventos
class EventService {
  constructor(baseUrl = '/api/eventos') {
    this.baseUrl = baseUrl;
  }

  // Obter todos os eventos
  async getAllEvents() {
    try {
      const response = await fetch(this.baseUrl);
      if (!response.ok) {
        throw new Error(`Erro ao buscar eventos: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
      throw error;
    }
  }

  // Obter eventos por período
  async getEventsByPeriod(startDate, endDate) {
    try {
      const url = `${this.baseUrl}/por-periodo?data_inicio=${startDate}&data_fim=${endDate}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Erro ao buscar eventos por período: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar eventos por período:', error);
      throw error;
    }
  }

  // Obter evento por ID
  async getEventById(id) {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);
      if (!response.ok) {
        throw new Error(`Erro ao buscar evento: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Erro ao buscar evento ${id}:`, error);
      throw error;
    }
  }

  // Criar novo evento
  async createEvent(eventData) {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erro ao criar evento: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao criar evento:', error);
      throw error;
    }
  }

  // Atualizar evento existente
  async updateEvent(id, eventData) {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erro ao atualizar evento: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao atualizar evento:', error);
      throw error;
    }
  }

  // Excluir evento
  async deleteEvent(id) {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erro ao excluir evento: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao excluir evento:', error);
      throw error;
    }
  }
}

// Componente de filtros de data funcionais
class DateRangeFilter {
    constructor(containerId, onFilterChange) {
        this.container = document.getElementById(containerId);
        this.onFilterChange = onFilterChange;
        this.init();
    }

    init() {
        this.createFilterHTML();
        this.bindEvents();
    }

    createFilterHTML() {
        this.container.innerHTML = `
            <div class="date-filter-container">
                <div class="filter-group">
                    <label>Período:</label>
                    <select id="periodoSelect" class="form-control">
                        <option value="7">Últimos 7 dias</option>
                        <option value="30" selected>Últimos 30 dias</option>
                        <option value="90">Últimos 90 dias</option>
                        <option value="180">Últimos 6 meses</option>
                        <option value="365">Último ano</option>
                        <option value="custom">Período personalizado</option>
                    </select>
                </div>
                <div class="custom-date-range" id="customDateRange" style="display: none;">
                    <div class="filter-group">
                        <label>Data Início:</label>
                        <input type="date" id="dataInicio" class="form-control">
                    </div>
                    <div class="filter-group">
                        <label>Data Fim:</label>
                        <input type="date" id="dataFim" class="form-control">
                    </div>
                </div>
                <div class="filter-group">
                    <label>
                        <input type="checkbox" id="compararPeriodo"> 
                        Comparar com período anterior
                    </label>
                </div>
                <button class="btn btn-primary" id="aplicarFiltro">Aplicar</button>
            </div>
        `;
    }

    bindEvents() {
        const periodoSelect = document.getElementById('periodoSelect');
        const customDateRange = document.getElementById('customDateRange');
        const aplicarFiltro = document.getElementById('aplicarFiltro');

        periodoSelect.addEventListener('change', () => {
            if (periodoSelect.value === 'custom') {
                customDateRange.style.display = 'block';
            } else {
                customDateRange.style.display = 'none';
            }
        });

        aplicarFiltro.addEventListener('click', () => {
            this.applyFilter();
        });

        // Aplicar filtro automaticamente quando mudar período pré-definido
        periodoSelect.addEventListener('change', () => {
            if (periodoSelect.value !== 'custom') {
                this.applyFilter();
            }
        });
    }

    applyFilter() {
        const periodoSelect = document.getElementById('periodoSelect');
        const dataInicio = document.getElementById('dataInicio');
        const dataFim = document.getElementById('dataFim');
        const compararPeriodo = document.getElementById('compararPeriodo');

        let startDate, endDate;

        if (periodoSelect.value === 'custom') {
            if (!dataInicio.value || !dataFim.value) {
                alert('Por favor, selecione as datas de início e fim.');
                return;
            }
            startDate = new Date(dataInicio.value);
            endDate = new Date(dataFim.value);
        } else {
            const dias = parseInt(periodoSelect.value);
            endDate = new Date();
            startDate = new Date();
            startDate.setDate(startDate.getDate() - dias);
        }

        const filterData = {
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
            comparar: compararPeriodo.checked,
            periodo: periodoSelect.value
        };

        if (this.onFilterChange) {
            this.onFilterChange(filterData);
        }
    }

    getCurrentFilter() {
        const periodoSelect = document.getElementById('periodoSelect');
        const dataInicio = document.getElementById('dataInicio');
        const dataFim = document.getElementById('dataFim');
        const compararPeriodo = document.getElementById('compararPeriodo');

        let startDate, endDate;

        if (periodoSelect.value === 'custom') {
            if (dataInicio.value && dataFim.value) {
                startDate = new Date(dataInicio.value);
                endDate = new Date(dataFim.value);
            } else {
                // Fallback para últimos 30 dias
                endDate = new Date();
                startDate = new Date();
                startDate.setDate(startDate.getDate() - 30);
            }
        } else {
            const dias = parseInt(periodoSelect.value);
            endDate = new Date();
            startDate = new Date();
            startDate.setDate(startDate.getDate() - dias);
        }

        return {
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
            comparar: compararPeriodo ? compararPeriodo.checked : false,
            periodo: periodoSelect.value
        };
    }
}

