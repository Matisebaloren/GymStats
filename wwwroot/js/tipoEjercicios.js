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
                    <td>
                        <button type="button" class="btn btn-success btn-sm" onclick="Editar(${tipoEjercicios.tipoEjercicioID})">
                           <i class="bi bi-pencil-square"></i>
                        </button>
                    </td>
                    <td>
                        <button type="button" class="btn btn-danger btn-sm" onclick="EliminarRegistro(${tipoEjercicios.tipoEjercicioID})">
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
    $("#createModal").modal('show');
    reiniciarFormulario();
}

function reiniciarFormulario() {
    $("#nombre").val("");
    $("#met").val("");
    $("#tipoEjercicioID").val(0);
}