var _, $, jQuery;

var $ = require('ep_etherpad-lite/static/js/rjquery').$;
var _ = require('ep_etherpad-lite/static/js/underscore');
var lineHeightsClass = 'lineHeights';
var cssFiles = ['ep_line-height/static/css/editor.css'];
// All our lineHeights are block elements, so we just return them.

var lineHeights = [0, "1","2","3"];

// Bind the event handler to the toolbar buttons
var postAceInit = function(hook, context){
  var hs = $('#height-selection');
  hs.on('change', function(){
    var value = $(this).val();
    var intValue = parseInt(value,10);
    if(!_.isNaN(intValue)){
      context.ace.callWithAce(function(ace){
        ace.ace_doInsertlineHeights(intValue);
      },'insertLineHeight' , true);
      hs.val("dummy");
    }
  })
};



// Our lineHeights attribute will result in a heaading:h1... :h6 class
function aceAttribsToClasses(hook, context){
  if(context.key == 'lineHeights'){
    return ['lineHeights:' + context.value ];
  }
}


// Here we convert the class lineHeights:h1 into a tag
exports.aceCreateDomLine = function(name, context){
  var cls = context.cls;
  var domline = context.domline;
  var lineHeightsType = /(?:^| )lineHeights:([A-Za-z0-9]*)/.exec(cls);

  var tagIndex;
  if (lineHeightsType){
    tagIndex = _.indexOf(lineHeights, lineHeightsType[1]);
  }

      
  if (tagIndex !== undefined && tagIndex >= 0){
    var tag = lineHeights[tagIndex]; 
    if(tag == "1") tag = "100%";
    if(tag == "2") tag = "150%";
    if(tag == "3") tag = "200%";
    var modifier = {
      extraOpenTags: '<span style="line-height: ' + tag + '">',
      extraCloseTags: '</span>',
      cls: cls
    };
    return [modifier];
  }
  return [];
};



// Find out which lines are selected and assign them the lineHeights attribute.
// Passing a level >= 0 will set a lineHeights on the selected lines, level < 0 
// will remove it
function doInsertlineHeights(level){
  var rep = this.rep;
  var documentAttributeManager = this.documentAttributeManager;

  if (!(rep.selStart && rep.selEnd) || (level >= 0 && lineHeights[level] === undefined)) return;
  
  if(level >= 0){
    documentAttributeManager.setAttributesOnRange(rep.selStart, rep.selEnd, [
      ['lineHeights', lineHeights[level]]
    ]);
  }else{
    documentAttributeManager.setAttributesOnRange(rep.selStart, rep.selEnd, [
      ['lineHeights', '']
    ]);
  }
}


// Once ace is initialized, we set ace_doInsertlineHeights and bind it to the context
function aceInitialized(hook, context){
  var editorInfo = context.editorInfo;
  editorInfo.ace_doInsertlineHeights = _(doInsertlineHeights).bind(context);
}


// Export all hooks
exports.aceInitialized = aceInitialized;
exports.postAceInit = postAceInit;
exports.aceAttribsToClasses = aceAttribsToClasses;
