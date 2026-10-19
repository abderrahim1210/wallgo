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
                try {
                    $upload = new \App\Http\Controllers\CloudinaryActions();
                    $res = $upload->upload($file, $cloud_path);
                    return $res['image_url'] ?? $res['secure_url'] ?? $res['url'];
                } catch (\Exception $e) {
                    return response()->json([
                        'success' => false,
                        'message' => $e->getMessage()
                    ]);
                }
            }
        }
    }
}
