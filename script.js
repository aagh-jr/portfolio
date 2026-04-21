// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe project items for scroll animations
document.querySelectorAll('.project-item').forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(item);
});

// Subtle parallax effect on scroll (optional, very gentle)
let lastScroll = 0;
const heroContent = document.querySelector('.hero-content');

if (heroContent) {
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= window.innerHeight) {
            const opacity = 1 - (currentScroll / window.innerHeight) * 0.3;
            heroContent.style.opacity = opacity;
        }
        
        lastScroll = currentScroll;
    }, { passive: true });
}

// Add hover effect to project images
document.querySelectorAll('.project-item').forEach(item => {
    const image = item.querySelector('.project-image');
    
    item.addEventListener('mouseenter', () => {
        image.style.transform = 'scale(1.01)';
    });
    
    item.addEventListener('mouseleave', () => {
        image.style.transform = 'scale(1)';
    });
});
