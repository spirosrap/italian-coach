<?php

declare(strict_types=1);

$root = dirname(__DIR__);
$progressPath = $root . '/data/progress.json';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');
header('Access-Control-Allow-Headers: content-type');
header('Cache-Control: no-cache');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    send_json(200, read_progress($progressPath));
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'PUT') {
    try {
        $body = read_json_body();
        if (!isset($body['state']) || !is_array($body['state'])) {
            send_json(400, ['ok' => false, 'error' => 'Missing state object']);
        }

        $current = read_progress($progressPath);
        $mergedState = merge_states($current['state'] ?? [], $body['state']);
        $payload = [
            'version' => 1,
            'updatedAt' => now_ms(),
            'updatedBy' => $body['clientId'] ?? 'unknown-client',
            'state' => $mergedState,
        ];
        write_progress($progressPath, $payload);
        send_json(200, ['ok' => true] + $payload);
    } catch (Throwable $error) {
        send_json(400, ['ok' => false, 'error' => $error->getMessage()]);
    }
}

send_json(405, ['ok' => false, 'error' => 'Method not allowed']);

function read_json_body(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || trim($raw) === '') {
        return [];
    }
    if (strlen($raw) > 2000000) {
        throw new RuntimeException('Request body too large');
    }
    $decoded = json_decode($raw, true);
    if (!is_array($decoded)) {
        throw new RuntimeException('Invalid JSON body');
    }
    return $decoded;
}

function read_progress(string $path): array
{
    if (!is_file($path)) {
        return [
            'version' => 1,
            'updatedAt' => 0,
            'updatedBy' => null,
            'state' => null,
        ];
    }

    $decoded = json_decode((string) file_get_contents($path), true);
    return is_array($decoded) ? $decoded : [
        'version' => 1,
        'updatedAt' => 0,
        'updatedBy' => null,
        'state' => null,
    ];
}

function write_progress(string $path, array $payload): void
{
    $dir = dirname($path);
    if (!is_dir($dir) && !mkdir($dir, 0755, true) && !is_dir($dir)) {
        throw new RuntimeException('Could not create data directory');
    }

    $tmp = $path . '.tmp';
    $json = json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    if ($json === false || file_put_contents($tmp, $json . PHP_EOL, LOCK_EX) === false) {
        throw new RuntimeException('Could not write progress file');
    }
    if (!rename($tmp, $path)) {
        @unlink($tmp);
        throw new RuntimeException('Could not replace progress file');
    }
}

function merge_progress_row(array $left = [], array $right = []): array
{
    $leftDue = number_value($left['due'] ?? 0);
    $rightDue = number_value($right['due'] ?? 0);

    return [
        'attempts' => max(number_value($left['attempts'] ?? 0), number_value($right['attempts'] ?? 0)),
        'correct' => max(number_value($left['correct'] ?? 0), number_value($right['correct'] ?? 0)),
        'misses' => max(number_value($left['misses'] ?? 0), number_value($right['misses'] ?? 0)),
        'strength' => max(number_value($left['strength'] ?? 0), number_value($right['strength'] ?? 0)),
        'due' => max($leftDue, $rightDue),
        'lastWrongAt' => max(number_value($left['lastWrongAt'] ?? 0), number_value($right['lastWrongAt'] ?? 0)),
        'lastGrade' => $rightDue >= $leftDue
            ? ($right['lastGrade'] ?? $left['lastGrade'] ?? null)
            : ($left['lastGrade'] ?? $right['lastGrade'] ?? null),
    ];
}

function merge_mistake_row(array $left = [], array $right = []): array
{
    $leftWrongAt = number_value($left['at'] ?? 0);
    $rightWrongAt = number_value($right['at'] ?? 0);
    $latestWrong = $rightWrongAt >= $leftWrongAt ? $right : $left;

    return array_replace($latestWrong, [
        'id' => $latestWrong['id'] ?? $left['id'] ?? $right['id'] ?? null,
        'count' => max(number_value($left['count'] ?? 0), number_value($right['count'] ?? 0)),
        'at' => max($leftWrongAt, $rightWrongAt),
        'resolvedAt' => max(number_value($left['resolvedAt'] ?? 0), number_value($right['resolvedAt'] ?? 0)),
    ]);
}

function merge_states(array $base = [], array $incoming = []): array
{
    $baseUpdated = number_value($base['meta']['updatedAt'] ?? 0);
    $incomingUpdated = number_value($incoming['meta']['updatedAt'] ?? 0);

    $merged = [
        'settings' => $incomingUpdated >= $baseUpdated
            ? array_replace($base['settings'] ?? [], $incoming['settings'] ?? [])
            : array_replace($incoming['settings'] ?? [], $base['settings'] ?? []),
        'progress' => [],
        'mistakes' => [],
        'history' => [],
        'daily' => $base['daily'] ?? [],
        'meta' => array_replace($base['meta'] ?? [], $incoming['meta'] ?? []),
    ];
    $merged['meta']['updatedAt'] = max($baseUpdated, $incomingUpdated);

    foreach (($incoming['daily'] ?? []) as $day => $count) {
        $merged['daily'][$day] = max(number_value($merged['daily'][$day] ?? 0), number_value($count));
    }

    $progressIds = array_unique(array_merge(
        array_keys($base['progress'] ?? []),
        array_keys($incoming['progress'] ?? [])
    ));
    foreach ($progressIds as $id) {
        $merged['progress'][$id] = merge_progress_row(
            as_array($base['progress'][$id] ?? []),
            as_array($incoming['progress'][$id] ?? [])
        );
    }

    $mistakeIds = array_unique(array_merge(
        array_keys($base['mistakes'] ?? []),
        array_keys($incoming['mistakes'] ?? [])
    ));
    foreach ($mistakeIds as $id) {
        $merged['mistakes'][$id] = merge_mistake_row(
            as_array($base['mistakes'][$id] ?? []),
            as_array($incoming['mistakes'][$id] ?? [])
        );
    }

    $history = array_merge($incoming['history'] ?? [], $base['history'] ?? []);
    usort($history, function ($a, $b) {
        return number_value($b['at'] ?? 0) <=> number_value($a['at'] ?? 0);
    });

    $seen = [];
    foreach ($history as $row) {
        if (!is_array($row) || empty($row['id']) || empty($row['at'])) {
            continue;
        }
        $key = $row['id'] . ':' . $row['at'] . ':' . ($row['answer'] ?? '');
        if (isset($seen[$key]) || count($merged['history']) >= 20) {
            continue;
        }
        $seen[$key] = true;
        $merged['history'][] = $row;
    }

    return $merged;
}

function as_array($value): array
{
    return is_array($value) ? $value : [];
}

function number_value($value): float
{
    return is_numeric($value) ? (float) $value : 0.0;
}

function now_ms(): int
{
    return (int) floor(microtime(true) * 1000);
}

function send_json(int $status, array $payload): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES);
    exit;
}
