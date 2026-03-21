import type { Request, Response } from "express";
import type { InsertLead } from "../drizzle/schema";
import { createLead, getDb, getLeads } from "./db";

type JsonObject = Record<string, unknown>;
type ContactConsent = {
  email?: boolean;
  text?: boolean;
  aiAgent?: boolean;
};

type DamageType = "hail" | "wind" | "fire" | "flood" | "tree" | "roof" | "other";
type ClaimStatus = "not_filed" | "open" | "denied" | "paid";
type LeadSource = "website" | "facebook" | "google" | "referral" | "storm_canvass" | "other";

export type NormalizedIntakeLead = {
  organizationId: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  contactConsent?: ContactConsent;
  propertyAddress?: string;
  damageType?: string;
  interest?: string;
  propertyOwner?: string;
  insuranceClaimStatus?: string;
  source?: string;
  message?: string;
  formAnswers?: JsonObject;
  customFields: JsonObject;
  rawSubmission: unknown;
};

export type IntakeLeadRecord = NormalizedIntakeLead & {
  id: number;
  createdAt: string;
  crmLeadId?: number;
};

type IntakeSubmissionResult =
  | { success: true; lead: IntakeLeadRecord }
  | { success: false; error: string };

declare global {
  // eslint-disable-next-line no-var
  var __E3C_GRID_LEADS_BY_ORG__: Record<string, IntakeLeadRecord[]> | undefined;
  // eslint-disable-next-line no-var
  var __E3C_GRID_LEAD_ID__: number | undefined;
}

const KNOWN_INTAKE_KEYS = new Set([
  "organizationId",
  "orgId",
  "fullName",
  "firstName",
  "lastName",
  "name",
  "phone",
  "email",
  "contactConsent",
  "consentToEmail",
  "consentToText",
  "consentToAiContact",
  "consentToAiAgent",
  "propertyAddress",
  "address",
  "damageType",
  "interest",
  "propertyOwner",
  "isOwner",
  "insuranceClaimStatus",
  "claimStatus",
  "source",
  "message",
  "notes",
  "details",
  "formAnswers",
]);

function isJsonObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseRawSubmission(input: unknown): JsonObject {
  if (isJsonObject(input)) {
    return input;
  }

  if (typeof input === "string") {
    const trimmed = input.trim();
    if (!trimmed) {
      return {};
    }

    try {
      const parsed = JSON.parse(trimmed);
      return isJsonObject(parsed) ? parsed : {};
    } catch {
      return {};
    }
  }

  return {};
}

function asString(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

function asRequestString(value: unknown): string | undefined {
  if (Array.isArray(value)) {
    return asString(value[0]);
  }

  return asString(value);
}

function asBoolean(value: unknown): boolean | undefined {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    if (Number.isNaN(value)) {
      return undefined;
    }
    return value !== 0;
  }

  const normalized = asRequestString(value)?.toLowerCase();
  if (!normalized) {
    return undefined;
  }

  if (["true", "1", "yes", "y", "on", "checked"].includes(normalized)) {
    return true;
  }

  if (["false", "0", "no", "n", "off", "unchecked"].includes(normalized)) {
    return false;
  }

  return undefined;
}

function normalizeOrganizationId(value: unknown): string | undefined {
  const rawValue = asRequestString(value);
  if (!rawValue) {
    return undefined;
  }

  return rawValue.replace(/\s+/g, "-");
}

