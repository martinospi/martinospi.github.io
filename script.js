let listadoTareas= []

// Funcion Validacion Datos Tarea
function validacion(tarea, desc) {
    if (tarea == '' || desc == '') {
        alert('Ingrese bien los datos de la tarea')
        return false
    }
    return true
}

// Funcion Agregar Tarea (+ boton editar, + boton eliminar)
document.querySelector('#agregarBtn').addEventListener('click', function (event) {
    const tareaInput= document.getElementById('tarea')
    const descInput= document.getElementById('desc')
    const tarea= tareaInput.value.trim()
    const desc= descInput.value.trim()

    validacion_datos= validacion(tarea, desc)

    if (!validacion_datos) {
        return
    }

    listadoTareas.push({tarea, desc})
    tareaInput.value= ''
    descInput.value= ''
    mostrarLista()
})

// Funcion Eliminar Tarea
function eliminarTarea(index) {
    listadoTareas.splice(index, 1)
    mostrarLista()
}

// Funcion Editar Tarea
function editarTarea(index) {
    const tareaInput = document.getElementById('tarea')
    const descInput = document.getElementById('desc')
    const agregarBtn = document.querySelector('#agregarBtn')

    // El formulario se llena con los datos actuales y oculto btnAgregar
    tareaInput.value = listadoTareas[index].tarea
    descInput.value = listadoTareas[index].desc
    agregarBtn.style.display = 'none'

    if (!document.getElementById('guardarCambiosBtn')) {
        const btnGuardar = document.createElement('button')
        btnGuardar.textContent = 'Guardar cambios'
        btnGuardar.id = 'btnGuardarCambios'

        btnGuardar.addEventListener('click', function (e) {
            e.preventDefault()

            const nuevaTarea = tareaInput.value.trim()
            const nuevaDesc = descInput.value.trim()

            if (!validacion(nuevaTarea, nuevaDesc)) {
                return
            }

            listadoTareas[index] = { tarea: nuevaTarea, desc: nuevaDesc }

            tareaInput.value = ''
            descInput.value = ''
            mostrarLista()

            // Muestro btnAgregar, saco btnGuardar
            btnGuardar.remove()
            agregarBtn.style.display = 'inline'
        })

        // Agregamos el botón al formulario
        document.getElementById('agregar').appendChild(btnGuardar)
    }
}

// Funcion Mostrar Lista (para actualizar bien las tareas)
function mostrarLista() {
    const lista= document.querySelector('#listaTareas')
    lista.innerHTML= ''
      
    for (let i= 0; i < listadoTareas.length; i++) {
        let task= listadoTareas[i]
        let div= document.createElement('div')
        div.innerHTML= `<p>Tarea:</p> ${task.tarea}$ 
        <p>Detalles:</p> ${task.desc}$
        `
        
        const btnEditar= document.createElement('button')
        btnEditar.textContent= 'Editar'
        btnEditar.addEventListener('click', () => editarTarea(i))
        
        const btnEliminar= document.createElement('button')
        btnEliminar.textContent= 'Eliminar'
        btnEliminar.addEventListener('click', () => eliminarTarea(i))
        
        div.appendChild(btnEditar)
        div.appendChild(btnEliminar)
        lista.appendChild(div)
    }
}