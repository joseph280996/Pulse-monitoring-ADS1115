CREATE TABLE Diagnosis (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    dateTimeCreated DATETIME DEFAULT CURRENT_TIMESTAMP,
    dateTimeUpdated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PulseTypeID INT UNSIGNED NULL,
    PatientID INT UNSIGNED NULL,
    FOREIGN KEY (PatientID) REFERENCES Patient(id),
    FOREIGN KEY (PulseTypeID) REFERENCES PulseType(id),
);