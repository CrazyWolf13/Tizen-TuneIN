import { FiltersEngine } from '@ghostery/adblocker';
engine = await FiltersEngine.fromLists(fetch, [
 'https://secure.fanboy.co.nz/fanboy-cookiemonster.txt'
]);
