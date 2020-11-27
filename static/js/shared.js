var _ = require('ep_etherpad-lite/static/js/underscore');

var heights = ['lineheight1', 'lineheight2', 'lineheight3'];

var collectContentPre = function (hook, context) {
  const tname = context.tname;
  const state = context.state;
  const lineAttributes = state.lineAttributes;
  const tagIndex = _.indexOf(heights, tname);
  if (tagIndex >= 0) {
    lineAttributes.lineHeight = heights[tagIndex];
  }
};

var collectContentPost = function (hook, context) {
  const tname = context.tname;
  const state = context.state;
  const lineAttributes = state.lineAttributes;
  const tagIndex = _.indexOf(heights, tname);

  if (tagIndex >= 0) {
    delete lineAttributes.lineHeight;
  }
};

exports.collectContentPre = collectContentPre;
exports.collectContentPost = collectContentPost;