function extractOrganizationIdFromPath(requestPath?: string): string | undefined {
  const normalizedPath = asString(requestPath);
  if (!normalizedPath) {
    return undefined;
  }

  const match = normalizedPath.match(/\/api\/(?:intake|leads)\/([^/?#]+)/);
  return normalizeOrganizationId(match?.[1]);
}

function getDefaultOrganizationId(): string {
  return (
    normalizeOrganizationId(process.env.DEFAULT_ORGANIZATION_ID) ??
    normalizeOrganizationId(process.env.VITE_ORGANIZATION_ID) ??
    "default"
  );
}

function resolveOrganizationId(input: {
  requestPath?: string;
  paramsOrganizationId?: unknown;
  queryOrganizationId?: unknown;
  queryOrgId?: unknown;
  headerOrganizationId?: unknown;
  headerOrgId?: unknown;
  payload?: JsonObject;
}): string {
  return (
    extractOrganizationIdFromPath(input.requestPath) ??
    normalizeOrganizationId(input.paramsOrganizationId) ??
    normalizeOrganizationId(input.queryOrganizationId) ??
    normalizeOrganizationId(input.queryOrgId) ??
    normalizeOrganizationId(input.headerOrganizationId) ??
    normalizeOrganizationId(input.headerOrgId) ??
    normalizeOrganizationId(input.payload?.organizationId) ??
    normalizeOrganizationId(input.payload?.orgId) ??
    getDefaultOrganizationId()
  );
}

function pickFirstString(source: JsonObject, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = asString(source[key]);
    if (value) {
      return value;
    }
  }
  return undefined;
}

function splitName(fullName: string): { firstName?: string; lastName?: string } {
  const parts = fullName.split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return {};
  }
  if (parts.length === 1) {
    return { firstName: parts[0] };
  }
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  };
}

function normalizePropertyOwner(rawValue: unknown): string | undefined {
  if (typeof rawValue === "boolean") {
    return rawValue ? "Yes" : "No";
  }

  return asString(rawValue);
}

function normalizeClaimStatus(rawValue: unknown): string | undefined {
  if (typeof rawValue === "boolean") {
    return rawValue ? "Yes" : "No";
  }

  return asString(rawValue);
}

function normalizeContactConsent(payload: JsonObject): ContactConsent | undefined {
  const nestedConsent = isJsonObject(payload.contactConsent) ? payload.contactConsent : undefined;
  const email = asBoolean(nestedConsent?.email ?? payload.consentToEmail);
  const text = asBoolean(nestedConsent?.text ?? payload.consentToText);
  const aiAgent = asBoolean(
    nestedConsent?.aiAgent ??
      nestedConsent?.aiContact ??
      payload.consentToAiContact ??
      payload.consentToAiAgent
  );

  if (email === undefined && text === undefined && aiAgent === undefined) {
    return undefined;
  }

  const contactConsent: ContactConsent = {};
  if (email !== undefined) {
    contactConsent.email = email;
  }
  if (text !== undefined) {
    contactConsent.text = text;
  }
  if (aiAgent !== undefined) {
    contactConsent.aiAgent = aiAgent;
  }

  return contactConsent;
}

function extractCustomFields(payload: JsonObject): JsonObject {
  const customFields: JsonObject = {};

  for (const [key, value] of Object.entries(payload)) {
    if (!KNOWN_INTAKE_KEYS.has(key)) {
      customFields[key] = value;
    }
  }

  return customFields;
}

function normalizePayload(input: unknown, organizationId: string): IntakeSubmissionResult {
  const payload = parseRawSubmission(input);

  let fullName = pickFirstString(payload, ["fullName", "name"]);
  let firstName = pickFirstString(payload, ["firstName"]);
  let lastName = pickFirstString(payload, ["lastName"]);

  if (!firstName && fullName) {
    const split = splitName(fullName);
    firstName = split.firstName;
    if (!lastName) {
      lastName = split.lastName;
    }
  }

  if (!fullName && (firstName || lastName)) {
    fullName = [firstName, lastName].filter(Boolean).join(" ") || undefined;
  }

  const phone = pickFirstString(payload, ["phone"]);
  const email = pickFirstString(payload, ["email"]);

  if (!firstName && !fullName) {
    return {
      success: false,
      error: "Contact name is required (firstName or fullName).",
    };
  }

  if (!phone && !email) {
    return {
      success: false,
      error: "At least one contact method is required (phone or email).",
    };
  }

  const message = pickFirstString(payload, ["message", "notes", "details"]);
  const damageType = pickFirstString(payload, ["damageType"]);
  const interest = pickFirstString(payload, ["interest"]) ?? damageType;
  const propertyAddress = pickFirstString(payload, ["propertyAddress", "address"]);
  const source = pickFirstString(payload, ["source"]);
  const propertyOwner = normalizePropertyOwner(payload.propertyOwner ?? payload.isOwner);
  const insuranceClaimStatus = normalizeClaimStatus(
    payload.insuranceClaimStatus ?? payload.claimStatus
  );
  const contactConsent = normalizeContactConsent(payload);
  const formAnswers = isJsonObject(payload.formAnswers)
    ? payload.formAnswers
    : undefined;

  const normalizedLead: IntakeLeadRecord = {
    id: nextLeadId(),
    createdAt: new Date().toISOString(),
    organizationId,
    fullName,
    firstName,
    lastName,
    phone,
    email,
    contactConsent,
    propertyAddress,
    damageType,
    interest,
    propertyOwner,
    insuranceClaimStatus,
    source,
    message,
    formAnswers,
    customFields: extractCustomFields(payload),
    rawSubmission: payload,
  };

  return {
    success: true,
    lead: normalizedLead,
  };
}

