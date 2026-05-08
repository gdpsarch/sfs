const projectFolders = ['orbit'];
let allProjects = [];

function customAlert(title, text) {
    const alertWin = document.getElementById('custom-alert');
    document.getElementById('alert-title').textContent = title;
    document.getElementById('alert-text').innerText = text;
    alertWin.style.display = 'block';
    centerWindow(alertWin);
}

function closeAlert() {
    document.getElementById('custom-alert').style.display = 'none';
}

function customConfirm(title, text, onYesCallback) {
    const confirmWin = document.getElementById('custom-confirm');
    document.getElementById('confirm-title').textContent = title;
    document.getElementById('confirm-message-text').innerText = text;
    confirmWin.style.display = 'block';
    centerWindow(confirmWin);

    document.getElementById('confirm-yes-btn').onclick = () => {
        onYesCallback();
        closeConfirm();
    };
}

function closeConfirm() {
    document.getElementById('custom-confirm').style.display = 'none';
}

function centerWindow(el) {
    el.style.left = (window.innerWidth / 2 - el.offsetWidth / 2) + 'px';
    el.style.top = (window.innerHeight / 2 - el.offsetHeight / 2) + 'px';
}

async function loadSFS() {
    const container = document.getElementById('sfs-container');
    if (!container) return;
    
    allProjects = [];

    for (const folder of projectFolders) {
        try {
            const res = await fetch(`p/${folder}/info.json`);
            if (!res.ok) continue;
            const data = await res.json();
            data.folder = folder;
            allProjects.push(data);
        } catch (e) { console.error("Error loading:", folder, e); }
    }
    renderProjects(allProjects);
}

function renderProjects(projects) {
    const container = document.getElementById('sfs-container');
    container.innerHTML = '';
    
    projects.forEach(data => {
        const projectBlock = document.createElement('div');
        projectBlock.className = 'project-card';
        projectBlock.innerHTML = `
            <div class="project-inner" style="display: flex; gap: 10px; border: inset 2px #808080; padding: 10px; background: #fff; margin-bottom: 10px; color: #000; text-align: left;">
                <img src="p/${data.folder}/${data.icon_file}" style="width: 32px; height: 32px;" onerror="this.src='https://img.icons8.com/color/32/000000/box.png'">
                <div style="flex: 1;">
                    <div style="font-weight: bold; color: #000080; font-size: 12px;">${data.name} [v${data.version}]</div>
                    <div style="font-size: 10px; color: #555; margin-bottom: 5px;">Author: ${data.author} | Date: ${data.date}</div>
                    <div style="font-size: 11px; margin-bottom: 8px;">${data.description}</div>
                    <div class="file-list">
                        ${data.url ? `<a href="${data.url}" target="_blank" class="win-btn">Visit Website</a>` : ''}
                        ${data.files ? data.files.map(f => `<a href="p/${data.folder}/${f.filename}" class="win-btn" download>${f.label}</a>`).join('') : ''}
                    </div>
                </div>
            </div>`;
        container.appendChild(projectBlock);
    });

    document.getElementById('objectsCount').textContent = `Objects: ${projects.length}`;
}

function filterProjects() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const sortBy = document.getElementById('sort-select').value;

    let filtered = allProjects.filter(p => 
        p.name.toLowerCase().includes(searchTerm) || 
        p.description.toLowerCase().includes(searchTerm) ||
        p.author.toLowerCase().includes(searchTerm)
    );

    if (sortBy === 'name') {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'date') {
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    renderProjects(filtered);
}

function makeDraggable(el) {
    const titleBar = el.querySelector('.title-bar');
    let isDragging = false, offset = { x: 0, y: 0 };

    titleBar.onmousedown = (e) => {
        if (el.classList.contains('maximized')) return;
        isDragging = true;
        document.querySelectorAll('.window').forEach(w => w.style.zIndex = '10');
        el.style.zIndex = '100';
        offset.x = e.clientX - el.offsetLeft;
        offset.y = e.clientY - el.offsetTop;
    };

    document.onmousemove = (e) => {
        if (!isDragging) return;
        el.style.left = (e.clientX - offset.x) + 'px';
        el.style.top = (e.clientY - offset.y) + 'px';
    };

    document.onmouseup = () => isDragging = false;
}

window.onload = () => {
    loadSFS();
    
    const wins = ['main-window', 'custom-alert', 'custom-confirm'];
    wins.forEach(id => {
        const el = document.getElementById(id);
        if (el) makeDraggable(el);
    });

    document.querySelectorAll('#main-window .title-btn').forEach(btn => {
        btn.onclick = () => {
            const type = btn.textContent;
            if (type === '✕') {
                customConfirm("Exit", "Close SFS Client?", () => { document.getElementById('main-window').style.display = 'none'; });
            }
            if (type === '□') document.getElementById('main-window').classList.toggle('maximized');
            if (type === '_') customAlert('System', 'Minimized to virtual taskbar.');
        };
    });

    document.getElementById('search-input').oninput = filterProjects;
    document.getElementById('sort-select').onchange = filterProjects;
};