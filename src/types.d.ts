export namespace Kemono {
  export interface Creator {
    favorited: number;
    id: string;
    indexed: number;
    name: string;
    service: Service;
    updated: number;
    url?: string;
  }

  export type ServiceKemono =
    | "patreon"
    | "fanbox"
    | "discord"
    | "fantia"
    | "afdian"
    | "boosty"
    | "dlsite"
    | "gumroad"
    | "subscribestar";
  export type ServiceCoomer = "onlyfans" | "fansly";

  export type Service = ServiceKemono | ServiceCoomer;

  export enum ServiceURL {
    patreon = "https://patreon.com",
    fanbox = "https://fanbox.cc",
    discord = "https://discord.com",
    fantia = "https://fantia.jp",
    afdian = "https://afdian.net",
    boosty = "https://boosty.to",
    dlsite = "https://dlsite.com",
    gumroad = "https://gumroad.com",
    subscribestar = "https://subscribestar.com",
    onlyfans = "https://onlyfans.com",
    fansly = "https://fansly.com",
  }
}

export enum ServiceEnum {
  patreon = "Patreon",
  fanbox = "Pixiv Fanbox",
  discord = "Discord",
  fantia = "Fantia",
  afdian = "Afdian",
  boosty = "Boosty",
  dlsite = "DLsite",
  gumroad = "Gumroad",
  subscribestar = "SubscribeStar",
  onlyfans = "OnlyFans",
  fansly = "Fansly",
}
