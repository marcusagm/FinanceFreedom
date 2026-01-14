interface InstallmentParams {
    installmentsTotal: number;
    installmentsPaid: number;
    firstInstallmentDate?: string | Date;
    dueDay: number;
}

export interface Installment {
    number: number;
    status: "PAID" | "PENDING";
    dueDate: Date;
}

export function generateInstallments({
    installmentsTotal,
    installmentsPaid,
    firstInstallmentDate,
    dueDay,
}: InstallmentParams): Installment[] {
    const installments: Installment[] = [];
    let currentDate: Date;

    if (firstInstallmentDate) {
        currentDate = new Date(firstInstallmentDate);
    } else {
        const now = new Date();
        currentDate = new Date();
        currentDate.setDate(dueDay);
        // If today is past the due day, assume next month (heuristic, but firstInstallmentDate is preferred)
        if (currentDate < now) {
            currentDate.setMonth(currentDate.getMonth() + 1);
        }
    }

    // Clone to iterate
    const iterDate = new Date(currentDate);

    for (let i = 1; i <= installmentsTotal; i++) {
        let date: Date;

        if (i === 1) {
            date = new Date(iterDate);
        } else {
            // Logic: Month + (i-1)
            const nextMonthDate = new Date(iterDate);
            nextMonthDate.setMonth(nextMonthDate.getMonth() + (i - 1));
            // Ensure day is correct (e.g. going from Jan 31 to Feb)
            // But here we rely on the dueDay generally being consistent,
            // though standard JS Date behavior handles rollover.
            // A more robust approach might be setting the date explicitly to dueDay if possible
            // but for simplicity we stick to the modal's logic for now.
            // Actually, let's stick to the modal logic exactly:
            nextMonthDate.setDate(dueDay);
            date = nextMonthDate;
        }

        installments.push({
            number: i,
            status: i <= installmentsPaid ? "PAID" : "PENDING",
            dueDate: date,
        });
    }
    return installments;
}
