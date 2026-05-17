package com.dearbook.backend.controller;

import com.dearbook.backend.dto.ConfirmAssetRequest;
import com.dearbook.backend.dto.PresignedUrlResponse;
import com.dearbook.backend.service.AssetService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/assets")
public class AssetController {

    private final AssetService assetService;

    public AssetController(AssetService assetService) {
        this.assetService = assetService;
    }

    @GetMapping("/presigned-url")
    public ResponseEntity<PresignedUrlResponse> getPresignedUrl(
            @RequestParam String fileName,
            @RequestParam String fileType) {
        
        PresignedUrlResponse response = assetService.generatePresignedUrl(fileName, fileType);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/confirm")
    public ResponseEntity<Void> confirmUpload(@RequestBody ConfirmAssetRequest request) {
        assetService.confirmUpload(request.getAssetId(), request.getHighResUrl());
        return ResponseEntity.accepted().build();
    }
}
