// ==========================================
// 1. CAPTURA DE ELEMENTOS (VARIABLES GLOBALES)
// ==========================================
const inputsNotas = [
    document.getElementById('nota1'),
    document.getElementById('nota2'),
    document.getElementById('nota3'),
    document.getElementById('nota4'),
    document.getElementById('nota5'),
];

const inputsPorcentajes = [
    document.getElementById('porcentaje1'),
    document.getElementById('porcentaje2'),
    document.getElementById('porcentaje3'),
    document.getElementById('porcentaje4'),
    document.getElementById('porcentaje5'),
];

const outputPromedio = document.getElementById('resultado');
document.getElementById('imprimir').addEventListener('click', function() {
    window.print();
});

const inputNotaMinima = document.getElementById("nota-promedio");
const inputPorcentajeFaltante = document.getElementById("porcentaje-promedio");
const outputNecesitado = document.getElementById("resultado-necesitado");

// ==========================================
// 2. FUNCIÓN DE CÁLCULO
// ==========================================
function calcularPromedios() {
    let sumaPonderada = 0;
    let sumaPorcentajes = 0;

    // Recorremos los 5 espacios de notas
    for (let i = 0; i < inputsNotas.length; i++) {
        // Obtenemos el valor de cada input correspondiente
        const nota = parseFloat(inputsNotas[i].value) || 0;
        const porcentaje = parseFloat(inputsPorcentajes[i].value) || 0;

        if (nota > 0 && porcentaje > 0) {
            sumaPonderada += (nota * porcentaje);
            sumaPorcentajes += porcentaje;
        }
    }

    if (sumaPorcentajes > 0) {
        const promedio = sumaPonderada / sumaPorcentajes;
        console.log("Tu promedio actual es: " + promedio.toFixed(2));
        outputPromedio.textContent = promedio.toFixed(2);
    } else {
        outputPromedio.textContent = "0.00";
    }

    calcularNotaNecesaria();

}

// ==========================================
// 3. FUNCION PARA AGREGAR UNA NUEVA FILA
// ==========================================
document.getElementById('btn-sumario').addEventListener('click', () => {
    window.location.href = 'index2.html';
});

inputsNotas.forEach(input => input.addEventListener('input', calcularPromedios));
inputsPorcentajes.forEach(input => input.addEventListener('input', calcularPromedios));

inputNotaMinima.addEventListener("input", calcularNotaNecesaria);
inputPorcentajeFaltante.addEventListener("input", calcularNotaNecesaria);

//==========================================
// 4. FUNCION PARA CALCULAR NOTA NECESARIA
//==========================================
function calcularNotaNecesaria() {
    const notaMinima = parseFloat(inputNotaMinima.value) || 4.0;
    const porcentajeFaltante = parseFloat(inputPorcentajeFaltante.value) || 0;

    // 1. Validar que el porcentaje faltante esté en un rango válido
    if (porcentajeFaltante <= 0 || porcentajeFaltante >= 100) {
        outputNecesitado.textContent = "Ingrese un porcentaje faltante válido (entre 1% y 99%).";
        return;
    }

    let sumaNotas = 0;
    let cantidadNotas = 0;

    // 2. Sumar las notas ingresadas para obtener su promedio
    for (let i = 0; i < inputsNotas.length; i++) {
        const nota = parseFloat(inputsNotas[i].value);
        if (!isNaN(nota)) {
            sumaNotas += nota;
            cantidadNotas++;
        }
    }

    if (cantidadNotas === 0) {
        outputNecesitado.textContent = "Ingrese al menos una nota actual.";
        return;
    }

    // 3. El promedio de tus notas actuales vale el porcentaje restante
    const promedioActual = sumaNotas / cantidadNotas;
    const porcentajeActual = 100 - porcentajeFaltante;

    // 4. Calcular la nota necesaria
    // (notaMinima * 100) - (promedioActual * porcentajeActual) / porcentajeFaltante
    const notaNecesaria = ((notaMinima * 100) - (promedioActual * porcentajeActual)) / porcentajeFaltante;

    if (notaNecesaria > 7) {
        outputNecesitado.innerHTML =
            `<span style="color:red">
            Necesitas un <strong>${notaNecesaria.toFixed(2)}</strong>. No es posible aprobar.
            </span>`;
    } else if (notaNecesaria <= 1) {
        outputNecesitado.innerHTML =
            `<span style="color:lime">
            Ya estás aprobado incluso sacándote un 1.0.
            </span>`;
    } else {
        outputNecesitado.innerHTML =
            `Necesitas obtener un <strong>${notaNecesaria.toFixed(2)}</strong> para aprobar.`;
    }
}


// Referencias a los elementos del DOM del examen y estado
const inputNotaExamen = document.getElementById("nota-examen");
const textoEstado = document.getElementById("texto-estado");

