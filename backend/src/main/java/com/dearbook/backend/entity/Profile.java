package com.dearbook.backend.entity;
import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;
@Entity
@Table(name = "profiles")
public class Profile {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    private String email;
    @Column(name = "full_name") private String fullName;
    @Column(name = "avatar_url") private String avatarUrl;
    private String phone;
    private String address;
    private String ward;
    private String district;
    private String city;
    @Column(name = "shipping_note") private String shippingNote;
    @Column(name = "created_at", insertable = false, updatable = false) private OffsetDateTime createdAt;
    @Column(name = "updated_at", insertable = false, updatable = false) private OffsetDateTime updatedAt;
    // Getters and Setters
    public UUID getId() { return id; } public void setId(UUID id) { this.id = id; }
    public String getEmail() { return email; } public void setEmail(String email) { this.email = email; }
    public String getFullName() { return fullName; } public void setFullName(String fullName) { this.fullName = fullName; }
    public String getAvatarUrl() { return avatarUrl; } public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
    public String getPhone() { return phone; } public void setPhone(String phone) { this.phone = phone; }
    public String getAddress() { return address; } public void setAddress(String address) { this.address = address; }
    public String getWard() { return ward; } public void setWard(String ward) { this.ward = ward; }
    public String getDistrict() { return district; } public void setDistrict(String district) { this.district = district; }
    public String getCity() { return city; } public void setCity(String city) { this.city = city; }
    public String getShippingNote() { return shippingNote; } public void setShippingNote(String shippingNote) { this.shippingNote = shippingNote; }
    public OffsetDateTime getCreatedAt() { return createdAt; } public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
    public OffsetDateTime getUpdatedAt() { return updatedAt; } public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
}
