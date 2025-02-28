async function placeFav() {
    const response = await fetch(
        `${apiUrl}?type=getFavoritesFull&idUser=${localStorage.getItem('id_user')}`
    );
      const res = await response.json()
      console.log(res)
      const results = document.getElementById('results');
      res.forEach(sign => {
        const div = document.createElement('div');
        let data = `ID: ${sign.id},<br> Координаты: (${sign.latitude},<br> ${sign.longitude}),<br> Тип: ${sign.type_name},<br> Дата актуальности: ${sign.date}`
        div.textContent = `ID: ${sign.id}, Координаты: (${sign.latitude}, ${sign.longitude}), Тип: ${sign.type_name}`;
        results.appendChild(div);
        createMarker([sign.longitude, sign.latitude], data, sign.id)
    });
    results.style.display = 'block'
      
}
placeFav()