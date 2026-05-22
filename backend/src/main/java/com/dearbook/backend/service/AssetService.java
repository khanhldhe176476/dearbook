package com.dearbook.backend.service;

import com.dearbook.backend.dto.PresignedUrlResponse;
import com.dearbook.backend.entity.Profile;
import com.dearbook.backend.entity.UserUpload;
import com.dearbook.backend.repository.ProfileRepository;
import com.dearbook.backend.repository.UserUploadRepository;
import com.dearbook.backend.security.UserPrincipal;
import net.coobird.thumbnailator.Thumbnails;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.net.URL;
import java.time.Duration;
import java.util.UUID;

@Service
public class AssetService {

    private static final Logger log = LoggerFactory.getLogger(AssetService.class);

    private final S3Presigner s3Presigner;
    private final S3Client s3Client;
    private final UserUploadRepository userUploadRepository;
    private final ProfileRepository profileRepository;

    @Value("${app.aws.s3.bucket-name:dummy-bucket}")
    private String bucketName;
 
    @Value("${app.aws.s3.region:ap-southeast-1}")
    private String region;

    public AssetService(S3Presigner s3Presigner, S3Client s3Client, UserUploadRepository userUploadRepository, ProfileRepository profileRepository) {
        this.s3Presigner = s3Presigner;
        this.s3Client = s3Client;
        this.userUploadRepository = userUploadRepository;
        this.profileRepository = profileRepository;
    }

    public PresignedUrlResponse generatePresignedUrl(String fileName, String fileType) {
        UserPrincipal user = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        UUID userId = user.getId();
        UUID assetId = UUID.randomUUID();

        String cleanFileName = fileName.replaceAll("[^a-zA-Z0-9.-]", "_");
        String objectKey = String.format("users/%s/assets/%s_%s", userId.toString(), assetId.toString(), cleanFileName);

        PutObjectRequest objectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(objectKey)
                .contentType(fileType)
                .build();

        PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(15))
                .putObjectRequest(objectRequest)
                .build();

        PresignedPutObjectRequest presignedRequest = s3Presigner.presignPutObject(presignRequest);
        String uploadUrl = presignedRequest.url().toString();

        String highResUrl = String.format("https://%s.s3.%s.amazonaws.com/%s", bucketName, region, objectKey);

        return new PresignedUrlResponse(assetId, uploadUrl, highResUrl);
    }

    public void confirmUpload(UUID assetId, String highResUrl) {
        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        UUID userId = userPrincipal.getId();

        Profile userProfile = profileRepository.findById(userId).orElseThrow();

        // Extract object key from highResUrl (assuming standard S3 URL format)
        String objectKey = highResUrl.substring(highResUrl.indexOf(".amazonaws.com/") + 15);

        // Save initial record (thumbnail will be populated async)
        UserUpload uploadRecord = new UserUpload();
        uploadRecord.setId(assetId);
        uploadRecord.setUser(userProfile);
        uploadRecord.setFileUrl(highResUrl);
        uploadRecord.setFileType("image/jpeg");
        userUploadRepository.save(uploadRecord);

        // Trigger async thumbnail generation
        generateAndUploadThumbnail(assetId, highResUrl, objectKey);
    }

    @Async
    public void generateAndUploadThumbnail(UUID assetId, String highResUrl, String objectKey) {
        log.info("Starting async thumbnail generation for asset: {}", assetId);
        try {
            // 1. Download image from highResUrl
            URL url = new URL(highResUrl);
            try (InputStream in = url.openStream()) {
                
                // 2. Generate Thumbnail (max 800x800)
                ByteArrayOutputStream thumbnailOut = new ByteArrayOutputStream();
                Thumbnails.of(in)
                        .size(800, 800)
                        .outputFormat("jpg")
                        .outputQuality(0.8)
                        .toOutputStream(thumbnailOut);
                
                byte[] thumbnailBytes = thumbnailOut.toByteArray();

                // 3. Upload thumbnail to S3
                String thumbObjectKey = objectKey.replace("/assets/", "/thumbnails/");
                PutObjectRequest putObj = PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(thumbObjectKey)
                        .contentType("image/jpeg")
                        .build();

                s3Client.putObject(putObj, RequestBody.fromBytes(thumbnailBytes));
                String thumbnailUrl = String.format("https://%s.s3.%s.amazonaws.com/%s", bucketName, region, thumbObjectKey);

                // 4. Update database record with thumbnail URL
                UserUpload record = userUploadRepository.findById(assetId).orElseThrow();
                record.setThumbnailUrl(thumbnailUrl);
                userUploadRepository.save(record);
                
                log.info("Thumbnail successfully generated and saved for asset: {}", assetId);
            }
        } catch (Exception e) {
            log.error("Failed to generate thumbnail for assetId: {}", assetId, e);
        }
    }
}
