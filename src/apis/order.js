import { instance } from "./index";

/**
 * 장바구니에 있는 모든 상품 주문
 * headers: { Authorization: `Bearer ${token}`}
 */
export const order = (items) => {
  return instance.post("/orders/save", items);
};

export const getOrderFromId = (id) => {
  return instance.get(`/orders/${id}`);
};