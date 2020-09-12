var eejs = require('ep_etherpad-lite/node/eejs/');
var Changeset = require("ep_etherpad-lite/static/js/Changeset");
exports.eejsBlock_editbarMenuLeft = function (hook_name, args, cb) {
  args.content = args.content + eejs.require("ep_line_height/templates/editbarButtons.ejs");
  return cb();
}

exports.eejsBlock_dd_format = function (hook_name, args, cb) {
  args.content = args.content + eejs.require("ep_line_height/templates/fileMenu.ejs");
  return cb();
}


function getInlineStyle(height) {
  return "line-height: "+height+";";
}
// line, apool,attribLine,text
exports.getLineHTMLForExport = function (hook, context) {
  var header = _analyzeLine(context.attribLine, context.apool);
  if (header) {
    var inlineStyle = getInlineStyle(header);
    if (context.lineContent[0] === '*') {
      context.lineContent = context.lineContent.substring(1);
    }
    context.lineContent = "<span style=\"" + inlineStyle + "\">" + context.lineContent + "</span>";
  }
  return true;
}

function _analyzeLine(alineAttrs, apool) {
  var header = null;
  if (alineAttrs) {
    var opIter = Changeset.opIterator(alineAttrs);
    if (opIter.hasNext()) {
      var op = opIter.next();
	
      header = Changeset.opAttributeValue(op, 'lineHeights', apool);
    }
  }
  return header;
}