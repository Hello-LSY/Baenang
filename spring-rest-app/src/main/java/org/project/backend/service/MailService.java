package org.project.backend.service;

public interface MailService {
    void sendMail(String to, String subject, String text);
}
