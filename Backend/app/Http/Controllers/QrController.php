<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Str;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class QrController extends Controller
{
    public function show(Request $request): Response
    {
        $user = $request->user();

        if (! $user->qr_code) {
            $user->qr_code = Str::uuid()->toString();
            $user->save();
        }

        $svg = QrCode::size(164)->margin(1)->generate($user->qr_code);

        return response($svg, 200)
            ->header('Content-Type', 'image/svg+xml')
            ->header('Cache-Control', 'no-store');
    }
}
