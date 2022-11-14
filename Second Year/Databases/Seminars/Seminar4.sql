/* User-defined functions */

/* Scalar functions 

CREATE OR ALTER FUNCTION ufName(..., ..., ...)
RETURNS returnType [AS]
BEGIN
	...SQL statements
	RETURN scalarExpr
END
*/

CREATE FUNCTION ufCountByReputation(@reputation)
RETURNS INT AS
BEGIN
	DECLARE @counter INT
	SELECT @counter = COUNT(*) FROM Pirates WHERE Reputation >= @reputation
	return @counter
END

/* In line Table Value functions

CREATE OR ALTER FUNCTION ufName(..., ..., ...)
RETURNS TABLE
RETURN SELECT 
*/

/* VIEWS */

CREATE VIEW vPiratesShares 
AS
	SELECT P.*, S.PID as PirateID, S.Value
	FROM Pirates P INNER JOIN Shares S ON PID

/* Triggers */

CREATE TRIGGER tgName
ON tableName
{FOR|AFTER|INSTEAD OF}
{[INSERT] [,] [UPDATE] [,] [DELETE]}
AS
	SqlStatements