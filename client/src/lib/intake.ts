export type IntakeSubmissionPayload = Record<string, unknown>;

export async function submitWebsiteIntake(payload: IntakeSubmissionPayload): Promise<unknown> {
  const response = await fetch("/api/intake", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      typeof body?.error === "string" ? body.error : "Failed to submit intake request.";
    throw new Error(message);
  }

  return body;
}
