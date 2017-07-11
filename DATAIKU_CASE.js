Hello,
 
You will find  an extract of a dataset on the US census at the following URL:
http://dev.dataiku.com/~cstenac/dev-recruiting/us-census.db.gz
****************************DONE*******************************

This file is a SQLite database. It contains a single table "census_learn_sql", containing demographical
record data.
****************************DONE*******************************

Your goal is to create a small web application to visualize data from this database.
****************************DONE*******************************

The application should allow the user to select a column from the database. It should then display,
for each value of the variable, the count of rows with this value and the average of the "age" value.
The values should be sorted by decreasing count. It is OK to clip and only keep the first 100 values for a variable. 
****************************DONE*******************************

For example, it could look like this: http://dev.dataiku.com/~cstenac/dev-recruiting/us-census-exercice.jpg
 ****************************DONE*******************************

For simplicity, all columns (except the "age" column) are considerered as string columns.
 ****************************DONE*******************************

Your application should be a single-page web application, ie the user must be able to change
the variable without reloading the page.
 ****************************DONE*******************************
 
"Bonus points":
* When there are more than 100 values, it would be nice to know the number of values that were not displayed.
* Even better: know the number of rows that were clipped out.
* Try to plan for some extensibility: it should be easy to change the database file and the variables
****************************DONE*******************************
 
There is absolutely no constraint on the technological stack that you might choose to achieve this,
either in the backend or frontend. Choose whichever you think is best suited for the task.
****************************DONE*******************************
Ideally, please publish your code on Github or Bitbucket to share it with me (account: "cstenac" - on Bitbucket, 
private repositories are free). Mail would also work. If you have any issue, don't hesitate to contact
me!

Good luck !