SET SQL_SAFE_UPDATES=0;
DELETE FROM RecordSession
WHERE RecordSession.Id IN (SELECT RecordSession.Id FROM RecordSession
LEFT JOIN Record ON Record.RecordSessionId = RecordSession.Id
WHERE RecordSessionId IS NULL);
SET SQL_SAFE_UPDATES=1;