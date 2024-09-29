import { Request, Response, NextFunction } from "express";

type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N ? Acc[number] : Enumerate<N, [...Acc, Acc['length']]>;
export type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>;

type AtLeastOne<Obj, Keys extends keyof Obj = keyof Obj> = Pick<Obj, Exclude<keyof Obj, Keys>> & {
  [K in Keys]-?: Required<Pick<Obj, K>> & Partial<Record<Exclude<Keys, K>, any>>;
}[Keys];

export type T_Sex = 'm' | 'f';
export type T_Permission = 's' | 'f' | 'r';
export type T_Season = 'sp' | 'su' | 'au' | 'wi' | 'al';
export type T_Trip_Type = 'rel' | 'sig' | 'act' | 'cul' | 'par';
export type T_Priority = 'h' | 'm' | 'l';
export type T_Cover_For = 't' | 'd';
export type T_Cover_Pos = 'l' | 'm' | 'r';
export type T_Rating_Score = IntRange<1, 51>;

export type T_User = {
  id: string;
  email: string;
  password_hash?: string;
  role: 'user';
  name: string;
  verified: boolean;
  birthday?: string;
  sex?: T_Sex;
  nationality?: string;
  join_date: string;
  refresh_token: string;
};

export type T_Admin = {
  id: string;
  username: string;
  role: 'admin';
  permission: T_Permission;
  password_hash: string;
  refresh_token: string;
};

export type T_Profile_Photo = {
  user_id: string;
  file: string;
};

export type T_Trip = {
  id: string;
  user_id: string;
  label: string;
  view_count: number;
  cost?: number;
  description: string;
  season: T_Season[];
  avg_rating?: number;
  duration_from: number;
  duration_to: number;
  type: T_Trip_Type;
};

export type T_Destination = {
  id: string;
  label: string;
  trip_id: string;
  parent_destination_id?: string;
  priority: T_Priority;
  description: string;
  staying_cost?: number;
  visiting_cost?: number;
  stay_days: number;
  visiting_time_from?: number;
  visiting_time_to?: number;
};

export type T_Photo = {
  id: string;
  file: string;
  trip_id: string;
  destination_id?: string;
  cover_for?: T_Cover_For;
  cover_pos?: T_Cover_Pos
};

export type T_Rating = {
  id: string;
  trip_id: string;
  user_id: string;
  comment?: string;
  score: T_Rating_Score;
  replied_to?: string;
  like_count: number;
  dislike_count: number;
};

export type T_Controller = (req: Request, res: Response, next: NextFunction) => any;

export type T_Email_Store = {
  [email: string]: {
    verification_code: string;
    create_time: string;
    timeout_id: NodeJS.Timeout | null;
  }
};

export type T_Email_Body = AtLeastOne<{
  from: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
}, 'text' | 'html'>;