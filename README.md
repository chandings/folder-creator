# What is folder-creator:

Folder creator is  a command line tool that allows you to generate folders and files from a saved template. Templates can be a JSON file. The tool also allows you to templatize the names and contents of the files and folders. 

## Example: Creating a template

`fct -ct myfolderstructure.json`

The above command will create a json containing the current folder structure along with all the files and its contents. 

## Example: Creating and saving a template

`fct -ct -st myfolderstructure` 

The above command will create the template and save it within the tool with the name myfolderstructure. No local files are created.

## Example: Parameterizing a value while creating the template

`fct -ct -n main -st myfolderstructure` 

The above command will replace 'main' with '&lt;name&gt;' and 'Main' with '&lt;Name&gt;' while creating the template.

## Example: creating folders from a template file

`fct -t c:/mytemplates/myfolderstructure.json` 

The above command will create the folder structure stored in the file 'c:/mytemplates/myfolderstructure.json'. The folders will be created in the current folder.

## Example: creating folders from saved template

`fct -tn myfolderstructure` 

The above command will create the folder structure from the saved template 'myfolderstructure'. The folders will be created in the current folder.

## Example: creating folders from saved template

`fct -tn myfolderstructure` 

The above command will create the folder structure from the saved template 'myfolderstructure'. The folders will be created in the current folder.


