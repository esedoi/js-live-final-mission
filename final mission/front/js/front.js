const productList = document.querySelector(".productWrap");
const cartList = document.querySelector(".shoppingCart-table");
const orderInfoForm = document.querySelector(".orderInfo-form");
const inputs = document.querySelectorAll("input[type=text],input[type=tel],input[type=email], select[id=tradeWay]");
const orderInfoBtn = document.querySelector(".orderInfo-btn");
const productSelect = document.querySelector(".productSelect");

const api_path = "esedoi";

let productListData =[];
let cartListData = [];

//初始化
function init(){
    getProductList();
    getCartList();
}

init();

//取得產品api列表
function getProductList() {
    axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/products`).
      then(function (response) {
        // console.log(response.data);
        productListData = response.data.products;
        renderProductList(productListData);
        renderCategory();
        
      })
      .catch(function(error){
        console.log(error.response.data)
      })
  }

//渲染產品清單
function renderProductList(product){
    let str="";
    product.forEach(function(item){
        str+=`<li class="productCard">
        <h4 class="productType">新品</h4>
        <img src="${item.images}" alt="">
        <a href="#" class="addCardBtn" data-id="${item.id}">加入購物車</a>
        <h3>${item.title}</h3>
        <del class="originPrice">NT$${item.origin_price}</del>
        <p class="nowPrice">NT$${item.price}</p>
    </li>`;
//如何讓數字有逗號格式？
    })
    productList.innerHTML = str;

}

//渲染種類清單
function renderCategory(){
    let unsort = productListData.map(function(item){
        return item.category;
    });
    // console.log(unsort);
    let sorted = unsort.filter(function(item,index){
        return unsort.indexOf(item) == index;
    })
    // console.log(sorted);
    let str=`<option value="全部" selected>全部</option>`;
    sorted.forEach(function(item){
        str+= `<option value="${item}">${item}</option> `

    })
    
    
    productSelect.innerHTML = str;
}

//篩選種類
productSelect.addEventListener("change",function(e){
    
    let selectData = productListData.filter(function(item){
        if(e.target.value===item.category){
            return item;
        }

        if(e.target.value === "全部"){
            return item;
        }
    })
    
    renderProductList(selectData);
})

//取得購物車api清單
  function getCartList() {
    axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`).
      then(function (response) {
        // console.log(response.data);
        cartListData = response.data.carts;
        let finalTotal = response.data.finalTotal;
        renderCartList(finalTotal);

      })
  }

  //渲染購物車清單
  function renderCartList(finalTotal){
    let tr1=`<tr>
      <th width="40%">品項</th>
      <th width="15%">單價</th>
      <th width="15%">數量</th>
      <th width="15%">金額</th>
      <th width="15%"></th>
                </tr>`;
    let tr2 ="";
    let tr3 =`<tr>
  <td>
      <a href="#" class="discardAllBtn">刪除所有品項</a>
  </td>
  <td></td>
  <td></td>
  <td>
      <p>總金額</p>
  </td>
  <td>NT$${finalTotal}</td>
                </tr>`
      cartListData.forEach(function(item){
        tr2 +=
            `<tr>
            <td >
                <div class="cardItem-title">
                    <img src="${item.product.images}" alt="">
                    <p>${item.product.title}</p>
                </div>
            </td>
            <td>NT$${item.product.price}</td>
            <td>1</td>
            <td>NT$${item.product.price}</td>
            <td class="discardBtn">
                <a href="#" class="material-icons" data-id="${item.id}">
                    clear
                </a>
            </td>
        </tr>`   
    ;
      })
      cartList.innerHTML = tr1+tr2+tr3;

  }

  //加入購物車
  //監聽產品列表
  productList.addEventListener("click",function(e){
    //   console.log(e.target);
    e.preventDefault();
      if(e.target.getAttribute("class")!=="addCardBtn"){
          console.log("沒點到按鈕");
          return;
      }
      console.log(e.target.getAttribute("data-id"));
      id = e.target.getAttribute("data-id")
      addCartItem(id);

  })
  //加入購物車api
  function addCartItem(id) {
    axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`, {
      data: {
        "productId": id,
        "quantity": 1
      }
    }).
      then(function (response) {
        // console.log(response.data);
        alert("加入購物車成功");
        getCartList();
      })
  
  }

  //監聽購物車列表
  cartList.addEventListener("click",function(e){
      //清空購物車
      if(e.target.getAttribute("class")=="discardAllBtn"){
          
          e.preventDefault();
          deleteAllCartList()  
      };
      //刪除購物車品項
      if(e.target.getAttribute("class")=="material-icons"){
          e.preventDefault();
          let cartId = e.target.dataset.id
          deleteCartItem(cartId);

      }
      

  })
  //清空購物車
  function deleteAllCartList() {
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`).
      then(function (response) {
        // console.log(response.data);
        alert("購物車已清空");
        getCartList()

      })
  }

  //刪除個別清單
  function deleteCartItem(cartId) {
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts/${cartId}`).
      then(function (response) {
        // console.log(response.data);
        alert("刪除成功");
        getCartList();
      })
  }


//表單驗證
let constraints = {
    姓名:{
      presence:{
        message:"必填"
      }
    },
    電話:{
      presence:{
        message:"必填"
      },
      numericality:{
        onlyInterger:true,
        message:"格式不正確"
      },
      length:{
        is:10,
        message:"格式不正確"
      }
    },
    Email:{
      presence:{
        message:"必填"
      },
      email:{
        message:"請填寫正確 email 格式"
      }
    },
    寄送地址:{
      presence:{
        message:"必填"
      }
    },
    交易方式:{
      presence:{
        message:"必填"
      }
    } 
    
  };

  inputs.forEach(function(item, errors){
   
    item.addEventListener("change",function(e){

        let errors = validate(orderInfoForm, constraints);
  console.log(errors);
      if(errors){
        document.querySelector(`[data-message=${item.name}]`).textContent = errors[item.name];   
      }
     
    })
  
    
  })


  //送出訂單
  orderInfoBtn.addEventListener("click",function(e){
    e.preventDefault();


    //檢查購物車內是否有商品
    if(cartListData.length ==0){
        
        alert("請加入商品至購物車");
        return;
    }
    //檢查是否表單有空白
    if(inputs[0].value==""||inputs[1].value==""||inputs[2].value==""||inputs[3].value==""||inputs[4].value==""){
        
        alert("訂單資訊未完成");
        return;
    }

    //檢查errors是否有值
    let errors = validate(orderInfoForm, constraints);
    console.log(errors);
        if(errors){
            
            // inputs.forEach(function(item){
            //     document.querySelector(`[data-message=${item.name}]`).textContent = errors[item.name];   
            // })
            alert("訂單欄位格式不正確");
            return;   
        }
   
    

      let user = {};
      user.name = inputs[0].value;
      user.tel = inputs[1].value;
      user.email = inputs[2].value;
      user.address = inputs[3].value;
      user.payment = inputs[4].value;
      createOrder(user);
          })

  //送出訂單api
  function createOrder(user) {

    axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/orders`,
      {
        "data": {
          "user": user
        }
      }
    ).
      then(function (response) {
        console.log(response.data);
        console.log("成功");
        alert("送出訂單成功");
        getCartList();
        orderInfoForm.reset();

      })
      .catch(function(error){
        console.log(error.response.data);
      })
  }






  