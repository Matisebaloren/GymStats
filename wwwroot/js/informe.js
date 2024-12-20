window.onload = generarTabla;

$("#primaryFilter, #secondaryFilter").change(function () {
    generarTabla();
});

function generarTabla() {
    let filtro1 = $("#primaryFilter").val();
    let filtro2 = $("#secondaryFilter").val();
    $.ajax({
        url: '../../Ejercicios/ListadoEjercicios',
        type: 'POST',
        data: { filtro1: filtro1, filtro2: filtro2 },
        dataType: 'json',
        success: function (ejercicios) {
            console.log(ejercicios);

            $("#trTable").empty();
            $("#tbody-informe").empty();
            let contenidoTabla = ``;

            $.each(ejercicios, function (index, e) {
                contenidoTabla += `<tr>`;

                if (filtro1 != "") {
                    contenidoTabla += `<td name="f${e[filtro1 + "ID"]}" class="vertical-text">
                        <span>${e[filtro1 + "Nombre"]}</span>
                    </td>`;
                }
                if (filtro2 != "") {
                    contenidoTabla += `<td name="f${e[filtro1 + "ID"]}B${e[filtro2 + "ID"]}" class="vertical-text">
                        <span>${e[filtro2 + "Nombre"]}</span>
                    </td>`;
                }
                contenidoTabla += `
                    <td>10AM - 11AM</td>
                    <td>60 min</td>
                    <td>${e.caloriasQuemadas}</td>
                    <td>${e.observacion}</td>
                </tr>`;
            });

            $("#tbody-informe").html(contenidoTabla);

            // Llamar a la función para ajustar rowspan
            quitarRepetidos();
            var contenidoTr = "";
            contenidoTr += nuevoTH(filtro1);
            contenidoTr += nuevoTH(filtro2);
            contenidoTr += `
                <th>Día</th>
                <th>Intervalo</th>
                <th>Duracion</th>
                <th>Calorias Quemadas</th>
                `
            $("#trTable").html(contenidoTr);
        },

        error: function (xhr, status) {
            console.log(xhr);
        }
    });
}

function quitarRepetidos() {
    let procesados = {};

    // Iterar sobre cada celda con atributo `name` que empiece con "f"
    $('td[name^="f"]').each(function () {
        let $celda = $(this); // Convertir a objeto jQuery para manipulación más fácil
        let name = $celda.attr('name'); // Obtener el valor del atributo `name`

        if (procesados[name]) {
            // Si ya se procesó este grupo, incrementar el rowspan y eliminar la fila
            let $primeraCelda = procesados[name];
            let rowspanActual = parseInt($primeraCelda.attr('rowspan')) || 1;
            $primeraCelda.attr('rowspan', rowspanActual + 1);

            // Eliminar la celda redundante
            $celda.remove();
        } else {
            // Si es la primera aparición, marcarla como procesada
            procesados[name] = $celda;
        }
    });

    console.log("Repetidos eliminados y rowspan ajustados.");
}


function nuevoTH(filtro) {
    console.log(filtro)
    switch (filtro) {
        case "tipoEjercicio":
            return '<th>Tipo de Ejercicio</th>';
        case "lugar":
            return '<th>Lugar</th>';
        case "evento":
            return '<th>Evento</th>';
        default:
            return '';
    }
}


// --------------------

// function generarTabla() {
//     console.log("probando");
//     let filtro1 = $("#primaryFilter").val();
//     let filtro2 = $("#secondaryFilter").val();
//     $.ajax({
//         url: '../../Ejercicios/ListadoEjercicios',
//         type: 'POST',
//         data: { filtro1: filtro1, filtro2: filtro2 },
//         dataType: 'json',
//         success: function (ejercicios) {
//             console.log(ejercicios);
//             $("#tbody-informe").empty();
//             let contenidoTabla = ``;

//             let filtroData = [];
//             if (filtro1) {
//                 filtroData.push({ rowspan: 0, filtroID: 0, primero: false});
//                 if (filtro2) {
//                     filtroData.push({ rowspan: 0, filtroID: 0, primero: false });
//                 }
//             }

//             $.each(ejercicios, function (index, e) {
//                 console.log(e[filtro1+"ID"])
//                 filtroData.forEach(fd => {
//                     fd.rowspan += 1;
//                     if(e[filtro1+"ID"] != fd.filtroID){
//                         fd.filtroID = e[filtro1+"ID"];
//                         fd.primero = true;
//                     }
//                     else{
//                         fd.primero = false;

//                         fd.rowspan = 0;
//                     }
//                 });
//                 // generarTR(filtroData, e);
//             });

//             // $("#tbody-informe").html(contenidoTabla);
//         },
//         error: function (xhr, status) {
//             console.log(xhr);
//         }
//     });
// }

// function generarTR(filtroData, e) {
//     var contenido = `<tr>`;

//     if (filtroData[0] && filtroData[0].rowspan == 1) {
//         contenido += `<td rowspan="${filtroData[0].rowspan}" class="vertical-text"><span>${e.tipoEjercicoNombre}</span></td>`;
//     }
//     if (filtroData[1] && filtroData[1].rowspan == 1) {
//         contenido += `<td rowspan="${filtroData[0].rowspan}" class="vertical-text"><span>${e.tipoEjercicoNombre}</span></td>`;
//     }
//     contenido += `
//                     <td>10AM - 11AM</td>
//                     <td>60 min</td>
//                     <td>1000</td>
//                     <tr>`;
//     return contenido;
// }

function Imprimir() {
    var doc = new jspdf.jsPDF('l', 'mm', [297, 210]);
    var elem = document.getElementById("informeTable");
    doc.autoTable({
        html: elem,
        theme: 'grid',
        styles: { fontSize: 8 }, columnStyles: {
            0: { halign: 'left', cellWidth: 'auto' },
            1: { fontSize: 8, overflow: 'hidden' },
            2: { halign: 'center', fontSize: 8, overflow: 'hidden' },
            3: { fontSize: 8, overflow: 'hidden' },
            4: { halign: 'center', fontSize: 8, overflow: 'hidden' },
            5: { halign: 'left', cellWidth: 'auto' },
            6: { halign: 'right', cellWidth: 'auto' },
            7: { halign: 'right', cellWidth: 'auto' },
        },
        margin: { top: 10 }
        
    }
    );

  
    var string = doc.output('datauristring');
    var iframe = "<iframe width='100%' height='100%' src='" + string + "'></iframe>"
    var x = window.open();
    x.document.open();
    x.document.write(iframe);
    x.document.close();
}
