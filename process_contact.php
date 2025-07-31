<?php
// Include configuration file
require_once 'config.php';

// Set headers for JSON response
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Function to sanitize input data
function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Function to validate email
function isValidEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

// Function to send email
function sendEmail($name, $email, $subject, $message) {
    // Email configuration from config file
    $to = CONTACT_EMAIL;
    $from = FROM_EMAIL;
    $fromName = FROM_NAME;
    
    // Email headers
    $headers = array();
    $headers[] = 'MIME-Version: 1.0';
    $headers[] = 'Content-type: text/html; charset=UTF-8';
    $headers[] = 'From: ' . $fromName . ' <' . $from . '>';
    $headers[] = 'Reply-To: ' . $name . ' <' . $email . '>';
    $headers[] = 'X-Mailer: PHP/' . phpversion();
    
    // Email subject
    $emailSubject = EMAIL_TEMPLATE_TITLE . ': ' . $subject;
    
    // Email body
    $emailBody = '
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>' . EMAIL_TEMPLATE_TITLE . '</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(45deg, #007bff, #00d4ff); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #007bff; }
            .value { margin-top: 5px; }
            .message-box { background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #007bff; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>' . EMAIL_TEMPLATE_TITLE . '</h1>
                <p>' . EMAIL_TEMPLATE_SUBTITLE . '</p>
            </div>
            <div class="content">
                <div class="field">
                    <div class="label">Name:</div>
                    <div class="value">' . htmlspecialchars($name) . '</div>
                </div>
                <div class="field">
                    <div class="label">Email:</div>
                    <div class="value">' . htmlspecialchars($email) . '</div>
                </div>
                <div class="field">
                    <div class="label">Subject:</div>
                    <div class="value">' . htmlspecialchars($subject) . '</div>
                </div>
                <div class="field">
                    <div class="label">Message:</div>
                    <div class="message-box">' . nl2br(htmlspecialchars($message)) . '</div>
                </div>
                <div class="field">
                    <div class="label">Submission Time:</div>
                    <div class="value">' . date('Y-m-d H:i:s') . '</div>
                </div>
                <div class="field">
                    <div class="label">IP Address:</div>
                    <div class="value">' . $_SERVER['REMOTE_ADDR'] . '</div>
                </div>
            </div>
        </div>
    </body>
    </html>';
    
    // Send email
    $mailSent = mail($to, $emailSubject, $emailBody, implode("\r\n", $headers));
    
    return $mailSent;
}

// Function to save to database (optional)
function saveToDatabase($name, $email, $subject, $message) {
    try {
        // Database configuration from config file
        $host = DB_HOST;
        $dbname = DB_NAME;
        $username = DB_USER;
        $password = DB_PASS;
        
        // Create PDO connection
        $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        // Prepare SQL statement
        $sql = "INSERT INTO contact_messages (name, email, subject, message, ip_address, created_at) 
                VALUES (:name, :email, :subject, :message, :ip_address, NOW())";
        
        $stmt = $pdo->prepare($sql);
        
        // Bind parameters
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':subject', $subject);
        $stmt->bindParam(':message', $message);
        $stmt->bindParam(':ip_address', $_SERVER['REMOTE_ADDR']);
        
        // Execute statement
        $stmt->execute();
        
        return true;
    } catch (PDOException $e) {
        // Log error (don't expose database details to user)
        error_log("Database error: " . $e->getMessage());
        return false;
    }
}

// Function to log contact attempts
function logContactAttempt($success, $data) {
    if (!ENABLE_LOGGING) return;
    
    $logFile = 'contact_log.txt';
    $timestamp = date('Y-m-d H:i:s');
    $ip = $_SERVER['REMOTE_ADDR'];
    $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';
    
    $logEntry = "[$timestamp] IP: $ip | Success: " . ($success ? 'Yes' : 'No') . " | Data: " . json_encode($data) . " | User-Agent: $userAgent\n";
    
    file_put_contents($logFile, $logEntry, FILE_APPEND | LOCK_EX);
}

// Main processing logic
try {
    // Get form data
    $name = isset($_POST['name']) ? sanitizeInput($_POST['name']) : '';
    $email = isset($_POST['email']) ? sanitizeInput($_POST['email']) : '';
    $subject = isset($_POST['subject']) ? sanitizeInput($_POST['subject']) : '';
    $message = isset($_POST['message']) ? sanitizeInput($_POST['message']) : '';
    
    // Validation
    $errors = array();
    
    if (empty($name)) {
        $errors[] = 'Name is required';
    }
    
    if (empty($email)) {
        $errors[] = 'Email is required';
    } elseif (!isValidEmail($email)) {
        $errors[] = 'Please enter a valid email address';
    }
    
    if (empty($subject)) {
        $errors[] = 'Subject is required';
    }
    
    if (empty($message)) {
        $errors[] = 'Message is required';
    }
    
    // Check for spam/bot detection (honeypot)
    if (ENABLE_HONEYPOT) {
        $honeypot = isset($_POST['website']) ? $_POST['website'] : '';
        if (!empty($honeypot)) {
            // This is likely a bot, silently ignore
            echo json_encode(['success' => true, 'message' => 'Message sent successfully!']);
            exit;
        }
    }
    
    // Rate limiting
    if (ENABLE_RATE_LIMITING) {
        $ip = $_SERVER['REMOTE_ADDR'];
        $rateLimitFile = 'rate_limit_' . md5($ip) . '.txt';
        $currentTime = time();
        $rateLimitWindow = RATE_LIMIT_WINDOW;
        $maxRequests = MAX_REQUESTS;
        
        if (file_exists($rateLimitFile)) {
            $rateLimitData = json_decode(file_get_contents($rateLimitFile), true);
            if ($rateLimitData && ($currentTime - $rateLimitData['timestamp']) < $rateLimitWindow) {
                if ($rateLimitData['count'] >= $maxRequests) {
                    http_response_code(429);
                    echo json_encode(['success' => false, 'message' => 'Too many requests. Please try again later.']);
                    exit;
                }
                $rateLimitData['count']++;
            } else {
                $rateLimitData = ['timestamp' => $currentTime, 'count' => 1];
            }
        } else {
            $rateLimitData = ['timestamp' => $currentTime, 'count' => 1];
        }
        
        file_put_contents($rateLimitFile, json_encode($rateLimitData));
    }
    
    // If there are validation errors
    if (!empty($errors)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => implode(', ', $errors)]);
        logContactAttempt(false, ['errors' => $errors, 'data' => $_POST]);
        exit;
    }
    
    // Send email
    $emailSent = sendEmail($name, $email, $subject, $message);
    
    // Try to save to database (optional)
    $dbSaved = false;
    // Uncomment the next line if you want to save to database
    // $dbSaved = saveToDatabase($name, $email, $subject, $message);
    
    if ($emailSent) {
        // Success response
        echo json_encode([
            'success' => true, 
            'message' => 'Thank you for your message! I\'ll get back to you soon.',
            'data' => [
                'name' => $name,
                'email' => $email,
                'subject' => $subject
            ]
        ]);
        logContactAttempt(true, ['email_sent' => true, 'db_saved' => $dbSaved]);
    } else {
        // Email failed
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Sorry, there was an error sending your message. Please try again later.']);
        logContactAttempt(false, ['email_sent' => false, 'data' => $_POST]);
    }
    
} catch (Exception $e) {
    // Log the error
    error_log("Contact form error: " . $e->getMessage());
    
    // Generic error response
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'An unexpected error occurred. Please try again later.']);
    logContactAttempt(false, ['exception' => $e->getMessage(), 'data' => $_POST]);
}

// Function to create database table (run this once to set up the database)
function createContactTable() {
    $sql = "
    CREATE TABLE IF NOT EXISTS contact_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        ip_address VARCHAR(45) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_created_at (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ";
    
    // Execute this SQL in your database management tool
    return $sql;
}

// Uncomment the line below to see the SQL for creating the table
// echo createContactTable();
?>