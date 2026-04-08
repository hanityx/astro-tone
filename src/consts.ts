/**
 * consts.ts — re-export values from astro-theme-config.ts.
 * Components can keep importing { SITE_TITLE } from '../consts'.
 */
import config from '../astro-theme-config';

export const SITE_TITLE = config.site.title;
export const SITE_DESCRIPTION = config.site.description;
export const SITE_AUTHOR = config.site.author;
export const SITE_LANG = config.site.lang;
export const SITE_LOCALE = config.site.locale;
export const DATE_LOCALE = config.site.dateLocale;
