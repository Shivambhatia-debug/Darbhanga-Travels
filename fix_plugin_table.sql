-- Fix mysql.plugin table
-- Run this after MySQL starts successfully

DROP TABLE IF EXISTS mysql.plugin;

CREATE TABLE mysql.plugin (
  name VARCHAR(64) NOT NULL DEFAULT '',
  dl VARCHAR(128) NOT NULL DEFAULT '',
  PRIMARY KEY (name)
) ENGINE=Aria DEFAULT CHARSET=utf8mb4;

