import { tasks } from './data.js';

const APPLICATIONS_STORAGE_KEY = 'taskApplications';

const taskCardData = document.querySelector('#card-container');
const sortSelect = document.querySelector('#favourites-sort');
const statusFilter = document.querySelector('#status-filter');
const prioritetFilter = document.querySelector('#prioritet-filter');
const searchForm = document.querySelector('#searchForm');
const searchInput = document.querySelector('#search');
const modalTitle = document.querySelector('#taskModalTitle');
const modalBody = document.querySelector('#taskModalBody');

function getSavedApplications() {
    const savedApplications = localStorage.getItem(APPLICATIONS_STORAGE_KEY);

    if (!savedApplications) {
        return [];
    }

    try {
        return JSON.parse(savedApplications);
    } catch (error) {
        console.error('Не удалось прочитать заявки из localStorage', error);
        return [];
    }
}

function saveApplications(applications) {
    localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(applications));
}

function renderTaskCards(taskList) {
    taskCardData.innerHTML = taskList.map(task => `
        <div class="card task-card" data-task-id="${task.id}" style="width: 18rem; cursor: pointer;">
            <img src="${task.image}" class="card-img-top" alt="картинка">
            <div class="card-body">
                <h4 class="card-title">${task.title}</h4>
                <p class="card-title mb-1">${task.status}</p>
                <p class="card-title mb-1">${task.priority}</p>
                <h5 class="card-title">${task.createdBy.name}</h5>
            </div>
        </div>
    `).join('');
}

function sortTasks(taskList, value) {
    const copiedTasks = [...taskList];

    if (value === 'az') {
        copiedTasks.sort((a, b) => a.createdBy.name.localeCompare(b.createdBy.name));
    }

    if (value === 'za') {
        copiedTasks.sort((a, b) => b.createdBy.name.localeCompare(a.createdBy.name));
    }

    return copiedTasks;
}

function filterTasksByStatus(taskList, statusValue) {
    if (statusValue === 'all') {
        return taskList;
    }

    return taskList.filter(task => task.status === statusValue);
}

function filterTaskByPrioritet(taskList, prioritetValue) {
    if (prioritetValue === 'all') {
        return taskList;
    }

    return taskList.filter(task => task.priority === prioritetValue);
}

function filterBySearch(taskList, query) {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
        return taskList;
    }

    return taskList.filter(task =>
        task.title.toLowerCase().includes(normalizedQuery) ||
        task.description.toLowerCase().includes(normalizedQuery) ||
        task.createdBy.name.toLowerCase().includes(normalizedQuery)
    );
}

function updateCards() {
    let result = [...tasks];

    result = filterTasksByStatus(result, statusFilter.value);
    result = filterTaskByPrioritet(result, prioritetFilter.value);
    result = filterBySearch(result, searchInput.value);
    result = sortTasks(result, sortSelect.value);

    renderTaskCards(result);
}

function createOpenPositionsHtml(task) {
    if (!task.openPositions?.length) {
        return `<p class="text-muted mb-0">Свободных мест нет</p>`;
    }

    const savedApplications = getSavedApplications();

    return task.openPositions.map((position, index) => {
        const alreadyApplied = savedApplications.some(application =>
            application.taskId === task.id && application.roleLabel === position.roleLabel
        );

        return `
            <div class="border rounded-3 p-2 mb-2 d-flex justify-content-between align-items-center gap-2">
                <span>${position.roleLabel}</span>
                <button
                    class="btn btn-sm ${alreadyApplied ? 'btn-success' : 'btn-primary'} apply-position-btn"
                    data-task-id="${task.id}"
                    data-position-index="${index}"
                    ${alreadyApplied ? 'disabled' : ''}
                >
                    ${alreadyApplied ? 'Вы записаны' : 'Записаться'}
                </button>
            </div>
        `;
    }).join('');
}

