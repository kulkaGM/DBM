const { resolve } = require('path');
const libPath = resolve(__dirname, './libs/permissions.json');
function getLib() {
  let lib;
  try {
    lib = require(libPath);
  } catch (e) {
    console.error(e);
  }
  return lib;
}

let run = false;
module.exports = {
  //---------------------------------------------------------------------
  // Action Name
  //
  // This is the name of the action displayed in the editor.
  //---------------------------------------------------------------------

  name: "Check Channel Permission",

  //---------------------------------------------------------------------
  // Action Section
  //
  // This is the section the action will fall into.
  //---------------------------------------------------------------------

  section: "Conditions",

  //---------------------------------------------------------------------
  // Action Subtitle
  //
  // This function generates the subtitle displayed next to the name.
  //---------------------------------------------------------------------

  subtitle(data, presets) {
    let text;
    if (data.comment) {
      text = data.comment;

      if (text.includes('{input}')) {
        const lib = getLib();
        const input = lib ? lib.flags[Object.keys(lib.flags).find(k => { return lib.flags[k].hexadecimal == data.value; })]?.name : undefined;
        text = text.replace('{input}', input || data.value);
      }

      if (text.includes('{conditionsText}')) {
        text = text.replace('{conditionsText}', `${presets.getConditionsText(data)}`);
      }

    } else {
      text = `${presets.getConditionsText(data)}`;
    }

    return data.color === "#ffffff" ? text : `<font color="${data.color}">${text}</font>`;
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
    downloadUrl: "https://github.com/kulkaGM/DBM/blob/main/actions/check_channel_permission.js",
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

  fields: ["comment", "color", "sourceTarget", "channel", "varName", "select", "value", "branch"],

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
  <div style="padding-top: 10px; padding-left: 10px; padding-right: 10px; max-height: calc(80vh - 60px); overflow-y: auto;" >
    <tab-system id="sourceTarget" spreadOut exclusiveTabData retainElementIds>
      <tab label="Member" icon="user circle" fields='["member", "memberVarName"]'>
          <member-input dropdownLabel="Source Member" selectId="member" variableContainerId="varNameContainerMember" variableInputId="memberVarName"></member-input>
      </tab>
      <tab label="Role" fields='["role", "roleVarName"]'>
          <role-input dropdownLabel="Source Role" selectId="role" variableContainerId="varNameContainerRole" variableInputId="roleVarName"></role-input>
      </tab>
    </tab-system>
    
    <br><br><br><br><br>
    
    <any-channel-input style="padding-top: 10px;" dropdownLabel="Source Channel" selectId="channel" variableContainerId="varNameContainer" variableInputId="varName"></any-channel-input>
    
    <br><br><br>
    
    <hr class="subtlebar">
    
    <div id="libState" style="display: none;">
      <span style="white-space: pre-line; display: block; padding: 5px 5px 5px 5px; background-color: var(--label-background-color); border: solid 1px var(--label-border); border-radius: 4px 4px 4px 4px; box-shadow: 3px 0px 2px var(--label-shadow-color);">Warning - Library required for Permission Select could not be loaded.<br><br>This library can be downloaded at https://github.com/kulkaGM/DBM/blob/main/actions/libs/permissions.json<br><br>Without this Library you can use only Custom Input which can be uncomfortable for new users</span><br>
    </div>
    
    <div style="width: calc(60% - 12px);">
      <span class="dbminputlabel">Permission Select <a href="https://discord.com/developers/docs/topics/permissions#implicit-permissions" target="_blank">Permissions Behaviour</a></span><br>
      <select id="select" class="round" onchange="glob.onChange(this)"></select>
    </div>
    
    <div id="inputDiv">
      <br>
      <span class="dbminputlabel" title="Use permission resolvable Hexadecimal value, Integer or Permission NAME">Input (Mouse hover) <a href="https://discord.com/developers/docs/topics/permissions#permissions-bitwise-permission-flags" target="_blank">Open Permission Flags</a></span><br>
      <input id="value" list="datalisted" class="round" type="text" title='Use permission resolvable Hexadecimal value, Integer or Permission NAME\nYou can use variable eg.. \${tempVars("myPerm")}' placeholder='You can use variable too.. eg.. \${tempVars("myPerm")}'></input>
      <datalist id="datalisted" class="round"></datalist>
    </div>
    <hr class="subtlebar">
    <conditional-input id="branch"></conditional-input>
    
    <br><br><br>
    
    <hr class="subtlebar">
    <div style="float: left; width: 82%; display: table-cell;">
      <span class="dbminputlabel">Subtitle</span>
      <input id="comment" class="round" type="text" placeholder="Use for comment // Hover for more info" title="{input} - to show your Input or Selected Permission\n{conditionsText} - to show subtitle from DBM with your text" value="Check '{input}' <div style='float: right;'>{conditionsText}</div>">
    </div>
    <div style="float: right; width: 15%; display: table-cell;">
      <span class="dbminputlabel">Color</span>
      <input id="color" class="round" type="color" value="#ffffff" title="To use a DBM theme color set all to 255">
    </div>
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
    // init() seems to be run twice when Action is being Edited (Issue is not present when Creating New Action), this seems to be DBM app issue
    if (!run) {
      run = true;
      const { glob, document } = this;

      const selectElement = document.getElementById("select");
      const dataListed = document.getElementById("datalisted");

      const option = document.createElement("option");
      option.text = "Advanced CUSTOM Input";
      option.title = "Permission_Flag, Integer or Hexadecimal";
      option.value = "CUSTOM";
      selectElement.appendChild(option);

      const lib = getLib();
      if (lib) {
        const { flags = {} } = lib;
        for (const key in flags) {
          const option = document.createElement("option");
          const optionList = document.createElement("option");
          try {
            const value = Number(flags[key].hexadecimal);
            if (!value) throw Error(`Unable to parse hexadecimal value of '${key}'!`);
            option.text = flags[key].name + `${flags[key].channels.length > 0 ? '' : ' (Server Permission)'}`;
            option.title = `${flags[key].channels.length > 0 ? `Can be used in (${flags[key].channels.join(', ')})` : 'This is server permission and should NOT be used for channel'}\n\n${flags[key].description}\n\n${key} (${flags[key].hexadecimal} / ${value})`;
            option.value = flags[key].hexadecimal;

            optionList.text = flags[key].name + ` [${key}] ` + `${flags[key].channels.join(', ') ? '' : ' (Server Permission)'}`;
            optionList.value = flags[key].hexadecimal;
          } catch (e) {
            console.error(e);
            option.text = "Error";
            option.title = e.message;
            option.value = "Error";
          }
          selectElement.appendChild(option);
          dataListed.appendChild(optionList);
        }
        selectElement.value = lib?.flags?.["VIEW_CHANNEL"]?.hexadecimal;
      } else {
        document.getElementById("libState").style.display = null;
        (async () => { const select = await document.getElementById("select"); select.value = "CUSTOM"; })();
      }

      glob.onChange = function (event) {
        if (!event.value || event.value === "CUSTOM") {
          document.getElementById("inputDiv").style.display = null;
        } else {
          document.getElementById("value").value = event.value;
          document.getElementById("inputDiv").style.display = "none";
        }
      };

      // await: element "select" is being undefined meaning init() is executed before the HTML is finished loading?
      (async () => { glob.onChange(await document.getElementById("select")); })();
    }
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
    const channel = await this.getChannelFromData(data.channel, data.varName, cache);

    let sourceObj;
    if (data.sourceTarget._index === 0) {
      sourceObj = await this.getMemberFromData(data.sourceTarget.member, data.sourceTarget.memberVarName, cache);
    } else {
      sourceObj = await this.getRoleFromData(data.sourceTarget.role, data.sourceTarget.roleVarName, cache);
    }

    const value = this.evalMessage(data.value, cache);
    let result;
    if (channel && sourceObj) {
      result = channel.permissionsFor(sourceObj)?.has(value);
    }

    this.executeResults(result, data?.branch ?? data, cache);
  },

  //---------------------------------------------------------------------
  // Action Bot Mod Init
  //
  // An optional function for action mods. Upon the bot's initialization,
  // each command/event's actions are iterated through. This is to
  // initialize responses to interactions created within actions
  // (e.g. buttons and select menus for Send Message).
  //
  // If an action provides inputs for more actions within, be sure
  // to call the `this.prepareActions` function to ensure all actions are
  // recursively iterated through.
  //---------------------------------------------------------------------

  modInit(data) {
    this.prepareActions(data.branch?.iftrueActions);
    this.prepareActions(data.branch?.iffalseActions);
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
