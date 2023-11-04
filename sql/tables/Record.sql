CREATE TABLE Record(
    Id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    data TEXT DEFAULT NULL, 
    RecordTypeId INT UNSIGNED,
    DiagnosisId INT UNSIGNED DEFAULT NULL,
    DateTimeCreated DATETIME DEFAULT CURRENT_TIMESTAMP,
    DateTimeUpdated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (DiagnosisId) REFERENCES Diagnosis(id)
)
