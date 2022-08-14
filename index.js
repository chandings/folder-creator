#!/usr/bin/env node

const { program } = require('commander');
const path = require('path');
const fs = require('fs');

program
.option('-t, --templatePath <template-path>', 'Provide the location to json file containing the template to generate.')
.option('-ct, --createTemplate','Will iterate through the directory and create a template. If used with --saveTemplate option it will save the created template. Otherwise, will use the argument to save thee file.')
.option('-st, --saveTemplate <template-name>', 'Saves (overwrites if exists) the template with the given name. Must be used with --templatePath option. Folder template is not created.')
.option('-tn, --templateName <template-name>', 'Create the folder template using the template saved with the given name.')
.option('-n, --name <name>','When used with -ct / --createTemplate this would replace the provided text with <name> before the template is saved. Otherwise this would replace all <name> in the template with the provided option. If not provided it will be replaced with the argument.')
// .option('-p, --path <path>', 'The path where the folder template will be created. If not provided the template will be created in the current working directory')
.option('-d, --default', 'Create using default template. If no default is set this will create an empty folder if an argument is provided.')
.option('-v, --verbose', 'Show detailed messages.')
.option('-md, --makeDefault <make-default>', 'will make the provided template name as default. This will override the previous default.')
.usage("folder-creator [options] [argument]");

program.parse();
const isVerbose = program.opts().verbose === true;
const folderName = program.args.join(" ");
const name = (program.opts().name !== undefined)?program.opts().name:folderName.split("/")[folderName.split("/").length-1];
const Name = name.charAt(0).toUpperCase() + name.slice(1);

let template = {};


const loadFile = (path)=>{
    try {
        const data = fs.readFileSync(path, 'utf8');
        return data;//template = JSON.parse(data);
    } catch (err) {
        log(err.message,true);
    }
}

const mkdir = (folderName)=>{
    try {
        if (!fs.existsSync(folderName)) {
          fs.mkdirSync(folderName);
          log(`Folder with name: ${folderName} created successfully.`)
        }else{
           log(`${folderName} already exists.`)
        }
      } catch (err) {
        log(err.message,true);
      }
}

const mkfile = (fileName, content)=>{
    try {
        fs.writeFileSync(fileName, content);
        log(`File with name:${fileName} created successfully.`)
    } catch (err) {
        log(err.message,true);
    }
}

const log = (msg, isError, force)=>{
    if(isVerbose || force === true){
        if(isError === true){
            console.error("Error:"+msg)
        }else{
            console.log(msg);
        }
    }else if(isError === true){
        console.error("Error:An error occurred, please run using -v or --verbose option to get more details.")
    }
}
let fileCounter  = 0;
let folderCounter = 0;
const mkTemplates = (obj, path)=>{
    if(path.trim() === ""){
        path = "."
    }else{
        folderCounter++
        mkdir(path);
    }
    let fileName;
    let content;
    for (const key in obj) {
        fileName = key.replace(/<name>/gi, word => {
                if(word == "<name>")
                    return name;
                if(word === "<Name>")
                    return Name;
                return word;
            });
        if(typeof obj[key] === "object"){
            mkTemplates(obj[key], path+"/"+fileName);
        }else{
            content =  obj[key].replace(/<name>/gi, word => {
                if(word == "<name>")
                    return name;
                if(word === "<Name>")
                    return Name;
                return word;
            });
            fileCounter++;
            mkfile(path+"/"+fileName, content);
        }
    }
};

const createTemplate = (path)=>{
    try {
        const files = fs.readdirSync(path);
        let isFile = false;
        let templateObj = {};
        let key;
        let content;
        var regex = new RegExp(name,"gi");
        files.forEach(file => {
            isFile = fs.statSync(path+"/"+file).isFile();
            if(isFile){
                if(name && name.trim() !== ""){
                    content = loadFile(path+"/"+file).replace(regex, word => {
                        if(word == name)
                            return "<name>";
                        if(word === Name)
                            return "<Name>";
                        return word;
                    });
                    key = file.replace(regex, word => {
                        if(word == name)
                            return "<name>";
                        if(word === Name)
                            return "<Name>";
                        return word;
                    });
                    templateObj[key] = content;
                }else{
                    templateObj[file] = loadFile(path+"/"+file);
                }
            }else{
                if(name && name.trim() !== ""){
                    key = file.replace(regex, word => {
                        if(word == name)
                            return "<name>";
                        if(word === Name)
                            return "<Name>";
                        return word;
                    });
                    templateObj[key] = createTemplate(path+"/"+file);
                }else{
                    templateObj[file] = createTemplate(path+"/"+file);
                }
            }
        });
        return templateObj;
    } catch (err) {
        log(err.message, true);
    }
}

