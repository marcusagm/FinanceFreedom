import { test, expect } from "@playwright/test";

test.describe("Debts CRUD", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/debts");
    });

    test("should create, list, edit and delete a debt", async ({ page }) => {
        const debtName = `Divida-${Date.now()}`;

        // --- CREATE ---
        await page.getByRole("button", { name: "Nova Dívida" }).click();

        await expect(
            page.getByRole("heading", { name: "Nova Dívida" })
        ).toBeVisible();

        await page.getByLabel("Nome da Dívida").fill(debtName);
        await page.getByLabel("Saldo Devedor").fill("1000"); // R$ 1.000,00
        await page.getByLabel("Juros Mensal (%)").fill("2.5");
        await page.getByLabel("Pagamento Mínimo").fill("100"); // R$ 100,00
        await page.getByLabel("Dia Vencimento").fill("15");

        await page.getByRole("button", { name: "Salvar" }).click();

        // Verify creation
        const card = page
            .locator(".group")
            .filter({ hasText: debtName })
            .last();
        await expect(card).toBeVisible();
        // await expect(card.getByText(/R\$\s*1\.000,00/)).toBeVisible();

        // --- EDIT ---
        // Need to find the specific debt card. In Debts cards list.
        // const card = ... already defined above.
        // DebtCard buttons: Delay, Prepayment, Edit, Delete.
        // We want 'Editar'.
        await card.hover(); // Actions are hidden until hover
        await card.locator('button[title="Editar"]').click();

        // Wait, verifying if it opens dialog:
        await expect(
            page.getByRole("heading", { name: "Editar Dívida" })
        ).toBeVisible();

        const newDebtName = `${debtName}-Edited`;
        await page.getByLabel("Nome da Dívida").fill(newDebtName);
        await page.getByLabel("Saldo Devedor").fill("1500"); // R$ 1.500,00

        await page.getByRole("button", { name: "Salvar" }).click();

        // Verify update
        await expect(page.getByText(newDebtName)).toBeVisible();
        // await expect(page.getByText(/R\$\s*1\.500,00/)).toBeVisible();
        await expect(
            page.getByText(debtName, { exact: true })
        ).not.toBeVisible();

        // --- DELETE ---
        const editedCard = page
            .locator(".group")
            .filter({ hasText: newDebtName })
            .last();
        // Delete button title="Excluir"
        await editedCard.hover(); // Actions are hidden until hover
        await editedCard.locator('button[title="Excluir"]').click();

        // Confirm Delete
        await expect(
            page.getByRole("heading", { name: "Excluir Dívida" })
        ).toBeVisible();
        await page.getByRole("button", { name: "Excluir" }).click();

        await expect(
            page.getByRole("heading", { name: "Excluir Dívida" })
        ).not.toBeVisible();
        await expect(page.getByText(newDebtName)).not.toBeVisible();
    });
});
