package org.project.backend.service;

import org.project.backend.dto.DriverLicenseDTO;

public interface DriverLicenseService {

    //read
    DriverLicenseDTO getDriverLicenseById(Long dlnId);

}
