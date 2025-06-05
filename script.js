let listadoTareas= []
const tareaInput= document.getElementById('tarea')
const descInput= document.getElementById('desc')

// Funcion Validacion Datos Tarea

function validacion(tarea, desc) {
    if (tarea == '' || desc == '') {
        alert('Ingrese bien los datos de la tarea')
        return false
    }
    return true
}

// Funcion Agregar Tarea (+ boton editar, + boton eliminar)

document.querySelector('#agregar').addEventListener('click', function (event) {
    event.preventDefault()

    const tarea= tareaInput.value.trim()
    const desc= descInput.value.trim()

    validacion_datos= validacion(tarea, desc)

    if (!validacion_datos) {
        return
    }


})


document.querySelector