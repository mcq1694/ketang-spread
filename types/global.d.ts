declare type PlatformType = 'kt' | 'kskt' | 'wxkt';

declare const tt: Uni & {
  getCustomButtonBoundingClientRect(): {
    capsule: UniNamespace.GetMenuButtonBoundingClientRectRes;
    leftIcon?: UniNamespace.GetMenuButtonBoundingClientRectRes;
  };
  getAppLogManager(): {
    debug: (info: string) => void;
    error: (info: string) => void;
    info: (info: string) => void;
    warn: (info: string) => void;
  };
  requestOrder();
};

declare const ks: Uni;
declare const wx: Uni;
interface UniCallback {
  success?: (res: any) => void;
  fail?: (res: any) => void;
  complete?: (res: any) => void;
}
declare interface Uni {
  requestOrder(options: { data: String; byteAuthorization: String } & UniCallback): void;
  confirmFulfillment(
    options: {
      serviceId: String;
      orderId: String;
      toStatus: 'fulfilling' | 'fulfill_done';
      itemOrderIdList: string[];
    } & UniCallback,
  ): void;
  getOrderPayment(
    options: {
      orderId: string;
    } & UniCallback,
  ): void;
}
