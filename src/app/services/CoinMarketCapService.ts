import {HttpClient, HttpParams} from "@angular/common/http";
import {Injectable } from "@angular/core";
import {Currency} from "./CoinMarketCapCurrencies";


@Injectable({providedIn: "any"})
export class CoinMarketCapService {
  private TITANO_ID = 14746
  // todo extract & test
  private url = "https://api.coinmarketcap.com/data-api/v3/cryptocurrency/detail/chart";

  params(currency: Currency) {
    return new HttpParams()
      .set('id', this.TITANO_ID)
      .set('range', '1D')
      .set('convertId', currency.id);
  }

  constructor(private http: HttpClient) {
  }

  getQuote(currency: Currency) {
    return this.http.get<CMCQuoteResponse>(this.url, {params: this.params(currency)});
  }
}

export interface CMCQuoteDataPoint {
  c: Array<number>;
  v: Array<number>;
}

export interface CMCQuoteData {
  points: Map<string, CMCQuoteDataPoint>;
}

export interface CMCQuoteStatus {
  timestamp: Date;
  error_code: string;
  error_message: string;
  elapsed: string;
  credit_count: number;
}

export interface CMCQuoteResponse {
  data: CMCQuoteData;
  status: CMCQuoteStatus;
}
