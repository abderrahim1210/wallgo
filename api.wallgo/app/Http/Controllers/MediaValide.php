<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class MediaValide extends Controller
{
    public function valide($media_url)
    {
        if (!empty($media_url) && str_starts_with($media_url, 'data:image')) {
            $check = new \App\Http\Controllers\ValideImage();
            $valide = $check->valide($media_url);

            if ($valide) {
                try {
                    $upload = new \App\Http\Controllers\CloudinaryActions();
                    $res = $upload->upload($media_url, 'wallgo_medias');
                    return $res;
                } catch (\Exception $e) {
                    return null;
                }
            }
        }
        return null;
    }
}
