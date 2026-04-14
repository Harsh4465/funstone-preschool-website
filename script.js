// Initialize Supabase Client from global window object
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', () => {
    // 1. Sticky Header functionality
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        checkScrollAnimations();
    });

    checkScrollAnimations();

    // 2. Mobile Menu functionality
    const hamburger = document.getElementById('hamburger');
    const navbar = document.getElementById('navbar');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navbar.classList.toggle('active');
            const icon = hamburger.querySelector('i');
            if (navbar.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });
    }

    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navbar.classList.remove('active');
            if (hamburger) {
                const icon = hamburger.querySelector('i');
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });
    });

    // 3. Admission Form Submission with Supabase
    const admissionForm = document.getElementById('admissionForm');
    const formSuccess = document.getElementById('formSuccess');
    const formError = document.getElementById('formError');
    const submitBtn = document.getElementById('submitBtn');
    
    if (admissionForm) {
        admissionForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Get form values
            const childName = document.getElementById('childName').value.trim();
            const childAge = document.getElementById('childAge').value.trim();
            const parentName = document.getElementById('parentName').value.trim();
            const phone = document.getElementById('phoneNumber').value.trim();
            
            // Validate required fields
            if (!childName || !phone) return;

            // Set loading state
            const originalBtnContent = submitBtn.innerHTML;
            submitBtn.innerHTML = 'Applying... <i class="fa-solid fa-spinner fa-spin"></i>';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';
            
            // Hide previous messages
            formSuccess.classList.add('hidden');
            formError.classList.add('hidden');

            try {
                // Insert into Supabase table: admissions
                const { data, error } = await supabaseClient
                    .from('admissions')
                    .insert([
                        { 
                            child_name: childName, 
                            age: childAge, 
                            parent_name: parentName, 
                            phone: phone 
                        }
                    ]);

                if (error) throw error;
                
                // Show success message
                formSuccess.classList.remove('hidden');
                admissionForm.reset();
                
            } catch (error) {
                console.error('Error submitting form:', error);
                // Show error message with exact details
                formError.innerHTML = 'Something went wrong: ' + (error.message || 'Unknown error') + '. Please try again.';
                formError.classList.remove('hidden');
            } finally {
                // Restore button state
                submitBtn.innerHTML = originalBtnContent;
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
                
                // Hide messages after 5 seconds
                setTimeout(() => {
                    formSuccess.classList.add('hidden');
                    formError.classList.add('hidden');
                }, 5000);
            }
        });
    }

    // 4. Reveal Animations on Scroll
    function checkScrollAnimations() {
        const animatedElements = document.querySelectorAll('.slide-in-left, .slide-in-right, .fade-in-up');
        animatedElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            if (rect.top <= windowHeight * 0.85) {
                el.style.opacity = '1';
            }
        });
    }
});
