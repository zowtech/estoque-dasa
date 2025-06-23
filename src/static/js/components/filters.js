// Componente de filtro por período com calendário
class DateRangePicker {
  constructor(containerId, onChange) {
    this.container = document.getElementById(containerId);
    this.onChange = onChange;
    this.startDate = null;
    this.endDate = null;
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="date-range-picker">
        <div class="date-inputs">
          <div class="input-group">
            <label for="start-date">Data inicial:</label>
            <input type="date" id="start-date" class="form-control">
          </div>
          <div class="input-group">
            <label for="end-date">Data final:</label>
            <input type="date" id="end-date" class="form-control">
          </div>
          <button id="apply-date-filter" class="btn btn-primary">Aplicar</button>
          <button id="reset-date-filter" class="btn btn-outline-secondary">Resetar</button>
        </div>
        <div class="predefined-ranges">
          <button data-range="7" class="btn btn-sm btn-outline-primary">Últimos 7 dias</button>
          <button data-range="30" class="btn btn-sm btn-outline-primary">Últimos 30 dias</button>
          <button data-range="90" class="btn btn-sm btn-outline-primary">Últimos 90 dias</button>
          <button data-range="365" class="btn btn-sm btn-outline-primary">Último ano</button>
        </div>
      </div>
    `;

    this.attachEventListeners();
  }

  attachEventListeners() {
    const startDateInput = this.container.querySelector('#start-date');
    const endDateInput = this.container.querySelector('#end-date');
    const applyButton = this.container.querySelector('#apply-date-filter');
    const resetButton = this.container.querySelector('#reset-date-filter');
    const predefinedButtons = this.container.querySelectorAll('.predefined-ranges button');

    startDateInput.addEventListener('change', (e) => {
      this.startDate = e.target.value;
    });

    endDateInput.addEventListener('change', (e) => {
      this.endDate = e.target.value;
    });

    applyButton.addEventListener('click', () => {
      if (this.startDate && this.endDate) {
        this.onChange(this.startDate, this.endDate);
      } else {
        alert('Por favor, selecione data inicial e final');
      }
    });

    resetButton.addEventListener('click', () => {
      startDateInput.value = '';
      endDateInput.value = '';
      this.startDate = null;
      this.endDate = null;
      this.onChange(null, null);
    });

    predefinedButtons.forEach(button => {
      button.addEventListener('click', () => {
        const days = parseInt(button.dataset.range);
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - days);
        
        const formatDate = (date) => {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        };
        
        this.startDate = formatDate(start);
        this.endDate = formatDate(end);
        
        startDateInput.value = this.startDate;
        endDateInput.value = this.endDate;
        
        this.onChange(this.startDate, this.endDate);
      });
    });
  }
}

// Componente de calendário de eventos
class EventCalendar {
  constructor(containerId, onEventAdd, onEventSelect) {
    this.container = document.getElementById(containerId);
    this.onEventAdd = onEventAdd;
    this.onEventSelect = onEventSelect;
    this.currentDate = new Date();
    this.events = [];
    this.render();
  }

  render() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    
    let calendarHTML = `
      <div class="event-calendar">
        <div class="calendar-header">
          <button id="prev-month" class="btn btn-sm btn-outline-secondary">&lt;</button>
          <h3>${monthNames[month]} ${year}</h3>
          <button id="next-month" class="btn btn-sm btn-outline-secondary">&gt;</button>
        </div>
        <div class="calendar-body">
          <div class="weekdays">
            <div>Dom</div>
            <div>Seg</div>
            <div>Ter</div>
            <div>Qua</div>
            <div>Qui</div>
            <div>Sex</div>
            <div>Sáb</div>
          </div>
          <div class="days">
    `;
    
    // Preencher dias vazios no início
    for (let i = 0; i < startingDay; i++) {
      calendarHTML += `<div class="day empty"></div>`;
    }
    
    // Preencher os dias do mês
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      
      // Verificar se há eventos neste dia
      const dayEvents = this.events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.getDate() === i && 
               eventDate.getMonth() === month && 
               eventDate.getFullYear() === year;
      });
      
      const hasEvents = dayEvents.length > 0;
      
      calendarHTML += `
        <div class="day ${hasEvents ? 'has-events' : ''}" data-date="${dateStr}">
          <span class="day-number">${i}</span>
          ${hasEvents ? `<div class="event-indicator">${dayEvents.length}</div>` : ''}
        </div>
      `;
    }
    
    calendarHTML += `
          </div>
        </div>
        <div class="calendar-footer">
          <button id="add-event" class="btn btn-primary">Adicionar Evento</button>
        </div>
        <div id="event-form" class="event-form" style="display: none;">
          <h4>Novo Evento</h4>
          <div class="form-group">
            <label for="event-date">Data:</label>
            <input type="date" id="event-date" class="form-control">
          </div>
          <div class="form-group">
            <label for="event-title">Título:</label>
            <input type="text" id="event-title" class="form-control">
          </div>
          <div class="form-group">
            <label for="event-description">Descrição:</label>
            <textarea id="event-description" class="form-control"></textarea>
          </div>
          <div class="form-group">
            <label for="event-type">Tipo:</label>
            <select id="event-type" class="form-control">
              <option value="reforma">Reforma</option>
              <option value="apresentacao">Apresentação</option>
              <option value="manutencao">Manutenção</option>
              <option value="outro">Outro</option>
            </select>
          </div>
          <div class="form-actions">
            <button id="save-event" class="btn btn-success">Salvar</button>
            <button id="cancel-event" class="btn btn-outline-secondary">Cancelar</button>
          </div>
        </div>
        <div id="events-list" class="events-list"></div>
      </div>
    `;
    
    this.container.innerHTML = calendarHTML;
    this.attachEventListeners();
    this.renderEventsList();
  }

  attachEventListeners() {
    const prevMonthBtn = this.container.querySelector('#prev-month');
    const nextMonthBtn = this.container.querySelector('#next-month');
    const addEventBtn = this.container.querySelector('#add-event');
    const saveEventBtn = this.container.querySelector('#save-event');
    const cancelEventBtn = this.container.querySelector('#cancel-event');
    const days = this.container.querySelectorAll('.day:not(.empty)');
    
    prevMonthBtn.addEventListener('click', () => {
      this.currentDate.setMonth(this.currentDate.getMonth() - 1);
      this.render();
    });
    
    nextMonthBtn.addEventListener('click', () => {
      this.currentDate.setMonth(this.currentDate.getMonth() + 1);
      this.render();
    });
    
    addEventBtn.addEventListener('click', () => {
      const eventForm = this.container.querySelector('#event-form');
      eventForm.style.display = 'block';
      
      // Preencher com a data atual
      const today = new Date();
      const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      this.container.querySelector('#event-date').value = dateStr;
    });
    
    saveEventBtn.addEventListener('click', () => {
      const date = this.container.querySelector('#event-date').value;
      const title = this.container.querySelector('#event-title').value;
      const description = this.container.querySelector('#event-description').value;
      const type = this.container.querySelector('#event-type').value;
      
      if (!date || !title) {
        alert('Por favor, preencha a data e o título do evento');
        return;
      }
      
      const newEvent = {
        id: Date.now(), // ID único baseado no timestamp
        date,
        title,
        description,
        type
      };
      
      this.events.push(newEvent);
      
      if (this.onEventAdd) {
        this.onEventAdd(newEvent);
      }
      
      // Esconder o formulário e renderizar novamente
      this.container.querySelector('#event-form').style.display = 'none';
      this.render();
    });
    
    cancelEventBtn.addEventListener('click', () => {
      this.container.querySelector('#event-form').style.display = 'none';
    });
    
    days.forEach(day => {
      day.addEventListener('click', () => {
        const date = day.dataset.date;
        
        // Filtrar eventos para este dia
        const dayEvents = this.events.filter(event => event.date === date);
        
        if (dayEvents.length > 0) {
          // Mostrar eventos deste dia
          this.renderEventsList(dayEvents);
        } else {
          // Pré-preencher o formulário com esta data
          this.container.querySelector('#event-date').value = date;
          this.container.querySelector('#event-form').style.display = 'block';
        }
      });
    });
  }

  renderEventsList(events = null) {
    const eventsToShow = events || this.events;
    const eventsListContainer = this.container.querySelector('#events-list');
    
    if (eventsToShow.length === 0) {
      eventsListContainer.innerHTML = '<p class="no-events">Nenhum evento registrado</p>';
      return;
    }
    
    // Ordenar eventos por data
    eventsToShow.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    let eventsHTML = '<h4>Eventos</h4><ul class="events">';
    
    eventsToShow.forEach(event => {
      const eventDate = new Date(event.date);
      const formattedDate = `${eventDate.getDate().toString().padStart(2, '0')}/${(eventDate.getMonth() + 1).toString().padStart(2, '0')}/${eventDate.getFullYear()}`;
      
      eventsHTML += `
        <li class="event-item" data-id="${event.id}">
          <div class="event-header">
            <span class="event-date">${formattedDate}</span>
            <span class="event-type ${event.type}">${event.type}</span>
          </div>
          <div class="event-title">${event.title}</div>
          <div class="event-description">${event.description || ''}</div>
        </li>
      `;
    });
    
    eventsHTML += '</ul>';
    eventsListContainer.innerHTML = eventsHTML;
    
    // Adicionar listeners para os eventos
    const eventItems = eventsListContainer.querySelectorAll('.event-item');
    eventItems.forEach(item => {
      item.addEventListener('click', () => {
        const eventId = parseInt(item.dataset.id);
        const selectedEvent = this.events.find(e => e.id === eventId);
        
        if (selectedEvent && this.onEventSelect) {
          this.onEventSelect(selectedEvent);
        }
      });
    });
  }

  addEvent(event) {
    this.events.push(event);
    this.render();
  }

  getEvents() {
    return this.events;
  }
}

// Exportar os componentes
window.DateRangePicker = DateRangePicker;
window.EventCalendar = EventCalendar;
