package org.project.backend.exception.businessCard;

public class BusinessCardNotFoundException extends RuntimeException {
  public BusinessCardNotFoundException(String message) {
    super(message);
  }
}