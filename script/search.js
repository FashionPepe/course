
const markers = []
const apiUrl = '../php/api.php'; // URL PHP API
    let districts = [], areas = [], streets = [], types = [];

    // Загрузка данных для административных округов
    async function loadDistricts() {
      if (districts.length === 0) {
        const response = await fetch(`${apiUrl}?type=districts`);
        districts = await response.json();
      }
      populateDatalist('districts-list', districts);
      document.getElementById('areas').disabled = false;  // Активируем поле для выбора района
    }

    // Загрузка районов
    async function loadAreas() {
      const districtName = document.getElementById('districts').value;
      const district = districts.find(d => d.name === districtName);
      if (!district) return;

      // Если районы еще не загружены для выбранного округа
      if (!areas[district.id]) {
        const response = await fetch(`${apiUrl}?type=areas&admin_id=${district.id}`);
        areas[district.id] = await response.json();
      }
      populateDatalist('areas-list', areas[district.id]);
      document.getElementById('streets').disabled = false; // Активируем поле для выбора улицы
    }

    // Загрузка улиц
    async function loadStreets() {
      const areaName = document.getElementById('areas').value;
      const districtName = document.getElementById('districts').value;
      const district = districts.find(d => d.name === districtName);
      const area = areas[district.id]?.find(a => a.name === areaName);

      if (!area) return;

      // Если улицы еще не загружены для выбранного района
      if (!streets[area.id]) {
        const response = await fetch(`${apiUrl}?type=streets&area_id=${area.id}`);
        streets[area.id] = await response.json();
      }
      populateDatalist('streets-list', streets[area.id]);
      document.getElementById('types').disabled = false; // Активируем поле для выбора типа знака
    }

    // Загрузка типов знаков
    async function loadTypes() {
      if (types.length === 0) {
        const response = await fetch(`${apiUrl}?type=types`);
        types = await response.json();
      }
      populateDatalist('types-list', types);
    }

    // Функция для заполнения datalist
    function populateDatalist(datalistId, data) {
      const datalist = document.getElementById(datalistId);
      datalist.innerHTML = ''; // Очистка предыдущих данных
      data.forEach(item => {
        const option = document.createElement('option');
        option.value = item.name;  // Заполняем значением имени
        datalist.appendChild(option);
      });
    }

    // Поиск знаков
    async function searchSigns() {
      
      const streetName = document.getElementById('streets').value;
      const typeName = document.getElementById('types').value;
      const date = document.getElementById('date').value;
  
      if (!streetName || !typeName || !date) {
          alert('Пожалуйста, заполните все поля для поиска.');
          return;
      }
  
      // Найти ID улицы и типа знака по имени
      const street = streets.flat().find(st => st.name === streetName);
      const type = types.find(t => t.name === typeName);
  
      if (!street || !type) {
          alert('Выбранные значения некорректны.');
          return;
      }
  
      const response = await fetch(
          `${apiUrl}?type=search&street_id=${street.id}&type_id=${type.id}&date=${encodeURIComponent(date)}`
      );
      const signs = await response.json();
  
      const results = document.getElementById('results');
      results.style.display = 'block'
      results.innerHTML = '';
  
      if (signs.length === 0) {
          results.textContent = 'Знаки не найдены.';
          return;
      }
      markers.forEach(marker => {map.removeChild(marker)})
      markers.length = 0
       
      
      signs.forEach(sign => {
          const div = document.createElement('div');
          let data = `ID: ${sign.id},<br> Координаты: (${sign.latitude},<br> ${sign.longitude}),<br> Тип: ${sign.type_name},<br> Дата актуальности: ${sign.date}`
          div.textContent = `ID: ${sign.id}, Координаты: (${sign.latitude}, ${sign.longitude}), Тип: ${sign.type_name}`;
          results.appendChild(div);
          createMarker([sign.longitude, sign.latitude], data, sign.id)
      });
  }
  async function addToFavorites(id_user, id_sign) {
    
    if(localStorage.getItem('user') == null){
      alert("Зарегистрируйтесь или войдите, чтобы добавлять знаки в избранное")
    }else{
    
    const response = await fetch(
      `${apiUrl}?type=getFavorites&idUser=${id_user}`
  );
    const res = await response.json()
    console.log(res)
    let flag = false
    res.forEach(fav => {if(fav.id_sign == id_sign){flag = true}})
    if(flag == false){
      const add = await fetch(
      `${apiUrl}?type=addToFavorites&idUser=${id_user}&idSign=${id_sign}`
  );
    const resAdd = await add.json()
    console.log(resAdd)
    let addb = document.getElementById('add-btn');
      let del = document.getElementById('del-btn');
      
      del.style.display = 'block'
      addb.style.display = 'none'
}
  }
    
  }
  async function deleteFromFavorites(id_user, id_sign) {
    const response = await fetch(
      `${apiUrl}?type=getFavorites&idUser=${id_user}`
  );
    const res = await response.json()
    console.log(res)
    let flag = false
    res.forEach(fav => {if(fav.id_sign == id_sign){flag = true}})
    if(flag == true){
      const add = await fetch(
        `${apiUrl}?type=deleteToFavorites&idUser=${id_user}&idSign=${id_sign}`
    );
      const resAdd = await add.json()
      console.log(resAdd)
      let addb = document.getElementById('add-btn');
      let del = document.getElementById('del-btn');
      
      del.style.display = 'none'
      addb.style.display = 'block'

    }
  }
  
  async function initActButtons(id_user, id_sign){
    let add = document.getElementById('add-btn');
    let del = document.getElementById('del-btn');
    const response = await fetch(
      `${apiUrl}?type=getFavorites&idUser=${id_user}`
  );
    const res = await response.json()
    console.log(res)
    let flag = false
    res.forEach(fav => {if(fav.id_sign == id_sign){flag = true}})
    if(flag == true){
      del.style.display = 'block'
      add.style.display = 'none'
    }else{
      del.style.display = 'none'
      add.style.display = 'block'
    }



  }
    // Инициализация
    loadDistricts();