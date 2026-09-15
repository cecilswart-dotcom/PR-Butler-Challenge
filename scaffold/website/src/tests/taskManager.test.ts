import { describe, it, expect, beforeEach } from 'vitest'
import { TaskManager } from '../taskManager'
import { loadTranslations, setLanguage, t, getCurrentLanguage } from '../i18n'

describe('TaskManager & i18n', () => {
  let manager: TaskManager

  beforeEach(() => {
    localStorage.clear()
    
    // Set up standard mock DOM nodes so render() and updateStats() can execute fully
    document.body.innerHTML = `
      <div class="container">
        <header>
          <h1>My Task Manager</h1>
          <div class="language-selector">
            <button id="lang-en" class="active">English</button>
            <button id="lang-fr">Français</button>
          </div>
        </header>
        <main>
          <div id="tasks"></div>
          <div class="stats">
            <p>Total tasks: <span id="total-count">0</span></p>
            <p>Completed: <span id="completed-count">0</span></p>
          </div>
        </main>
        <footer>
          <p>Built with TypeScript</p>
        </footer>
      </div>
    `
    manager = new TaskManager()
  })

  it('should add a task and render it', () => {
    manager.addTask('Test task', 'low')
    const tasks = manager.getTasks()
    expect(tasks).toHaveLength(1)
    expect(tasks[0].text).toBe('Test task')
    expect(tasks[0].priority).toBe('low')
    expect(tasks[0].completed).toBe(false)
    
    const taskList = document.getElementById('tasks')
    expect(taskList?.children).toHaveLength(1)
    
    const taskText = taskList?.querySelector('.task-text')
    expect(taskText?.textContent).toBe('Test task')
  })

  it('should toggle task status', () => {
    manager.addTask('Toggle test', 'medium')
    const task = manager.getTasks()[0]
    
    manager.toggleTask(task.id)
    expect(manager.getTasks()[0].completed).toBe(true)
    expect(manager.getCompletedCount()).toBe(1)
    
    const completedCountEl = document.getElementById('completed-count')
    expect(completedCountEl?.textContent).toBe('1')

    // Toggle back to active
    manager.toggleTask(task.id)
    expect(manager.getTasks()[0].completed).toBe(false)
    expect(manager.getCompletedCount()).toBe(0)
  })

  it('should not throw if toggling non-existent task ID', () => {
    manager.addTask('Toggle test', 'medium')
    expect(() => manager.toggleTask(999)).not.toThrow()
  })

  it('should delete a task', () => {
    manager.addTask('To be deleted', 'high')
    const task = manager.getTasks()[0]
    
    manager.deleteTask(task.id)
    expect(manager.getTasks()).toHaveLength(0)
    
    const taskList = document.getElementById('tasks')
    expect(taskList?.children).toHaveLength(0)
  })

  it('should filter tasks correctly', () => {
    manager.addTask('Active task 1', 'low')
    manager.addTask('Active task 2', 'medium')
    manager.addTask('Completed task', 'high')
    
    const tasks = manager.getTasks()
    manager.toggleTask(tasks[2].id) // Complete the 3rd task

    // Filter 'active'
    manager.setFilter('active')
    let renderedItems = document.querySelectorAll('.task-item')
    expect(renderedItems).toHaveLength(2)

    // Filter 'completed'
    manager.setFilter('completed')
    renderedItems = document.querySelectorAll('.task-item')
    expect(renderedItems).toHaveLength(1)

    // Filter 'all'
    manager.setFilter('all')
    renderedItems = document.querySelectorAll('.task-item')
    expect(renderedItems).toHaveLength(3)
  })

  it('should save and load from storage', () => {
    manager.addTask('Persistent task', 'medium')
    
    // Create new manager instance; it should load the tasks from localStorage
    const newManager = new TaskManager()
    expect(newManager.getTasks()).toHaveLength(1)
    expect(newManager.getTasks()[0].text).toBe('Persistent task')
  })

  it('should support translation functions in i18n module', async () => {
    await loadTranslations()
    
    setLanguage('en')
    expect(getCurrentLanguage()).toBe('en')
    expect(t('app.title')).toBe('My Task Manager')
    expect(t('nonexistent.key')).toBe('nonexistent.key')
    
    setLanguage('fr')
    expect(getCurrentLanguage()).toBe('fr')
    expect(t('app.title')).toBe('Mon Gestionnaire de Tâches')
  })

  it('should render correct translated values in the list', () => {
    setLanguage('fr')
    manager.addTask('French task', 'high')
    
    const badge = document.querySelector('.priority-badge')
    expect(badge?.textContent).toBe('Priorité haute')
    
    const deleteBtn = document.querySelector('.delete-btn')
    expect(deleteBtn?.textContent).toBe('Supprimer')
  })
})
