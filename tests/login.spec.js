const { test, expect } = require('@playwright/test');

test('Debe abrir la aplicación', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Verifica que la página cargue
  await expect(page).toHaveTitle(/.*/);
});