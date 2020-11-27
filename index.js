const eejs = require('ep_etherpad-lite/node/eejs/');
const Changeset = require('ep_etherpad-lite/static/js/Changeset');
exports.eejsBlock_editbarMenuLeft = function (hook_name, args, cb) {
  args.content += eejs.require('ep_line_height/templates/editbarButtons.ejs');
  return cb();
};

exports.eejsBlock_dd_format = function (hook_name, args, cb) {
  args.content += eejs.require('ep_line_height/templates/fileMenu.ejs');
  return cb();
};


function getInlineStyle(height) {
  return `line-height: ${height};`;
}
// line, apool,attribLine,text
exports.getLineHTMLForExport = function (hook, context) {
  const header = _analyzeLine(context.attribLine, context.apool);
  if (header) {
    const inlineStyle = getInlineStyle(header);
    return `<span style="${inlineStyle}">${context.text.substring(1)}</span>`;
  }
};

function _analyzeLine(alineAttrs, apool) {
  let header = null;
  if (alineAttrs) {
    const opIter = Changeset.opIterator(alineAttrs);
    if (opIter.hasNext()) {
      const op = opIter.next();
      header = Changeset.opAttributeValue(op, 'heights', apool);
    }
  }
  return header;
}
