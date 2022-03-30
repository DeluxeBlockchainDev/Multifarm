# GMMs API



## 1.) Endpoints
Note `jay_flamingo_random_6ix_vegas` is the base secret link we use. This is so any malicious code comes from actual user base not from random crawlers poking through AMAZON ip lists.



### Endpoint types:

1. Admin endpoints. Currently for ivarsj10s (me; the author) - only. My my admin usage to the API.
2. For-scrapers endpoints. For scrapers built by ivarsj10s (me; the author) - only. These are endpoints to receive and server POST requests of scraped data or any other requests by my-built scrapers.
3. Data-entry endpoints. Endpoints for people with login which permits them to add, edit _(change values; lock or unlock fields),_ update _(similar to scraping where code auto-calculates values)_.
4. Public endpoints. These are endpoints serving data to `alpha.multifarm.fi` which our current version of the website.



Up to date documentation is currently not available (20th August 2021) - could change in the future tho'; maybe I can write a proper swagger documentation or something like that.



## 2.) Public endpoints (dated documentation)

Note: this documentation is dated; it may or may not work.

### I. Farms

1) **Get farms:**

`/jay_flamingo_random_6ix_vegas/get_farms?pg=1` default usage

`/jay_flamingo_random_6ix_vegas/get_farms?pg=1?blockchain=heco` simple filter

`/jay_flamingo_random_6ix_vegas/get_farms?pg=1&blockchain=heco,polygon,avax&tvl_min=1000000&tvl_max=2000000` more complex filter, filters out farms within HECO, POLYGON and AVAX blockchains which have `tvlStaked` between 1 and 2 mil

_**query string:**_

`pg` = pagenumber (how many pages gets given back as `max_pages`)

`tvl_min`,  `tvl_max` = TVL higher on lower (non-inclusive, so for 100 to 200, you specify 99.99 to 200.01) = I might fix this up in the future.

`tvl_change_min`, `tvl_change_min` = same as for TVL but for TVL change 24h

_NOTE:_ can be combined

`sort` = `tvlStaked`, `tvlChange24hValue` 

`sort_order` = `asc` for ascending, `desc` for descending to change sort order



2) **Get farm details:**

is used to get more detailed farm information, currently plus `tvlHistory` additional field

`/jay_flamingo_random_6ix_vegas/get_farm_details/<farm_id>`

### II. Assets

1) **Get assets:**

`/jay_flamingo_random_6ix_vegas/get_assets?pg=1&apr_yearly_min=1000`

_**query string:**_

same as for get farms plus

`apr_yearly_min` and `apr_yearly_max` which filter data by min and max apr_yearly, also can be combined. 

**sort**

for assets you can also sort by `tvlStaked`, `aprYearly`, `tvlChange24hValue` as the filters



2) **Get assets by farm_id**:

`/jay_flamingo_random_6ix_vegas/get_assets_by_farm_id/<farm_id>` take any `farm_id` from, uh, the... `/get_farms` and try it out if possible. This return assets under the farm.

3) **Get asset details:**

`/jay_flamingo_random_6ix_vegas/get_asset_details/<asset_id>` get more specific details (30d historicals) for an individual asset.