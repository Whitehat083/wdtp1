// Initialize CodeMirror editors
const htmlEditor = CodeMirror.fromTextArea(document.getElementById('htmlEditor'), {
    mode: 'xml',
    theme: 'default',
    lineNumbers: true,
    autoCloseTags: true
});
const cssEditor = CodeMirror.fromTextArea(document.getElementById('cssEditor'), {
    mode: 'css',
    theme: 'default',
    lineNumbers: true,
    autoCloseBrackets: true
});
const jsEditor = CodeMirror.fromTextArea(document.getElementById('jsEditor'), {
    mode: 'javascript',
    theme: 'default',
    lineNumbers: true,
    autoCloseBrackets: true
});

// Load and select a random challenge
async function loadChallenge() {
    try {
        const response = await fetch('challenges.json');
        if (!response.ok) throw new Error('Failed to fetch challenges');
        const challenges = await response.json();
        const history = JSON.parse(localStorage.getItem('challengeHistory') || '[]');
        
        // Filter out recently viewed challenges
        const availableChallenges = challenges.filter(ch => !history.includes(ch.id));
        if (availableChallenges.length === 0) {
            localStorage.setItem('challengeHistory', JSON.stringify([]));
            availableChallenges.push(...challenges);
        }
        
        // Select random challenge
        const challenge = availableChallenges[Math.floor(Math.random() * availableChallenges.length)];
        
        // Update history
        history.push(challenge.id);
        if (history.length > 5) history.shift();
        localStorage.setItem('challengeHistory', JSON.stringify(history));
        
        return challenge;
    } catch (error) {
        console.error('Error loading challenge:', error);
        return {
            id: 0,
            title: "Fallback Challenge: Simple Page",
            description: "Create a simple webpage with a heading and a paragraph. Style it with CSS and add a button with an alert.",
            requirements: [
                "Includes a heading",
                "Includes a styled paragraph",
                "Has a button with an alert"
            ],
            starterCode: {
                html: "<h1>Welcome</h1>\n<p>Write something!</p>\n<button id=\"myButton\">Click</button>",
                css: "body { font-family: 'Roboto', sans-serif; text-align: center; }",
                js: "document.getElementById('myButton').addEventListener('click', () => { alert('Hello!'); });"
            }
        };
    }
}

// Render the challenge
async function renderChallenge() {
    const challenge = await loadChallenge();
    if (!challenge) return;
    
    document.getElementById('challenge-title').textContent = challenge.title;
    document.getElementById('challenge-description').textContent = challenge.description;
    
    const requirementsList = document.getElementById('challenge-requirements');
    requirementsList.innerHTML = challenge.requirements.map(req => `
        <li><input type="checkbox" class="requirement" aria-label="Requirement: ${req}"> ${req}</li>
    `).join('');
    
    htmlEditor.setValue(challenge.starterCode.html || '');
    cssEditor.setValue(challenge.starterCode.css || '');
    jsEditor.setValue(challenge.starterCode.js || '');
    
    updatePreview();
}

// Update preview
function updatePreview() {
    const html = htmlEditor.getValue();
    const css = cssEditor.getValue();
    const js = jsEditor.getValue();
    const escapedJs = js.replace(/<\/script>/gi, '<\\/script>');
    const content = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <style>${css}</style>
        </head>
        <body>
            ${html}
            <script>
                try {
                    ${escapedJs}
                } catch (e) {
                    console.error('Script error:', e);
                    document.body.innerHTML += '<p style="color: red;">Error executing JavaScript. Check console for details.</p>';
                }
            </script>
        </body>
        </html>
    `;
    const frame = document.getElementById('previewFrame');
    try {
        frame.contentDocument.open();
        frame.contentDocument.write(content);
        frame.contentDocument.close();
    } catch (e) {
        console.error('Preview error:', e);
        frame.contentDocument.open();
        frame.contentDocument.write('<p>Error rendering preview. Please check your code.</p>');
        frame.contentDocument.close();
    }
}

// Update preview on code change
htmlEditor.on('change', updatePreview);
cssEditor.on('change', updatePreview);
jsEditor.on('change', updatePreview);

// Evaluation function
function evaluate() {
    const checkboxes = document.querySelectorAll('.requirement');
    let completed = 0;
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) completed++;
    });
    const htmlCode = htmlEditor.getValue();
    const cssCode = cssEditor.getValue();
    const jsCode = jsEditor.getValue();

    // Store in session storage
    sessionStorage.setItem('stars', completed);
    sessionStorage.setItem('htmlCode', htmlCode);
    sessionStorage.setItem('cssCode', cssCode);
    sessionStorage.setItem('jsCode', jsCode);

    // Redirect to result page
    window.location.href = 'result.html';
}

// Load challenge on page load
document.addEventListener('DOMContentLoaded', renderChallenge);
