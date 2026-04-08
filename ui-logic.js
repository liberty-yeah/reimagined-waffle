function render() {
    const container = document.getElementById('tree-container');
    container.innerHTML = '';
    container.appendChild(renderNode(treeData, null, 0));

    // Auto-resize textareas
    document.querySelectorAll('textarea').forEach(textarea => {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    });

    const selectedEl = document.querySelector(`.node-wrapper[data-id="${selectedId}"]`);
    if (selectedEl) {
        selectedEl.classList.add('selected');
        const ta = selectedEl.querySelector('textarea');
        if (document.activeElement !== ta) ta.focus();
    }
}

function renderNode(node, parent, depth) {
    const nodeDiv = document.createElement('div');
    nodeDiv.className = 'node';
    nodeDiv.dataset.id = node.id;

    const wrapper = document.createElement('div');
    wrapper.className = 'node-wrapper';
    wrapper.dataset.id = node.id;
    if (selectedId == node.id) wrapper.classList.add('selected');

    wrapper.onclick = (e) => {
        selectedId = node.id;
        render();
    };

    const toggle = document.createElement('span');
    toggle.className = 'collapse-toggle';
    if (node.children && node.children.length > 0) {
        toggle.innerText = node.collapsed ? '▶' : '▼';
        toggle.onclick = (e) => {
            e.stopPropagation();
            node.collapsed = !node.collapsed;
            saveData();
            render();
        };
    } else {
        toggle.innerHTML = '&nbsp;&nbsp;';
        toggle.style.cursor = 'default';
    }
    wrapper.appendChild(toggle);

    const content = document.createElement('div');
    content.className = 'node-content';

    const textarea = document.createElement('textarea');
    textarea.value = node.text;
    textarea.placeholder = "Enter story details...";
    textarea.rows = 1;
    textarea.oninput = (e) => {
        node.text = e.target.value;
        e.target.style.height = 'auto';
        e.target.style.height = e.target.scrollHeight + 'px';
        saveData();
    };
    textarea.onkeydown = (e) => handleKeyDown(e, node, parent);

    content.appendChild(textarea);

    const actions = document.createElement('div');
    actions.className = 'node-actions';

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'icon-btn';
    deleteBtn.innerHTML = '🗑️';
    deleteBtn.onclick = (e) => {
        e.stopPropagation();
        deleteNode(node.id);
    };

    if (parent) actions.appendChild(deleteBtn);

    wrapper.appendChild(content);
    wrapper.appendChild(actions);
    nodeDiv.appendChild(wrapper);

    if (node.children && node.children.length > 0) {
        const childrenDiv = document.createElement('div');
        childrenDiv.className = 'children';
        if (node.collapsed) childrenDiv.classList.add('collapsed');
        node.children.forEach(child => {
            childrenDiv.appendChild(renderNode(child, node, depth + 1));
        });
        nodeDiv.appendChild(childrenDiv);
    }

    return nodeDiv;
}

function showModal(contentHtml) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `<div class="modal-content">${contentHtml}</div>`;
    overlay.onclick = (e) => {
        if (e.target === overlay) document.body.removeChild(overlay);
    };
    document.body.appendChild(overlay);
    return overlay;
}

function showCollapseDepthDialog() {
    const html = `
        <h2>Collapse/Expand by Depth</h2>
        <p>Enter depth beyond which to collapse (0 = collapse all except root):</p>
        <input type="number" id="depth-input" value="0" min="0">
        <div class="modal-actions">
            <button onclick="applyCollapseDepthUI()">Apply</button>
            <button class="clear-btn" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
        </div>
    `;
    showModal(html);
}

function applyCollapseDepthUI() {
    const depth = parseInt(document.getElementById('depth-input').value);
    applyCollapseDepth(depth);
    const modal = document.querySelector('.modal-overlay');
    if (modal) modal.remove();
}
