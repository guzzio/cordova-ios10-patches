#!/usr/bin/env node

'use strict';

console.log('running script');

var
  fs = require("fs"),
  path = require("path"),

  OLD_VIEW_CONTROLLER_PATH = '/platforms/ios/CordovaLib/Classes/CDVViewController.m',
  NEW_VIEW_CONTROLLER_PATH = '/plugins/io.guzz.cordova-ios10-patches/patches/CDVViewController.m',
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
    oldViewControllerPath = path.join(projectRoot, OLD_VIEW_CONTROLLER_PATH),
    newViewControllerPath = path.join(projectRoot, NEW_VIEW_CONTROLLER_PATH),
    xcodeProject;

  // Check if old view controller is existing
  if (!fs.existsSync(oldViewControllerPath)) {
    debugerror('could not find old view controller file at: "' + oldViewControllerPath + '"');
    return;
  }
  debug('old view controller found at: ' + oldViewControllerPath);

  // Check if new view controller is existing
  if (!fs.existsSync(newViewControllerPath)) {
    debugerror('could not find new view controller file at: "' + newViewControllerPath + '"');
    return;
  }
  debug('new view controller found at: ' + newViewControllerPath);
  debug('replacing old view controller with new view controller');
  fs.createReadStream(newViewControllerPath).pipe(fs.createWriteStream(oldViewControllerPath));
};


function debug(msg) {
  console.log('ios10-patches.js [INFO] ' + msg);
}


function debugerror(msg) {
  console.error('ios10-patches.js [ERROR] ' + msg);
}
