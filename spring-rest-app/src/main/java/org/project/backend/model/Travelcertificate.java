package org.project.backend.model;

import lombok.Data;

import javax.persistence.*;
import java.util.Date;

@Data
@Entity
@Table(name="travelcertificate")
public class Travelcertificate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long travelid;

    @Column(name = "username")
    private String username;

    @Column(name = "VisitedCountry")
    private String visitedcountry;

    @Column(name = "ImagePath")
    private String imagepath;

    @Column(name = "TravelDate")
    private Date travledate;

}
