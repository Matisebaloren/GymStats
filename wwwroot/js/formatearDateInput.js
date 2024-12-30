window.onload = formatearDateInputs;

    
    // Sincroniza los valores visibles y ocultos (internos) de los inputs
    function syncDateTimeValue(input, hiddenInputId) {
        const hiddenInput = document.getElementById(hiddenInputId);

        try {
            const [date, time] = input.value.split(" ");
            const [day, month, year] = date.split("/");

            // Convierte dd/MM/yyyy a yyyy-MM-dd
            const isoDate = `${year}-${month}-${day}T${time}`;
            
            // Validar que el formato sea válido
            const isValidDate = !isNaN(new Date(isoDate).getTime());
            if (isValidDate) {
                hiddenInput.value = isoDate;
            } else {
                alert("Fecha inválida. Usa el formato dd/MM/yyyy HH:mm");
                input.value = ""; // Limpia el campo visible si es inválido
            }
        } catch {
            alert("Formato incorrecto. Usa el formato dd/MM/yyyy HH:mm");
            input.value = ""; // Limpia el campo visible
        }
    }

