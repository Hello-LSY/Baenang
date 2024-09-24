package org.project.backend.exception.member;

public class GeneralMemberNotFoundException extends RuntimeException {
    public GeneralMemberNotFoundException(String message) {
        super(message);
    }
}
