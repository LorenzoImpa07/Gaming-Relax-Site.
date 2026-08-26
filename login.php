<?php
session_start();

// Credenziali Admin richieste
$admin_email = "gamingrelaxadmin@gmail.com";
$admin_pass = "Admin1234";

$error = "";
$success = "";

// Gestione del Login
if (isset($_POST['login'])) {
    if ($_POST['email'] === $admin_email && $_POST['password'] === $admin_pass) {
        $_SESSION['admin_logged'] = true;
    } else {
        $error = "Credenziali errate!";
    }
}

// Gestione del Logout
if (isset($_GET['logout'])) {
    unset($_SESSION['admin_logged']);
    header("Location: login.php");
    exit;
}

// Gestione del Salvataggio Modifiche
if (isset($_SESSION['admin_logged']) && isset($_POST['save_content'])) {
    $newData = [
        "hero_title" => $_POST['hero_title'],
        "hero_subtitle" => $_POST['hero_subtitle'],
        "support_hours_wk" => $_POST['support_hours_wk'],
        "support_hours_we" => $_POST['support_hours_we']
    ];
    file_put_contents('data.json', json_encode($newData, JSON_PRETTY_PRINT));
    $success = "Modifiche salvate con successo!";
}

// Carica dati attuali per il form
$dataJson = file_exists('data.json') ? file_get_contents('data.json') : '{}';
$data = json_decode($dataJson, true);
?>
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pannello Admin — Gaming Relax</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap" rel="stylesheet">
    <style>
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background-color: #0b0f17; color: #ffffff; font-family: 'Outfit', sans-serif; padding: 40px 20px; display: flex; justify-content: center; }
        .container { width: 100%; max-width: 600px; }
        .card { background: #141a26; border: 1px solid rgba(255, 255, 255, 0.08); padding: 30px; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.6); }
        h1 { font-size: 1.5rem; font-weight: 800; margin-bottom: 20px; text-transform: uppercase; }
        .form-group { margin-bottom: 20px; }
        label { display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 8px; color: #cbd5e1; }
        input, textarea { width: 100%; padding: 12px 16px; background: #0b0f17; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; color: #ffffff; font-size: 1rem; font-family: inherit; }
        input:focus, textarea:focus { outline: none; border-color: #ccff00; }
        .btn { width: 100%; background: #ccff00; color: #0b0f17; border: none; padding: 14px; font-weight: 800; font-size: 1rem; border-radius: 8px; cursor: pointer; text-transform: uppercase; transition: 0.2s; }
        .btn:hover { opacity: 0.9; }
        .alert-error { background: rgba(255, 77, 77, 0.2); border: 1px solid #ff4d4d; color: #ff4d4d; padding: 10px; border-radius: 6px; margin-bottom: 15px; font-size: 0.9rem; }
        .alert-success { background: rgba(204, 255, 0, 0.2); border: 1px solid #ccff00; color: #ccff00; padding: 10px; border-radius: 6px; margin-bottom: 15px; font-size: 0.9rem; }
        .top-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .logout-btn { color: #ff4d4d; text-decoration: none; font-size: 0.9rem; font-weight: 600; }
        .back-site { color: #ccff00; text-decoration: none; font-size: 0.9rem; font-weight: 600; }
    </style>
</head>
<body>
    <div class="container">
        <div class="card">
            <?php if (!isset($_SESSION['admin_logged'])): ?>
                <!-- FORM DI LOGIN -->
                <h1>Admin Login</h1>
                <p style="color: #a0aec0; font-size: 0.9rem; margin-bottom: 20px;">Inserisci le credenziali di amministrazione.</p>
                
                <?php if ($error): ?>
                    <div class="alert-error"><?php echo $error; ?></div>
                <?php endif; ?>

                <form method="POST">
                    <div class="form-group">
                        <label>E-mail Admin</label>
                        <input type="email" name="email" required placeholder="gamingrelaxadmin@gmail.com">
                    </div>
                    <div class="form-group">
                        <label>Password</label>
                        <input type="password" name="password" required placeholder="••••••••">
                    </div>
                    <button type="submit" name="login" class="btn">Accedi</button>
                </form>
                <div style="margin-top: 20px; text-align: center;">
                    <a href="index.php" class="back-site">&larr; Torna al sito principale</a>
                </div>

            <?php else: ?>
                <!-- PANNELLO DI CONTROLLO / DASHBOARD -->
                <div class="top-bar">
                    <h1>Dashboard Admin</h1>
                    <a href="?logout=true" class="logout-btn">Esci (Logout)</a>
                </div>
                <p style="color: #a0aec0; font-size: 0.9rem; margin-bottom: 20px;">Modifica i contenuti del sito in tempo reale.</p>

                <?php if ($success): ?>
                    <div class="alert-success"><?php echo $success; ?></div>
                <?php endif; ?>

                <form method="POST">
                    <div class="form-group">
                        <label>Titolo Principale (Hero Title)</label>
                        <textarea name="hero_title" rows="2" required><?php echo htmlspecialchars($data['hero_title'] ?? ''); ?></textarea>
                    </div>
                    <div class="form-group">
                        <label>Sottotitolo Principale (Hero Subtitle)</label>
                        <textarea name="hero_subtitle" rows="2" required><?php echo htmlspecialchars($data['hero_subtitle'] ?? ''); ?></textarea>
                    </div>
                    <div class="form-group">
                        <label>Orari Lun - Ven</label>
                        <input type="text" name="support_hours_wk" value="<?php echo htmlspecialchars($data['support_hours_wk'] ?? ''); ?>" required>
                    </div>
                    <div class="form-group">
                        <label>Orari Sab - Dom</label>
                        <input type="text" name="support_hours_we" value="<?php echo htmlspecialchars($data['support_hours_we'] ?? ''); ?>" required>
                    </div>
                    <button type="submit" name="save_content" class="btn">Salva Modifiche sul Sito</button>
                </form>
                
                <div style="margin-top: 20px; text-align: center;">
                    <a href="index.php" class="back-site" target="_blank">Visualizza il sito aggiornato &rarr;</a>
                </div>
            <?php endif; ?>
        </div>
    </div>
</body>
</html>
