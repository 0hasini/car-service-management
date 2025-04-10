document.getElementById('login-btn').addEventListener('click', function(e) {
    e.preventDefault();
    
    // In a real app, you would have actual authentication here
    // For demo purposes, we'll just redirect to the booking page
    window.location.href = 'booking.html';
}); 
    document.addEventListener('DOMContentLoaded', () => {
        // Navbar scroll effect
        const navbar = document.querySelector('.navbar');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // FAQ accordion
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', () => {
                item.classList.toggle('active');
            });
        });


        // Car models mapping
        const carModelMap = {
            'tesla': ['Model 3', 'Model Y', 'Model S', 'Model X'],
            'tata': ['Nexon EV', 'Tigor EV', 'Punch EV'],
            'mahindra': ['XUV400', 'eVerito'],
            'mg': ['ZS EV', 'Comet EV'],
            'hyundai': ['Kona Electric', 'Ioniq Electric'],
            'other': ['Other Electric Model']
        };

        // Update car models based on brand selection
        carBrandSelect.addEventListener('change', () => {
            const selectedBrand = carBrandSelect.value;
            carModelSelect.innerHTML = '<option value="">Choose Model</option>';
            
            if (carModelMap[selectedBrand]) {
                carModelMap[selectedBrand].forEach(model => {
                    const option = document.createElement('option');
                    option.value = model;
                    option.textContent = model;
                    carModelSelect.appendChild(option);
                });
            }
        });

        // Radio button styling
        const radioButtons = form.querySelectorAll('input[type="radio"]');
        radioButtons.forEach(radio => {
            radio.addEventListener('change', () => {
                const label = form.querySelector(label[`for=${radio.id}`]);
                if (radio.checked) {
                    label.classList.remove('btn-outline');
                    label.classList.add('btn-primary');
                } else {
                    label.classList.remove('btn-primary');
                    label.classList.add('btn-outline');
                }
            });
        });

        // Form navigation
        let currentStep = 0;
        
        function showStep(stepIndex) {
            formSteps.forEach((step, index) => {
                step.classList.toggle('active', index === stepIndex);
                steps[index].classList.toggle('active', index === stepIndex);
                steps[index].classList.toggle('completed', index < stepIndex);
            });
            
            // Update progress bar
            const progress = (stepIndex / (steps.length - 1)) * 100;
            progressBar.style.width = `${progress}%`;
            
            currentStep = stepIndex;
        }
        
        nextButtons.forEach(button => {
            button.addEventListener('click', () => {
                const currentStepElement = button.closest('.form-step');
                const inputs = currentStepElement.querySelectorAll('input, select, textarea');
                let isValid = true;
                
                inputs.forEach(input => {
                    if (!input.value.trim() && input.hasAttribute('required')) {
                        isValid = false;
                        input.classList.add('error');
                    } else {
                        input.classList.remove('error');
                    }
                });
                
                if (isValid) {
                    showStep(currentStep + 1);
                }
            });
        });
        
        prevButtons.forEach(button => {
            button.addEventListener('click', () => {
                showStep(currentStep - 1);
            });
        });
        
        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Service booked successfully! Our representative will contact you shortly to confirm your appointment.');
            form.reset();
            showStep(0);
            
            // Reset radio button styles
            document.querySelectorAll('label[for^="basic-package"], label[for^="premium-package"], label[for^="pickup-yes"], label[for^="pickup-no"]').forEach(label => {
                label.classList.remove('btn-primary');
                label.classList.add('btn-outline');
            });
        });
        
        // Initialize date picker with min date (today)
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const yyyy = today.getFullYear();
        const minDate = `${yyyy}-${mm}-${dd}`;
        document.getElementById('service-date').min = minDate;
    });
