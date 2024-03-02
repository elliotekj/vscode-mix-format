const vscode = require("vscode");
const os = require("os");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const cp = require("child_process");

function activate(context) {
  const providerSupport = ["elixir", "phoenix-heex", "html-eex"];

  const provider = vscode.languages.registerDocumentFormattingEditProvider(
    providerSupport,
    { provideDocumentFormattingEdits: formatProvider }
  );

  context.subscriptions.push(provider);
}

function formatProvider(document) {
  const progressOpts = {
    location: vscode.ProgressLocation.Notification,
    title: "Running mix format",
  };

  return vscode.window.withProgress(progressOpts, () => {
    return new Promise((resolve, reject) => {
      format(document)
        .then((text) => {
          const lastLine = document.lineAt(document.lineCount - 1);
          const fullRange = new vscode.Range(
            new vscode.Position(0, 0),
            lastLine.range.end
          );

          resolve([new vscode.TextEdit(fullRange, text)]);
        })
        .catch((err) => {
          if (err instanceof Error) {
            vscode.window.showErrorMessage(`mix format failed: ${err.message}`);
          } else {
            vscode.window.showErrorMessage("mix format failed");
          }

          reject();
        });
    });
  });
}

function format(document) {
  return new Promise((resolve, reject) => {
    const filePath = document.fileName;
    const projectRoot = findProjectRoot(filePath);

    if (projectRoot === undefined) {
      return reject(new Error("failed to find project root"));
    }

    const tmpDir = path.join(os.tmpdir(), "com.elliotekj.elixir-mix-format");

    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir);
    }

    const fileName = path.basename(filePath);
    const tmpFile = getTmpFile(tmpDir, fileName);
    const text = document.getText();

    try {
      fs.writeFileSync(tmpFile, text);
    } catch (err) {
      return reject(new Error("could not create tmp file"));
    }

    try {
      cp.execSync(`mix format ${tmpFile}`, { cwd: projectRoot });
    } catch (err) {
      try {
        fs.unlinkSync(tmpFile);
      } catch (err) {}

      return reject(new Error("failed to format file"));
    }

    const formatted = fs.readFileSync(tmpFile, "utf-8");

    try {
      fs.unlinkSync(tmpFile);
    } catch (err) {}

    if (formatted.length > 0) {
      resolve(formatted);
    } else {
      reject();
    }
  });
}

function findProjectRoot(fileName) {
  let currentDir = path.dirname(fileName);
  const homeDir = require("os").homedir();

  while (currentDir !== homeDir) {
    const candidatePath = path.join(currentDir, "mix.exs");

    if (fs.existsSync(candidatePath)) {
      return currentDir;
    }

    const parentDir = path.resolve(currentDir, "..");

    if (parentDir === currentDir) {
      break;
    }

    currentDir = parentDir;
  }

  return undefined;
}

function getTmpFile(tmpDir, fileName) {
  const tmpPath = `${tmpDir}/${crypto
    .randomBytes(16)
    .toString("hex")}-${fileName}`;

  return path.normalize(tmpPath);
}

module.exports = { activate };
