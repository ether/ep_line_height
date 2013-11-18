var _ = require('ep_etherpad-lite/static/js/underscore');

var heights = ['Single', 'Double'];

var collectContentPre = function(hook, context){
  var tname = context.tname;
  var state = context.state;
  var lineAttributes = state.lineAttributes
  var tagIndex = _.indexOf(heights, tname);

  if(tagIndex >= 0){
    lineAttributes['height'] = heights[tagIndex];
  }
};

var collectContentPost = function(hook, context){
  var tname = context.tname;
  var state = context.state;
  var lineAttributes = state.lineAttributes
  var tagIndex = _.indexOf(heights, tname);

  if(tagIndex >= 0){
    delete lineAttributes['height'];
  }
};

exports.collectContentPre = collectContentPre;
exports.collectContentPost = collectContentPost;
