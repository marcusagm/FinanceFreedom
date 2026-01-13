import { test, expect } from "@playwright/test";

test.describe("Transaction CRUD", () => {
    test.beforeEach(async ({ page }) => {
        // Create an account first
        await page.goto("/accounts");
        await page.getByRole("button", { name: "+ Nova Conta" }).click();
        await page.getByLabel("Nome da Conta").fill("Conta Teste");
        await page.getByLabel("Saldo Atual").fill("100000"); // R$ 1000,00
        await page.getByRole("button", { name: "Criar Conta" }).click();

        await page.goto("/transactions");
    });

    test("should create, list, edit and delete a transaction", async ({
        page,
    }) => {
        const description = `Tx-${Date.now()}`;

        // --- CREATE ---
        await page.getByRole("button", { name: "Nova Transação" }).click();

        // Fill Description
        await page.getByLabel("Descrição").fill(description);

        // Fill Amount
        // Using placeholder for robust selection with currency input
        await page.getByPlaceholder("R$ 0,00").fill("10000"); // 100.00

        // Select Account
        // Auto-selected to first account ("Conta Teste")
        await expect(
            page.getByRole("button", { name: "Conta Teste" })
        ).toBeVisible();

        await page.getByRole("button", { name: "Salvar" }).click();

        // Verify creation
        await expect(page.getByText(description)).toBeVisible();

        // --- EDIT ---
        // Find row by text and click edit. Using a more specific locator strategy
        // Assuming the row contains the description.
        const row = page
            .locator("div, tr")
            .filter({ hasText: description })
            .last();
        // Use specific 'Editar' button
        await row.getByRole("button", { name: "Editar" }).click();

        // Wait for dialog to be in Edit mode
        await expect(
            page.getByRole("heading", { name: "Editar Transação" })
        ).toBeVisible();

        const newDescription = `${description}-Edited`;
        await page.getByLabel("Descrição").fill(newDescription);
        await page.getByRole("button", { name: "Salvar" }).click();

        // Wait for dialog to close
        await expect(
            page.getByRole("heading", { name: "Editar Transação" })
        ).not.toBeVisible();

        // Reload to verify backend persistence (and avoid FE state issues causing flake)
        await page.reload();

        await expect(page.getByText(newDescription)).toBeVisible();
        await expect(
            page.getByText(description, { exact: true })
        ).not.toBeVisible();

        // --- DELETE ---
        // Deletion usually requires opening a dialog or clicking a trash icon.
        // Let's locate the new row
        const editRow = page
            .locator("div, tr")
            .filter({ hasText: newDescription })
            .last();

        // Let's try to find a button with a trash icon (Title: Excluir).
        await editRow.getByRole("button", { name: "Excluir" }).click();

        // Confirm deletion in dialog
        await expect(
            page.getByRole("heading", { name: "Excluir Transação" })
        ).toBeVisible();
        await page.getByRole("button", { name: "Excluir" }).click();

        // Wait for dialog to close
        await expect(
            page.getByRole("heading", { name: "Excluir Transação" })
        ).not.toBeVisible();

        await expect(page.getByText(newDescription)).not.toBeVisible();
    });
});
