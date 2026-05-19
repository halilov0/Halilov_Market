package com.halilov.online.media;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;

@RestController
@RequestMapping("/api/admin/media")
public class MediaAdminController {

    private final MediaStorage storage;
    private final ImageProcessor processor;

    public MediaAdminController(MediaStorage storage, ImageProcessor processor) {
        this.storage = storage;
        this.processor = processor;
    }

    public record UploadResponse(String url) {}

    @PostMapping("/products")
    public UploadResponse uploadProductImage(@RequestParam MultipartFile file) {
        if (file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "empty file");
        }
        byte[] raw;
        try {
            raw = file.getBytes();
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "cannot read upload", e);
        }
        ImageProcessor.Result processed = processor.process(raw, file.getContentType());
        String url = storage.store("products", processed.bytes(), processed.extension());
        return new UploadResponse(url);
    }
}
