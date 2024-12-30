var emojis = {
    "Feliz": ["bi-emoji-smile-fill", "text-success"],
    "Optimista": ["bi-emoji-smile-fill", "text-success"],
    "Satisfecho": ["bi-emoji-smile-fill", "text-success"],
    "Motivado": ["bi-emoji-laughing-fill", "text-success"],
    "Relajado": ["bi-emoji-sunglasses-fill", "text-success"],
    "Triste": ["bi-emoji-frown-fill", "text-primary"],
    "Pesimista": ["bi-emoji-frown-fill", "text-primary"],
    "Cansado": ["bi-emoji-dizzy-fill", "text-primary"],
    "Desanimado": ["bi-emoji-frown-fill", "text-primary"],
    "Aburrido": ["bi-emoji-expressionless-fill", "text-primary"],
    "Emocionado": ["bi-emoji-grimace-fill", "text-warning"],
    "Agobiado": ["bi-emoji-astonished-fill", "text-warning"],
    "Confundido": ["bi-emoji-astonished-fill", "text-warning"],
    "Eufórico": ["bi-emoji-laughing-fill", "text-warning"],
    "Agitado": ["bi-emoji-dizzy-fill", "text-warning"],
    "Ansioso": ["bi-emoji-grimace-fill", "text-warning"],
    "Estresado": ["bi-emoji-grimace-fill", "text-danger"],
    "Enojado": ["bi-emoji-angry-fill", "text-danger"]
};


window.onload = generarTabla;

$("#primaryFilter, #secondaryFilter, #dateTime_Desde, #dateTime_Hasta").change(function () {
    generarTabla();
});

function generarTabla() {
    let desde = $("#dateTime_Desde").val();
    let hasta = $("#dateTime_Hasta").val();
    let filtro1 = $("#primaryFilter").val();
    let filtro2 = $("#secondaryFilter").val();
    $.ajax({
        url: '../../Ejercicios/ListadoEjercicios',
        type: 'POST',
        data: { filtro1: filtro1, filtro2: filtro2, desde: desde, hasta: hasta },
        dataType: 'json',
        success: function (ejercicios) {
            console.log(ejercicios);

            $("#trTable").empty();
            $("#tbody-informe").empty();
            let contenidoTabla = ``;
            let columnas = ["tipoEjercicio", "evento", "lugar"]

            $.each(ejercicios, function (index, e) {
                contenidoTabla += `<tr>`;
                let iterarColumna = columnas;
                if (filtro1 != "") {
                    iterarColumna = iterarColumna.filter(columna => columna !== filtro1);
                    contenidoTabla += `<td name="f${e[filtro1 + "ID"]}">
                        <span>${e[filtro1 + "Nombre"]}</span>
                    </td>`;
                }
                if (filtro2 != "" && filtro1 != filtro2) {
                    iterarColumna = iterarColumna.filter(columna => columna !== filtro2);
                    contenidoTabla += `<td name="f${e[filtro1 + "ID"]}B${e[filtro2 + "ID"]}" >
                        <span>${e[filtro2 + "Nombre"]}</span>
                    </td>`;
                }
                console.log(iterarColumna);
                iterarColumna.forEach(columna => {
                    contenidoTabla += `<td>
                        <span>${e[columna + "Nombre"]}</span>
                    </td>`;
                });

                e.observacion = (e.observacion === "null" || e.observacion === null)
                    ? "--"
                    : e.observacion;

                let emojiInicio = "";
                let emojiFinal = "";
                if (e.emocionInicio != "0") {
                    emojiInicio = ` / ${e.emocionInicioString}`
                }
                if (e.emocionFin != "0") {
                    emojiFinal = ` / ${e.emocionFinString}`
                }

                contenidoTabla += `
                    <td>${e.observacion}</td>
                    <td>${e.inicioString} ${emojiInicio}</td>
                    <td>${e.finString} ${emojiFinal}</td>
                    <td>${e.intervaloEjercicio} hs</td>
                    <td>${e.caloriasQuemadas} cal</td>
                    
                </tr>`;
            });

            $("#tbody-informe").html(contenidoTabla);

            // Llamar a la función para ajustar rowspan
            var contenidoTr = "";

            contenidoTr += nuevoTH(filtro1);
            if (filtro1 != filtro2) {
                contenidoTr += nuevoTH(filtro2);
            }
            columnas = columnas.filter(columna => columna !== filtro1);
            columnas = columnas.filter(columna => columna !== filtro2);
            columnas.forEach(columna => {
                contenidoTr += nuevoTH(columna);
            });

            contenidoTr += `
            <th>Observación</th>
                <th>Inicio</th>
                <th>Fin</th>
                <th>Duracion</th>
                <th>Gasto Calorico</th>
                `
            $("#trTable").html(contenidoTr);

            quitarRepetidos();
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
    let desde = $("#dateTime_Desde").val();
    let hasta = $("#dateTime_Hasta").val();
    desde = desde ? new Date(desde).toLocaleString() : "el inicio de los registros";
    hasta = hasta ? new Date(hasta).toLocaleString() : "la actualidad";

    var doc = new jspdf.jsPDF('l', 'mm', [297, 210]);

    // seteamos la fuente
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(187, 100, 0);

    // titulo
    doc.text(`Informe de Ejercicios desde ${desde} hasta ${hasta}` 
        ,280, 8, { align: "right" });

    var elem = document.getElementById("informeTable");
    doc.autoTable({
        html: elem,
        theme: 'grid',
        styles: { fontSize: 8 },
        headStyles: {
            fillColor: [254, 157, 44], // Color de fondo (azul oscuro)
            textColor: [255, 255, 255], // Color del texto (blanco)
            fontStyle: 'bold', // Estilo de fuente
            halign: 'center', // Alineación horizontal
            valign: 'middle' // Alineación vertical
        },
        columnStyles: {
            0: { halign: 'left', cellWidth: 'auto' },
            1: { fontSize: 8, overflow: 'hidden' },
            2: { halign: 'center', fontSize: 8, overflow: 'hidden' },
            3: { fontSize: 8, overflow: 'hidden' },
            4: { halign: 'center', fontSize: 8, overflow: 'hidden' },
            5: { halign: 'left', cellWidth: 'auto' },
            6: { halign: 'right', cellWidth: 'auto' },
            7: { halign: 'right', cellWidth: 'auto' },
        },
        didParseCell: function (data) {
            if (data.column.index === 3 && data.cell.raw === "--") {
                data.cell.styles.halign = 'center'; // Cambia la alineación
            }
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


