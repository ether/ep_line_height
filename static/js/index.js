var _, $, jQuery;

var $ = require('ep_etherpad-lite/static/js/rjquery').$;
var _ = require('ep_etherpad-lite/static/js/underscore');
var cssFiles = ['ep_line-height/static/css/editor.css'];
// All our lineHeights are block elements, so we just return them.

var lineHeights = [0, '1', '2', '3'];

// Bind the event handler to the toolbar buttons
var postAceInit = function (hook, context) {
  const hs = $('.height-selection');
  hs.on('change', function () {
    const value = $(this).val();
    const intValue = parseInt(value, 10);
    if (!_.isNaN(intValue)) {
      context.ace.callWithAce((ace) => {
        ace.ace_doInsertlineHeights(intValue);
      }, 'insertLineHeight', true);
      hs.val('dummy');
    }
  });
  $('.line-height-menu').hover(() => {
    $('.submenu > .height-selection').attr('size', 4);
  });
  $('.line-height').click(() => {
    $('.line-height-select').toggle();
  });
};

exports.aceGetFilterStack = function (name, context) {
  return [
    context.linestylefilter.getRegexpFilter(
        new RegExp('lineHeights', 'g'), 'lineHeights'),
  ];
};

// Our lineHeights attribute will result in a heaading:h1... :h6 class
function aceAttribsToClasses(hook, context) {
  if (context.key == 'lineHeights') {
    return [`lineHeights:${context.value}`];
  }
}


// Here we convert the class lineHeights:h1 into a tag
exports.aceDomLineProcessLineAttributes = function (name, context) {
  const cls = context.cls;
  const domline = context.domline;
  const lineHeightsType = /(?:^| )lineHeights:([A-Za-z0-9]*)/.exec(cls);
  let tagIndex;
  if (lineHeightsType) {
    tagIndex = _.indexOf(lineHeights, lineHeightsType[1]);
  }

  if (tagIndex !== undefined && tagIndex >= 0) {
    const tag = lineHeights[tagIndex];
    if (tag == '1') var height = '130%';
    if (tag == '2') var height = '195%';
    if (tag == '3') var height = '260%';
    const modifier = {
      preHtml: `<lineheight${tag} style="line-height:${height}">`,
      postHtml: '</lineheight>',
      processedMarker: true,
    };
    return [modifier];
  }
  return [];
};


// Find out which lines are selected and assign them the lineHeights attribute.
// Passing a level >= 0 will set a lineHeights on the selected lines, level < 0
// will remove it
function doInsertlineHeights(level) {
  const rep = this.rep;
  const documentAttributeManager = this.documentAttributeManager;
  if (!(rep.selStart && rep.selEnd) || (level >= 0 && lineHeights[level] === undefined)) {
    return;
  }

  let firstLine, lastLine;

  firstLine = rep.selStart[0];
  lastLine = Math.max(firstLine, rep.selEnd[0] - ((rep.selEnd[1] === 0) ? 1 : 0));
  _(_.range(firstLine, lastLine + 1)).each((i) => {
    if (level >= 0) {
      documentAttributeManager.setAttributeOnLine(i, 'lineHeights', lineHeights[level]);
    } else {
      documentAttributeManager.removeAttributeOnLine(i, 'lineHeights');
    }
  });
}


// Once ace is initialized, we set ace_doInsertlineHeights and bind it to the context
function aceInitialized(hook, context) {
  const editorInfo = context.editorInfo;
  editorInfo.ace_doInsertlineHeights = _(doInsertlineHeights).bind(context);
}


// Export all hooks
exports.aceInitialized = aceInitialized;
exports.postAceInit = postAceInit;
exports.aceAttribsToClasses = aceAttribsToClasses;

exports.aceRegisterBlockElements = function () {
  return ['lineheight1', 'lineheight2', 'lineheight3'];
};
