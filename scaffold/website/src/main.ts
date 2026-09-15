import { TaskManager } from './taskManager'
import { loadTranslations, setLanguage, t } from './i18n'
import { TaskFilter } from './types'
import './styles.css'

let taskManager: TaskManager

/**
 * Initializes the application by loading translations, instantiating the TaskManager,
 * setting up DOM event listeners, and rendering the initial translation strings and task list.
 * @returns A promise that resolves when initialization is complete.
 */
async function init() {
  await loadTranslations()
  taskManager = new TaskManager()
  setupEventListeners()
  applyTranslations()
}

/**
 * Binds DOM event listeners for the task form submission, language selector buttons,
 * and task filtering buttons.
 */
function setupEventListeners() {
  const form = document.getElementById('task-form') as HTMLFormElement
  const langEnBtn = document.getElementById('lang-en')
  const langFrBtn = document.getElementById('lang-fr')
  
  form?.addEventListener('submit', handleSubmit)
  langEnBtn?.addEventListener('click', () => switchLanguage('en'))
  langFrBtn?.addEventListener('click', () => switchLanguage('fr'))
  
  const filterBtns = document.querySelectorAll('.filter-btn')
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.target as HTMLElement
      const filter = target.dataset.filter
      if (filter) {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'))
        target.classList.add('active')
        taskManager.setFilter(filter as TaskFilter)
      }
    })
  })
}

/**
 * Handles the task creation form submission. Validates inputs, creates a new task,
 * and resets the input field.
 * @param e - The form submission event.
 */
function handleSubmit(e: Event) {
  e.preventDefault()
  const input = document.getElementById('task-input') as HTMLInputElement
  const select = document.getElementById('priority-select') as HTMLSelectElement
  if (input.value.trim()) {
    taskManager.addTask(input.value, select.value as 'low' | 'medium' | 'high')
    input.value = ''
  }
}

/**
 * Switches the active language, updates language button styling, and updates the translation texts on the screen.
 * @param lang - The language code to switch to (e.g. 'en' or 'fr').
 */
function switchLanguage(lang: string) {
  setLanguage(lang)
  
  document.querySelectorAll('.language-selector button').forEach(btn => {
    btn.classList.remove('active')
  })
  
  const activeBtn = document.getElementById(`lang-${lang}`)
  activeBtn?.classList.add('active')
  
  applyTranslations()
}

/**
 * Applies the current translations to all translatable DOM elements in the HTML page.
 */
function applyTranslations() {
  // Update header title
  const h1 = document.querySelector('header h1')
  if (h1) h1.textContent = t('app.title')

  // Update add task section header
  const addTaskH2 = document.querySelector('.add-task h2')
  if (addTaskH2) addTaskH2.textContent = t('task.add')

  // Update task input placeholder
  const taskInput = document.getElementById('task-input') as HTMLInputElement
  if (taskInput) taskInput.placeholder = t('task.placeholder')

  // Update priority select options
  const lowOption = document.querySelector('#priority-select option[value="low"]')
  if (lowOption) lowOption.textContent = t('priority.low')
  const mediumOption = document.querySelector('#priority-select option[value="medium"]')
  if (mediumOption) mediumOption.textContent = t('priority.medium')
  const highOption = document.querySelector('#priority-select option[value="high"]')
  if (highOption) highOption.textContent = t('priority.high')

  // Update add task button
  const addBtn = document.querySelector('#task-form button[type="submit"]')
  if (addBtn) addBtn.textContent = t('button.add')

  // Update filter buttons
  const allBtn = document.querySelector('.filter-btn[data-filter="all"]')
  if (allBtn) allBtn.textContent = t('filter.all')
  const activeBtn = document.querySelector('.filter-btn[data-filter="active"]')
  if (activeBtn) activeBtn.textContent = t('filter.active')
  const completedBtn = document.querySelector('.filter-btn[data-filter="completed"]')
  if (completedBtn) completedBtn.textContent = t('filter.completed')

  // Update stats labels
  const statsP = document.querySelectorAll('.stats p')
  if (statsP.length >= 2) {
    statsP[0].innerHTML = `${t('stats.total')}: <span id="total-count">0</span>`
    statsP[1].innerHTML = `${t('stats.completed')}: <span id="completed-count">0</span>`
  }

  // Update footer text
  const footerP = document.querySelector('footer p')
  if (footerP) {
    footerP.textContent = `${t('footer.text')} • 2026`
  }

  // Trigger a re-render of the taskManager to update dynamic items like delete button text and priority badges
  if (taskManager) {
    taskManager.render()
  }
}

init().catch(console.error)
