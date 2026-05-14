package com.halilov.market.media;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.util.UUID;

@Service
@ConditionalOnProperty(name = "app.media.storage", havingValue = "local", matchIfMissing = true)
public class LocalFileMediaStorage implements MediaStorage {

    private final Path root;

    public LocalFileMediaStorage(@Value("${app.media.localDir}") String localDir) {
        this.root = Path.of(localDir).toAbsolutePath().normalize();
    }

    @PostConstruct
    void ensureRoot() throws IOException {
        Files.createDirectories(root);
    }

    @Override
    public String store(String prefix, byte[] data, String extension) {
        String safePrefix = prefix.replaceAll("[^a-zA-Z0-9/_-]", "");
        String fileName = UUID.randomUUID() + "." + extension;
        Path dir = root.resolve(safePrefix).normalize();
        if (!dir.startsWith(root)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "invalid prefix");
        }
        try {
            Files.createDirectories(dir);
            Files.write(dir.resolve(fileName), data,
                StandardOpenOption.CREATE_NEW, StandardOpenOption.WRITE);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "failed to write file", e);
        }
        return "/api/media/" + safePrefix + "/" + fileName;
    }

    public Path getRoot() {
        return root;
    }
}
