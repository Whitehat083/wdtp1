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

// Function to update preview
function updatePreview() {
    const html = htmlEditor.getValue();
    const css = `<style>${cssEditor.getValue()}</style>`;
    const js = `<script>${jsEditor.getValue()}<\/script>`;
    const content = `
        <!DOCTYPE html>
        <html>
        <head>${css}</head>
        <body>${html}${js}</body>
        </html>
    `;
    const frame = document.getElementById('previewFrame');
    frame.contentDocument.open();
    frame.contentDocument.write(content);
    frame.contentDocument.close();
}

// Update preview on code change
htmlEditor.on('change', updatePreview);
cssEditor.on('change', updatePreview);
jsEditor.on('change', updatePreview);

// Initialize with sample code
htmlEditor.setValue(`<h1>My Bio</h1>\n<p>Tell us about yourself!</p>\n<button id="myButton">Click Me</button>`);
cssEditor.setValue(`body {\n    font-family: 'Roboto', sans-serif;\n    text-align: center;\n    padding: 20px;\n}\nbutton {\n    background-color: #3498db;\n    color: white;\n    padding: 10px 20px;\n    border: none;\n    border-radius: 4px;\n    cursor: pointer;\n}\nbutton:hover {\n    background-color: #2980b9;\n}`);
jsEditor.setValue(`document.getElementById('myButton').addEventListener('click', () => {\n    alert('Hello!');\n});`);

// Evaluation function
function evaluate() {
    const checkboxes = document.querySelectorAll('.evaluation input[type="checkbox"]');
    let score = 0;
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) score++;
    });
    alert(`You completed ${score} out of ${checkboxes.length} checklist items! Review your work and try to meet all criteria.`);
}

// Initial preview
updatePreview();
