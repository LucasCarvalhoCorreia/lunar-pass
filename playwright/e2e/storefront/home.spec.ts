import { test, expect } from '../../support'

test('deve exibir o slogan na aba do navegador', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle("Lunar Pass — Passagens para a Lua");
});

test('deve exibir o slogan na homepage', async ({ page }) => {
  await page.goto('/');

  const slogan = page.getByRole('heading', { name: 'Sua viagem para a lua começa aqui.' });
  await expect(slogan).toBeVisible();
});