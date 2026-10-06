import { expect, test, type Page } from '@playwright/test'

// ?perf=high: o headless não tem GPU e cairia no modo leve, que pula boa parte das animações
async function open(page: Page) {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  await page.goto('/?perf=high')
  await expect(page.locator('.loader')).toHaveCount(0, { timeout: 15_000 })
  return errors
}

test('carrega sem erros e com o título da página', async ({ page }) => {
  const errors = await open(page)
  await expect(page.getByRole('heading', { level: 1, name: 'Grand Theft Auto VI' })).toBeAttached()
  await expect(page.locator('#trailers')).toBeAttached()
  await expect(page.locator('footer')).toBeAttached()
  expect(errors).toEqual([])
})

test('nenhuma seção estoura a largura da tela', async ({ page }) => {
  await open(page)
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  expect(overflow).toBeLessThanOrEqual(1)
})

test('abre e fecha o trailer', async ({ page }) => {
  await open(page)
  const card = page.locator('.tcard').nth(1)
  await card.evaluate((el) => el.scrollIntoView({ block: 'center' }))
  await expect(card).toBeVisible()
  // espera a revelação do card (clip-path) terminar
  await expect(card).not.toHaveAttribute('style', /inset\(0% 0% 100%/, { timeout: 5_000 })
  await card.click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await expect(dialog.locator('iframe')).toHaveAttribute('src', /youtube-nocookie\.com\/embed\//)
  await page.keyboard.press('Escape')
  await expect(dialog).toHaveCount(0)
})

test('menu abre, navega para uma seção e fecha', async ({ page }) => {
  await open(page)
  await page.getByRole('button', { name: 'Abrir menu de navegação' }).click()
  const menu = page.getByRole('dialog', { name: 'Menu de navegação' })
  await expect(menu).toBeVisible()
  await menu.getByRole('button', { name: 'Ultimate Edition' }).click()
  await expect(menu).toHaveCount(0)
  await expect.poll(() => page.evaluate(() => document.getElementById('edicoes')!.getBoundingClientRect().top), { timeout: 5_000 }).toBeLessThan(200)
})
