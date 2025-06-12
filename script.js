// Variables y Elementos
const form = document.getElementById('agregar')
const tareaInput = document.getElementById('tarea')
const descInput = document.getElementById('desc')
const agregarBtn = document.getElementById('agregarBtn')

// Nuevos elementos para las listas y pestañas
const listaTareasDiv = document.getElementById('listaTareas')
const listaTareasCompletadasDiv = document.getElementById('listaTareasCompletadas')
const tabPendientes = document.querySelector('.tab-btn[data-tab="pendientes"]')
const tabCompletadas = document.querySelector('.tab-btn[data-tab="completadas"]')
const seccionPendientes = document.getElementById('pendientes')
const seccionCompletadas = document.getElementById('completadas')

// Estado aplicación (cargo las tareas desde localstorage, si no hay, array vacío)
let listadoTareas = JSON.parse(localStorage.getItem('listadoTareasMomentum')) || []

// FUNCIONES

// Función para guardar en localstorage
function guardarTareas() {
  localStorage.setItem('listadoTareasMomentum', JSON.stringify(listadoTareas))
}

// Función Validación
function validacion(tarea) {
  if (tarea === '') {
    alert('Ingrese bien los datos de la tarea')
    return false
  }
  return true
}

// Función MostrarListas
function mostrarListas() {
  listaTareasDiv.innerHTML = ''
  listaTareasCompletadasDiv.innerHTML = ''

  if (listadoTareas.filter(t => t.status === 'pendiente').length === 0) {
    listaTareasDiv.innerHTML = '<p>¡Genial! No tenés tareas pendientes.</p>'
  }
  if (listadoTareas.filter(t => t.status === 'completada').length === 0) {
    listaTareasCompletadasDiv.innerHTML = '<p>Aún no has completado ninguna tarea.</p>'
  }

  for (let i = 0; i < listadoTareas.length; i++) {
    const task = listadoTareas[i]

    if (task.status === 'pendiente') {
      // Tarea Pendiente
      const div = document.createElement('div')
      div.className = 'task-card'
      div.innerHTML = `<h3>${task.tarea}</h3><p>${task.desc}</p>`

      const actionsDiv = document.createElement('div')
      actionsDiv.className = 'actions'

      // Botón Completar
      const btnCompletar = document.createElement('button')
      btnCompletar.textContent = 'Completar'
      btnCompletar.className = 'btn-completar'
      btnCompletar.addEventListener('click', () => {
        completarTarea(task.id)
      });

      // Botón Editar
      const btnEditar = document.createElement('button')
      btnEditar.textContent = 'Editar'
      btnEditar.className = 'btn-editar'
      btnEditar.addEventListener('click', () => {
        editarTarea(task.id)
      });

      // Botón Eliminar
      const btnEliminar = document.createElement('button')
      btnEliminar.textContent = 'Eliminar'
      btnEliminar.className = 'btn-eliminar'
      btnEliminar.addEventListener('click', () => {
        eliminarTarea(task.id)
      });

      actionsDiv.appendChild(btnCompletar)
      actionsDiv.appendChild(btnEditar)
      actionsDiv.appendChild(btnEliminar)
      div.appendChild(actionsDiv)
      listaTareasDiv.appendChild(div)

    } else {
      // Tarea Completada
      const div = document.createElement('div')
      div.className = 'task-card completada'

      // Formateo la fecha de forma sencilla
      const fecha = new Date(task.fechaCompletada).toLocaleDateString('es-ES')
      div.innerHTML = `
                    <h3>${task.tarea}</h3>
                    <p>${task.desc}</p>
                    <p class="completion-date">Completada el: ${fecha}</p>`

      const actionsDiv = document.createElement('div')
      actionsDiv.className = 'actions'

      // Botón Restaurar
      const btnRestaurar = document.createElement('button')
      btnRestaurar.textContent = 'Restaurar'
      btnRestaurar.className = 'btn-restaurar'
      btnRestaurar.addEventListener('click', () => {
        restaurarTarea(task.id)
      });

      // Botón Eliminar
      const btnEliminar = document.createElement('button')
      btnEliminar.textContent = 'Eliminar'
      btnEliminar.className = 'btn-eliminar'
      btnEliminar.addEventListener('click', () => {
        eliminarTarea(task.id)
      });

      actionsDiv.appendChild(btnRestaurar)
      actionsDiv.appendChild(btnEliminar)
      div.appendChild(actionsDiv)
      listaTareasCompletadasDiv.appendChild(div)
    }
  }
}

