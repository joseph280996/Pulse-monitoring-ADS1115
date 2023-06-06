SET SQL_SAFE_UPDATES=0;
DELETE FROM Diagnosis
WHERE Diagnosis.Id IN (SELECT Diagnosis.Id FROM Diagnosis
LEFT JOIN RecordSession ON RecordSession.DiagnosisId = Diagnosis.Id
WHERE RecordSession.Id IS NULL);
SET SQL_SAFE_UPDATES=1;
