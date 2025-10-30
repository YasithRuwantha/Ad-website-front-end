// Support tickets API client (style aligned with auth-context.tsx)

export type TicketStatus = "open" | "in-progress" | "resolved";

export interface ReplyDTO {
  id: string;
  message: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface TicketDTO {
  id: string;
  userId: string;
  username?: string;
  useremail?: string;
  subject: string;
  message: string;
  status: TicketStatus;
  createdAt: string;
  replies: ReplyDTO[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL
const SUPPORT_BASE = `${API_URL}/api/support`;

async function handle<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const message = (data && (data.message || data.error)) || res.statusText || "Request failed";
    throw new Error(message);
  }
  return (data as T) ?? ({} as T);
}

export async function getTickets(params?: { userId?: string }): Promise<TicketDTO[]> {
  const url = new URL(SUPPORT_BASE);
  if (params?.userId) url.searchParams.set("userId", params.userId);
  const res = await fetch(url.toString(), {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  return handle<TicketDTO[]>(res);
}

export async function getTicketById(id: string): Promise<TicketDTO> {
  const res = await fetch(`${SUPPORT_BASE}/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  return handle<TicketDTO>(res);
}

export async function createTicket(payload: {
  userId: string;
  username: string;
  useremail: string;
  subject: string;
  message: string;
}): Promise<TicketDTO> {
  const res = await fetch(SUPPORT_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handle<TicketDTO>(res);
}

export async function addReply(ticketId: string, payload: { message: string; isAdmin?: boolean }): Promise<TicketDTO> {
  const res = await fetch(`${SUPPORT_BASE}/${ticketId}/reply`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handle<TicketDTO>(res);
}

export async function updateStatus(ticketId: string, status: TicketStatus): Promise<TicketDTO> {
  const res = await fetch(`${SUPPORT_BASE}/${ticketId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  return handle<TicketDTO>(res);
}

export async function deleteTicket(ticketId: string): Promise<{ ok: boolean }> {
  const res = await fetch(`${SUPPORT_BASE}/${ticketId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  return handle<{ ok: boolean }>(res);
}
