CREATE DATABASE if not exists hkscp_db;

use hkscp_db;

CREATE TABLE IF NOT EXISTS `employees` (
	`id` VARCHAR(255) NOT NULL,
	`name` VARCHAR(255) NOT NULL,
	`tel` VARCHAR(50) NOT NULL,
	`age` INT NOT NULL,
	`isMarried` boolean,
	`sex` VARCHAR(50) NOT NULL,
	`address` VARCHAR(255) NOT NULL,
	`created_at` DATETIME NOT NULL,
	`updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (`id`)
) ENGINE = InnoDB;

INSERT INTO
	`hkscp_db`.`employees` (
		`id`,
		`name`,
		`tel`,
		`age`,
		`isMarried`,
		`sex`,
		`address`,
		`created_at`
	)
VALUES
	(
		'90f1bbc6-f454-4b1a-9f2b-9a48bf1f8a1f',
		'johnTest',
		'4321-4321',
		'28',
		false,
		'Male',
		'Tai Po, hk',
		'2020-11-19 03:30:30'
	);
