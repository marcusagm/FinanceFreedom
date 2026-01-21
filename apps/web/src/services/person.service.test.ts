import { vi, describe, it, expect, beforeEach } from "vitest";
import { personService } from "./person.service";
import { api } from "../lib/api";

vi.mock("../lib/api", () => ({
    api: {
        get: vi.fn(),
        post: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
    },
}));

describe("personService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("findAll calls api.get", async () => {
        (api.get as any).mockResolvedValue({ data: [] });
        await personService.findAll();
        expect(api.get).toHaveBeenCalledWith("/people");
    });

    it("create calls api.post", async () => {
        const dto = { name: "John" };
        (api.post as any).mockResolvedValue({ data: {} });
        await personService.create(dto);
        expect(api.post).toHaveBeenCalledWith("/people", dto);
    });

    it("update calls api.patch", async () => {
        const dto = { name: "John" };
        (api.patch as any).mockResolvedValue({ data: {} });
        await personService.update("1", dto);
        expect(api.patch).toHaveBeenCalledWith("/people/1", dto);
    });

    it("remove calls api.delete", async () => {
        (api.delete as any).mockResolvedValue({ data: {} });
        await personService.remove("1");
        expect(api.delete).toHaveBeenCalledWith("/people/1");
    });
});
