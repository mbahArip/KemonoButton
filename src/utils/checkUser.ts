import { Kemono } from "@types";
import axios from "axios";

export default async function checkUser(
  provider: Kemono.Service,
  user: string
): Promise<Kemono.Creator | null> {
  const check = await axios
    .get(`https://kemono-api.mbaharip.com/check/${provider}/${user}`, {
      validateStatus(status) {
        if (status > 500) return false;
        return true;
      },
    })
    .then((res) => {
      return res.status === 200 ? (res.data.data as Kemono.Creator) : null;
    })
    .catch(() => null);

  return check;
  // if (check.status !== 200) return null;
  // return check.data.data as Kemono.Creator;
}
