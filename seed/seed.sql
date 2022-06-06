CREATE USER 'pulsemonitoring'@'%' IDENTIFIED BY 'Joseph280996@1406';
GRANT ALL PRIVILEGES ON pulsemonitoring.* TO 'pulsemonitoring'@'%';
FLUSH PRIVILEGES;

CREATE TABLE HandPosition (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255)
);
INSERT INTO HandPosition(name) 
VALUES ('left upper'), ('left middle'), ('left bottom'), ('right upper'), ('right middle'), ('right bottom');


CREATE TABLE PulseType (
	id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) DEFAULT NULL,
  features VARCHAR(255) DEFAULT NULL,
  chineseName VARCHAR(255) CHARACTER SET 'gbk' COLLATE 'gbk_chinese_ci' NULL DEFAULT NULL
);

INSERT INTO PulseType(name, chineseName, features) VALUES ('Fu Mai','浮脉', 'Floating, Superficial'),('Chen Mai','沉脉', 'Deep'),('Chi Mai','迟脉', 'Slow'),('Shuo Mai','数脉', 'Rapid'),('Hua Mai','滑脉','Slippery, Rolling'),('Se Mai','涩脉','Choppy, Hesitant'),('Xu Mai','虚脉','Forceless, Empty, Deficient'),('Shi Mai','实脉','Excess, Full, Replete, Forceful'),('Chang Mai','长脉','Long'),('Duan Mai','短脉', 'Short'),('Hong Mai','洪脉','Surging, Flooding'),('Wei Mai','微脉','Minute, Faint, Indistinct'),('Jin Mai','紧脉','Tight, Tense'),('Huan Mai','缓脉', 'Slowed down, Moderate, or Relaxed'),('Kou Mai','芤脉', 'Hollow or Scallion Stalk, Green Onion'),('Xian Mai','弦脉', 'Wiry, Taut'),('Ge Mai','革脉', 'Leathery, Drumskin, Tympanic, Hard'),('Lao Mai','牢脉', 'Firm, Confined'),('Ru Mai','濡脉', 'Soft or Soggy'),('Ruo Mai','弱脉','Weak'),('San Mai','散脉', 'Scattered'),('Xi Mai','细脉','Thready, Thin'),('Fu Mai','伏脉','Hidden'),('Dong Mai','动脉', 'Moving, Throbbing, Stirring'),('Cu Mai','促脉','Rapid-Irregular, Skipping, Abrupt'),('Jie Mai','结脉','Knotted, Bound'),('Dai Mai','代脉','Regularly Intermittent'),('Jin Mia','紧脉','Tight, Tense'),('Ji Mai','急脉','Racing, Swift, Hurried'),('Da Mai','大脉','Large, Big');

CREATE TABLE Patient (
  	id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(255) NULL,
    lastName VARCHAR(255) NULL
);

CREATE TABLE Record(
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  typeID INT UNSIGNED,
  DiagnosisID INT UNSIGNED NULL,
  FOREIGN KEY (RecordDataID) REFERENCES Record(id),
)

CREATE TABLE Diagnosis (
	id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    data TEXT,
    dateTimeCreated DATETIME DEFAULT CURRENT_TIMESTAMP,
    dateTimeUpdated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PulseTypeID INT UNSIGNED NULL,
    HandPositionID INT UNSIGNED NULL,
    PatientID INT UNSIGNED NULL,
    FOREIGN KEY (PatientID) REFERENCES Patient(id),
    FOREIGN KEY (PulseTypeID) REFERENCES PulseType(id),
    FOREIGN KEY (HandPositionID) REFERENCES HandPosition(id)
);
