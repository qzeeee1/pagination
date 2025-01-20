// 페이지네이션 처리를 위한 함수
// pagination 컴포넌트 생성. 매개변수로 데이터 배열(data),
// 페이지당 표시할 항목 수를 받음(itemsPerPage)
const Pagination = ({ data, itemsPerPage }) => {
  // 페이지 번호가 유효한지 검사하는 함수
  const validatePageNumber = (page, total) => {
    // 문자열로 들어온 페이지 번호를 숫자로 변환
    const pageNum = Number(page);
    // 숫자가 아니거나 1보다 작으면 첫 페이지(1)를 반환
    if (isNaN(pageNum) || pageNum < 1) return 1;
    // 전체 페이지 수보다 큰 숫자가 들어오면 마지막 번호를 반환 (사용자가 url 수정한경우)
    // 정상적인 URL www.yoursite.com?page=50  // 정상 작동
    // 사용자가 URL을 직접 수정한 경우 www.yoursite.com?page=999 // 존재하지 않는 페이지 번호!
    // 만약 총 페이지가 100페이지면 100페이지 (total) 을 반환
    // 이건 마치 300층짜리 빌딩에서 엘리베이터로 999층을 누르면
    // 자동으로 최상층인 300층으로 가는 것과 비슷한 개념.
    if (pageNum > total) return total;
    // 그 외의 경우 입력받은 페이지 번호를 그대로 반환
    return pageNum;
  };

  // 전체 페이지 수 계산 (데이터 개수, 즉 게시글 수 / 페이지당 항목 수를 올림)
  // math.ceil : JavaScript의 내장 수학 함수로, 숫자를 올림하여 정수로 만드는 함수
  // Math.ceil(3.1) 결과: 4 / Math.ceil(5.9) 결과: 6
  // 필요성: 총 게시글이 55개이고, 한 페이지당 10개씩 보여준다면
  // const totalPages = Math.ceil(55 / 10);  // 5.5를 올림하여 6이 됨
  // Math.ceil을 사용하지 않았다면:
  // 55 / 10 = 5.5 -> 5페이지만 나오고 마지막 5개 게시글은 보여줄 수 없음
  // Math.ceil을 사용하면:
  // 55 / 10 = 5.5 -> 6페이지가 되어 마지막 5개 게시글도 보여줄 수 있음
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // 현재 url 의 쿼리 파라미터를 가져옴 (예: ?page = 2)
  // new URLSearchParams(window.location.search)는
  // JavaScript에서 URL의 쿼리 문자열을 다룰 때 사용하는 표준 문법
  const queryString = new URLSearchParams(window.location.search);

  // 요청된 페이지 번호가 유효한지 검증하는 메서드
  const currentPage = validatePageNumber(
    // .has() 은 정해진 메소드.
    // URL의 쿼리 파라미터를 확인하는 데 사용
    // 매개변수로 page 를 사용. 이름은 상관없음.
    // URL에 page 파라미터가 있으면
    queryString.has("page")
      ? // URL이 www.yoursite.com?page=3 인 경우 = true, / page 값을 숫자로 변환 (예: "3" -> 3)
        // URL이 www.yoursite.com 인 경우 (page 파라미터가 없음) = false
        parseInt(queryString.get("page"))
      : // parseInt() JavaScript에 내장 전역 함수
        // 문자열을 정수로 변환하는 함수
        // 변환할 수 없으면 NaN(Not a Number)을 반환
        // page 파라미터가 없으면 1을 사용
        // (url 에서 현재 페이지 번호를 가져오거나, 없으면 1페이지로 설정)
        1,
    // 전체 페이지 수도 함께 전달
    totalPages
  );

  // URL 업데이트 함수
  // 페이지 번호 클릭시 url 을 업데이트 하는 함수
  // 사용자가 페이지네이션의 버튼을 클릭했을 때 실행되는 함수

  // 실제 동작 순서:
  // 1) 사용자가 페이지 버튼 클릭 (예: 3페이지 버튼 클릭)
  // 2) updateURL(3) 함수 실행
  // 3) URL이 www.yoursite.com?page=3으로 변경
  // 4) 페이지가 새로고침되면서 3페이지의 내용이 표시됨
  const updateURL = (pageNumber) => {
    // 예시: 지금 2페이지에 있다가 사용자가 3페이지 버튼을 클릭한 경우
    // 1단계: 현재 url 을 가져옴 (현재 웹페이지의 전체 URL)
    // 예를 들어 현재 페이지가 www.yoursite.com?page=2 이라면
    // window.location.href : 이 값을 그대로 가져옴
    // 현재 URL을 가져와서 새로운 URL 객체 생성
    // window.location.href => js 의 표준 내장객체와 속성
    const url = new URL(window.location.href);

    // 2단계: URL의 페이지 번호를 새로운 번호로 변경
    // url.searchParams.set("page", 3);
    // -> URL이 www.yoursite.com?page=3 로 변경됨
    // (url 의 page 파라미터 값을 변경)
    // url.searchParams.set 이거 자체가 정해진 문법
    url.searchParams.set("page", pageNumber);

    // 3단계: 변경된 URL로 이동
    // 실제로 해당 URL로 페이지가 이동됨
    // tostring : 객체나 값을 문자열로 변환하는 표준 함수
    // URL 객체를 문자열로 변환하여 브라우저의 주소창에 설정할 수 있는 형태로 만듬.
    window.location.href = url.toString();

    // 실제 실행: button.addEventListener("click", () => updateURL(pageNumber));
  };

  // 4. 페이지 버튼 생성 함수
  const createNavigationButton = (text, pageNumber, isDisabled) => {
    // 버튼 엘리먼트 생성
    const button = document.createElement("button");
    // 버튼안에 들어갈 텍스트 설정 (페이지 번호 또는 <<, >>)
    button.innerText = text;
    // 버튼에 css 클래스 추가
    button.classList.add("page-btn");

    // 버튼의 활성화/비활성화 상태 설정.
    // disabled는 HTML 버튼의 기본 속성(attribute)
    // button.disabled = true; : 버튼 비활성화
    // button.disabled = false; : 버튼 활성화
    // 현재 페이지의 버튼은 비활성화
    // ex) button.disabled = (i === currentPage);  // true가 되어 클릭 불가능
    // 다른 페이지의 버튼은 활성화
    // ex) button.disabled = false;  // false가 되어 클릭 가능
    // 사용자에게 "이 버튼은 지금 클릭할 수 없어요"라고 알려주는 표준적인 방법

    // 버튼이 활성화 상태일 때만 클릭 이벤트 추가
    // 변경된 URL로 이동
    if (isDisabled) {
      button.disabled = true;
      button.classList.add("disabled");
    } else {
      button.addEventListener("click", () => updateURL(pageNumber));
    }
    if (pageNumber === currentPage) {
      button.classList.add("active");
    }
    return button;
  };

  // 페이지네이션 UI 전체를 생성하는 함수
  const createPagination = () => {
    const paginationContainer = document.createElement("div");
    paginationContainer.classList.add("pagination");

    // 첫 페이지 버튼
    paginationContainer.appendChild(
      createNavigationButton("<<", 1, currentPage === 1)
    );

    // 페이지 번호 버튼
    // 화면에 표시할 시작 페이지와 끝 페이지 계산
    // 화면에 표시할 페이지 번호의 범위를 계산하는 로직
    let startPage = Math.max(1, currentPage - 4); // 현재 페이지 기준 앞으로 4페이지

    // 시작 페이지부터 9페이지를 더 보여주되, 전체 페이지 수를 넘을 순 없다"는 의미
    let endPage = Math.min(totalPages, startPage + 9); // 시작페이지부터 9페이지

    // 마지막 페이지를 기준으로 9페이지를 빼서 시작 페이지를 다시 계산하되,
    // 1페이지보다 작아질 순 없다"는 의미
    startPage = Math.max(1, endPage - 9); // 끝페이지 기준으로 시작페이지 재조정

    // 각 페이지 번호 버튼 추가
    // 예: startPage가 1이고 endPage가 5일 때
    // createNavigationButton 함수는 3개의 매개변수를 받음:
    // (위에서 정의된 createNavigationButton 의 매개변수)
    // (text, pageNumber, isDisabled)
    // 1. text: 버튼에 표시될 텍스트 (i)
    // 2. pageNumber: 클릭시 이동할 페이지 번호 (i)
    // 3. isDisabled: 현재 페이지인지 여부 (i === currentPage)
    // 4. (i === currentPage) 는 버튼 비활성화를 위해..
    for (let i = startPage; i <= endPage; i++) {
      paginationContainer.appendChild(createNavigationButton(i, i, false));
    }

    // 예시 - 전체 20페이지에서 현재 7페이지일 때 (currentPage = 7 totalPages = 20)
    // 1단계: 시작 페이지 계산 -> startPage = Math.max(1, 7 - 4) = 3
    // 2단계: 끝 페이지 계산 -> endPage = Math.min(20, 3 + 9) = 12
    // 3단계: 시작 페이지 재조정 -> startPage = Math.max(1, 12 - 9) = 3

    // 결과: 3,4,5,6,7,8,9,10,11,12 이렇게 10개의 페이지 번호가 보임
    // 현재 페이지(7)를 중심으로 적절히 앞뒤 페이지들이 보이게 됨

    // 첫 페이지로 이동하는 버튼 추가
    // appendChild : HTML 요소에 자식 요소를 추가하는 JavaScript 메서드
    // 특정 요소 안에 다른 요소를 넣는 기능
    // 부모 요소는 "상자" appendChild는 "상자 안에 물건 넣기" 자식 요소는 "넣을 물건"
    // 페이지네이션 컨테이너에 버튼을 추가할 때
    // paginationContainer.appendChild( createNavigationButton("<<", 1, currentPage === 1) );
    // 이렇게 변환됨
    // : <div class="pagination">  <button class="page-btn"><<</button>  </div>
    paginationContainer.appendChild(
      createNavigationButton(">>", totalPages, currentPage === totalPages)
    );

    // text(<<), pageNumber(1), isDisabled은
    // 위에서 정의된 createNavigationButton 의 매개변수
    // (text, pageNumber, isDisabled)
    // currentPage === 1은 "현재 페이지가 1페이지인지 확인하는 조건"
    // << 버튼은 관례적으로 1페이지를 의미하므로.
    // 현재 페이지가 1페이지면 true
    // 현재 페이지가 1페이지가 아니면 false
    // 페이지가 1페이지일 때: currentPage === 1은 true
    // 첫 페이지로 이동하는 버튼이 비활성화됨 (더 이상 이전 페이지로 갈 수 없음)
    // 페이지가 3페이지일 때: currentPage === 1은 false
    // 첫 페이지로 이동하는 버튼이 활성화됨 (이전 페이지로 이동 가능)

    return paginationContainer;
  };
  // createPagination 함수를 외부에서 사용할 수 있도록 반환
  return { createPagination, currentPage };
};

