#!/usr/bin/env node

'use strict';

console.log('running script');

var
  fs = require("fs"),
  path = require("path"),

  VIEW_CONTROLLER_PATH = '/platforms/ios/CordovaLib/Classes/CDVViewController.m',
  COMMENT_KEY = /_comment$/;


// Helpers

// Returns the project name
function getProjectName(protoPath) {
  var
    cordovaConfigPath = path.join(protoPath, 'config.xml'),
    content = fs.readFileSync(cordovaConfigPath, 'utf-8');

  return /<name>([\s\S]*)<\/name>/mi.exec(content)[1].trim();
}

// Drops the comments
function nonComments(obj) {
  var
    keys = Object.keys(obj),
    newObj = {},
    i = 0;

  for (i; i < keys.length; i += 1) {
    if (!COMMENT_KEY.test(keys[i])) {
      newObj[keys[i]] = obj[keys[i]];
    }
  }

  return newObj;
}


// Starting here

module.exports = function(context) {
  var
    xcode = context.requireCordovaModule('xcode'),
    projectRoot = context.opts.projectRoot,
    projectName = getProjectName(projectRoot),
    viewControllerPath = path.join(projectRoot, VIEW_CONTROLLER_PATH),
    xcodeProject;

  // Checking if the project files are in the right place
  if (!fs.existsSync(viewControllerPath)) {
    debugerror('could not find view controller file at: "' + viewControllerPath + '"');

    return;
  }
  debug('view controller found at: ' + viewControllerPath);

  var contents = fs.readFileSync(viewControllerPath);
  debug(contents);


  // fs.appendFileSync(xcconfigPath, swiftOptions.join('\n'));


  // Writing the file again
  // fs.writeFileSync(xcodeProjectPath, xcodeProject.writeSync(), 'utf-8');
  // debug('file correctly fixed: ' + xcodeProjectPath);
};


function debug(msg) {
  console.log('ios10-patches.js [INFO] ' + msg);
}


function debugerror(msg) {
  console.error('ios10-patches.js [ERROR] ' + msg);
}