const saveTemplateFile = (name, content) => {
    let templateDirPath = require.main.path + "/templates";
    if(!fs.existsSync(templateDirPath)){
        mkdir(templateDirPath)
    }

    mkfile(templateDirPath + "/" + name, content);
}

const saveTemplate = (templateName, template)=>{
    try{
        const templateList = require.main.path+"/templateList.json";
        let templateListObj = {};
        saveTemplateFile(templateName, JSON.stringify(template));
        if(!fs.existsSync(templateList)){
            templateListObj[templateName] = "/templates/"+templateName;//template;
            mkfile(templateList, JSON.stringify(templateListObj));
            return;
        }
        templateListObj = JSON.parse(loadFile(templateList));
        if(templateListObj[templateName]){
            log(`Template with the name ${templateName} already exists. It will be overwritten!`, false, true)
        }

        templateListObj[templateName] = "/templates/"+templateName;;
        mkfile(templateList, JSON.stringify(templateListObj));
        log(`Template with the name ${templateName} was successfully saved.`, false, true)
    }
    catch(err){
        log(err.message, true)
    }
}

const getSavedTemplateList = (templateName)=>{
    const templateList = require.main.path+"/templateList.json";
    if(!fs.existsSync(templateList)){
        if(templateName === 'default'){
            return {};
        }else{
            
            return null;
        }
    }

    const templateListObj = JSON.parse(loadFile(templateList));
    if(!templateListObj[templateName]){
        if(templateName === 'default'){
            return {};
        }else{
            log(`Template with the name ${templateName} does not exist!`, true, true);
            return null;
        }
    }
    return JSON.parse(loadFile(require.main.path + templateListObj[templateName]));
}




if(program.opts().makeDefault !== undefined){
    let templateName = program.opts().makeDefault;
    let templateListObj = JSON.parse(loadFile(require.main.path+"/templateList.json"));
    if(!templateListObj[templateName]){
        log(`Template with the name ${templateName} does not exist!`, true, true);
    }else{
        templateListObj["default"] = templateListObj[templateName];
        mkfile(require.main.path+"/templateList.json", JSON.stringify(templateListObj));
    }

}else if(program.opts().createTemplate !== undefined){
    let templateObj = createTemplate("./");
    if(program.opts().saveTemplate !== undefined){
        saveTemplate(program.opts().saveTemplate, templateObj)
    }else{
        if(!folderName || folderName.trim() === ""){
            log("Argument is needed to create template. Or use -st / --saveTemplate to save the created template.", true, true)
        }else{
            mkfile(folderName, JSON.stringify(templateObj));
            log(`Template with name ${folderName} created successfully.`, false, true);
        }
    }
}else if(program.opts().saveTemplate !== undefined){
    if(program.opts().templatePath === undefined){
        log("Please provide the template path using --templatePath or -t option.", true, true);
    }else{
        saveTemplate(program.opts().saveTemplate, JSON.parse(loadFile(program.opts().templatePath)))
    }
}else if(program.opts().templateName !== undefined){
    template = getSavedTemplateList(program.opts().templateName)
    if(template !== null){
        mkTemplates(template, folderName);
        log(`${fileCounter} files & ${folderCounter} folders were successfully created.`, false, true);
    }else{
        log(`Template with the name ${program.opts().templateName} does not exist!`, true, true);
    }
}else if(program.opts().templatePath !== undefined){
    try{
        template = JSON.parse(loadFile(program.opts().templatePath));
    }
    catch(err){
        log(err.message, true);
    }
    mkTemplates(template, folderName);
    log(`${fileCounter} files & ${folderCounter} folders were successfully created.`, false, true);
}else if(program.opts().default !== undefined){
    template = getSavedTemplateList("default");
    template = (!template)?{}:template;
    mkTemplates(template, folderName);
    log(`${fileCounter} files & ${folderCounter} folders were successfully created.`, false, true);
}else{
    log("Please provide options.", true, true)
}