<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Bienvenido a Gestion+</title>
</head>
<body style="margin:0; padding:0; background:#f5f3ff; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
  <div style="max-width:580px; margin:40px auto; padding:0 16px 40px;">
    <div style="background:#ffffff; border-radius:24px; overflow:hidden; box-shadow:0 4px 24px rgba(109,40,217,.08);">

      <!-- Header -->
      <div style="background:linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%); padding:40px 40px 36px; text-align:center;">
        <img src="https://i.postimg.cc/rpvx6X8W/logo-Gestion-Plus-white.png" alt="Gestion+" width="150" style="display:block; max-width:150px; height:auto; margin:0 auto 20px;" />
        <h1 style="margin:0; font-size:28px; font-weight:800; color:#ffffff; line-height:1.3;">¡Bienvenido a Gestion+!</h1>
        <p style="margin:10px 0 0; font-size:15px; color:rgba(255,255,255,.85);">Tu cuenta ha sido creada correctamente</p>
      </div>

      <!-- Body -->
      <div style="padding:36px 40px;">
        <p style="font-size:17px; font-weight:700; color:#1e293b; margin:0 0 12px;">Hola, {{ $userName }}</p>
        <p style="font-size:15px; color:#475569; line-height:1.7; margin:0 0 20px;">
          Nos alegra tenerte con nosotros. Tu cuenta en <strong>Gestion+</strong> está lista.
          A continuación encontrarás lo que puedes hacer desde el primer día:
        </p>

        @if ($role === 'customer')
          <div style="background:#fff1f5; border:1px solid #fecdd3; border-radius:16px; padding:18px 22px; margin:24px 0;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td width="54" valign="top" style="padding:0 14px 0 0;">
                  <div style="width:40px; height:40px; border-radius:12px; background:linear-gradient(135deg,#f472b6,#fb7185); text-align:center; padding-top:9px; box-sizing:border-box;">
                    <svg width="22" height="22" fill="none" stroke="white" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"/></svg>
                  </div>
                </td>
                <td valign="top" style="padding-top:2px;">
                  <p style="font-size:14px; font-weight:800; margin:0 0 4px; color:#be185d;">Cuenta de cliente</p>
                  <p style="font-size:13px; color:#475569; margin:0; line-height:1.5;">
                    Acumula puntos en todos los negocios que usan Gestion+, canjea recompensas y
                    disfruta de ofertas exclusivas para miembros.
                  </p>
                </td>
              </tr>
            </table>
          </div>
        @elseif ($role === 'business_owner')
          <div style="background:#f5f3ff; border:1px solid #ddd6fe; border-radius:16px; padding:18px 22px; margin:24px 0;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td width="54" valign="top" style="padding:0 14px 0 0;">
                  <div style="width:40px; height:40px; border-radius:12px; background:linear-gradient(135deg,#7c3aed,#ec4899); text-align:center; padding-top:9px; box-sizing:border-box;">
                    <svg width="22" height="22" fill="none" stroke="white" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                  </div>
                </td>
                <td valign="top" style="padding-top:2px;">
                  <p style="font-size:14px; font-weight:800; margin:0 0 4px; color:#5b21b6;">Panel de negocio</p>
                  <p style="font-size:13px; color:#475569; margin:0; line-height:1.5;">
                    Configura tu programa de puntos, crea recompensas y ofertas, y empieza a
                    fidelizar a tus clientes desde hoy.
                  </p>
                </td>
              </tr>
            </table>
          </div>
        @elseif ($role === 'association_admin')
          <div style="background:#ecfdf5; border:1px solid #a7f3d0; border-radius:16px; padding:18px 22px; margin:24px 0;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td width="54" valign="top" style="padding:0 14px 0 0;">
                  <div style="width:40px; height:40px; border-radius:12px; background:linear-gradient(135deg,#10b981,#14b8a6); text-align:center; padding-top:9px; box-sizing:border-box;">
                    <svg width="22" height="22" fill="none" stroke="white" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  </div>
                </td>
                <td valign="top" style="padding-top:2px;">
                  <p style="font-size:14px; font-weight:800; margin:0 0 4px; color:#065f46;">Panel de asociación</p>
                  <p style="font-size:13px; color:#475569; margin:0; line-height:1.5;">
                    Gestiona tu red de negocios, crea un programa de puntos compartido e invita
                    a los comercios de tu asociación o municipio.
                  </p>
                </td>
              </tr>
            </table>
          </div>
        @endif

        <div style="text-align:center; margin:32px 0 8px;">
          <a href="{{ $dashboardUrl }}" style="display:inline-block; background:linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%); color:#ffffff; text-decoration:none; font-size:16px; font-weight:700; padding:16px 40px; border-radius:14px; letter-spacing:-.2px;">Ir a mi panel →</a>
        </div>

        <hr style="border:none; border-top:1px solid #f1f5f9; margin:28px 0;" />

        <p style="font-size:13px; color:#94a3b8; margin:0; line-height:1.7;">
          Si no has creado esta cuenta, puedes ignorar este email de forma segura.
        </p>
      </div>
    </div>

    <div style="text-align:center; padding:20px 24px 28px; font-size:12px; color:#94a3b8;">
      © {{ date('Y') }} <strong style="color:#7c3aed;">Gestion+</strong> · La plataforma de fidelización para PYMEs
    </div>
  </div>
</body>
</html>
