window.onload = Inicializar();

let graficoEjercicio;

$("#TipoEjercicioID, #MesEjercicioBuscar, #AnioEjercicioBuscar").change(function () {
    // Si el gráfico ya existe, destrúyelo
    if (graficoEjercicio) {
        graficoEjercicio.destroy();
    }
    if (graficoTipoEjercicio) {
        graficoTipoEjercicio.destroy();
    }
    GraficoLinea();
    GraficoTorta();
});

function GraficoLinea() {
    let tipoEjercicioID = document.getElementById("TipoEjercicioID").value;
    let mesEjercicioBuscar = document.getElementById("MesEjercicioBuscar").value;
    let anioEjercicioBuscar = document.getElementById("AnioEjercicioBuscar").value;

    $("#grafico").before("<p id='loading'>Cargando gráfico...</p>");

    $.ajax({
        url: '../../Home/GraficoTipoEjercicioMes',
        data: { TipoEjercicioID: tipoEjercicioID, Mes: mesEjercicioBuscar, Anio: anioEjercicioBuscar },
        type: 'POST',
        dataType: 'json',
        success: function (ejerciciosPorDias) {
            let labels = [];
            let data = [];
            let diasConEjercicios = 0;
            let minutosTotales = 0;

            $.each(ejerciciosPorDias, function (index, ejercicioDia) {
                labels.push(ejercicioDia.dia + " " + ejercicioDia.mes);
                data.push(ejercicioDia.cantidadMinutos);

                minutosTotales += ejercicioDia.cantidadMinutos;

                if (ejercicioDia.cantidadMinutos > 0) {
                    diasConEjercicios += 1;
                }
            });

            // Obtener el elemento <select>
            var inputTipoEjercicioID = document.getElementById("TipoEjercicioID");

            // Obtener el texto de la opción seleccionada
            var ejercicioNombre = inputTipoEjercicioID.options[inputTipoEjercicioID.selectedIndex].text;

            let diasSinEjercicios = ejerciciosPorDias.length - diasConEjercicios;
            $("#texto-card-total-ejercicios").text(minutosTotales + " MINUTOS EN " + diasConEjercicios + " DÍAS");
            $("#texto-card-sin-ejercicios").text(diasSinEjercicios + " DÍAS SIN " + ejercicioNombre);

            // Configuración del gráfico
            const ctx = document.getElementById('grafico');
            graficoEjercicio = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'CANTIDAD DE MINUTOS',
                        data: data,
                        borderWidth: 2,
                        borderRadius: 3,
                        backgroundColor: "rgba(0,129,112,0.2)",
                        borderColor: "rgba(0,129,112,1)",
                        pointRadius: 5,
                        pointBackgroundColor: "rgba(0,129,112,1)",
                        pointBorderColor: "rgba(255,255,255,0.8)",
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: "rgba(0,116,100,1)",
                        pointHitRadius: 50,
                        pointBorderWidth: 2,
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    },
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    return context.raw + " minutos";
                                }
                            }
                        }
                    }
                }
            });
            $("#loading").remove();
        },
        error: function (xhr, status) {
            // Remover el indicador de carga y mostrar un error
            $("#loading").remove();
            console.error('Error al cargar los datos del gráfico:', status);
            alert("Error al cargar los datos del gráfico. Intenta nuevamente.");
        }
    });
}

function GraficoTorta() {
    let mesEjercicioBuscar = document.getElementById("MesEjercicioBuscar").value;
    let anioEjercicioBuscar = document.getElementById("AnioEjercicioBuscar").value;

    $("#graficoTorta").before("<p id='loading'>Cargando gráfico...</p>");

    $.ajax({
        url: '../../Home/GraficoPorcentajeMes',
        data: {Mes: mesEjercicioBuscar, Anio: anioEjercicioBuscar },
        type: 'POST',
        dataType: 'json',
        success: function (tipoEjercicioPorMes) {
            console.log(tipoEjercicioPorMes)
            let labels = [];
            let data = [];
        
            $.each(tipoEjercicioPorMes, function (index, tipo) {
                labels.push(tipo.nombre);
                data.push(tipo.cantidadMinutos);
            });

            // Configuración del gráfico
            const ctxPie = document.getElementById('graficoTorta');
            graficoTipoEjercicio = new Chart(ctxPie, {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'CANTIDAD DE MINUTOS',
                        data: data,
                        borderWidth: 2,
                        borderRadius: 3,
                        backgroundColor: "rgba(0,129,112,0.2)",
                        borderColor: "rgba(0,129,112,1)",
                        pointRadius: 5,
                        pointBackgroundColor: "rgba(0,129,112,1)",
                        pointBorderColor: "rgba(255,255,255,0.8)",
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: "rgba(0,116,100,1)",
                        pointHitRadius: 50,
                        pointBorderWidth: 2,
                    }]
                }
            });
            $("#loading").remove();
        },
        error: function (xhr, status) {
            // Remover el indicador de carga y mostrar un error
            $("#loading").remove();
            console.error('Error al cargar los datos del gráfico:', status);
            alert("Error al cargar los datos del gráfico. Intenta nuevamente.");
        }
    });
}

function Inicializar() {
    const fechaActual = new Date();
    const mesActual = fechaActual.getMonth() + 1;
    console.log(mesActual);
    $("#MesEjercicioBuscar").val(mesActual);
    GraficoLinea();
    GraficoTorta();
}