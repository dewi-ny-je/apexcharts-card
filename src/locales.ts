import * as ar from 'apexcharts/dist/locales/ar.json';
import * as be_cyrl from 'apexcharts/dist/locales/be-cyrl.json';
import * as be_latn from 'apexcharts/dist/locales/be-latn.json';
import * as bg from 'apexcharts/dist/locales/bg.json';
import * as ca from 'apexcharts/dist/locales/ca.json';
import * as cs from 'apexcharts/dist/locales/cs.json';
import * as da from 'apexcharts/dist/locales/da.json';
import * as de from 'apexcharts/dist/locales/de.json';
import * as el from 'apexcharts/dist/locales/el.json';
import * as en from 'apexcharts/dist/locales/en.json';
import * as es from 'apexcharts/dist/locales/es.json';
import * as et from 'apexcharts/dist/locales/et.json';
import * as fa from 'apexcharts/dist/locales/fa.json';
import * as fi from 'apexcharts/dist/locales/fi.json';
import * as fr from 'apexcharts/dist/locales/fr.json';
import * as gl from 'apexcharts/dist/locales/gl.json';
import * as he from 'apexcharts/dist/locales/he.json';
import * as hi from 'apexcharts/dist/locales/hi.json';
import * as hr from 'apexcharts/dist/locales/hr.json';
import * as hu from 'apexcharts/dist/locales/hu.json';
import * as hy from 'apexcharts/dist/locales/hy.json';
import * as id from 'apexcharts/dist/locales/id.json';
import * as it from 'apexcharts/dist/locales/it.json';
import * as ja from 'apexcharts/dist/locales/ja.json';
import * as ka from 'apexcharts/dist/locales/ka.json';
import * as ko from 'apexcharts/dist/locales/ko.json';
import * as lt from 'apexcharts/dist/locales/lt.json';
import * as lv from 'apexcharts/dist/locales/lv.json';
import * as ms from 'apexcharts/dist/locales/ms.json';
import * as nb from 'apexcharts/dist/locales/nb.json';
import * as nl from 'apexcharts/dist/locales/nl.json';
import * as pl from 'apexcharts/dist/locales/pl.json';
import * as pt_br from 'apexcharts/dist/locales/pt-br.json';
import * as pt from 'apexcharts/dist/locales/pt.json';
import * as ro from 'apexcharts/dist/locales/ro.json';
import * as ru from 'apexcharts/dist/locales/ru.json';
import * as sk from 'apexcharts/dist/locales/sk.json';
import * as sl from 'apexcharts/dist/locales/sl.json';
import * as sq from 'apexcharts/dist/locales/sq.json';
import * as sr from 'apexcharts/dist/locales/sr.json';
import * as sv from 'apexcharts/dist/locales/sv.json';
import * as th from 'apexcharts/dist/locales/th.json';
import * as tr from 'apexcharts/dist/locales/tr.json';
import * as uk from 'apexcharts/dist/locales/uk.json';
import * as vi from 'apexcharts/dist/locales/vi.json';
import * as zh_cn from 'apexcharts/dist/locales/zh-cn.json';
import * as zh_tw from 'apexcharts/dist/locales/zh-tw.json';

export function getLocales(): Record<string, unknown> {
  return {
    ar: ar,
    'be-cyrl': be_cyrl,
    'be-latn': be_latn,
    bg: bg,
    ca: ca,
    cs: cs,
    da: da,
    de: de,
    el: el,
    en: en,
    es: es,
    et: et,
    fa: fa,
    fi: fi,
    fr: fr,
    gl: gl,
    he: he,
    hi: hi,
    hr: hr,
    hu: hu,
    hy: hy,
    id: id,
    it: it,
    ja: ja,
    ka: ka,
    ko: ko,
    lt: lt,
    lv: lv,
    ms: ms,
    nb: nb,
    nl: nl,
    pl: pl,
    'pt-br': pt_br,
    pt: pt,
    ro: ro,
    ru: ru,
    sk: sk,
    sl: sl,
    sq: sq,
    sr: sr,
    sv: sv,
    th: th,
    tr: tr,
    uk: uk,
    vi: vi,
    'zh-cn': zh_cn,
    'zh-tw': zh_tw,
    // Backward-compatible aliases for locale codes used before
    // ApexCharts renamed them to their standard ISO equivalents.
    rs: sr,
    se: sv,
    ua: uk,
  };
}

export function getDefaultLocale(): unknown {
  return en;
}
