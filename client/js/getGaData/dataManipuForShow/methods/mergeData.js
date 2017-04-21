function mergeData(allData, mergedField) {
  /**
   * @example:  
     const mergedResult = mergeData(
      [
        dataForClickFromRecommends,
        dataForClickFromRelatives,
        dataForInviewFromRecommends,
        dataForInviewFromRelatives
      ],
      'date'
    ); 
    * @param alldata: Type Array
    * @param mergedField: Type String
  */

 
  if(allData.length < 2) {
    return allData;
  }
  const dataAsBase = allData[0];
  for(let i = 1, len = allData.length; i < len; i++) {
    const dataToMerge = allData[i];
    if(dataToMerge.length !== dataAsBase.length) {
      return dataAsBase;
    }
    for(const elemOfDataAsBase of dataAsBase) {
      const valueOfMergedField = elemOfDataAsBase[mergedField];
      for(const elemOfDataToMerge of dataToMerge) {
        if(elemOfDataToMerge[mergedField] === valueOfMergedField) {
          for(const prop in elemOfDataToMerge) {
            if(prop !== mergedField) {
              elemOfDataAsBase[prop] = elemOfDataToMerge[prop];
            }
          }
        }
      }
    }
  }
  return dataAsBase;
}

export default mergeData;