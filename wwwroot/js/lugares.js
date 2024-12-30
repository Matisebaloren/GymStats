window.onload = ListadoLugares();

function ListadoLugares() {
    $.ajax({
        url: '../../Lugares/ListadoLugares',
        type: 'POST',
        dataType: 'json',
        success: function (lugares) {
            console.log("lugares")
            console.log(lugares)
            $("#tbody-lugares").empty();
            let contenidoTabla = ``;

            $.each(lugares, function (index, lugar) {
                contenidoTabla += `
                <tr>
                    <td>${lugar.nombre}</td>
                    <td class="text-center">
                        <button type="button" class="btn btn-success btn-sm" onclick="Editar(${lugar.lugarID})">
                           <i class="bi bi-pencil-square"></i>
                        </button>
                    </td>
                    <td class="text-center">
                        <button type="button" class="btn btn-danger btn-sm" onclick="Eliminar(${lugar.lugarID})">
                            <i class="bi bi-trash-fill"></i>
                        </button>
                    </td>
                </tr>
             `;
            });

            $("#tbody-lugares").html(contenidoTabla);
        },
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al cargar el listado');
        }
    });
}

$("#createLugarForm").on("submit", function (e) {
    console.log("hoa");
    e.preventDefault();

    const nombre = $("#nombre").val();
    const lugarID = $("#lugarID").val();
    console.log(nombre, lugarID)

    $.ajax({
        url: '../../Lugares/Guardar',
        type: 'POST',
        dataType: 'json',
        data: { lugarID: lugarID, nombre: nombre },
        success: function (response) {
            console.log(response)
            $("#createModal").modal('hide');
            reiniciarFormulario();
            if (response == "") {
                ListadoLugares();
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
            console.error("Error al guardar el lugar:", error);
            alert("Hubo un error al guardar el lugar. Intenta de nuevo.");
        }
    });
});

function Editar(id) {
    
    $.ajax({
        url: '../../Lugares/ListadoLugares',
        type: 'POST',
        dataType: 'json',
        data: { id: id },
        success: function (lugar) {
            AbrirModal();
            $("#createModalLabel").text("Editar Lugar");
            $("#nombre").val(lugar[0].nombre);
            $("#lugarID").val(lugar[0].lugarID);
        },
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al cargar la info');
        }
    });
}

function AbrirModal() {
    $("#createModal").modal('show');
    $("#createModalLabel").text("Añadir Lugar");
    reiniciarFormulario();
}

function reiniciarFormulario() {
    $("#nombre").val("");
    $("#lugarID").val(0);
}

function Eliminar(id) {
    const trashIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 16 16" fill="currentColor">
        <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
        </svg>`;


    $.ajax({
        url: '../../Lugares/Eliminar',
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
                ListadoLugares();
            } else {
                Swal.fire({
                    title: 'Alerta',
                    text: 'Imposible eliminar un lugar que está siendo utilizado.',
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
