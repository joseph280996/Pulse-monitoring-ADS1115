CREATE TABLE Record(
    Id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    data TEXT DEFAULT NULL, 
    RecordTypeId INT UNSIGNED,
    DateTimeCreated DATETIME DEFAULT CURRENT_TIMESTAMP,
    DateTimeUpdated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY(RecordSessionId) REFERENCES RecordSession(Id)
)
