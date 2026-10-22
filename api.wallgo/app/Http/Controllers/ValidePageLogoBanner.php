<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ValidePageLogoBanner extends Controller
{
    public function valide($file, $cloud_path)
    {
        if (!empty($file) && str_starts_with($file, 'data:image')) {
            $check = new \App\Http\Controllers\ValideImage();
            $valide = $check->valide($file);

            if ($valide) {
                $upload = new \App\Http\Controllers\CloudinaryActions();
                $res = $upload->upload($file, $cloud_path);
                if (is_array($res)) {
                    return $res['secure_url'] ?? $res['image_url'] ?? $res['url'] ?? null;
                }
            } else {
                throw new \Exception("Invalid image format or corrupted base64 string");
            }
        }
        throw new \Exception("Invalid image data provided");
    }
}
