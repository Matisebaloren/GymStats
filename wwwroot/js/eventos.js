window.onload = ListadoEventos();

function ListadoEventos() {
    $.ajax({
        url: '../../Eventos/ListadoEventos',
        type: 'POST',
        dataType: 'json',
        success: function (eventos) {
            console.log(eventos);
            $("#tbody-eventos").empty();
            let contenidoTabla = ``;

            $.each(eventos, function (index, evento) {
                contenidoTabla += `
                <tr>
                    <td>${evento.nombre}</td>
                    <td class="text-center">
                        <button type="button" class="btn btn-success btn-sm" onclick="Editar(${evento.eventoID})">
                           <i class="bi bi-pencil-square"></i>
                        </button>
                    </td>
                    <td class="text-center">
                        <button type="button" class="btn btn-danger btn-sm" onclick="Eliminar(${evento.eventoID})">
                            <i class="bi bi-trash-fill"></i>
                        </button>
                    </td>
                </tr>
             `;
            });

            $("#tbody-eventos").html(contenidoTabla);
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
            if (response == "") {
                ListadoEventos();
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

function Eliminar(id) {
    const trashIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 16 16" fill="currentColor">
        <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
        </svg>`;


    $.ajax({
        url: '../../Eventos/Eliminar',
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
                ListadoEventos();
            } else {
                Swal.fire({
                    title: 'Alerta',
                    text: 'Imposible eliminar un evento que está siendo utilizado.',
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