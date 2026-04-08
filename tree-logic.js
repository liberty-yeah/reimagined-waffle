function findNode(id, node = treeData) {
    if (node.id == id) return node;
    for (let child of node.children) {
        const found = findNode(id, child);
        if (found) return found;
    }
    return null;
}

function findParent(id, node = treeData) {
    for (let child of node.children) {
        if (child.id == id) return node;
        const found = findParent(id, child);
        if (found) return found;
    }
    return null;
}

function getVisibleNodes(node = treeData, list = []) {
    list.push(node);
    if (!node.collapsed && node.children) {
        node.children.forEach(c => getVisibleNodes(c, list));
    }
    return list;
}

function addChild(parentId) {
    const parent = findNode(parentId);
    if (!parent) return;
    const newNode = { id: Date.now(), text: "", attachments: [], children: [], collapsed: false };
    parent.children.push(newNode);
    parent.collapsed = false;
    selectedId = newNode.id;
    saveData();
    render();
}

function addSibling(nodeId) {
    const parent = findParent(nodeId);
    if (!parent) return;
    const index = parent.children.findIndex(n => n.id == nodeId);
    const newNode = { id: Date.now(), text: "", attachments: [], children: [], collapsed: false };
    parent.children.splice(index + 1, 0, newNode);
    selectedId = newNode.id;
    saveData();
    render();
}

function deleteNode(id) {
    const parent = findParent(id);
    if (!parent) return;
    const index = parent.children.findIndex(n => n.id == id);
    parent.children.splice(index, 1);
    selectedId = parent.id;
    saveData();
    render();
}

function moveNode(id, direction) {
    const parent = findParent(id);
    if (!parent) return;
    const index = parent.children.findIndex(n => n.id == id);
    const node = parent.children[index];

    if (direction === 'up' && index > 0) {
        parent.children.splice(index, 1);
        parent.children.splice(index - 1, 0, node);
    } else if (direction === 'down' && index < parent.children.length - 1) {
        parent.children.splice(index, 1);
        parent.children.splice(index + 1, 0, node);
    } else if (direction === 'right' && index > 0) {
        const newParent = parent.children[index - 1];
        parent.children.splice(index, 1);
        newParent.children.push(node);
        newParent.collapsed = false;
    } else if (direction === 'left') {
        const grandParent = findParent(parent.id);
        if (grandParent) {
            const parentIndex = grandParent.children.findIndex(n => n.id == parent.id);
            parent.children.splice(index, 1);
            grandParent.children.splice(parentIndex + 1, 0, node);
        }
    }
    saveData();
    render();
}

function copyNode(node) {
    clipboard = JSON.parse(JSON.stringify(node));
}

function cutNode(id) {
    const node = findNode(id);
    if (node) {
        copyNode(node);
        deleteNode(id);
    }
}

function pasteNode(targetId) {
    if (!clipboard) return;
    const parent = findParent(targetId);
    if (!parent) {
        const newNode = JSON.parse(JSON.stringify(clipboard));
        newNode.id = Date.now();
        treeData.children.push(newNode);
    } else {
        const index = parent.children.findIndex(n => n.id == targetId);
        const newNode = JSON.parse(JSON.stringify(clipboard));
        const regenIds = (n) => {
            n.id = Date.now() + Math.random();
            n.children.forEach(regenIds);
        };
        regenIds(newNode);
        parent.children.splice(index + 1, 0, newNode);
    }
    saveData();
    render();
}

function duplicateNode(id) {
    const node = findNode(id);
    if (node) {
        copyNode(node);
        pasteNode(id);
    }
}

function applyCollapseDepth(depth) {
    const setDepth = (n, currentDepth) => {
        if (n.children && n.children.length > 0) {
            n.collapsed = currentDepth >= depth;
            n.children.forEach(c => setDepth(c, currentDepth + 1));
        }
    };
    setDepth(treeData, 0);
    saveData();
    render();
}
