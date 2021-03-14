CREATE TABLE Record (
	id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    dateTimeCreated DATETIME DEFAULT CURRENT_TIMESTAMP,
    dateTimeUpdated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	leftHandUpper TEXT,
    leftHandMiddle TEXT,
    leftHandBottom TEXT,
    rightHandUpper TEXT,
    rightHandMiddle TEXT,
    rightHandBottom TEXT,
    pulseTypeID INT UNSIGNED,
    FOREIGN KEY (pulseTypeID) REFERENCES PulseType(id)
);
