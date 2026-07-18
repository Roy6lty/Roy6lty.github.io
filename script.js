// Navigation functionality
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // Remove active class from all buttons
    const buttons = document.querySelectorAll('.nav-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected section
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.classList.add('active');
    }

    // Add active class to clicked button
    event.target.classList.add('active');
}

// Add smooth scroll behavior
document.addEventListener('DOMContentLoaded', function() {
    // Terminal content scroll behavior
    const terminalContent = document.querySelector('.terminal-content');
    if (terminalContent) {
        terminalContent.addEventListener('scroll', function() {
            // Add any scroll effects here if needed
        });
    }

    // Add glow effect on hover for links
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.textShadow = '0 0 15px rgba(0, 255, 255, 1)';
        });
        link.addEventListener('mouseleave', function() {
            this.style.textShadow = '';
        });
    });
});

// Keyboard navigation support
document.addEventListener('keydown', function(event) {
    const buttons = document.querySelectorAll('.nav-btn');
    const activeButton = document.querySelector('.nav-btn.active');
    let currentIndex = Array.from(buttons).indexOf(activeButton);

    if (event.key === 'ArrowRight') {
        currentIndex = (currentIndex + 1) % buttons.length;
        buttons[currentIndex].click();
    } else if (event.key === 'ArrowLeft') {
        currentIndex = (currentIndex - 1 + buttons.length) % buttons.length;
        buttons[currentIndex].click();
    }
});