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

window.onload = inicializar();



function inicializar() {

    let contentInicio = generarEmojis(emojis, true);
    let contentFin = generarEmojis(emojis, false);

    $("#emocionInicioUl").html(contentInicio);
    $("#emocionFinUl").html(contentFin);

    ListadoEjercicios();
}

function generarEmojis(emojis, esInicio) {
    let contentUl = `<li onclick="seleccionarEmocion(${esInicio}, 0)">
            <a class="dropdown-item" href="#">
                 Selecciona una emoción
            </a>
        </li>`;
    let iteracion = 1;

    Object.entries(emojis).forEach(([key, value]) => {
        contentUl += `<li onclick="seleccionarEmocion(${esInicio}, ${iteracion}, '${key}', '${value[0]}')">
            <a class="dropdown-item ${value[1]}" href="#">
                <i class="bi ${value[0]}"></i> ${key}
            </a>
        </li>`;
        iteracion += 1;
    });

    return contentUl;
}

function seleccionarEmocion(esInicio, id = 0, emocion = "") {
    if (esInicio == true) {
        var button = $("#emocionInicioButton");
        var emocionID = $("#emocionInicioID");
    } else {
        var button = $("#emocionFinButton");
        var emocionID = $("#emocionFinID");
    }
    if (id != 0) {
        button.html(`<i class="bi ${emojis[emocion][0]}"></i> ${emocion}`);
    }
    else{
        button.html(`Selecciona una Emoción`);
    } emocionID.val(id)
}


function ListadoEjercicios() {
    let desde = $("#dateTime_Desde").val();
    let hasta = $("#dateTime_Hasta").val();

    $.ajax({
        url: '../../Ejercicios/ListadoEjercicios',
        type: 'POST',
        dataType: 'json',
        data: { desde: desde, hasta: hasta },
        success: function (ejercicios) {
            console.log(ejercicios)
            $("#tbody-ejercicios").empty();
            let contenidoTabla = ``;

            $.each(ejercicios, function (index, ejercicio) {
                console.log(ejercicio.intervaloEjercicio)

                ejercicio.observacion = (ejercicio.observacion === "null" || ejercicio.observacion === null)
                    ? " -- "
                    : ejercicio.observacion;
                let emojiInicio = "";
                let emojiFinal = "";
                if (ejercicio.emocionInicio != "0") {
                    emojiInicio = `<i title="${ejercicio.emocionInicioString}" class="bi ${emojis[ejercicio.emocionInicioString][0]}"></i>`
                }
                if (ejercicio.emocionFin != "0") {
                    emojiFinal = `<i title="${ejercicio.emocionFinString}" class="bi ${emojis[ejercicio.emocionFinString][0]}"></i>`
                }

                contenidoTabla += `
                <tr>
                    <td>${ejercicio.tipoEjercicioNombre}</td>
                    <td>${ejercicio.lugarNombre}</td>
                    <td class="d-none d-md-table-cell">${ejercicio.eventoNombre}</td>
                    <td onclick="detalle(ejercicio)">${ejercicio.observacion}</td>
                    <td class="d-none d-md-table-cell">${ejercicio.inicioString} ${emojiInicio}</td>
                    <td class="d-none d-md-table-cell">${ejercicio.finString} ${emojiFinal}</td>
                    <td class="d-none d-md-table-cell">${ejercicio.intervaloEjercicio}</td>
                    <td class="text-end">${ejercicio.caloriasQuemadas} cal</td>
                    
                    <td class="text-center">
                        <button type="button" class="btn btn-success btn-sm" onclick="Editar(${ejercicio.ejercicioID})">
                           <i class="bi bi-pencil-square"></i>
                        </button>
                    </td>
                    <td class="text-center">
                        <button type="button" class="btn btn-danger btn-sm" onclick="Eliminar(${ejercicio.ejercicioID})">
                            <i class="bi bi-trash-fill"></i>
                        </button>
                    </td>
                </tr>
             `;
            });

            $("#tbody-ejercicios").html(contenidoTabla);
        },
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al cargar el listado');
        }
    });
    Formulario();
}

function Formulario() {
    $.ajax({
        url: '../../Ejercicios/Formulario',
        type: 'POST',
        dataType: 'json',
        success: function (data) {
            console.log(data)

            // LUGARES
            var selectContent = '<option value="0" disabled>- Seleccione un Lugar -</option>';
            $.each(data.lugares, function (index, lugar) {
                selectContent += '<option value="' + lugar.lugarID + '"> ' + lugar.nombre + ' </option>'
            });
            $("#lugarID").html(selectContent);

            // EVENTOS
            selectContent = '<option value="0" disabled>- Seleccione un Evento -</option>';
            $.each(data.eventos, function (index, evento) {
                selectContent += '<option value="' + evento.eventoID + '"> ' + evento.nombre + ' </option>'
            });
            $("#eventoID").html(selectContent);

            // TIPOS DE EJERCICIOS
            selectContent = '<option value="0" disabled>- Seleccione un Tipo -</option>';
            $.each(data.tiposEjercicios, function (index, tipoEjercicio) {
                selectContent += '<option value="' + tipoEjercicio.tipoEjercicioID + '"> ' + tipoEjercicio.nombre + ' </option>'
            });
            $("#tipoEjercicioID").html(selectContent);

            $("#lugarID").val(0);
            $("#eventoID").val(0);
            $("#tipoEjercicioID").val(0);
        },
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al cargar los datos');
        }
    });
}

