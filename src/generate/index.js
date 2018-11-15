import fs from 'fs';
import path from 'path';
import colors from 'colors';
import { projectConfig } from '../utils/helpers';

class GenerateModule {
  constructor(moduleName) {
    this.moduleName = moduleName.trim();

    const LModule = this.moduleName.charAt(0).toLowerCase() + this.moduleName.slice(1);

    this.workingDirectory = process.cwd();
    this.appDirectory = `${this.workingDirectory}/${projectConfig().appPath}`;
    this.modulesDirectory = `${this.appDirectory}/modules`;
    this.newModuleDirectory = `${this.modulesDirectory}/${LModule}`;

    this.generate();
  }

  createModuleFolder() {
    if (!fs.existsSync(this.appDirectory)) { fs.mkdirSync(this.appDirectory); }

    if (!fs.existsSync(this.modulesDirectory)) { fs.mkdirSync(this.modulesDirectory); }

    if (!fs.existsSync(this.newModuleDirectory)) {
      fs.mkdirSync(this.newModuleDirectory);
    } else {
      return false;
    }

    return true;
  }

  copyFile(template, filename) {
    const templatesDirectory = path.join(__dirname, '../../templates/module');

    const filePath = `${this.newModuleDirectory}/${filename}`;
    const templatePath = `${templatesDirectory}/${template}`;

    const UModule = this.moduleName.charAt(0).toUpperCase() + this.moduleName.slice(1);
    const LModule = this.moduleName.charAt(0).toLowerCase() + this.moduleName.slice(1);

    let contents = fs.readFileSync(templatePath, 'utf8');
    contents = contents.split('[UModule]').join(UModule);
    contents = contents.split('[LModule]').join(LModule);

    fs.writeFileSync(filePath, contents);


    return filePath;
  }

  generateFile(template, filename, retainFileName) {
    const destFileName = retainFileName ? filename : `${this.moduleName}${filename}`;
    this.copyFile(template, destFileName);
  }

  createModuleFiles() {
    this.generateFile('controller', 'Controller.js');
    this.generateFile('model', 'Model.js');
    this.generateFile('repository', 'Repository.js');
    this.generateFile('router', 'Route.v1.js');
    this.generateFile('index', 'index.js', true);
  }

  generate() {
    const result = this.createModuleFolder();
    if (!result) {
      return console.log(colors.red(`Module ${this.moduleName} already exists!`));
    }

    this.createModuleFiles();

    return console.log(colors.green(`Module ${this.moduleName} successfully created!`));
  }
}

module.exports = GenerateModule;
