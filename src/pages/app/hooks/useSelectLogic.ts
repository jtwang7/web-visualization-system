import _ from "lodash";
import { CheckboxGroupProps } from "antd/lib/checkbox";
import { useEffect, useState } from "react";
import { DOUBLE_SELECT } from "../constants";

export const useSelectLogic = () => {
  const options = [{ label: "双选", value: DOUBLE_SELECT }];
  const [checkedValue, setCheckedValue] = useState<any[]>([]);
  const onCheckboxValueChange: CheckboxGroupProps["onChange"] = (value) => {
    setCheckedValue(value);
  };
  useEffect(() => {
    const pressShift = (ev: KeyboardEvent) => {
      if (ev.key === "Shift") {
        setCheckedValue((prev) => {
          const newState = [...prev];
          const removeItems = _.remove(newState, function (value) {
            return value === "double-select";
          });
          if (removeItems.length === 0) {
            newState.push("double-select");
          }
          return newState;
        });
      }
    };
    window.addEventListener("keyup", pressShift);
    return () => {
      window.removeEventListener("keyup", pressShift);
    };
  }, []);

  return { options, checkedValue, onCheckboxValueChange };
};
