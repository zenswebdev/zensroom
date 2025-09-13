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
    // make a wrapper for node + connectors
    const wrapper = document.createElement('div');
    wrapper.className = 'hex-wrapper';

    // the hexagon node
    const nodeDiv = document.createElement('div');
    nodeDiv.className = node.classes.join(' ');

    // add content (text/images)
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

    // add connectors to wrapper (NOT inside node)
    if (node.connectors) {
      node.connectors.forEach(side => {
        const connector = document.createElement('div');
        connector.className = `connector side-${side}`;
        wrapper.appendChild(connector);
      });
    }

    // put node above connectors
    wrapper.appendChild(nodeDiv);
    rowDiv.appendChild(wrapper);
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

