import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";
import { Alert, AlertDescription, AlertTitle } from "./Alert";

describe("Alert", () => {
    it("renders alert with title and description", () => {
        render(
            <Alert>
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>Something went wrong</AlertDescription>
            </Alert>,
        );
        expect(screen.getByText("Warning")).toBeInTheDocument();
        expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    });

    it("applies variant classes", () => {
        render(
            <Alert variant="destructive" data-testid="alert">
                Error
            </Alert>,
        );
        expect(screen.getByTestId("alert")).toHaveClass("border-destructive/50");
    });
});
