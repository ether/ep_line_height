var _ = require('ep_etherpad-lite/static/js/underscore');

var heights = ['lineheight1','lineheight2','lineheight3'];

var collectContentPre = function(hook, context){
  var tname = context.tname;
  var state = context.state;
  var lineAttributes = state.lineAttributes
  var tagIndex = _.indexOf(heights, tname);
  if(tagIndex >= 0){
    lineAttributes['lineHeight'] = heights[tagIndex];
  }
};

var collectContentPost = function(hook, context){
  var tname = context.tname;
  var state = context.state;
  var lineAttributes = state.lineAttributes
  var tagIndex = _.indexOf(heights, tname);

  if(tagIndex >= 0){
    delete lineAttributes['lineHeight'];
  }
};

exports.collectContentPre = collectContentPre;
exports.collectContentPost = collectContentPost;
