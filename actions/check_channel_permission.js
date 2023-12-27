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
    return `${presets.getConditionsText(data)}`;
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

  meta: { version: "2.1.7", preciseCheck: false, author: "kulkaGM", authorUrl: "https://github.com/kulkaGM", downloadUrl: "https://github.com/kulkaGM/DBM/blob/main/actions/check_channel_permission.js" },

  //---------------------------------------------------------------------
  // Action Fields
  //
  // These are the fields for the action. These fields are customized
  // by creating elements with corresponding IDs in the HTML. These
  // are also the names of the fields stored in the action's JSON data.
  //---------------------------------------------------------------------

  fields: ["sourceTarget", "channel", "varName2", "storage", "varName3", "flagName", "branch"],

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
<div style="height: 350px; overflow-y: scroll;">
  <tab-system exclusiveTabData retainElementIds spreadOut id="sourceTarget">
    <tab label="Member" icon="user circle" fields='["member", "memberVarName"]'>
        <member-input dropdownLabel="Source Member" selectId="member" variableContainerId="varNameContainerMember" variableInputId="memberVarName"></member-input>
    </tab>
    <tab label="Role" fields='["role", "roleVarName"]'>
        <role-input dropdownLabel="Source Role" selectId="role" variableContainerId="varNameContainerRole" variableInputId="roleVarName"></role-input>
    </tab>
  </tab-system>

  <br><br><br>
  <br><br><br>

  <voice-channel-input dropdownLabel="Source Channel" selectId="channel" variableContainerId="varNameContainer2" variableInputId="varName2"></voice-channel-input>
    
  <br><br><br>
  
  <hr class="subtlebar">

  <div style="width: calc(60% - 12px);">
    <span class="dbminputlabel">Permission Select</span><br>
    <select id="flagName" class="round" onchange="glob.onComparisonChanged(this)">
      <option value="CREATE_INSTANT_INVITE" title="CREATE_INSTANT_INVITE">Create invite</option>
      <option value=KICK_MEMBERS title="KICK_MEMBERS">Kick members</option>
      <option value=BAN_MEMBERS title="BAN_MEMBERS">Ban members</option>
      <option value=ADMINISTRATOR title="ADMINISTRATOR">Administrator</option>
      <option value=MANAGE_CHANNELS title="MANAGE_CHANNELS">Manage channels</option>
      <option value=MANAGE_GUILD title="MANAGE_GUILD">Manage server</option>
      <option value=ADD_REACTIONS title="ADD_REACTIONS">Add reactions</option>
      <option value=VIEW_AUDIT_LOG title="VIEW_AUDIT_LOG">View audit log</option>
      <option value=PRIORITY_SPEAKER title="PRIORITY_SPEAKER">Priority Speaker</option>
      <option value=STREAM title="STREAM">Video</option>
      <option value=VIEW_CHANNEL titleue="VIEW_CHANNEL" selected>View channels</option>
      <option value=SEND_MESSAGES title="SEND_MESSAGES">Send messages</option>
      <option value=SEND_TTS_MESSAGES title="SEND_TTS_MESSAGES">Send text-to-speech messages</option>
      <option value=MANAGE_MESSAGES title="MANAGE_MESSAGES">Manage messages</option>
      <option value=EMBED_LINKS title="EMBED_LINKS">Embed links</option>
      <option value=ATTACH_FILES title="ATTACH_FILES">Attach files</option>
      <option value=READ_MESSAGE_HISTORY title="READ_MESSAGE_HISTORY">Read message history</option>
      <option value=MENTION_EVERYONE title="MENTION_EVERYONE">Mention @everyone, @here and all roles</option>
      <option value=USE_EXTERNAL_EMOJIS title="USE_EXTERNAL_EMOJIS">Use external emojis</option>
      <option value=VIEW_GUILD_INSIGHTS title="VIEW_GUILD_INSIGHTS">View Server Insights</option>
      <option value=CONNECT title="CONNECT">Connect</option>
      <option value=SPEAK title="SPEAK">Speak</option>
      <option value=MUTE_MEMBERS title="MUTE_MEMBERS">Mute members</option>
      <option value=DEAFEN_MEMBERS title="DEAFEN_MEMBERS">Defean members</option>
      <option value=MOVE_MEMBERS title="MOVE_MEMBERS">Move members</option>
      <option value=USE_VAD title="USE_VAD">Use Voice Activity Detection</option>
      <option value=CHANGE_NICKNAME title="CHANGE_NICKNAME">Change nickname</option>
      <option value=MANAGE_NICKNAMES title="MANAGE_NICKNAMES">Manage nicknames</option>
      <option value=MANAGE_ROLES title="MANAGE_ROLES">Manage roles</option>
      <option value=MANAGE_WEBHOOKS title="MANAGE_WEBHOOKS">Manage webhooks</option>
      <option value=MANAGE_EMOJIS_AND_STICKERS title="MANAGE_EMOJIS_AND_STICKERS">Manage emojis and stickers</option>
      <option value=USE_APPLICATION_COMMANDS title="USE_APPLICATION_COMMANDS">Use Application Commands</option>
      <option value=REQUEST_TO_SPEAK title="REQUEST_TO_SPEAK">Request to speak</option>
      <option value=MANAGE_EVENTS title="MANAGE_EVENTS">Manage Events</option>
      <option value=MANAGE_THREADS title="MANAGE_THREADS">Manage threads</option>
      <option value=USE_PUBLIC_THREADS title="USE_PUBLIC_THREADS">Create public threads</option>
      <option value=CREATE_PUBLIC_THREADS title="CREATE_PUBLIC_THREADS">Create Public Threads</option>
      <option value=USE_PRIVATE_THREADS title="USE_PRIVATE_THREADS">Use Private threads</option>
      <option value=CREATE_PRIVATE_THREADS title="CREATE_PRIVATE_THREADS">Create Private Threads</option>
      <option value=USE_EXTERNAL_STICKERS title="USE_EXTERNAL_STICKERS">Use External Stickers</option>
      <option value=SEND_MESSAGES_IN_THREADS title="SEND_MESSAGES_IN_THREADS">Send messages in threads</option>
      <option value=START_EMBEDDED_ACTIVITIES title="START_EMBEDDED_ACTIVITIES">Start Embedded Activities</option>
      <option value=MODERATE_MEMBERS title="MODERATE_MEMBERS">Time out members</option>
      <option value=CUSTOM title="Seems like you know what you're doing">Flag from variable</option>
    </select>
  </div>

  <div id="get">
    <br>
    <retrieve-from-variable allowSlashParams dropdownLabel="Variable" selectId="storage" variableContainerId="varNameContainer3" variableInputId="varName3"></retrieve-from-variable>
    <br><br><br>
  </div>
  
  <br>

  <hr class="subtlebar">
  <br>
  <conditional-input id="branch"></conditional-input>
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

    glob.onComparisonChanged = function (event) {
      if (event.value === "CUSTOM") {
        document.getElementById("get").style.display = null;
      } else {
        document.getElementById("get").style.display = "none";
      }
    };

    glob.onComparisonChanged(document.getElementById("flagName"));
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
    const channel = await this.getVoiceChannelFromData(data.channel, data.varName2, cache);

    let sourceObj;
    if (data.sourceTarget._index === 0) {
      sourceObj = await this.getMemberFromData(data.sourceTarget.member, data.sourceTarget.memberVarName, cache);
    } else {
      sourceObj = await this.getRoleFromData(data.sourceTarget.role, data.sourceTarget.roleVarName, cache);
    }

    let flag;
    if (data.flagName === "CUSTOM") {
      const type = parseInt(data.storage, 10);
      const varName3 = this.evalMessage(data.varName3, cache);
      const variable = this.getVariable(type, varName3, cache);
      flag = variable;
    } else {
      flag = data.flagName;
    }

    let result;
    if (channel && sourceObj) {
      result = channel.permissionsFor(sourceObj)?.has(flag);
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
