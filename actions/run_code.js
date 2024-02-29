const codeInitDefault = `const DBM = this.getDBM();
const tempVars = this.getActionVariable.bind(cache.temp);
let serverVars = null;
if (cache.server) {
  serverVars = this.getActionVariable.bind(this.server[cache.server.id]);
}
const globalVars = this.getActionVariable.bind(this.global);
const slashParams = this.getSlashParameter.bind(this, cache.interaction);
const customEmoji = this.getCustomEmoji.bind(this);
const msg = cache.msg;
const interaction = cache.interaction;
const button = interaction?._button ?? "";
const select = interaction?._select ?? "";
const server = cache.server;
const client = DBM.Bot.bot;
const bot = DBM.Bot.bot;
const me = server?.me ?? null;
let user = "",
  member = "",
  channel = "",
  mentionedUser = "",
  mentionedChannel = "",
  defaultChannel = "";
if (msg) {
  user = msg.author;
  member = msg.member;
  channel = msg.channel;
  mentionedUser = msg.mentions.users.first() ?? "";
  mentionedChannel = msg.mentions.channels.first() ?? "";
}
if (interaction) {
  user = interaction.user;
  member = interaction.member;
  channel = interaction.channel;
  if (interaction.options) {
    mentionedUser = interaction.options.resolved?.users?.first?.() ?? "";
    mentionedChannel = interaction.options.resolved?.channels?.first?.() ?? "";
  }
}
if (server) {
  defaultChannel = server.getDefaultChannel();
}`;
const explainCodeInit = "You should leave this empty.\nThis is used for declaration of default DBM variables (Managed by This Action if no code is here).\nIf you know what you're doing you can Load Defaults and edit it to your liking.";