function fillTaskModal(task) {
    modalTitle.textContent = task.title;

    const participantsHtml = task.participants.length
        ? task.participants.map(user => `
            <div class="d-flex align-items-center gap-2 mb-2">
                <img 
                    src="${user.avatar}" 
                    alt="${user.name}" 
                    class="rounded-circle"
                    width="40"
                    height="40"
                    style="object-fit: cover;"
                >
                <div>
                    <div class="fw-semibold">${user.name}</div>
                    <div class="text-muted small">${user.roleLabel}</div>
                </div>
            </div>
        `).join('')
        : `<p class="text-muted mb-0">Участников пока нет</p>`;

    const filesHtml = task.files.length
        ? task.files.map(file => `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <span>${file.name}</span>
                <span class="badge text-bg-secondary">${file.size}</span>
            </li>
        `).join('')
        : `<p class="text-muted mb-0">Файлы не прикреплены</p>`;

    const commentsHtml = task.comments.length
        ? task.comments.map(comment => `
            <div class="border rounded-3 p-3 mb-2 bg-light">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <strong>${comment.author}</strong>
                    <span class="text-muted small">${comment.createdAt}</span>
                </div>
                <div>${comment.text}</div>
            </div>
        `).join('')
        : `<p class="text-muted mb-0">Комментариев пока нет</p>`;

    const openPositionsHtml = createOpenPositionsHtml(task);

    modalBody.innerHTML = `
        <div class="container-fluid px-0">
            <div class="mb-4">
                <img 
                    src="${task.image}" 
                    alt="${task.title}" 
                    class="img-fluid rounded-4 w-100"
                    style="max-height: 280px; object-fit: cover;"
                >
            </div>

            <div class="d-flex flex-wrap gap-2 mb-3">
                <span class="badge text-bg-primary px-3 py-2">Статус: ${task.status}</span>
                <span class="badge text-bg-warning px-3 py-2">Приоритет: ${task.priority}</span>
                <span class="badge text-bg-dark px-3 py-2">Срок: ${task.deadline}</span>
            </div>

            <div class="card border-0 bg-light rounded-4 mb-4">
                <div class="card-body">
                    <h6 class="text-uppercase text-muted mb-3">Общая информация</h6>
                    <p class="mb-2"><strong>Постановщик:</strong> ${task.createdBy.name}</p>
                    <p class="mb-0"><strong>Роль:</strong> ${task.createdBy.roleLabel}</p>
                </div>
            </div>

            <div class="mb-4">
                <h5 class="mb-3">Описание</h5>
                <p class="mb-0">${task.description}</p>
            </div>

            <div class="mb-4">
                <h5 class="mb-3">Участники</h5>
                ${participantsHtml}
            </div>

            <div class="mb-4">
                <h5 class="mb-3">Свободные должности</h5>
                ${openPositionsHtml}
            </div>

            <div class="mb-4">
                <h5 class="mb-3">Файлы</h5>
                ${task.files.length ? `<ul class="list-group list-group-flush">${filesHtml}</ul>` : filesHtml}
            </div>

            <div>
                <h5 class="mb-3">Комментарии</h5>
                ${commentsHtml}
            </div>
        </div>
    `;
}

function applyToPosition(taskId, positionIndex) {
    const currentTask = tasks.find(task => task.id === Number(taskId));

    if (!currentTask || !currentTask.openPositions?.[positionIndex]) {
        return;
    }

    const selectedPosition = currentTask.openPositions[positionIndex];
    const applications = getSavedApplications();

    const applicationExists = applications.some(application =>
        application.taskId === currentTask.id && application.roleLabel === selectedPosition.roleLabel
    );

    if (applicationExists) {
        return;
    }

    applications.push({
        taskId: currentTask.id,
        taskTitle: currentTask.title,
        roleLabel: selectedPosition.roleLabel,
        status: currentTask.status,
        priority: currentTask.priority,
        image: currentTask.image,
        createdBy: currentTask.createdBy.name
    });

    saveApplications(applications);
    fillTaskModal(currentTask);
}

searchForm.addEventListener('submit', function (event) {
    event.preventDefault();
    updateCards();
});

searchInput.addEventListener('input', updateCards);
sortSelect.addEventListener('change', updateCards);
statusFilter.addEventListener('change', updateCards);
prioritetFilter.addEventListener('change', updateCards);

taskCardData.addEventListener('click', function (event) {
    const card = event.target.closest('.task-card');
    if (!card) return;

    const taskId = Number(card.dataset.taskId);
    const currentTask = tasks.find(task => task.id === taskId);

    if (!currentTask) return;

    fillTaskModal(currentTask);

    const modalElement = document.querySelector('#taskModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
});

modalBody.addEventListener('click', function (event) {
    const applyButton = event.target.closest('.apply-position-btn');

    if (!applyButton) {
        return;
    }

    applyToPosition(applyButton.dataset.taskId, Number(applyButton.dataset.positionIndex));
});

updateCards();