// Función Completar Tarea
function completarTarea(id) {
  for (let i = 0; i < listadoTareas.length; i++) {
    if (listadoTareas[i].id === id) {
      listadoTareas[i].status = 'completada'
      listadoTareas[i].fechaCompletada = new Date()
      break; // Se termina el loop cuando la encuentro
    }
  }
  guardarTareas()
  mostrarListas()
}

// Funcion Restaurar Tarea
function restaurarTarea(id) {
  for (let i = 0; i < listadoTareas.length; i++) {
    if (listadoTareas[i].id === id) {
      listadoTareas[i].status = 'pendiente'
      listadoTareas[i].fechaCompletada = null // Saco la fecha
      break
    }
  }
  guardarTareas()
  mostrarListas()
}

// Función Eliminar Tarea
function eliminarTarea(id) {
  if (!confirm('¿Estás seguro de que querés eliminar esta tarea?')) { // alert de confirmación
    return
  }
  // Creo un nuevo array sin la tarea a eliminar y reemplazo el listado viejo
  const nuevoListado = []
  for (let i = 0; i < listadoTareas.length; i++) {
    if (listadoTareas[i].id !== id) {
      nuevoListado.push(listadoTareas[i])
    }
  }
  listadoTareas = nuevoListado;
  guardarTareas()
  mostrarListas()
}

// Función Editar
function editarTarea(id) {
  let tareaAEditar
  for (let i = 0; i < listadoTareas.length; i++) {
    if (listadoTareas[i].id === id) {
      tareaAEditar = listadoTareas[i]
      break;
    }
  }

  tareaInput.value = tareaAEditar.tarea
  descInput.value = tareaAEditar.desc

  // Oculto el botón Agregar y muestro el botón de Guardar Cambios
  agregarBtn.style.display = 'none'

  if (!document.getElementById('guardarCambiosBtn')) {
    const btnGuardar = document.createElement('button')
    btnGuardar.id = 'guardarCambiosBtn'
    btnGuardar.textContent = 'Guardar Cambios'
    btnGuardar.type = 'button' // No quiero que sea de tipo submit

    btnGuardar.addEventListener('click', function() {
      const nuevaTarea = tareaInput.value.trim()
      const nuevaDesc = descInput.value.trim()

      if (!validacion(nuevaTarea)) {
        return
      }

      tareaAEditar.tarea = nuevaTarea
      tareaAEditar.desc = nuevaDesc

      tareaInput.value = ''
      descInput.value = ''

      // Vuelvo a mostrar el btnAgregar y oculto el de Guardar Cambios
      btnGuardar.remove()
      agregarBtn.style.display = 'block'

      guardarTareas(); // CAMBIO: Guardamos el estado
      mostrarListas()
    })

    form.appendChild(btnGuardar)
  }
}

// LISTENERS

// Listener para agregar tareas
form.addEventListener('submit', function(event) {
  event.preventDefault(); // para que no se mande por defecto
  const tarea = tareaInput.value.trim()
  const desc = descInput.value.trim()

  if (!validacion(tarea)) {
    return
  }

  // Creo la tarea
  const nuevaTarea = {
    id: Date.now(), // para que las tareas tengan un ID único
    tarea: tarea,
    desc: desc,
    status: 'pendiente',
    fechaCompletada: null
  };

  listadoTareas.push(nuevaTarea);

  // Limpio el formulario
  form.reset()

  guardarTareas()
  mostrarListas()
});

// Listeners para las pestañas de navegación
tabPendientes.addEventListener('click', () => {
  seccionPendientes.classList.add('active')
  seccionCompletadas.classList.remove('active')
  tabPendientes.classList.add('active')
  tabCompletadas.classList.remove('active')
});

tabCompletadas.addEventListener('click', () => {
  seccionPendientes.classList.remove('active')
  seccionCompletadas.classList.add('active')
  tabPendientes.classList.remove('active')
  tabCompletadas.classList.add('active')
});

mostrarListas()

// NAVEGACIÓN ENTRE LANDING Y APP
const landingPage = document.getElementById('landing-page')
const appContainer = document.getElementById('app-container')
const ctaButtons = document.querySelectorAll('.js-cta-to-app')
const backButton = document.querySelector('.js-back-to-landing')

function mostrarAplicacion() {
    landingPage.classList.add('hidden')
    appContainer.classList.remove('hidden')
}

// Función para mostrar la landing
function mostrarLanding() {
    appContainer.classList.add('hidden')
    landingPage.classList.remove('hidden')
}

ctaButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        event.preventDefault()
        mostrarAplicacion()
    })
})

// Listener para el botón de Volver
backButton.addEventListener('click', (event) => {
    event.preventDefault();
    mostrarLanding();
});