
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize the dashboard
    await loadMechanicDashboard();

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Tab functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const bookingCards = document.querySelectorAll('.booking-card');
    const emptyState = document.getElementById('empty-state');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active tab
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const tab = button.dataset.tab;
            filterBookingsByTab(tab);
        });
    });

    // Refresh button functionality
    document.querySelector('.btn-primary').addEventListener('click', async () => {
        await loadMechanicDashboard();
    });
});

async function loadMechanicDashboard() {
    try {
        // Get the mechanic ID from localStorage (set during login)
        const mechanicId = localStorage.getItem('user_id');
        
        if (!mechanicId) {
            console.error('Mechanic ID not found in localStorage');
            // Redirect to login if no mechanic ID found
            window.location.href = 'login.html';
            return;
        }

        // Update welcome message with mechanic's name
        await updateWelcomeMessage(mechanicId);
        
        // Fetch and display bookings
        await fetchAndDisplayBookings(mechanicId);
        
    } catch (err) {
        console.error("Error loading dashboard:", err);
        alert("Failed to load dashboard data. Please try again.");
    }
}

async function updateWelcomeMessage(mechanicId) {
    const Fname = localStorage.getItem('Fname');
    const Lname = localStorage.getItem('Lname');
    try {
        const response = await fetch(`http://localhost:3000/users/${mechanicId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const mechanic = await response.json();
        const welcomeMessage = document.querySelector('.welcome-message');
        
        if (welcomeMessage && mechanic) {
            welcomeMessage.innerHTML = `Welcome back, <strong>${Fname} ${Lname}</strong> (ID: MECH-${mechanicId})`;
        }
    } catch (err) {
        console.error("Error updating welcome message:", err);
    }
}

async function fetchAndDisplayBookings(mechanicId) {
    try {
        const response = await fetch(`http://localhost:3000/bookings/mechanic/${mechanicId}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const bookings = await response.json();
        
        // Process and display the bookings data
        updateBookingCards(bookings);
        updateStatsCards(bookings);
        
    } catch (err) {
        console.error("Error fetching mechanic bookings:", err);
        alert("Failed to load bookings. Please try again later.");
    }
}

// Function to update booking cards based on API data
function updateBookingCards(bookings) {
    const bookingCardsContainer = document.querySelector('.booking-cards');
    
    // Clear existing cards except the empty state
    const emptyState = document.getElementById('empty-state');
    bookingCardsContainer.innerHTML = '';
    bookingCardsContainer.appendChild(emptyState);
    
    if (bookings.length === 0) {
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    
    // Create and append new booking cards
    bookings.forEach(booking => {
        const bookingCard = createBookingCard(booking);
        bookingCardsContainer.appendChild(bookingCard);
    });
    
    // Re-activate tab filtering
    const activeTab = document.querySelector('.tab-btn.active')?.dataset.tab || 'pending';
    filterBookingsByTab(activeTab);
}

// Function to update stats cards
function updateStatsCards(bookings) {
    const pendingCount = bookings.filter(b => b.status === 'Pending').length;
    const inProgressCount = bookings.filter(b => b.status === 'In Progress').length;
    const completedCount = bookings.filter(b => b.status === 'Completed').length;
    
    document.querySelectorAll('.stat-card').forEach(card => {
        const label = card.querySelector('.stat-card-label').textContent;
        const valueEl = card.querySelector('.stat-card-value');
        
        if (label === 'Pending Jobs') {
            valueEl.textContent = pendingCount;
        } else if (label === 'In Progress') {
            valueEl.textContent = inProgressCount;
        } else if (label === 'Completed') {
            valueEl.textContent = completedCount;
        }
    });
}

// Helper function to filter bookings based on active tab
function filterBookingsByTab(tabName) {
    const bookingCards = document.querySelectorAll('.booking-card');
    let hasVisibleCards = false;
    
    bookingCards.forEach(card => {
        if (tabName === 'all' || card.dataset.status === tabName.replace(' ', '-')) {
            card.style.display = 'block';
            hasVisibleCards = true;
        } else {
            card.style.display = 'none';
        }
    });
    
    document.getElementById('empty-state').style.display = hasVisibleCards ? 'none' : 'block';
}

// Helper function to create a booking card element from booking data
function createBookingCard(booking) {
    const card = document.createElement('div');
    card.className = 'booking-card';
    card.dataset.status = booking.status.toLowerCase().replace(' ', '-');
    
    // Format date for display
    const bookingDate = new Date(booking.service_date);
    const formattedDate = bookingDate.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
    
    // Set the inner HTML based on booking data
    card.innerHTML = `
        <div class="booking-card-header">
            <div class="booking-id">Booking #CS-${booking.booking_id}</div>
            <span class="booking-status status-${booking.status.toLowerCase().replace(' ', '-')}">
                ${booking.status}
            </span>
            <h3>${booking.service_name}</h3>
            <p><i class="fas fa-calendar-alt"></i> ${formattedDate}, ${booking.time_slot}</p>
        </div>
        <div class="booking-card-body">
            <div class="booking-detail">
                <div class="booking-detail-icon">
                    <i class="fas fa-car"></i>
                </div>
                <div class="booking-detail-content">
                    <h4>Vehicle Details</h4>
                    <p>${booking.brand} ${booking.model} (${booking.reg_year}) • ${booking.reg_no}</p>
                </div>
            </div>
            
            <div class="booking-detail">
                <div class="booking-detail-icon">
                    <i class="fas fa-user"></i>
                </div>
                <div class="booking-detail-content">
                    <h4>Customer</h4>
                    <p>${booking.customer_name} • ${booking.phone_number}</p>
                </div>
            </div>
            
            <div class="booking-detail">
                <div class="booking-detail-icon">
                    <i class="fas fa-map-marker-alt"></i>
                </div>
                <div class="booking-detail-content">
                    <h4>Location</h4>
                    <p>${booking.street_name}, ${booking.city}</p>
                </div>
            </div>
            
            <div class="booking-detail">
                <div class="booking-detail-icon">
                    <i class="fas fa-sticky-note"></i>
                </div>
                <div class="booking-detail-content">
                    <h4>${booking.status === 'Completed' ? 'Work Done' : 'Special Requests'}</h4>
                    <p>${booking.special_request || 'No special requests'}</p>
                </div>
            </div>
            
            <div class="booking-actions">
                ${getActionsForStatus(booking.status, booking.booking_id)}
            </div>
        </div>
    `;
    
    // Add event listeners to the buttons
    addEventListenersToCard(card, booking);
    
    return card;
}

// Helper function to get action buttons based on booking status
function getActionsForStatus(status, bookingId) {
    switch(status) {
        case 'Pending':
            return `
                <button class="btn btn-success" data-booking-id="${bookingId}" data-action="accept">
                    <i class="fas fa-check"></i> Accept
                </button>
                <button class="btn btn-danger" data-booking-id="${bookingId}" data-action="reject">
                    <i class="fas fa-times"></i> Reject
                </button>
            `;
        case 'In Progress':
            return `
                <button class="btn btn-primary" data-booking-id="${bookingId}" data-action="call">
                    <i class="fas fa-phone"></i> Call Customer
                </button>
                <button class="btn btn-success" data-booking-id="${bookingId}" data-action="complete">
                    <i class="fas fa-check-circle"></i> Mark Complete
                </button>
            `;
        case 'Completed':
            return `
                <button class="btn btn-outline" data-booking-id="${bookingId}" data-action="invoice">
                    <i class="fas fa-file-alt"></i> View Invoice
                </button>
            `;
        default:
            return '';
    }
}

// Add event listeners to card buttons
function addEventListenersToCard(card, booking) {
    // Accept button
    const acceptBtn = card.querySelector('[data-action="accept"]');
    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            updateBookingStatus(booking.booking_id, 'In Progress');
        });
    }
    
    // Reject button
    const rejectBtn = card.querySelector('[data-action="reject"]');
    if (rejectBtn) {
        rejectBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to reject this booking?')) {
                updateBookingStatus(booking.booking_id, 'Cancelled');
            }
        });
    }
    
    // Mark Complete button
    const completeBtn = card.querySelector('[data-action="complete"]');
    if (completeBtn) {
        completeBtn.addEventListener('click', () => {
            updateBookingStatus(booking.booking_id, 'Completed');
        });
    }
    
    // Call button
    const callBtn = card.querySelector('[data-action="call"]');
    if (callBtn) {
        callBtn.addEventListener('click', () => {
            window.location.href = `tel:${booking.phone_number}`;
        });
    }
}

// Function to update booking status
async function updateBookingStatus(bookingId, newStatus) {
    try {
        const response = await fetch(`http://localhost:3000/bookings/${bookingId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatus })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        // Refresh bookings after update
        const mechanicId = localStorage.getItem('user_id');
        await fetchAndDisplayBookings(mechanicId);
        alert(`Booking ${newStatus.toLowerCase()} successfully!`);
        
    } catch (err) {
        console.error(`Error updating booking status:`, err);
        alert(`Failed to update booking status. Please try again.`);
    }
}