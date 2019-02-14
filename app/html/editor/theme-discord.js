ace.define("ace/theme/discord",[], function(require, exports, module) {

exports.isDark = true;
exports.cssClass = "ace-discord";
exports.cssText = `.ace-discord .ace_gutter {
  background: #2F3136;
  color: rgb(89,99,102)
}

.ace-discord .ace_print-margin {
  visibility: hidden;
}

.ace-discord {
  background-color: #2F3136;
  color: #839496
}

.ace-discord .ace_cursor {
  color: #F8F8F0
}

.ace-discord .ace_regexp {
  color: #2AA198 !important
}

.ace-discord .ace_marker-layer .ace_selection {
  background: #49483E
}

.ace-discord.ace_multiselect .ace_selection.ace_start {
  box-shadow: 0 0 3px 0px #2F3136;
  border-radius: 2px
}

.ace-discord .ace_marker-layer .ace_step {
  background: rgb(198, 219, 174)
}

.ace-discord .ace_marker-layer .ace_bracket {
  margin: -1px 0 0 -1px;
  border: 1px solid #3B3A32
}

.ace-discord .ace_marker-layer .ace_active-line {
  background: #3E3D32
}

.ace-discord .ace_gutter-active-line {
  background-color: #3E3D32
}

.ace-discord .ace_marker-layer .ace_selected-word {
  border: 1px solid #49483E
}

.ace-discord .ace_fold {
  background-color: #268BD2;
  border-color: #839496
}

.ace-discord .ace_keyword {
  color: #859900
}

.ace-discord .ace_constant.ace_language {
  color: #2AA198
}

.ace-discord .ace_constant.ace_numeric {
  color: #2AA198
}

.ace-discord .ace_constant.ace_character {
  color: #2AA198
}

.ace-discord .ace_constant.ace_other {
  color: #2AA198
}

.ace-discord .ace_support.ace_function {
  color: #839496
}

.ace-discord .ace_support.ace_constant {
  color: #839496
}

.ace-discord .ace_support.ace_class {
  color: #DC322F
}

.ace-discord .ace_support.ace_type {
  color: #DC322F
}

.ace-discord .ace_storage {
  color: #859900
}

.ace-discord .ace_storage.ace_type {
  color: #859900
}

.ace-discord .ace_invalid {
  color: #FF0000;
  background-color: rgba(249, 38, 114, 0.0)
}

.ace-discord .ace_invalid.ace_deprecated {
  text-decoration: underline;
  color: #FF0000;
  background-color: rgba(174, 129, 255, 0.0)
}

.ace-discord .ace_string {
  color: #2AA198
}

.ace-discord .ace_comment {
  color: #586E75
}

.ace-discord .ace_variable {
  color: #859900
}

.ace-discord .ace_variable.ace_parameter {
  color: #839496
}

.ace-discord .ace_entity.ace_other.ace_attribute-name {
  color: #839496
}

.ace-discord .ace_entity.ace_name.ace_function {
  color: #268BD2
}

.ace-discord .ace_entity.ace_name.ace_tag {
  color: #839496
}`;

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);
});
                (function() {
                    ace.require(["ace/theme/discord"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            