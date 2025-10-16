console.log('Magic Notes App Initialized');
showNotes();

let addbtn = document.getElementById('addbtn');

addbtn.addEventListener('click', function (event) {
    let addtxt = document.getElementById('addtxt');
    let addtitle = document.getElementById('addtitle');

    // Validation
    if (!addtitle.value.trim()) {
        showAlert('Please enter a title for your note!', 'warning');
        return;
    }
    if (!addtxt.value.trim()) {
        showAlert('Please enter some content for your note!', 'warning');
        return;
    }

    let notes = localStorage.getItem('notes');
    let notesObj;

    if (notes == null) {
        notesObj = [];
    } else {
        notesObj = JSON.parse(notes);
    }

    let myObj = {
        title: addtitle.value.trim(),
        text: addtxt.value.trim(),
        timestamp: new Date().toLocaleString(),
        id: Date.now()
    };

    notesObj.push(myObj);
    localStorage.setItem('notes', JSON.stringify(notesObj));

    // Clear inputs
    addtxt.value = '';
    addtitle.value = '';

    // Show success message
    showAlert('Note saved successfully!', 'success');

    console.log(notesObj);
    showNotes();
});

// Function to show alert messages
function showAlert(message, type) {
    // Remove existing alerts
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }

    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    alertDiv.innerHTML = `
        <i class="bi bi-${type === 'success' ? 'check-circle-fill' : 'exclamation-triangle-fill'} me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    document.body.appendChild(alertDiv);

    // Auto remove after 3 seconds
    setTimeout(() => {
        if (alertDiv && alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 3000);
}
//function to show the notes
function showNotes() {
    let notes = localStorage.getItem('notes');
    let notesObj;

    if (notes == null) {
        notesObj = [];
    } else {
        notesObj = JSON.parse(notes);
    }

    let html = '';
    let notesEls = document.getElementById('notes');

    if (notesObj.length === 0) {
        notesEls.innerHTML = `
            <div class="col-12">
                <div class="empty-state fade-in">
                    <i class="bi bi-journal-x"></i>
                    <h4>No notes yet!</h4>
                    <p class="mb-0">Create your first note using the form above to get started.</p>
                </div>
            </div>
        `;
        return;
    }

    notesObj.forEach(function (element, index) {
        const truncatedText = element.text.length > 150 ?
            element.text.substring(0, 150) + '...' : element.text;

        html += `
            <div class="col-lg-4 col-md-6 col-sm-12">
                <div class="card note-card noteCard fade-in" data-index="${index}">
                    <div class="card-body">
                        <h5 class="note-title">${element.title}</h5>
                        <p class="note-text">${truncatedText}</p>
                        ${element.timestamp ? `<small class="text-muted mb-2 d-block">
                            <i class="bi bi-clock me-1"></i>${element.timestamp}
                        </small>` : ''}
                        <button 
                            id="${index}" 
                            onclick="deleteNote(this.id)" 
                            class="btn btn-delete btn-sm"
                            title="Delete this note"
                        >
                            <i class="bi bi-trash3-fill me-1"></i>Delete
                        </button>
                    </div>
                </div>
            </div>
        `;
    });

    notesEls.innerHTML = html;

    // Add staggered animation
    const cards = document.querySelectorAll('.note-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
}

//function to delete the note
function deleteNote(index) {
    console.log('Deleting note at index:', index);

    // Show confirmation dialog
    if (!confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
        return;
    }

    let notes = localStorage.getItem('notes');
    let notesObj;

    if (notes == null) {
        notesObj = [];
    } else {
        notesObj = JSON.parse(notes);
    }

    // Remove the note
    notesObj.splice(index, 1);
    localStorage.setItem('notes', JSON.stringify(notesObj));

    // Show success message
    showAlert('Note deleted successfully!', 'success');

    // Refresh the display
    showNotes();
}

//for searching the notes 
let search = document.getElementById('searchtxt');
search.addEventListener('input', function () {
    let inputVal = search.value.toLowerCase().trim();
    console.log('Search input:', inputVal);

    let noteCards = document.getElementsByClassName('noteCard');
    let visibleCount = 0;

    Array.from(noteCards).forEach(function (element) {
        let cardTitle = element.getElementsByTagName('h5')[0].innerText.toLowerCase();
        let cardText = element.getElementsByTagName('p')[0].innerText.toLowerCase();

        // Search in both title and content
        if (cardTitle.includes(inputVal) || cardText.includes(inputVal)) {
            element.style.display = 'block';
            element.parentElement.style.display = 'block';
            visibleCount++;
        } else {
            element.style.display = 'none';
            element.parentElement.style.display = 'none';
        }
    });

    // Show "no results" message if search has input but no matches
    const notesContainer = document.getElementById('notes');
    const existingNoResults = document.querySelector('.no-results');

    if (existingNoResults) {
        existingNoResults.remove();
    }

    if (inputVal && visibleCount === 0 && noteCards.length > 0) {
        const noResultsDiv = document.createElement('div');
        noResultsDiv.className = 'col-12 no-results';
        noResultsDiv.innerHTML = `
            <div class="empty-state fade-in">
                <i class="bi bi-search"></i>
                <h4>No matching notes found</h4>
                <p class="mb-0">Try searching with different keywords or check your spelling.</p>
            </div>
        `;
        notesContainer.appendChild(noResultsDiv);
    }
});

// Add keyboard shortcuts
document.addEventListener('keydown', function (e) {
    // Ctrl/Cmd + S to save note
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        document.getElementById('addbtn').click();
    }

    // Ctrl/Cmd + F to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        document.getElementById('searchtxt').focus();
    }
});

// Add auto-save functionality (save to localStorage on input)
let autoSaveTimeout;
const titleInput = document.getElementById('addtitle');
const textInput = document.getElementById('addtxt');

function autoSave() {
    const draftData = {
        title: titleInput.value,
        text: textInput.value,
        timestamp: Date.now()
    };

    if (draftData.title || draftData.text) {
        localStorage.setItem('noteDraft', JSON.stringify(draftData));
    } else {
        localStorage.removeItem('noteDraft');
    }
}

function loadDraft() {
    const draft = localStorage.getItem('noteDraft');
    if (draft) {
        const draftData = JSON.parse(draft);
        titleInput.value = draftData.title || '';
        textInput.value = draftData.text || '';

        if (draftData.title || draftData.text) {
            showAlert('Draft restored!', 'success');
        }
    }
}

titleInput.addEventListener('input', function () {
    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = setTimeout(autoSave, 1000);
});

textInput.addEventListener('input', function () {
    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = setTimeout(autoSave, 1000);
});

// Clear draft when note is saved
const originalAddBtn = addbtn.onclick;
addbtn.addEventListener('click', function () {
    localStorage.removeItem('noteDraft');
});

// Load draft on page load
document.addEventListener('DOMContentLoaded', function () {
    loadDraft();
});

// Initialize the app
console.log('Magic Notes App Ready! 📝✨');
//         name:"chetan",
//         age:22
//     }
//  ]

//  /////////////////////////////////////////

// Initialize the app
console.log('Magic Notes App Ready! 📝✨');