function calcularNotaNecesaria() {
    const notaMinima = parseFloat(inputNotaMinima.value) || 4.0;
    const porcentajeFaltante = parseFloat(inputPorcentajeFaltante.value) || 0;
    const notaExamen = parseFloat(inputNotaExamen.value);

    // 1. Validar porcentaje del examen
    if (porcentajeFaltante <= 0 || porcentajeFaltante >= 100) {
        outputNecesitado.textContent = "Ingrese un porcentaje de examen válido (1% a 99%).";
        actualizarEstado("PENDIENTE", "gray");
        return;
    }

    // 2. Calcular el promedio de presentación (notas cursadas)
    let sumaNotas = 0;
    let cantidadNotas = 0;

    for (let i = 0; i < inputsNotas.length; i++) {
        const nota = parseFloat(inputsNotas[i].value);
        if (!isNaN(nota)) {
            sumaNotas += nota;
            cantidadNotas++;
        }
    }

    if (cantidadNotas === 0) {
        outputNecesitado.textContent = "Ingrese al menos una nota previa.";
        actualizarEstado("PENDIENTE", "gray");
        return;
    }

    const promedioPresentacion = sumaNotas / cantidadNotas;
    const porcentajePresentacion = 100 - porcentajeFaltante;

    // 3. Evaluar el Estado Final si ya ingresó la nota del examen
    if (!isNaN(notaExamen)) {
        // Cálculo de la nota final: (Promedio * %Presentación) + (Examen * %Examen)
        const notaFinal = (promedioPresentacion * (porcentajePresentacion / 100)) + 
                          (notaExamen * (porcentajeFaltante / 100));

        if (notaFinal.toFixed(2) >= notaMinima.toFixed(2)) {
            actualizarEstado(`APROBADO (${notaFinal.toFixed(2)})`, "#22c55e");
        } else {
            actualizarEstado(`REPROBADO (${notaFinal.toFixed(2)})`, "#ef4444");
        }
    } else {
        actualizarEstado("PENDIENTE", "#f59e0b");
    }

    // 4. Calcular la nota que necesita sacarse en el examen
    const notaNecesaria = ((notaMinima * 100) - (promedioPresentacion * porcentajePresentacion)) / porcentajeFaltante;

    if (notaNecesaria > 7) {
        outputNecesitado.innerHTML =
            `<span style="color:#ef4444">
            Necesitas un <strong>${notaNecesaria.toFixed(2)}</strong>. No es posible aprobar.
            </span>`;
    } else if (notaNecesaria <= 1) {
        outputNecesitado.innerHTML =
            `<span style="color:#22c55e">
            Ya estás aprobado de presentación (incluso sacándote un 1.0).
            </span>`;
    } else {
        outputNecesitado.innerHTML =
            `Necesitas obtener un <strong>${notaNecesaria.toFixed(2)}</strong> en el examen para aprobar.`;
    }
}

// Función auxiliar para cambiar el texto y color del estado
function actualizarEstado(mensaje, color) {
    textoEstado.textContent = mensaje;
    textoEstado.style.color = color;
}

// Escuchadores de eventos
inputNotaMinima.addEventListener("input", calcularNotaNecesaria);
inputPorcentajeFaltante.addEventListener("input", calcularNotaNecesaria);
inputNotaExamen.addEventListener("input", calcularNotaNecesaria);


// Escuchadores de eventos fuera de la función
inputNotaMinima.addEventListener("input", calcularNotaNecesaria);
inputPorcentajeFaltante.addEventListener("input", calcularNotaNecesaria);


//CODIGO QLO BRIJIDO
// ==========================================
// 5. DESCARGA EN JSON 
// ==========================================
document.getElementById('btn-exportar-json').addEventListener('click', () => {

    const ramo = document.getElementById('ramo').value.trim() || 'Sin_Nombre';
    const comentario = document.getElementById('comentario').value;
    const notaExamen = parseFloat(document.getElementById('nota-examen')?.value) || null;
    const estado = document.getElementById('texto-estado')?.innerText || 'PENDIENTE';

    
    let evaluaciones = [];
    for (let i = 0; i < inputsNotas.length; i++) {
        const nota = parseFloat(inputsNotas[i]?.value);
        const porcentaje = parseFloat(inputsPorcentajes[i]?.value);

        if (!isNaN(nota) && !isNaN(porcentaje)) {
            evaluaciones.push({
                evaluacion: `Cátedra ${i + 1}`,
                nota: nota,
                porcentaje: porcentaje
            });
        }
    }

    //estructura de la wea
    const datosRamo = {
        nombreRamo: ramo,
        estado: estado,
        notaExamen: notaExamen,
        evaluaciones: evaluaciones,
        comentario: comentario,
        fechaGuardado: new Date().toLocaleDateString()
    };

    //generacion de archivo
    const jsonString = JSON.stringify(datosRamo, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    a.href = url;
    a.download = `${ramo.toLowerCase().replace(/\s+/g, '_')}_promedio.json`;
    
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});