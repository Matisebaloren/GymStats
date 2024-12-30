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
                        backgroundColor: "rgba(254, 157, 44, 0.2)", // Color base con transparencia
                        borderColor: "rgba(254, 157, 44, 1)", // Color sólido para la línea
                        pointRadius: 5,
                        pointBackgroundColor: "rgba(254, 157, 44, 1)", // Puntos en el gráfico
                        pointBorderColor: "rgba(255, 255, 255, 0.8)", // Borde blanco alrededor de los puntos
                        pointHoverRadius: 6,
                        pointHoverBackgroundColor: "rgba(254, 157, 44, 0.8)", // Efecto al pasar el mouse
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
        data: { Mes: mesEjercicioBuscar, Anio: anioEjercicioBuscar },
        type: 'POST',
        dataType: 'json',
        success: function (tipoEjercicioPorMes) {
            console.log(tipoEjercicioPorMes)
            let labels = [];
            let data = [];

            // Variantes de color (transparencias y tonalidades de FE9D2C)
            const baseColor = "FE9D2C";
            const colorVariantes = [
                `#FFDEB9`,
                `#FEBE72`,
                `#FE9D2C`,
                `#A9691D`,
                `#55340F`];


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
                        backgroundColor: colorVariantes.slice(0, data.length), // Color base con transparencia
                        borderColor: "rgba(254, 157, 44, 1)", // Color sólido para la línea

                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    return `${context.label}: ${context.raw} minutos`;
                                }
                            }
                        },
                        datalabels: {
                            color: '#ffffff', // Color del texto dentro de las porciones
                            font: {
                                weight: 'bold',
                                size: 14
                            },
                            formatter: function(value, context) {
                                // Muestra los minutos en las porciones
                                return 24 + ' min';
                            },
                            anchor: 'center', // Centra el texto dentro de la porción
                            align: 'center', // Centra el texto dentro de la porción
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

function Inicializar() {
    setTimeout(function() {

    const fechaActual = new Date();
    const mesActual = fechaActual.getMonth() + 1;
    console.log(mesActual);
    $("#MesEjercicioBuscar").val(mesActual);
    GraficoLinea();
    GraficoTorta();
    },1000);
}