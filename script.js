const projectFolders = ['orbit']; 

    async function loadSFS() {
        const container = document.getElementById('sfs-container');
        container.innerHTML = '';
        let count = 0;

        for (const folder of projectFolders) {
            try {
                const res = await fetch(`p/${folder}/info.json`);
                if (!res.ok) continue;
                
                const data = await res.json();
                count++;

                const authorHTML = data.author_link 
                    ? `Author: <a href="${data.author_link}" target="_blank">${data.author}</a>`
                    : `Author: ${data.author}`;

                let filesHTML = '';
                if (data.files && data.files.length > 0) {
                    data.files.forEach(file => {
                        filesHTML += `
                            <a href="p/${folder}/${file.filename}" class="win-btn" download style="display: inline-block; text-decoration: none; margin-right: 5px; margin-top: 5px; padding: 3px 10px;">
                                ${file.label}
                            </a>`;
                    });
                }

                const projectBlock = document.createElement('div');
                projectBlock.className = 'project-card';
                projectBlock.innerHTML = `
                    <div style="display: flex; gap: 10px; border: inset 2px #808080; padding: 10px; background: #fff; margin-bottom: 10px; color: #000; text-align: left;">
                        <img src="p/${folder}/${data.icon_file}" style="width: 32px; height: 32px;" onerror="this.src='https://img.icons8.com/color/32/000000/box.png'">
                        <div style="flex: 1;">
                            <div style="font-weight: bold; color: #000080; font-size: 12px;">${data.name} [v${data.version}]</div>
                            <div style="font-size: 10px; color: #555; margin-bottom: 5px;">
                                ${authorHTML} | Date: ${data.date}
                            </div>
                            <div style="font-size: 11px; margin-bottom: 8px;">${data.description}</div>
                            <div class="file-list">
                                ${filesHTML}
                            </div>
                        </div>
                    </div>
                `;
                container.appendChild(projectBlock);

            } catch (e) {
                console.error("Error loading project folder:", folder, e);
            }
        }

        document.getElementById('objectsCount').textContent = `Objects: ${count}`;
        
        if (count === 0) {
            container.innerHTML = '<div style="padding: 10px; color: red;">Error: Directory /p/ is empty or corrupted.</div>';
        }
    }

    window.onload = loadSFS;