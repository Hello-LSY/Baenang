package org.project.backend.service;

import org.project.backend.dto.InternationalStudentIdentityCardDTO;

public interface InternationalStudentIdentityCardService {
    //read
    InternationalStudentIdentityCardDTO getISICById(Long isicId);

}
