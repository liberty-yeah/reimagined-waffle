# reimagined-waffle (Story Brancher)
'libre' as in free. Tech is for all.

## What is Story Brancher?
A lightweight, keyboard-centric hierarchical outlining tool designed for mapping out branching stories, requirements, or complex narrative structures.

---

## 🚀 Features

* **Hierarchical Structure:** Create deeply nested nodes to represent parent-child relationships in your stories.
* **Keyboard-First Workflow:** Fast navigation and node manipulation without leaving your keyboard.
* **Collapsible Branches:** Toggle specific branches or use global collapse/expand based on depth.
* **Flexi Move:** A toggleable navigation mode that allows linear movement through the tree (visual order) regardless of nesting levels.
* **Clipboard Operations:** Support for Copy, Cut, Paste, and Duplicating entire node branches.
* **Data Persistence:** Automatically saves your progress to `LocalStorage`.
* **Import/Export:** Save your trees as JSON files to share or back up your work.

---

## ⌨️ Keyboard Shortcuts

### Navigation
| Shortcut | Action |
| :--- | :--- |
| **Up / Down Arrow** | Move selection (same level / visual order if Flexi Move is ON) |
| **Left / Right Arrow** | Move selection between parent and children |

### Structure & Editing
| Shortcut | Action |
| :--- | :--- |
| **Enter** | Add a new line within the current node |
| **Shift + Enter** | Add a new sibling node below |
| **Ctrl + Enter** | Add a new child node |
| **Ctrl + Up / Down** | Reorder the selected node among its siblings |
| **Ctrl + Right** | Nest the selected node under the sibling above it |
| **Ctrl + Left** | Unnest the selected node (move it to the parent's level) |

### Clipboard & Global
| Shortcut | Action |
| :--- | :--- |
| **Ctrl + C / X** | Copy / Cut the selected node and its entire branch |
| **Ctrl + V** | Paste the clipboard content below the selected node |
| **Ctrl + D** | Duplicate the selected node branch |
| **Ctrl + 0** | Open the Global Collapse/Expand by Depth dialog |

> **Note:** If **CapsLock** is ON, standard text operations (Copy/Paste text) are prioritized over node operations.

---

## 🛠️ Installation & Usage

1.  Clone the repository or download the source files.
2.  Open `index.html` in any modern web browser.
3.  Start typing! Your data is automatically saved to your browser's local storage.

---

## 📂 Project Structure

* `index.html`: The main entry point and UI layout.
* `style.css`: Clean, modern styling with a focus on readability.
* `app.js`: Core application initialization and global event handling.
* `tree-logic.js`: Functions for manipulating the data tree (adding, moving, and deleting nodes).
* `ui-logic.js`: Handles rendering, modal dialogs, and dynamic UI updates.

---

## 📜 Change Log (Recent Highlights)

### Version 0.2.0 (Current)
* Refactored codebase into modular logic files (`tree-logic.js`, `ui-logic.js`).
* Added **Flexi Move** toggle for linear navigation.
* Added **Global Collapse/Uncollapse** by depth (Ctrl + 0).
* Implemented CapsLock override for standard clipboard operations.
* Improved ID comparison and node operation reliability.
* Cleaned up UI with a focus on space efficiency.
