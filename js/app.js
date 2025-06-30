
    // Adjust height for summary textarea
    const summaryTextarea = document.getElementById('summaryText');
    if (summaryTextarea) {
        summaryTextarea.style.height = 'auto';
        summaryTextarea.style.height = summaryTextarea.scrollHeight + 'px';
    }

    // Adjust height for all note textareas
    const noteTextareas = document.querySelectorAll('.book-textarea');
    noteTextareas.forEach(textarea => {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    });

