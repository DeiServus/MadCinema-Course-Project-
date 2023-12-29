--1
CREATE TABLE [dbo].[user_profile](
	[id] [int] NOT NULL PRIMARY KEY identity(1,1),
	[login] [nvarchar](250) NOT NULL,
	[password] [nvarchar](250) NOT NULL,
	[email] [nvarchar](50) NOT NULL,
	[role] [nvarchar](50) NOT NULL,
	[isActivated] bit default(0),
	[isBlocked] bit default(0),
	activationLink [nvarchar](250),
	[image] [nvarchar](250))

--2
--create table [dbo].[categories](
--	id int not null primary key identity(1, 1),
--	title nvarchar(50) not null)

--3
create table [dbo].[user_films](
	id int not null primary key identity(1, 1),
	userId int not null,
	filmId int not null,
	category [nvarchar](50) not null,
	unique(userId, filmId, category))

--4
--create table position(
--	id int not null primary key identity(1, 1),
--	title nvarchar(50) not null)

--5
create table employee_films(
	id int not null primary key identity(1, 1),
	employeeId int not null,
	filmId int not null,
	position [nvarchar](50) not null,
	unique(employeeId, filmId, position))

--6
create table reviews(
	id int not null primary key identity(1, 1),
	userId int not null,
	filmId int not null,
	text nvarchar(500),
	mark int not null,
	unique(userId, filmId)
	)

alter table reviews
add rating int not null;

--7
CREATE TABLE [dbo].[EmailVerificationLinks](
	[id] [int] NOT NULL PRIMARY KEY identity(1,1),
	[email] [nvarchar](250) NOT NULL unique,
	[userId] [int] NOT NULL unique)

--8
--CREATE TABLE [dbo].[role](
--	[id] [int] NOT NULL PRIMARY KEY identity(1,1),
--	[title] [nvarchar](50) NOT NULL)

--9
CREATE TABLE [dbo].[token](
	[id] [int] NOT NULL PRIMARY KEY identity(1,1),
	[userId] [int] NOT NULL unique,
	[refreshToken] [nvarchar](255) NOT NULL unique)

--10
create table films_genres(
	[id] [int] NOT NULL PRIMARY KEY identity(1,1),
	filmId int not null,
	genre [nvarchar](50) not null,
	unique(filmId, genre))

--11
--CREATE TABLE [dbo].[genres](
--	[id] [int] NOT NULL PRIMARY KEY identity(1,1),
--	[title] [nvarchar](30) NOT NULL,
--	[description] [nvarchar](250) NULL)

--12
CREATE TABLE [dbo].[employee](
	[id] [int] NOT NULL PRIMARY KEY identity(1,1),
	[name] [nvarchar](50) NOT NULL,
	[birthplace] [nvarchar](60) NOT NULL,
	[birthday] [nvarchar](250) NOT NULL,
	[description] [nvarchar](260) NULL,
	[image] [nvarchar](250) NULL)

--13
CREATE TABLE [dbo].[image](
	[id] [int] NOT NULL PRIMARY KEY identity(1,1),
	[isCover] [bit] NOT NULL,
	[filmId] [int] NOT NULL,
	[uri] [nvarchar](400) NOT NULL)

--14
CREATE TABLE [dbo].[films](
	[id] [int] NOT NULL PRIMARY KEY identity(1,1),
	[year] [int] NOT NULL,
	[duration] [int] NOT NULL,
	[name] [nvarchar](50) NOT NULL,
	[slogan] [nvarchar](60) NOT NULL,
	[description] [nchar](250) NULL,
	[age] [int] NOT NULL,
	[budget] [int] NOT NULL,
	[charge] [int] NOT NULL)