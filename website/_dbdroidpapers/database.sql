-- phpMyAdmin SQL Dump
-- version 2.11.9.6
-- http://www.phpmyadmin.net
--
-- Host: 192.168.1.7:3306
-- Generation Time: Nov 22, 2014 at 04:55 PM
-- Server version: 5.0.32
-- PHP Version: 5.2.6

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `database`
--

-- --------------------------------------------------------

--
-- Table structure for table `dp-apikeys`
--

CREATE TABLE IF NOT EXISTS `dp-apikeys` (
  `id` int(11) NOT NULL auto_increment,
  `timestamp` timestamp NOT NULL default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
  `active` enum('yes','no') NOT NULL default 'no',
  `key` varchar(255) NOT NULL,
  `source` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `contact` varchar(255) NOT NULL,
  PRIMARY KEY  (`id`),
  KEY `key` (`key`),
  KEY `source` (`source`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COMMENT='Table with keys for access to api' AUTO_INCREMENT=4 ;

-- --------------------------------------------------------

--
-- Table structure for table `dp-app-contentset`
--

CREATE TABLE IF NOT EXISTS `dp-app-contentset` (
  `id` int(11) NOT NULL auto_increment,
  `timestamp` timestamp NOT NULL default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
  `wallpaper` varchar(255) default NULL,
  `ringtone` varchar(255) default NULL,
  `ringtype` varchar(255) default NULL,
  PRIMARY KEY  (`id`),
  KEY `wallpaper` (`wallpaper`),
  KEY `ringtone` (`ringtone`),
  KEY `ringtype` (`ringtype`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COMMENT='Table with links to content that has been set on device' AUTO_INCREMENT=87670 ;

-- --------------------------------------------------------

--
-- Table structure for table `dp-app-dbversion`
--

CREATE TABLE IF NOT EXISTS `dp-app-dbversion` (
  `id` int(11) NOT NULL auto_increment,
  `timestamp` timestamp NOT NULL default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
  `version` int(11) NOT NULL,
  `notes` varchar(255) NOT NULL,
  `app` varchar(255) NOT NULL,
  PRIMARY KEY  (`id`),
  KEY `version` (`version`),
  KEY `notes` (`notes`),
  KEY `app` (`app`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COMMENT='DroidPapers in-app database version.' AUTO_INCREMENT=2 ;

-- --------------------------------------------------------

--
-- Table structure for table `dp-app-distributions`
--

CREATE TABLE IF NOT EXISTS `dp-app-distributions` (
  `id` int(11) NOT NULL auto_increment,
  `timestamp` timestamp NOT NULL default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
  `logo` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `wallpapers` enum('yes','no') NOT NULL default 'no',
  `wallpaperstext` varchar(255) NOT NULL,
  `ringtones` enum('yes','no') NOT NULL default 'no',
  `ringtonestext` varchar(255) NOT NULL,
  `type` enum('Android Open Source','Companies','ROMs') NOT NULL default 'Companies',
  `os` varchar(255) NOT NULL,
  `active` enum('yes','no') NOT NULL,
  PRIMARY KEY  (`id`),
  KEY `name` (`name`),
  KEY `type` (`type`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COMMENT='DroidPapers in-app distributions of Android.' AUTO_INCREMENT=27 ;

-- --------------------------------------------------------

--
-- Table structure for table `dp-app-ringtones`
--

CREATE TABLE IF NOT EXISTS `dp-app-ringtones` (
  `id` int(11) NOT NULL auto_increment,
  `timestamp` timestamp NOT NULL default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
  `folder` varchar(255) NOT NULL default 'google-lollipop',
  `filename` varchar(255) NOT NULL default '.ogg',
  `type` enum('alarm','notification','ringtone') NOT NULL default 'ringtone',
  `name` varchar(255) NOT NULL,
  `distribution` varchar(255) NOT NULL default 'Android',
  `device` varchar(255) NOT NULL default '5.0 Lollipop',
  `active` enum('yes','no') NOT NULL default 'no',
  `version` int(11) NOT NULL default '54',
  PRIMARY KEY  (`id`),
  KEY `folder` (`folder`),
  KEY `filename` (`filename`),
  KEY `name` (`name`),
  KEY `distribution` (`distribution`),
  KEY `device` (`device`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COMMENT='DroidPapers in-app ringtones.' AUTO_INCREMENT=3157 ;

-- --------------------------------------------------------

--
-- Table structure for table `dp-app-wallpapers`
--

CREATE TABLE IF NOT EXISTS `dp-app-wallpapers` (
  `id` int(11) NOT NULL auto_increment,
  `timestamp` timestamp NOT NULL default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
  `name` varchar(255) NOT NULL,
  `resolution` varchar(255) NOT NULL,
  `folder` varchar(255) NOT NULL,
  `filename` varchar(255) NOT NULL,
  `amount` int(11) NOT NULL,
  `distribution` varchar(255) NOT NULL,
  `active` enum('yes','no') NOT NULL,
  `version` int(11) NOT NULL,
  `density` varchar(255) NOT NULL default 'sd',
  PRIMARY KEY  (`id`),
  KEY `folder` (`folder`),
  KEY `filename` (`filename`),
  KEY `name` (`name`),
  KEY `distribution` (`distribution`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COMMENT='DroidPapers in-app wallpapers.' AUTO_INCREMENT=129 ;

-- --------------------------------------------------------

--
-- Table structure for table `dp-app-wallpapers-notes`
--

CREATE TABLE IF NOT EXISTS `dp-app-wallpapers-notes` (
  `id` int(11) NOT NULL auto_increment,
  `timestamp` timestamp NOT NULL default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
  `wallpaper` varchar(255) NOT NULL default '.jpg',
  `note` varchar(255) NOT NULL,
  PRIMARY KEY  (`id`),
  KEY `wallpaper` (`wallpaper`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COMMENT='DroidPapers in-app wallpaper copyrights notes.' AUTO_INCREMENT=1725 ;

-- --------------------------------------------------------

--
-- Table structure for table `dp-reviews`
--

CREATE TABLE IF NOT EXISTS `dp-reviews` (
  `id` int(11) NOT NULL auto_increment,
  `timestamp` timestamp NOT NULL default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
  `name` varchar(255) NOT NULL,
  `url` varchar(255) NOT NULL,
  `language` varchar(255) NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COMMENT='DroidPapers reviews by other sites.' AUTO_INCREMENT=1 ;
