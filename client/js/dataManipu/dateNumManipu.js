function dateNumManipu(data,dateManipu) {
  /**
   * @param:data, type JSON String, Eg:gaData其中有一个字段为date要转换为日期，其他字段要转换为数字
   * @param:dateManipu:type Func, timeparse func, Eg:dateParse1,which is from timeManipu.js
   */

  for(let i = 0, len = data.length; i < len; i++) {
    for(let prop in data[i]) {
      //console.log(`prop:${prop}`);
      if (prop === 'date') {
        data[i][prop] = dateManipu(data[i][prop]);
      } else {
        data[i][prop] = +(data[i][prop]);
        //console.log(`data[${i}][${prop}]:${data[i][prop]}`);
      }
    }
  }
}

export default dateNumManipu;