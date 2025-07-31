<?php
// Portfolio Website Configuration
// Update these settings according to your needs

// Email Configuration
define('CONTACT_EMAIL', 'shahzaibikram563@gmail.com'); // Your email where you want to receive messages
define('FROM_EMAIL', 'noreply@shahzaibkhan.online'); // Your domain email (for sending)
define('FROM_NAME', 'Portfolio Contact Form'); // Sender name

// Database Configuration (Optional - for storing messages)
define('DB_HOST', 'localhost');
define('DB_NAME', 'portfolio_db');
define('DB_USER', 'your_username');
define('DB_PASS', 'your_password');

// Rate Limiting Settings
define('RATE_LIMIT_WINDOW', 3600); // Time window in seconds (1 hour)
define('MAX_REQUESTS', 5); // Maximum requests per window

// Debug Mode (set to false in production)
define('DEBUG_MODE', true);

// Security Settings
define('ENABLE_HONEYPOT', true);
define('ENABLE_RATE_LIMITING', true);
define('ENABLE_LOGGING', true);

// Email Template Settings
define('EMAIL_TEMPLATE_TITLE', 'New Contact Form Submission');
define('EMAIL_TEMPLATE_SUBTITLE', 'Someone has contacted you through your portfolio website');

// Contact Information (for display on website)
define('DISPLAY_PHONE', '+92 304 8855814');
define('DISPLAY_EMAIL', 'shahzaibikram563@gmail.com');
define('DISPLAY_EMAIL_INFO', 'info@shahzaibkhan.online');
define('DISPLAY_WEBSITE', 'www.shahzaibkhan.online');
define('DISPLAY_ADDRESS', 'Area 32B - Korangi 1 Karachi, Pakistan');

// Social Media Links (update with your actual links)
define('LINKEDIN_URL', '#');
define('GITHUB_URL', '#');
define('TWITTER_URL', '#');
define('INSTAGRAM_URL', '#');

// Website Settings
define('SITE_NAME', 'Shahzaib Khan - Portfolio');
define('SITE_DESCRIPTION', 'Full Stack Developer Portfolio');
define('SITE_KEYWORDS', 'web developer, full stack, PHP, Laravel, JavaScript, portfolio');

// Analytics (optional)
define('GOOGLE_ANALYTICS_ID', ''); // Add your Google Analytics ID here

// SMTP Settings (if using SMTP instead of mail() function)
define('USE_SMTP', false);
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_USERNAME', 'your-email@gmail.com');
define('SMTP_PASSWORD', 'your-app-password');
define('SMTP_SECURE', 'tls');

// File Upload Settings
define('MAX_FILE_SIZE', 10485760); // 10MB in bytes
define('ALLOWED_FILE_TYPES', ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx']);

// Cache Settings
define('ENABLE_CACHE', false);
define('CACHE_DURATION', 3600); // 1 hour

// Error Reporting
if (DEBUG_MODE) {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
} else {
    error_reporting(0);
    ini_set('display_errors', 0);
}

// Time Zone
date_default_timezone_set('Asia/Karachi');

// Session Settings
ini_set('session.cookie_httponly', 1);
ini_set('session.use_only_cookies', 1);
ini_set('session.cookie_secure', 0); // Set to 1 if using HTTPS

// Security Headers
if (!headers_sent()) {
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: SAMEORIGIN');
    header('X-XSS-Protection: 1; mode=block');
    header('Referrer-Policy: strict-origin-when-cross-origin');
}

// Include this file in process_contact.php to use these settings
?>