function getMemoryLeadStore(): Record<string, IntakeLeadRecord[]> {
  if (!globalThis.__E3C_GRID_LEADS_BY_ORG__) {
    globalThis.__E3C_GRID_LEADS_BY_ORG__ = {};
  }

  return globalThis.__E3C_GRID_LEADS_BY_ORG__;
}

function getMemoryLeads(organizationId: string): IntakeLeadRecord[] {
  const store = getMemoryLeadStore();
  if (!store[organizationId]) {
    store[organizationId] = [];
  }

  return store[organizationId];
}

function nextLeadId(): number {
  if (!globalThis.__E3C_GRID_LEAD_ID__) {
    globalThis.__E3C_GRID_LEAD_ID__ = 1;
    return 1;
  }

  globalThis.__E3C_GRID_LEAD_ID__ += 1;
  return globalThis.__E3C_GRID_LEAD_ID__;
}

function mapDamageType(value?: string): DamageType {
  const normalized = value?.toLowerCase() ?? "";
  if (normalized.includes("hail")) return "hail";
  if (normalized.includes("wind")) return "wind";
  if (normalized.includes("fire")) return "fire";
  if (normalized.includes("flood") || normalized.includes("water")) return "flood";
  if (normalized.includes("tree")) return "tree";
  if (normalized.includes("roof")) return "roof";
  return "other";
}

function mapClaimStatus(value?: string): ClaimStatus {
  const normalized = value?.toLowerCase() ?? "";
  if (normalized.includes("open") || normalized.includes("filed")) return "open";
  if (normalized.includes("denied")) return "denied";
  if (normalized.includes("paid") || normalized.includes("approved")) return "paid";
  return "not_filed";
}

function mapSource(value?: string): LeadSource {
  const normalized = value?.toLowerCase() ?? "";
  if (normalized.includes("facebook")) return "facebook";
  if (normalized.includes("google")) return "google";
  if (normalized.includes("referral")) return "referral";
  if (normalized.includes("storm") || normalized.includes("canvass")) return "storm_canvass";
  if (normalized.includes("website") || normalized.includes("web")) return "website";
  return "other";
}

function mapPropertyOwner(value?: string): boolean | undefined {
  if (!value) {
    return undefined;
  }

  const normalized = value.toLowerCase();
  if (normalized.includes("yes") || normalized.includes("own")) return true;
  if (normalized.includes("no") || normalized.includes("rent") || normalized.includes("manage")) {
    return false;
  }
  return undefined;
}

function serializeLeadNotes(
  organizationId: string,
  message?: string,
  contactConsent?: ContactConsent
): string | undefined {
  const parts = [`[organizationId:${organizationId}]`];
  if (contactConsent && Object.keys(contactConsent).length > 0) {
    parts.push(`[contactConsent:${JSON.stringify(contactConsent)}]`);
  }
  const normalizedMessage = message?.trim();
  if (normalizedMessage) {
    parts.push(normalizedMessage);
  }

  return parts.join("\n");
}

