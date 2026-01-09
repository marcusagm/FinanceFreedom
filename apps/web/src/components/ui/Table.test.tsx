import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
    TableCaption,
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
            </Table>
        );

        expect(screen.getByText("A list of invoices")).toBeInTheDocument();
        expect(screen.getByText("Invoice")).toBeInTheDocument();
        expect(screen.getByText("INV001")).toBeInTheDocument();
    });
});
