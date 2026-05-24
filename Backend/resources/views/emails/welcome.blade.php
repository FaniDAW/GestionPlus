<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Bienvenido a Gestion+</title>
  <style>
    body { margin: 0; padding: 0; background: #f5f3ff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    .wrapper { max-width: 580px; margin: 40px auto; padding: 0 16px 40px; }
    .card { background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 24px rgba(109,40,217,.08); }
    .header { background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%); padding: 40px 40px 36px; text-align: center; }
    .logo { display: block; margin: 0 auto 22px; height: 40px; width: auto; }
    .header h1 { margin: 0; font-size: 28px; font-weight: 800; color: #fff; line-height: 1.3; }
    .header p { margin: 10px 0 0; font-size: 15px; color: rgba(255,255,255,.85); }
    .body { padding: 36px 40px; }
    .greeting { font-size: 17px; font-weight: 700; color: #1e293b; margin: 0 0 12px; }
    .body-text { font-size: 15px; color: #475569; line-height: 1.7; margin: 0 0 20px; }
    .role-box { border-radius: 16px; padding: 18px 22px; margin: 24px 0; display: flex; align-items: flex-start; gap: 14px; }
    .role-box.customer   { background: #f0fdf4; border: 1px solid #bbf7d0; }
    .role-box.business   { background: #f5f3ff; border: 1px solid #ddd6fe; }
    .role-box.assoc      { background: #ecfdf5; border: 1px solid #a7f3d0; }
    .role-icon { width: 40px; height: 40px; border-radius: 12px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 20px; }
    .role-icon.customer  { background: #dcfce7; }
    .role-icon.business  { background: #ede9fe; }
    .role-icon.assoc     { background: #d1fae5; }
    .role-title { font-size: 14px; font-weight: 800; margin: 0 0 4px; }
    .role-title.customer { color: #166534; }
    .role-title.business { color: #5b21b6; }
    .role-title.assoc    { color: #065f46; }
    .role-desc { font-size: 13px; color: #475569; margin: 0; line-height: 1.5; }
    .cta-wrap { text-align: center; margin: 32px 0 8px; }
    .cta { display: inline-block; background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%); color: #fff !important; text-decoration: none; font-size: 16px; font-weight: 700; padding: 16px 40px; border-radius: 14px; letter-spacing: -.2px; }
    .divider { border: none; border-top: 1px solid #f1f5f9; margin: 28px 0; }
    .footer { text-align: center; padding: 20px 24px 28px; font-size: 12px; color: #94a3b8; }
    .footer strong { color: #7c3aed; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">

      <!-- Header -->
      <div class="header">
        <div class="logo">G<span class="logo-plus">+</span></div>
        <h1>¡Bienvenido a Gestion+!</h1>
        <p>Tu cuenta ha sido creada correctamente</p>
      </div>

      <!-- Body -->
      <div class="body">
        <p class="greeting">Hola, {{ $userName }} 👋</p>
        <p class="body-text">
          Nos alegra tenerte con nosotros. Tu cuenta en <strong>Gestion+</strong> está lista.
          A continuación encontrarás lo que puedes hacer desde el primer día:
        </p>

        @if ($role === 'customer')
          <div class="role-box customer">
            <div class="role-icon customer">🎁</div>
            <div>
              <p class="role-title customer">Cuenta de cliente</p>
              <p class="role-desc">
                Acumula puntos en todos los negocios que usan Gestion+, canjea recompensas y
                disfruta de ofertas exclusivas para miembros.
              </p>
            </div>
          </div>
        @elseif ($role === 'business_owner')
          <div class="role-box business">
            <div class="role-icon business">🏪</div>
            <div>
              <p class="role-title business">Panel de negocio</p>
              <p class="role-desc">
                Configura tu programa de puntos, crea recompensas y ofertas, y empieza a
                fidelizar a tus clientes desde hoy.
              </p>
            </div>
          </div>
        @elseif ($role === 'association_admin')
          <div class="role-box assoc">
            <div class="role-icon assoc">🤝</div>
            <div>
              <p class="role-title assoc">Panel de asociación</p>
              <p class="role-desc">
                Gestiona tu red de negocios, crea un programa de puntos compartido e invita
                a los comercios de tu asociación o municipio.
              </p>
            </div>
          </div>
        @endif

        <div class="cta-wrap">
          <a href="{{ $dashboardUrl }}" class="cta">Ir a mi panel →</a>
        </div>

        <hr class="divider" />

        <p class="body-text" style="font-size:13px; color:#94a3b8; margin:0;">
          Si no has creado esta cuenta, puedes ignorar este email de forma segura.
        </p>
      </div>
    </div>

    <div class="footer">
      © {{ date('Y') }} <strong>Gestion+</strong> · La plataforma de fidelización para PYMEs
    </div>
  </div>
</body>
</html>
