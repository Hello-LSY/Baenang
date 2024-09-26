package org.project.backend.service;

import org.project.backend.dto.InternationalStudentIdentityCardDTO;

public interface InternationalStudentIdentityCardService {
    //create
    InternationalStudentIdentityCardDTO createInternationalStudentIdentityCard(Long documentId, InternationalStudentIdentityCardDTO isic);

    //read
    InternationalStudentIdentityCardDTO getInternationalStudentIdentityCard(Long documentId);

    //delete
    void deleteInternationalStudentIdentityCard(Long documentId);
}
