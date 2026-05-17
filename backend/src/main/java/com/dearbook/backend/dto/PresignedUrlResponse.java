package com.dearbook.backend.dto;

import java.util.UUID;

public class PresignedUrlResponse {
    private UUID assetId;
    private String uploadUrl;
    private String highResUrl;

    public PresignedUrlResponse(UUID assetId, String uploadUrl, String highResUrl) {
        this.assetId = assetId;
        this.uploadUrl = uploadUrl;
        this.highResUrl = highResUrl;
    }

    public UUID getAssetId() { return assetId; }
    public void setAssetId(UUID assetId) { this.assetId = assetId; }
    public String getUploadUrl() { return uploadUrl; }
    public void setUploadUrl(String uploadUrl) { this.uploadUrl = uploadUrl; }
    public String getHighResUrl() { return highResUrl; }
    public void setHighResUrl(String highResUrl) { this.highResUrl = highResUrl; }
}
