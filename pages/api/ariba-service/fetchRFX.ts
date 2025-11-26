import { aribaGET } from "./aribaClient";

export async function fetchRfxEvents() {
  return await aribaGET(`/events`);
  // Example: /events?status=Published&realm=XXXX
}
