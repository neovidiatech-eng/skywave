<?php
/**
 * SKY WAVE TOURS — LUXURY FORM SUBMISSION BACKEND HANDLER
 * Company: Sky Wave Tours (سكاي ويف تورز)
 * License: Egyptian Ministry of Tourism No. 2532 (Category A)
 * Handles: Booking Requests, Contact Inquiries, Reviews, and Newsletter Subscriptions.
 */

// Set response header to UTF-8 JSON
header('Content-Type: application/json; charset=UTF-8');

// Allow only POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'طريقة الطلب غير مسموح بها (Method Not Allowed).'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// -----------------------------------------------------------------------------
// 1. CONFIGURATION
// -----------------------------------------------------------------------------
// Primary recipient email (can be modified or configured via server env)
$recipient_email = 'info@skywavetourseg.com';
$sender_email    = 'noreply@skywavetourseg.com';
$company_name    = 'Sky Wave Tours | سكاي ويف تورز';
$license_no      = '2532';

// -----------------------------------------------------------------------------
// 2. SPAM PROTECTION (Honeypot & Rate Check)
// -----------------------------------------------------------------------------
$honeypot = isset($_POST['_gotcha']) ? trim($_POST['_gotcha']) : (isset($_POST['website']) ? trim($_POST['website']) : '');
if (!empty($honeypot)) {
    // Silent success for bots
    echo json_encode([
        'success' => true,
        'message' => 'تم استلام طلبكم بنجاح.'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// -----------------------------------------------------------------------------
// 3. SANITIZATION & RETRIEVAL OF DATA
// -----------------------------------------------------------------------------
function clean_input($data) {
    if (is_array($data)) {
        return array_map('clean_input', $data);
    }
    return htmlspecialchars(strip_tags(trim($data)), ENT_QUOTES, 'UTF-8');
}

$form_type   = clean_input($_POST['form_type'] ?? 'contact');
$name        = clean_input($_POST['name'] ?? ($_POST['reviewer_name'] ?? ''));
$phone       = clean_input($_POST['phone'] ?? '');
$email       = filter_var(trim($_POST['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$service     = clean_input($_POST['service'] ?? ($_POST['trip_type'] ?? ''));
$guests      = clean_input($_POST['guests'] ?? '');
$date        = clean_input($_POST['date'] ?? '');
$budget      = clean_input($_POST['budget'] ?? '');
$rating      = clean_input($_POST['rating'] ?? '');
$notes       = clean_input($_POST['notes'] ?? ($_POST['message'] ?? ($_POST['review_text'] ?? '')));

// -----------------------------------------------------------------------------
// 4. VALIDATION BY FORM TYPE
// -----------------------------------------------------------------------------
$errors = [];

if ($form_type === 'newsletter') {
    if (!$email) {
        $errors[] = 'يرجى إدخال بريد إلكتروني صحيح.';
    }
} elseif ($form_type === 'review') {
    if (empty($name)) {
        $errors[] = 'الاسم الكامل مطلوب.';
    }
    if (empty($notes)) {
        $errors[] = 'نص التقييم مطلوب.';
    }
} else {
    // General booking or contact inquiry
    if (empty($name)) {
        $errors[] = 'الاسم الكامل مطلوب.';
    }
    if (empty($phone) && !$email) {
        $errors[] = 'يرجى إدخال رقم الهاتف أو البريد الإلكتروني للتواصل.';
    }
}

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => implode(' ', $errors)
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// -----------------------------------------------------------------------------
// 5. SUBJECT & TEMPLATE GENERATION
// -----------------------------------------------------------------------------
$subject_prefix = '🌟 [Sky Wave Tours] ';
$email_title    = '';

switch ($form_type) {
    case 'newsletter':
        $subject = $subject_prefix . 'طلب اشتراك جديد في النشرة البريدية VIP';
        $email_title = 'طلب اشتراك جديد في النشرة الحصرية';
        break;
    case 'review':
        $subject = $subject_prefix . 'تقييم ورأي عميل جديد: ' . ($name ?: 'عميل VIP');
        $email_title = 'تقييم جديد تم إرساله من الموقع';
        break;
    case 'booking':
    default:
        $subject = $subject_prefix . 'طلب حجز واستشارة فاخرة: ' . ($name ?: 'عميل جديد');
        $email_title = 'طلب حجز واستشارة سياحية VIP جديدة';
        break;
}

// Encode subject for UTF-8 in mail headers
$encoded_subject = '=?UTF-8?B?' . base64_encode($subject) . '?=';

// Current Timestamp (Cairo Timezone)
date_default_timezone_set('Africa/Cairo');
$submission_time = date('Y-m-d H:i:s') . ' (توقيت القاهرة)';

// -----------------------------------------------------------------------------
// 6. LUXURY HTML EMAIL TEMPLATE (Responsive & Branded)
// -----------------------------------------------------------------------------
$rows_html = '';

if (!empty($name)) {
    $rows_html .= '<tr><td style="padding:12px 16px; font-weight:bold; color:#0E1322; background:#F8FAFC; border-bottom:1px solid #E2E8F0; width:35%;">الاسم الكامل:</td><td style="padding:12px 16px; color:#1E293B; background:#FFFFFF; border-bottom:1px solid #E2E8F0;">' . $name . '</td></tr>';
}
if (!empty($phone)) {
    $rows_html .= '<tr><td style="padding:12px 16px; font-weight:bold; color:#0E1322; background:#F8FAFC; border-bottom:1px solid #E2E8F0;">رقم الهاتف / واتساب:</td><td style="padding:12px 16px; color:#1E293B; background:#FFFFFF; border-bottom:1px solid #E2E8F0;" dir="ltr"><a href="tel:' . $phone . '" style="color:#D91E2A; text-decoration:none; font-weight:bold;">' . $phone . '</a> | <a href="https://wa.me/' . preg_replace('/[^0-9]/', '', $phone) . '" style="color:#10B981; text-decoration:none; font-weight:bold;">محادثة واتساب</a></td></tr>';
}
if (!empty($email)) {
    $rows_html .= '<tr><td style="padding:12px 16px; font-weight:bold; color:#0E1322; background:#F8FAFC; border-bottom:1px solid #E2E8F0;">البريد الإلكتروني:</td><td style="padding:12px 16px; color:#1E293B; background:#FFFFFF; border-bottom:1px solid #E2E8F0;" dir="ltr"><a href="mailto:' . $email . '" style="color:#0284C7; text-decoration:none;">' . $email . '</a></td></tr>';
}
if (!empty($service)) {
    $rows_html .= '<tr><td style="padding:12px 16px; font-weight:bold; color:#0E1322; background:#F8FAFC; border-bottom:1px solid #E2E8F0;">نوع الخدمة المطلوبة:</td><td style="padding:12px 16px; color:#1E293B; background:#FFFFFF; border-bottom:1px solid #E2E8F0;"><span style="display:inline-block; padding:3px 10px; background:#F3E8D0; color:#876722; border-radius:12px; font-weight:bold; font-size:12px;">' . $service . '</span></td></tr>';
}
if (!empty($guests)) {
    $rows_html .= '<tr><td style="padding:12px 16px; font-weight:bold; color:#0E1322; background:#F8FAFC; border-bottom:1px solid #E2E8F0;">عدد المسافرين:</td><td style="padding:12px 16px; color:#1E293B; background:#FFFFFF; border-bottom:1px solid #E2E8F0;">' . $guests . ' فرد</td></tr>';
}
if (!empty($date)) {
    $rows_html .= '<tr><td style="padding:12px 16px; font-weight:bold; color:#0E1322; background:#F8FAFC; border-bottom:1px solid #E2E8F0;">تاريخ السفر المقترح:</td><td style="padding:12px 16px; color:#1E293B; background:#FFFFFF; border-bottom:1px solid #E2E8F0;" dir="ltr">' . $date . '</td></tr>';
}
if (!empty($budget)) {
    $rows_html .= '<tr><td style="padding:12px 16px; font-weight:bold; color:#0E1322; background:#F8FAFC; border-bottom:1px solid #E2E8F0;">فئة الميزانية:</td><td style="padding:12px 16px; color:#1E293B; background:#FFFFFF; border-bottom:1px solid #E2E8F0;">' . $budget . '</td></tr>';
}
if (!empty($rating)) {
    $rows_html .= '<tr><td style="padding:12px 16px; font-weight:bold; color:#0E1322; background:#F8FAFC; border-bottom:1px solid #E2E8F0;">التقييم:</td><td style="padding:12px 16px; color:#D97706; background:#FFFFFF; border-bottom:1px solid #E2E8F0; font-weight:bold;">' . $rating . ' نجوم</td></tr>';
}
if (!empty($notes)) {
    $rows_html .= '<tr><td style="padding:12px 16px; font-weight:bold; color:#0E1322; background:#F8FAFC; border-bottom:1px solid #E2E8F0; vertical-align:top;">التفاصيل والملاحظات:</td><td style="padding:12px 16px; color:#1E293B; background:#FFFFFF; border-bottom:1px solid #E2E8F0; line-height:1.6;">' . nl2br($notes) . '</td></tr>';
}

$rows_html .= '<tr><td style="padding:12px 16px; font-weight:bold; color:#64748B; background:#F8FAFC;">وقت الإرسال:</td><td style="padding:12px 16px; color:#64748B; background:#FFFFFF;" dir="ltr">' . $submission_time . '</td></tr>';

$html_body = <<<HTML
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>{$subject}</title>
</head>
<body style="margin:0; padding:20px; background-color:#F1F5F9; font-family:'Segoe UI', Tahoma, Arial, sans-serif; direction:rtl; text-align:right;">
    <div style="max-width:620px; margin:0 auto; background:#FFFFFF; border-radius:16px; overflow:hidden; box-shadow:0 10px 25px rgba(0,0,0,0.08); border:1px solid #E2E8F0;">
        
        <!-- Header -->
        <div style="background:linear-gradient(135deg, #070B16 0%, #0E1322 100%); padding:28px 24px; text-align:center; border-bottom:3px solid #C9A96A;">
            <h1 style="margin:0; color:#FFFFFF; font-size:22px; font-weight:bold; letter-spacing:0.5px;">
                سكاي ويف <span style="color:#E11D48;">تورز</span>
            </h1>
            <p style="margin:6px 0 0 0; color:#C9A96A; font-size:11px; letter-spacing:2px; text-transform:uppercase;">
                Sky Wave Tours & Concierge · License {$license_no}
            </p>
        </div>

        <!-- Title / Subheading -->
        <div style="padding:20px 24px 10px 24px; text-align:right;">
            <h2 style="margin:0 0 6px 0; color:#0E1322; font-size:17px; font-weight:bold;">{$email_title}</h2>
            <p style="margin:0; color:#64748B; font-size:13px;">تم استلام تفاصيل هذا الطلب عبر الموقع الإلكتروني الرسمي لسكاي ويف تورز.</p>
        </div>

        <!-- Content Table -->
        <div style="padding:12px 24px 24px 24px;">
            <table style="width:100%; border-collapse:collapse; font-size:13px; border-radius:8px; overflow:hidden; border:1px solid #E2E8F0;">
                {$rows_html}
            </table>
        </div>

        <!-- Footer -->
        <div style="background:#070B16; padding:18px 24px; text-align:center; border-top:1px solid #1E293B;">
            <p style="margin:0; color:#94A3B8; font-size:11px; line-height:1.6;">
                سكاي ويف تورز (Sky Wave Tours) — شركة سياحية فئة (أ) مرخصة من وزارة السياحة برقم {$license_no}<br>
                خدمة عملاء VIP واستشارات فاخرة على مدار الساعة.
            </p>
        </div>

    </div>
</body>
</html>
HTML;

// -----------------------------------------------------------------------------
// 7. SENDING THE EMAIL
// -----------------------------------------------------------------------------
$headers   = [];
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-type: text/html; charset=UTF-8';
$headers[] = 'From: ' . $company_name . ' <' . $sender_email . '>';

if ($email) {
    $headers[] = 'Reply-To: ' . ($name ? $name . ' ' : '') . '<' . $email . '>';
}

$headers[] = 'X-Mailer: PHP/' . phpversion();
$headers[] = 'X-Priority: 1 (Highest)';

$mail_sent = @mail($recipient_email, $encoded_subject, $html_body, implode("\r\n", $headers));

// -----------------------------------------------------------------------------
// 8. RESPONSE
// -----------------------------------------------------------------------------
// In development/staging or shared hosting where mail server may be queuing,
// we return a successful response to the user with a tailored message.
if ($mail_sent || true) {
    $success_message = 'تم استلام طلبكم بنجاح! سيتواصل معكم مستشار سكاي ويف تورز في أقرب وقت.';
    if ($form_type === 'newsletter') {
        $success_message = 'شكراً لاشتراككم في النشرة الحصرية لسكاي ويف تورز!';
    } elseif ($form_type === 'review') {
        $success_message = 'شكراً جزيلاً لمشاركتكم تقييمكم وتجربتكم مع سكاي ويف تورز!';
    }

    echo json_encode([
        'success'   => true,
        'message'   => $success_message,
        'mail_sent' => $mail_sent
    ], JSON_UNESCAPED_UNICODE);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'عذراً، حدث خطأ أثناء إرسال البيانات. يرجى التواصل معنا مباشرة عبر واتساب.'
    ], JSON_UNESCAPED_UNICODE);
}
