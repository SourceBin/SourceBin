ace.define("ace/theme/material", [], function(require, exports, module) {

  exports.isDark = true;
  exports.cssClass = "ace-material";
  exports.cssText = ".ace-material .ace_gutter {\
background: #263238;\
color: #8F908A\
}\
.ace-material .ace_print-margin {\
width: 1px;\
background: #555651\
}\
.ace-material {\
background-color: #282a2e;\
color: #F8F8F2\
}\
.ace-material .ace_cursor {\
color: rgba(255,255,255, .9)\
}\
.ace-material .ace_marker-layer .ace_selection {\
background: rgba(100, 115, 120, 0.3)\
}\
.ace-material.ace_multiselect .ace_selection.ace_start {\
border: 1px solid rgba(255,255,255, .9);\
}\
.ace-material .ace_marker-layer .ace_step {\
background: rgb(102, 82, 0)\
}\
.ace-material .ace_marker-layer .ace_bracket {\
margin: -1px 0 0 -1px;\
border: 1px solid #49483E\
}\
.ace-material .ace_marker-layer .ace_active-line {\
background: #373b41\
}\
.ace-material .ace_gutter-active-line {\
background-color: #282a2e\
}\
.ace-material .ace_marker-layer .ace_selected-word {\
border: 1px solid #49483E\
}\
.ace-material .ace_invisible {\
color: #52524d\
}\
.ace-material .ace_entity.ace_name.ace_tag,\
.ace-material .ace_keyword,\
.ace-material .ace_meta.ace_tag,\
.ace-material .ace_storage {\
color: #F07178\
}\
.ace-material .ace_punctuation,\
.ace-material .ace_punctuation.ace_tag {\
color: #73d1c8\
}\
.ace-material .ace_constant.ace_character,\
.ace-material .ace_constant.ace_language,\
.ace-material .ace_constant.ace_numeric,\
.ace-material .ace_constant.ace_other {\
color: #FFCB6B\
}\
.ace-material .ace_invalid {\
color: #F8F8F0;\
background-color: #F92672\
}\
.ace-material .ace_invalid.ace_deprecated {\
color: #F8F8F0;\
background-color: #AE81FF\
}\
.ace-material .ace_support.ace_constant,\
.ace-material .ace_support.ace_function {\
color: #66D9EF\
}\
.ace-material .ace_fold {\
background-color: #A6E22E;\
border-color: #F8F8F2\
}\
.ace-material .ace_storage.ace_type,\
.ace-material .ace_support.ace_class,\
.ace-material .ace_support.ace_type {\
font-style: italic;\
color: #66D9EF\
}\
.ace-material .ace_entity.ace_name.ace_function,\
.ace-material .ace_entity.ace_other,\
.ace-material .ace_entity.ace_other.ace_attribute-name,\
.ace-material .ace_variable {\
color: #FFCB6B\
}\
.ace-material .ace_variable.ace_parameter {\
font-style: bold;\
color: #F78C6A\
}\
.ace-material .ace_string {\
color: #E6DB74\
}\
.ace-material .ace_comment {\
color: #75715E\
}\
.ace-material .ace_indent-guide {\
background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQImWPQ0FD0ZXBzd/wPAAjVAoxeSgNeAAAAAElFTkSuQmCC) right repeat-y\
}\
.ace-material .ace_keyword.ace_operator {\
color: #82AAFF !important\
}\
.ace-material .ace_variable.ace_language{\
color: #F07178 !important\
}\
.ace-material .ace_constant.ace_language {\
color: #F07178 !important\
}\
.ace-material .ace_entity.ace_name.ace_function {\
color: #89DDF3 !important\
}\
.ace-material .ace_paren {\
color: #73d1c8\
}\
.ace-material .ace_storage.ace_type {\
color: #C792EA !important\
}\
.ace-material .ace_identifier {\
color: rgba(255,255,255, .9)\
}";

  var dom = require("../lib/dom");
  dom.importCssString(exports.cssText, exports.cssClass);
});
(function() {
  ace.require(["ace/theme/material"], function(m) {
    if (typeof module == "object" && typeof exports == "object" && module) {
      module.exports = m;
    }
  });
})();
