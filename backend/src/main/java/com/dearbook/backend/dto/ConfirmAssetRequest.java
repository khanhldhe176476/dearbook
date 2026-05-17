package com.dearbook.backend.dto;

import java.util.UUID;

public class ConfirmAssetRequest {
    private UUID assetId;
    private String highResUrl;
    
    public UUID getAssetId() { return assetId; }
    public void setAssetId(UUID assetId) { this.assetId = assetId; }
    public String getHighResUrl() { return highResUrl; }
    public void setHighResUrl(String highResUrl) { this.highResUrl = highResUrl; }
}
