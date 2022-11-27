
// Para guardar toda la info de los eventos 
let events = [];
// Para cargar las informacion para despues, asignarla a eventos
let arr = [];

const eventName = document.querySelector('#eventName')
const eventDate= document.querySelector('#eventDate')
const buttonAdd = document.querySelector('#bAdd')
const eventsContainer = document.querySelector('#eventsContainer')

// Para cargar las informacion para despues, asignarla a eventos
const json = load();

// Si esto sucede: 
try {
    arr = JSON.parse(json); 
    // si no hay informacion esto va a ser undefined
} catch (error) {
    arr  = [];
    // si pasa eso quiero que arr siga teniendo su valor inicial
}
// Si no sucede, como arr esta vacio, events va a seguir siendo vacio, y si arr tiene informaion, events va a contener la lista de eventos que guardamos previamente, si no entra en el catch vamos a tener que evaluar
events = arr ? [...arr] : []
// esto quiere decir que si arr existe(si no es undefined) quiero que tome toda la info contenida, y si no que arr siga estando vacio 




// cuando carguemos la aplicacion solo va a existir la informacion pero tenemos mandar a llamar a renderEvents() para que la dibuje, la informacion se guarda cada vez que creamos un evento

document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    addEvent();
} )

buttonAdd.addEventListener('click', (e) => {
    e.preventDefault();
    addEvent();
} )

function addEvent() {
    if (eventName.value === '' || eventDate.value === '') {
        return;
    }

    // si la diferencia de fecha es menor a 0, significa que la fecha paso 
    if (dateDiff(eventDate.value) < 0) {
        return;
    }

    // y si no quiero que ocurra esto, quiero que se cree este objeto 
    const newEvent = {
        id: (Math.random() * 100).toString(36).slice(3), 
        name: eventName.value, 
        date: eventDate.value,
    };

    // y ese objeto quiero que se agregue a events 
    events.unshift(newEvent);

    // para guarda la informacion en arr y que se cargue luego 
    save(JSON.stringify(events))
    // y que vuelva a estar vacio el input 
    eventName.value = '';

    renderEvents()
}

// esta funcion me a regresar el numero de dias que faltan desde la fecha actual hasta la fecha destino 
function dateDiff(d){
    const targetDate = new Date(d);
    // Date() puede crear una instancia de fecha o devolver una cadena que represente la hora actual
    const today = new Date();
    // getTime va a regresar el tiempo en un numero, correspondiente a la hora especificada
    // esta operacion regresa la fecha destino menos la fecha actual
    const difference = targetDate.getTime() - today.getTime();
    // math.ceil redondea un valor hacia el siguiente numero 
    // esto significa: la diferencia que tengo de mi numero dividido entre un dia
    const days = Math.ceil(difference / (1000 * 3600 * 24))
    return days;
}

// funcion para renderizar los elementos   
function renderEvents() {
    const eventsHTML = events.map(event => {
        return `
            <div class="event">
                <div class="days">
                    <span class="days-number">${dateDiff(event.date)}</span>
                    <span class="days-text">dias</span>
                </div>

                <div class="event-name">${event.name}</div>
                <div class="event-date">${event.date}</div>
                <div class="actions">
                    <button class="bDelete" data-id="${event.id}">Eliminar</button>
                </div>
            </div>
        `;
    })
    eventsContainer.innerHTML = eventsHTML.join('');

    // PARA DARLE INTERACTIVIDAD AL BOTON ELIMINAR : 
    document.querySelectorAll('.bDelete').forEach(button => {
        button.addEventListener('click', e => {
            // primero quiero obtener el id de ese boton 
            const id = button.getAttribute('data-id');
            // ahora quiero eliminarlos, para eso es el filter, va a buscar en el arreglo todos los elemntos donde el id sea diferente al id que estoy obteniendo, de esta forma regresa todos los elementos, menos el id que coincida  : 
            events = events.filter(event => event.id !== id);

            // el save es para que al eliminar se guarden los cambios 
            save(JSON.stringify(events));
            // y por ultimo volvemos a llamar la funcion: 
            renderEvents()
        })
    })
}

// event.id es un valor que le pasamos al div del boton para que sepa cual es el elemento a eliminar 


// AHORA QUIERO ALMACENAR CADA UNO DE LOS EVENTOS PARA DESPUES CARGARLOS AL MOMENTO DE ABRIR NUESTRA APLICACION, PARA ESO USAMOS EL LOCALSTORAGE QUE ES EL API DE ALMACENAMIENTO QUE TENEMOS EN JS PARA NUESTRO NAVEGADOR 
function save(data) {
    // localStorage es el objeto de almacenamiento, tiene un metodo setItem() y necesitamos un nombre a lo que vayamos a guardar 
    localStorage.setItem('items', data)
}

// Aqui vamos a hacer lo contrario
function load() {
    return localStorage.getItem('items')
}