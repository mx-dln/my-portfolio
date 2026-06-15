<?php

$root = realpath(__DIR__.'/../../repositories/my-portfolio/storage/app/public');
$requestPath = parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH) ?: '';
$relativePath = preg_replace('#^/storage/?#', '', $requestPath);
$file = $root ? realpath($root.'/'.$relativePath) : false;

if (! $root || ! $file || ! str_starts_with($file, $root) || ! is_file($file)) {
    http_response_code(404);
    exit('Not found');
}

$mime = mime_content_type($file) ?: 'application/octet-stream';

header('Content-Type: '.$mime);
header('Content-Length: '.filesize($file));
header('Cache-Control: public, max-age=31536000');

readfile($file);
