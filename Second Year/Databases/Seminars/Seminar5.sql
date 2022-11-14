/* Indexes in SQL Server (1)

Index
	-structure: -> on the disk
				-> table/view
	-optimise retrievel operations

CREATE [UNIQUE][CLUSTERED/NONCLUSTERED]
	INDEX index_name
ON <object> (column[...])
[INCLUDE(column[,...n])]
[WHERE<filter_predicate>]

- clustered/nonclustered

*query*
Select and CTRL+L

- unique, nonunique
*/