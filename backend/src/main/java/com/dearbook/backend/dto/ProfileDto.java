package com.dearbook.backend.dto;

import java.util.UUID;

public class ProfileDto {
    private UUID id;
    private String email;
    private String fullName;
    private String avatarUrl;
    private String phone;
    private String address;
    private String ward;
    private String district;
    private String city;
    private String postalCode;
    private String shippingNote;

    public ProfileDto() {}

    public ProfileDto(UUID id, String email, String fullName, String avatarUrl) {
        this(id, email, fullName, avatarUrl, null, null, null, null, null, null, null);
    }

    public ProfileDto(UUID id, String email, String fullName, String avatarUrl,
                      String phone, String address, String ward, String district,
                      String city, String postalCode, String shippingNote) {
        this.id = id;
        this.email = email;
        this.fullName = fullName;
        this.avatarUrl = avatarUrl;
        this.phone = phone;
        this.address = address;
        this.ward = ward;
        this.district = district;
        this.city = city;
        this.postalCode = postalCode;
        this.shippingNote = shippingNote;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getWard() { return ward; }
    public void setWard(String ward) { this.ward = ward; }
    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getPostalCode() { return postalCode; }
    public void setPostalCode(String postalCode) { this.postalCode = postalCode; }
    public String getShippingNote() { return shippingNote; }
    public void setShippingNote(String shippingNote) { this.shippingNote = shippingNote; }
}
