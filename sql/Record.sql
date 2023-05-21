CREATE TABLE Record(
    Id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    data TEXT,
    DiagnosisID INT UNSIGNED,
    DateTimeCreated DATETIME DEFAULT CURRENT_TIMESTAMP,
    DateTimeUpdated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    RecordTypeId INT NULL,
    FOREIGN KEY(DiagnosisID) REFERENCES Diagnosis(Id)
)
