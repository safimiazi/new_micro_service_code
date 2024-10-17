import HTTP from "./src/HTTP";
import dataProcessor, { PaymentDataT } from "./src/DataProcessor";

export interface PaymentRequest {
  total_amount: number;
  currency: string;
  tran_id: string;
  success_url: string;
  fail_url: string;
  cancel_url: string;
  ipn_url: string;
  cus_name: string;
  cus_email: string;
  cus_add1: string;
  cus_add2?: string;
  cus_city: string;
  cus_state?: string;
  cus_postcode: string;
  cus_country: string;
  cus_phone: string;
  cus_fax?: string;
  product_name: string;
  product_category: string;
  shipping_method: string;
  product_profile:
    | "physical-goods"
    | "general"
    | "non-physical-goods"
    | "airline-tickets"
    | "travel-vertical"
    | "telecom-vertical";
  ship_name?: string;
  ship_add1?: string;
  ship_add2?: string;
  ship_city?: string;
  ship_state?: string;
  ship_postcode?: string;
  ship_country?: string;
  multi_card_name?: string;
  value_a?: string;
  value_b?: string;
  value_c?: string;
  value_d?: string;
  store_id?: string;
  store_passwd?: string;
}

interface GatewayResponse {
  status: string;
  failedreason: string;
  sessionkey: string;
  gw: {
    visa: string;
    master: string;
    amex: string;
    othercards: string;
    internetbanking: string;
    mobilebanking: string;
  };
  redirectGatewayURL: string;
  directPaymentURLBank: string;
  directPaymentURLCard: string;
  directPaymentURL: string;
  redirectGatewayURLFailed: string;
  GatewayPageURL: string;
  storeBanner: string;
  storeLogo: string;
  store_name: string;
  desc: {
    name: string;
    type: string;
    logo: string;
    gw: string;
    r_flag: string;
    redirectGatewayURL: string;
  }[];
  is_direct_pay_enable: string;
}

class SSL {
  private baseURL: string;
  private initURL: string;
  private validationURL: string;
  private refundURL: string;
  private refundQueryURL: string;
  private transactionQueryBySessionIdURL: string;
  private transactionQueryByTransactionIdURL: string;
  private store_id: string;
  private store_passwd: string;

  constructor(store_id: string, store_passwd: string, live: boolean = false) {
    this.baseURL = `https://${live ? "securepay" : "sandbox"}.sslcommerz.com`;
    this.initURL = this.baseURL + "/gwprocess/v4/api.php";
    this.validationURL =
      this.baseURL + "/validator/api/validationserverAPI.php?";
    this.refundURL =
      this.baseURL + "/validator/api/merchantTransIDvalidationAPI.php?";
    this.refundQueryURL =
      this.baseURL + "/validator/api/merchantTransIDvalidationAPI.php?";
    this.transactionQueryBySessionIdURL =
      this.baseURL + "/validator/api/merchantTransIDvalidationAPI.php?";
    this.transactionQueryByTransactionIdURL =
      this.baseURL + "/validator/api/merchantTransIDvalidationAPI.php?";
    this.store_id = store_id;
    this.store_passwd = store_passwd;
  }

  init(
    data: PaymentRequest,
    url: string | false = false,
    method: string = "POST"
  ): Promise<GatewayResponse> {
    data.store_id = this.store_id;
    data.store_passwd = this.store_passwd;

    return HTTP({
      url: url || this.initURL,
      method: method || "POST",
      data: dataProcessor(data as unknown as PaymentDataT),
    });
  }

  validate(
    val_id: string,
    url: string | false = false,
    method: string = "GET"
  ) {
    return HTTP({
      url:
        url ||
        this.validationURL +
          `val_id=${val_id}&store_id=${this.store_id}&store_passwd=${this.store_passwd}&v=1&format=json`,
      method: method || "GET",
    });
  }

  initiateRefund(
    data: any,
    url: string | false = false,
    method: string = "GET"
  ) {
    return HTTP({
      url:
        url ||
        this.refundURL +
          `refund_amount=${data.refund_amount}&refund_remarks=${data.refund_remarks}&bank_tran_id=${data.bank_tran_id}&refe_id=${data.refe_id}&store_id=${this.store_id}&store_passwd=${this.store_passwd}&v=1&format=json`,
      method: method || "GET",
    });
  }

  refundQuery(data: any, url: string | false = false, method: string = "GET") {
    return HTTP({
      url:
        url ||
        this.refundQueryURL +
          `refund_ref_id=${data.refund_ref_id}&store_id=${this.store_id}&store_passwd=${this.store_passwd}&v=1&format=json`,
      method: method || "GET",
    });
  }

  transactionQueryBySessionId(
    data: any,
    url: string | false = false,
    method: string = "GET"
  ) {
    return HTTP({
      url:
        url ||
        this.transactionQueryBySessionIdURL +
          `sessionkey=${data.sessionkey}&store_id=${this.store_id}&store_passwd=${this.store_passwd}&v=1&format=json`,
      method: method || "GET",
    });
  }

  transactionQueryByTransactionId(
    data: any,
    url: string | false = false,
    method: string = "GET"
  ) {
    return HTTP({
      url:
        url ||
        this.transactionQueryByTransactionIdURL +
          `tran_id=${data.tran_id}&store_id=${this.store_id}&store_passwd=${this.store_passwd}&v=1&format=json`,
      method: method || "GET",
    });
  }
}

export default SSL;
