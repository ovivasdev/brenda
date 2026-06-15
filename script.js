/* --- 1. PRELOADER REFORZADO --- */
function ocultarPreloader() {
    const preloader = document.querySelector('#preloader');
    if (preloader) {
        preloader.classList.add('hidden');
        
        // ESTO ES LO QUE DEVOLVIÓ EL SCROLL:
        document.body.style.overflow = 'auto'; 
        document.documentElement.style.overflow = 'auto';

        setTimeout(() => {
            preloader.style.display = 'none';
        }, 600);
    }
}

// Ejecutar al cargar
window.addEventListener('load', ocultarPreloader);

// SEGURO TOTAL: Si por algo falla el 'load', esto libera la página a los 4 segundos
setTimeout(() => {
    ocultarPreloader();
    // Doble seguridad por si acaso
    document.body.style.overflow = 'auto';
}, 4000);


// Se oculta cuando la ventana termina de cargar
window.addEventListener('load', ocultarPreloader);

// SEGURO: Si pasan 4 segundos y no se ha quitado, lo forzamos
setTimeout(ocultarPreloader, 4000);


/* --- 2. CARGA DINÁMICA DE COMPONENTES --- */
function cargarComponentes() {

      const headerPlaceholder = document.getElementById('main-header-placeholder');
    if (headerPlaceholder) {
        fetch('header.html')
            .then(response => {
                if (!response.ok) throw new Error("No se pudo cargar el header");
                return response.text();
            })
            .then(data => {
                headerPlaceholder.innerHTML = data;
                
                // Ejecutar funciones que dependen del header ya cargado
                marcarPaginaActiva();
                configurarMenuMovil();
                configurarScrollNavbar(headerPlaceholder);
            })
            .catch(err => console.error("Error:", err));
    }

    const footerPlaceholder = document.getElementById('main-footer-placeholder') || document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        fetch('footer.html')
            .then(response => response.text())
            .then(data => {
                footerPlaceholder.innerHTML = data;
            })
            .catch(err => console.error("Error al cargar el footer:", err));
    }
}

/* --- 3. FUNCIONES DE APOYO --- */

function configurarMenuMovil() {
    const mobileMenu = document.querySelector('#mobile-menu');
    const navPanel = document.querySelector('.nav-panel');
    const menuList = document.querySelector('.menu');

    if (mobileMenu && navPanel) {
        mobileMenu.addEventListener('click', () => {
            navPanel.classList.toggle('active');
            const icon = mobileMenu.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-xmark');
            }
        });

        // Cerrar menú al hacer click en un link, excepto el disparador del dropdown
        menuList.querySelectorAll('li a').forEach(item => {
            item.addEventListener('click', (e) => {
                if (item.closest('.dropdown') && !item.closest('.submenu')) {
                    e.preventDefault();
                    return;
                }
                navPanel.classList.remove('active');
            });
        });

        // Manejar dropdown en móvil
        const dropdown = menuList.querySelector('.dropdown');
        if (dropdown) {
            const dropdownLink = dropdown.querySelector('a');
            if (dropdownLink) {
                dropdownLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const submenu = dropdown.querySelector('.submenu');
                    if (submenu) {
                        submenu.classList.toggle('show');
                        dropdown.classList.toggle('open', submenu.classList.contains('show'));
                    }
                });
            }
        }
    }
}

function configurarScrollNavbar(placeholder) {
    // Buscamos la etiqueta <header> que está dentro del placeholder cargado
    const headerElement = placeholder.querySelector('header') || document.querySelector('#main-header-placeholder header');
    
    if (headerElement) {
        const navbarElement = headerElement.querySelector('.navbar');

        if (!navbarElement) {
            console.error("No se encontró .navbar dentro del header");
            return;
        }

        console.log("Navbar encontrado:", navbarElement);

        // Función interna para manejar el cambio
        const toggleScrollClass = () => {
            // Usar document.body.scrollTop ya que el scroll está en body
            const scrollTop = document.body.scrollTop || document.documentElement.scrollTop || window.scrollY;
            
            console.log(`scrollTop desde body: ${scrollTop}`);
            
            if (scrollTop > 50) {
                navbarElement.classList.add('nav-scrolled');
                navbarElement.style.setProperty('background-color', '#222', 'important');
                navbarElement.style.setProperty('background', '#222', 'important');
                console.log("✅ Scroll activado, navbar con fondo #222");
            } else {
                navbarElement.classList.remove('nav-scrolled');
                navbarElement.style.setProperty('background-color', 'transparent', 'important');
                navbarElement.style.setProperty('background', 'transparent', 'important');
                console.log("⬆️ Scroll desactivado, navbar transparente");
            }
        };

        // Escuchar el evento de scroll en document.body
        document.addEventListener('scroll', toggleScrollClass, true);
        
        // También en window por si acaso
        window.addEventListener('scroll', toggleScrollClass);
        
        // Ejecutar al cargar por si la página ya está abajo
        toggleScrollClass();
    } else {
        console.error("No se encontró la etiqueta <header> para el scroll");
    }
}

