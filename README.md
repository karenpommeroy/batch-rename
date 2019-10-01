# batch-rename

Extension for Visual Studio Code that allows advanced renaming of files, directories and their contents.

This plugin is most useful when your project is separated into components where each component is contained within separate directory like on the screen below:

![alt text](/src/assets/screen1.png)


## Usage<hr/>

All commands are available from context menu after you select some files or directories. You can also use it from commands list (<code>F1 key</code>).

Each command will present you a prompt (**default value is the name that will be replaced** and it is inferred from currently selected files/directories.
You need to provide a new name in the prompt and confirm.

Casing is always preserved when doing text replacements.

### Available commands are:

*When file(s) are selected in explorer side panel*:

- **Batch Rename: File names** - renames currently selected files.

- **Batch Rename: Files and content** - renames currently selected files and replaces all occurences of old name within file contents.

*When directories are selected in explorer side panel:*

- **Batch Rename: Everything in directory** - renames every file in current directory and replaces all occurences of old name within file contents.

- **Batch Rename: Duplicate and rename** - creates copy of each file from selected directory under a new name and replaces all occurences of old name within copied files contents.



