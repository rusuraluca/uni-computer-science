'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var schematics = require('@angular-devkit/schematics');
var tasks = require('@angular-devkit/schematics/tasks');
var workspace = require('@schematics/angular/utility/workspace');
var messages = require('../messages-5930d301.js');

/**
 * Sorts the keys of the given object.
 * @returns A new object instance with sorted keys
 */
function sortObjectByKeys(obj) {
    return Object.keys(obj).sort().reduce((result, key) => (result[key] = obj[key]) && result, {});
}
/**
 * Adds a package to the package.json in the given tree
 */
function addPackageToPackageJson(tree, pkg, version) {
    if (tree.exists('package.json')) {
        const sourceText = tree.read('package.json').toString('utf-8');
        const json = JSON.parse(sourceText);
        if (!json.dependencies) {
            json.dependencies = {};
        }
        if (!json.dependencies[pkg]) {
            json.dependencies[pkg] = version;
            json.dependencies = sortObjectByKeys(json.dependencies);
        }
        tree.overwrite('package.json', JSON.stringify(json, null, 2));
    }
    return tree;
}
/**
 * Gets the version of the specified package by looking at the package.json in the given tree
 */
function getPackageVersionFromPackageJson(tree, name) {
    if (!tree.exists('package.json')) {
        return null;
    }
    const packageJson = JSON.parse(tree.read('package.json').toString('utf8'));
    if (packageJson.dependencies && packageJson.dependencies[name]) {
        return packageJson.dependencies[name];
    }
    return null;
}

/**
 * This is executed when `ng add @ng-bootstrap/ng-bootstrap` is run.
 * It installs all dependencies in the 'package.json' and runs 'ng-add-setup-project' schematic.
 */
function ngAdd(options) {
    return async (tree, context) => {
        // Checking that project exists
        const { project } = options;
        if (project) {
            const workspace$1 = await workspace.getWorkspace(tree);
            const projectWorkspace = workspace$1.projects.get(project);
            if (!projectWorkspace) {
                throw new schematics.SchematicsException(messages.noProject(project));
            }
        }
        // Installing dependencies
        const angularCoreVersion = getPackageVersionFromPackageJson(tree, '@angular/core');
        const angularLocalizeVersion = getPackageVersionFromPackageJson(tree, '@angular/localize');
        addPackageToPackageJson(tree, 'bootstrap', "^5.1.3");
        addPackageToPackageJson(tree, '@popperjs/core', "^2.10.2");
        if (angularLocalizeVersion === null) {
            addPackageToPackageJson(tree, '@angular/localize', angularCoreVersion);
        }
        context.addTask(new tasks.RunSchematicTask('ng-add-setup-project', options), [
            context.addTask(new tasks.NodePackageInstallTask()),
        ]);
    };
}

exports["default"] = ngAdd;
