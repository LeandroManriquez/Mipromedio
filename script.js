// ==========================================
// 1. CAPTURA DE ELEMENTOS (VARIABLES GLOBALES)
// ==========================================
const inputsNotas = [
    document.getElementById('nota1'),
    document.getElementById('nota2'),
    document.getElementById('nota3'),
    document.getElementById('nota4')
];

const inputsPorcentajes = [
    document.getElementById('porcentaje1'),
    document.getElementById('porcentaje2'),
    document.getElementById('porcentaje3'),
    document.getElementById('porcentaje4')
];

document.getElementById('imprimir').addEventListener('click', function() {
    window.print();
});

// ==========================================
// 2. FUNCIÓN DE CÁLCULO
// ==========================================
function calcularPromedios() {
    let sumaPonderada = 0;
    let sumaPorcentajes = 0;

    // Recorremos los 4 espacios de notas
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
        // Descomentar cuando el HTML tenga donde mostrar el resultado:
        // outputPromedio.textContent = promedio.toFixed(2);
    }
}

// ==========================================
// 3. FUNCION PARA AGREGAR UNA NUEVA FILA
// ==========================================
inputsNotas.forEach(input => input.addEventListener('input', calcularPromedios));
inputsPorcentajes.forEach(input => input.addEventListener('input', calcularPromedios));
