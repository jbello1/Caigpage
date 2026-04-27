document.addEventListener('DOMContentLoaded', function() {

    // =======================================================
    // LÓGICA DEL CARRUSEL DE IMÁGENES
    // =======================================================
    const carouselSlide = document.querySelector('.carousel-slide');
    if (carouselSlide) {
        let counter = 0;
        const images = carouselSlide.querySelectorAll('img');
        const imageCount = images.length;
        if (imageCount > 1) {
            setInterval(() => {
                counter = (counter + 1) % imageCount;
                carouselSlide.style.transition = "transform 0.5s ease-in-out";
                carouselSlide.style.transform = `translateX(-${100 * counter}%)`;
            }, 4000);
        }
    }

    // =======================================================
    // LÓGICA PARA PESTAÑAS DE SERVICIOS
    // =======================================================
    const serviceNavItems = document.querySelectorAll('.service-nav-item');
    if (serviceNavItems.length > 0) {
        const serviceContentPanels = document.querySelectorAll('.service-content-panel');
        serviceNavItems.forEach(navItem => {
            navItem.addEventListener('click', () => {
                const serviceId = navItem.dataset.service;
                serviceNavItems.forEach(item => item.classList.remove('active'));
                serviceContentPanels.forEach(panel => panel.classList.remove('active'));
                navItem.classList.add('active');
                const targetPanel = document.getElementById(serviceId);
                if (targetPanel) {
                    targetPanel.classList.add('active');
                }
            });
        });
    }

    // =======================================================
    // LÓGICA DEL MENÚ HAMBURGUESA (CÓDIGO NUEVO AÑADIDO)
    // =======================================================
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            // Toggle visibility classes for Tailwind
            navMenu.classList.toggle('hidden');
            navMenu.classList.toggle('flex');

            // Cambia el ícono
            const icon = navToggle.querySelector('i');
            if (navMenu.classList.contains('hidden')) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            } else {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times'); // Ícono de 'X'
            }
        });
    }

    // =======================================================
    // LÓGICA PARA LA NUEVA AGENDA CON BUSCADOR (V3)
    // =======================================================
    const agendaPageIdentifier = document.querySelector('.search-section');
    if (agendaPageIdentifier) {
        // --- ZONA DE CONFIGURACIÓN DE LA AGENDA ---
        const whatsappNumber = '56959501189';
        const specialists = [
            {
                id: 1, name: 'Sofía Castro', specialty: 'Terapia Ocupacional', photo: 'imagenes/especialista-1.jpg',
                availability: { '2025-10-20': ['09:00', '10:00'], '2025-10-22': ['15:00'], '2025-11-03': ['10:00'] }
            },
            {
                id: 2, name: 'Mateo Rojas', specialty: 'Terapia Ocupacional', photo: 'imagenes/especialista-2.jpg',
                availability: { '2025-10-21': ['14:00', '15:00'], '2025-10-23': ['09:00'] }
            },
            {
                id: 3, name: 'Ana Gómez', specialty: 'Fonoaudiología', photo: 'imagenes/especialista-3.jpg',
                availability: { '2025-10-27': ['09:00', '11:00'], '2025-10-29': ['16:00'] }
            },
            {
                id: 4, name: 'Carlos Díaz', specialty: 'Psicología Clínica', photo: 'imagenes/especialista-4.jpg',
                availability: { '2025-11-10': ['10:00', '11:00', '12:00'], '2025-11-11': ['15:00'] }
            }
        ];
        // --- FIN DE LA ZONA DE CONFIGURACIÓN ---

        const specialtyFilter = document.getElementById('filter-specialty');
        const nameFilter = document.getElementById('filter-name');
        const searchBtnSpecialty = document.getElementById('search-btn-specialty');
        const searchBtnName = document.getElementById('search-btn-name');
        const resultsContainer = document.getElementById('results-container');
        const tabs = document.querySelectorAll('.tab-link');
        const searchContents = document.querySelectorAll('.search-content');
        const nextHourModal = document.getElementById('next-hour-modal');
        const fullCalendarModal = document.getElementById('full-calendar-modal');
        const modalCloseBtns = document.querySelectorAll('.modal-close');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(item => item.classList.remove('active'));
                searchContents.forEach(content => content.classList.remove('active'));
                tab.classList.add('active');
                document.getElementById(tab.dataset.tab).classList.add('active');
            });
        });
        
        function populateSpecialtyFilter() {
            const specialties = [...new Set(specialists.map(s => s.specialty))];
            specialtyFilter.innerHTML = '<option value="" disabled selected>Seleccione Especialidad</option>';
            specialties.forEach(s => {
                const option = document.createElement('option');
                option.value = s;
                option.textContent = s;
                specialtyFilter.appendChild(option);
            });
        }
        
        searchBtnSpecialty.addEventListener('click', () => {
            const selectedSpecialty = specialtyFilter.value;
            if (selectedSpecialty) {
                const filtered = specialists.filter(s => s.specialty === selectedSpecialty);
                renderResults(filtered);
            }
        });

        searchBtnName.addEventListener('click', () => {
            const searchTerm = nameFilter.value.toLowerCase();
            if (searchTerm) {
                const filtered = specialists.filter(s => s.name.toLowerCase().includes(searchTerm));
                renderResults(filtered);
            }
        });
        
        function renderResults(filteredSpecialists) {
            resultsContainer.innerHTML = '';
            if (filteredSpecialists.length === 0) {
                resultsContainer.innerHTML = '<p class="no-results">No se encontraron especialistas.</p>';
                return;
            }
            const resultsTitle = document.createElement('h2');
            resultsTitle.className = 'results-title';
            resultsTitle.textContent = 'Resultado de búsqueda';
            resultsContainer.appendChild(resultsTitle);
            const grid = document.createElement('div');
            grid.className = 'results-grid';
            filteredSpecialists.forEach(s => {
                const card = document.createElement('div');
                card.className = 'specialist-card-v2';
                card.innerHTML = `
                    <div class="specialist-info">
                        <img src="${s.photo}" alt="${s.name}">
                        <div>
                            <h4>Dr(a). ${s.name}</h4>
                            <p>${s.specialty}</p>
                        </div>
                    </div>
                    <div class="specialist-actions">
                        <button class="btn-reservar-card" data-specialist-id="${s.id}">Reservar hora</button>
                    </div>
                `;
                grid.appendChild(card);
            });
            resultsContainer.appendChild(grid);
        }

        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-reservar-card')) {
                const specialistId = parseInt(e.target.dataset.specialistId, 10);
                openNextHourModal(specialistId);
            }
        });
        
        modalCloseBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                document.getElementById(btn.dataset.modalId).style.display = 'none';
            });
        });

        function findNextAvailable(specialist) {
            const now = new Date();
            const sortedDates = Object.keys(specialist.availability).sort();
            for (const dateStr of sortedDates) {
                const date = new Date(dateStr + 'T00:00:00');
                if (date >= new Date(now.getFullYear(), now.getMonth(), now.getDate())) {
                    const sortedTimes = specialist.availability[dateStr].sort();
                    for (const time of sortedTimes) {
                         const [hour, minute] = time.split(':');
                         const appointmentTime = new Date(date);
                         appointmentTime.setHours(hour, minute);
                         if(appointmentTime > new Date()){
                             return { date: dateStr, time: time };
                         }
                    }
                }
            }
            return null;
        }

        function openNextHourModal(specialistId) {
            const specialist = specialists.find(s => s.id === specialistId);
            const nextHourContent = document.getElementById('next-hour-content');
            const nextAvailable = findNextAvailable(specialist);
            let contentHTML = `<div class="modal-specialist-info"><img src="${specialist.photo}" alt="${specialist.name}"><div><h4>Dr(a). ${specialist.name}</h4><p>${specialist.specialty}</p></div></div><hr>`;
            if (nextAvailable) {
                const date = new Date(nextAvailable.date + 'T00:00:00');
                const formattedDate = date.toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' });
                contentHTML += `<h5>Próxima hora disponible</h5><div class="next-hour-details"><div class="date-info"><strong>${formattedDate}</strong><span>${nextAvailable.time} hrs.</span></div><button class="btn-reservar-final" data-specialist-id="${specialist.id}" data-date="${nextAvailable.date}" data-time="${nextAvailable.time}">RESERVAR</button></div>`;
            } else {
                contentHTML += '<p>No hay horas próximas disponibles para este especialista.</p>';
            }
            contentHTML += `<button class="btn-link" id="show-full-calendar" data-specialist-id="${specialist.id}">VER TODAS LAS HORAS DISPONIBLES</button>`;
            nextHourContent.innerHTML = contentHTML;
            nextHourContent.querySelector('.btn-reservar-final')?.addEventListener('click', handleFinalReservation);
            nextHourContent.querySelector('#show-full-calendar').addEventListener('click', (e) => {
                openFullCalendarModal(parseInt(e.target.dataset.specialistId, 10));
            });
            nextHourModal.style.display = 'flex';
        }

        function handleFinalReservation(e){
            const { specialistId, date, time } = e.target.dataset;
            const specialist = specialists.find(s => s.id === parseInt(specialistId, 10));
            const message = `Hola, quisiera reservar una hora para ${specialist.specialty} con ${specialist.name} el día ${date} a las ${time}.`;
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        }

        function openFullCalendarModal(specialistId) {
            nextHourModal.style.display = 'none';
            const specialist = specialists.find(s => s.id === specialistId);
            const fullCalendarContent = document.getElementById('full-calendar-content');
            fullCalendarContent.innerHTML = `<div class="modal-specialist-info"><img src="${specialist.photo}" alt="${specialist.name}"><div><h4>Dr(a). ${specialist.name}</h4><p>${specialist.specialty}</p></div></div><hr><div class="full-calendar-body"><div class="calendar-container"></div><div class="calendar-time-slots"><h5>Selecciona un día para ver las horas</h5></div></div><button class="btn-link" id="back-to-next-hour" data-specialist-id="${specialist.id}">&lt; Volver</button>`;
            const now = new Date();
            renderFullCalendar(now.getFullYear(), now.getMonth(), specialist);
            fullCalendarContent.querySelector('#back-to-next-hour').addEventListener('click', (e) => {
                fullCalendarModal.style.display = 'none';
                openNextHourModal(parseInt(e.target.dataset.specialistId, 10));
            });
            fullCalendarModal.style.display = 'flex';
        }

        function renderFullCalendar(year, month, specialist) {
            const calendarContainer = document.querySelector('#full-calendar-modal .calendar-container');
            calendarContainer.innerHTML = '';
            const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
            const header = document.createElement('div');
            header.className = 'calendar-header';
            header.innerHTML = `<button class="calendar-nav-btn" id="full-cal-prev">&lt;</button><h4 class="month-title">${monthNames[month]} ${year}</h4><button class="calendar-nav-btn" id="full-cal-next">&gt;</button>`;
            const grid = document.createElement('div');
            grid.className = 'calendar-grid';
             const dayNames = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"];
             dayNames.forEach(name => {
                 const dayNameCell = document.createElement('div');
                 dayNameCell.className = 'calendar-day-name';
                 dayNameCell.textContent = name;
                 grid.appendChild(dayNameCell);
             });
             let firstDay = new Date(year, month, 1).getDay();
             firstDay = (firstDay === 0) ? 6 : firstDay - 1;
             const daysInMonth = new Date(year, month + 1, 0).getDate();
             for (let i = 0; i < firstDay; i++) { grid.appendChild(document.createElement('div')); }
             for (let day = 1; day <= daysInMonth; day++) {
                const dayCell = document.createElement('div');
                dayCell.className = 'calendar-day in-month';
                dayCell.textContent = day;
                const currentDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                if (specialist.availability[currentDateStr] && new Date(currentDateStr) >= new Date().setHours(0,0,0,0)) {
                    dayCell.classList.add('available');
                    dayCell.dataset.date = currentDateStr;
                }
                grid.appendChild(dayCell);
            }
            calendarContainer.appendChild(header);
            calendarContainer.appendChild(grid);
            calendarContainer.querySelector('#full-cal-prev').addEventListener('click', () => {
                const newDate = new Date(year, month - 1, 1);
                renderFullCalendar(newDate.getFullYear(), newDate.getMonth(), specialist);
            });
            calendarContainer.querySelector('#full-cal-next').addEventListener('click', () => {
                const newDate = new Date(year, month + 1, 1);
                renderFullCalendar(newDate.getFullYear(), newDate.getMonth(), specialist);
            });
            calendarContainer.querySelectorAll('.calendar-day.available').forEach(cell => {
                cell.addEventListener('click', () => {
                    calendarContainer.querySelectorAll('.calendar-day.selected').forEach(c => c.classList.remove('selected'));
                    cell.classList.add('selected');
                    const dateStr = cell.dataset.date;
                    const slots = specialist.availability[dateStr];
                    const slotsContainer = document.querySelector('#full-calendar-modal .calendar-time-slots');
                    const date = new Date(dateStr + 'T00:00:00');
                    const formattedDate = date.toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric' });
                    slotsContainer.innerHTML = `<h5>Horas para el ${formattedDate}</h5>`;
                    slots.forEach(time => {
                        const btn = document.createElement('button');
                        btn.className = 'btn-reservar-final';
                        btn.textContent = time;
                        btn.dataset.specialistId = specialist.id;
                        btn.dataset.date = dateStr;
                        btn.dataset.time = time;
                        btn.addEventListener('click', handleFinalReservation);
                        slotsContainer.appendChild(btn);
                    });
                });
            });
        }
        
        populateSpecialtyFilter();
    }
});