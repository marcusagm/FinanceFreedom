import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./Table";

describe("Table", () => {
    it("renders table structure", () => {
        render(
            <Table>
                <TableCaption>A list of invoices</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Invoice</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell>INV001</TableCell>
                    </TableRow>
                </TableBody>
            </Table>,
        );

        expect(screen.getByText("A list of invoices")).toBeInTheDocument();
        expect(screen.getByText("Invoice")).toBeInTheDocument();
        expect(screen.getByText("INV001")).toBeInTheDocument();
    });
});
