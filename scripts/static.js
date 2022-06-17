// static
const playerInfo = {
  pin: "", // 存ID
  ques_progress: [], //存正確與否
};
const imgTotal = 10; // 圖片的張數
const ansArr = []; // 用來儲存答案
const directionArr = [
  // grid坐標數組
  [0, 0],
  [200, 0],
  [400, 0],
  [0, 200],
  [200, 200],
  [400, 200],
  [0, 400],
  [200, 400],
  [400, 400],
];

const lte_speed = 2000;
const delayArr = [
  lte_speed / 10,
  lte_speed / 10,
  lte_speed / 10,
  lte_speed,
  lte_speed,
  lte_speed,
  lte_speed * 10,
  lte_speed * 10,
  lte_speed * 10,
];