function marcarPaginaActiva() {
    const path = window.location.pathname;
    const page = path.split("/").pop();
    const links = document.querySelectorAll('#main-header-placeholder a');

    links.forEach(link => {
        link.classList.remove('nav-active');
        const href = link.getAttribute('href');

        if (page === href && href !== "") {
            link.classList.add('nav-active');
        } else if ((page === "" || page === "index.html") && href === "index.html") {
            link.classList.add('nav-active');
        }
    });
}

/* --- 4. INICIALIZACIÓN --- */
document.addEventListener('DOMContentLoaded', () => {
    cargarComponentes();

    // Inicializar Historia si existe en la página
    if (document.querySelector('.history-step')) {
        showStep(0);
    }
});

/* --- 5. LÓGICA DE LA HISTORIA INTERACTIVA --- */
let currentStep = 0;

function showStep(index) {
    const steps = document.querySelectorAll('.history-step');
    const dots = document.querySelectorAll('.nav-dot');

    if (steps.length === 0) return;

    steps.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));

    if(steps[index]) steps[index].classList.add('active');
    if(dots[index]) dots[index].classList.add('active');
    currentStep = index;
}

function nextStep() {
    const steps = document.querySelectorAll('.history-step');
    if (steps.length === 0) return;

    let next = currentStep + 1;
    if (next >= steps.length) next = 0;
    showStep(next);
}

/* --- 6. EFECTOS DE REVELADO (REVEAL) --- */
window.addEventListener('scroll', () => {
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach(el => {
        const windowHeight = window.innerHeight;
        const elementTop = el.getBoundingClientRect().top;
        if (elementTop < windowHeight - 100) {
            el.classList.add('active');
        }
    });
});

/* --- LÓGICA DE RESERVAS DINÁMICAS --- */

function updateQty(tipo, val) {
    const qtyInput = document.getElementById('qty-' + tipo);
    if (!qtyInput) return;

    let current = parseInt(qtyInput.value);
    if (current + val >= 0) {
        qtyInput.value = current + val;
        generarCamposPasajeros(); // Crea los inputs de Nombre/DNI
        actualizarTicket();      // Actualiza el Pase de Abordaje
    }
}

function generarCamposPasajeros() {
    const container = document.getElementById('passengers-data-container');
    const qAdulto = parseInt(document.getElementById('qty-adulto').value) || 0;
    const qNino = parseInt(document.getElementById('qty-nino').value) || 0;
    const qEscolar = parseInt(document.getElementById('qty-escolar').value) || 0;
    
    const total = qAdulto + qNino + qEscolar;
    if (!container) return;

    container.innerHTML = ""; // Limpia los campos anteriores

    if (total === 0) {
        container.innerHTML = '<p class="sutil-text">Selecciona la cantidad de personas para ingresar sus datos.</p>';
        return;
    }

    // Creamos una fila de inputs por cada persona seleccionada
    for (let i = 1; i <= total; i++) {
        const div = document.createElement('div');
        div.className = 'passenger-input-row';
        div.style.marginBottom = "15px";
        div.innerHTML = `
            <span style="color: #E9B44C; font-size: 0.8rem; display: block; margin-bottom: 5px;">Pasajero ${i}</span>
            <div style="display: flex; gap: 10px;">
                <input type="text" placeholder="Nombre Completo" class="pass-name" style="flex: 2; padding: 10px; border-radius: 5px; border: 1px solid #333; background: #000; color: #fff;" oninput="actualizarTicket()">
                <input type="text" placeholder="DNI" class="pass-dni" maxlength="8" style="flex: 1; padding: 10px; border-radius: 5px; border: 1px solid #333; background: #000; color: #fff;">
            </div>
        `;
        container.appendChild(div);
    }
}

