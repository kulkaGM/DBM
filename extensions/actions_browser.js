module.exports = {
  name: "Actions Browser",
  saveButtonText: "Close",
  isCommandExtension: false,
  isEventExtension: false,
  isEditorExtension: true,
  fields: [],
  size() {
    return {
      width: 780,
      height: 770
    };
  },
  html(data) {
    // Bad decisions about how html is done are questionable since it is bad practice "not to do it how html should be"
    // Some parts of html do not need to be dynamic, but it reduces file size and your time writing/editing html
    return `
      <div style="padding: 10px 10px 10px 10px; height: calc(95vh - 60px); overflow-y: auto;" >
        <span class="dbminputlabel" title="">Action Search</span><br>
        <input id="input" list="search" class="round" type="text" placeholder="Search action by Name, Author, Section or File name"></input>
        <datalist id="search" class="round"></datalist>
        <br>
        <tab-system spreadOut>
          <tab label="Summary" icon="">
            <div id="info" style="padding: 10px; white-space: break-spaces;">
              <span style="white-space: break-spaces; display: block; padding: 10px; border: 2px solid #ccc; border-radius: 5px; overflow: auto;">Seems like summary could not be loaded..</span>
            </div>
          </tab>
          <tab label="Action Raw" icon="">
            <div id="infoRaw" style="white-space: pre; display: block; padding: 10px; overflow: auto;">
            </div>
          </tab>
          <tab label="for Developers" icon="">
            <div id="devInfo" style="white-space: pre; display: block; padding: 10px; overflow: auto;">
              Seems like this part was not loaded.. well thats bad
            </div>
          </tab>
          <tab label="Test" icon="">
            <div style="padding: 5px;">
              <p>This is <s>test</s> fun zone and you will need to know JavaScript to use it.. so If you do, have fun.</p>
              <textarea id="code" rows="18" name="is-eval" style="resize: vertical; max-width: 100%; white-space: nowrap;">const action = actions[Math.floor(Math.random() * actions.length)]\nreturn JSON.stringify(action, null, 2);</textarea>
              <br>
              <button class="tiny ui labeled icon button" onclick="const code = document.getElementById('code').value;let res;try {  let run;  const actions = JSON.parse(document.getElementById('code').dataset.actions);  eval('run = () => {' + code + '}');  res = run();} catch (e) {  res = e; };document.getElementById('output').innerHTML = res;"><i id="savebuttonicon" class="check icon"></i><span>Run</span></button>
              <br>
              <br>
              <div>
                <span id="output" style="white-space: pre; display: block; padding: 10px; border: 2px solid #ccc; border-radius: 5px; overflow: auto;">Press button above</span>
              </div>
            </div>
          </tab>
        </tab-system>
      </div>`;
  },
  init(document, global) {
    const startLoad = performance.now();
    const font = (color, text) => `<font color="${color}">${text}</font>`;
    const textBlock = (text) => `<p style="white-space: pre; overflow: auto; display: block; padding: 5px; background-color: var(--label-background-color); border: solid 1px var(--label-border); border-radius: 4px; box-shadow: 3px 0px 2px var(--label-shadow-color);">${text}</p>`;
    const whiteBlock = (text) => `<p style="white-space: break-spaces; display: block; padding: 10px; border: 2px solid #ccc; border-radius: 5px; overflow: auto;">${text}</p>`;
    const displayFile = (filename, text = filename, title = "", color = "#76A9FF") => `<span style="color: ${color}; cursor: pointer;" title="${title}" onclick="document.getElementById('input').value='${filename}';document.getElementById('input').oninput()">${text}</span>`;
    const toHref = (url, text) => `<a draggable="false" href="#" onclick="globalOpenLink('${url}')" title="Opens ${url}\nin your browser">${text}</a>`;
    const resolveHref = (obj) => typeof obj == "object" ? obj.url ? toHref(obj.url, obj.name) : obj.name : obj;

    const { resolve, join } = require('path');
    const { readdirSync, lstatSync, readFileSync } = require("fs");
    const actionsPath = resolve(__dirname, '../actions');

    const actions = [];
    readdirSync(actionsPath).forEach(e => {
      const actionPath = join(actionsPath, e);
      if (lstatSync(actionPath).isFile() && actionPath.endsWith('.js')) {
        try {
          const mod = require(actionPath);
          actions.push({ filename: actionPath.split('\\').pop() || actionPath.split('/').pop(), filepath: actionPath, module: mod });
        } catch (e) {
          console.error(e);
        }
      }
    });

    function getActionOverwrites(actions, action) {
      if (typeof action == "string") action = actions.find(a => a.module.name == action);
      const overwrites = [];
      actions.forEach(a => {
        if (action.filename != a.filename && action.module.name == a.module.name) overwrites.push(a);
      });
      return overwrites;
    }

    function getActionsOverwrites(actions) {
      const checked = [];
      const overwrites = {};

      actions.forEach(a => {
        if (!checked.includes(a.filename)) {
          checked.push(a.filename);
          const actionOverwites = getActionOverwrites(actions, a);
          if (actionOverwites.length > 0) {
            checked.push(...actionOverwites.map(b => b.filename));
            overwrites[a.filename] = actionOverwites;
          }
        }
      });
      return overwrites;
    }

    const areOb = actions.filter(a => !(a.module.name && a.module.section && a.module.meta && a.module.meta.version));

    function displaySummary() {
      document.querySelector('[tabindex="0"]').innerHTML = "Summary";
      if (actions.length == 0) return font("red", "You have no Actions in your project!");
      let str = '';
      str += whiteBlock(`You have ${actions.length} Actions in your project`);
      if (areOb.length > 0) str += '\n' + whiteBlock(`${areOb.length} Actions are considered as outdated because some <span style="color: yellow;" title="One of the properties was not found:\nname\nsection\nmeta\nmeta.version">properties (?)</span> are missing\n${areOb.map(a => `${displayFile(a.filename, a.module.name, `Display ${a.filename}`)} ${a.filename}`).join('\n')}`);
      const actionsOverwites = getActionsOverwrites(actions);
      if (Object.keys(actionsOverwites).length > 0) str += '\n' + whiteBlock(`${Object.keys(actionsOverwites).length} Actions are overwritten by other actions..\n${Object.entries(actionsOverwites).map(a => `${displayFile(a[0], `${a[0]} ${font("white", "(" + a[1][0].module.name + ")")}`, `Display ${a[0]}`)}\n\t${a[1].map(a => displayFile(a.filename, undefined, `Display ${a.filename}`, 'cyan')).join('\n\t')}`).join(" (used)\n\n")}  (used)`);
      document.getElementById("info").innerHTML = str;
    }

    displaySummary();

    function resolveDBMVersion() {
      try {
        return readFileSync(resolve(__dirname, '../bot.js'), "utf-8").split('\n').find(v => v.startsWith('DBM.version')).match(/"([^"]*)"/)[1] ?? false;
      } catch (e) {
        console.log(e);
        return false;
      }
    }
    const dbmVersion = resolveDBMVersion();


    // I considered showing the DBM Author for Actions that do not have meta.author set, however that could result in misunderstanding.
    // I will not show possible false information when the Action Mod does not have the meta properties set correctly. Which should be already done earlier for built-in Actions
    // Some creators are including 'MOD' in the action filename for identification, this Extension does not count with that.
    // const dbmAuthor = require(resolve(__dirname, '../package.json')).author;

    const toLines = (...a) => a.join('\n');
    const devInfo = toLines(
      `This Extension uses same Action properties as DBM ${font("orange", "[ 'name', 'displayName'?, 'section', 'meta'  ]")}`,
      `Additionally uses meta properties ${font("orange", "[ 'maintainer', 'repository', 'contributors' ]")} which are intended for this Extension`,
      ``,
      `${font("yellow", "Note:")} the | character means OR, meaning to identify (separate) options that can be used`,
      ``,
      `${font("orange", "maintainer")}  - String | Object with name and url property`,
      textBlock('maintainer: { name: "kulkaGM", url: "https://github.com/kulkaGM"}'),
      `${font("orange", "repository")}  - String | Object with name and url property`,
      textBlock('repository: { name: "kulkaGM/DBM", url: "https://github.com/kulkaGM/DBM"}'),
      `${font("orange", "contributors")} - Array of strings | Array of Objects | Array of Strings & Objects`,
      textBlock('contributors: [ { name: "kulkaGM", url: "https://github.com/kulkaGM" }, "Other Contributor" ]'),
      `Example meta property`,
      whiteBlock(toLines(
        `meta: {`,
        `  version: "${dbmVersion || "1.0.0"}",${dbmVersion ? "" : font("green", "  // Unable to resolve DBM version displaying 1.0.0, Version can be found in About")}`,
        `  preciseCheck: false,`,
        `  author: "kulkaGM",`,
        `  authorUrl: "https://github.com/kulkaGM",`,
        `  downloadUrl: "https://github.com/kulkaGM/DBM/blob/main/actions/run_code.js",`,
        `  maintainer: { name: "kulkaGM", url: "https://github.com/kulkaGM " },`,
        `  repository: { name: "kulkaGM/DBM", url: "https://github.com/kulkaGM/DBM" },`,
        `  contributors: [{ name: "kulkaGM", url: "https://github.com/kulkaGM" }, "Other Contributor"]`,
        `}`
      ))
    );
    document.getElementById("devInfo").innerHTML = devInfo;


    const search = document.getElementById("search");

    actions.forEach(a => {
      const { filepath, module: { name = "Unspecified", displayName = "", section = "Unspecified", meta = {} } } = a;

      const option = document.createElement("option");
      try {
        option.text = `${name} ${displayName ? ` (${displayName}) ` : ""}| Author: ${meta.author || "Unspecified" /* dbmAuthor */} | Section: ${section}`;
        option.value = filepath.split('\\').pop() || filepath.split('/').pop();
      } catch (e) {
        console.error(filepath, e);
      }
      search.appendChild(option);
    });

    const input = document.getElementById("input");
    input.oninput = (event) => {
      if (input.value == "") {
        document.getElementById("infoRaw").innerHTML = "";
        displaySummary();
        return;
      }

      try {
        const actionPath = join(actionsPath, input.value);
        const mod = actions.find(v => v.filepath === actionPath);
        if (!mod) return;
        document.querySelector('[tabindex="0"]').innerHTML = "Action Info";
        const { name = "", displayName = name, section = "", meta: meta = {} } = mod.module;

        function showContributors(a) {
          return a.map(c => {
            if (typeof c === "object") {
              return resolveHref(c);
            } else {
              return c;
            }
          }).join(', ');
        }

        const contributors = Array.isArray(meta.contributors) ? meta.contributors : [];

        let info = '';
        info += `Name: ${name}\n`;
        info += `Displayed as: ${displayName === name ? displayName : font("yellow", displayName)}\n`;
        info += `Section: ${section}\n`;
        info += "Author: " + (meta.authorUrl ? toHref(meta.authorUrl, meta.author) : meta.author || "Unspecified" /* dbmAuthor */) + '\n';
        info += "Download Link: " + (meta.downloadUrl ? toHref(meta.downloadUrl, meta.downloadUrl) : "Unspecified") + '\n';
        info += `Version: ${meta.version || "Unspecified"} ${dbmVersion ? meta.version && meta.version === dbmVersion ? font("green", "Updated") : font("orange", "Outdated") : font("red", "Unable to check updated status DBM Version not found")}\n`;
        info += '\n';
        info += "Maintainer: " + (meta.maintainer ? resolveHref(meta.maintainer) : "Unspecified") + '\n';
        info += "Repository: " + (meta.repository ? resolveHref(meta.repository) : "Unspecified") + '\n';
        info += "Contributors: " + (contributors.length > 0 ? showContributors(contributors) : "None");
        info += '\n';

        let replacedBy;
        for (const thismod of actions) {
          if (name === thismod.module.name) {
            replacedBy = thismod;
          }
        }
        if (replacedBy && replacedBy.filepath !== actionPath) {
          info += `\n${font("red", "This action is not used!")}\n${font("orange", `Action is replaced`)} by ${displayFile(replacedBy.filename, `${replacedBy.module.name}${replacedBy.module.displayName ? ' (' + replacedBy.module.displayName + ')' : ""}`, `Display ${replacedBy.filename}`)} located at\n${replacedBy.filepath}`;
        }

        document.getElementById("info").innerHTML = whiteBlock(info);


        let innRaw = 'Displays raw module properties of the action file converted to string. Does not display contents of file!\n';
        innRaw += textBlock(JSON.stringify(mod.module, null, 4).replace(/</g, "&lt;").replace(/>/g, "&gt;"));
        document.getElementById("infoRaw").innerHTML = innRaw;
      } catch (e) {
        const msg = `Displaying information about the Action failed..\n\nError\n${textBlock(e.message)}`;
        document.getElementById("info").innerHTML = whiteBlock(msg);
        document.getElementById("infoRaw").innerHTML = whiteBlock(msg);
      }
    };


    document.getElementById("code").dataset.actions = JSON.stringify(actions);

    const endLoad = performance.now();
    console.log(endLoad - startLoad);
  },
  close(document, data, global) { },
  mod(DBM) { }
};