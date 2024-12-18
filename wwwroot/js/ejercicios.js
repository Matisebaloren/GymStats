window.onload = ListadoEjercicios();

function ListadoEjercicios() {
    $.ajax({
        url: '../../Ejercicios/ListadoEjercicios',
        type: 'POST',
        dataType: 'json',
        success: function (ejercicios) {
            console.log(ejercicios)
            $("#tbody-ejercicios").empty();
            let contenidoTabla = ``;

            $.each(ejercicios, function (index, ejercicio) {
                console.log(ejercicio.intervaloEjercicio)
                contenidoTabla += `
                <tr>
                    <td>${ejercicio.tipoEjercicioNombre}</td>
                    <td>${ejercicio.lugarNombre}</td>
                    <td>${ejercicio.eventoNombre}</td>
                    <td>${ejercicio.observacion}</td>
                    <td>${ejercicio.inicioString}</td>
                    <td>${ejercicio.finString}</td>
                    <td>${ejercicio.intervaloEjercicio}</td>
                    <td>${ejercicio.caloriasQuemadas}</td>
                    <td>
                        <button type="button" class="btn btn-success btn-sm" onclick="Editar(${ejercicio.ejercicioID})">
                           <i class="bi bi-pencil-square"></i>
                        </button>
                    </td>
                    <td>
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

    $.ajax({
        url: '../../Ejercicios/Guardar',
        type: 'POST',
        dataType: 'json',
        data: { ejercicioID:ejercicioID, lugarID: lugarID, eventoID: eventoID, tipoEjercicioID: tipoEjercicioID, observacion: observacion, inicio: inicio, fin: fin },
        success: function (response) {
            $("#createModal").modal('hide');
            reiniciarFormulario();
            ListadoEjercicios();
            Swal.fire({
                position: "bottom-end",
                icon: "success",
                title: "Guardado con éxito",
                showConfirmButton: false,
                timer: 1500
            });
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
            $("#ejercicioID").val(ejercicio[0].ejercicioID);
            $("#observacion").val(ejercicio[0].observacion);
            $("#lugarID").val(ejercicio[0].lugarID);
            $("#eventoID").val(ejercicio[0].eventoID);
            $("#tipoEjercicioID").val(ejercicio[0].tipoEjercicioID);
            $("#inicio").val(ejercicio[0].inicio);
            $("#fin").val(ejercicio[0].fin);
        },
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al cargar la info');
        }
    });
}

function AbrirModal() {
    $("#createModal").modal('show');
    reiniciarFormulario();
}

function reiniciarFormulario() {
    $("#observacion").val("");
    $("#lugarID").val(0);
    $("#eventoID").val(0);
    $("#tipoEjercicioID").val(0);
}

function Eliminar(id) {
    const trashIcon = `
<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 16 16" fill="currentColor">
  <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
</svg>`;

    Swal.fire({
        title: 'My Icon is Special!',
        icon: 'error',
        iconHtml: trashIcon,
        customClass: {
            icon: 'rotate-y',
        },
    });


    $.ajax({
        url: '../../Lugares/ListadoLugares',
        type: 'POST',
        dataType: 'json',
        data: { id: id },
        success: function (lugar) {

        },
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al cargar la info');
        }
    });
}
