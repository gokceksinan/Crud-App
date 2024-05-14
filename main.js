//*Duzenleme Seçenekleri
let editFlag = false; //*Düzenleme modunda olup olmadığını belirtir.
let editElement; //* Düzenleme yapılan öğeyi temsil eder.
let editID = ""; //* Düzenleme yapılan öğenin benzersiz kimliği.

//* Gerekli HTML elementlerini seçme
const form = document.querySelector(".grocery-form");
const grocery = document.getElementById("grocery");
const list = document.querySelector(".grocery-list");
const alert = document.querySelector(".alert");
const submitBtn = document.querySelector(".submit-btn");
const clearBtn = document.querySelector(".clear-btn");

//!Fonksiyonlar
//*Ekrana bilgi bastıracak fonksiyondur
const displayAlert = (text, action) => {
  alert.textContent = text; //* alert classla etiketin içerisini dışarıdan gönderilen parametre ile değiştirdik.
  alert.classList.add(`alert-${action}`); //* p etiketine dinamik class ekledik.

  setTimeout(() => {
    alert.textContent = ""; //* p etiketinin içerisini boş stringe çevirdik
    alert.classList.remove(`alert-${action}`); //*eklediğimiz classı kaldırdık
  }, 2000);
};
//*Varsayılan değerlere dönderir.
const setBackToDefault = () => {
  grocery.value = "";
  editFlag = false;
  editID = "";
  submitBtn.textContent = "Ekle";
};

const addItem = (e) => {
  e.preventDefault(); //* Formun gönderilme olayında Sayfanın yenilenmesini engeller
  const value = grocery.value; //* Inputun içerisine girilen değeri aldık.
  const id = new Date().getTime().toString(); //*Benzersiz bir id oluşturduk

  //* eger inputun içerisi boş değilse ve düzenleme modunda değilse
  if (value !== "" && !editFlag) {
    const element = document.createElement("article"); //* yeni bir "article" öğesi oluştur
    let attr = document.createAttribute("data-id"); //* yeni bir veri kimliği oluştur.
    attr.value = id;
    element.setAttributeNode(attr); //*oluşturduğumuz id'yi data özellik olarak set ettik.
    element.classList.add("grocery-item"); //*article etiketine class ekledik
    element.innerHTML = `   
    <p class="title">${value}</p>
    <div class="btn-container">
        <button type="button" class="edit-btn">
            <i class="fa-solid fa-pen-to-square"></i>
        </button>
        <button type="button" class="delete-btn">
            <i class="fa-solid fa-trash"></i>
        </button>
    </div>
    `;
    //*Oluşturduğumuz bu butonlara olay izleyicileri ekleyebilmemiz için seçtik
    const deleteBtn = element.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", deleteItem);
    const editBtn = element.querySelector(".edit-btn");
    editBtn.addEventListener("click", editItem);
    list.appendChild(element); //* Oluşturduğumuz "article" etiketini htmle ekledik
    displayAlert("Başarıyla Eklenildi", "success");

    //*Varsayılan değerlere dönderecek fonksiyon
    setBackToDefault();
    addToLocalStorage(id, value);

  } else if (value !== "" && editFlag) {
    editElement.innerHTML = value; //*Güncelleyeceğimiz elemanın içeriğini değiştirdik
    displayAlert("başarıyla Değiştirildi", "success");
    setBackToDefault();
  }
};

//*Silme butonuna tıklanıldığında çalışır.
const deleteItem = (e) => {
  const element = e.target.parentElement.parentElement.parentElement; //*Sileceğimiz etikete kapsayıcıları yardımıyla ulaştık.
  console.log(element);
  list.removeChild(element); //*bulduğumuz "article" etiketini list alanı içerisinden kaldırdık
  displayAlert("Başarıyla kaldırıldı", "danger"); //*ekrana gönderdiğimiz parametrelere göre bildirim bastırır.
};

const editItem = (e) => {
  const element = e.target.parentElement.parentElement.parentElement;
  editElement = e.target.parentElement.parentElement.previousElementSibling; //*Düzenleme yapacağımzı etiketi seçtik
  grocery.value = editElement.innerText; //*Düzenlediğmiz etiketin içeriğni inputa aktardık.
  editFlag = true;
  editID = element.dataset.id; //* Düzenlenen öğenin kimliğini gönderdik.
  submitBtn.textContent = "Düzenle"; //* Düzenle butonuna tıklanıldığında ekle butonu düzenleolarak değişsin.
};

const clearItems = () => {
  const items = document.querySelectorAll(".grocery-item");
  //* Listede article etiketi var mı
  if (items.length > 0) {
    items.forEach((item) => list.removeChild(item)); //*forEach ile dizi içerisnde bulunan her bir elemanı dönüp her bir öğeyi listeden kaldırdık
  }
  displayAlert("Liste Boş", "danger"); //*
};

const addToLocalStorage = (id, value) => {
  const grocery = { id, value };

  localStorage.setItem("list",JSON.stringify(grocery))
};

//!Olay izleyicileri

//*Form gönderildiğinde addItem fonksiyonu çalışır.
form.addEventListener("submit", addItem);
clearBtn.addEventListener("click", clearItems);
