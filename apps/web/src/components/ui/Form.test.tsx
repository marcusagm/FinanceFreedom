import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useForm } from "react-hook-form";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "./Form";
import { Input } from "./Input";

const TestForm = () => {
    const form = useForm({
        defaultValues: {
            username: "",
        },
    });

    return (
        <Form {...form}>
            <form>
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input placeholder="shadcn" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    );
};

describe("Form", () => {
    it("renders form fields correctly", () => {
        render(<TestForm />);
        expect(screen.getByText("Username")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("shadcn")).toBeInTheDocument();
    });
});
