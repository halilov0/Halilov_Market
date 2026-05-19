package com.halilov.online.media;

public interface MediaStorage {

    /**
     * Persist already-processed image bytes and return the public URL path
     * the client should use (e.g. {@code /api/media/products/<uuid>.jpg}).
     */
    String store(String prefix, byte[] data, String extension);
}
