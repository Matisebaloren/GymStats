window.onload = GraficoLinea();

function MostrarGrafico() {
    let tipoEjercicioID = document.getElementById("TipoEjercicioID").value;
    let mesEjercicioBuscar = document.getElementById("MesEjercicioBuscar").value;
    let anioEjercicioBuscar = document.getElementById("AnioEjercicioBuscar").value;

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
                
                if (ejercicioDia.cantidadMinutos > 0){
                    diasConEjercicios += 1;
                }
            });

            // Obtener el elemento <select>
            var inputTipoEjercicioID = document.getElementById("TipoEjercicioID");
        
            // Obtener el texto de la opción seleccionada
            var ejercicioNombre = inputTipoEjercicioID.options[inputTipoEjercicioID.selectedIndex].text;

            let diasSinEjercicios = ejerciciosPorDias.length - diasConEjercicios;
            $("#texto-card-total-ejercicios").text(minutosTotales + " MINUTOS EN " + diasConEjercicios + " DÍAS");
            $("#texto-card-sin-ejercicios").text(diasSinEjercicios + " DÍAS SIN "+ ejercicioNombre);

            const ctx = document.getElementById('grafico-area');

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
                    }
                }
            });
        },


        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al crear el gráfico.');
        }
    });
}