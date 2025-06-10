/**
 * 项目相关的工具方法
 * 用于处理项目数据的计算和格式化
 */

export default {
  /**
   * 计算入驻面积：所有入驻企业面积的总和
   * @param {Array} companies - 入驻企业数组
   * @returns {Number} 入驻面积总和
   */
  getOccupiedArea(companies) {
    if (!companies || companies.length === 0) {
      return 0;
    }
    return companies.reduce((total, company) => {
      return total + (Number(company.area) || 0);
    }, 0);
  },

  /**
   * 计算可租面积：所有招租详情中空置面积的总和
   * @param {Array} rentalDetails - 招租详情数组
   * @returns {Number} 可租面积总和
   */
  getVacantArea(rentalDetails) {
    if (!rentalDetails || rentalDetails.length === 0) {
      return 0;
    }
    return rentalDetails.reduce((total, rental) => {
      return total + (Number(rental.vacantArea) || 0);
    }, 0);
  },

  /**
   * 计算总招租面积：通过入驻面积+可租面积计算
   * @param {Object} projectData - 项目数据
   * @returns {Number} 总招租面积
   */
  getTotalLeasingArea(projectData) {
    // 通过入驻面积+可租面积计算总招租面积
    const occupiedArea = this.getOccupiedArea(projectData.companies);
    const vacantArea = this.getVacantArea(projectData.rentalDetails);
    return occupiedArea + vacantArea;
  },

  /**
   * 计算空置率：可租面积 / (入驻面积 + 可租面积) * 100
   * @param {Array} companies - 入驻企业数组
   * @param {Array} rentalDetails - 招租详情数组
   * @returns {String} 空置率百分比（保留1位小数）
   */
  getVacancyRate(companies, rentalDetails) {
    const occupiedArea = this.getOccupiedArea(companies);
    const vacantArea = this.getVacantArea(rentalDetails);
    const totalArea = occupiedArea + vacantArea;
    
    if (totalArea === 0) return '0.0';
    const rate = (vacantArea / totalArea * 100).toFixed(1);
    return rate;
  }
} 