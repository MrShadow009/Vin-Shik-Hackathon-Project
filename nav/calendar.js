// Calendar functionality for VinShik Dashboard
class CalendarManager {
    constructor() {
        this.currentDate = new Date();
        this.events = this.loadEvents();
        this.init();
    }

    init() {
        this.renderCalendar();
        this.renderEvents();
        this.bindEvents();
    }

    loadEvents() {
        // Sample events - in real app, this would come from API
        return [
            {
                id: 1,
                title: 'Client Meeting - ABC Corp',
                date: new Date(2024, 11, 15, 10, 0),
                duration: 60,
                color: 'bg-blue-500',
                type: 'meeting'
            },
            {
                id: 2,
                title: 'Job Site Visit - Downtown Project',
                date: new Date(2024, 11, 18, 14, 0),
                duration: 120,
                color: 'bg-green-500',
                type: 'site-visit'
            },
            {
                id: 3,
                title: 'Quote Follow-up - Smith Residence',
                date: new Date(2024, 11, 20, 9, 30),
                duration: 30,
                color: 'bg-purple-500',
                type: 'follow-up'
            },
            {
                id: 4,
                title: 'Team Review Meeting',
                date: new Date(2024, 11, 22, 15, 0),
                duration: 45,
                color: 'bg-orange-500',
                type: 'review'
            }
        ];
    }

    renderCalendar() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        // Update month display
        document.getElementById('currentMonth').textContent = 
            new Date(year, month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        const calendarDays = document.getElementById('calendarDays');
        calendarDays.innerHTML = '';

        // Generate 42 days (6 weeks) for the calendar grid
        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            
            const dayDiv = document.createElement('div');
            dayDiv.className = 'min-h-24 p-2 border-r border-b relative cursor-pointer hover:bg-gray-50';
            
            if (date.getMonth() !== month) {
                dayDiv.classList.add('text-gray-400', 'bg-gray-50');
            }
            
            if (date.toDateString() === new Date().toDateString()) {
                dayDiv.classList.add('bg-teal-50');
            }

            dayDiv.innerHTML = `
                <div class="text-sm font-semibold">${date.getDate()}</div>
                <div class="mt-1 space-y-1">
                    ${this.getEventsForDate(date).map(event => `
                        <div class="text-xs p-1 rounded ${event.color} text-white truncate" 
                             title="${event.title}">
                            ${event.title}
                        </div>
                    `).join('')}
                </div>
            `;

            dayDiv.addEventListener('click', () => this.showDayDetails(date));
            calendarDays.appendChild(dayDiv);
        }
    }

    getEventsForDate(date) {
        return this.events.filter(event => 
            event.date.toDateString() === date.toDateString()
        );
    }

    renderEvents() {
        const eventList = document.getElementById('eventList');
        const upcomingEvents = this.events
            .filter(event => event.date >= new Date())
            .sort((a, b) => a.date - b.date)
            .slice(0, 5);

        eventList.innerHTML = upcomingEvents.map(event => `
            <div class="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border">
                <div class="flex items-center space-x-3">
                    <div class="w-3 h-3 rounded-full ${event.color}"></div>
                    <div>
                        <h4 class="font-semibold">${event.title}</h4>
                        <p class="text-sm text-gray-600">
                            ${event.date.toLocaleDateString()} at ${event.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                    </div>
                </div>
                <div class="flex space-x-2">
                    <button class="text-blue-600 hover:text-blue-800" onclick="calendar.editEvent(${event.id})">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                    <button class="text-red-600 hover:text-red-800" onclick="calendar.deleteEvent(${event.id})">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>
        `).join('');
    }

    bindEvents() {
        document.getElementById('prevMonth').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.renderCalendar();
        });

        document.getElementById('nextMonth').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.renderCalendar();
        });

        // Add event button
        document.querySelector('button[class*="bg-teal-600"]').addEventListener('click', () => {
            this.showAddEventModal();
        });
    }

    showDayDetails(date) {
        const events = this.getEventsForDate(date);
        if (events.length > 0) {
            alert(`Events on ${date.toLocaleDateString()}:\n${events.map(e => `- ${e.title}`).join('\n')}`);
        }
    }

    showAddEventModal() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 class="text-lg font-semibold mb-4">Add New Event</h3>
                <form id="eventForm">
                    <div class="mb-4">
                        <label class="block text-sm font-medium mb-2">Event Title</label>
                        <input type="text" id="eventTitle" class="w-full px-3 py-2 border rounded-lg" required>
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm font-medium mb-2">Date</label>
                        <input type="date" id="eventDate" class="w-full px-3 py-2 border rounded-lg" required>
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm font-medium mb-2">Time</label>
                        <input type="time" id="eventTime" class="w-full px-3 py-2 border rounded-lg" required>
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm font-medium mb-2">Duration (minutes)</label>
                        <input type="number" id="eventDuration" class="w-full px-3 py-2 border rounded-lg" min="15" step="15" value="60">
                    </div>
                    <div class="flex justify-end space-x-2">
                        <button type="button" onclick="this.closest('.fixed').remove()" class="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
                        <button type="submit" class="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">Add Event</button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        document.getElementById('eventForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addEvent({
                title: document.getElementById('eventTitle').value,
                date: new Date(document.getElementById('eventDate').value + 'T' + document.getElementById('eventTime').value),
                duration: parseInt(document.getElementById('eventDuration').value),
                color: 'bg-blue-500',
                type: 'custom'
            });
            modal.remove();
        });
    }

    addEvent(event) {
        event.id = this.events.length + 1;
        this.events.push(event);
        this.renderCalendar();
        this.renderEvents();
    }

    editEvent(id) {
        const event = this.events.find(e => e.id === id);
        if (event) {
            alert(`Edit functionality for: ${event.title}`);
        }
    }

    deleteEvent(id) {
        if (confirm('Are you sure you want to delete this event?')) {
            this.events = this.events.filter(e => e.id !== id);
            this.renderCalendar();
            this.renderEvents();
        }
    }
}

// Initialize calendar when page loads
let calendar;
document.addEventListener('DOMContentLoaded', () => {
    calendar = new CalendarManager();
});
