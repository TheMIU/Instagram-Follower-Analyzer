function copyCode() {
    const code = document.getElementById('code-block').innerText;
    const textarea = document.createElement('textarea');
    textarea.value = code;
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand('copy');
        alert("Code copied to clipboard!");
    } catch (err) {
        alert("Failed to copy code.");
    }
    document.body.removeChild(textarea);
}

/* ///////////////////// export import ///////////////////// */
function exportText(type) {
    const textarea = document.getElementById(type);
    const text = textarea.value;
    const blob = new Blob([text], { type: 'text/plain' });
    const link = document.createElement('a');
    link.download = `${type}.txt`;
    link.href = URL.createObjectURL(blob);
    link.click();
}

function importText(input, type) {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        document.getElementById(type).value = e.target.result;
        updateCount(type); // update follower/following count
    };
    reader.readAsText(file);
}

/* ///////////////////// update counts ///////////////////// */
/* function updateCount(type) {
    const textarea = document.getElementById(type);
    const count = textarea.value.split(',').map(name => name.trim()).filter(name => name).length;
    document.getElementById(type + 'Count').innerText = count;
}
 */

function importText(input, type) {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        document.getElementById(type).value = e.target.result;
        // Trigger count update using the correct IDs
        updateCount(type, type + 'Count');
    };
    reader.readAsText(file);
}


function updateCount(inputId, countId) {
    const input = document.getElementById(inputId).value;
    const count = input
        .split(',')
        .map(name => name.trim())
        .filter(name => name).length;

    document.getElementById(countId).textContent = count;
}

document.getElementById('followers').addEventListener('input', () => {
    updateCount('followers', 'followersCount');
});

document.getElementById('following').addEventListener('input', () => {
    updateCount('following', 'followingCount');
});

/* ///////////////////// analyze ///////////////////// */
function analyze() {
    const followersInput = document.getElementById('followers').value;
    const followingInput = document.getElementById('following').value;

    const followers = followersInput
        .split(',')
        .map(name => name.trim())
        .filter(name => name);

    const following = followingInput
        .split(',')
        .map(name => name.trim())
        .filter(name => name);

    document.getElementById('followersCount').textContent = followers.length;
    document.getElementById('followingCount').textContent = following.length;

    const notFollowingBack = following.filter(name => !followers.includes(name));
    const notFollowedBack = followers.filter(name => !following.includes(name));

    const createLinkList = (usernames) => {
        if (usernames.length === 0) return '<p>None</p>';
        return `<ul>${usernames
            .map(name => `<li><a href="https://www.instagram.com/${name}" target="_blank">${name}</a></li>`)
            .join('')}</ul>`;
    };

    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `
    <h3>Results</h3>

    <p><strong>People you follow but they don't follow you back:</strong> (${notFollowingBack.length})</p>
    ${createLinkList(notFollowingBack)}

    <p><strong>People who follow you but you don't follow back:</strong> (${notFollowedBack.length})</p>
    ${createLinkList(notFollowedBack)}
  `;
}


