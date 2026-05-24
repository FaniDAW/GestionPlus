<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Invitación a {{ $groupName }}</title>
  <style>
    body { margin: 0; padding: 0; background: #f5f3ff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    .wrapper { max-width: 580px; margin: 40px auto; padding: 0 16px 40px; }
    .card { background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 24px rgba(109,40,217,.08); }
    .header { background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%); padding: 40px 40px 32px; text-align: center; }
    .logo { display: block; margin: 0 auto 20px; height: 40px; width: auto; }
    .header h1 { margin: 0; font-size: 26px; font-weight: 800; color: #fff; line-height: 1.3; }
    .header p { margin: 10px 0 0; font-size: 15px; color: rgba(255,255,255,.85); }
    .body { padding: 36px 40px; }
    .highlight { background: linear-gradient(135deg, #f5f3ff 0%, #fdf2f8 100%); border: 1px solid #e9d5ff; border-radius: 16px; padding: 20px 24px; margin: 24px 0; }
    .highlight p { margin: 0; font-size: 15px; color: #6d28d9; font-weight: 600; }
    .highlight span { font-weight: 800; }
    .body-text { font-size: 15px; color: #475569; line-height: 1.7; margin: 0 0 20px; }
    .cta-wrap { text-align: center; margin: 32px 0; }
    .cta { display: inline-block; background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%); color: #fff !important; text-decoration: none; font-size: 16px; font-weight: 700; padding: 16px 40px; border-radius: 14px; letter-spacing: -.2px; }
    .expiry { text-align: center; font-size: 13px; color: #94a3b8; margin-top: -8px; margin-bottom: 28px; }
    .divider { border: none; border-top: 1px solid #f1f5f9; margin: 28px 0; }
    .footer-link { display: block; word-break: break-all; font-size: 12px; color: #94a3b8; background: #f8fafc; border-radius: 10px; padding: 10px 14px; margin-top: 16px; }
    .footer { text-align: center; padding: 24px; font-size: 12px; color: #94a3b8; }
    .steps { display: flex; flex-direction: column; gap: 12px; margin: 24px 0; }
    .step { display: flex; align-items: flex-start; gap: 14px; }
    .step-num { flex-shrink: 0; width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg, #7c3aed, #ec4899); color: #fff; font-size: 13px; font-weight: 800; display: flex; align-items: center; justify-content: center; }
    .step-text { font-size: 14px; color: #475569; padding-top: 4px; line-height: 1.5; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="header">
        <div class="logo">Gestion+</div>
        <h1>Te han invitado a unirte</h1>
        <p>Accede al programa de fidelización compartido</p>
      </div>

      <div class="body">
        <p class="body-text">Hola,</p>
        <p class="body-text">
          La asociación <strong>{{ $groupName }}</strong> te ha invitado a unirte a su programa de puntos compartido en <strong>Gestion+</strong>.
          Como negocio miembro, tus clientes podrán acumular y canjear puntos en todos los negocios de la red.
        </p>

        <div class="highlight">
          <p>Invitación de <span>{{ $groupName }}</span></p>
        </div>

        <p class="body-text">Para completar tu registro, sigue estos pasos:</p>

        <div class="steps">
          <div class="step">
            <div class="step-num">1</div>
            <div class="step-text">Haz clic en el botón de abajo para acceder al formulario de registro.</div>
          </div>
          <div class="step">
            <div class="step-num">2</div>
            <div class="step-text">Completa tus datos y los de tu negocio.</div>
          </div>
          <div class="step">
            <div class="step-num">3</div>
            <div class="step-text">¡Listo! Tu negocio quedará vinculado automáticamente a la asociación.</div>
          </div>
        </div>

        <div class="cta-wrap">
          <a href="{{ $inviteUrl }}" class="cta">Aceptar invitación →</a>
        </div>
        <p class="expiry">Este enlace caduca en 7 días.</p>

        <hr class="divider" />

        <p class="body-text" style="font-size:13px; color:#94a3b8; margin-bottom:8px;">
          Si el botón no funciona, copia y pega este enlace en tu navegador:
        </p>
        <span class="footer-link">{{ $inviteUrl }}</span>
      </div>
    </div>

    <div class="footer">
      © {{ date('Y') }} Gestion+ · Si no esperabas esta invitación, puedes ignorar este mensaje.
    </div>
  </div>
</body>
</html>
