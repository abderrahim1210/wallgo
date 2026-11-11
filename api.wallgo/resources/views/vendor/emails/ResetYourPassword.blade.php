<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="icon" type="image/svg+xml" href="/logo.webp" />
    <title>Reset Your Password - WallGo</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: #0d0f17;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            color: #ffffff;
        }
        .email-wrapper {
            width: 100%;
            table-layout: fixed;
            background-color: #0d0f17;
            padding: 40px 0;
        }
        .email-content {
            max-width: 600px;
            margin: 0 auto;
            background: #111420;
            border: 1px solid #1e2235;
            border-radius: 24px;
            padding: 40px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }
        .brand-title {
            font-size: 32px;
            font-weight: 800;
            letter-spacing: 1.5px;
            background-color: #7371FC;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-align: center;
            margin: 0 0 35px 0;
        }
        h1 {
            font-size: 22px;
            font-weight: 700;
            color: #ffffff;
            margin-top: 0;
            margin-bottom: 16px;
            text-align: center;
        }
        p {
            font-size: 15px;
            line-height: 1.6;
            color: #9ca3af;
            margin-bottom: 24px;
            text-align: center;
        }
        .button-container {
            text-align: center;
            margin: 35px 0;
        }
        .btn {
            background-color: #7371FC;
            color: #ffffff;
            text-decoration: none;
            padding: 14px 32px;
            border-radius: 12px;
            font-weight: 600;
            font-size: 15px;
            display: inline-block;
            box-shadow: 0 4px 15px rgba(147, 51, 234, 0.4);
            transition: all 0.3s ease;
        }
        .btn:hover {
            opacity: 0.9;
        }
        .divider {
            border: 0;
            border-top: 1px solid #1f293d;
            margin: 30px 0;
        }
        .footer-text {
            font-size: 13px;
            color: #6b7280;
            text-align: center;
            line-height: 1.4;
        }
        .footer-text a {
            color: #a855f7;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <table class="email-wrapper" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td align="center">
                <table class="email-content" border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr style="display: flex;justify-content:center">
                        <td>
                           <h1 class="brand-title">WALLGO</h1>
                        </td>
                    </tr>
                    
                    <tr>
                        <td>
                            <h1>Reset Your Password</h1>
                            <p>You are receiving this email because we received a password reset request for your WallGo account. Click the button below to choose a new password.</p>
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <div class="button-container">
                                <a href="{{$uri}}" target="_blank" class="btn">Reset Password &rarr;</a>
                            </div>
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <p style="font-size: 13px; color: #6b7280; margin-bottom: 10px;">
                                If you did not request a password reset, no further action is required. This link will expire in 60 minutes.
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <hr class="divider">
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <div class="footer-text">
                                If you're having trouble clicking the "Reset Password" button, copy and paste the URL below into your web browser:<br>
                                <a href="{{$uri}}" target="_blank" style="word-break: break-all; font-size: 12px; margin-top: 5px; display: inline-block;">{{$uri}}</a>
                            </div>
                            <div class="footer-text" style="margin-top: 25px;">
                                &copy; 2026 WallGo. All rights reserved.
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>