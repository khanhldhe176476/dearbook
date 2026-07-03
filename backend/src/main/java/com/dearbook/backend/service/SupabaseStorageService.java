package com.dearbook.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.text.Normalizer;
import java.time.Instant;
import java.util.Locale;
import java.util.UUID;

import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;

@Service
public class SupabaseStorageService {

    private static final Logger log = LoggerFactory.getLogger(SupabaseStorageService.class);

    private final HttpClient httpClient;

    @Value("${app.supabase.url:}")
    private String supabaseUrl;

    @Value("${app.supabase.service-role-key:}")
    private String serviceRoleKey;

    @Value("${app.supabase.storage.bucket:template-pdfs}")
    private String bucket;

    @Value("${app.supabase.storage.prefix:orders}")
    private String prefix;

    public SupabaseStorageService() {
        this.httpClient = HttpClient.newBuilder()
                .followRedirects(HttpClient.Redirect.NORMAL)
                .build();
    }

    public boolean isConfigured() {
        return hasText(supabaseUrl) && hasText(serviceRoleKey);
    }

    public String uploadPdf(Path filePath, String originalFilename) {
        if (!isConfigured()) {
            throw new IllegalStateException("Supabase Storage is not configured");
        }

        String objectKey = buildObjectKey(originalFilename);
        URI uploadUri = URI.create(normalizeBaseUrl(supabaseUrl)
                + "/storage/v1/object/"
                + encodePathSegment(bucket)
                + "/"
                + encodeObjectPath(objectKey));

        try {
            HttpRequest request = HttpRequest.newBuilder(uploadUri)
                    .header("Authorization", "Bearer " + serviceRoleKey.trim())
                    .header("apikey", serviceRoleKey.trim())
                    .header("Content-Type", "application/pdf")
                    .header("x-upsert", "true")
                    .PUT(HttpRequest.BodyPublishers.ofFile(filePath))
                    .build();
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                throw new IllegalStateException("Supabase upload failed: HTTP "
                        + response.statusCode() + " " + response.body());
            }

            String publicUrl = buildPublicUrl(objectKey);
            log.info("Uploaded PDF to Supabase Storage: {}", publicUrl);
            return publicUrl;
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload PDF to Supabase Storage", e);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Supabase upload was interrupted", e);
        }
    }

    public boolean canHandle(String storedUrl) {
        if (!isConfigured() || !hasText(storedUrl)) {
            return false;
        }

        String normalizedUrl = storedUrl.trim();
        String objectBase = normalizeBaseUrl(supabaseUrl) + "/storage/v1/object/";
        return normalizedUrl.startsWith(objectBase);
    }

    public Resource downloadPdfAsResource(String storedUrl) {
        if (!canHandle(storedUrl)) {
            throw new IllegalArgumentException("URL is not a configured Supabase Storage object");
        }

        URI downloadUri = buildAuthenticatedObjectUri(storedUrl);
        HttpRequest request = baseStorageRequest(downloadUri)
                .GET()
                .build();

        try {
            HttpResponse<InputStream> response = httpClient.send(request, HttpResponse.BodyHandlers.ofInputStream());
            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                closeQuietly(response.body());
                throw new IllegalArgumentException("Supabase file not readable: HTTP " + response.statusCode());
            }

            return new InputStreamResource(response.body());
        } catch (IOException e) {
            throw new RuntimeException("Failed to download PDF from Supabase Storage", e);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Supabase download was interrupted", e);
        }
    }

    public boolean isPdfAvailable(String storedUrl) {
        if (!canHandle(storedUrl)) {
            return false;
        }

        URI downloadUri = buildAuthenticatedObjectUri(storedUrl);
        HttpRequest headRequest = baseStorageRequest(downloadUri)
                .method("HEAD", HttpRequest.BodyPublishers.noBody())
                .build();

        try {
            HttpResponse<Void> headResponse = httpClient.send(headRequest, HttpResponse.BodyHandlers.discarding());
            if (headResponse.statusCode() >= 200 && headResponse.statusCode() < 300) {
                return true;
            }
            if (headResponse.statusCode() != 405) {
                return false;
            }

            HttpRequest rangeRequest = baseStorageRequest(downloadUri)
                    .header("Range", "bytes=0-0")
                    .GET()
                    .build();
            HttpResponse<InputStream> rangeResponse = httpClient.send(rangeRequest, HttpResponse.BodyHandlers.ofInputStream());
            closeQuietly(rangeResponse.body());
            return rangeResponse.statusCode() >= 200 && rangeResponse.statusCode() < 300;
        } catch (IOException e) {
            log.warn("Could not verify Supabase PDF availability: {}", e.getMessage());
            return false;
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return false;
        }
    }

    private HttpRequest.Builder baseStorageRequest(URI uri) {
        return HttpRequest.newBuilder(uri)
                .header("Authorization", "Bearer " + serviceRoleKey.trim())
                .header("apikey", serviceRoleKey.trim())
                .header("Accept", "application/pdf");
    }

    private URI buildAuthenticatedObjectUri(String storedUrl) {
        String normalizedUrl = storedUrl.trim();
        String objectPublicPrefix = normalizeBaseUrl(supabaseUrl) + "/storage/v1/object/public/";
        String objectPrefix = normalizeBaseUrl(supabaseUrl) + "/storage/v1/object/";

        if (normalizedUrl.startsWith(objectPublicPrefix)) {
            return URI.create(objectPrefix + normalizedUrl.substring(objectPublicPrefix.length()));
        }

        return URI.create(normalizedUrl);
    }

    private String buildPublicUrl(String objectKey) {
        return normalizeBaseUrl(supabaseUrl)
                + "/storage/v1/object/public/"
                + encodePathSegment(bucket)
                + "/"
                + encodeObjectPath(objectKey);
    }

    private String buildObjectKey(String originalFilename) {
        String fileName = safePdfFileName(originalFilename);
        String safePrefix = normalizePrefix(prefix);
        String uniqueName = Instant.now().toEpochMilli() + "-" + UUID.randomUUID() + "-" + fileName;
        return safePrefix.isBlank() ? uniqueName : safePrefix + "/" + uniqueName;
    }

    private String safePdfFileName(String originalFilename) {
        String name = originalFilename;
        if (!hasText(name)) {
            name = "design.pdf";
        }

        name = Path.of(name).getFileName().toString();
        int dot = name.lastIndexOf('.');
        String base = dot > 0 ? name.substring(0, dot) : name;

        String ascii = Normalizer.normalize(base, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .replace('đ', 'd')
                .replace('Đ', 'D')
                .toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("^-+|-+$", "");

        if (ascii.isBlank()) {
            ascii = "design";
        }

        return ascii + ".pdf";
    }

    private String normalizePrefix(String value) {
        if (!hasText(value)) {
            return "";
        }

        String normalized = value.trim().replace('\\', '/');
        while (normalized.startsWith("/")) {
            normalized = normalized.substring(1);
        }
        while (normalized.endsWith("/")) {
            normalized = normalized.substring(0, normalized.length() - 1);
        }
        return normalized;
    }

    private String encodeObjectPath(String objectKey) {
        String[] parts = objectKey.split("/");
        StringBuilder encoded = new StringBuilder();
        for (String part : parts) {
            if (encoded.length() > 0) {
                encoded.append('/');
            }
            encoded.append(encodePathSegment(part));
        }
        return encoded.toString();
    }

    private String encodePathSegment(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8).replace("+", "%20");
    }

    private String normalizeBaseUrl(String value) {
        String normalized = value.trim();
        while (normalized.endsWith("/")) {
            normalized = normalized.substring(0, normalized.length() - 1);
        }
        return normalized;
    }

    private boolean hasText(String value) {
        return value != null && !value.isBlank();
    }

    private void closeQuietly(InputStream inputStream) {
        if (inputStream == null) {
            return;
        }

        try {
            inputStream.close();
        } catch (IOException ignored) {
            // Nothing useful to do here.
        }
    }
}
