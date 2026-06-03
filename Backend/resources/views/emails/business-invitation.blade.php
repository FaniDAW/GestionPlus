<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Invitación a {{ $groupName }}</title>
</head>
<body style="margin:0; padding:0; background:#f5f3ff; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
  <div style="max-width:580px; margin:40px auto; padding:0 16px 40px;">
    <div style="background:#ffffff; border-radius:24px; overflow:hidden; box-shadow:0 4px 24px rgba(109,40,217,.08);">

      <!-- Header -->
      <div style="background:linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%); padding:40px 40px 32px; text-align:center;">
        <img src="https://i.postimg.cc/rpvx6X8W/logo-Gestion-Plus-white.png" alt="Gestion+" width="150" style="display:block; max-width:150px; height:auto; margin:0 auto 20px;" />
        <h1 style="margin:0; font-size:26px; font-weight:800; color:#ffffff; line-height:1.3;">Te han invitado a unirte</h1>
        <p style="margin:10px 0 0; font-size:15px; color:rgba(255,255,255,.85);">Accede al programa de fidelización compartido</p>
      </div>

      <!-- Body -->
      <div style="padding:36px 40px;">
        <p style="font-size:15px; color:#475569; line-height:1.7; margin:0 0 20px;">Hola,</p>
        <p style="font-size:15px; color:#475569; line-height:1.7; margin:0 0 20px;">
          La asociación <strong>{{ $groupName }}</strong> te ha invitado a unirte a su programa de puntos compartido en <strong>Gestion+</strong>.
          Como negocio miembro, tus clientes podrán acumular y canjear puntos en todos los negocios de la red.
        </p>

        <div style="background:linear-gradient(135deg, #f5f3ff 0%, #fdf2f8 100%); border:1px solid #e9d5ff; border-radius:16px; padding:20px 24px; margin:24px 0;">
          <p style="margin:0; font-size:15px; color:#6d28d9; font-weight:600;">Invitación de <span style="font-weight:800;">{{ $groupName }}</span></p>
        </div>

        <p style="font-size:15px; color:#475569; line-height:1.7; margin:0 0 20px;">Para completar tu registro, sigue estos pasos:</p>

        <!-- Pasos con círculos degradado usando tablas (compatible Outlook) -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0;">
          <!-- Paso 1 -->
          <tr>
            <td width="42" valign="top" style="padding:0 0 16px 0;">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td width="28" height="28" align="center" valign="middle" style="background:linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%); border-radius:50%; color:#ffffff; font-size:13px; font-weight:800; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif; line-height:28px;">1</td>
                </tr>
              </table>
            </td>
            <td valign="top" style="padding:4px 0 16px 14px; font-size:14px; color:#475569; line-height:1.5;">Haz clic en el botón de abajo para acceder al formulario de registro.</td>
          </tr>
          <!-- Paso 2 -->
          <tr>
            <td width="42" valign="top" style="padding:0 0 16px 0;">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td width="28" height="28" align="center" valign="middle" style="background:linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%); border-radius:50%; color:#ffffff; font-size:13px; font-weight:800; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif; line-height:28px;">2</td>
                </tr>
              </table>
            </td>
            <td valign="top" style="padding:4px 0 16px 14px; font-size:14px; color:#475569; line-height:1.5;">Completa tus datos y los de tu negocio.</td>
          </tr>
          <!-- Paso 3 -->
          <tr>
            <td width="42" valign="top" style="padding:0;">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td width="28" height="28" align="center" valign="middle" style="background:linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%); border-radius:50%; color:#ffffff; font-size:13px; font-weight:800; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif; line-height:28px;">3</td>
                </tr>
              </table>
            </td>
            <td valign="top" style="padding:4px 0 0 14px; font-size:14px; color:#475569; line-height:1.5;">¡Listo! Tu negocio quedará vinculado automáticamente a la asociación.</td>
          </tr>
        </table>

        <div style="text-align:center; margin:32px 0;">
          <a href="{{ $inviteUrl }}" style="display:inline-block; background:linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%); color:#ffffff; text-decoration:none; font-size:16px; font-weight:700; padding:16px 40px; border-radius:14px; letter-spacing:-.2px;">Aceptar invitación →</a>
        </div>
        <p style="text-align:center; font-size:13px; color:#94a3b8; margin-top:-8px; margin-bottom:28px;">Este enlace caduca en 7 días.</p>

        <hr style="border:none; border-top:1px solid #f1f5f9; margin:28px 0;" />

        <p style="font-size:13px; color:#94a3b8; margin-bottom:8px; line-height:1.7;">
          Si el botón no funciona, copia y pega este enlace en tu navegador:
        </p>
        <span style="display:block; word-break:break-all; font-size:12px; color:#94a3b8; background:#f8fafc; border-radius:10px; padding:10px 14px; margin-top:16px;">{{ $inviteUrl }}</span>
      </div>
    </div>

    <div style="text-align:center; padding:24px; font-size:12px; color:#94a3b8;">
      © {{ date('Y') }} Gestion+ · Si no esperabas esta invitación, puedes ignorar este mensaje.
    </div>
  </div>
</body>
</html>
