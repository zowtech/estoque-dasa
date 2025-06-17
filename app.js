// Arquivo principal de JavaScript para o Sistema de Controle de Estoque

document.addEventListener("DOMContentLoaded", function () {
  // Toggle sidebar em dispositivos móveis
  const toggleButton = document.getElementById("toggle-sidebar");
  const sidebar = document.querySelector(".sidebar");
  const content = document.querySelector(".content");

  if (toggleButton && sidebar && content) {
    toggleButton.addEventListener("click", function () {
      sidebar.classList.toggle("active");
      content.classList.toggle("active");
    });
  }

  // Ativar tab ao clicar no menu e inicializar componentes
  const menuLinks = document.querySelectorAll(".sidebar-menu a");
  const tabPanes = document.querySelectorAll(".tab-pane");
  const componentInitializers = {}; // Armazena inicializadores para evitar re-inicialização

  menuLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault(); // Prevenir comportamento padrão do link

      // Remover classe active de todos os itens do menu
      document.querySelectorAll(".sidebar-menu li").forEach(function (item) {
        item.classList.remove("active");
      });

      // Adicionar classe active ao item clicado
      this.parentElement.classList.add("active");

      // Esconder todas as abas
      tabPanes.forEach(function (pane) {
        pane.classList.remove("show", "active");
      });

      // Mostrar a aba correspondente
      const targetTabId = this.getAttribute("href");
      const targetTab = document.querySelector(targetTabId);
      if (targetTab) {
        targetTab.classList.add("show", "active");

        // Inicializar componente da aba se ainda não foi inicializado
        initializeComponentForTab(targetTabId.substring(1)); // Remove #
      }

      // Fechar sidebar em mobile após clicar
      if (window.innerWidth <= 768 && sidebar.classList.contains("active")) {
        sidebar.classList.remove("active");
        content.classList.remove("active");
      }
    });
  });

  // Função para inicializar componentes sob demanda
  function initializeComponentForTab(tabId) {
    if (componentInitializers[tabId]) {
      // Já inicializado ou inicializando
      return;
    }

    console.log(`Inicializando componente para a aba: ${tabId}`);
    componentInitializers[tabId] = true; // Marcar como inicializando

    try {
      switch (tabId) {
        case "dashboard":
          // Componentes do dashboard já são inicializados no HTML/JS inicial
          // Mas podemos re-inicializar ou atualizar se necessário
          if (typeof BathroomRanking !== "undefined") {
            new BathroomRanking("bathroom-ranking-container", {
              showSpecificDateFilter: false, // Remover filtro de data específica
              addExpandIndicator: true, // Adicionar indicador de expansão
            });
          }
          // Re-inicializar gráficos simples se necessário
          initializeDashboardCharts();
          break;
        case "ranking":
          if (typeof BathroomRanking !== "undefined") {
            new BathroomRanking("ranking-container", {
              showSpecificDateFilter: false, // Remover filtro de data específica
              addExpandIndicator: true, // Adicionar indicador de expansão
            });
          }
          break;
        case "consumo":
          if (typeof ConsumptionAnalysis !== "undefined") {
            new ConsumptionAnalysis("consumption-analysis-container");
          }
          break;
        case "desperdicio":
          // O conteúdo de desperdício foi movido para o HTML estático por enquanto
          // Se precisar de lógica dinâmica, inicializar aqui
          initializeWasteAnalysisChart(); // Inicializar gráfico se necessário
          break;
        case "estoque":
          if (typeof InventoryManagement !== "undefined") {
            new InventoryManagement("inventory-management-container");
          }
          break;
        case "eventos":
          // Lógica de eventos (se houver JS específico)
          break;
        case "relatorios":
          if (typeof ReportGenerator !== "undefined") {
            new ReportGenerator("report-generator-container");
          }
          break;
        default:
          console.warn(`Nenhum inicializador definido para a aba: ${tabId}`);
          componentInitializers[tabId] = false; // Resetar se não houver inicializador
      }
    } catch (error) {
      console.error(`Erro ao inicializar componente para a aba ${tabId}:`, error);
      componentInitializers[tabId] = false; // Permitir nova tentativa em caso de erro
    }
  }

  // Função para inicializar gráficos do dashboard (se movidos para cá)
  function initializeDashboardCharts() {
    const consumoAndarContainer = document.getElementById("consumo-andar-chart-container");
    if (consumoAndarContainer && !consumoAndarContainer.querySelector("canvas")) {
      const consumoAndarCtx = document.createElement("canvas");
      consumoAndarCtx.id = "consumo-andar-chart";
      consumoAndarContainer.appendChild(consumoAndarCtx);
      new Chart(consumoAndarCtx, {
        type: "bar",
        data: {
          labels: ["Andar 5", "Andar 3", "Andar 4", "Andar 2", "Andar 1"],
          datasets: [
            {
              label: "Consumo Total",
              data: [356, 310, 245, 177, 160],
              backgroundColor: [
                "rgba(231, 76, 60, 0.7)",
                "rgba(46, 204, 113, 0.7)",
                "rgba(241, 196, 15, 0.7)",
                "rgba(155, 89, 182, 0.7)",
                "rgba(52, 152, 219, 0.7)",
              ],
              borderColor: [
                "rgba(231, 76, 60, 1)",
                "rgba(46, 204, 113, 1)",
                "rgba(241, 196, 15, 1)",
                "rgba(155, 89, 182, 1)",
                "rgba(52, 152, 219, 1)",
              ],
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
    }

    const consumoProdutoContainer = document.getElementById("consumo-produto-chart-container");
    if (consumoProdutoContainer && !consumoProdutoContainer.querySelector("canvas")) {
      const consumoProdutoCtx = document.createElement("canvas");
      consumoProdutoCtx.id = "consumo-produto-chart";
      consumoProdutoContainer.appendChild(consumoProdutoCtx);
      new Chart(consumoProdutoCtx, {
        type: "pie",
        data: {
          labels: [
            "Papel Higiênico",
            "Sabonete Líquido",
            "Papel Toalha",
            "Álcool em Gel",
            "Desinfetante",
          ],
          datasets: [
            {
              data: [580, 320, 240, 80, 28],
              backgroundColor: [
                "rgba(52, 152, 219, 0.7)",
                "rgba(46, 204, 113, 0.7)",
                "rgba(241, 196, 15, 0.7)",
                "rgba(155, 89, 182, 0.7)",
                "rgba(231, 76, 60, 0.7)",
              ],
              borderColor: [
                "rgba(52, 152, 219, 1)",
                "rgba(46, 204, 113, 1)",
                "rgba(241, 196, 15, 1)",
                "rgba(155, 89, 182, 1)",
                "rgba(231, 76, 60, 1)",
              ],
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
  }

  // Função para inicializar gráfico de desperdício (se necessário)
  function initializeWasteAnalysisChart() {
    const wasteChartContainer = document.getElementById("waste-chart");
    if (wasteChartContainer && !Chart.getChart(wasteChartContainer)) {
      new Chart(wasteChartContainer, {
        type: "bar",
        data: {
          labels: ["Andar 5", "Andar 3", "Andar 4", "Andar 2", "Andar 1"],
          datasets: [
            {
              label: "Índice de Desperdício (%)",
              data: [15.2, 12.8, 10.3, 9.7, 8.5],
              backgroundColor: [
                "rgba(231, 76, 60, 0.7)",
                "rgba(46, 204, 113, 0.7)",
                "rgba(241, 196, 15, 0.7)",
                "rgba(155, 89, 182, 0.7)",
                "rgba(52, 152, 219, 0.7)",
              ],
              borderColor: [
                "rgba(231, 76, 60, 1)",
                "rgba(46, 204, 113, 1)",
                "rgba(241, 196, 15, 1)",
                "rgba(155, 89, 182, 1)",
                "rgba(52, 152, 219, 1)",
              ],
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
    }
  }

  // Inicializar a aba ativa ao carregar a página (Dashboard por padrão)
  initializeComponentForTab("dashboard");
});
