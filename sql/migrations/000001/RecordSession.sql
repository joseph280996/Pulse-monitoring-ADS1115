CREATE TABLE RecordSession(
    Id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    DiagnosisId INT UNSIGNED,
    DateTimeCreated DATETIME DEFAULT CURRENT_TIMESTAMP,
    DateTimeUpdated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    RecordTypeId INT NULL,
    FOREIGN KEY(DiagnosisID) REFERENCES Diagnosis(Id)
);

INSERT INTO RecordSession(DiagnosisId, RecordTypeId)
SELECT DISTINCT DiagnosisId, RecordTypeId
FROM Record
WHERE Id > 0;