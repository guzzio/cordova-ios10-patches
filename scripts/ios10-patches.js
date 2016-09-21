#!/usr/bin/env node

'use strict';

console.log('running script');

var
  fs = require("fs"),
  path = require("path"),

  OLD_VIEW_CONTROLLER_PATH = '/platforms/ios/CordovaLib/Classes/CDVViewController.m',
  NEW_VIEW_CONTROLLER_PATH = '/plugins/io.guzz.cordova-ios10-patches/patches/CDVViewController.m';

function patchViewControllerForCordova520(context) {
  var
    projectRoot = context.opts.projectRoot,
    oldViewControllerPath = path.join(projectRoot, OLD_VIEW_CONTROLLER_PATH),
    newViewControllerPath = path.join(projectRoot, NEW_VIEW_CONTROLLER_PATH);

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
}

module.exports = function(context) {
  var version = context.opts.cordova.version;
  if (version === '5.2.0') {
    debug('patching Cordova 5.2.0 view controller for iOS 10 compatibility');
    patchViewControllerForCordova520(context);
  }
};

function debug(msg) {
  console.log('ios10-patches.js [INFO] ' + msg);
}

function debugerror(msg) {
  console.error('ios10-patches.js [ERROR] ' + msg);
}
