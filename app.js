const APP_VERSION = "Ver 0.2.0";
const STORAGE_KEY = "user_story_brancher_data";

let treeData = null;
let selectedId = null;
let clipboard = null;
let flexiMove = false;

function init() {
    document.getElementById('version-display').innerText = APP_VERSION;
    loadData();
    render();

    document.addEventListener('keydown', handleGlobalKeyDown);
}

function loadData() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        const data = JSON.parse(saved);
        treeData = data.tree || data;
        flexiMove = data.flexiMove || false;
        const toggle = document.getElementById('flexi-toggle');
        if (toggle) toggle.checked = flexiMove;
    } else {
        resetTree();
    }
    selectedId = treeData.id;
}

function resetTree() {
    treeData = {
        id: Date.now(),
        text: "Root Story",
        attachments: [],
        children: [],
        collapsed: false
    };
    saveData();
}

function clearAll() {
    if (confirm("Are you sure you want to clear everything?")) {
        resetTree();
        selectedId = treeData.id;
        render();
    }
}

function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
        tree: treeData,
        flexiMove: flexiMove
    }));
}

function toggleFlexi() {
    flexiMove = document.getElementById('flexi-toggle').checked;
    saveData();
}

function handleKeyDown(e, node, parent) {
    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey) return;

    if (e.key === 'Enter' && e.shiftKey) {
        e.preventDefault();
        addSibling(node.id);
    } else if (e.key === 'Enter' && e.ctrlKey) {
        e.preventDefault();
        addChild(node.id);
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (e.ctrlKey) moveNode(node.id, 'up');
        else if (flexiMove) navigateLinear('up');
        else navigate('up');
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (e.ctrlKey) moveNode(node.id, 'down');
        else if (flexiMove) navigateLinear('down');
        else navigate('down');
    } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (e.ctrlKey) moveNode(node.id, 'right');
        else navigate('right');
    } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (e.ctrlKey) moveNode(node.id, 'left');
        else navigate('left');
    } else if (e.ctrlKey && e.key.toLowerCase() === 'c') {
        if (e.getModifierState('CapsLock')) return;
        e.preventDefault();
        copyNode(node);
    } else if (e.ctrlKey && e.key.toLowerCase() === 'x') {
        if (e.getModifierState('CapsLock')) return;
        e.preventDefault();
        cutNode(node.id);
    } else if (e.ctrlKey && e.key.toLowerCase() === 'v') {
        if (e.getModifierState('CapsLock')) return;
        e.preventDefault();
        pasteNode(node.id);
    } else if (e.ctrlKey && e.key.toLowerCase() === 'd') {
        if (e.getModifierState('CapsLock')) return;
        e.preventDefault();
        duplicateNode(node.id);
    }
}

function handleGlobalKeyDown(e) {
    if (e.ctrlKey && e.key === '0') {
        e.preventDefault();
        showCollapseDepthDialog();
    }
}

function navigateLinear(direction) {
    const list = getVisibleNodes();
    const index = list.findIndex(n => n.id == selectedId);
    if (direction === 'up') {
        if (index > 0) selectedId = list[index - 1].id;
        else selectedId = list[list.length - 1].id;
    } else if (direction === 'down') {
        if (index < list.length - 1) selectedId = list[index + 1].id;
        else selectedId = list[0].id;
    }
    render();
}

function navigate(direction) {
    const parent = findParent(selectedId);
    if (!parent) {
        if (direction === 'down' && treeData.children.length > 0) {
            selectedId = treeData.children[0].id;
        }
    } else {
        const index = parent.children.findIndex(n => n.id == selectedId);
        if (direction === 'up') {
            if (index > 0) selectedId = parent.children[index - 1].id;
        } else if (direction === 'down') {
            if (index < parent.children.length - 1) selectedId = parent.children[index + 1].id;
        } else if (direction === 'right') {
            const current = parent.children[index];
            if (current.children.length > 0) {
                current.collapsed = false;
                selectedId = current.children[0].id;
            }
        } else if (direction === 'left') {
            selectedId = parent.id;
        }
    }
    render();
}

// JSON Import/Export
function exportJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(treeData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "story_brancher.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function importJSON(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const imported = JSON.parse(e.target.result);
            treeData = imported.tree || imported;
            flexiMove = imported.flexiMove || false;
            const toggle = document.getElementById('flexi-toggle');
            if (toggle) toggle.checked = flexiMove;
            selectedId = treeData.id;
            saveData();
            render();
        } catch (err) {
            alert("Error parsing JSON file");
        }
    };
    reader.readAsText(file);
}

window.onload = init;
