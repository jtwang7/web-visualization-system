import _ from "lodash";
import { useEffect, useState } from "react";
import { DOUBLE_SELECT } from "../constants";
import { CheckboxValueType } from "antd/lib/checkbox/Group";

export const useSelectLogic = () => {
  const options = [{ label: "双选", value: DOUBLE_SELECT }];
  const [checkedValue, setCheckedValue] = useState<any[]>([]);
  const doubleSelectLogic = () => {
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
  };
  const onCheckboxValueChange = (value: CheckboxValueType[]) => {
    doubleSelectLogic();
  };
  useEffect(() => {
    const pressShift = (ev: KeyboardEvent) => {
      if (ev.key === "Shift") {
        doubleSelectLogic();
      }
    };
    window.addEventListener("keyup", pressShift);
    return () => {
      window.removeEventListener("keyup", pressShift);
    };
  }, []);

  return { options, checkedValue, onCheckboxValueChange };
};
