import { Kemono } from "@types";
import axios from "axios";

export default async function checkUser(
  provider: Kemono.Service,
  user: string
): Promise<Kemono.Creator | null> {
  const check = await axios.get(
    `https://kemono-api.mbaharip.com/check/${provider}/${user}`
  );
  if (check.status !== 200) return null;
  return check.data.data as Kemono.Creator;
}