function detalle() {

}

function ValidarSubmit() {
    var valido = true;
    console.log("validando")
    // Limpiar mensajes previos.
    $(".text-danger").html("");

    if ($("#tipoEjercicioID").val() == null) {
        $("#selectAlertTipo").html("Debe seleccionar un tipo de ejercicio válido.");
        valido = false;
    }

    if ($("#lugarID").val() == null) {
        $("#selectAlertLugar").html("Debe seleccionar un lugar válido.");
        valido = false;
    }

    if ($("#eventoID").val() == null) {
        $("#selectAlertEvento").html("Debe seleccionar un evento válido.");
        valido = false;
    }
    if ($("#inicio").val() == "") {
        $("#alertInicio").html("Debe seleccionar una fecha y hora válida.");
        valido = false;
    }
    if ($("#fin").val() == "") {
        $("#alertFin").html("Debe seleccionar una fecha y hora válida.");
        valido = false;
    }
    else if ($("#inicio").val() > $("#fin").val()) {
        $("#alertFin").html("La fecha de fin debe ser posterior a la de inicio.");
        valido = false;
    }
    return valido;
}

$("#createEjercicioForm").on("submit", function (e) {
    e.preventDefault();
    console.log($("#inicio").val());
    valido = ValidarSubmit();
    if (!valido) {
        return false
    }
    console.log("valido")
    const ejercicioID = $("#ejercicioID").val();
    const observacion = $("#observacion").val();
    const lugarID = $("#lugarID").val();
    const eventoID = $("#eventoID").val();
    const tipoEjercicioID = $("#tipoEjercicioID").val();
    const inicio = $("#inicio").val();
    const fin = $("#fin").val();
    const emocionInicio = $("#emocionInicioID").val();
    const emocionFinal = $("#emocionFinID").val();

    $.ajax({
        url: '../../Ejercicios/Guardar',
        type: 'POST',
        dataType: 'json',
        data: { ejercicioID: ejercicioID, lugarID: lugarID, eventoID: eventoID, tipoEjercicioID: tipoEjercicioID, observacion: observacion, inicio: inicio, fin: fin, emocionInicio: emocionInicio, emocionFinal: emocionFinal },
        success: function (response) {
            $("#createModal").modal('hide');
            reiniciarFormulario();
            if (response == "") {
                ListadoEjercicios();
                Swal.fire({
                    position: "bottom-end",
                    icon: "success",
                    title: "Guardado con éxito",
                    showConfirmButton: false,
                    timer: 1500
                });

            } else {
                Swal.fire({
                    title: 'Alerta',
                    text: response,
                    icon: 'warning'
                });
            }
        },
        error: function (xhr, status, error) {
            console.error("Error al guardar el Ejercicio:", error);
            alert("Hubo un error al guardar el Ejercicio. Intenta de nuevo.");
        }
    });
});

function Editar(id) {

    $.ajax({
        url: '../../Ejercicios/ListadoEjercicios',
        type: 'POST',
        dataType: 'json',
        data: { id: id },
        success: function (ejercicio) {
            AbrirModal();
            $("#createModalLabel").text("Editar Ejercicio");
            $("#ejercicioID").val(ejercicio[0].ejercicioID);
            $("#observacion").val(ejercicio[0].observacion);
            $("#lugarID").val(ejercicio[0].lugarID);
            $("#eventoID").val(ejercicio[0].eventoID);
            $("#tipoEjercicioID").val(ejercicio[0].tipoEjercicioID);
            $("#inicio").val(ejercicio[0].inicio);
            $("#fin").val(ejercicio[0].fin);
            if (ejercicio[0].emocionInicio != 0) {
                seleccionarEmocion(true, ejercicio[0].emocionInicio, ejercicio[0].emocionInicioString)
            }
            if (ejercicio[0].emocionFin != 0) {
                seleccionarEmocion(false, ejercicio[0].emocionFin, ejercicio[0].emocionFinString)
            }
        },
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al cargar la info');
        }
    });
}

function AbrirModal() {
    $(".text-danger").html("");
    $("#createModalLabel").text("Añadir Ejercicio");
    $("#createModal").modal('show');
    reiniciarFormulario();
}

function reiniciarFormulario() {
    $("#observacion").val("");
    $("#lugarID").val(0);
    $("#eventoID").val(0);
    $("#tipoEjercicioID").val(0);
    seleccionarEmocion(true, 0, "Seleccionar una emoción");
    seleccionarEmocion(false, 0, "Seleccionar una emoción");
}

function Eliminar(id) {
    const trashIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 16 16" fill="currentColor">
        <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
        </svg>`;


    $.ajax({
        url: '../../Ejercicios/Eliminar',
        type: 'POST',
        dataType: 'json',
        data: { id: id },
        success: function (eliminado) {
            if (eliminado) {
                Swal.fire({
                    title: 'Eliminado con Éxito',
                    icon: 'success',
                    confirmButtonColor: "#2BC0FF",
                    iconHtml: trashIcon,
                    customClass: {
                        icon: 'rotate-y',
                    },
                });
                ListadoEjercicios();
            } else {
                Swal.fire({
                    title: 'Alerta',
                    text: 'Imposible eliminar este Ejercicio.',
                    icon: 'error',
                    confirmButtonColor: "#2BC0FF",
                    iconHtml: trashIcon,
                    customClass: {
                        icon: 'rotate-y',
                    },
                });
            }
        },
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al cargar la info');
        }
    });
}