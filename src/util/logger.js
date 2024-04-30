const chalk = require("chalk"),
  { DateTime } = require("luxon"),
  fs = require("node:fs"),
  path = require("node:path");

const LogState = {
  log: "LOG",
  info: "INFO",
  warn: "WARN",
  error: "ERROR",
};

class LogManager {
  currentTime() {
    return DateTime.now().toFormat("tt");
  }

  log(text, pre = undefined, writeFile = false, color) {
    const logString = [`[${this.currentTime()}]`];
    if (pre !== undefined)
      logString.push(
        Array.isArray(pre)
          ? pre.map((p) => `[${p.toUpperCase()}]`).join("")
          : `[${pre.toUpperCase()}]`
      );
    logString.push(text.toLowerCase());
    if (writeFile) {
      this.writeToLog(logString, pre || LogState.log);
    }

    if (color) {
      console.log(chalk[color](logString.join(" ")));
    } else {
      console.log(logString.join(" "));
    }

    return logString.join(" ");
  }

  info(text, pre = undefined, writeFile = false) {
    return this.log(text, pre || LogState.info, writeFile, "grey");
  }

  put(text, pre = undefined, writeFile = false) {
    return this.log(text, pre || LogState.log, writeFile, "green");
  }

  warn(text, pre = undefined, writeFile = false) {
    return this.log(text, pre || LogState.warn, writeFile, "yellow");
  }

  error(err, pre = undefined, writeFile = true) {
    return this.log(
      `${err.name}: ${err.message}\n`,
      pre || LogState.error,
      writeFile,
      "red"
    );
  }

  writeToLog(logString, pre) {
    const today = DateTime.now().toFormat("dd-MM-yy");
    const logDir = "logs";

    const projectRoot = path.resolve(__dirname, "../");
    if (!fs.existsSync(path.join(projectRoot, logDir))) {
      fs.mkdirSync(path.join(projectRoot, logDir));
    }

    const filePath = path.join(
      projectRoot,
      logDir,
      `${today} [${pre.toLowerCase()}].txt`
    );

    fs.writeFileSync(filePath, `${logString.join(" ")}\n`);
  }
}

module.exports = logger = new LogManager();
