ALTER TABLE Record
ADD COLUMN RecordSessionId INT UNSIGNED,
ADD FOREIGN KEY(RecordSessionId) REFERENCES RecordSession(Id);

ALTER TABLE Record
CHANGE COLUMN ID Id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT ;

SET SQL_SAFE_UPDATES=0;
UPDATE Record r
INNER JOIN RecordSession rs ON r.DiagnosisId = rs.DiagnosisId AND r.RecordTypeId = rs.RecordTypeId
SET r.RecordSessionId = rs.Id
WHERE r.Id > 0;
SET SQL_SAFE_UPDATES=1;

ALTER TABLE Record
DROP FOREIGN KEY Record_ibfk_4,
DROP COLUMN DiagnosisId,
DROP COLUMN RecordTypeId;