package org.project.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.time.LocalDate;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@Table(name = "resident_registration")
public class ResidentRegistration {

    @Id
    @Column(name = "rrn", nullable = false, unique = true)
    private Long RRN;   //주민등록증 번호

    @Column(name="name", nullable = false, length = 50)
    private String name; //사용자 이름

    @Column(name = "image_path", nullable = false, columnDefinition = "TEXT")
    private String imagePath; //이미지경로

    @Column(name = "address", nullable = false, length = 255)
    private String address;  //주소

    @Column(name = "issue_date", nullable = false)
    private LocalDate issueDate;  //발급일

    @Column(name = "issuer", nullable = false, length = 50)
    private String issuer;  //발급처
}
