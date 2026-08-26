<?php
// Carica i dati salvati
$dataJson = file_exists('data.json') ? file_get_contents('data.json') : '{}';
$data = json_decode($dataJson, true);

$hero_title = $data['hero_title'] ?? 'La tua tastiera.<br>Il tuo pezzo <span>unico.</span>';
$hero_subtitle = $data['hero_subtitle'] ?? 'Grafiche custom per tastiere e arte su misura. Zero limiti, solo la tua visione.';
$support_hours_wk = $data['support_hours_wk'] ?? 'Lun - Ven: 10:00 - 19:00';
$support_hours_we = $data['support_hours_we'] ?? 'Sab - Dom: Su appuntamento';
?>
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gaming Relax — Custom Keyboards & Digital Craftsmanship</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800;900&display=swap" rel="stylesheet">
    <style>
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background-color: #0b0f17; color: #ffffff; font-family: 'Outfit', sans-serif; overflow-x: hidden; }
        header { position: fixed; top: 0; left: 0; width: 100%; height: 70px; background: rgba(11, 15, 23, 0.85); backdrop-filter: blur(12px); display: flex; align-items: center; justify-content: space-between; padding: 0 24px; z-index: 1000; border-bottom: 1px solid rgba(255, 255, 255, 0.08); }
        .nav-brand { display: flex; align-items: center; gap: 12px; text-decoration: none; color: #ffffff; font-weight: 700; font-size: 1.2rem; }
        .nav-brand img { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; }
        .admin-link { color: #ccff00; text-decoration: none; font-size: 0.9rem; font-weight: 700; border: 1px solid #ccff00; padding: 6px 12px; border-radius: 6px; transition: 0.2s; }
        .admin-link:hover { background: #ccff00; color: #0b0f17; }
        section { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 100px 20px 60px 20px; text-align: center; }
        .hero-section { background: radial-gradient(circle at 50% 30%, rgba(204, 255, 0, 0.08) 0%, transparent 60%); }
        .hero-title { font-size: clamp(2.5rem, 6vw, 4.8rem); font-weight: 900; line-height: 1.05; text-transform: uppercase; max-width: 900px; margin-bottom: 24px; }
        .hero-title span { color: #ccff00; }
        .hero-subtitle { font-size: clamp(1rem, 2vw, 1.25rem); color: #a0aec0; max-width: 600px; margin-bottom: 36px; font-weight: 300; }
        footer { background: #070a10; padding: 60px 24px 40px 24px; border-top: 1px solid rgba(255, 255, 255, 0.08); text-align: left; max-width: 1200px; margin: 0 auto; }
        .footer-content { display: flex; flex-direction: column; gap: 20px; }
        .footer-links { display: flex; flex-direction: column; gap: 8px; color: #8892b0; font-size: 0.95rem; }
    </style>
</head>
<body>

    <header>
        <a href="#" class="nav-brand">
            <img src="https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=100&h=100&fit=crop" alt="Logo">
            Gaming Relax
        </a>
        <a href="login.php" class="admin-link">Area Admin ⚙️</a>
    </header>

    <section class="hero-section">
        <h1 class="hero-title"><?php echo $hero_title; ?></h1>
        <p class="hero-subtitle"><?php echo $hero_subtitle; ?></p>
    </section>

    <footer>
        <div class="footer-content">
            <div>
                <strong>Orari di Supporto & Disponibilità</strong>
                <div class="footer-links" style="margin-top: 8px;">
                    <span><?php echo $support_hours_wk; ?></span>
                    <span><?php echo $support_hours_we; ?></span>
                </div>
            </div>
            <div style="color: #64748b; font-size: 0.85rem; margin-top: 20px;">
                &copy; 2026 Gaming Relax. All Rights Reserved.
            </div>
        </div>
    </footer>

</body>
</html>
