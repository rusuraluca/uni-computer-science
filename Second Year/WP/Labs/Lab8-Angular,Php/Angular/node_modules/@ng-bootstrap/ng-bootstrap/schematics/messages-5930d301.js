'use strict';

function noProject(project) {
    return `Unable to find project '${project}' in the workspace`;
}
function unsupportedStyles(styleFilePath) {
    return `Project style file found has unsupported extension: '${styleFilePath}'\nAdding 'bootstrap.min.css' to 'angular.json'`;
}
function noMainFile(projectName) {
    return `Unable to find 'build.options.main' file path for project "${projectName}"`;
}
function noModuleFile(moduleFilePath) {
    return `File '${moduleFilePath}' does not exist.`;
}

exports.noMainFile = noMainFile;
exports.noModuleFile = noModuleFile;
exports.noProject = noProject;
exports.unsupportedStyles = unsupportedStyles;