function deserializeLeadNotes(notes?: string | null): {
  organizationId: string;
  message?: string;
  contactConsent?: ContactConsent;
} {
  const normalizedNotes = notes?.trim();
  if (!normalizedNotes) {
    return { organizationId: getDefaultOrganizationId() };
  }

  let organizationId = getDefaultOrganizationId();
  let message = normalizedNotes;
  let contactConsent: ContactConsent | undefined;
  let didParseHeader = true;

  while (didParseHeader) {
    didParseHeader = false;

    const organizationMatch = message.match(/^\[organizationId:([^\]]+)\](?:\n|$)/);
    if (organizationMatch) {
      organizationId =
        normalizeOrganizationId(organizationMatch[1]) ?? getDefaultOrganizationId();
      message = message.slice(organizationMatch[0].length).trimStart();
      didParseHeader = true;
      continue;
    }

    const consentMatch = message.match(/^\[contactConsent:([^\n]+)\](?:\n|$)/);
    if (consentMatch) {
      try {
        const parsedConsent = JSON.parse(consentMatch[1]);
        contactConsent = normalizeContactConsent({ contactConsent: parsedConsent });
      } catch {
        contactConsent = undefined;
      }
      message = message.slice(consentMatch[0].length).trimStart();
      didParseHeader = true;
    }
  }

  return {
    organizationId,
    message: message.trim() || undefined,
    contactConsent,
  };
}

function toDatabaseLead(lead: IntakeLeadRecord): InsertLead {
  const utmSource = asString(lead.customFields.utmSource);
  const utmMedium = asString(lead.customFields.utmMedium);
  const utmCampaign = asString(lead.customFields.utmCampaign);

  return {
    name: lead.fullName ?? [lead.firstName, lead.lastName].filter(Boolean).join(" "),
    phone: lead.phone ?? "N/A",
    email: lead.email,
    address: lead.propertyAddress,
    damageType: mapDamageType(lead.interest ?? lead.damageType),
    isOwner: mapPropertyOwner(lead.propertyOwner),
    claimStatus: mapClaimStatus(lead.insuranceClaimStatus),
    source: mapSource(lead.source),
    notes: serializeLeadNotes(lead.organizationId, lead.message, lead.contactConsent),
    utmSource,
    utmMedium,
    utmCampaign,
  };
}

async function persistLead(lead: IntakeLeadRecord): Promise<IntakeLeadRecord> {
  try {
    const created = await createLead(toDatabaseLead(lead));
    if (created?.id) {
      return {
        ...lead,
        crmLeadId: created.id,
      };
    }
  } catch {
    // Swallow DB errors and keep in-memory behavior for local/testing environments.
  }

  return lead;
}

export async function submitLeadIntake(
  input: unknown,
  organizationId: string
): Promise<IntakeSubmissionResult> {
  const normalized = normalizePayload(input, organizationId);
  if (!normalized.success) {
    return normalized;
  }

  const persisted = await persistLead(normalized.lead);
  getMemoryLeads(organizationId).unshift(persisted);

  return {
    success: true,
    lead: persisted,
  };
}

function mapDbLeadToIntakeRecord(dbLead: Awaited<ReturnType<typeof getLeads>>[number]): IntakeLeadRecord {
  const [firstName, ...lastNameParts] = (dbLead.name ?? "").split(/\s+/).filter(Boolean);
  const parsedNotes = deserializeLeadNotes(dbLead.notes);

  return {
    id: dbLead.id,
    createdAt: dbLead.createdAt?.toISOString?.() ?? new Date().toISOString(),
    organizationId: parsedNotes.organizationId,
    fullName: dbLead.name ?? undefined,
    firstName: firstName || undefined,
    lastName: lastNameParts.join(" ") || undefined,
    phone: dbLead.phone ?? undefined,
    email: dbLead.email ?? undefined,
    contactConsent: parsedNotes.contactConsent,
    propertyAddress: dbLead.address ?? undefined,
    damageType: dbLead.damageType ?? undefined,
    interest: dbLead.damageType ?? undefined,
    propertyOwner: typeof dbLead.isOwner === "boolean" ? (dbLead.isOwner ? "Yes" : "No") : undefined,
    insuranceClaimStatus: dbLead.claimStatus ?? undefined,
    source: dbLead.source ?? undefined,
    message: parsedNotes.message,
    customFields: parsedNotes.contactConsent
      ? { contactConsent: parsedNotes.contactConsent }
      : {},
    rawSubmission: {
      id: dbLead.id,
      organizationId: parsedNotes.organizationId,
      name: dbLead.name,
      phone: dbLead.phone,
      email: dbLead.email,
      contactConsent: parsedNotes.contactConsent,
      address: dbLead.address,
      damageType: dbLead.damageType,
      claimStatus: dbLead.claimStatus,
      source: dbLead.source,
      notes: dbLead.notes,
    },
  };
}

