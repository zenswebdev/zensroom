let skillTreeLoaded = false;

async function renderSkillTreeFromJSON() {
  try {
    const response = await fetch('skills.json');
    if (!response.ok) throw new Error('Failed to load skills.json');

    const jsonData = await response.json();

    const container = document.querySelector('.skills-tree');
    if (!container) return;

    container.innerHTML = ''; // Clear existing content

    jsonData.skillsTree.forEach(row => {
      const rowDiv = document.createElement('div');
      rowDiv.className = row.rowType;

      row.nodes.forEach(node => {
        const nodeDiv = document.createElement('div');
        nodeDiv.className = node.classes.join(' ');

        node.content.forEach(item => {
          if (item.tag === 'span') {
            const span = document.createElement('span');
            span.textContent = item.text;
            nodeDiv.appendChild(span);
          } else if (item.tag === 'img') {
            const img = document.createElement('img');
            img.src = item.src;
            img.alt = item.alt || '';
            nodeDiv.appendChild(img);
          }
        });

        rowDiv.appendChild(nodeDiv);
      });

      container.appendChild(rowDiv);
    });

    skillTreeLoaded = true; // flag to indicate tree is loaded

  } catch (err) {
    console.error(err);
  }
}

// Render the tree after DOM loads
document.addEventListener('DOMContentLoaded', renderSkillTreeFromJSON);