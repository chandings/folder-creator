# What is folder-creator:

Folder creator is  a command line tool that allows you to generate folders and files from a saved template. Templates can be a JSON file. The tool also allows you to templatize the names and contents of the files and folders. 

## Installation

`npm install -g folder-creator`

Ensure that `-g` option is used otherwise the tool will not be available outside the installed folder.

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

## Example: creating folders with specific name

`fct -tn myfolderstructure newFolderName` 

The above command will create the folder structure from the saved template 'myfolderstructure'. The folders will be created in a new folder with name 'newFolderName'. In the template '&lt;name&gt;' will be replaced with 'newFolderName' and '&lt;Name&gt;' will be replaced with 'NewFolderName'.

## Example: creating folders with specific paramerter

`fct -tn myfolderstructure -n main newFolderName` 

The above command will create the folder structure from the saved template 'myfolderstructure'. The folders will be created in a new folder with name 'newFolderName'. In the template '&lt;name&gt;' will be replaced with 'main' and '&lt;Name&gt;' will be replaced with 'Main'.

## Usage

   `folder-creator [options] [argument]`

## Full options list
|Options|Description|
| ----------- | ----------- |
|-t, --templatePath &lt;template-path&gt; |Provide the location to json file containing the template to generate.
|-ct, --createTemplate              |Will iterate through the directory and create a template. If used with --saveTemplate option it will save the created template. Otherwise, will use the argument to save thee file.
|-st, --saveTemplate &lt;template-name&gt;|Saves (overwrites if exists) the template with the given name. Must be used with --templatePath option. Folder template is not created.
|-tn, --templateName &lt;template-name&gt;|Create the folder template using the template saved with the given name.
|-n, --name &lt;name&gt;                  |When used with -ct / --createTemplate this would replace the provided text with &lt;name&gt; before the template is saved. Otherwise this would replace all &lt;name&gt; in the template with the provided option. If not provided it will be replaced with the argument.
|-v, --verbose                      |Show detailed messages.
|-md, --makeDefault &lt;make-default&gt;  |will make the provided template name as default. This will override the previous default.
|-h, --help                         |display help for command

## Templates already included

|Name|Description|
| ----------- | ----------- |
|vanilajs|Creates a folder structure for a basic browser js project, name is parameterized.|
|nodejs|Creates a folder structure for a basic nodejs project, name is parameterized.|
|reactjs|Creates a folder structure for a reactjs project, name is parameterized.|
|rcc|Creates reactjs functional component with a linked css file|
