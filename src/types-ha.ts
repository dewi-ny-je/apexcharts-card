// Types vendored from the Home Assistant frontend so the card doesn't have to
// depend on `custom-card-helpers`, which has been unmaintained since 2022 and
// no longer matches the frontend it describes.
//
// Upstream sources (https://github.com/home-assistant/frontend):
//   src/data/translation.ts -> the locale enums and FrontendLocaleData
//   src/types.ts            -> HomeAssistant, trimmed to the members this card
//                              and its vendored helpers actually use.

import { HassConfig, HassEntities, HassServiceTarget, MessageBase } from 'home-assistant-js-websocket';

export enum NumberFormat {
  language = 'language',
  system = 'system',
  comma_decimal = 'comma_decimal',
  decimal_comma = 'decimal_comma',
  quote_decimal = 'quote_decimal',
  space_comma = 'space_comma',
  none = 'none',
}

export enum TimeFormat {
  language = 'language',
  system = 'system',
  am_pm = '12',
  twenty_four = '24',
}

export enum TimeZone {
  local = 'local',
  server = 'server',
}

export enum DateFormat {
  language = 'language',
  system = 'system',
  DMY = 'DMY',
  MDY = 'MDY',
  YMD = 'YMD',
}

export enum FirstWeekday {
  language = 'language',
  monday = 'monday',
  tuesday = 'tuesday',
  wednesday = 'wednesday',
  thursday = 'thursday',
  friday = 'friday',
  saturday = 'saturday',
  sunday = 'sunday',
}

export interface FrontendLocaleData {
  language: string;
  number_format: NumberFormat;
  time_format: TimeFormat;
  date_format: DateFormat;
  first_weekday: FirstWeekday;
  time_zone: TimeZone;
}

export interface CurrentUser {
  id: string;
  is_owner: boolean;
  is_admin: boolean;
  name: string;
}

export interface HomeAssistant {
  states: HassEntities;
  config: HassConfig;
  language: string;
  locale: FrontendLocaleData;
  user?: CurrentUser;
  callService(
    domain: string,
    service: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    serviceData?: Record<string, any>,
    target?: HassServiceTarget,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any>;
  callApi<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    path: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    parameters?: Record<string, any>,
  ): Promise<T>;
  callWS<T>(msg: MessageBase): Promise<T>;
}
