/* jshint node: true */
var writeFile = require('broccoli-file-creator');
var mergeTrees = require('broccoli-merge-trees');

var cachedTree;

module.exports = {
    name: 'ember-cli-file-creator',
    init: function() {
        cachedTree = {};
    },

    treeFor: function(name) {
      var tree = cachedTree[name];
      if (tree === undefined) {
        tree = mergeTrees(this.options.filter(filesForTree(name)).map(createFile, this));
        cachedTree[name] = tree;
      }
      return tree;
    },
    included: function(app) {
        this._super.included(app);
        this.options = app.options.fileCreator || [];
    }
};

function filesForTree(tree) {
  return function(current) {
    return current.tree === undefined && tree === 'app' || current.tree === tree;
  };
}

function contentFor(content) {
    if (typeof content === 'function') {
        return content();
    }
    return content;
}

function createFile(current) {
    var content = current.content;
    var tree = writeFile('test', contentFor(content));
    var moduleFile = this.concatFiles(tree, {
        inputFiles: ['test'],
        outputFile: current.filename
    });
    return moduleFile;
}
