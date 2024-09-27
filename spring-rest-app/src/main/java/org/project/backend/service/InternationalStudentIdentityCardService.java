package org.project.backend.service;

import org.project.backend.dto.InternationalStudentIdentityCardDTO;

public interface InternationalStudentIdentityCardService {
    //create
    InternationalStudentIdentityCardDTO createOrUpdateISIC(Long documentId, InternationalStudentIdentityCardDTO isic);

    //read
    InternationalStudentIdentityCardDTO getISICById(Long documentId);

    //delete
    void deleteISICById(Long documentId);
}
