<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;

class CloudinaryActions extends Controller
{
    public function upload($image, $folder)
    {
        try {

            $uploader = new \Cloudinary\Api\Upload\UploadApi();
            $manager = new ImageManager(new Driver());

            $img = $manager->read($image);

            $img->scale(width: 1200);

            $encodedImage = $img->toWebp(75);

            $tempPath = storage_path('app/temp_' . uniqid() . '.webp');
            $encodedImage->save($tempPath);
            $result = $uploader->upload($tempPath, [
                'folder' => $folder
            ]);

            unlink($tempPath);

            $imageUrl = $result['secure_url'];
            $newSize = strlen($encodedImage);
            return [
                'image_url' => $imageUrl,
                'size' => $newSize,
                'width' => $img->width(),
                'height' => $img->height()
            ];
        } catch (\Exception $e) {
            throw $e;
        }
    }

    public function destroy($url,$pathC)
    {
        if (str_contains($url, 'https://')) {
            $urlParts = explode('/', $url);
            $fileNameWithExt = end($urlParts);
            $fileName = pathinfo($fileNameWithExt, PATHINFO_FILENAME);
            $publicId = $pathC . $fileName;

            try {
                $uploader = new \Cloudinary\Api\Upload\UploadApi();
                $uploader->destroy($publicId);
            } catch (\Exception $e) {
                return response()->json([
                    'success' => false,
                    'message' => $e->getMessage()
                ]);
            }
        }
    }
}