export async function listStoredLeads(organizationId?: string): Promise<IntakeLeadRecord[]> {
  try {
    const db = await getDb();
    if (db) {
      const records = await getLeads({ limit: 200, offset: 0 });
      const mappedRecords = records.map(mapDbLeadToIntakeRecord);
      if (organizationId) {
        return mappedRecords.filter((record) => record.organizationId === organizationId);
      }
      return mappedRecords;
    }
  } catch {
    // Fall through to in-memory store when DB is unavailable.
  }

  if (organizationId) {
    return getMemoryLeads(organizationId);
  }

  return Object.values(getMemoryLeadStore()).flat();
}

function getAllowedOrigins(): string[] {
  const raw = process.env.ALLOWED_ORIGINS;
  if (!raw?.trim()) {
    return ["*"];
  }

  return raw
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function resolveCorsOrigin(requestOrigin: string | undefined): string {
  const allowedOrigins = getAllowedOrigins();
  if (allowedOrigins.includes("*")) {
    return "*";
  }

  if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
    return requestOrigin;
  }

  return allowedOrigins[0] ?? "*";
}

function applyCorsHeaders(req: Request, res: Response, methods: string): void {
  const requestOrigin = asString(req.headers.origin);
  res.setHeader("Access-Control-Allow-Origin", resolveCorsOrigin(requestOrigin));
  res.setHeader("Access-Control-Allow-Methods", methods);
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Vary", "Origin");
}

export async function handleIntakeRequest(req: Request, res: Response): Promise<void> {
  applyCorsHeaders(req, res, "POST, OPTIONS");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    res.status(405).json({ error: "Method not allowed. Use POST." });
    return;
  }

  try {
    const organizationId = resolveOrganizationId({
      requestPath: req.originalUrl || req.url,
      paramsOrganizationId: req.params.organizationId,
      queryOrganizationId: req.query.organizationId,
      queryOrgId: req.query.orgId,
      headerOrganizationId: req.headers["x-organization-id"],
      headerOrgId: req.headers["x-org-id"],
      payload: parseRawSubmission(req.body),
    });
    const result = await submitLeadIntake(req.body, organizationId);

    if (!result.success) {
      res.status(400).json({ error: result.error });
      return;
    }

    res.status(201).json({ success: true, organizationId, lead: result.lead });
  } catch {
    res.status(500).json({ error: "Failed to submit intake payload." });
  }
}

export async function handleLeadsRequest(req: Request, res: Response): Promise<void> {
  applyCorsHeaders(req, res, "GET, OPTIONS");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET, OPTIONS");
    res.status(405).json({ error: "Method not allowed. Use GET." });
    return;
  }

  try {
    const organizationId = resolveOrganizationId({
      requestPath: req.originalUrl || req.url,
      paramsOrganizationId: req.params.organizationId,
      queryOrganizationId: req.query.organizationId,
      queryOrgId: req.query.orgId,
      headerOrganizationId: req.headers["x-organization-id"],
      headerOrgId: req.headers["x-org-id"],
    });
    const shouldFilterByOrganization =
      Boolean(req.params.organizationId) ||
      req.query.organizationId !== undefined ||
      req.query.orgId !== undefined ||
      req.headers["x-organization-id"] !== undefined ||
      req.headers["x-org-id"] !== undefined;
    const leads = await listStoredLeads(
      shouldFilterByOrganization ? organizationId : undefined
    );
    res.status(200).json({ success: true, organizationId, leads });
  } catch {
    res.status(500).json({ error: "Failed to fetch leads." });
  }
}

export async function handleHealthRequest(req: Request, res: Response): Promise<void> {
  applyCorsHeaders(req, res, "GET, OPTIONS");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET, OPTIONS");
    res.status(405).json({ error: "Method not allowed. Use GET." });
    return;
  }

  res.status(200).json({
    success: true,
    status: "ok",
    timestamp: new Date().toISOString(),
  });
}
