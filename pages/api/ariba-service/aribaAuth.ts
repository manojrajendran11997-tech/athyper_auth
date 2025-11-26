import axios from "axios";
import { ARIBA } from "./config";

export async function getAribaToken() {
  const form = new URLSearchParams({
    grant_type: "client_credentials",
    scope: `openid realm:uhpower:sourcing-event:read`  // ← FIXED HERE
  });

  const res = await axios.post(ARIBA.OAUTH_URL!, form, {
    auth: {
      username: ARIBA.CLIENT_ID!,
      password: ARIBA.CLIENT_SECRET!,
    },
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  console.log("🔑 Token OK -> expires in", res.data.expires_in, "seconds");
  return res.data.access_token;
}
