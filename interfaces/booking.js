    // Global variables to store user and API configuration
    const API_BASE_URL = 'http://localhost:3000';
    let currentUser = {
        id: null,
        role: null,
        name: null
    };
    
    // Car models mapping
    const carModelMap = {
        'tesla': ['Model 3', 'Model Y', 'Model S', 'Model X'],
        'tata': ['Nexon EV', 'Tigor EV', 'Punch EV'],
        'mahindra': ['XUV400', 'eVerito'],
        'mg': ['ZS EV', 'Comet EV'],
        'hyundai': ['Kona Electric', 'Ioniq Electric'],
        'other': ['Other Electric Model']
    };

    // Initialize the page when DOM is loaded
    document.addEventListener('DOMContentLoaded', async () => {
        // Initialize UI components
        initUI();
        
        // Load user data from localStorage (set during login)
        const user_id = localStorage.getItem("user_id");
        const Fname = localStorage.getItem("Fname");
        const Lname = localStorage.getItem("Lname");
        const role = localStorage.getItem("role") || "Customer";
        
        if (user_id && Fname && Lname) {
            await initUserData(user_id, role, `${Fname} ${Lname}`);
        } else {
            // Redirect to login if no user data found
            window.location.href = "login.html";
        }
    });
    
    async function initUI() {
        // Navbar scroll effect
        const navbar = document.querySelector('.navbar');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    
        // Initialize date picker with min date (today)
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const yyyy = today.getFullYear();
        const minDate = `${yyyy}-${mm}-${dd}`;
        document.getElementById('service-date').min = minDate;
    
        // Vehicle Management Elements
        const addVehicleBtn = document.getElementById('add-vehicle-btn');
        const vehicleModal = document.getElementById('vehicle-modal');
        const closeModal = document.getElementById('close-modal');
        const vehicleForm = document.getElementById('vehicle-form');
        const vehicleBrandSelect = document.getElementById('vehicle-brand');
        const vehicleModelSelect = document.getElementById('vehicle-model');
        
        // Show/hide modal
        addVehicleBtn.addEventListener('click', () => {
            vehicleModal.style.display = 'flex';
        });
    
        closeModal.addEventListener('click', () => {
            vehicleModal.style.display = 'none';
        });
    
        // Set up event listeners for brand selection
        vehicleBrandSelect.addEventListener('change', () => {
            populateModels(vehicleBrandSelect, vehicleModelSelect);
        });
    
        // Save vehicle form handler
        vehicleForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const vehicleData = {
                reg_no: document.getElementById('vehicle-reg-number').value,
                brand: vehicleBrandSelect.value,
                model: vehicleModelSelect.value,
                reg_year: document.getElementById('vehicle-year').value,
                variant: document.getElementById('vehicle-variant').value,
                customer_id: currentUser.id
            };
            
            try {
                const response = await fetch(`${API_BASE_URL}/vehicles`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(vehicleData)
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to save vehicle');
                }
                
                await loadUserVehicles();
                this.reset();
                vehicleModal.style.display = 'none';
                showSuccess('Vehicle added successfully!');
            } catch (error) {
                console.error('Error saving vehicle:', error);
                showError(error.message || 'Failed to save vehicle. Please try again.');
            }
        });
    
        // Set up form navigation
        setupFormNavigation();
        
        // Load services
        await loadServices();
    }
    
    // Initialize user data and load related information
    async function initUserData(userId, role, name) {
        currentUser.id = userId;
        currentUser.role = role;
        currentUser.name = name;
        
        // Load user's vehicles and bookings
        await loadUserVehicles();
        await loadUserBookings();
    }
    
    // Load user's vehicles from backend
    async function loadUserVehicles() {
        try {
            const response = await fetch(`${API_BASE_URL}/vehicles?customer_id=${currentUser.id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch vehicles');
            }
            
            const vehicles = await response.json();
            
            // Update vehicles dropdown
            const selectedVehicleSelect = document.getElementById('selected-vehicle');
            selectedVehicleSelect.innerHTML = '<option value="">Choose a vehicle</option>';
            
            vehicles.forEach(vehicle => {
                const option = document.createElement('option');
                option.value = vehicle.reg_no;
                option.textContent = `${vehicle.brand} ${vehicle.model} (${vehicle.reg_no})`;
                option.setAttribute('data-brand', vehicle.brand);
                option.setAttribute('data-model', vehicle.model);
                option.setAttribute('data-year', vehicle.reg_year);
                selectedVehicleSelect.appendChild(option);
            });
            
            // Update vehicles list display
            displayVehicles(vehicles);
        } catch (error) {
            console.error('Error loading user vehicles:', error);
            showError('Failed to load your vehicles. Please try again.');
        }
    }
    
    // Display vehicles in the UI
    function displayVehicles(vehicles) {
        const vehiclesList = document.getElementById('vehicles-list');
        vehiclesList.innerHTML = '';
        
        if (vehicles.length === 0) {
            vehiclesList.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--gray);">No vehicles added yet. Click "Add Vehicle" to get started.</p>';
            return;
        }
        
        vehicles.forEach(vehicle => {
            const vehicleCard = document.createElement('div');
            vehicleCard.className = 'vehicle-card';
            vehicleCard.style.background = 'white';
            vehicleCard.style.padding = '1rem';
            vehicleCard.style.borderRadius = '8px';
            vehicleCard.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
            
            vehicleCard.innerHTML = `
                <h3 style="margin: 0 0 0.5rem;">${vehicle.brand} ${vehicle.model}</h3>
                <p style="margin: 0.2rem 0; font-size: 0.9rem;"><strong>Reg No:</strong> ${vehicle.reg_no}</p>
                <p style="margin: 0.2rem 0; font-size: 0.9rem;"><strong>Year:</strong> ${vehicle.reg_year}</p>
                <button class="btn btn-outline" style="margin-top: 0.5rem; padding: 0.3rem 0.5rem; font-size: 0.8rem;" 
                        onclick="deleteVehicle('${vehicle.reg_no}')">
                    <i class="fas fa-trash"></i> Remove
                </button>
            `;
            
            vehiclesList.appendChild(vehicleCard);
        });
    }
    
    // Delete vehicle from backend
    async function deleteVehicle(regNo) {
        if (confirm('Are you sure you want to delete this vehicle?')) {
            try {
                const response = await fetch(`${API_BASE_URL}/vehicles/${regNo}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        customer_id: currentUser.id
                    })
                });
                
                if (!response.ok) {
                    throw new Error('Failed to delete vehicle');
                }
                
                // Refresh vehicles list
                await loadUserVehicles();
                showSuccess('Vehicle deleted successfully!');
            } catch (error) {
                console.error('Error deleting vehicle:', error);
                showError(error.message || 'Failed to delete vehicle. Please try again.');
            }
        }
    }
    
    async function loadUserBookings() {
        try {
            console.log("[DEBUG] Starting to load bookings...");
            
            // First try with hardcoded user ID 1 to eliminate variable issues
            const testUserId = 1;
            const apiUrl = "http://localhost:3000/bookings/customer/1";
            console.log("[DEBUG] Calling API:", apiUrl);
            
            const response = await fetch(apiUrl, {
                method: "GET",
                headers: { 
                    "Content-Type": "application/json",
                }
            });

            console.log("[DEBUG] Response status:", response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error("[DEBUG] API Error Response:", errorText);
                throw new Error(`Server returned ${response.status}: ${errorText}`);
            }
            
            const bookings = await response.json();
            console.log("[DEBUG] Received bookings data:", bookings);
            
            if (!Array.isArray(bookings)) {
                throw new Error("Invalid data format - expected array");
            }
            
            displayBookings(bookings);
            
        } catch (error) {
            console.error("[DEBUG] Full error details:", {
                message: error.message,
                stack: error.stack,
                name: error.name
            });
            showError(error.message || 'Failed to load your bookings. Please try again.');
        }
    }

    async function testApiCall() {
        try {
            const response = await fetch(`http://localhost:3000/bookings/customer/${currentUser.id}`);
            console.log("Raw response:", response);
            const text = await response.text();
            console.log("Response text:", text);
            const json = JSON.parse(text); // Try parsing manually
            console.log("Parsed JSON:", json);
        } catch (err) {
            console.error("Test failed:", err);
        }
    }

    // Call it immediately to test
    testApiCall();

    // Display bookings in the UI
    function displayBookings(bookings) {
        const bookingsList = document.getElementById('bookings-list');
        const emptyState = document.getElementById('empty-bookings');
        
        if (bookings.length === 0) {
            bookingsList.innerHTML = '';
            emptyState.style.display = 'block';
            return;
        }
        
        emptyState.style.display = 'none';
        
        // Sort bookings by date (newest first)
        bookings.sort((a, b) => new Date(b.service_date) - new Date(a.service_date));
        
        bookingsList.innerHTML = bookings.map(booking => {
            // Determine status class based on booking status
            let statusClass = 'status-pending';
            if (booking.status === 'In Progress') statusClass = 'status-in-progress';
            if (booking.status === 'Completed') statusClass = 'status-completed';
            if (booking.status === 'Cancelled') statusClass = 'status-cancelled';
            
            // Format date
            const serviceDate = new Date(booking.service_date);
            const formattedDate = serviceDate.toLocaleDateString('en-US', {
                weekday: 'short', 
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            
            // Format time slot
            let timeSlot = '';
            if (booking.time_slot === 'Morning') timeSlot = '9AM - 12PM';
            else if (booking.time_slot === 'Afternoon') timeSlot = '12PM - 3PM';
            else if (booking.time_slot === 'Evening') timeSlot = '3PM - 6PM';
            
            return `
                <div class="booking-card" data-status="${booking.status.toLowerCase().replace(' ', '-')}">
                    <div class="booking-card-header">
                        <div class="booking-id">Booking #${booking.booking_id}</div>
                        <span class="booking-status ${statusClass}">${booking.status}</span>
                        <h3>${booking.service_name}</h3>
                        <p><i class="fas fa-calendar-alt"></i> ${formattedDate}, ${timeSlot}</p>
                    </div>
                    <div class="booking-card-body">
                        <div class="booking-detail">
                            <div class="booking-detail-icon">
                                <i class="fas fa-car"></i>
                            </div>
                            <div class="booking-detail-content">
                                <h4>Vehicle Details</h4>
                                <p>${booking.vehicle_brand} ${booking.vehicle_model} (${booking.reg_no}) • ${booking.reg_year}</p>
                            </div>
                        </div>
                        
                        ${(booking.status === 'Pending' || booking.status === 'In Progress') ? `
                        <div class="booking-detail">
                            <div class="booking-detail-icon">
                                <i class="fas fa-user-cog"></i>
                            </div>
                            <div class="booking-detail-content">
                                <h4>Assigned Mechanic</h4>
                                <p>${booking.mechanic_name || 'Not assigned yet'}</p>
                            </div>
                        </div>
                        ` : ''}
                        
                        <div class="booking-detail">
                            <div class="booking-detail-icon">
                                <i class="fas fa-money-bill-wave"></i>
                            </div>
                            <div class="booking-detail-content">
                                <h4>Service Price</h4>
                                <p>₹${parseFloat(booking.price).toFixed(2)}</p>
                            </div>
                        </div>
                        
                        ${booking.special_request ? `
                        <div class="booking-detail">
                            <div class="booking-detail-icon">
                                <i class="fas fa-sticky-note"></i>
                            </div>
                            <div class="booking-detail-content">
                                <h4>Special Requests</h4>
                                <p>${booking.special_request}</p>
                            </div>
                        </div>` : ''}
                        
                        ${booking.status === 'Pending' ? `
                        <div class="booking-actions">
                            <button class="btn btn-outline" onclick="cancelBooking(${booking.booking_id})">
                                <i class="fas fa-times"></i> Cancel
                            </button>
                        </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');
    
        initBookingTabs();
    }
    
    // Initialize booking tabs filtering
    function initBookingTabs() {
        const tabButtons = document.querySelectorAll('.booking-tab-btn');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active tab
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Filter bookings
                const statusFilter = button.dataset.tab;
                const bookingCards = document.querySelectorAll('.booking-card');
                
                bookingCards.forEach(card => {
                    if (statusFilter === 'all' || card.dataset.status === statusFilter) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
    
    // Cancel booking
    async function cancelBooking(bookingId) {
        if (confirm('Are you sure you want to cancel this booking?')) {
            try {
                const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        user_id: currentUser.id,
                        role: currentUser.role
                    })
                });
                
                if (!response.ok) {
                    throw new Error('Failed to cancel booking');
                }
                
                // Refresh bookings list
                await loadUserBookings();
                showSuccess('Booking cancelled successfully!');
            } catch (error) {
                console.error('Error cancelling booking:', error);
                showError('Failed to cancel booking. Please try again.');
            }
        }
    }
    
    // Load services from backend
    async function loadServices() {
        try {
            const response = await fetch(`${API_BASE_URL}/services`);
            if (!response.ok) {
                throw new Error('Failed to fetch services');
            }
            
            const services = await response.json();
            populateServiceDropdown(services);
        } catch (error) {
            console.error('Error loading services:', error);
            showError('Failed to load services. Please try again.');
        }
    }
    
    // Populate service dropdown
    function populateServiceDropdown(services) {
        const serviceSelect = document.getElementById('service-type');
        serviceSelect.innerHTML = '<option value="">Choose Service</option>';
        
        services.forEach(service => {
            const option = document.createElement('option');
            option.value = service.service_id;
            option.textContent = service.service_name;
            serviceSelect.appendChild(option);
        });
    }
    
    // Populate car models based on brand selection
    function populateModels(brandSelect, modelSelect) {
        const selectedBrand = brandSelect.value;
        modelSelect.innerHTML = '<option value="">Choose Model</option>';
        
        if (selectedBrand && carModelMap[selectedBrand]) {
            carModelMap[selectedBrand].forEach(model => {
                const option = document.createElement('option');
                option.value = model.toLowerCase().replace(/\s+/g, '-');
                option.textContent = model;
                modelSelect.appendChild(option);
            });
        }
    }
    
    // Setup form navigation and submission
    function setupFormNavigation() {
        const form = document.getElementById('booking-form');
        const formSteps = form.querySelectorAll('.form-step');
        const nextButtons = form.querySelectorAll('.next-step');
        const prevButtons = form.querySelectorAll('.prev-step');
        const steps = form.querySelectorAll('.step');
        const progressBar = form.querySelector('.progress-bar');
        const confirmButton = document.getElementById('confirm-booking');
        
        let currentStep = 0;
        
        function showStep(stepIndex) {
            formSteps.forEach((step, index) => {
                step.classList.toggle('active', index === stepIndex);
                steps[index].classList.toggle('active', index === stepIndex);
                steps[index].classList.toggle('completed', index < stepIndex);
            });
            
            // Update progress bar (33%, 66%, 100%)
            const progress = (stepIndex / (steps.length - 1)) * 100;
            progressBar.style.width = `${progress}%`;
            
            currentStep = stepIndex;
        }
        
        nextButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const currentStepElement = button.closest('.form-step');
                if (validateStep(currentStepElement)) {
                    showStep(currentStep + 1);
                }
            });
        });
        
        prevButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                showStep(currentStep - 1);
            });
        });
        
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Validate all steps before submission
            let allStepsValid = true;
            formSteps.forEach(step => {
                if (!validateStep(step)) {
                    allStepsValid = false;
                }
            });
            
            if (!allStepsValid) {
                showError('Please complete all required fields in all steps');
                return;
            }
            
            // Get selected vehicle details
            const selectedVehicle = document.getElementById('selected-vehicle');
            const selectedOption = selectedVehicle.options[selectedVehicle.selectedIndex];
            
            if (!selectedOption.value) {
                showError('Please select a valid vehicle');
                showStep(0);
                return;
            }

            const serviceType = document.getElementById('service-type').value;
            if (!serviceType) {
                showError('Please select a service type');
                return;
            }

            // Prepare booking data
            const bookingData = {
                user_id: currentUser.id,
                reg_no: selectedOption.value,
                car_brand: selectedOption.getAttribute('data-brand'),
                car_model: selectedOption.getAttribute('data-model'),
                registration_year: selectedOption.getAttribute('data-year'),
                service_type: document.getElementById('service-type').value,
                service_date: document.getElementById('service-date').value,
                time_slot: capitalizeFirstLetter(document.getElementById('service-time').value),
                pickup_option: document.getElementById('service-pickup').value,
                special_request: document.getElementById('special-requests').value || null
            };

            try {
                // Submit to backend
                const response = await fetch(`${API_BASE_URL}/bookings`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(bookingData)
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to create booking');
                }
                
                const bookingResponse = await response.json();
                
                // Show success message
                showSuccess('Booking confirmed successfully!');
                
                // Reset form (but keep vehicle selection)
                document.getElementById('service-type').value = '';
                document.getElementById('service-date').value = '';
                document.getElementById('service-time').value = '';
                document.getElementById('service-pickup').value = '';
                document.getElementById('special-requests').value = '';
                
                showStep(0);
                
                // Reload bookings to show the new one
                await loadUserBookings();
            } catch (error) {
                console.error('Booking error:', error);
                showError(`Booking failed: ${error.message}`);
            }
        });
    }
    
    // Validate all inputs in a form step
    function validateStep(stepElement) {
        const inputs = stepElement.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('error');
                
                if (!input.nextElementSibling || !input.nextElementSibling.classList.contains('error-message')) {
                    const errorMsg = document.createElement('div');
                    errorMsg.className = 'error-message';
                    errorMsg.textContent = 'This field is required';
                    input.parentNode.insertBefore(errorMsg, input.nextSibling);
                }
            } else {
                input.classList.remove('error');
                const errorMsg = input.nextElementSibling;
                if (errorMsg && errorMsg.classList.contains('error-message')) {
                    errorMsg.remove();
                }
            }
        });
        
        if (!isValid) {
            // Scroll to first error
            const firstError = stepElement.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return false;
        }
        
        return true;
    }
    
    // Helper function to capitalize first letter
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    // Show error message to user
    function showError(message) {
        const errorElement = document.createElement('div');
        errorElement.id = 'error-message';
        errorElement.style.position = 'fixed';
        errorElement.style.top = '20px';
        errorElement.style.right = '20px';
        errorElement.style.background = '#f72585';
        errorElement.style.color = 'white';
        errorElement.style.padding = '1rem 2rem';
        errorElement.style.borderRadius = '5px';
        errorElement.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        errorElement.style.zIndex = '1000';
        errorElement.textContent = message;
        
        document.body.appendChild(errorElement);
        
        setTimeout(() => {
            errorElement.remove();
        }, 5000);
    }
    
    // Show success message
    function showSuccess(message) {
        const successElement = document.getElementById('success-message');
        successElement.textContent = message;
        successElement.style.display = 'block';
        setTimeout(() => {
            successElement.style.display = 'none';
        }, 5000);
    }