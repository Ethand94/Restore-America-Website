import { beforeEach, describe, expect, it, vi } from "vitest";

const { createLeadMock, getDbMock, getLeadsMock } = vi.hoisted(() => ({
  createLeadMock: vi.fn(),
  getDbMock: vi.fn(),
  getLeadsMock: vi.fn(),
}));

vi.mock("./db", () => ({
  createLead: createLeadMock,
  getDb: getDbMock,
  getLeads: getLeadsMock,
}));

import { listStoredLeads, submitLeadIntake } from "./intake";

describe("submitLeadIntake", () => {
  beforeEach(() => {
    createLeadMock.mockReset();
    getDbMock.mockReset();
    getLeadsMock.mockReset();
    Reflect.deleteProperty(globalThis, "__E3C_GRID_LEADS_BY_ORG__");
    Reflect.deleteProperty(globalThis, "__E3C_GRID_LEAD_ID__");
  });

  it("normalizes first and last name, email, and contact consent from the intake payload", async () => {
    createLeadMock.mockRejectedValue(new Error("db unavailable"));
    getDbMock.mockResolvedValue(null);

    const result = await submitLeadIntake(
      {
        firstName: "Jane",
        lastName: "Doe",
        phone: "5551112222",
        email: "jane@example.com",
        propertyAddress: "123 Main St",
        consentToEmail: true,
        consentToText: false,
        consentToAiContact: true,
      },
      "test-org"
    );

    expect(result.success).toBe(true);
    if (!result.success) {
      return;
    }

    expect(result.lead.fullName).toBe("Jane Doe");
    expect(result.lead.firstName).toBe("Jane");
    expect(result.lead.lastName).toBe("Doe");
    expect(result.lead.email).toBe("jane@example.com");
    expect(result.lead.contactConsent).toEqual({
      email: true,
      text: false,
      aiAgent: true,
    });

    const storedLeads = await listStoredLeads("test-org");
    expect(storedLeads).toHaveLength(1);
    expect(storedLeads[0]?.contactConsent).toEqual({
      email: true,
      text: false,
      aiAgent: true,
    });
  });

  it("restores stored contact consent from serialized lead notes", async () => {
    getDbMock.mockResolvedValue({});
    getLeadsMock.mockResolvedValue([
      {
        id: 7,
        name: "Jane Doe",
        phone: "5551112222",
        email: "jane@example.com",
        address: "123 Main St",
        damageType: "hail",
        isOwner: true,
        claimStatus: "open",
        source: "website",
        notes:
          '[organizationId:test-org]\n[contactConsent:{"email":true,"text":true,"aiAgent":false}]\nRequested email follow-up',
        createdAt: new Date("2026-03-20T10:00:00.000Z"),
      },
    ]);

    const storedLeads = await listStoredLeads("test-org");

    expect(storedLeads).toHaveLength(1);
    expect(storedLeads[0]?.organizationId).toBe("test-org");
    expect(storedLeads[0]?.message).toBe("Requested email follow-up");
    expect(storedLeads[0]?.contactConsent).toEqual({
      email: true,
      text: true,
      aiAgent: false,
    });
  });
});
