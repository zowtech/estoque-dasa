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
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventData)
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao criar evento: ${response.status}`);
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
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventData)
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao atualizar evento: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Erro ao atualizar evento ${id}:`, error);
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
        throw new Error(`Erro ao excluir evento: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Erro ao excluir evento ${id}:`, error);
      throw error;
    }
  }
}

// Integração do calendário com o serviço de eventos
class EventCalendarIntegrated extends EventCalendar {
  constructor(containerId, eventService) {
    super(containerId, 
      // onEventAdd callback
      async (event) => {
        try {
          const savedEvent = await eventService.createEvent({
            titulo: event.title,
            descricao: event.description,
            data: event.date,
            tipo: event.type
          });
          
          // Atualizar o ID do evento com o retornado pelo servidor
          event.id = savedEvent.id;
          
          // Notificar usuário
          this.showNotification('Evento criado com sucesso!', 'success');
        } catch (error) {
          console.error('Erro ao salvar evento:', error);
          this.showNotification('Erro ao salvar evento. Tente novamente.', 'error');
        }
      },
      // onEventSelect callback
      (event) => {
        this.showEventDetails(event);
      }
    );
    
    this.eventService = eventService;
    this.loadEvents();
  }

  // Carregar eventos do backend
  async loadEvents() {
    try {
      // Determinar período com base no mês atual
      const year = this.currentDate.getFullYear();
      const month = this.currentDate.getMonth();
      
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      
      const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
      const endDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDay.getDate()).padStart(2, '0')}`;
      
      // Buscar eventos do período
      const events = await this.eventService.getEventsByPeriod(startDate, endDate);
      
      // Converter formato do backend para o formato do calendário
      this.events = events.map(e => ({
        id: e.id,
        date: e.data,
        title: e.titulo,
        description: e.descricao,
        type: e.tipo
      }));
      
      // Renderizar calendário com os eventos
      this.render();
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
      this.showNotification('Erro ao carregar eventos. Tente novamente.', 'error');
    }
  }

  // Sobrescrever método para mudar de mês
  async changeMonth(delta) {
    this.currentDate.setMonth(this.currentDate.getMonth() + delta);
    await this.loadEvents();
  }

  // Mostrar detalhes do evento
  showEventDetails(event) {
    // Criar modal para mostrar detalhes
    const modal = document.createElement('div');
    modal.className = 'event-modal';
    modal.innerHTML = `
      <div class="event-modal-content">
        <div class="event-modal-header">
          <h3>${event.title}</h3>
          <button class="close-modal">&times;</button>
        </div>
        <div class="event-modal-body">
          <p><strong>Data:</strong> ${new Date(event.date).toLocaleDateString('pt-BR')}</p>
          <p><strong>Tipo:</strong> ${event.type}</p>
          <p><strong>Descrição:</strong> ${event.description || 'Sem descrição'}</p>
        </div>
        <div class="event-modal-footer">
          <button class="btn btn-danger delete-event">Excluir</button>
          <button class="btn btn-primary edit-event">Editar</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Adicionar listeners
    modal.querySelector('.close-modal').addEventListener('click', () => {
      document.body.removeChild(modal);
    });
    
    modal.querySelector('.delete-event').addEventListener('click', async () => {
      if (confirm('Tem certeza que deseja excluir este evento?')) {
        try {
          await this.eventService.deleteEvent(event.id);
          this.events = this.events.filter(e => e.id !== event.id);
          this.render();
          document.body.removeChild(modal);
          this.showNotification('Evento excluído com sucesso!', 'success');
        } catch (error) {
          console.error('Erro ao excluir evento:', error);
          this.showNotification('Erro ao excluir evento. Tente novamente.', 'error');
        }
      }
    });
    
    modal.querySelector('.edit-event').addEventListener('click', () => {
      document.body.removeChild(modal);
      this.showEditForm(event);
    });
  }

  // Mostrar formulário de edição
  showEditForm(event) {
    const eventForm = this.container.querySelector('#event-form');
    eventForm.style.display = 'block';
    
    // Preencher formulário com dados do evento
    this.container.querySelector('#event-date').value = event.date;
    this.container.querySelector('#event-title').value = event.title;
    this.container.querySelector('#event-description').value = event.description || '';
    this.container.querySelector('#event-type').value = event.type;
    
    // Adicionar ID do evento ao formulário
    eventForm.dataset.eventId = event.id;
    
    // Alterar texto do botão
    const saveButton = this.container.querySelector('#save-event');
    saveButton.textContent = 'Atualizar';
    
    // Sobrescrever handler do botão salvar
    const originalClickHandler = saveButton.onclick;
    saveButton.onclick = async () => {
      const date = this.container.querySelector('#event-date').value;
      const title = this.container.querySelector('#event-title').value;
      const description = this.container.querySelector('#event-description').value;
      const type = this.container.querySelector('#event-type').value;
      
      if (!date || !title) {
        alert('Por favor, preencha a data e o título do evento');
        return;
      }
      
      try {
        const updatedEvent = await this.eventService.updateEvent(event.id, {
          titulo: title,
          descricao: description,
          data: date,
          tipo: type
        });
        
        // Atualizar evento na lista
        const index = this.events.findIndex(e => e.id === event.id);
        if (index !== -1) {
          this.events[index] = {
            id: updatedEvent.id,
            date: updatedEvent.data,
            title: updatedEvent.titulo,
            description: updatedEvent.descricao,
            type: updatedEvent.tipo
          };
        }
        
        // Esconder formulário e renderizar novamente
        eventForm.style.display = 'none';
        delete eventForm.dataset.eventId;
        saveButton.textContent = 'Salvar';
        saveButton.onclick = originalClickHandler;
        
        this.render();
        this.showNotification('Evento atualizado com sucesso!', 'success');
      } catch (error) {
        console.error('Erro ao atualizar evento:', error);
        this.showNotification('Erro ao atualizar evento. Tente novamente.', 'error');
      }
    };
  }

  // Mostrar notificação
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remover após alguns segundos
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 3000);
  }
}

// Exportar os componentes
window.EventService = EventService;
window.EventCalendarIntegrated = EventCalendarIntegrated;
