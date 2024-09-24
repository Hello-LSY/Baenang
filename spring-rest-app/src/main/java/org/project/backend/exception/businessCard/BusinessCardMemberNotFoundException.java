package org.project.backend.exception.businessCard;

public class BusinessCardMemberNotFoundException extends RuntimeException {
    public BusinessCardMemberNotFoundException(String message) {
        super(message);
    }
}