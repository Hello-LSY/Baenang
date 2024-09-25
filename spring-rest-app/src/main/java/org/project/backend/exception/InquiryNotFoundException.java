package org.project.backend.exception;

public class InquiryNotFoundException extends RuntimeException {
    public InquiryNotFoundException(Long id) {
        super("Inquiry with ID " + id + " not found");
    }
}
