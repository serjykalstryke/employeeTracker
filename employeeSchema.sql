DROP DATABASE IF EXISTS Employee_Tracker;
CREATE DATABASE Employee_Tracker;
USE Employee_Tracker;

CREATE TABLE department(
  id INT AUTO_INCREMENT NOT NULL,
  name VARCHAR(45) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE role(
  id INT AUTO_INCREMENT NOT NULL,
  title VARCHAR(45) NOT NULL,
  salary DECIMAL NOT NULL,
  CONSTRAINT fk_department_id FOREIGN KEY (department_id) deparment(id),
  PRIMARY KEY(id)
);

CREATE TABLE employee(
  id INT AUTO_INCREMENT NOT NULL,
  name VARCHAR(45) NOT NULL,
  power VARCHAR(45) NOT NULL,
  constraint fk_role_id FOREIGN KEY (role_id) REFERENCES role(id),
  manager_id integer,
  constraint fk_manager_id FOREIGN KEY (manager_id) REFERENCES employee(id),
  Primary key(id)
);

SELECT*
FROM employee;
SELECT *
FROM role;
SELECT *
FROM department;

INSERT INTO department (name)
VALUES ("Sales");
INSERT INTO department (name)
VALUES ("Engineering");
INSERT INTO department (name)
VALUES ("Finance");
INSERT INTO department (name)
VALUES ("Legal");
INSERT INTO department (name)
VALUES ("Manager");

SELECT *
FROM department;

INSERT INTO role (title, salary, department_id)
VALUES ("Goon", 35000, 1);
INSERT INTO role (title, salary, department_id)
VALUES ("Head-Goon", 45000, 2);
INSERT INTO role (title, salary, department_id)
VALUES ("Low Level Villian", 43000, 2);
INSERT INTO role (title, salary, department_id)
VALUES ("Mid Tier Villian", 50000, 3);
INSERT INTO role (title, salary, department_id)
VALUES ("Assistant to the Super Villian", 50000, 4);
INSERT INTO role (title, salary, department_id)
VALUES("Super Villian", 65000, 5);

SELECT *
FROM role;

INSERT INTO employee (name, power, department_id)
VALUES ("Kite-Man", "Is good with kites", 1);
INSERT INTO employee (name, power, department_id)
VALUES ("Polka-Dot Man", "Magic shapeshifting polka-dots", 2);
INSERT INTO employee (name, power, department_id)
VALUES ("Polka-Dot Man", "Magic shapeshifting polka-dots", 3);
INSERT INTO employee (name, power, department_id)
VALUES ("Mr. Freeze", "Ice puns", 4);
INSERT INTO employee (name, power, department_id)
VALUES ("The Penguin", "Looks like Danny Devito", 5);
INSERT INTO employee ("The Joker", "Wants to watch the world burn", 6);

SELECT *
FROM employee;
