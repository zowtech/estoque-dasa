// Componente de calendário funcional para eventos
class CalendarioEventos {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.eventService = new EventService();
        this.currentDate = new Date();
        this.selectedDate = null;
        this.eventos = [];
        this.init();
    }

    init() {
        this.createCalendarHTML();
        this.loadEventos();
        this.bindEvents();
    }

    createCalendarHTML() {
        this.container.innerHTML = `
            <div class="calendario-container">
                <div class="calendario-header">
                    <button class="btn-nav" id="prevMonth">&lt;</button>
                    <h3 id="currentMonth">${this.getMonthYearString()}</h3>
                    <button class="btn-nav" id="nextMonth">&gt;</button>
                </div>
                <div class="calendario-grid">
                    <div class="dia-semana">Dom</div>
                    <div class="dia-semana">Seg</div>
                    <div class="dia-semana">Ter</div>
                    <div class="dia-semana">Qua</div>
                    <div class="dia-semana">Qui</div>
                    <div class="dia-semana">Sex</div>
                    <div class="dia-semana">Sáb</div>
                    <div id="calendario-dias"></div>
                </div>
                <div class="evento-form" id="eventoForm" style="display: none;">
                    <h4>Novo Evento</h4>
                    <form id="formEvento">
                        <div class="form-group">
                            <label>Título:</label>
                            <input type="text" id="eventoTitulo" required>
                        </div>
                        <div class="form-group">
                            <label>Descrição:</label>
                            <textarea id="eventoDescricao"></textarea>
                        </div>
                        <div class="form-group">
                            <label>Data:</label>
                            <input type="date" id="eventoData" required>
                        </div>
                        <div class="form-group">
                            <label>Hora:</label>
                            <input type="time" id="eventoHora" required>
                        </div>
                        <div class="form-group">
                            <label>Tipo:</label>
                            <select id="eventoTipo">
                                <option value="Manutenção">Manutenção</option>
                                <option value="Reposição">Reposição</option>
                                <option value="Limpeza">Limpeza</option>
                                <option value="Inspeção">Inspeção</option>
                                <option value="Outro">Outro</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Prioridade:</label>
                            <select id="eventoPrioridade">
                                <option value="Baixa">Baixa</option>
                                <option value="Normal">Normal</option>
                                <option value="Alta">Alta</option>
                                <option value="Crítica">Crítica</option>
                            </select>
                        </div>
                        <div class="form-buttons">
                            <button type="submit" class="btn btn-primary">Salvar</button>
                            <button type="button" class="btn btn-secondary" id="cancelarEvento">Cancelar</button>
                        </div>
                    </form>
                </div>
                <div class="eventos-lista" id="eventosLista">
                    <h4>Eventos do Dia</h4>
                    <div id="eventosContainer"></div>
                </div>
            </div>
        `;
    }

    bindEvents() {
        // Navegação do calendário
        document.getElementById('prevMonth').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.updateCalendar();
        });

        document.getElementById('nextMonth').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.updateCalendar();
        });

        // Formulário de evento
        document.getElementById('formEvento').addEventListener('submit', (e) => {
            e.preventDefault();
            this.salvarEvento();
        });

        document.getElementById('cancelarEvento').addEventListener('click', () => {
            this.hideEventForm();
        });
    }

    updateCalendar() {
        document.getElementById('currentMonth').textContent = this.getMonthYearString();
        this.renderCalendarDays();
    }

    renderCalendarDays() {
        const diasContainer = document.getElementById('calendario-dias');
        diasContainer.innerHTML = '';

        const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        for (let i = 0; i < 42; i++) {
            const currentDay = new Date(startDate);
            currentDay.setDate(startDate.getDate() + i);

            const dayElement = document.createElement('div');
            dayElement.className = 'calendario-dia';
            dayElement.textContent = currentDay.getDate();

            // Adiciona classes para dias do mês atual
            if (currentDay.getMonth() === this.currentDate.getMonth()) {
                dayElement.classList.add('mes-atual');
            }

            // Adiciona classe para hoje
            const hoje = new Date();
            if (currentDay.toDateString() === hoje.toDateString()) {
                dayElement.classList.add('hoje');
            }

            // Verifica se há eventos neste dia
            const eventosNoDia = this.getEventosNoDia(currentDay);
            if (eventosNoDia.length > 0) {
                dayElement.classList.add('tem-evento');
                dayElement.title = `${eventosNoDia.length} evento(s)`;
            }

            // Adiciona evento de clique
            dayElement.addEventListener('click', () => {
                this.selectDate(currentDay);
            });

            diasContainer.appendChild(dayElement);
        }
    }

    selectDate(date) {
        // Remove seleção anterior
        document.querySelectorAll('.calendario-dia.selecionado').forEach(el => {
            el.classList.remove('selecionado');
        });

        // Adiciona seleção atual
        event.target.classList.add('selecionado');
        this.selectedDate = date;

        // Mostra eventos do dia
        this.showEventosNoDia(date);

        // Preenche data no formulário
        document.getElementById('eventoData').value = date.toISOString().split('T')[0];
    }

    showEventosNoDia(date) {
        const eventosNoDia = this.getEventosNoDia(date);
        const container = document.getElementById('eventosContainer');

        if (eventosNoDia.length === 0) {
            container.innerHTML = `
                <p>Nenhum evento neste dia.</p>
                <button class="btn btn-primary btn-sm" onclick="calendario.showEventForm()">
                    Adicionar Evento
                </button>
            `;
        } else {
            container.innerHTML = eventosNoDia.map(evento => `
                <div class="evento-item prioridade-${evento.prioridade.toLowerCase()}">
                    <div class="evento-titulo">${evento.titulo}</div>
                    <div class="evento-hora">${this.formatTime(evento.data_evento)}</div>
                    <div class="evento-tipo">${evento.tipo}</div>
                    <div class="evento-actions">
                        <button class="btn btn-sm btn-secondary" onclick="calendario.editarEvento(${evento.id})">
                            Editar
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="calendario.excluirEvento(${evento.id})">
                            Excluir
                        </button>
                    </div>
                </div>
            `).join('') + `
                <button class="btn btn-primary btn-sm mt-2" onclick="calendario.showEventForm()">
                    Adicionar Evento
                </button>
            `;
        }
    }

    getEventosNoDia(date) {
        return this.eventos.filter(evento => {
            const eventoDate = new Date(evento.data_evento);
            return eventoDate.toDateString() === date.toDateString();
        });
    }

    showEventForm() {
        document.getElementById('eventoForm').style.display = 'block';
        if (this.selectedDate) {
            document.getElementById('eventoData').value = this.selectedDate.toISOString().split('T')[0];
        }
    }

    hideEventForm() {
        document.getElementById('eventoForm').style.display = 'none';
        document.getElementById('formEvento').reset();
    }

    async salvarEvento() {
        try {
            const formData = {
                titulo: document.getElementById('eventoTitulo').value,
                descricao: document.getElementById('eventoDescricao').value,
                data_evento: document.getElementById('eventoData').value + 'T' + document.getElementById('eventoHora').value,
                tipo: document.getElementById('eventoTipo').value,
                prioridade: document.getElementById('eventoPrioridade').value,
                status: 'Pendente'
            };

            const response = await this.eventService.createEvent(formData);
            
            if (response) {
                alert('Evento criado com sucesso!');
                this.hideEventForm();
                this.loadEventos(); // Recarrega eventos
            }
        } catch (error) {
            alert('Erro ao criar evento: ' + error.message);
        }
    }

    async editarEvento(id) {
        try {
            const evento = await this.eventService.getEventById(id);
            
            // Preenche formulário com dados do evento
            document.getElementById('eventoTitulo').value = evento.titulo;
            document.getElementById('eventoDescricao').value = evento.descricao;
            
            const dataEvento = new Date(evento.data_evento);
            document.getElementById('eventoData').value = dataEvento.toISOString().split('T')[0];
            document.getElementById('eventoHora').value = dataEvento.toTimeString().split(' ')[0].substring(0, 5);
            document.getElementById('eventoTipo').value = evento.tipo;
            document.getElementById('eventoPrioridade').value = evento.prioridade;
            
            this.showEventForm();
            
            // Modifica o formulário para edição
            document.getElementById('formEvento').onsubmit = async (e) => {
                e.preventDefault();
                await this.atualizarEvento(id);
            };
        } catch (error) {
            alert('Erro ao carregar evento: ' + error.message);
        }
    }

    async atualizarEvento(id) {
        try {
            const formData = {
                titulo: document.getElementById('eventoTitulo').value,
                descricao: document.getElementById('eventoDescricao').value,
                data_evento: document.getElementById('eventoData').value + 'T' + document.getElementById('eventoHora').value,
                tipo: document.getElementById('eventoTipo').value,
                prioridade: document.getElementById('eventoPrioridade').value
            };

            await this.eventService.updateEvent(id, formData);
            alert('Evento atualizado com sucesso!');
            this.hideEventForm();
            this.loadEventos();
            
            // Restaura o formulário para criação
            document.getElementById('formEvento').onsubmit = (e) => {
                e.preventDefault();
                this.salvarEvento();
            };
        } catch (error) {
            alert('Erro ao atualizar evento: ' + error.message);
        }
    }

    async excluirEvento(id) {
        if (confirm('Tem certeza que deseja excluir este evento?')) {
            try {
                await this.eventService.deleteEvent(id);
                alert('Evento excluído com sucesso!');
                this.loadEventos();
            } catch (error) {
                alert('Erro ao excluir evento: ' + error.message);
            }
        }
    }

    async loadEventos() {
        try {
            this.eventos = await this.eventService.getAllEvents();
            this.updateCalendar();
        } catch (error) {
            console.error('Erro ao carregar eventos:', error);
        }
    }

    getMonthYearString() {
        const meses = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];
        return `${meses[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
    }

    formatTime(dateString) {
        const date = new Date(dateString);
        return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    }
}

// Instância global do calendário
let calendario;

