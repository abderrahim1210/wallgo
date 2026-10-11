<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ValideImage extends Controller
{
    public function valide($image)
    {
        $valide = true;
        if (!preg_match('/^data:image\/(\w+);base64,/', $image, $type)) {
            $valide = false;
        }
        $ext = strtolower($type[1]);

        $allowed = ['png', 'jpg', 'jpeg', 'webp'];
        if (!in_array($ext, $allowed)) {
            $valide = false;
        }

        if (strlen($image) / 1024 / 1024 > 100) {
            $valide = false;
        }

        return $valide;
    }
}
