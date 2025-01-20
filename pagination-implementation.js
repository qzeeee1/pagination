// import Pagination from "./Pagination"; // 페이지네이션 컴포넌트 불러오기

// // 100개의 샘플 데이터 생성
// // _(언더스코어) 실제로 사용되지 않는 매개변수를 나타내는 관례적인 표시.
// // 여기서는 현재 배열의 요소값이 들어오지만 사용하지 않을것이므로 _ 표시함.
// // 값 undefined 가 들어오게됨.
// // i 는 현재 처리중인 인덱스 (0부터 시작)
// // Array.from({ length: 100 }, (unused, index) => `아이템 ${index + 1}`)
// // 위 코드와 아래 코드는 동일한 결과 출력
const sampleData = Array.from({ length: 100 }, (_, i) => `아이템 ${i + 1}`);

// // 한 페이지당 표시할 아이템 수
const itemsPerPage = 10;

const displayData = (data, currentPage, itemsPerPage) => {
  //   // 시작과 끝 인덱스 계산
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // contentList 요소 가져오기 및 초기화
  const contentList = document.getElementById("contentList");
  contentList.innerHTML = "";

  // 해당 페이지의 데이터만 추출하여 표시
  data.slice(startIndex, endIndex).forEach((item) => {
    const li = document.createElement("li");
    li.classList.add("content-item");
    li.textContent = item;
    contentList.appendChild(li);
  });
};

// 페이지네이션 객체생성
const pagination = Pagination({
  data: sampleData,
  itemsPerPage: itemsPerPage,
});

// 페이지네이션 UI를 DOM에 추가
const paginationElement = pagination.createPagination();
document.getElementById("paginationArea").appendChild(paginationElement);

// URL에서 현재 페이지 번호 가져오기 (없으면 1페이지)
const currentPage =
  new URLSearchParams(window.location.search).get("page") || 1;

// 데이터 표시 함수 호출
displayData(sampleData, parseInt(currentPage), itemsPerPage);

// 1. 페이지 로드 시 URL에서 페이지 번호를 확인합니다
// 2. 페이지네이션 UI가 생성되어 화면에 표시됩니다
// 3. 현재 페이지에 해당하는 10개의 아이템이 리스트로 표시됩니다
// 4. 사용자가 페이지 번호를 클릭하면 해당 페이지의 데이터가 표시됩니다
