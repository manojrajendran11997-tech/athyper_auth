import axios from "axios";
import { getAribaToken } from "./aribaAuth";
import { ARIBA } from "./config";

export async function aribaGET(endpoint: string) {
  const token = await getAribaToken();

  return axios.get(`${ARIBA.API_BASE}${endpoint}`, {   // FIXED HERE
    headers: {
      Authorization: `Bearer ${token}`,
      APIApplicationKey: ARIBA.APPLICATION_KEY!,
      "Content-Type": "application/json",
    }
  }).then(r => r.data);
}
