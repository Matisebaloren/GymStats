window.onload = ListadoTipoEjercicios();

function ListadoTipoEjercicios() {
    $.ajax({
        url: '../../TiposEjercicios/ListadoTipoEjercicios',
        type: 'POST',
        dataType: 'json',
        success: function (tiposEjercicios) {
            //$("#ModalTipoEjercicio").modal("hide");
            //LimpiarModal();
            console.log("tiposEjercicios")
            console.log(tiposEjercicios)
            $("#tbody-tipoEjercicios").empty();
            let contenidoTabla = ``;

            $.each(tiposEjercicios, function (index, tipoEjercicios) {
                contenidoTabla += `
                <tr>
                    <td>${tipoEjercicios.nombre}</td>
                    <td>${tipoEjercicios.met.toFixed(2)}</td>
                    <td class="text-center">
                        <button type="button" class="btn btn-success btn-sm" onclick="Editar(${tipoEjercicios.tipoEjercicioID})">
                           <i class="bi bi-pencil-square"></i>
                        </button>
                    </td>
                    <td class="text-center">
                        <button type="button" class="btn btn-danger btn-sm" onclick="Eliminar(${tipoEjercicios.tipoEjercicioID})">
                            <i class="bi bi-trash-fill"></i>
                        </button>
                    </td>
                </tr>
             `;
            });

            $("#tbody-tipoEjercicios").html(contenidoTabla);
        },
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al cargar el listado');
        }
    });
}

$("#createTipoEjercicioForm").on("submit", function (e) {
    e.preventDefault();

    const nombre = $("#nombre").val();
    const met = $("#met").val();
    const tipoEjercicioID = $("#tipoEjercicioID").val();
    console.log(nombre, met, tipoEjercicioID)


    if (!isNaN(parseFloat(met)) && isFinite(met)) {
        $("#metAlert").text("")
    } else {
        $("#metAlert").text("No es un Número valido.")
    }

    $.ajax({
        url: '../../TiposEjercicios/Guardar',
        type: 'POST',
        dataType: 'json',
        data: { tipoEjercicioID: tipoEjercicioID, nombre: nombre, met: met },
        success: function (response) {
            $("#createModal").modal('hide');
            reiniciarFormulario();
            ListadoTipoEjercicios();
            Swal.fire({
                position: "bottom-end",
                icon: "success",
                title: "Guardado con éxito",
                showConfirmButton: false,
                timer: 1500
            });
        },
        error: function (xhr, status, error) {
            console.error("Error al guardar el tipo de ejercicio:", error);
            alert("Hubo un error al guardar el tipo de ejercicio. Intenta de nuevo.");
        }
    });
});

function Editar(id) {
    console.log(id)
    $.ajax({
        url: '../../TiposEjercicios/ListadoTipoEjercicios',
        type: 'POST',
        dataType: 'json',
        data: { id: id },
        success: function (tipoEjercicio) {
            AbrirModal();
            $("#createModalLabel").text("Editar tipo de ejercicio");

            $("#nombre").val(tipoEjercicio[0].nombre);
            $("#met").val(tipoEjercicio[0].met);
            $("#tipoEjercicioID").val(tipoEjercicio[0].tipoEjercicioID);
        },
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al cargar la info');
        }
    });
}

function AbrirModal() {
    $("#createModalLabel").text("Añadir tipo de ejercicio");

    $("#createModal").modal('show');
    reiniciarFormulario();
}

function reiniciarFormulario() {
    $("#nombre").val("");
    $("#met").val("");
    $("#tipoEjercicioID").val(0);
}

function Eliminar(id) {
    const trashIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 16 16" fill="currentColor">
        <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
        </svg>`;


    $.ajax({
        url: '../../TiposEjercicios/Eliminar',
        type: 'POST',
        dataType: 'json',
        data: { id: id },
        success: function (eliminado) {
            if (eliminado) {
                Swal.fire({
                    title: 'Eliminado con Éxito',
                    icon: 'success',

                    iconHtml: trashIcon,
                    customClass: {
                        icon: 'rotate-y',
                    },
                });
                ListadoTipoEjercicios();
            } else {
                Swal.fire({
                    title: 'Alerta',
                    text: 'Imposible eliminar un tipo de ejercicio que está siendo utilizado.',
                    icon: 'error',
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