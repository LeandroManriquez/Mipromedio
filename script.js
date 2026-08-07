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
const inputNotaMinima = document.getElementById("nota-promedio");
const inputNotaExencion = document.getElementById("nota-exencion");
const inputPorcentajeFaltante = document.getElementById("porcentaje-promedio");
const outputNecesitado = document.getElementById("resultado-necesitado");

const inputNotaExamen = document.getElementById("nota-examen");
const textoEstado = document.getElementById("texto-estado");
const chkReglaRojo = document.getElementById("chk-regla-rojo");

// ==========================================
// 2. FUNCIONES AUXILIARES
// ==========================================
function redondear1Decimal(num) {
    return Math.round((num + Number.EPSILON) * 10) / 10;
}

function actualizarEstado(mensaje, color) {
    if (textoEstado) {
        textoEstado.textContent = mensaje;
        textoEstado.style.color = color;
    }
}

// ==========================================
// 3. CÁLCULO DE PROMEDIOS Y NOTA NECESARIA
// ==========================================
function calcularPromedios() {
    calcularNotaNecesaria();
}

function calcularNotaNecesaria() {
    const notaMinima = parseFloat(inputNotaMinima?.value) || 4.0;
    const notaExencion = parseFloat(inputNotaExencion?.value) || 5.0;
    const porcentajeFaltante = parseFloat(inputPorcentajeFaltante?.value) || 0;
    const notaExamen = parseFloat(inputNotaExamen?.value);

    // 1. Calcular promedio ponderado de las cátedras
    let sumaPonderada = 0;
    let sumaPorcentajes = 0;
    let hayNotaRoja = false;

    for (let i = 0; i < inputsNotas.length; i++) {
        const nota = parseFloat(inputsNotas[i]?.value);
        const porcentaje = parseFloat(inputsPorcentajes[i]?.value);

        if (!isNaN(nota) && !isNaN(porcentaje) && nota > 0 && porcentaje > 0) {
            sumaPonderada += (nota * porcentaje);
            sumaPorcentajes += porcentaje;

            if (nota < 4.0) {
                hayNotaRoja = true;
            }
        }
    }
}
    if (sumaPorcentajes === 0) {
        outputPromedio.textContent = "0.00";
        outputNecesitado.textContent = "Ingrese al menos una nota previa con su porcentaje.";
        actualizarEstado("PENDIENTE", "#f59e0b");
        return;
    }

    // Promedio Ponderado Real (ej: 5.14)
    const promedioPresentacion = sumaPonderada / sumaPorcentajes;
    outputPromedio.textContent = promedioPresentacion.toFixed(2);

    // Validar porcentaje del examen
    if (porcentajeFaltante <= 0 || porcentajeFaltante >= 100) {
        outputNecesitado.textContent = "Ingrese un porcentaje de examen válido (1% a 99%).";
        actualizarEstado("PENDIENTE", "#f59e0b");
        return;
    }

    const porcentajePresentacion = 100 - porcentajeFaltante;
    const umbralAprobacion = notaMinima - 0.05;

    // Verificar si obliga examen por nota roja
    const obligaExamenPorRojo = chkReglaRojo?.checked && hayNotaRoja;
    
    // Condición para eximirse: promedio mayor o igual a la eximición Y SIN notas rojas si la regla está activa
    const teEximes = (promedioPresentacion >= notaExencion) && !obligaExamenPorRojo;

    // Nota necesaria en el examen
    const notaNecesaria = ((umbralAprobacion * 100) - (promedioPresentacion * porcentajePresentacion)) / porcentajeFaltante;

    // A. Mostrar mensaje según estado
    if (teEximes) {
        outputNecesitado.innerHTML =
            `<span style="color:#22c55e">
            <strong>Estás aprobado de presentación.</strong> Tu promedio (${promedioPresentacion.toFixed(2)}) te permite eximirte (o sacarte un 1.0 en el examen).
            </span>`;
    } else {
        let motivoExamen = "";

        if (obligaExamenPorRojo) {
            motivoExamen = `Tienes nota roja (&lt; 4.0). Debes rendir examen sí o sí.`;
        } else {
            const faltaParaEximirse = (notaExencion - promedioPresentacion).toFixed(2);
            motivoExamen = `Vas a examen porque tu promedio (${promedioPresentacion.toFixed(2)}) es menor a la nota de eximición (${notaExencion.toFixed(1)}). Te faltaron ${faltaParaEximirse} décimas para eximirte.`;
        }

        if (notaNecesaria > 7) {
            outputNecesitado.innerHTML =
                `<span style="color:#ef4444">
                ${motivoExamen}<br>
                Necesitas un <strong>${notaNecesaria.toFixed(2)}</strong> en el examen. No es posible aprobar.
                </span>`;
        } else if (notaNecesaria <= 1) {
            outputNecesitado.innerHTML =
                `<span style="color:#f59e0b">
                ${motivoExamen}<br>
                Necesitas un <strong>1.0</strong> en el examen para mantener la aprobación.
                </span>`;
        } else {
            outputNecesitado.innerHTML =
                `<span style="color:#f59e0b">${motivoExamen}</span><br>` +
                `Necesitas obtener un <strong>${notaNecesaria.toFixed(2)}</strong> en el examen para aprobar.`;
        }
    }

    // B. Evaluar estado definitivo si ingresó nota de examen
    if (!isNaN(notaExamen)) {
        const notaFinalBruta = (promedioPresentacion * (porcentajePresentacion / 100)) + 
                              (notaExamen * (porcentajeFaltante / 100));

        const notaFinalOficial = redondear1Decimal(notaFinalBruta);

        if (notaFinalBruta >= umbralAprobacion) {
            actualizarEstado(`APROBADO (${notaFinalOficial.toFixed(1)})`, "#22c55e");
        } else {
            actualizarEstado(`REPROBADO (${notaFinalOficial.toFixed(1)})`, "#ef4444");
        }
    } else {
        if (teEximes) {
            actualizarEstado(`EXIMIDO (${redondear1Decimal(promedioPresentacion).toFixed(1)})`, "#22c55e");
        } else {
            actualizarEstado("PENDIENTE", "#f59e0b");
        }
    }

// ==========================================
// 4. ESCUCHADORES DE EVENTOS
// ==========================================
document.getElementById('imprimir')?.addEventListener('click', () => window.print());

document.getElementById('btn-sumario')?.addEventListener('click', () => {
    window.location.href = 'index2.html';
});

inputsNotas.forEach(input => input?.addEventListener('input', calcularNotaNecesaria));
inputsPorcentajes.forEach(input => input?.addEventListener('input', calcularNotaNecesaria));

inputNotaMinima?.addEventListener("input", calcularNotaNecesaria);
inputNotaExencion?.addEventListener("input", calcularNotaNecesaria);
inputPorcentajeFaltante?.addEventListener("input", calcularNotaNecesaria);
inputNotaExamen?.addEventListener("input", calcularNotaNecesaria);
chkReglaRojo?.addEventListener("change", calcularNotaNecesaria);

// ==========================================
// 5. DESCARGA EN JSON
// ==========================================
document.getElementById('btn-exportar-json')?.addEventListener('click', () => {
    const ramo = document.getElementById('ramo')?.value.trim() || 'Sin_Nombre';
    const comentario = document.getElementById('comentario')?.value || '';
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

    const datosRamo = {
        nombreRamo: ramo,
        estado: estado,
        notaExamen: notaExamen,
        evaluaciones: evaluaciones,
        comentario: comentario,
        fechaGuardado: new Date().toLocaleDateString()
    };

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