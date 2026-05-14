package com.halilov.market.media;

import jakarta.annotation.PreDestroy;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3Configuration;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;

import java.net.URI;
import java.util.UUID;

@Service
@ConditionalOnProperty(name = "app.media.storage", havingValue = "r2")
public class R2MediaStorage implements MediaStorage {

    private final S3Client s3;
    private final String bucket;
    private final String publicBaseUrl;

    public R2MediaStorage(
        @Value("${app.media.r2.endpoint}") String endpoint,
        @Value("${app.media.r2.accessKeyId}") String accessKeyId,
        @Value("${app.media.r2.secretAccessKey}") String secretAccessKey,
        @Value("${app.media.r2.bucket}") String bucket,
        @Value("${app.media.r2.publicBaseUrl}") String publicBaseUrl
    ) {
        this.bucket = bucket;
        this.publicBaseUrl = stripTrailingSlash(publicBaseUrl);
        this.s3 = S3Client.builder()
            .endpointOverride(URI.create(endpoint))
            .region(Region.of("auto"))
            .credentialsProvider(StaticCredentialsProvider.create(
                AwsBasicCredentials.create(accessKeyId, secretAccessKey)))
            .serviceConfiguration(S3Configuration.builder()
                .pathStyleAccessEnabled(true)
                .build())
            .build();
    }

    @Override
    public String store(String prefix, byte[] data, String extension) {
        String safePrefix = prefix.replaceAll("[^a-zA-Z0-9/_-]", "");
        String key = safePrefix + "/" + UUID.randomUUID() + "." + extension;
        try {
            s3.putObject(
                PutObjectRequest.builder()
                    .bucket(bucket)
                    .key(key)
                    .contentType("image/" + ("jpg".equals(extension) ? "jpeg" : extension))
                    .cacheControl("public, max-age=31536000, immutable")
                    .build(),
                RequestBody.fromBytes(data)
            );
        } catch (S3Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "r2 upload failed", e);
        }
        return publicBaseUrl + "/" + key;
    }

    @PreDestroy
    void shutdown() {
        s3.close();
    }

    private static String stripTrailingSlash(String s) {
        return s.endsWith("/") ? s.substring(0, s.length() - 1) : s;
    }
}
