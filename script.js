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


//==========================================
// 4. FUNCION PARA CALCULAR NOTA NECESARIA
//==========================================

function calcularNotaNecesaria() {

    const notaMinima = parseFloat(inputNotaMinima.value) || 4.0;
    const porcentajeFaltante = parseFloat(inputPorcentajeFaltante.value) || 0;

    let sumaActual = 0;
    let porcentajeActual = 0;

    for (let i = 0; i < inputsNotas.length; i++) {

        const nota = parseFloat(inputsNotas[i].value);
        const porcentaje = parseFloat(inputsPorcentajes[i].value);

        if (!isNaN(nota) && !isNaN(porcentaje)) {
            sumaActual += nota * porcentaje;
            porcentajeActual += porcentaje;
        }
    }

    if (porcentajeFaltante <= 0) {
        outputNecesitado.textContent = "Ingrese el porcentaje que falta.";
        return;
    }

    if ((porcentajeActual + porcentajeFaltante) !== 100) {
        outputNecesitado.textContent =
            "Los porcentajes ingresados deben sumar 100%.";
        return;
    }

    const notaNecesaria =
        ((notaMinima * 100) - sumaActual) / porcentajeFaltante;

    if (notaNecesaria > 7) {

        outputNecesitado.innerHTML =
            `<span style="color:red">
            Necesitas un ${notaNecesaria.toFixed(2)}. No es posible aprobar.
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
    
    inputNotaMinima.addEventListener("input", calcularNotaNecesaria);
    inputPorcentajeFaltante.addEventListener("input", calcularNotaNecesaria);
}

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