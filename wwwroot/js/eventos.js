window.onload = ListadoEventos();

function ListadoEventos() {
    $.ajax({
        url: '../../Eventos/ListadoEventos',
        type: 'POST',
        dataType: 'json',
        success: function (eventos) {
            
            $("#tbody-vs").empty();
            let contenidoTabla = ``;

            $.each(eventos, function (index, evento) {
                contenidoTabla += `
                <tr>
                    <td>${evento.nombre}</td>
                    <td>
                        <button type="button" class="btn btn-success btn-sm" onclick="Editar(${evento.eventoID})">
                           <i class="bi bi-pencil-square"></i>
                        </button>
                    </td>
                    <td>
                        <button type="button" class="btn btn-danger btn-sm" onclick="EliminarRegistro(${evento.eventoID})">
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

$("#createEventoForm").on("submit", function (e) {
    e.preventDefault();

    const nombre = $("#nombre").val();
    const eventoID = $("#eventoID").val();

    $.ajax({
        url: '../../Eventos/Guardar',
        type: 'POST',
        dataType: 'json',
        data: { eventoID: eventoID, nombre: nombre },
        success: function (response) {
            $("#createModal").modal('hide');
            reiniciarFormulario();
            ListadoEventos();
            Swal.fire({
                position: "bottom-end",
                icon: "success",
                title: "Guardado con éxito",
                showConfirmButton: false,
                timer: 1500
            });
        },
        error: function (xhr, status, error) {
            console.error("Error al guardar el evento:", error);
            alert("Hubo un error al guardar el evento. Intenta de nuevo.");
        }
    });
});

function Editar(id) {
    console.log(id)
    $.ajax({
        url: '../../Eventos/ListadoEventos',
        type: 'POST',
        dataType: 'json',
        data: { id: id },
        success: function (evento) {
            AbrirModal();
            $("#nombre").val(evento[0].nombre);
            $("#eventoID").val(evento[0].eventoID);
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
    $("#eventoID").val(0);
}