function actualizarTicket() {
    // 1. Cálculos de dinero y personas
    const qAdulto = parseInt(document.getElementById('qty-adulto').value) || 0;
    const qNino = parseInt(document.getElementById('qty-nino').value) || 0;
    const qEscolar = parseInt(document.getElementById('qty-escolar').value) || 0;
    
    const totalPersonas = qAdulto + qNino + qEscolar;
    const montoTotal = (qAdulto * 20) + (qNino * 15) + (qEscolar * 10);

    // 2. Actualizar la lista de nombres en el Pase de Abordaje
    const inputsNombre = document.querySelectorAll('.pass-name');
    const listaTicket = document.getElementById('ticket-passengers-list');
    
    if (listaTicket) {
        listaTicket.innerHTML = ""; // Limpiar lista
        let escribiendo = false;

        inputsNombre.forEach((input, index) => {
            if (input.value.trim() !== "") {
                const li = document.createElement('li');
                li.style.marginBottom = "5px";
                li.innerText = `${index + 1}. ${input.value.toUpperCase()}`;
                listaTicket.appendChild(li);
                escribiendo = true;
            }
        });

        if (!escribiendo) {
            listaTicket.innerHTML = "<li>Esperando nombres...</li>";
        }
    }

    // 3. Actualizar datos de texto en el Ticket
    const summaryDate = document.getElementById('summary-date');
    const summaryQty = document.getElementById('summary-qty');
    const summaryTotal = document.getElementById('summary-total');
    const inputFecha = document.getElementById('res-date');

    if (summaryDate) summaryDate.innerText = inputFecha.value || "DD/MM/AA";
    if (summaryQty) summaryQty.innerText = totalPersonas + (totalPersonas === 1 ? " Persona" : " Personas");
    if (summaryTotal) summaryTotal.innerText = "S/ " + montoTotal.toFixed(2);
}

let listaPasajeros = [];
let contadorId = 0;

// 1. Inicializar con el primer pase al cargar
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('pases-dinamicos')) {
        agregarNuevoPase();
    }
});

function agregarNuevoPase() {
    contadorId++;
    const container = document.getElementById('pases-dinamicos');
    
    const div = document.createElement('div');
    div.className = 'pase-input-block reveal active';
    div.id = `block-${contadorId}`;
    div.style.width = "100%"; // Asegura el estiramiento
    div.innerHTML = `
        <div class="pase-header">
            <span>PASAJERO #${contadorId}</span>
            ${contadorId > 1 ? `<button class="btn-delete" onclick="eliminarPase(${contadorId})"><i class="fas fa-trash"></i></button>` : ''}
        </div>
        <div class="input-group">
            <select class="p-tipo" onchange="actualizarTodo()">
                <option value="20">Adulto - S/ 20.00</option>
                <option value="15">Niño (5-11) - S/ 15.00</option>
                <option value="10">Escolar/Profesor - S/ 10.00</option>
            </select>
        </div>
        <div class="input-row-container">
            <input type="text" class="p-nombre" placeholder="Nombre Completo" oninput="actualizarTodo()">
            <input type="tel" class="p-dni" placeholder="DNI" maxlength="8" oninput="actualizarTodo()">
        </div>
    `;
    container.appendChild(div);
    actualizarTodo();
}

function actualizarTodo() {
    const bloques = document.querySelectorAll('.pase-input-block');
    let totalDinero = 0;
    const listaConsolidada = document.getElementById('lista-consolidada');
    const ticketActual = document.getElementById('ticket-actual');
    
    listaConsolidada.innerHTML = "";
    
    bloques.forEach((bloque, index) => {
        const nombre = bloque.querySelector('.p-nombre').value || "Esperando nombre...";
        const dni = bloque.querySelector('.p-dni').value || "--------";
        const precio = parseFloat(bloque.querySelector('.p-tipo').value);
        const tipoText = bloque.querySelector('.p-tipo').options[bloque.querySelector('.p-tipo').selectedIndex].text.split('-')[0];

        totalDinero += precio;

        // Añadir al consolidado visual
        const item = document.createElement('div');
        item.className = 'consolidado-item';
        item.innerHTML = `<span>${nombre} (${tipoText})</span> <span>S/ ${precio.toFixed(2)}</span>`;
        listaConsolidada.appendChild(item);

        // Si es el último que se está escribiendo, mostrarlo en el Ticket Grande
        if (index === bloques.length - 1) {
            renderizarTicketGrande(nombre, dni, tipoText, precio);
        }
    });

    document.getElementById('monto-final').innerText = `S/ ${totalDinero.toFixed(2)}`;
}

function renderizarTicketGrande(nombre, dni, tipo, precio) {
    const container = document.getElementById('ticket-actual');
    container.innerHTML = `
        <div class="ticket-preview active">
            <div class="ticket-header"><span>B.A.P. ABTAO</span> <span>PASAJERO ACTUAL</span></div>
            <div class="ticket-body">
                <p><small>NOMBRE:</small><br><strong>${nombre.toUpperCase()}</strong></p>
                <p><small>DOCUMENTO:</small><br><strong>${dni}</strong></p>
                <div class="ticket-info">
                    <span><i class="fas fa-anchor"></i> ${tipo}</span>
                    <span>S/ ${precio.toFixed(2)}</span>
                </div>
            </div>
            <div class="ticket-footer"><i class="fas fa-barcode"></i></div>
        </div>
    `;
}

function eliminarPase(id) {
    document.getElementById(`block-${id}`).remove();
    actualizarTodo();
}
