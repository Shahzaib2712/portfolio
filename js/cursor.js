document.addEventListener('DOMContentLoaded', function() {
    // Create cursor element
    const cursor = document.createElement('div');
    cursor.className = 'tech-cursor';
    document.body.appendChild(cursor);
    
    // Track cursor position
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    
    // Smooth cursor movement
    const ease = 0.2;
    
    // Track if mouse is moving
    let isMoving = false;
    let moveTimeout;
    
    // Update cursor position
    const handleMouseMove = (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Show cursor if it was hidden
        cursor.style.opacity = '1';
        
        // Set moving state
        isMoving = true;
        clearTimeout(moveTimeout);
        moveTimeout = setTimeout(() => {
            isMoving = false;
        }, 100);
    };
    
    // Smooth animation loop
    const animate = () => {
        // Calculate new position with easing
        const dx = (mouseX - cursorX) * ease;
        const dy = (mouseY - cursorY) * ease;
        
        cursorX += dx;
        cursorY += dy;
        
        // Apply position to cursor
        cursor.style.transform = `translate(calc(${cursorX}px - 50%), calc(${cursorY}px - 50%))`;
        
        // Add subtle scale effect when moving
        if (isMoving) {
            const distance = Math.sqrt(dx * dx + dy * dy);
            const scale = Math.min(1 + distance * 0.01, 1.2);
            cursor.style.transform += ` scale(${scale})`;
        }
        
        requestAnimationFrame(animate);
    };
    
    // Start animation
    animate();
    
    // Interactive elements
    const interactiveElements = [
        'a', 'button', '.btn', 'input', 'textarea', 'select', 
        '[role="button"]', '[tabindex]', 'label', 'i', '.icon',
        '.project-card', '.tool-item', '.ai-tool-item', '.ai-project-card',
        'img', '.social-link', '.nav-link'
    ];
    
    // Add hover and click effects for interactive elements
    const addInteractiveEffects = () => {
        interactiveElements.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                // Mouse enter
                el.addEventListener('mouseenter', () => {
                    cursor.classList.add('interactive');
                });
                
                // Mouse leave
                el.addEventListener('mouseleave', () => {
                    cursor.classList.remove('interactive');
                });
                
                // Click effect
                el.addEventListener('mousedown', () => {
                    cursor.classList.add('click-effect');
                });
                
                el.addEventListener('mouseup', () => {
                    cursor.classList.remove('click-effect');
                });
                
                el.addEventListener('mouseleave', () => {
                    cursor.classList.remove('click-effect');
                });
            });
        });
    };
    
    // Initialize interactive effects
    addInteractiveEffects();
    
    // Re-apply effects for dynamically loaded content
    const observer = new MutationObserver((mutations) => {
        addInteractiveEffects();
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // Hide cursor when not in window
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
    });
    
    // Start listening to mouse movement
    document.addEventListener('mousemove', handleMouseMove);
});
