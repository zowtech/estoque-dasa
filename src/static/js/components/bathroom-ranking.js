// Componente de ranking de banheiros
class BathroomRanking {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.options = {
      showSpecificDateFilter: options.showSpecificDateFilter !== undefined ? options.showSpecificDateFilter : false,
      addExpandIndicator: options.addExpandIndicator !== undefined ? options.addExpandIndicator : true
    };
    
    this.init();
  }
  
  init() {
    this.renderRanking();
    this.setupEventListeners();
  }
  
  renderRanking() {
    // Estrutura principal do ranking
    let rankingHtml = `
      <div class="bathroom-ranking">
        <!-- Filtros -->
        <div class="ranking-filters mb-4">
          <div class="row g-3">
            <div class="col-md-6">
              <div class="input-group">
                <span class="input-group-text"><i class="fas fa-calendar"></i></span>
                <select class="form-select" id="ranking-period">
                  <option value="7">Últimos 7 dias</option>
                  <option value="30" selected>Últimos 30 dias</option>
                  <option value="90">Últimos 90 dias</option>
                  <option value="365">Último ano</option>
                </select>
              </div>
            </div>
    `;
    
    // Adicionar filtro de data específica apenas se a opção estiver habilitada
    if (this.options.showSpecificDateFilter) {
      rankingHtml += `
            <div class="col-md-6">
              <div class="input-group">
                <span class="input-group-text"><i class="fas fa-calendar-day"></i></span>
                <input type="date" class="form-control" id="ranking-specific-date">
                <button class="btn btn-outline-primary" type="button" id="apply-specific-date">Aplicar</button>
              </div>
            </div>
      `;
    }
    
    rankingHtml += `
          </div>
        </div>
        
        <!-- Ranking de Banheiros -->
        <div class="row">
          <!-- Banheiros Masculinos -->
          <div class="col-md-6 mb-4">
            <div class="card ranking-card ranking-male">
              <div class="card-header text-white bg-primary">
                <h5 class="mb-0">RANK BANHEIROS - MASCULINO</h5>
              </div>
              <div class="card-body p-0">
                <div class="ranking-header d-flex p-3 border-bottom">
                  <div class="ranking-header-location flex-grow-1">
                    <strong>Localização</strong>
                  </div>
                  <div class="ranking-header-value text-end" style="width: 100px;">
                    <strong>Entrada</strong>
                  </div>
                </div>
                <ul class="list-group list-group-flush ranking-list">
                  <li class="list-group-item d-flex align-items-center ranking-item" data-rank="1" data-gender="male" data-floor="5">
                    <div class="ranking-position me-3">1.</div>
                    <div class="ranking-info flex-grow-1">
                      <div class="ranking-title">Base Dasa Wtorre - Andar 5 - Masculino</div>
                      ${this.options.addExpandIndicator ? '<div class="ranking-expand-indicator"><i class="fas fa-chevron-down"></i> Ver produtos mais consumidos</div>' : ''}
                      <div class="ranking-details mt-2 d-none">
                        <div class="ranking-products">
                          <div class="ranking-product-item">
                            <span class="ranking-product-position">1.</span>
                            <span class="ranking-product-name">Papel Higiênico</span>
                            <span class="ranking-product-value">85 unidades</span>
                          </div>
                          <div class="ranking-product-item">
                            <span class="ranking-product-position">2.</span>
                            <span class="ranking-product-name">Papel Toalha</span>
                            <span class="ranking-product-value">62 pacotes</span>
                          </div>
                          <div class="ranking-product-item">
                            <span class="ranking-product-position">3.</span>
                            <span class="ranking-product-name">Sabonete Líquido</span>
                            <span class="ranking-product-value">23 litros</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="ranking-value text-end" style="width: 100px;">
                      <strong>170</strong>
                    </div>
                  </li>
                  <li class="list-group-item d-flex align-items-center ranking-item" data-rank="2" data-gender="male" data-floor="3">
                    <div class="ranking-position me-3">2.</div>
                    <div class="ranking-info flex-grow-1">
                      <div class="ranking-title">Base Dasa Wtorre - Andar 3 - Masculino</div>
                      ${this.options.addExpandIndicator ? '<div class="ranking-expand-indicator"><i class="fas fa-chevron-down"></i> Ver produtos mais consumidos</div>' : ''}
                      <div class="ranking-details mt-2 d-none">
                        <div class="ranking-products">
                          <div class="ranking-product-item">
                            <span class="ranking-product-position">1.</span>
                            <span class="ranking-product-name">Papel Higiênico</span>
                            <span class="ranking-product-value">58 unidades</span>
                          </div>
                          <div class="ranking-product-item">
                            <span class="ranking-product-position">2.</span>
                            <span class="ranking-product-name">Papel Toalha</span>
                            <span class="ranking-product-value">42 pacotes</span>
                          </div>
                          <div class="ranking-product-item">
                            <span class="ranking-product-position">3.</span>
                            <span class="ranking-product-name">Sabonete Líquido</span>
                            <span class="ranking-product-value">16 litros</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="ranking-value text-end" style="width: 100px;">
                      <strong>116</strong>
                    </div>
                  </li>
                  <li class="list-group-item d-flex align-items-center ranking-item" data-rank="3" data-gender="male" data-floor="2">
                    <div class="ranking-position me-3">3.</div>
                    <div class="ranking-info flex-grow-1">
                      <div class="ranking-title">Base Dasa Wtorre - Andar 2 - Masculino</div>
                      ${this.options.addExpandIndicator ? '<div class="ranking-expand-indicator"><i class="fas fa-chevron-down"></i> Ver produtos mais consumidos</div>' : ''}
                      <div class="ranking-details mt-2 d-none">
                        <div class="ranking-products">
                          <div class="ranking-product-item">
                            <span class="ranking-product-position">1.</span>
                            <span class="ranking-product-name">Papel Higiênico</span>
                            <span class="ranking-product-value">42 unidades</span>
                          </div>
                          <div class="ranking-product-item">
                            <span class="ranking-product-position">2.</span>
                            <span class="ranking-product-name">Papel Toalha</span>
                            <span class="ranking-product-value">28 pacotes</span>
                          </div>
                          <div class="ranking-product-item">
                            <span class="ranking-product-position">3.</span>
                            <span class="ranking-product-name">Sabonete Líquido</span>
                            <span class="ranking-product-value">13 litros</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="ranking-value text-end" style="width: 100px;">
                      <strong>83</strong>
                    </div>
                  </li>
                  <li class="list-group-item d-flex align-items-center ranking-item" data-rank="4" data-gender="male" data-floor="1">
                    <div class="ranking-position me-3">4.</div>
                    <div class="ranking-info flex-grow-1">
                      <div class="ranking-title">Base Dasa Wtorre - Andar 1 - Masculino</div>
                      ${this.options.addExpandIndicator ? '<div class="ranking-expand-indicator"><i class="fas fa-chevron-down"></i> Ver produtos mais consumidos</div>' : ''}
                      <div class="ranking-details mt-2 d-none">
                        <div class="ranking-products">
                          <div class="ranking-product-item">
                            <span class="ranking-product-position">1.</span>
                            <span class="ranking-product-name">Papel Higiênico</span>
                            <span class="ranking-product-value">15 unidades</span>
                          </div>
                          <div class="ranking-product-item">
                            <span class="ranking-product-position">2.</span>
                            <span class="ranking-product-name">Papel Toalha</span>
                            <span class="ranking-product-value">10 pacotes</span>
                          </div>
                          <div class="ranking-product-item">
                            <span class="ranking-product-position">3.</span>
                            <span class="ranking-product-name">Sabonete Líquido</span>
                            <span class="ranking-product-value">6 litros</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="ranking-value text-end" style="width: 100px;">
                      <strong>31</strong>
                    </div>
                  </li>
                  <li class="list-group-item d-flex align-items-center ranking-item" data-rank="5" data-gender="male" data-floor="4">
                    <div class="ranking-position me-3">5.</div>
                    <div class="ranking-info flex-grow-1">
                      <div class="ranking-title">Base Dasa Wtorre - Andar 4 - Masculino</div>
                      ${this.options.addExpandIndicator ? '<div class="ranking-expand-indicator"><i class="fas fa-chevron-down"></i> Ver produtos mais consumidos</div>' : ''}
                      <div class="ranking-details mt-2 d-none">
                        <div class="ranking-products">
                          <div class="ranking-product-item">
                            <span class="ranking-product-position">1.</span>
                            <span class="ranking-product-name">Papel Higiênico</span>
                            <span class="ranking-product-value">14 unidades</span>
                          </div>
                          <div class="ranking-product-item">
                            <span class="ranking-product-position">2.</span>
                            <span class="ranking-product-name">Papel Toalha</span>
                            <span class="ranking-product-value">9 pacotes</span>
                          </div>
                          <div class="ranking-product-item">
                            <span class="ranking-product-position">3.</span>
                            <span class="ranking-product-name">Sabonete Líquido</span>
                            <span class="ranking-product-value">5 litros</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="ranking-value text-end" style="width: 100px;">
                      <strong>28</strong>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <!-- Banheiros Femininos -->
          <div class="col-md-6 mb-4">
            <div class="card ranking-card ranking-female">
              <div class="card-header text-white" style="background-color: #e83e8c;">
                <h5 class="mb-0">RANK BANHEIROS - FEMININO</h5>
              </div>
              <div class="card-body p-0">
                <div class="ranking-header d-flex p-3 border-bottom">
                  <div class="ranking-header-location flex-grow-1">
                    <strong>Localização</strong>
                  </div>
                  <div class="ranking-header-value text-end" style="width: 100px;">
                    <strong>Entrada</strong>
                  </div>
                </div>
                <ul class="list-group list-group-flush ranking-list">
                  <li class="list-group-item d-flex align-items-center ranking-item" data-rank="1" data-gender="female" data-floor="3">
                    <div class="ranking-position me-3">1.</div>
                    <div class="ranking-info flex-grow-1">
                      <div class="ranking-title">Base Dasa Wtorre - Andar 3 - Feminino</div>
                      ${this.options.addExpandIndicator ? '<div class="ranking-expand-indicator"><i class="fas fa-chevron-down"></i> Ver produtos mais consumidos</div>' : ''}
                      <div class="ranking-details mt-2 d-none">
                        <div class="ranking-products">
                          <div class="ranking-product-item">
                            <span class="ranking-product-position">1.</span>
                            <span class="ranking-product-name">Papel Higiênico</span>
                            <span class="ranking-product-value">98 unidades</span>
                          </div>
                          <div class="ranking-product-item">
                            <span class="ranking-product-position">2.</span>
                            <span class="ranking-product-name">Papel Toalha</span>
                            <span class="ranking-product-value">65 pacotes</span>
                          </div>
                          <div class="ranking-product-item">
                            <span class="ranking-product-position">3.</span>
                            <span class="ranking-product-name">Sabonete Líquido</span>
                            <span class="ranking-product-value">31 litros</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="ranking-value text-end" style="width: 100px;">
                      <strong>194</strong>
                    </div>
                  </li>
                  <li class="list-group-item d-flex align-items-center ranking-item" data-rank="2" data-gender="female" data-floor="5">
                    <div class="ranking-position me-3">2.</div>
                    <div class="ranking-info flex-grow-1">
                      <div class="ranking-title">Base Dasa Wtorre - Andar 5 - Feminino</div>
                      ${this.options.addExpandIndicator ? '<div class="ranking-expand-indicator"><i class="fas fa-chevron-down"></i> Ver produtos mais consumidos</div>' : ''}
                      <div class="ranking-details mt-2 d-none">
                        <div class="ranking-products">
                          <div class="ranking-product-item">
                            <span class="ranking-product-position">1.</span>
                            <span class="ranking-product-name">Papel Higiênico</span>
                            <span class="ranking-product-value">92 unidades</span>
                          </div>
                          <div class="ranking-product-item">
                            <span class="ranking-product-position">2.</span>
                            <span class="ranking-product-name">Papel Toalha</span>
                            <span class="ranking-product-value">63 pacotes</span>
                          </div>
                          <div class="ranking-product-item">
                            <span class="ranking-product-position">3.</span>
                            <span class="ranking-product-name">Sabonete Líquido</span>
                            <span class="ranking-product-value">31 litros</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="ranking-value text-end" style="width: 100px;">
                      <strong>186</strong>
                    </div>
                  </li>
                  <li class="list-group-item d-flex align-items-center ranking-item" data-rank="3" data-gender="female" data-floor="1">
                    <div class="ranking-position me-3">3.</div>
                    <div class="ranking-info flex-grow-1">
                      <div class="ranking-title">Base Dasa Wtorre - Andar 1 - Feminino</div>
                      ${this.options.addExpandIndicator ? '<div class="ranking-expand-indicator"><i class="fas fa-chevron-down"></i> Ver produtos mais consumidos</div>' : ''}
                      <div class="ranking-details mt-2 d-none">
                        <div class="ranking-products">
                          <div class="ranking-product-item">
                            <span class="ranking-product-position">1.</span>
                            <span class="ranking-product-name">Papel Higiênico</span>
                            <span class="ranking-product-value">65 unidades</span>
                          </div>
                          <div class="ranking-product-item">
                            <span class="ranking-product-position">2.</span>
                            <span class="ranking-product-name">Papel Toalha</span>
                            <span class="ranking-product-value">42 pacotes</span>
                          </div>
                          <div class="ranking-product-item">
                            <span class="ranking-product-position">3.</span>
                            <span class="ranking-product-name">Sabonete Líquido</span>
                            <span class="ranking-product-value">22 litros</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="ranking-value text-end" style="width: 100px;">
                      <strong>129</strong>
                    </div>
                  </li>
                  <li class="list-group-item d-flex align-items-center ranking-item" data-rank="4" data-gender="female" data-floor="2">
                    <div class="ranking-position me-3">4.</div>
                    <div class="ranking-info flex-grow-1">
                      <div class="ranking-title">Base Dasa Wtorre - Andar 2 - Feminino</div>
                      ${this.options.addExpandIndicator ? '<div class="ranking-expand-indicator"><i class="fas fa-chevron-down"></i> Ver produtos mais consumidos</div>' : ''}
                      <div class="ranking-details mt-2 d-none">
                        <div class="ranking-products">
                          <div class="ranking-product-item">
                            <span class="ranking-product-position">1.</span>
                            <span class="ranking-product-name">Papel Higiênico</span>
                            <span class="ranking-product-value">48 unidades</span>
                          </div>
                          <div class="ranking-product-item">
                            <span class="ranking-product-position">2.</span>
                            <span class="ranking-product-name">Papel Toalha</span>
                            <span class="ranking-product-value">30 pacotes</span>
                          </div>
                          <div class="ranking-product-item">
                            <span class="ranking-product-position">3.</span>
                            <span class="ranking-product-name">Sabonete Líquido</span>
                            <span class="ranking-product-value">16 litros</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="ranking-value text-end" style="width: 100px;">
                      <strong>94</strong>
                    </div>
                  </li>
                  <li class="list-group-item d-flex align-items-center ranking-item" data-rank="5" data-gender="female" data-floor="4">
                    <div class="ranking-position me-3">5.</div>
                    <div class="ranking-info flex-grow-1">
                      <div class="ranking-title">Base Dasa Wtorre - Andar 4 - Feminino</div>
                      ${this.options.addExpandIndicator ? '<div class="ranking-expand-indicator"><i class="fas fa-chevron-down"></i> Ver produtos mais consumidos</div>' : ''}
                      <div class="ranking-details mt-2 d-none">
                        <div class="ranking-products">
                          <div class="ranking-product-item">
                            <span class="ranking-product-position">1.</span>
                            <span class="ranking-product-name">Papel Higiênico</span>
                            <span class="ranking-product-value">45 unidades</span>
                          </div>
                          <div class="ranking-product-item">
                            <span class="ranking-product-position">2.</span>
                            <span class="ranking-product-name">Papel Toalha</span>
                            <span class="ranking-product-value">28 pacotes</span>
                          </div>
                          <div class="ranking-product-item">
                            <span class="ranking-product-position">3.</span>
                            <span class="ranking-product-name">Sabonete Líquido</span>
                            <span class="ranking-product-value">15 litros</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="ranking-value text-end" style="width: 100px;">
                      <strong>88</strong>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    this.container.innerHTML = rankingHtml;
    
    // Adicionar estilos
    this.addStyles();
  }
  
  addStyles() {
    const styleId = 'bathroom-ranking-styles';
    if (!document.getElementById(styleId)) {
      const styleElement = document.createElement('style');
      styleElement.id = styleId;
      styleElement.textContent = `
        .bathroom-ranking {
          margin-bottom: 30px;
        }
        
        .ranking-card {
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          border: none;
          border-radius: 10px;
          overflow: hidden;
        }
        
        .ranking-card .card-header {
          padding: 15px 20px;
          font-weight: 600;
        }
        
        .ranking-male .card-header {
          background-color: #3498db;
        }
        
        .ranking-female .card-header {
          background-color: #e83e8c;
        }
        
        .ranking-item {
          padding: 15px;
          border-left: none;
          border-right: none;
          transition: background-color 0.2s;
        }
        
        .ranking-item:hover {
          background-color: rgba(0, 0, 0, 0.03);
        }
        
        .ranking-position {
          font-weight: 600;
          font-size: 1.1rem;
          width: 30px;
        }
        
        .ranking-title {
          font-weight: 500;
        }
        
        .ranking-value {
          font-size: 1.1rem;
        }
        
        .ranking-expand-indicator {
          font-size: 0.85rem;
          color: #6c757d;
          margin-top: 5px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
        }
        
        .ranking-expand-indicator i {
          margin-right: 5px;
          transition: transform 0.2s;
        }
        
        .ranking-item.expanded .ranking-expand-indicator i {
          transform: rotate(180deg);
        }
        
        .ranking-products {
          background-color: #f8f9fa;
          border-radius: 5px;
          padding: 10px;
        }
        
        .ranking-product-item {
          display: flex;
          align-items: center;
          padding: 5px 0;
          border-bottom: 1px solid #e9ecef;
        }
        
        .ranking-product-item:last-child {
          border-bottom: none;
        }
        
        .ranking-product-position {
          font-weight: 600;
          margin-right: 10px;
          width: 20px;
        }
        
        .ranking-product-name {
          flex-grow: 1;
        }
        
        .ranking-product-value {
          font-weight: 500;
          margin-left: 10px;
        }
        
        @media (max-width: 768px) {
          .ranking-header, .ranking-item {
            padding: 10px;
          }
          
          .ranking-title {
            font-size: 0.9rem;
          }
          
          .ranking-value {
            font-size: 1rem;
          }
        }
      `;
      
      document.head.appendChild(styleElement);
    }
  }
  
  setupEventListeners() {
    // Expandir/colapsar detalhes de produtos
    const rankingItems = this.container.querySelectorAll('.ranking-item');
    rankingItems.forEach(item => {
      const expandIndicator = item.querySelector('.ranking-expand-indicator');
      if (expandIndicator) {
        expandIndicator.addEventListener('click', () => {
          const details = item.querySelector('.ranking-details');
          if (details) {
            details.classList.toggle('d-none');
            item.classList.toggle('expanded');
          }
        });
      }
    });
    
    // Filtro de período
    const periodSelect = this.container.querySelector('#ranking-period');
    if (periodSelect) {
      periodSelect.addEventListener('change', () => {
        // Simulação de atualização de dados com base no período selecionado
        console.log(`Período selecionado: ${periodSelect.value} dias`);
        // Aqui você implementaria a lógica para atualizar os dados com base no período
      });
    }
    
    // Filtro de data específica (se habilitado)
    if (this.options.showSpecificDateFilter) {
      const applySpecificDateBtn = this.container.querySelector('#apply-specific-date');
      if (applySpecificDateBtn) {
        applySpecificDateBtn.addEventListener('click', () => {
          const specificDate = this.container.querySelector('#ranking-specific-date').value;
          if (specificDate) {
            console.log(`Data específica selecionada: ${specificDate}`);
            // Aqui você implementaria a lógica para atualizar os dados com base na data específica
          } else {
            alert('Por favor, selecione uma data.');
          }
        });
      }
    }
  }
}

// Exportar o componente
window.BathroomRanking = BathroomRanking;
