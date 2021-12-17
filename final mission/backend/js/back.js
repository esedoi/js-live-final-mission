
const discardAllBtn = document.querySelector(".discardAllBtn");
const pageOrderTable = document.querySelector(".orderPage-table");
const api_path = "esedoi";
const token = "spMq1L04INPjHxBhIX4jlA32For1"
let orderListData =[]; 



getOrderList();

function renderCategoryChart(){
  let total={};
orderListData.forEach(function(item){
item.products.forEach(function(productItem){
  if(total[productItem.category]== undefined){
    total[productItem.category] = productItem.price;
  }else{
    total[productItem.category] += productItem.price;
  };
})
})
console.log(total);
let categoryAry = Object.keys(total);
let newData = [];
categoryAry.forEach(function(item){
  let ary=[];
  ary.push(item);
  ary.push(total[item]);
  newData.push(ary);
})

// C3.js
let chart = c3.generate({
  bindto: '#categoryChart', // HTML 元素綁定
  data: {
      type: "pie",
      columns: newData,
      colors:{
          "Louvre 雙人床架":"#DACBFF",
          "Antony 雙人床架":"#9D7FEA",
          "Anty 雙人床架": "#5434A7",
          "其他": "#301E5F",
      }
  },
});
}

function renderItemChart(){
  let total={};
orderListData.forEach(function(item){
item.products.forEach(function(productItem){
  if(total[productItem.title]== undefined){
    total[productItem.title] = productItem.price;
  }else{
    total[productItem.title] += productItem.price;
  };
})
})
console.log(total);
let itemAry = Object.keys(total);
let newData = [];
itemAry.forEach(function(item){
  let ary=[];
  ary.push(item);
  ary.push(total[item]);
  newData.push(ary);
})

// C3.js
let chart = c3.generate({
  bindto: '#itemChart', // HTML 元素綁定
  data: {
      type: "pie",
      columns: newData,
      colors:{
          "Louvre 雙人床架":"#DACBFF",
          "Antony 雙人床架":"#9D7FEA",
          "Anty 雙人床架": "#5434A7",
          "其他": "#301E5F",
      }
  },
});
}








//取得訂單api
function getOrderList() {
  axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
    {
      headers: {
        'Authorization': token
      }
    })
    .then(function (response) {
      console.log(response.data);
      console.log("成功");
      orderListData = response.data.orders
      renderOrderList();
      renderCategoryChart();
      renderItemChart();
    })
}




//渲染訂單
function renderOrderList(){
  
  
  let str=`<thead>
  <tr>
      <th>訂單編號</th>
      <th>聯絡人</th>
      <th>聯絡地址</th>
      <th>電子郵件</th>
      <th>訂單品項</th>
      <th>訂單日期</th>
      <th>訂單狀態</th>
      <th>操作</th>
  </tr>
</thead>`;
  orderListData.forEach(function(item){
    let orderStatus = "";
    if(item.paid == true){
      orderStatus = "已處理";
    }else if(item.paid == false){
      orderStatus = "未處理";
    };
    let productStr = "";
    
    item.products.forEach(function(item){
  productStr += `<p>${item.title} x ${item.quantity}</p>`;
})
    str+= `<tr>
    <td>${item.id}</td>
    <td>
      <p>${item.user.name}</p>
      <p>${item.user.tel}</p>
    </td>
    <td>${item.user.address}</td>
    <td>${item.user.email}</td>
    <td>
      <p>${productStr}</p>
    </td>
    <td>${new Date(item.createdAt *1000).toLocaleDateString()}</td>
    <td class="orderStatus">
      <a href="#" class ="orderStatusA" data-id="${item.id}" data-status="${item.paid}">${orderStatus}</a>
    </td>
    <td>
      <input type="button" class="delSingleOrder-Btn" data-id="${item.id}" value="刪除">
    </td>
</tr>`;
  })
  pageOrderTable.innerHTML = str;

}

//監聽清空按鈕
discardAllBtn.addEventListener("click",function(e){
  deleteAllOrder();
})

//清空訂單
function deleteAllOrder() {
  axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
    {
      headers: {
        'Authorization': token
      }
    })
    .then(function (response) {
      console.log(response.data);
      alert('訂單已清空');
      getOrderList();

    })
}



//監聽刪除按鈕
pageOrderTable.addEventListener("click",function(e){
if(e.target.getAttribute("class")=="delSingleOrder-Btn"){
  console.log(e.target.dataset.id);
  let orderId = e.target.dataset.id;
  deleteOrderItem(orderId)
}

if(e.target.getAttribute("class")=="orderStatusA"){
  e.preventDefault();
  console.log(e.target.dataset.id);
  let orderId = e.target.dataset.id;
  let nowStatus = e.target.getAttribute("data-status");
  let newStatus ="";
  if(nowStatus == "false"){
    newStatus = true;
  } else{
    newStatus = false;
  }

  editOrderList(orderId, newStatus);
 
}

})

//修改訂單狀態
function editOrderList(orderId, newStatus) {
  axios.put(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
    {
      "data": {
        "id": orderId,
        "paid": newStatus
      }
    },
    {
      headers: {
        'Authorization': token
      }
    })
    .then(function (response) {
      console.log(response.data);
      getOrderList();
    })
}

//刪除訂單
function deleteOrderItem(orderId) {
  axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders/${orderId}`,
    {
      headers: {
        'Authorization': token
      }
    })
    .then(function (response) {
      alert("刪除成功");
      console.log(response.data);
      getOrderList();

    })
}

