package org.project.backend.exception.member;

public class InvalidMemberDataException extends RuntimeException {
    public InvalidMemberDataException(String message) {
        super(message);
    }
}
