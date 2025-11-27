import { test, expect } from '@playwright/test'

test.describe('Kanban Board E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
    await page.waitForLoadState('networkidle')
  })

  test('should display the kanban board with all three columns', async ({ page }) => {
    // Check main title
    await expect(page.locator('h1')).toContainText('Kanban Board')

    // Check column headers (h2 tags)
    const todoColumn = page.locator('h2').filter({ hasText: 'To Do' }).first()
    const inProgressColumn = page.locator('h2').filter({ hasText: 'In Progress' }).first()
    const doneColumn = page.locator('h2').filter({ hasText: 'Done' }).first()

    await expect(todoColumn).toBeVisible()
    await expect(inProgressColumn).toBeVisible()
    await expect(doneColumn).toBeVisible()
  })

  test('should have a New Task button', async ({ page }) => {
    const newTaskButton = page.locator('button').filter({ hasText: 'New Task' })
    await expect(newTaskButton).toBeVisible()
  })

  test('should open form when clicking New Task', async ({ page }) => {
    const newTaskButton = page.locator('button').filter({ hasText: 'New Task' })
    await newTaskButton.click()

    const titleInput = page.locator('input[placeholder="Enter task title"]')
    await expect(titleInput).toBeVisible()
  })

  test('should add a new task successfully', async ({ page }) => {
    // Click New Task button
    const newTaskButton = page.locator('button').filter({ hasText: 'New Task' }).first()
    await newTaskButton.click()

    // Fill form
    await page.locator('input[placeholder="Enter task title"]').fill('My First Task')
    await page.locator('textarea[placeholder*="description"]').fill('Task description')

    // Save
    const saveButton = page.locator('button').filter({ hasText: /^Save$/ }).first()
    await saveButton.click()

    // Verify task appears
    await expect(page.locator('text=My First Task').first()).toBeVisible({ timeout: 5000 })
  })

  test('should validate that title is required', async ({ page }) => {
    const newTaskButton = page.locator('button').filter({ hasText: 'New Task' }).first()
    await newTaskButton.click()

    const saveButton = page.locator('button').filter({ hasText: /^Save$/ }).first()
    await saveButton.click()

    await expect(page.locator('text=Title is required')).toBeVisible()
  })

  test('should close form when clicking cancel', async ({ page }) => {
    const newTaskButton = page.locator('button').filter({ hasText: 'New Task' }).first()
    await newTaskButton.click()

    const titleInput = page.locator('input[placeholder="Enter task title"]')
    await expect(titleInput).toBeVisible()

    const cancelButton = page.locator('button').filter({ hasText: /^Cancel$/ }).first()
    await cancelButton.click()

    await expect(titleInput).not.toBeVisible()
  })

  test('should delete a task', async ({ page }) => {
    // Add task
    const newTaskButton = page.locator('button').filter({ hasText: 'New Task' }).first()
    await newTaskButton.click()
    await page.locator('input[placeholder="Enter task title"]').fill('Task to Delete')
    const saveButton = page.locator('button').filter({ hasText: /^Save$/ }).first()
    await saveButton.click()

    // Wait for task to appear
    await expect(page.locator('text=Task to Delete').first()).toBeVisible({ timeout: 5000 })

    // Get the task card and find delete button (first button with trash icon or role)
    const taskText = page.locator('text=Task to Delete').first()
    const taskCard = taskText.locator('../..')
    const deleteBtn = taskCard.locator('button').first()
    await deleteBtn.click()

    // Wait for deletion to complete
    await page.waitForTimeout(300)

    // Verify task is deleted
    await expect(page.locator('text=Task to Delete').first()).not.toBeVisible({ timeout: 5000 })
  })

  test('should edit a task', async ({ page }) => {
    // Create task
    const newTaskButton = page.locator('button').filter({ hasText: 'New Task' }).first()
    await newTaskButton.click()
    await page.locator('input[placeholder="Enter task title"]').fill('Original Title')
    const saveBtn = page.locator('button').filter({ hasText: /^Save$/ }).first()
    await saveBtn.click()

    // Wait for task
    await expect(page.locator('text=Original Title').first()).toBeVisible({ timeout: 5000 })

    // Find and click Edit button in the task card
    const taskCardDiv = page.locator('div').filter({ hasText: 'Original Title' }).first()
    const editBtn = taskCardDiv.getByText('Edit')
    await editBtn.click()

    // Edit the title
    const titleInput = page.locator('input[placeholder="Enter task title"]')
    await titleInput.clear()
    await titleInput.fill('Updated Title')

    // Save
    const saveBtnForm = page.locator('button').filter({ hasText: /^Save$/ }).first()
    await saveBtnForm.click()

    // Verify
    await expect(page.locator('text=Updated Title').first()).toBeVisible({ timeout: 5000 })
    await expect(page.locator('text=Original Title').first()).not.toBeVisible()
  })

  test('should move task between columns', async ({ page }) => {
    // Create task in Todo
    const newTaskButton = page.locator('button').filter({ hasText: 'New Task' }).first()
    await newTaskButton.click()
    await page.locator('input[placeholder="Enter task title"]').fill('Moving Task')
    const statusSelect = page.locator('select')
    await statusSelect.selectOption('todo')
    const saveBtn = page.locator('button').filter({ hasText: /^Save$/ }).first()
    await saveBtn.click()

    // Wait for task
    await expect(page.locator('text=Moving Task').first()).toBeVisible({ timeout: 5000 })

    // Find task card and click move button
    const taskCard = page.locator('div').filter({ hasText: 'Moving Task' }).first()
    const buttons = taskCard.locator('button')
    const moveBtn = buttons.last()
    await moveBtn.click()

    await page.waitForTimeout(500)

    // Verify it moved to In Progress column
    const inProgressSection = page.locator('h2').filter({ hasText: 'In Progress' }).first().locator('../..')
    await expect(inProgressSection.locator('text=Moving Task').first()).toBeVisible({ timeout: 5000 })
  })

  test('should persist data in localStorage', async ({ page }) => {
    // Add task
    const newTaskButton = page.locator('button').filter({ hasText: 'New Task' }).first()
    await newTaskButton.click()
    await page.locator('input[placeholder="Enter task title"]').fill('Persistent Task')
    const saveBtn = page.locator('button').filter({ hasText: /^Save$/ }).first()
    await saveBtn.click()

    await expect(page.locator('text=Persistent Task').first()).toBeVisible({ timeout: 5000 })

    // Reload page
    await page.reload()
    await page.waitForLoadState('networkidle')

    // Task should still be there
    await expect(page.locator('text=Persistent Task').first()).toBeVisible({ timeout: 5000 })
  })

  test('should display task count in column header', async ({ page }) => {
    // Add first task
    let newTaskButton = page.locator('button').filter({ hasText: 'New Task' }).first()
    await newTaskButton.click()
    await page.locator('input[placeholder="Enter task title"]').fill('Task 1')
    let saveBtn = page.locator('button').filter({ hasText: /^Save$/ }).first()
    await saveBtn.click()

    // Add second task
    await new Promise(r => setTimeout(r, 500))
    newTaskButton = page.locator('button').filter({ hasText: 'New Task' }).first()
    await newTaskButton.click()
    await page.locator('input[placeholder="Enter task title"]').fill('Task 2')
    saveBtn = page.locator('button').filter({ hasText: /^Save$/ }).first()
    await saveBtn.click()

    await new Promise(r => setTimeout(r, 500))

    // Check task count is displayed in To Do header
    const todoHeader = page.locator('h2').filter({ hasText: 'To Do' }).first().locator('..')
    await expect(todoHeader.locator('text=2 task')).toBeVisible({ timeout: 5000 })
  })

  test('should show empty state message in empty columns', async ({ page }) => {
    const inProgressHeader = page.locator('h2').filter({ hasText: 'In Progress' }).first()
    const inProgressSection = inProgressHeader.locator('../..')
    await expect(inProgressSection.locator('text=No tasks yet')).toBeVisible()
  })

  test('should handle multiple tasks across columns', async ({ page }) => {
    // Create task in To Do
    let newTaskButton = page.locator('button').filter({ hasText: 'New Task' }).first()
    await newTaskButton.click()
    await page.locator('input[placeholder="Enter task title"]').fill('Task A')
    await page.locator('select').selectOption('todo')
    let saveBtn = page.locator('button').filter({ hasText: /^Save$/ }).first()
    await saveBtn.click()

    // Create task in In Progress
    await new Promise(r => setTimeout(r, 300))
    newTaskButton = page.locator('button').filter({ hasText: 'New Task' }).first()
    await newTaskButton.click()
    await page.locator('input[placeholder="Enter task title"]').fill('Task B')
    await page.locator('select').selectOption('inprogress')
    saveBtn = page.locator('button').filter({ hasText: /^Save$/ }).first()
    await saveBtn.click()

    // Create task in Done
    await new Promise(r => setTimeout(r, 300))
    newTaskButton = page.locator('button').filter({ hasText: 'New Task' }).first()
    await newTaskButton.click()
    await page.locator('input[placeholder="Enter task title"]').fill('Task C')
    await page.locator('select').selectOption('done')
    saveBtn = page.locator('button').filter({ hasText: /^Save$/ }).first()
    await saveBtn.click()

    // Verify all visible
    await expect(page.locator('text=Task A').first()).toBeVisible({ timeout: 5000 })
    await expect(page.locator('text=Task B').first()).toBeVisible({ timeout: 5000 })
    await expect(page.locator('text=Task C').first()).toBeVisible({ timeout: 5000 })
  })

  test('should add task with empty description', async ({ page }) => {
    const newTaskButton = page.locator('button').filter({ hasText: 'New Task' }).first()
    await newTaskButton.click()

    await page.locator('input[placeholder="Enter task title"]').fill('Task without description')
    // Leave description empty
    const saveBtn = page.locator('button').filter({ hasText: /^Save$/ }).first()
    await saveBtn.click()

    await expect(page.locator('text=Task without description').first()).toBeVisible({ timeout: 5000 })
  })

  test('should display UI elements correctly', async ({ page }) => {
    // Check header is present
    await expect(page.locator('h1').filter({ hasText: 'Kanban Board' })).toBeVisible()
    
    // Check subtitle
    await expect(page.locator('p').filter({ hasText: 'Organize your tasks with ease' })).toBeVisible()
    
    // Check three columns are present
    const columns = page.locator('h2')
    expect(await columns.count()).toBeGreaterThanOrEqual(3)
  })
})
