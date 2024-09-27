package org.project.backend.service;

import org.project.backend.dto.DriverLicenseDTO;

public interface DriverLicenseService {
    //create
    DriverLicenseDTO createOrUpdateDriverLicense(Long documentId, DriverLicenseDTO driverLicenseDTO);

    //read
    DriverLicenseDTO getDriverLicenseById(Long documentId);

    //delete
    void deleteDriverLicenseById(Long documentId);

}
