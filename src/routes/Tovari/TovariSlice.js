import { createSlice } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";

import screwdriver from "../../assets/screwdriver.png";
import Hammer from "../../assets/Hammer.png";
import bolgarka from "../../assets/bolgarka.png";
import Drill from "../../assets/Drill.png";

import ceMENT from "../../assets/ceMENT.png";
import Kirpichi from "../../assets/Kirpichi.png";
import PaletBlockovRoblox from "../../assets/PaletBlockovRoblox.png";
import pasxalka52 from "../../assets/pasxalka52.png";
import Plitka from "../../assets/Plitka.png";
import PlitkaItalian from "../../assets/PlitkaItalian.png";

let TovariStore = JSON.parse(localStorage.getItem("tovari")) || [];

let TovariSlice = createSlice({
  name: "tovari",
  initialState: TovariStore,
  reducers: {
    add: (state) => {
      let newItems = [
        { id: nanoid(), text: "Отвертка", img: screwdriver, isWholesale: false, description: "Отвертка с пластиковым эргономичным покрытием, идеально подходит для работы с мелкими винтами и деталями." },
        { id: nanoid(), text: "Молоток", img: Hammer, isWholesale: false, description: "Молоток с металлическим стержнем и удобной деревянной ручкой. Используется для забивания гвоздей и мелких работ." },
        { id: nanoid(), text: "Болгарка", img: bolgarka, isWholesale: false, description: "Угловая шлифмашина (болгарка) для резки, шлифовки и полировки металла, бетона и других материалов." },
        { id: nanoid(), text: "Дрель", img: Drill, isWholesale: false, description: "Электрическая дрель для сверления отверстий в различных материалах, включая дерево, металл и бетон." },
        { id: nanoid(), text: "Цемент", img: ceMENT, isWholesale: true, description: "Портландцемент, применяемый в строительстве для создания прочных бетонных и строительных конструкций." },
        { id: nanoid(), text: "Кирпичи", img: Kirpichi, isWholesale: true, description: "Красные строительные кирпичи стандартного размера для возведения стен и других строительных объектов." },
        { id: nanoid(), text: "Палет Кирпичей", img: PaletBlockovRoblox, isWholesale: true, description: "Палет с кирпичами, предназначенный для крупномасштабных строительных работ, с гарантией высокого качества." },
        { id: nanoid(), text: "Цемент 52", img: pasxalka52, isWholesale: true, description: "Цемент марки 52,5, идеален для строительства объектов, требующих повышенной прочности и устойчивости к внешним воздействиям." },
        { id: nanoid(), text: "Плитка", img: Plitka, isWholesale: true, description: "Керамическая плитка для внутренней отделки, имеет высокую прочность и стойкость к загрязнениям и износу." },
        { id: nanoid(), text: "Плитка Итальянская", img: PlitkaItalian, isWholesale: true, description: "Итальянская керамическая плитка премиум-класса, отличающаяся элегантным дизайном и долговечностью. Идеально подходит для отделки пола и стен." },
      ];
      
      console.log(newItems);
      
      state.push(...newItems);
      localStorage.setItem("tovari", JSON.stringify(state));
    },
  },
});

export let { add } = TovariSlice.actions;
export default TovariSlice.reducer;