// 전체 데이터에서 현재 페이지에 해당하는 부분만 잘라서 화면에 보여주는 함수
// data: 전체 데이터 배열
// currentPage: 현재 페이지 번호
// itemsPerPage: 한 페이지당 표시할 항목 수, 여기선 10개.
// 전달받은 데이터를 현재 페이지와 페이지당 아이템 수에 맞게 슬라이싱하여 화면에 표시
// startIndex와 endIndex를 계산하여 현재 페이지에 보여줄 데이터 범위를 결정
const displayData = (data, currentPage, itemsPerPage) => {
  // 현재 페이지에 표시할 데이터의 시작 인덱스 계산
  // 예: 1페이지 -> (1-1) * 10 = 0번 인덱스부터
  //     2페이지 -> (2-1) * 10 = 10번 인덱스부터
  const startIndex = (currentPage - 1) * itemsPerPage;
  // 현재 페이지의 마지막 항목 인덱스 계산
  // 예: 1페이지 -> 0 + 10 = 10번 인덱스까지
  const endIndex = startIndex + itemsPerPage;
  // HTML에서 데이터를 표시할 리스트 요소 가져오기
  const contentList = document.getElementById("contentList");

  // 기존 리스트 내용 모두 삭제
  // 페이지를 이동할 때마다 새로운 데이터를 보여주기 위해
  // 예를들어, 1페이지에 10개 항목 표시 -> 사용자가 2페이지로 이동
  // innerHTML = "" 없으면: 1페이지 항목 + 2페이지 항목 모두 표시
  // innerHTML = "" 있으면: 2페이지 항목만 깔끔하게 표시
  // 이전 페이지의 데이터가 계속 누적되는 것을 방지
  contentList.innerHTML = "";

  // 각 직원 정보를 포함하는 div 요소를 동적으로 생성
  // 각 데이터는 이름, 직책, 이메일, 전화번호를 포함
  data.slice(startIndex, endIndex).forEach((item, index) => {
    // 각 항목에 대해 리스트 아이템(div) 생성
    const employeeRow = document.createElement("div");
    employeeRow.classList.add("employee-row");

    employeeRow.innerHTML = `
      <span class="employee-no">${startIndex + index + 1}</span>
      <img src="/assets/profile-placeholder.png" alt="프로필" class="profile-img">
      <span class="employee-name">${item.name}</span>
      <span class="employee-position">${item.position}</span>
      <span class="employee-email">${item.email}</span>
      <span class="employee-phone">${item.phone}</span>
    `;

    contentList.appendChild(employeeRow);
  });
};

