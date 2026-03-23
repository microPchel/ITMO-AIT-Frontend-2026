const APPLICATIONS_STORAGE_KEY = 'taskApplications';
const taskCardData = document.querySelector('#card-container');

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

function renderAccountCards() {
    const applications = getSavedApplications();

    if (!applications.length) {
        taskCardData.innerHTML = `
            <div class="alert alert-secondary w-100" role="alert">
                Вы пока ни на одну должность не записались.
            </div>
        `;
        return;
    }

    taskCardData.innerHTML = applications.map(application => `
        <div class="card" style="width: 20rem;">
            <img src="${application.image}" class="card-img-top" alt="${application.taskTitle}">
            <div class="card-body">
                <h5 class="card-title">${application.taskTitle}</h5>
                <p class="mb-2"><strong>Роль:</strong> ${application.roleLabel}</p>
                <p class="mb-1"><strong>Статус Задачи:</strong> ${application.status}</p>
                <p class="mb-1"><strong>Приоритет:</strong> ${application.priority}</p>
                <p class="mb-0"><strong>Постановщик:</strong> ${application.createdBy}</p>
            </div>
        </div>
    `).join('');
}

renderAccountCards();