module.exports = {
  //---------------------------------------------------------------------
  // Action Name
  //
  // This is the name of the action displayed in the editor.
  //---------------------------------------------------------------------

  name: "Run Code",

  //---------------------------------------------------------------------
  // Action Section
  //
  // This is the section the action will fall into.
  //---------------------------------------------------------------------

  section: "Other Stuff",

  //---------------------------------------------------------------------
  // Action Subtitle
  //
  // This function generates the subtitle displayed next to the name.
  //---------------------------------------------------------------------

  subtitle(data, presets) {
    const code = data.code;
    const codeLines = code.split('\n');
    let returns;
    if (code.includes('return')) {
      returns = codeLines.filter(v => { v = v.trim(); return v.startsWith('return '); }).length;
    } else {
      returns = false;
    };

    const isCodeInit = data.codeInit ? " - (CustomInit)" : "";
    const lines = codeLines.length;
    const linesOfCode = codeLines.filter(e => { return e.trim().length > 0; }).length;
    let text;
    let color = data.color;
    if (returns) {
      if (data.storage > 0 && data.varName) {
        text = data.comment ? data.comment : `{chars} characters | {linesOfCode}/{lines} lines | {returns} ${returns === 1 ? "return" : "returns"} | Stored in {storedin}${isCodeInit}` + "<div style='float: right;'>{type}</div>";
      } else {
        text = 'Warning: You are returning a value but not storing it!';
        color = "#ff0000";
      }
    } else {
      if (data.storage === "0") {
        text = data.comment ? data.comment : "{chars} characters | {linesOfCode}/{lines} lines | no returns " + isCodeInit + "<div style='float: right;'>{type}</div>";
      } else {
        text = 'Warning: You are storing a value without return statement!';
        color = "#ff0000";
      }
    }
    if (text.includes('{') && text.includes('}')) text = text.replace(/{chars}/g, code.length).replace(/{lines}/g, lines).replace(/{returns}/g, returns).replace(/{varName}/g, data.varName).replace(/{storedin}/g, presets.getVariableText(data.storage, data.varName)).replace(/{linesOfCode}/g, linesOfCode).replace(/{type}/g, data.isAsync == "true" ? "async" : "sync");
    return text.startsWith('Warning') ? `<font color="${color}">${text}</font>` : data.color == "#ffffff" ? text : `<font color="${color}">${text}</font>`;
  },

  //---------------------------------------------------------------------
  // Action Storage Function
  //
  // Stores the relevant variable info for the editor.
  //---------------------------------------------------------------------

  variableStorage(data, varType) {
    const type = parseInt(data.storage, 10);
    if (type !== varType) return;
    return [data.varName, "Run Code Output"];
  },

  //---------------------------------------------------------------------
  // Action Meta Data
  //
  // Helps check for updates and provides info if a custom mod.
  // If this is a third-party mod, please set "author" and "authorUrl".
  //
  // It's highly recommended "preciseCheck" is set to false for third-party mods.
  // This will make it so the patch version (0.0.X) is not checked.
  //---------------------------------------------------------------------

  meta: {
    version: "2.1.7",
    preciseCheck: false,
    author: "kulkaGM",
    authorUrl: "https://github.com/kulkaGM",
    downloadUrl: "https://github.com/kulkaGM/DBM/blob/main/actions/run_code.js",
    maintainer: { name: "kulkaGM", url: "https://github.com/kulkaGM " },
    repository: { name: "kulkaGM/DBM", url: "https://github.com/kulkaGM/DBM" }
  },

  //---------------------------------------------------------------------
  // Action Fields
  //
  // These are the fields for the action. These fields are customized
  // by creating elements with corresponding IDs in the HTML. These
  // are also the names of the fields stored in the action's JSON data.
  //---------------------------------------------------------------------

  fields: ["isAsync", "code", "storage", "varName", "comment", "color", "codeInit"],

  //---------------------------------------------------------------------
  // Dialog Size
  //
  // Returns the size of the action dialog.
  // Default Action window size is { width: 560, height: 540 };
  //---------------------------------------------------------------------

  size() {
    return {
      width: 850,
      height: 680
    };
  },

  //---------------------------------------------------------------------
  // Command HTML
  //
  // This function returns a string containing the HTML used for
  // editing actions.
  //
  // The "isEvent" parameter will be true if this action is being used
  // for an event. Due to their nature, events lack certain information,
  // so edit the HTML to reflect this.
  //---------------------------------------------------------------------

  html(isEvent, data) {
    return `
      <style>
        .switch {
          position: relative;
          display: inline-block;
          width: 40px;
          height: 24px;
        }
      
        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }
      
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          -webkit-transition: .4s;
          transition: .4s;
          border-radius: 24px;
        }
      
        .slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          -webkit-transition: .4s;
          transition: .4s;
          border-radius: 50%;
        }
      
        input:checked + .slider {
          background-color: #2196F3;
        }
      
        input:focus + .slider {
          box-shadow: 0 0 1px #2196F3;
        }
      
        input:checked + .slider:before {
          -webkit-transform: translateX(16px);
          -ms-transform: translateX(16px);
          transform: translateX(16px);
        }
      </style>

      <div style="padding-right: 10px; height: calc(80vh - 60px); overflow-y: auto;">
        <div style="padding: 5px 10px 0px 10px; float: right;">
          <span style="padding: 5px 5px 5px 5px; background-color: var(--label-background-color); border: solid 1px var(--label-border); border-radius: 4px 4px 4px 4px; box-shadow: 3px 0px 2px var(--label-shadow-color);" title="Run your Code as Asynchronous function? (Does not apply to functions inside your Code)\n\nThis Action is run as Asynchronous\nNext Action is called automatically when your code returns">Asynchronous?</span>
            <label class="switch">
              <input id="isAsync" type="checkbox" value="false" onclick="value = checked;">
              <span class="slider"></span>
            </label>
        </div>
        <tab-system>
          <tab label="Run Code" icon="align left">
            <div style="padding: 10px 10px 20px 10px; width: %; overflow-x: auto;">
              <div>
                <span class="dbminputlabel">JavaScript Code</span><br>
                <textarea id="code" rows="18" name="is-eval" style="resize: vertical; max-width: 100%; white-space: nowrap;" onmouseup="glob.mouseUp(event, 'code', 'codeStatus')" onmousedown="glob.mouseDown(event, 'code', 'codeStatus')" onmousemove="glob.mouseMove(event, 'code', 'codeStatus')" onkeydown="glob.textUpdated(event, 'code', 'codeStatus')" onmouseout="glob.updateCodeStatusToDefault(event, 'code', 'codeStatus')">const example = "Ohh you a JavaScripter? GOOD, code here like if you were in a function code block";\n\nif (example.length < 50) {\n  return "string is NOT longer than 50 characters";\n} else {\n  return \`string is longer than 50 characters, actually its exactly \${example.length} characters long, what a great number!\`;\n}</textarea>
                <span id="codeStatus" style="float: right; margin-left: 6px; margin-top: 0; padding: 2px 4px 1px 4px; background-color: var(--label-background-color); border: solid 1px var(--label-border); border-bottom-left-radius: 4px; border-bottom-right-radius: 4px; box-shadow: 3px 0px 2px var(--label-shadow-color);"></span>
              </div>
              <div style="padding-top: 25px;">
                <store-in-variable allowNone selectId="storage" variableInputId="varName" variableContainerId="varNameContainer"></store-in-variable>
              </div>
              <br><br><br>
              <hr class="subtlebar">
              <div style="float: left; width: 82%; display: table-cell;">
                <span class="dbminputlabel">Subtitle</span>
                <input id="comment" class="round" type="text" placeholder="Leave blank to disable.. // Hover for more info" title="{type} - async or sync?\n{chars} - Characters count\n{lines} - Lines count\n{linesOfCode} - Lines count (ignoring empty)\n{returns} - Return statements count\n{varName} - Variable Name only\n{storedin} - DBM VariableText">
              </div>
              <div style="float: right; width: 15%; display: table-cell;">
                <span class="dbminputlabel">Color</span>
                <input id="color" class="round" type="color" value="#ffffff" title="To use a DBM theme color set all to 255">
              </div>
            </div>
          </tab>
          <tab label="Initialization" icon="settings">
            <div style="padding: 10px 10px 20px 10px; width: %; overflow-x: auto;">
              <span style="display: block; padding: 5px 5px 5px 5px; background-color: var(--label-background-color); border: solid 1px var(--label-border); border-radius: 4px 4px 4px 4px; box-shadow: 3px 0px 2px var(--label-shadow-color);">${explainCodeInit.replace(/\n/g, '<br>')}</span><br>
              <div>
                <span class="dbminputlabel" placeholder="This Code is run before your code for declaration of DBM variables">Variables Init</span><br>
                <textarea id="codeInit" rows="8" name="is-eval" style="resize: vertical; max-width: 100%; white-space: nowrap;" onmouseup="glob.mouseUp(event, 'codeInit', 'codeInitStatus')" onmousedown="glob.mouseDown(event, 'codeInit', 'codeInitStatus')" onmousemove="glob.mouseMove(event, 'codeInit', 'codeInitStatus')" onkeydown="glob.textUpdated(event, 'codeInit', 'codeInitStatus')" onmouseout="glob.updateCodeStatusToDefault(event, 'codeInit', 'codeInitStatus')"></textarea>
                <span id="codeInitStatus" style="float: right; margin-left: 6px; margin-top: 0; padding: 2px 4px 1px 4px; background-color: var(--label-background-color); border: solid 1px var(--label-border); border-bottom-left-radius: 4px; border-bottom-right-radius: 4px; box-shadow: 3px 0px 2px var(--label-shadow-color);"></span>
              </div><br>
              <div style="margin-bottom: -18px;">
                <button class="tiny ui labeled icon button" onclick="glob.codeInitDefault()">
                    <i class="plus icon"></i>
                    <span>Load Defaults</span>
                </button>
              <div>
            </div>
          </tab>
        </tab-system>
      </div>`;
  },

  //---------------------------------------------------------------------
  // Action Editor Init Code
  //
  // When the HTML is first applied to the action editor, this code
  // is also run. This helps add modifications or setup reactionary
  // functions for the DOM elements.
  //---------------------------------------------------------------------

  init() {
    const { glob, document } = this;

    const isAsync = document.getElementById('isAsync');
    if (isAsync.value == "true") isAsync.checked = true;

    glob.updateCodeStatusToDefault = (event, textareaId, statusId) => {
      const codeStatus = document.getElementById(statusId);
      const textarea = document.getElementById(textareaId);

      const content = textarea.value;
      const lines = content.split('\n');

      codeStatus.innerHTML = `Characters: ${content.length || 0} | Lines: ${lines.length || 0}`;
    };
    glob.updateCodeStatusToDefault(undefined, "code", "codeStatus");
    glob.updateCodeStatusToDefault(undefined, "codeInit", "codeInitStatus");

    glob.textUpdated = (event, textareaId, statusId) => {
      // Used for modifying input eg.. for Tab to input \t or Enter to fill spaces automatically
      // Im not sure if this should be a feature yet, if so Option to Disable or customize would be added.
      //
      // switch (event.key) {
      //   case "Tab": {
      //     event.preventDefault();
      //     const textarea = document.getElementById(textareaId);
      //     const start = textarea.selectionStart;
      //     const end = textarea.selectionEnd;
      //     const tab = '\t';
      //     textarea.value = textarea.value.substring(0, start) + tab + textarea.value.substring(end);
      //     textarea.setSelectionRange(start + 1, start + 1);
      //   }
      //     break;
      //   case "Enter": {
      //     event.preventDefault();
      //     const textarea = document.getElementById(textareaId);
      //     const start = textarea.selectionStart;
      //     const end = textarea.selectionEnd;
      //     const line = textarea.value.substr(0, start).split('\n').length;
      //     const tab = '\n';
      //     textarea.value = textarea.value.substring(0, start) + tab + textarea.value.substring(end);
      //     textarea.setSelectionRange(start + 1, start + 1);
      //   }
      //     break;
      // 
      //   default:
      //     break;
      // }
      glob.updateCodeStatus(event, textareaId, statusId);
    };

    let isMouseDown;
    glob.mouseUp = (event, textareaId, statusId) => {
      isMouseDown = false;
      if (event.button === 0) glob.updateCodeStatus(event, textareaId, statusId);
    };

    glob.mouseDown = (event, textareaId, statusId) => {
      if (event.button !== 0) return;
      isMouseDown = true;
    };

    let canRun = true;
    glob.mouseMove = (event, textareaId, statusId) => {
      if (!canRun) return;
      canRun = false;
      if (isMouseDown) glob.updateCodeStatus(event, textareaId, statusId);
      setTimeout(() => { canRun = true; }, 50);
    };

    glob.updateCodeStatus = (event, textareaId, statusId) => {
      setTimeout(() => {
        const codeStatus = document.getElementById(statusId);
        const textarea = document.getElementById(textareaId);
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const line = textarea.value.substr(0, start).split('\n');
        const lineNum = line.length;

        const selection = textarea.value.slice(start, end);

        const lineStartsAt = textarea.value.lastIndexOf('\n', start - 1) + 1;
        const col = start - lineStartsAt;

        codeStatus.innerHTML = selection.length > 0 ? `Selected: ${selection.length} | ${selection.length > 0 ? selection.split(' ').filter(e => { return e.length > 0 && e != '"' && e != "'" && e != '`'; }).length : 0} Words | Line: ${lineNum}` : `Col: ${col == -1 ? 0 : col} | Char: ${start} | Line: ${lineNum}`;
      }, 50);
    };

    glob.codeInitDefault = () => {
      document.getElementById('codeInit').value = codeInitDefault;
      glob.updateCodeStatusToDefault(undefined, "codeInit", "codeInitStatus");
    };
  },

  //---------------------------------------------------------------------
  // Action Editor On Save
  //
  // When the data for the action is saved, this function is called.
  // It provides the ability to modify the final data associated with
  // the action by retrieving it as an argument and returning a modified
  // version through the return value. This can be used to verify the
  // data and fill required entries the user did not.
  //
  // Its inclusion within action mods is optional.
  //---------------------------------------------------------------------

  onSave(data, helpers) {
    // Prevent users saving codeInit Default Value...
    if (data.codeInit == codeInitDefault) data.codeInit = "";
    return data;
  },

  //---------------------------------------------------------------------
  // Action Bot Function
  //
  // This is the function for the action within the Bot's Action class.
  // Keep in mind event calls won't have access to the "msg" parameter,
  // so be sure to provide checks for variable existence.
  //---------------------------------------------------------------------

  async action(cache) {
    const data = cache.actions[cache.index];
    const code = data.code;
    const codeInit = data.codeInit == "" ? codeInitDefault : data.codeInit;
    const isAsync = data.isAsync == "true" ? true : false;

    const run = eval(`${isAsync ? "async " : ""}() => {${codeInit + '\n' + code}}`);
    const result = await run();

    const varName = this.evalMessage(data.varName, cache);
    const storage = parseInt(data.storage, 10);
    this.storeValue(result, storage, varName, cache);

    this.callNextAction(cache);
  },

  //---------------------------------------------------------------------
  // Action Bot Mod
  //
  // Upon initialization of the bot, this code is run. Using the bot's
  // DBM namespace, one can add/modify existing functions if necessary.
  // In order to reduce conflicts between mods, be sure to alias
  // functions you wish to overwrite.
  //---------------------------------------------------------------------

  mod() { },
};
