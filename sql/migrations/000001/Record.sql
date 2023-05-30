ALTER TABLE Record
ADD COLUMN RecordSessionId INT UNSIGNED,
ADD FOREIGN KEY(RecordSessionId) REFERENCES RecordSession(Id);

UPDATE Record r
INNER JOIN RecordSession rs ON r.DiagnosisId = rs.DiagnosisId AND r.RecordTypeId = rs.RecordTypeId
SET r.RecordSessionId = rs.Id
WHERE Id > 0;

ALTER TABLE Record
DROP FOREIGN KEY Record_ibfk_6,
DROP COLUMN DiagnosisId,
DROP COLUMN RecordTypeId;