// CSS 스타일 추가
const style = document.createElement("style");
style.textContent = `
  .employee-row {
    display: flex;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #eee;
    gap: 20px;
  }
  .employee-no { width: 50px; }
  .profile-img { 
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
  .employee-name { width: 150px; }
  .employee-position { width: 150px; }
  .employee-email { width: 250px; }
  .employee-phone { width: 250px; }
  .pagination {
    display: flex;
    justify-content: center;
    gap: 5px;
    margin-top: 20px;
  }
  .page-btn {
    padding: 5px 10px;
    border: 1px solid #ddd;
    background: white;
    cursor: pointer;
  }
  .page-btn.active {
    background: #007bff;
    color: white;
    border-color: #007bff;
  }
  .page-btn.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
document.head.appendChild(style);

// 샘플 데이터 생성, length 에 원하는 숫자 입력. 현재 200개의 리스트
// { length: 200 }: 길이가 200인 유사 배열 객체를 생성
// Array.from()의 첫 번째 매개변수로 사용
// (_, i) => 아이템 ${i + 1}, 매핑 함수(mapping function)
// _: 현재 요소 (사용하지 않을 때는 관례적으로 _로 표시)
// i: 인덱스 (0부터 시작), 각 요소를 "아이템 1", "아이템 2" 등으로 변환
// 샘플 데이터 생성 및 초기 렌더링
const sampleData = Array.from({ length: 200 }, (_, i) => ({
  name: `김철수${i + 1}`,
  position: "원장",
  email: "ironman@naver.com",
  phone: "010-9999-2222",
}));

// 한 페이지당 보여지는 아이템 수도 조절. 현재 10개의 리스트
const itemsPerPage = 10;

// 페이지네이션 컴포넌트 초기화
// 1. 먼저 Pagination 함수를 호출하면서 필요한 데이터를 전달
// 위에서 이미 정의됨 const Pagination = ({ data, itemsPerPage })
// pagination 컴포넌트 생성. 매개변수로 데이터 배열(data),
// 페이지당 표시할 항목 수를 받음(itemsPerPage)
const pagination = Pagination({
  data: sampleData, // 전체 데이터 (예: 게시글 목록)
  itemsPerPage: itemsPerPage, // 한 페이지당 보여줄 개수
});

// 페이지네이션 UI를 HTML에 추가
// 1단계: pagination.createPagination() 실행
// -> 페이지네이션 UI 전체를 생성하는 함수 위에서 이미 정의됨.
// -> 이 함수가 페이지 버튼들(<< 1 2 3 4 5 >>)을 만듦
const paginationElement = pagination.createPagination();

// 2단계: HTML에서 "paginationArea"라는 id를 가진 요소를 찾음
// 3단계: 찾은 요소 안에 만든 페이지 버튼들을 추가 (appendchild)
// 페이지 버튼들을 만들고 (createPagination)
// 이 버튼들을 넣을 상자를 찾아서 (getElementById)
// 상자 안에 버튼들을 넣는 것 (appendChild)
document.getElementById("paginationArea").appendChild(paginationElement);

// 데이터 표시
// sampleData: 전체 데이터 배열
// pagination.currentPage: 현재 페이지 번호를 숫자로 변환
// itemsPerPage: 한 페이지당 표시할 개수
displayData(sampleData, pagination.currentPage, itemsPerPage);
