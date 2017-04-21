function pickupOneReportData(response,indexOfReports, dateIndexOfDimensions, dateName, statisticIndexOfMetrics,statisticName) {
  /**
   * @dest: Deal with the rawData
   * @param reponse:Type Obj,the response of gapi request
   * @param indexOfReports: Type Number, the index of reports of response
   * @param dateIndexOfDimensions: Type Number, the location of the value of date,Eg:2, used like :curRawDatum.dimensions[2]
   * @param dateName: Type String, the name of the date field,Eg:'date'
   * @param statisticIndexOfMetrics: Type Number, the location of the value of the statistic,Eg：0,used as: curRawDatum.metrics[0].values[0]
   * @param statisticName:Type Stirng, the name  of the statistic field, Eg：'clickFromRecommends'
   */
  const rawData = response.result.reports[indexOfReports].data.rows;
  const dealedData = [];
  for (let i = 0,l = rawData.length; i < l; i++) { 
    const rawDatum = rawData[i]
    const dealedDatum = {};
    const dateValue = rawDatum.dimensions[dateIndexOfDimensions];
    const statisticValue = rawDatum.metrics[statisticIndexOfMetrics].values[0];
    dealedDatum[dateName] = dateValue;
    dealedDatum[statisticName] = statisticValue;
    dealedData.push(dealedDatum);
  }
  return dealedData;
}

export default pickupOneReportData;