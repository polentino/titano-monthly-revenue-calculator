export interface Currency {
  id: number;
  name: string;
  symbol: string;
  slug: string;
}

export class CoinMarketCapCurrencies {

  static CURRENCIES: Array<Currency> = [
    {
      'id': 2781,
      'name': 'United States Dollar',
      'symbol': 'USD',
      'slug': 'united-states-dollar'
    },
    {
      'id': 2782,
      'name': 'Australian Dollar',
      'symbol': 'AUD',
      'slug': 'australian-dollar'
    },
    {
      'id': 2783,
      'name': 'Brazilian Real',
      'symbol': 'BRL',
      'slug': 'brazilian-real'
    },
    {
      'id': 2784,
      'name': 'Canadian Dollar',
      'symbol': 'CAD',
      'slug': 'canadian-dollar'
    },
    {
      'id': 2785,
      'name': 'Swiss Franc',
      'symbol': 'CHF',
      'slug': 'swiss-franc'
    },
    {
      'id': 2786,
      'name': 'Chilean Peso',
      'symbol': 'CLP',
      'slug': 'chilean-peso'
    },
    {
      'id': 2787,
      'name': 'Chinese Yuan',
      'symbol': 'CNY',
      'slug': 'chinese-yuan'
    },
    {
      'id': 2788,
      'name': 'Czech Koruna',
      'symbol': 'CZK',
      'slug': 'czech-koruna'
    },
    {
      'id': 2789,
      'name': 'Danish Krone',
      'symbol': 'DKK',
      'slug': 'danish-krone'
    },
    {
      'id': 2790,
      'name': 'Euro',
      'symbol': 'EUR',
      'slug': 'euro'
    },
    {
      'id': 2791,
      'name': 'Pound Sterling',
      'symbol': 'GBP',
      'slug': 'pound-sterling'
    },
    {
      'id': 2792,
      'name': 'Hong Kong Dollar',
      'symbol': 'HKD',
      'slug': 'hong-kong-dollar'
    },
    {
      'id': 2793,
      'name': 'Hungarian Forint',
      'symbol': 'HUF',
      'slug': 'hungarian-forint'
    },
    {
      'id': 2794,
      'name': 'Indonesian Rupiah',
      'symbol': 'IDR',
      'slug': 'indonesian-rupiah'
    },
    {
      'id': 2795,
      'name': 'Israeli New Shekel',
      'symbol': 'ILS',
      'slug': 'israeli-new-shekel'
    },
    {
      'id': 2796,
      'name': 'Indian Rupee',
      'symbol': 'INR',
      'slug': 'indian-rupee'
    },
    {
      'id': 2797,
      'name': 'Japanese Yen',
      'symbol': 'JPY',
      'slug': 'japanese-yen'
    },
    {
      'id': 2798,
      'name': 'South Korean Won',
      'symbol': 'KRW',
      'slug': 'south-korean-won'
    },
    {
      'id': 2799,
      'name': 'Mexican Peso',
      'symbol': 'MXN',
      'slug': 'mexican-peso'
    },
    {
      'id': 2800,
      'name': 'Malaysian Ringgit',
      'symbol': 'MYR',
      'slug': 'malaysian-ringgit'
    },
    {
      'id': 2801,
      'name': 'Norwegian Krone',
      'symbol': 'NOK',
      'slug': 'norwegian-krone'
    },
    {
      'id': 2802,
      'name': 'New Zealand Dollar',
      'symbol': 'NZD',
      'slug': 'new-zealand-dollar'
    },
    {
      'id': 2803,
      'name': 'Philippine Peso',
      'symbol': 'PHP',
      'slug': 'philippine-peso'
    },
    {
      'id': 2804,
      'name': 'Pakistani Rupee',
      'symbol': 'PKR',
      'slug': 'pakistani-rupee'
    },
    {
      'id': 2805,
      'name': 'Polish Złoty',
      'symbol': 'PLN',
      'slug': 'polish-zloty'
    },
    {
      'id': 2806,
      'name': 'Russian Ruble',
      'symbol': 'RUB',
      'slug': 'russian-ruble'
    },
    {
      'id': 2807,
      'name': 'Swedish Krona',
      'symbol': 'SEK',
      'slug': 'swedish-krona'
    },
    {
      'id': 2808,
      'name': 'Singapore Dollar',
      'symbol': 'SGD',
      'slug': 'singapore-dollar'
    },
    {
      'id': 2809,
      'name': 'Thai Baht',
      'symbol': 'THB',
      'slug': 'thai-baht'
    },
    {
      'id': 2810,
      'name': 'Turkish Lira',
      'symbol': 'TRY',
      'slug': 'turkish-lira'
    },
    {
      'id': 2811,
      'name': 'New Taiwan Dollar',
      'symbol': 'TWD',
      'slug': 'new-taiwan-dollar'
    },
    {
      'id': 2812,
      'name': 'South African Rand',
      'symbol': 'ZAR',
      'slug': 'south-african-rand'
    },
    {
      'id': 2823,
      'name': 'Vietnamese Dong',
      'symbol': 'VND',
      'slug': 'vietnamese-dong'
    },
    {
      'id': 3554,
      'name': 'Moroccan Dirham',
      'symbol': 'MAD',
      'slug': 'moroccan-dirham'
    },
    {
      'id': 3544,
      'name': 'Iranian Rial',
      'symbol': 'IRR',
      'slug': 'iranian-rial'
    },
    {
      'id': 2821,
      'name': 'Argentine Peso',
      'symbol': 'ARS',
      'slug': 'argentine-peso'
    },
    {
      'id': 2817,
      'name': 'Romanian Leu',
      'symbol': 'RON',
      'slug': 'romanian-leu'
    },
    {
      'id': 2824,
      'name': 'Ukrainian Hryvnia',
      'symbol': 'UAH',
      'slug': 'ukrainian-hryvnia'
    },
    {
      'id': 2819,
      'name': 'Nigerian Naira',
      'symbol': 'NGN',
      'slug': 'nigerian-naira'
    },
    {
      'id': 2813,
      'name': 'United Arab Emirates Dirham',
      'symbol': 'AED',
      'slug': 'united-arab-emirates-dirham'
    },
    {
      'id': 2820,
      'name': 'Colombian Peso',
      'symbol': 'COP',
      'slug': 'colombian-peso'
    },
    {
      'id': 3538,
      'name': 'Egyptian Pound',
      'symbol': 'EGP',
      'slug': 'egyptian-pound'
    },
    {
      'id': 3566,
      'name': 'Saudi Riyal',
      'symbol': 'SAR',
      'slug': 'saudi-riyal'
    },
    {
      'id': 3530,
      'name': 'Bangladeshi Taka',
      'symbol': 'BDT',
      'slug': 'bangladeshi-taka'
    },
    {
      'id': 3540,
      'name': 'Ghanaian Cedi',
      'symbol': 'GHS',
      'slug': 'ghanaian-cedi'
    },
    {
      'id': 2814,
      'name': 'Bulgarian Lev',
      'symbol': 'BGN',
      'slug': 'bulgarian-lev'
    },
    {
      'id': 3573,
      'name': 'Sovereign Bolivar',
      'symbol': 'VES',
      'slug': 'sovereign-bolivar'
    },
  ];
}
