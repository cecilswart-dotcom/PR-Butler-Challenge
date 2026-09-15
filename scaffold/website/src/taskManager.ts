import { Task, TaskFilter } from './types'
import { t } from './i18n'

export class TaskManager {
  private tasks: Task[] = []
  private filter: TaskFilter = 'all'
  private nextId = 1

  constructor() {
    this.loadFromStorage()
  }

  /**
   * Adds a new task with the specified text and priority level.
   * @param text - The description of the task.
   * @param priority - The priority level ('low', 'medium', or 'high').
   */
  addTask(text: string, priority: 'low' | 'medium' | 'high') {
    const task: Task = {
      id: this.nextId++,
      text,
      priority,
      completed: false,
      createdAt: new Date()
    }
    this.tasks.push(task)
    this.saveToStorage()
    this.render()
  }

  /**
   * Toggles the completed status of a task by its ID.
   * @param id - The unique ID of the task to toggle.
   */
  toggleTask(id: number) {
    const task = this.tasks.find(t => t.id === id)
    if (task) {
      task.completed = !task.completed
      this.saveToStorage()
      this.render()
    }
  }

  /**
   * Deletes a task from the list by its ID.
   * @param id - The unique ID of the task to delete.
   */
  deleteTask(id: number) {
    this.tasks = this.tasks.filter(t => t.id !== id)
    this.saveToStorage()
    this.render()
  }

  /**
   * Sets the current task filter ('all', 'active', or 'completed') and triggers a re-render.
   * @param filter - The task filter to apply.
   */
  setFilter(filter: TaskFilter) {
    this.filter = filter
    this.render()
  }

  /**
   * Creates a DOM element representing a single task.
   * @param task - The task object.
   * @returns The generated list item element.
   */
  private createTaskElement(task: Task): HTMLElement {
    const li = document.createElement('li')
    li.className = `task-item ${task.completed ? 'completed' : ''}`
    
    const content = document.createElement('div')
    content.className = 'task-content'
    
    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.className = 'task-checkbox'
    checkbox.checked = task.completed
    checkbox.addEventListener('change', () => this.toggleTask(task.id))
    
    const text = document.createElement('span')
    text.className = 'task-text'
    text.innerHTML = task.text
    
    const badge = document.createElement('span')
    badge.className = `priority-badge priority-${task.priority}`
    badge.textContent = t(`priority.${task.priority}`)
    
    content.appendChild(checkbox)
    content.appendChild(text)
    content.appendChild(badge)
    
    const deleteBtn = document.createElement('button')
    deleteBtn.className = 'delete-btn'
    deleteBtn.textContent = t('button.delete')
    deleteBtn.addEventListener('click', () => this.deleteTask(task.id))
    
    li.appendChild(content)
    li.appendChild(deleteBtn)
    return li
  }

  /**
   * Renders the task list and statistics in the DOM.
   */
  render() {
    const taskList = document.getElementById('tasks')
    if (!taskList) return

    let filteredTasks = this.tasks
    if (this.filter === 'active') {
      filteredTasks = this.tasks.filter(t => !t.completed)
    } else if (this.filter === 'completed') {
      filteredTasks = this.tasks.filter(t => t.completed)
    }

    taskList.innerHTML = ''
    
    filteredTasks.forEach(task => {
      const li = this.createTaskElement(task)
      taskList.appendChild(li)
    })

    this.updateStats()
  }

  private updateStats() {
    const totalCount = document.getElementById('total-count')
    const completedCount = document.getElementById('completed-count')
    
    if (totalCount) totalCount.textContent = String(this.tasks.length)
    if (completedCount) {
      completedCount.textContent = String(this.tasks.filter(t => t.completed).length)
    }
  }

  private saveToStorage() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks))
  }

  private loadFromStorage() {
    const stored = localStorage.getItem('tasks')
    if (stored) {
      this.tasks = JSON.parse(stored)
      this.nextId = Math.max(...this.tasks.map(t => t.id), 0) + 1
    }
  }

  getTasks() {
    return this.tasks
  }

  getCompletedCount() {
    return this.tasks.filter(t => t.completed).length
  }
}
