import { useState } from "react";
import { useMutation } from "react-query";
import Button from "../atoms/Button";
import OptionList from "../atoms/OptionList";
import Counter from "../atoms/Counter";
import { comma } from "../../utils/convert";
import { addCart } from "../../services/cart";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import cart_white from "../../assets/cart_white.png";

const OptionColumn = ({ product }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleOnClickOption = (option) => {
    // 이미 선택된 옵션인지 확인
    const isOptionSelected = selectedOptions.some((el) => {
      return el.optionId === option.id;
    });

    if (isOptionSelected) {
      toast.error("이미 선택된 옵션입니다.", {
        hideProgressBar: true,
        autoClose: 2000,
      });

      setSelectedOptions((prev) =>
        prev.map((el) => (el.optionId === option.id ? el : { ...el }))
      );
      return;
    }

    setSelectedOptions((prev) => [
      ...prev,
      {
        optionId: option.id,
        quantity: 1,
        price: option.price,
        name: option.optionName,
      },
    ]);
  };

  const handleOnChange = (count, optionId) => {
    setSelectedOptions((prev) => {
      return prev.map((el) => {
        if (el.optionId === optionId) {
          return {
            ...el,
            quantity: count,
          };
        }
        return el;
      });
    });
  };

  const handleOnRemove = (optionId) => {
    setSelectedOptions((prev) => {
      return prev
        .map((el) => {
          if (el.optionId === optionId) {
            // Set quantity to 0 for the removed option
            return {
              ...el,
              quantity: 0,
            };
          }
          return el;
        })
        .filter((el) => el.quantity > 0); // Remove options with quantity 0 from the list
    });
  };

  // 장바구니 담기 api 처리
  const { mutate } = useMutation({
    mutationFn: addCart,
  });

  const totalQuantity = selectedOptions.reduce(
    (acc, cur) => acc + cur.quantity,
    0
  );
  const totalPrice = selectedOptions.reduce(
    (acc, cur) => acc + cur.quantity * cur.price,
    0
  );

  return (
    <div className="mr-24 ml-6 w-3/5 text-black">
      <div className="mt-2 border rounded-l">
        <OptionList options={product.options} onClick={handleOnClickOption} />
      </div>

      <div className="my-4">
        {selectedOptions.length > 0 && (
          <>
            {selectedOptions.map((option) => (
              <div className="mb-2 p-3 border">
                <ol key={option.optionId} className="selected-option-list">
                  <li className="selected-option">
                    <div className="flex justify-between">
                      <span className="name">{option.name}</span>
                      <button
                        className="border px-2"
                        onClick={() => {
                          handleOnRemove(option.optionId);
                        }}
                      >
                        X
                      </button>
                    </div>
                    <div className="flex justify-between">
                      <Counter
                        onIncrease={(count) =>
                          handleOnChange(count, option.optionId)
                        }
                        onDecrease={(count) =>
                          handleOnChange(count, option.optionId)
                        }
                      />

                      <span className="mt-4">
                        {comma(option.price * option.quantity)}원
                      </span>
                    </div>
                  </li>
                </ol>
              </div>
            ))}
          </>
        )}
      </div>
      <hr />
      <div className="mt-4">
        <span className="text-xl">총 수량 {comma(totalQuantity)}개</span>
      </div>
      <div className="mt-4">
        <span className="text-xl">
          총 주문금액{" "}
          <span className="font-bold text-red-500">{comma(totalPrice)}</span>원
        </span>
      </div>

      <div className="button-group flex">
        <Button
          onClick={() => {
            mutate(
              selectedOptions.map((el) => {
                return {
                  name: el.name,
                  optionId: el.optionId,
                  quantity: el.quantity,
                  price: el.price,
                };
              })
            );
          }}
          className="bg-black text-white font-semibold rounded-lg w-12 h-12 mt-6 flex items-center justify-center mr-2" // Adjusted width to w-1/4 and added mr-2 for some spacing between the buttons
        >
          <img src={cart_white} alt="장바구니 버튼" className="h-10" />
        </Button>
        <Button
          onClick={() => {
            toast.info("바로 구매하시겠습니까?", {
              hideProgressBar: true,
              autoClose: 2000,
            });
          }}
          className="bg-amber-300 text-white font-semibold rounded-lg flex-1 h-12 mt-6" // Used flex-1 to allow the button to take up the remaining space
        >
          구매하기
        </Button>
      </div>
    </div>
  );
};

export default OptionColumn;