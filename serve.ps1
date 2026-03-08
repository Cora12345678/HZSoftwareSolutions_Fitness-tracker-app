$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add('http://localhost:8091/')
$listener.Start()
Write-Host 'Server started on http://localhost:8091'

$root = 'c:\Users\PMLS\Desktop\fitness_tracking app'

while($listener.IsListening) {
    $ctx = $listener.GetContext()
    $path = $ctx.Request.Url.LocalPath
    if($path -eq '/') { $path = '/index.html' }
    $file = Join-Path $root $path.TrimStart('/')
    if(Test-Path $file) {
        $bytes = [System.IO.File]::ReadAllBytes($file)
        $ext = [System.IO.Path]::GetExtension($file)
        $contentType = switch($ext) {
            '.html' {'text/html; charset=utf-8'}
            '.css'  {'text/css; charset=utf-8'}
            '.js'   {'application/javascript; charset=utf-8'}
            '.png'  {'image/png'}
            '.svg'  {'image/svg+xml'}
            default {'application/octet-stream'}
        }
        $ctx.Response.ContentType = $contentType
        $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
        $ctx.Response.StatusCode = 404
    }
    $ctx.Response.Close()
}
