function dataAdd_RateOf2Pro (data,pro1,pro2,newRatePro) {
  for(let i = 0, len = data.length; i < len; i++) {

    if(typeof data[i][pro1] !== 'number') {
      data[i][pro1] = +data[i][pro1];
    }
    if(typeof data[i][pro2] !== 'number') {
      data[i][pro2] = +data[i][pro2];
    }
    data[i][newRatePro] = data[i][pro1]/data[i][pro2];
    console.log(`data[${i}][${newRatePro}]:${data[i][newRatePro]}`);
    /*
    for(let prop in data[i]) {
      //console.log(`prop:${prop}`);
      if (prop === 'date') {
        data[i][prop] = dateManipu(data[i][prop]);
      } else {
        data[i][prop] = +(data[i][prop]);
        //console.log(`data[${i}][${prop}]:${data[i][prop]}`);
      }
    }
    */
  }
}

//还可以写添加其他新增属性的函数，如dataAdd_sumOfAllPros等

export {dataAdd_RateOf2Pro};